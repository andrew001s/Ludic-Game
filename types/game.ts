export interface GameSave {
  playerId: string
  playerName: string
  currentLevel: number
  score: number
  currentStreak: number
  bestStreak: number
  completedLevels: number
  totalActivitiesCompleted: number
  perfectActivities: number
  progress?: number
  character?: string
  lastSavedAt?: number
}

export const SAVE_KEY = 'guardianes-save'
