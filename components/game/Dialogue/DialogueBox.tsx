'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { DialogueLine } from '@/types/level'

interface DialogueBoxProps {
  lines: DialogueLine[]
  onComplete: () => void
}

function TypewriterDialogue({ text, speed = 25, onComplete }: { text: string; speed?: number; onComplete: () => void }) {
  const [displayed, setDisplayed] = useState('')
  const indexRef = useRef(0)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    setDisplayed('')
    indexRef.current = 0

    const timer = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1))
        indexRef.current++
      } else {
        clearInterval(timer)
        onCompleteRef.current()
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed])

  return <span>{displayed}</span>
}

export function DialogueBox({ lines, onComplete }: DialogueBoxProps) {
  const [currentLine, setCurrentLine] = useState(0)
  const [lineComplete, setLineComplete] = useState(false)

  const isLastLine = currentLine === lines.length - 1

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
  if (!line) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 p-4 sm:p-6"
      style={{ fontFamily: '"Courier New", monospace' }}
    >
      <div
        className="max-w-3xl mx-auto p-4 sm:p-5 border-[3px] cursor-pointer transition-all duration-150 hover:opacity-95"
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
          <span
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: line.speaker === 'SISTEMA' ? 'rgba(236, 214, 151, 0.65)' : '#d8e28f' }}
          >
            {line.speaker}
          </span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(183, 209, 103, 0.22), transparent)' }} />
        </div>

        <p className="text-sm sm:text-base leading-relaxed min-h-[2em]" style={{ color: '#dfe9ae' }}>
          <TypewriterDialogue
            key={`${currentLine}-${line.text}`}
            text={line.text}
            speed={20}
            onComplete={() => setLineComplete(true)}
          />
        </p>

        {lineComplete && (
          <div className="mt-2 text-[10px] tracking-wider text-right animate-pulse" style={{ color: 'rgba(223, 233, 174, 0.45)' }}>
            {isLastLine ? '[CERRAR]' : '[CONTINUAR]'}
          </div>
        )}
      </div>
    </div>
  )
}
