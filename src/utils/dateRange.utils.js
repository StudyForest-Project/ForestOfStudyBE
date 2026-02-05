import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import { DATE } from '#constants';

dayjs.extend(utc);
dayjs.extend(timezone);

const KST = 'Asia/Seoul';

export const formatDate = (date) => {
  return dayjs(date).tz(KST).format(DATE.FORMAT);
};

export const getWeeklyDates = () => {
  const today = dayjs().tz(KST);
  const dayOfWeek = today.day(); // 0(일) ~ 6(토)
  const monday = today.subtract(
    dayOfWeek === DATE.START_OF_DAY
      ? DATE.MONDAY_INDEX_OFFSET
      : dayOfWeek - DATE.MONDAY_START_INDEX,
    'day',
  );

  return Array.from({ length: DATE.DAYS_IN_WEEK }, (_, i) =>
    monday.add(i, 'day').format(DATE.FORMAT)
  );
};

// 한국 시간 기준 해당 날짜의 시작 시간(00:00:00)을 UTC Date로 변환
export const getKSTStartOfDay = (dateString) => {
  return dayjs.tz(dateString, KST).startOf('day').toDate();
};

// 한국 시간 기준 오늘 날짜 (YYYY-MM-DD)
export const getTodayKST = () => {
  return dayjs().tz(KST).format(DATE.FORMAT);
};
