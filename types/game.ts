export interface GameSave {
  playerId: string
  playerName: string
  currentLevel: number
  progress?: number
  character?: string
  lastSavedAt?: number
}

export const SAVE_KEY = 'guardianes-save'
