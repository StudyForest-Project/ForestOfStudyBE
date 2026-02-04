import dayjs from 'dayjs';
import { DATE, STATS } from '#constants';
import { formatDate, getWeeklyDates } from './dateRange.utils.js';

/**
 * 포인트 통계 데이터
 */
export function processPointStats(
  weeklySessions,
  weekDates = getWeeklyDates(),
) {
  const todayDate = formatDate(dayjs.utc()); // 오늘

  // 날짜 별 표인트 계산
  const pointsByDate = weeklySessions.reduce((acc, session) => {
    const sessionDate = formatDate(session.createdAt); // 날짜 추출

    acc[sessionDate] =
      (acc[sessionDate] || STATS.ZERO_DEFAULT) +
      (session.earnedPoints || STATS.ZERO_DEFAULT);

    return acc;
  }, {});

  // 데이터 가공
  const { todayPoint, weeklyTotalPoint, weeklyPointChart } = weekDates.reduce(
    (acc, date, i) => {
      // 날짜 별 표인트 가져오기
      const dailyPointSum = pointsByDate[date] || STATS.ZERO_DEFAULT;

      // 일주일치 데이터
      acc.weeklyPointChart.push({
        day: DATE.WEEKDAYS[i],
        dailyTotalPoints: dailyPointSum,
      });

      // 일주일간 획득한 총 포인트
      acc.weeklyTotalPoint += dailyPointSum;

      // 오늘 날짜인 경우 오늘 포인트 기록
      if (date === todayDate) {
        acc.todayPoint = dailyPointSum;
      }

      return acc;
    },
    {
      todayPoint: STATS.ZERO_DEFAULT,
      weeklyTotalPoint: STATS.ZERO_DEFAULT,
      weeklyPointChart: [],
    },
  );

  return { todayPoint, weeklyTotalPoint, weeklyPointChart };
}

/**
 * 시간 통계 데이터
 */
export function processFocusStats(
  summary,
  weeklySessions,
  weekDates = getWeeklyDates(),
) {
  const todayDate = formatDate(dayjs.utc());

  // 날짜 별 총 집중 시간, 최장 집중 시간 계산
  const focusByDate = weeklySessions.reduce((acc, session) => {
    const sessionDate = formatDate(session.createdAt);
    const activeTime = session.activeTime || STATS.ZERO_DEFAULT;

    if (!acc[sessionDate]) {
      acc[sessionDate] = { sum: STATS.ZERO_DEFAULT, max: STATS.ZERO_DEFAULT };
    }

    acc[sessionDate].sum += activeTime;
    acc[sessionDate].max = Math.max(acc[sessionDate].max, activeTime);

    return acc;
  }, {});

  // 데이터 가공
  const {
    todayActiveTime,
    todayMaxActiveTime,
    weeklyTotalActiveTime,
    weeklyFocusChart,
  } = weekDates.reduce(
    (acc, date, i) => {
      // 날짜 별 데이터 가져오기
      const stats = focusByDate[date] || {
        sum: STATS.ZERO_DEFAULT,
        max: STATS.ZERO_DEFAULT,
      };

      const dailyActiveTimeSum = stats.sum;
      const dailyMaxActiveTime = stats.max;

      // 일주일치 데이터
      acc.weeklyFocusChart.push({
        day: DATE.WEEKDAYS[i],
        dailyTotalActiveTime: dailyActiveTimeSum,
        dailyMaxActiveTime: dailyMaxActiveTime,
      });

      // 일주일간 총 집중 시간
      acc.weeklyTotalActiveTime += dailyActiveTimeSum;

      // 오늘 날짜인 경우 오늘 집중 시간 + 최고 집중 시간 기록
      if (date === todayDate) {
        acc.todayActiveTime = dailyActiveTimeSum;
        acc.todayMaxActiveTime = dailyMaxActiveTime;
      }

      return acc;
    },
    {
      todayActiveTime: STATS.ZERO_DEFAULT,
      todayMaxActiveTime: STATS.ZERO_DEFAULT,
      weeklyTotalActiveTime: STATS.ZERO_DEFAULT,
      weeklyFocusChart: [],
    },
  );

  return {
    summary: {
      sessionCount: summary.sessionCount,
      sessionTotalActiveTime: summary.sessionTotalActiveTime,
      targetReachedCount: summary.targetReachedCount,
      perfectFocusCount: summary.perfectFocusCount,
    },
    today: {
      activeTime: todayActiveTime,
      maxActiveTime: todayMaxActiveTime,
    },
    weekly: {
      totalActiveTime: weeklyTotalActiveTime,
      weeklyFocusChart: weeklyFocusChart,
    },
  };
}
