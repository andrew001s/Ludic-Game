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
        className="max-w-3xl mx-auto p-4 sm:p-5 border cursor-pointer transition-all duration-150 hover:opacity-90"
        style={{
          borderColor: 'rgba(74, 222, 128, 0.2)',
          backgroundColor: 'rgba(5, 8, 5, 0.92)',
          boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.5)',
        }}
        onClick={handleAdvance}
      >
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: line.speaker === 'SISTEMA' ? 'rgba(74, 222, 128, 0.5)' : '#4ade80' }}
          >
            {line.speaker}
          </span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(74, 222, 128, 0.15), transparent)' }} />
        </div>

        <p className="text-sm sm:text-base leading-relaxed min-h-[2em]" style={{ color: '#86efac' }}>
          <TypewriterDialogue
            key={`${currentLine}-${line.text}`}
            text={line.text}
            speed={20}
            onComplete={() => setLineComplete(true)}
          />
        </p>

        {lineComplete && (
          <div className="mt-2 text-[10px] tracking-wider text-right animate-pulse" style={{ color: 'rgba(74, 222, 128, 0.2)' }}>
            {isLastLine ? '[CERRAR]' : '[CONTINUAR]'}
          </div>
        )}
      </div>
    </div>
  )
}
