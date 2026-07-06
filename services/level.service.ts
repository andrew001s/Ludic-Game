import type { LevelConfig } from '@/types/level'
import { level1 } from '@/levels/level-1'
import { level2 } from '@/levels/level-2'
import { level3 } from '@/levels/level-3'
import { level4 } from '@/levels/level-4'
import { level5 } from '@/levels/level-5'

const levels: Record<string, LevelConfig> = {
  'level-1': level1,
  'level-2': level2,
  'level-3': level3,
  'level-4': level4,
  'level-5': level5,
}

export function getLevelConfig(levelId: string): LevelConfig | null {
  return levels[levelId] ?? null
}

export function getNextLevel(currentId: string): string | null {
  const level = levels[currentId]
  return level?.nextLevel ?? null
}
