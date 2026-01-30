import { prisma } from '#db/prisma.js';
import { ulid } from 'ulid';
import { calculatePoints } from '../utils/point.utils.js';
import { TIMER } from '#constants';
import { formatRecentTimeList } from '../utils/focus.utils.js';

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

export const focusRepository = {
  findFocusInfoByStudyId,
  saveFocusResult,
};
