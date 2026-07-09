import type { ActivityConfig } from '@/types/activity'
import type {
  ActivityCompletionMetrics,
  ActivityPerformance,
  ActivityScoreBreakdown,
  LevelScoreSummary,
  PlayerProgressSnapshot,
} from '@/types/progress'

const ACTIVITY_BASE_POINTS: Record<ActivityConfig['type'], number> = {
  'multiple-choice': 120,
  'drag-order': 150,
  'fill-blanks': 140,
  slider: 135,
  'boss-quiz': 260,
  'robot-path': 185,
  simulator: 175,
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

export function getParTimeMs(activity: ActivityConfig): number {
  switch (activity.type) {
    case 'multiple-choice':
      return 26_000
    case 'fill-blanks':
      return 38_000 + activity.blanks.length * 8_000
    case 'slider':
      return 32_000
    case 'drag-order':
      return 28_000 + activity.items.length * 7_000
    case 'robot-path':
      if (activity.mode === 'light-rotation') return 70_000
      if (activity.mode === 'magnetic-circuit') return 48_000
      return 42_000
    case 'simulator':
      return 58_000
    case 'boss-quiz':
      return activity.questions.length * activity.timePerQuestion * 1000
    default:
      return 40_000
  }
}

export function calculateActivityPerformance(
  activity: ActivityConfig,
  metrics: ActivityCompletionMetrics,
  progress: PlayerProgressSnapshot,
): ActivityPerformance {
  const parTimeMs = getParTimeMs(activity)
  const paceRatio = clamp(parTimeMs / Math.max(metrics.durationMs, parTimeMs * 0.45), 0.55, 1.85)
  const speedBonus = clamp(Math.round((paceRatio - 1) * 72), 0, 62)

  const resolvedAccuracyRatio = metrics.accuracyRatio ?? (metrics.mistakes === 0 ? 1 : 0.82)
  const accuracyBonus = clamp(
    Math.round(48 * resolvedAccuracyRatio - metrics.mistakes * 10 - metrics.hintsUsed * 4),
    0,
    48,
  )

  const streakBonus = clamp(progress.currentStreak * 9, 0, 90)
  const masteryBonus = metrics.mistakes === 0 && metrics.retries === 0 ? 42 : 0
  const recoveryBonus = clamp(26 - metrics.retries * 9, 0, 26)
  const base = ACTIVITY_BASE_POINTS[activity.type]

  const breakdown: ActivityScoreBreakdown = {
    base,
    speedBonus,
    accuracyBonus,
    streakBonus,
    masteryBonus,
    recoveryBonus,
  }

  const score = Object.values(breakdown).reduce((total, value) => total + value, 0)
  const perfect = metrics.mistakes === 0 && metrics.retries === 0
  const streakAfter = perfect ? progress.currentStreak + 1 : 0

  return {
    ...metrics,
    score,
    parTimeMs,
    perfect,
    streakAfter,
    breakdown,
  }
}

export function summarizeLevelScore(params: {
  levelId: string
  performances: ActivityPerformance[]
  previous: PlayerProgressSnapshot
}): LevelScoreSummary {
  const { levelId, performances, previous } = params
  const earnedFromActivities = performances.reduce((total, performance) => total + performance.score, 0)
  const perfectCount = performances.filter((performance) => performance.perfect).length
  const activityCount = performances.length
  const perfectChainBonus = perfectCount === activityCount && activityCount > 0 ? 125 : 0
  const levelBonus = 120 + activityCount * 22 + perfectCount * 12
  const earnedScore = earnedFromActivities + levelBonus + perfectChainBonus

  const currentStreak =
    performances.length > 0 ? performances[performances.length - 1].streakAfter : previous.currentStreak
  const bestStreak = Math.max(
    previous.bestStreak,
    ...performances.map((performance) => performance.streakAfter),
  )

  return {
    levelId,
    earnedScore,
    levelBonus,
    perfectChainBonus,
    activityCount,
    perfectCount,
    performances,
    score: previous.score + earnedScore,
    currentStreak,
    bestStreak,
    completedLevels: previous.completedLevels + 1,
    totalActivitiesCompleted: previous.totalActivitiesCompleted + activityCount,
    perfectActivities: previous.perfectActivities + perfectCount,
  }
}
