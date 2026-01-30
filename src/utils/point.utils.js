import { POINT } from "#constants";

/**
 * 포인트 계산 함수
 */
export function calculatePoints({ targetTime, activeMinutes, pauseUsed }) {
  // 최소 시간 미달 : 0 point
  if (activeMinutes < POINT.MIN_REQUIRED_MINUTES) {
    return 0;
  }

  // 목표 시간 미달 -> 달성률 미달 : 0 point / 달성률 초과 : 기본 점수
  if (activeMinutes < targetTime) {
    const achievementRate = activeMinutes / targetTime;
    return achievementRate >= POINT.ACHIEVEMENT_THRESHOLD
      ? POINT.BASE_POINTS
      : 0;
  }

  // 목표 시간 달성 + 일시정지 사용 : 기본 점수
  if (pauseUsed) {
    return POINT.BASE_POINTS;
  }

  // 목표 시간 완주 : 기본 점수 + 추가 점수 (추가 점수 상한)
  const effectiveMinutes = Math.min(
    activeMinutes,
    targetTime * POINT.CEILING_MULTIPLIER,
  );
  const bonusPoints =
    Math.floor(effectiveMinutes / POINT.BONUS_UNIT_TIME) *
    POINT.BONUS_POINTS_PER_UNIT;

  return POINT.BASE_POINTS + bonusPoints;
}
