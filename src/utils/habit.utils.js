import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);

/**
 * habits 배열을 habitWeek 형태로 변환
 */
export function transformHabitWeek(habits) {
  console.log(habits, '======================');
  // 1. 이번 주 월~일 날짜 배열 만들기 (UTC 기준)
  const today = dayjs.utc();
  const dayOfWeek = today.day(); // 0(일) ~ 6(토)
  const monday = today.subtract(dayOfWeek === 0 ? 6 : dayOfWeek - 1, 'day');

  const weekDates = Array.from({ length: 7 }, (_, i) =>
    monday.add(i, 'day').format('YYYY-MM-DD'),
  );
  console.log('weekDates:', weekDates);

  // 2. 각 habit의 logs를 checks 배열로 변환
  const rows = habits.map((habit) => {
    // logs의 날짜들을 Set으로 (UTC 기준으로 파싱)
    const logDates = new Set(
      habit.logs.map((log) => dayjs.utc(log.logDate).format('YYYY-MM-DD')),
    );
    console.log('logDates:', [...logDates]);

    // 월~일 각 날짜가 logs에 있는지 확인
    const checks = weekDates.map((date) => logDates.has(date));

    return {
      habitId: habit.id,
      title: habit.title,
      checks,
    };
  });

  return { rows };
}
