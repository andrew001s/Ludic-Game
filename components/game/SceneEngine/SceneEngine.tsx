'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import type { LevelConfig } from '@/types/level'
import { useSceneEngine } from '@/hooks/useSceneEngine'
import { useAudio } from '@/hooks/useAudio'
import { InteractiveObject } from './InteractiveObject'
import { DialogueBox } from '@/components/game/Dialogue/DialogueBox'
import { Modal } from '@/components/ui/Modal'
import { ActivityRenderer } from '@/components/game/Activities/ActivityRegistry'

interface SceneEngineProps {
  levelConfig: LevelConfig
  onLevelComplete: () => void
}

export function SceneEngine({ levelConfig, onLevelComplete }: SceneEngineProps) {
  const router = useRouter()
  const { playSFX } = useAudio()
  const { state, actions, helpers } = useSceneEngine(levelConfig)

  const handleDialogueComplete = useCallback(() => {
    if (state.phase === 'introduction') {
      actions.startExploration()
    } else if (state.phase === 'completion') {
      onLevelComplete()
    }
  }, [state.phase, actions, onLevelComplete])

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
      <div className="absolute inset-0">
        <img
          src={levelConfig.background}
          alt=""
          className="w-full h-full object-cover pointer-events-none select-none"
          style={{ imageRendering: 'pixelated', objectPosition: 'center center' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(5, 8, 5, 0.3) 0%, transparent 30%, transparent 70%, rgba(5, 8, 5, 0.6) 100%)',
          }}
        />
      </div>

      {/* Interactive objects */}
      {state.phase === 'exploration' && (
        <div className="absolute inset-0">
          {levelConfig.interactiveObjects.map((obj) => (
            <InteractiveObject
              key={obj.id}
              config={obj}
              unlocked={helpers.isUnlocked(obj)}
              completed={state.completedObjects.has(obj.id)}
              lockedBy={helpers.findLockedByTitle(obj)}
              onClick={() => handleObjectClick({ id: obj.id })}
            />
          ))}
        </div>
      )}

      {/* Top bar with level info */}
      <div className="absolute top-0 left-0 right-0 z-30 p-3 sm:p-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span
            className="text-[10px] tracking-[0.25em] uppercase"
            style={{ color: 'rgba(74, 222, 128, 0.3)', fontFamily: '"Courier New", monospace' }}
          >
            {levelConfig.id.replace('-', ' ').toUpperCase()}
          </span>
          <span
            className="text-[10px] tracking-widest uppercase"
            style={{ color: 'rgba(74, 222, 128, 0.2)', fontFamily: '"Courier New", monospace' }}
          >
            {levelConfig.title}
          </span>
        </div>
      </div>

      {/* Dialogue */}
      <AnimatePresence>
        {(state.phase === 'introduction' || state.phase === 'completion') && state.dialogueLines.length > 0 && (
          <DialogueBox
            key={state.phase}
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
