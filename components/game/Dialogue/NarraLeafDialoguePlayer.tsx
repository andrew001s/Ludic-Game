'use client'

import { useMemo, useRef } from 'react'
import {
  Dialog,
  GameProviders,
  Game,
  Nametag,
  Player,
  Scene,
  Story,
  Texts,
  Transform,
  useDialog,
} from 'narraleaf-react'
import type { ChainedActions } from 'narraleaf-react'
import type { DialogueLine } from '@/types/level'
import { getSpeakerCharacter, getSpeakerImage, getSpeakerProfile } from '@/app/constants/dialogueSpeakers'

interface NarraLeafDialoguePlayerProps {
  id: string
  lines: DialogueLine[]
  onComplete: () => void
}

function NarraLeafDialogueContent() {
  const { done, isNarrator } = useDialog()

  return (
    <div
      className="w-full max-w-5xl mx-auto min-h-44 p-6 sm:min-h-52 sm:p-8 border-[3px] cursor-pointer transition-all duration-150 hover:opacity-95"
      style={{
        borderColor: 'rgba(145, 149, 88, 0.55)',
        backgroundColor: 'rgba(11, 13, 10, 0.96)',
        boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.7), inset 0 0 0 1px rgba(255,255,255,0.03)',
        backgroundImage:
          'repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0 2px, transparent 2px 6px), repeating-linear-gradient(90deg, rgba(255,255,255,0.012) 0 2px, transparent 2px 6px)',
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        {!isNarrator && (
          <Nametag
            className="text-sm sm:text-base font-bold tracking-widest uppercase"
            style={{ color: '#d8e28f' }}
          />
        )}
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(183, 209, 103, 0.22), transparent)' }} />
      </div>

      <Texts
        className="narraleaf-dialog-text text-lg sm:text-2xl leading-relaxed min-h-[4em]"
        defaultColor="#dfe9ae"
        fontFamily='"Courier New", monospace'
        style={{
          overflowWrap: 'normal',
          wordBreak: 'normal',
        }}
      />

      {done && (
        <div className="mt-2 text-[20px] tracking-wider text-right animate-pulse" style={{ color: 'rgba(223, 233, 174, 0.45)' }}>
          [CONTINUAR]
        </div>
      )}
    </div>
  )
}

function NarraLeafDialogueUI() {
  return (
    <Dialog
      className="absolute bottom-0 left-0 right-0 z-20 p-4 sm:p-6"
      style={{ fontFamily: '"Courier New", monospace' }}
    >
      <NarraLeafDialogueContent />
    </Dialog>
  )
}

const popInTransform = Transform.create()
  .zoom(0.15)
  .position({ yoffset: 20 })
  .opacity(0)
  .commit({ duration: 0 })
  .zoom(1.12)
  .position({ yoffset: -4 })
  .opacity(1)
  .commit({ duration: 180, ease: 'easeOut' })
  .zoom(1)
  .position({ yoffset: 0 })
  .commit({ duration: 80, ease: 'easeOut' })

const exitTransform = Transform.create()
  .scale(0.7, 0.7)
  .position({ yoffset: -12 })
  .opacity(0)
  .commit({ duration: 180, ease: 'easeOut' })

function createDialogueStory(id: string, lines: DialogueLine[]) {
  const story = new Story(`dialogue-${id}`)
  const scene = new Scene(`dialogue-${id}`, {
    background: 'transparent',
  })

  let visibleImage = null as ReturnType<typeof getSpeakerImage>
  const actions: ChainedActions = []

  for (const line of lines) {
    const profile = getSpeakerProfile(line.speaker)
    const image = getSpeakerImage(profile)

    if (visibleImage && visibleImage !== image) {
      actions.push(visibleImage.transform(
        exitTransform.copy()
      ))
      visibleImage = null
    }

    if (image && visibleImage !== image) {
      actions.push(image.show({ duration: 0 }))
      actions.push(image.transform(
        popInTransform.copy()
      ))
      visibleImage = image
    }

    actions.push(getSpeakerCharacter(profile).say(line.text))
  }

  if (visibleImage) {
    actions.push(visibleImage.transform(
      exitTransform.copy()
    ))
  }

  scene.action(actions)
  story.entry(scene)

  return story
}

export function NarraLeafDialoguePlayer({ id, lines, onComplete }: NarraLeafDialoguePlayerProps) {
  const completedRef = useRef(false)
  const game = useMemo(() => new Game({ dialog: NarraLeafDialogueUI }), [])
  const story = useMemo(() => createDialogueStory(id, lines), [id, lines])

  const handleComplete = () => {
    if (completedRef.current) return
    completedRef.current = true
    onComplete()
  }

  return (
    <div className="fixed inset-0 z-40">
      <GameProviders game={game}>
        <Player
          story={story}
          width="100%"
          height="100%"
          onReady={({ liveGame }) => {
            liveGame.game.preference.setPreference('cps', 50)
            liveGame.newGame()
          }}
          onEnd={handleComplete}
        />
      </GameProviders>
    </div>
  )
}
