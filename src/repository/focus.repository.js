import { prisma } from '#db/prisma.js';
import { ulid } from 'ulid';
import { calculatePoints } from '#utils/point.utils.js';
import { STATS, TIMER } from '#constants';
import { formatRecentTimeList } from '#utils/timer.utils.js';
import { getWeeklyDates, getKSTStartOfDay } from '#utils/dateRange.utils.js';

/**
 * 집중 페이지 진입 시 정보 조회
 */
async function findFocusInfoByStudyId(studyId) {
  const study = await prisma.study.findUnique({
    where: { id: studyId },
    select: {
      id: true,
      title: true,
      totalPoint: true,
    },
  });

  if (!study) {
    return null;
  }

  const recentTimeRecord = await prisma.focusSession.groupBy({
    by: ['targetTime'],
    where: { studyId },
    _max: { createdAt: true },
    orderBy: { _max: { createdAt: 'desc' } },
    take: TIMER.MAX_RECENT_TIME_LIST,
  });

  return {
    study,
    timeList: formatRecentTimeList(recentTimeRecord),
  };
}

/**
 * 집중 완료 데이터 저장
 */
async function saveFocusResult({ studyId, targetTime, activeTime, pauseUsed }) {
  // 분 단위 변환(초 단위 버림)
  const activeMinutes = Math.floor(activeTime / TIMER.SECONDS_PER_MINUTE);

  // 포인트 계산
  const earnedPoints = calculatePoints({
    targetTime,
    activeMinutes,
    pauseUsed,
  });

  return await prisma.$transaction(async (tx) => {
    const focusResult = await tx.focusSession.create({
      data: {
        id: ulid(),
        studyId,
        targetTime,
        activeTime: activeMinutes,
        pauseUsed,
        earnedPoints,
      },
    });

    const updatedStudy = await tx.study.update({
      where: { id: studyId },
      data: {
        totalPoint: {
          increment: earnedPoints,
        },
      },
    });

    return { focusResult, totalPoint: updatedStudy.totalPoint };
  });
}

/**
 * 포인트 통계
 */
async function getPointStatsData(studyId) {
  const weeklyDates = getWeeklyDates(); // 이번주 가져오기 (한국 시간 기준)
  const monday = getKSTStartOfDay(weeklyDates[0]); // 월요일 00:00:00 기준 (한국 시간)

  // 일주일 데이터
  const weeklySessions = await prisma.focusSession.findMany({
    where: {
      studyId,
      createdAt: { gte: monday }, // 월요일 이후 데이터만 가져오기
    },
    select: {
      earnedPoints: true,
      createdAt: true,
    },
  });

  return { weeklySessions, weeklyDates };
}

/**
 * 집중 통계
 */
async function getFocusStatsData(studyId) {
  const weeklyDates = getWeeklyDates(); // 한국 시간 기준
  const monday = getKSTStartOfDay(weeklyDates[0]); // 한국 시간 기준

  const totalData = await prisma.focusSession.aggregate({
    where: { studyId },
    _count: { id: true }, // 전체 세션 수
    _sum: { activeTime: true }, // 전체 실행 시간 합
  });

  // 설정 시간 완료
  const targetReachedCount = await prisma.focusSession.count({
    where: {
      studyId,
      activeTime: { gte: prisma.focusSession.fields.targetTime }, // 실행 시간 >= 설정 시간
    },
  });

  // 일시정지 없이 완료
  const perfectFocusCount = await prisma.focusSession.count({
    where: {
      studyId,
      activeTime: { gte: prisma.focusSession.fields.targetTime },
      pauseUsed: false,
    },
  });

  // 일주일 데이터
  const weeklySessions = await prisma.focusSession.findMany({
    where: {
      studyId,
      createdAt: { gte: monday },
    },
    select: {
      activeTime: true,
      targetTime: true,
      pauseUsed: true,
      createdAt: true,
    },
  });

  const summary = {
    sessionCount: totalData._count.id || STATS.ZERO_DEFAULT,
    sessionTotalActiveTime: totalData._sum.activeTime || STATS.ZERO_DEFAULT,
    targetReachedCount,
    perfectFocusCount,
  };

  return { summary, weeklySessions, weeklyDates };
}

export const focusRepository = {
  findFocusInfoByStudyId,
  saveFocusResult,
  getPointStatsData,
  getFocusStatsData,
};
