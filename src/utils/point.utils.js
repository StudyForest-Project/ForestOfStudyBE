const MIN_REQUIRED_MINUTES = 30; // 최소 시간 제한
const CEILING_MULTIPLIER = 2; // 인정 시간 (설정 시간 * 2) 제한
const BASE_POINTS = 3; // 기본 포인트
const BONUS_UNIT_TIME = 10; // 10분 당 포인트 계산
const BONUS_POINTS_PER_UNIT = 1; // 추가 포인트
const ACHIEVEMENT_THRESHOLD = 0.8; // 달성률

// 포인트 계산 함수
export function calculatePoints({ targetTime, activeMinutes, pauseUsed }) {
  // 최소 시간 미달 : 0 point
  if (activeMinutes < MIN_REQUIRED_MINUTES) {
    return 0;
  }

  // 목표 시간 미달 -> 달성률 미달 : 0 point / 달성률 초과 : 기본 점수
  if (activeMinutes < targetTime) {
    const achievementRate = activeMinutes / targetTime;
    return achievementRate >= ACHIEVEMENT_THRESHOLD
      ? BASE_POINTS
      : 0;
  }

  // 목표 시간 달성 + 일시정지 사용 : 기본 점수
  if (pauseUsed) {
    return BASE_POINTS;
  }

  // 목표 시간 완주 : 기본 점수 + 추가 점수 (추가 점수 상한)
  const effectiveMinutes = Math.min(
    activeMinutes,
    targetTime * CEILING_MULTIPLIER,
  );
  const bonusPoints =
    Math.floor(effectiveMinutes / BONUS_UNIT_TIME) *
    BONUS_POINTS_PER_UNIT;

  return BASE_POINTS + bonusPoints;
}
