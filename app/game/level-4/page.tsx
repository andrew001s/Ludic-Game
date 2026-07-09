import { generateLevelMetadata } from '@/app/game/level-metadata'
import { LevelPageClient } from '@/app/game/_components/LevelPageClient'

export function generateMetadata() {
  return generateLevelMetadata('level-4')
}

export default function LevelPage() {
  return <LevelPageClient levelId="level-4" />
}
