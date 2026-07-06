export interface GameSave {
  level: number
  progress: number
  character: string
  lastSavedAt: number
}

export const SAVE_KEY = 'guardianes-save'
