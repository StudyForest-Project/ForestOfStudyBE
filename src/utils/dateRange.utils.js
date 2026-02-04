import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import { DATE } from '#constants';

dayjs.extend(utc);

export const formatDate = (date) => {
  return dayjs.utc(date).format(DATE.FORMAT);
};

export const getWeeklyDates = () => {
  const today = dayjs.utc();
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
