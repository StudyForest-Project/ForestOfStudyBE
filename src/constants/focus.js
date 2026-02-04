export const POINT = {
  MIN_REQUIRED_MINUTES: 30, // 최소 시간 제한
  CEILING_MULTIPLIER: 2, // 인정 시간 (설정 시간 * 2) 제한
  BASE_POINTS: 3, // 기본 포인트
  BONUS_UNIT_TIME: 10, // 10분 당 포인트 계산
  BONUS_POINTS_PER_UNIT: 1, // 추가 포인트
  ACHIEVEMENT_THRESHOLD: 0.8, // 달성률
};

export const TIMER = {
  SECONDS_PER_MINUTE: 60,
  MINUTES_PER_HOUR: 60,
  MAX_RECENT_TIME_LIST: 3,
};

export const DATE = {
  WEEKDAYS: ['월', '화', '수', '목', '금', '토', '일'],
  FORMAT: 'YYYY-MM-DD',
  DAYS_IN_WEEK: 7,
  START_OF_DAY: 0, // 일요일 판별용
  MONDAY_INDEX_OFFSET: 6, // 일요일(0)일 때 월요일로 가는 오프셋
  MONDAY_START_INDEX: 1, // 월요일 인덱스
};

export const STATS = {
  PERCENTAGE_MULTIPLIER: 100, // 백분율 계산용
  ZERO_DEFAULT: 0, // 기본값
};