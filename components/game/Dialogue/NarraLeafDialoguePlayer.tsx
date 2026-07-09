'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Dialog,
  GameProviders,
  Game,
  Nametag,
  Player,
  Scene,
  Script,
  Story,
  Texts,
  Transform,
  useDialog,
} from 'narraleaf-react'
import type { ChainedActions } from 'narraleaf-react'
import type { DialogueLine } from '@/types/level'
import { getSpeakerCharacter, getSpeakerImage, getSpeakerProfile, getSpeakerSpriteSrc } from '@/app/constants/dialogueSpeakers'

interface NarraLeafDialoguePlayerProps {
  id: string
  lines: DialogueLine[]
  onComplete: () => void
}

function useIsLandscapeMobile() {
  const [isLandscapeMobile, setIsLandscapeMobile] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(orientation: landscape) and (max-width: 1200px)')
    const update = () => setIsLandscapeMobile(mediaQuery.matches)

    update()
    mediaQuery.addEventListener('change', update)

    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  return isLandscapeMobile
}

function MobileLandscapeDialoguePlayer({ lines, onComplete }: { lines: DialogueLine[]; onComplete: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    setCurrentIndex(0)
  }, [lines])

  const currentLine = lines[currentIndex]
  const profile = currentLine ? getSpeakerProfile(currentLine.speaker) : null
  const spriteSrc = profile ? getSpeakerSpriteSrc(profile) : null

  const handleAdvance = useCallback(() => {
    if (!currentLine) {
      onComplete()
      return
    }

    if (currentIndex >= lines.length - 1) {
      onComplete()
      return
    }

    setCurrentIndex((index) => index + 1)
  }, [currentIndex, currentLine, lines.length, onComplete])

  if (!currentLine || !profile) return null

  return (
    <div className="fixed inset-0 z-40" onClick={handleAdvance}>
      <div className="absolute top-24 left-3 right-3 flex gap-3">
        <div className="flex w-3/5 items-end justify-center overflow-hidden pointer-events-none">
          {spriteSrc ? (
            <img
              src={spriteSrc}
              alt={profile.spriteAlt ?? profile.displayName}
              className="max-h-full max-w-full object-contain object-bottom drop-shadow-[0_18px_24px_rgba(0,0,0,0.55)]"
            />
          ) : null}
        </div>

        <div className="w-2/5 -translate-x-24 pb-12">
          <div
            className="flex h-full cursor-pointer flex-col border-[3px] p-4"
            style={{
              borderColor: 'rgba(145, 149, 88, 0.55)',
              backgroundColor: 'rgba(11, 13, 10, 0.96)',
              boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.7), inset 0 0 0 1px rgba(255,255,255,0.03)',
              backgroundImage:
                'repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0 2px, transparent 2px 6px), repeating-linear-gradient(90deg, rgba(255,255,255,0.012) 0 2px, transparent 2px 6px)',
              fontFamily: '"Courier New", monospace',
            }}
          >
            <div className="mb-3 flex items-center gap-2">
              <div className="text-base font-bold tracking-widest uppercase" style={{ color: '#d8e28f' }}>
                {profile.displayName}
              </div>
              <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(183, 209, 103, 0.22), transparent)' }} />
            </div>

            <div className="narraleaf-dialog-text flex-1 text-lg leading-relaxed" style={{ color: '#dfe9ae' }}>
              {currentLine.text}
            </div>

            <div className="mt-3 text-right text-sm tracking-wider animate-pulse" style={{ color: 'rgba(223, 233, 174, 0.45)' }}>
              [CONTINUAR]
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function NarraLeafDialogueContent() {
  const { done, isNarrator } = useDialog()

  return (
    <div
      className="dialog-compact w-full max-w-5xl mx-auto min-h-36 p-4 sm:min-h-52 sm:p-8 border-[3px] cursor-pointer transition-all duration-150 hover:opacity-95"
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
        className="dialog-text narraleaf-dialog-text text-lg sm:text-2xl leading-relaxed min-h-[4em]"
        defaultColor="#dfe9ae"
        fontFamily='"Courier New", monospace'
        style={{
          overflowWrap: 'normal',
          wordBreak: 'normal',
        }}
      />

      {done && (
        <div className="dialog-continue mt-2 text-sm sm:text-base tracking-wider text-right animate-pulse" style={{ color: 'rgba(223, 233, 174, 0.45)' }}>
          [CONTINUAR]
        </div>
      )}
    </div>
  )
}

function createDialogueUI() {
  return function NarraLeafDialogueUI() {
    return (
      <Dialog
        className="absolute bottom-0 left-0 right-0 z-20 p-2 sm:p-6 max-h-[40dvh] sm:max-h-[50vh] overflow-y-auto"
        style={{ fontFamily: '"Courier New", monospace' }}
      >
        <NarraLeafDialogueContent />
      </Dialog>
    )
  }
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

function createDialogueStory(id: string, lines: DialogueLine[], onStoryComplete: () => void) {
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

  actions.push(
    Script.execute(() => {
      onStoryComplete()
    })
  )

  scene.action(actions)
  story.entry(scene)

  return story
}

function DesktopDialoguePlayer({ id, lines, onComplete }: NarraLeafDialoguePlayerProps) {
  const completedRef = useRef(false)
  const [story, setStory] = useState<Story | null>(null)

  const handleComplete = useCallback(() => {
    if (completedRef.current) return
    completedRef.current = true
    onComplete()
  }, [onComplete])

  const game = useMemo(() => new Game({ dialog: createDialogueUI() }), [])

  useEffect(() => {
    completedRef.current = false
    setStory(createDialogueStory(id, lines, handleComplete))
  }, [id, lines, handleComplete])

  return (
    <div className="fixed inset-0 z-40" style={{ maxHeight: '100dvh', overflow: 'hidden' }}>
      <GameProviders game={game}>
        {story && (
          <Player
            story={story}
            width="100%"
            height="100%"
            onReady={({ liveGame }) => {
              liveGame.game.preference.setPreference('cps', 50)
              liveGame.newGame()
            }}
          />
        )}
      </GameProviders>
    </div>
  )
}

export function NarraLeafDialoguePlayer({ id, lines, onComplete }: NarraLeafDialoguePlayerProps) {
  const isLandscapeMobile = useIsLandscapeMobile()

  if (isLandscapeMobile) {
    return <MobileLandscapeDialoguePlayer lines={lines} onComplete={onComplete} />
  }

  return <DesktopDialoguePlayer id={id} lines={lines} onComplete={onComplete} />
}
