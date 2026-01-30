import { TIMER } from "#constants"

// 00:00 형태 잡기
const formatLabel = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / TIMER.MINUTES_PER_HOUR)
  const minutes = totalMinutes % TIMER.MINUTES_PER_HOUR;

  const formatedHours = String(hours).padStart(2, '0')
  const formatedMinutes = String(minutes).padStart(2, '0')

  return `${formatedHours}:${formatedMinutes}`
}

// timeList 만들기
export const formatRecentTimeList = (sessionData) => {
  if (!sessionData || sessionData.length === 0) {
    return [];
  }

  return sessionData.map((data) => ({
    minutes: data.targetTime,
    label: formatLabel(data.targetTime)
  }))
}