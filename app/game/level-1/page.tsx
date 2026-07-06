'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { SceneEngine } from '@/components/game/SceneEngine/SceneEngine'
import { getLevelConfig } from '@/services/level.service'
import { useGameSave } from '@/hooks/useGameSave'

export default function LevelPage() {
  const router = useRouter()
  const { save, saveGame } = useGameSave()
  const levelConfig = getLevelConfig('level-1')

  const handleLevelComplete = useCallback(() => {
    if (!save) return
    const nextId = levelConfig?.nextLevel
    saveGame({
      ...save,
      currentLevel: nextId ? parseInt(nextId.replace('level-', '')) : save.currentLevel,
    })
    if (nextId) {
      router.push(`/game/${nextId}`)
    } else {
      router.push('/')
    }
  }, [save, levelConfig, saveGame, router])

  if (!levelConfig) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <p
          className="text-sm tracking-widest"
          style={{ color: 'rgba(239, 68, 68, 0.5)', fontFamily: '"Courier New", monospace' }}
        >
          Error: nivel no encontrado
        </p>
      </div>
    )
  }

  return <SceneEngine levelConfig={levelConfig} onLevelComplete={handleLevelComplete} />
}
