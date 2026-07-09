'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { DoorOpen, Trophy } from 'lucide-react'
import type { LevelConfig } from '@/types/level'
import type { EnginePhase } from '@/hooks/useSceneEngine'
import { useSceneEngine } from '@/hooks/useSceneEngine'
import { isMusicTrack, useAudio } from '@/hooks/useAudio'
import { InteractiveObject } from './InteractiveObject'
import { LevelBackground } from './LevelBackground'
import { LevelParticles } from './LevelParticles'
import { ActivityBurst } from './ActivityBurst'
import { NarraLeafDialoguePlayer } from '@/components/game/Dialogue/NarraLeafDialoguePlayer'
import { Modal } from '@/components/ui/Modal'
import { ActivityRenderer } from '@/components/game/Activities/ActivityRegistry'
import type { ActivityCompletionMetrics } from '@/types/progress'
import { MusicVolumeSlider } from '@/components/game/MusicVolumeSlider'
import { GameIconButton } from '@/components/game/GameIconButton'

interface SceneEngineProps {
  levelConfig: LevelConfig
  score: number
  onRequestExit: () => void
  onLevelComplete: (completedActivities: ActivityCompletionMetrics[]) => void
}

export function SceneEngine({ levelConfig, score, onRequestExit, onLevelComplete }: SceneEngineProps) {
  const { playSFX, setMusicTrack } = useAudio()
  const { state, actions, helpers } = useSceneEngine(levelConfig)
  const prevPhaseRef = useRef<EnginePhase>(state.phase)
  const [burstTrigger, setBurstTrigger] = useState<'enter' | 'complete' | null>(null)

  useEffect(() => {
    if (isMusicTrack(levelConfig.id)) {
      setMusicTrack(levelConfig.id)
    }
  }, [levelConfig.id, setMusicTrack])

  useEffect(() => {
    const prev = prevPhaseRef.current
    const curr = state.phase
    let nextTrigger: 'enter' | 'complete' | null = null

    if (prev !== curr) {
      if (curr === 'activity') {
        nextTrigger = 'enter'
      } else if (prev === 'activity' && (curr === 'exploration' || curr === 'completion')) {
        nextTrigger = 'complete'
      }
    }

    prevPhaseRef.current = state.phase

    if (!nextTrigger) return

    const timer = window.setTimeout(() => {
      setBurstTrigger(nextTrigger)
    }, 0)

    return () => window.clearTimeout(timer)
  }, [state.phase])

  const handleDialogueComplete = useCallback(() => {
    if (state.phase === 'introduction') {
      actions.startExploration()
    } else if (state.phase === 'completion') {
      onLevelComplete(state.completedActivities)
    }
  }, [state.completedActivities, state.phase, actions, onLevelComplete])

  const handleObjectClick = useCallback(
    (obj: { id: string }) => {
      const fullConfig = levelConfig.interactiveObjects.find((o) => o.id === obj.id)
      if (!fullConfig) return
      if (!helpers.isUnlocked(fullConfig)) return
      playSFX('click')
      actions.interactWithObject(fullConfig)
    },
    [levelConfig.interactiveObjects, helpers, actions, playSFX],
  )

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ backgroundColor: '#050805' }}>
      {/* Background */}
      <LevelBackground levelId={levelConfig.id} />

      {/* Ambient particles */}
      <LevelParticles levelId={levelConfig.id} />

      {/* Activity burst effects */}
      <ActivityBurst trigger={burstTrigger} />

      {/* Interactive objects */}
      <div className="absolute inset-0">
        {levelConfig.interactiveObjects.map((obj) => (
          <InteractiveObject
            key={obj.id}
            config={obj}
            unlocked={state.phase === 'exploration' && helpers.isUnlocked(obj)}
            completed={state.completedObjects.has(obj.id)}
            onClick={() => handleObjectClick({ id: obj.id })}
          />
        ))}
      </div>

      {/* Top bar with level info */}
      <div className="absolute top-0 left-0 right-0 z-30 p-3 sm:p-4">
        <div className="max-w-6xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <span
              className="text-[10px] tracking-[0.25em] uppercase"
              style={{ color: 'rgba(223, 233, 174, 0.55)', fontFamily: '"Courier New", monospace', textShadow: '1px 1px 0 #050603' }}
            >
              {levelConfig.id.replace('-', ' ').toUpperCase()}
            </span>
            <span
              className="text-[10px] tracking-widest uppercase"
              style={{ color: 'rgba(183, 209, 103, 0.45)', fontFamily: '"Courier New", monospace', textShadow: '1px 1px 0 #050603' }}
            >
              {levelConfig.title}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <div
              className="inline-flex items-center gap-2 border px-3 py-2 text-[10px] uppercase tracking-[0.18em]"
              style={{
                borderColor: 'rgba(250, 204, 21, 0.34)',
                color: '#fef08a',
                backgroundColor: 'rgba(35, 22, 4, 0.52)',
                fontFamily: '"Courier New", monospace',
                textShadow: '1px 1px 0 #050603',
              }}
            >
              <Trophy size={14} aria-hidden="true" />
              <span>Score: {score.toLocaleString()}</span>
            </div>

            <MusicVolumeSlider />

            <GameIconButton
              icon={DoorOpen}
              label="Salir"
              tone="warning"
              onClick={() => {
                playSFX('back')
                onRequestExit()
              }}
            />
          </div>
        </div>
      </div>

      {/* Dialogue */}
      <AnimatePresence>
        {(state.phase === 'introduction' || state.phase === 'completion') && state.dialogueLines.length > 0 && (
          <NarraLeafDialoguePlayer
            key={`${levelConfig.id}-${state.phase}`}
            id={`${levelConfig.id}-${state.phase}`}
            lines={state.dialogueLines}
            onComplete={handleDialogueComplete}
          />
        )}
      </AnimatePresence>

      {/* Activity Modal */}
      <Modal
        isOpen={state.phase === 'activity' && state.activeActivity !== null}
        onClose={actions.closeActivity}
        title={state.activeActivity?.title ?? ''}
        ariaLabel="Activity modal"
      >
        {state.activeActivity && (
          <ActivityRenderer
            activity={state.activeActivity}
            onComplete={actions.completeActivity}
          />
        )}
      </Modal>
    </div>
  )
}
