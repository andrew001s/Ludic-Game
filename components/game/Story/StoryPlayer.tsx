'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { STORY_SCENES } from '@/data/story'
import { useAudio } from '@/hooks/useAudio'

interface StoryPlayerProps {
  onFinish: () => void
}

function TypewriterText({ text, speed = 40, onComplete }: { text: string; speed?: number; onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState('')
  const indexRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    setDisplayed('')
    indexRef.current = 0

    timerRef.current = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1))
        indexRef.current++
      } else {
        if (timerRef.current) clearInterval(timerRef.current)
        onCompleteRef.current?.()
      }
    }, speed)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [text, speed])

  return (
    <span>
      {displayed}
      {indexRef.current < text.length && (
        <span
          className="inline-block w-[3px] h-[1em] ml-0.5 align-middle animate-pulse"
          style={{
            backgroundColor: '#4ade80',
            boxShadow: '0 0 6px #4ade80',
          }}
        />
      )}
    </span>
  )
}

export function StoryPlayer({ onFinish }: StoryPlayerProps) {
  const [currentScene, setCurrentScene] = useState(0)
  const [textComplete, setTextComplete] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const { playSFX } = useAudio()

  const isLastScene = currentScene === STORY_SCENES.length - 1

  const advanceScene = useCallback(() => {
    setCurrentScene((prev) => prev + 1)
    setTextComplete(false)
    setIsTransitioning(false)
  }, [])

  const goToNext = useCallback(() => {
    if (isTransitioning) return

    if (isLastScene) {
      playSFX('confirm')
      setFadeOut(true)
      setTimeout(() => onFinish(), 2000)
      return
    }

    playSFX('click')
    setIsTransitioning(true)
    setTimeout(advanceScene, 400)
  }, [isTransitioning, isLastScene, onFinish, playSFX, advanceScene])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (textComplete) {
          goToNext()
        }
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [textComplete, goToNext])

  if (!STORY_SCENES[currentScene]) return null

  const scene = STORY_SCENES[currentScene]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#000' }}>
      <AnimatePresence>
        <motion.div
          key={scene.id}
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ background: scene.gradient }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
            <div
              className="absolute inset-0"
              style={{ backgroundColor: scene.overlayColor }}
            />

            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
              }}
            />

            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(74, 222, 128, 0.2), transparent)',
              }}
            />

            <div className="relative z-10 w-full max-w-2xl px-6 sm:px-8">
              <motion.div
                className="p-6 sm:p-8"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(74, 222, 128, 0.1)',
                  boxShadow: '0 0 40px rgba(0, 0, 0, 0.3)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div
                  className="whitespace-pre-line text-sm sm:text-base md:text-lg leading-relaxed font-bold"
                  style={{
                    color: '#86efac',
                    fontFamily: '"Courier New", monospace',
                    textShadow: '0 0 20px rgba(74, 222, 128, 0.15)',
                    minHeight: '4em',
                  }}
                >
                  <TypewriterText
                    key={scene.id}
                    text={scene.text}
                    speed={35}
                    onComplete={() => setTextComplete(true)}
                  />
                </div>

                {(textComplete || isLastScene) && (
                  <motion.div
                    className="mt-8 flex flex-col items-center gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {isLastScene ? (
                      <motion.button
                        onClick={goToNext}
                        className="px-10 py-3 text-sm font-bold tracking-[0.25em] uppercase border transition-all duration-150"
                        style={{
                          color: '#4ade80',
                          borderColor: 'rgba(74, 222, 128, 0.3)',
                          backgroundColor: 'rgba(74, 222, 128, 0.05)',
                          fontFamily: '"Courier New", monospace',
                          textShadow: '0 0 10px rgba(74, 222, 128, 0.2)',
                          boxShadow: '0 0 20px rgba(74, 222, 128, 0.05)',
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        CONTINUAR
                      </motion.button>
                    ) : (
                      <motion.button
                        onClick={goToNext}
                        className="px-8 py-2 text-xs tracking-widest uppercase border transition-all duration-150"
                        style={{
                          color: 'rgba(74, 222, 128, 0.5)',
                          borderColor: 'rgba(74, 222, 128, 0.15)',
                          backgroundColor: 'transparent',
                          fontFamily: '"Courier New", monospace',
                        }}
                        whileHover={{
                          color: '#4ade80',
                          borderColor: 'rgba(74, 222, 128, 0.3)',
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isLastScene ? '' : 'SIGUIENTE >>'}
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Progress */}
            <div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2"
              style={{ fontFamily: '"Courier New", monospace' }}
            >
              <span className="text-[10px] tracking-widest" style={{ color: 'rgba(74, 222, 128, 0.25)' }}>
                {currentScene + 1} / {STORY_SCENES.length}
              </span>
              <div className="flex gap-1.5">
                {STORY_SCENES.map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 transition-all duration-500"
                    style={{
                      backgroundColor:
                        i === currentScene
                          ? 'rgba(74, 222, 128, 0.6)'
                          : i < currentScene
                            ? 'rgba(74, 222, 128, 0.2)'
                            : 'rgba(74, 222, 128, 0.08)',
                      boxShadow:
                        i === currentScene ? '0 0 6px rgba(74, 222, 128, 0.3)' : 'none',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Skip hint */}
            {!textComplete && (
              <div
                className="absolute bottom-20 left-1/2 -translate-x-1/2 text-[10px] tracking-wider animate-pulse"
                style={{ color: 'rgba(74, 222, 128, 0.15)', fontFamily: '"Courier New", monospace' }}
              >
                [Presiona Enter para saltar]
              </div>
            )}
          </motion.div>
      </AnimatePresence>

      {/* Fade to black for final transition */}
      {fadeOut && (
        <motion.div
          className="absolute inset-0 z-20"
          style={{ backgroundColor: '#000' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        />
      )}
    </div>
  )
}
