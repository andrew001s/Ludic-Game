'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Nametag, TextsPreview } from 'narraleaf-react'
import type { DialogueLine } from '@/types/level'
import { createSpeakerSentence, getSpeakerImageSrc, getSpeakerProfile } from '@/app/constants/dialogueSpeakers'

interface DialogueBoxProps {
  lines: DialogueLine[]
  onComplete: () => void
}

export function DialogueBox({ lines, onComplete }: DialogueBoxProps) {
  const [currentLine, setCurrentLine] = useState(0)
  const [lineComplete, setLineComplete] = useState(false)

  const isLastLine = currentLine === lines.length - 1
  const handleTypewriterComplete = useCallback(() => setLineComplete(true), [])

  const handleAdvance = useCallback(() => {
    if (!lineComplete) return

    if (isLastLine) {
      onComplete()
    } else {
      setCurrentLine((prev) => prev + 1)
      setLineComplete(false)
    }
  }, [lineComplete, isLastLine, onComplete])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleAdvance()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleAdvance])

  const line = lines[currentLine]
  const speakerProfile = getSpeakerProfile(line?.speaker ?? '')
  const spriteSrc = getSpeakerImageSrc(speakerProfile)
  const sentence = useMemo(
    () => (line ? createSpeakerSentence(speakerProfile, line.text) : null),
    [line, speakerProfile],
  )

  if (!line || !sentence) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 p-4 sm:p-6"
      style={{ fontFamily: '"Courier New", monospace' }}
    >
      <AnimatePresence>
        {spriteSrc && (
          <motion.div
            key={line.speaker}
            className="pointer-events-none fixed inset-0 z-0"
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.28,
              ease: 'easeOut',
            }}
            style={{ transformOrigin: '50% 100%' }}
          >
            <motion.div
              className="absolute inset-0"
              animate={{
                y: [0, -2, 0],
                scaleY: [1, 1.003, 1],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ transformOrigin: '50% 100%' }}
            >
              <Image
                src={spriteSrc}
                alt={speakerProfile.spriteAlt ?? speakerProfile.displayName}
                fill
                priority
                unoptimized
                className={`object-contain object-center drop-shadow-[0_24px_36px_rgba(0,0,0,0.6)] ${speakerProfile.spriteClassName ?? ''}`}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="relative z-10 max-w-3xl mx-auto p-4 sm:p-5 border-[3px] cursor-pointer transition-all duration-150 hover:opacity-95"
        style={{
          borderColor: 'rgba(145, 149, 88, 0.55)',
          backgroundColor: 'rgba(11, 13, 10, 0.96)',
          boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.7), inset 0 0 0 1px rgba(255,255,255,0.03)',
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0 2px, transparent 2px 6px), repeating-linear-gradient(90deg, rgba(255,255,255,0.012) 0 2px, transparent 2px 6px)',
        }}
        onClick={handleAdvance}
      >
        <div className="flex items-center gap-2 mb-2">
          <Nametag
            name={speakerProfile.displayName}
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: line.speaker === 'SISTEMA' ? 'rgba(236, 214, 151, 0.65)' : '#d8e28f' }}
          />
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(183, 209, 103, 0.22), transparent)' }} />
        </div>

        <div className="text-sm sm:text-base leading-relaxed min-h-[2em]" style={{ color: '#dfe9ae' }}>
          <TextsPreview
            key={`${currentLine}-${line.text}`}
            sentence={sentence}
            cps={50}
            loop={false}
            defaultColor="#dfe9ae"
            fontFamily='"Courier New", monospace'
            className="leading-relaxed"
            onCompleted={handleTypewriterComplete}
          />
        </div>

        {lineComplete && (
          <div className="mt-2 text-[10px] tracking-wider text-right animate-pulse" style={{ color: 'rgba(223, 233, 174, 0.45)' }}>
            {isLastLine ? '[CERRAR]' : '[CONTINUAR]'}
          </div>
        )}
      </div>
    </div>
  )
}
