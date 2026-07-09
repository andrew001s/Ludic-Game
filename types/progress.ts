import type { ActivityType } from '@/types/activity'

export interface ActivityCompletionMetrics {
  activityId: string
  activityType: ActivityType
  durationMs: number
  mistakes: number
  retries: number
  hintsUsed: number
  interactions: number
  accuracyRatio?: number
  extraTimeRatio?: number
}

export interface ActivityScoreBreakdown {
  base: number
  speedBonus: number
  accuracyBonus: number
  streakBonus: number
  masteryBonus: number
  recoveryBonus: number
}

export interface ActivityPerformance extends ActivityCompletionMetrics {
  score: number
  parTimeMs: number
  perfect: boolean
  streakAfter: number
  breakdown: ActivityScoreBreakdown
}

export interface PlayerProgressSnapshot {
  score: number
  currentStreak: number
  bestStreak: number
  completedLevels: number
  totalActivitiesCompleted: number
  perfectActivities: number
}

export interface LevelScoreSummary extends PlayerProgressSnapshot {
  levelId: string
  earnedScore: number
  levelBonus: number
  perfectChainBonus: number
  activityCount: number
  perfectCount: number
  performances: ActivityPerformance[]
}
