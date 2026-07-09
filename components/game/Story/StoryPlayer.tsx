'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TextsPreview } from 'narraleaf-react'
import { STORY_SCENES } from '@/data/story'
import { useAudio } from '@/hooks/useAudio'

interface StoryPlayerProps {
  onFinish: () => void
}

export function StoryPlayer({ onFinish }: StoryPlayerProps) {
  const [currentScene, setCurrentScene] = useState(0)
  const [textComplete, setTextComplete] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const { playSFX, setMusicTrack } = useAudio()

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
    setMusicTrack('intro')
  }, [setMusicTrack])

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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
            <motion.div
              className="absolute inset-0"
              initial={{
                scale: scene.motion.fromScale,
                x: scene.motion.fromX ?? '0%',
                y: scene.motion.fromY ?? '0%',
              }}
              animate={{
                scale: scene.motion.toScale,
                x: scene.motion.toX ?? '0%',
                y: scene.motion.toY ?? '0%',
              }}
              transition={{ duration: scene.duration / 1000, ease: 'linear' }}
              style={{
                backgroundImage: `url(${scene.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                imageRendering: 'pixelated',
                transformOrigin: 'center center',
              }}
            />

            <div
              className="absolute inset-0"
              style={{ backgroundColor: scene.overlayColor }}
            />

            <motion.div
              className="absolute inset-0"
              animate={{ opacity: [0.18, 0.32, 0.18] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                background:
                  'radial-gradient(circle at 50% 50%, rgba(120,255,220,0.14), transparent 45%)',
                mixBlendMode: 'screen',
              }}
            />

            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
              }}
            />

            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{ backgroundPosition: ['0px 0px', '48px 24px'] }}
              transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
              style={{
                backgroundImage:
                  'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
                backgroundSize: '48px 24px',
                opacity: 0.18,
              }}
            />

            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(74, 222, 128, 0.2), transparent)',
              }}
            />

            <div className="relative z-10 w-full max-w-4xl px-5 sm:px-8 lg:px-10">
              <motion.div
                className="p-6 sm:p-8"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.56)',
                  border: '1px solid rgba(74, 222, 128, 0.1)',
                  boxShadow: '0 0 40px rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'blur(1.5px)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.18 }}
              >
                <div
                  className="story-prologue-text whitespace-pre-line text-sm sm:text-base lg:text-lg leading-relaxed font-bold"
                  style={{
                    color: '#86efac',
                    fontFamily: '"Courier New", monospace',
                    textShadow: '0 0 20px rgba(74, 222, 128, 0.15)',
                    minHeight: '4em',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                    hyphens: 'manual',
                    textWrap: 'pretty',
                  }}
                >
                  <TextsPreview
                    key={scene.id}
                    text={scene.text}
                    cps={28}
                    loop={false}
                    defaultColor="#86efac"
                    fontFamily='"Courier New", monospace'
                    fontWeight={700}
                    className="story-prologue-text whitespace-pre-line leading-relaxed"
                    style={{
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'normal',
                      overflowWrap: 'normal',
                      hyphens: 'manual',
                      textWrap: 'pretty',
                    }}
                    onCompleted={() => setTextComplete(true)}
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
