'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import type { ActivityConfig } from '@/types/activity'

export function FillBlanksActivity({ activity, onComplete }: { activity: ActivityConfig; onComplete: () => void }) {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [answered, setAnswered] = useState(false)
  const ac = activity as Extract<ActivityConfig, { type: 'fill-blanks' }>

  const handleChange = useCallback(
    (index: number, value: string) => {
      if (answered) return
      setAnswers((prev) => ({ ...prev, [index]: value }))
    },
    [answered],
  )

  const handleConfirm = useCallback(() => {
    if (Object.keys(answers).length !== ac.blanks.length) return
    setAnswered(true)
  }, [answers, ac.blanks.length])

  const isCorrect = useMemo(() => {
    if (!answered) return false
    return ac.blanks.every(
      (blank) => answers[blank.index]?.trim().toLowerCase() === ac.correctAnswers[blank.index].toLowerCase(),
    )
  }, [answered, answers, ac.blanks, ac.correctAnswers])

  const allFilled = Object.keys(answers).length === ac.blanks.length

  const renderText = useMemo(() => {
    const parts = ac.text.split('___')
    return parts.map((part, i) => {
      const blank = ac.blanks[i]
      return (
        <span key={i}>
          {part}
          {blank && (
            answered ? (
              <span
                className="inline-block mx-1 px-2 border-b-2"
                style={{
                  borderColor: answers[blank.index]?.toLowerCase() === ac.correctAnswers[blank.index]?.toLowerCase()
                    ? 'rgba(74, 222, 128, 0.5)'
                    : 'rgba(239, 68, 68, 0.4)',
                  color: answers[blank.index]?.toLowerCase() === ac.correctAnswers[blank.index]?.toLowerCase()
                    ? '#4ade80'
                    : 'rgba(239, 68, 68, 0.7)',
                  minWidth: '80px',
                }}
              >
                {answers[blank.index] || ''}
              </span>
            ) : (
              <input
                type="text"
                value={answers[blank.index] || ''}
                onChange={(e) => handleChange(blank.index, e.target.value)}
                placeholder={blank.placeholder}
                className="inline-block mx-1 px-2 bg-transparent border-b-2 outline-none text-sm"
                style={{
                  borderColor: answers[blank.index]
                    ? 'rgba(74, 222, 128, 0.4)'
                    : 'rgba(74, 222, 128, 0.15)',
                  color: '#4ade80',
                  caretColor: '#4ade80',
                  minWidth: '100px',
                  fontFamily: '"Courier New", monospace',
                }}
                autoComplete="off"
                spellCheck={false}
              />
            )
          )}
        </span>
      )
    })
  }, [ac.text, ac.blanks, ac.correctAnswers, answers, answered, handleChange])

  return (
    <div
      className="flex flex-col gap-6"
      style={{ fontFamily: '"Courier New", monospace' }}
    >
      <div className="text-xs tracking-widest uppercase" style={{ color: 'rgba(74, 222, 128, 0.4)' }}>
        {ac.instruction}
      </div>

      <div className="text-sm sm:text-base leading-relaxed whitespace-pre-line" style={{ color: '#86efac' }}>
        {renderText}
      </div>

      {!answered && (
        <motion.button
          onClick={handleConfirm}
          disabled={!allFilled}
          className="self-start px-6 py-2 text-xs tracking-widest uppercase border transition-all duration-150 disabled:opacity-30"
          style={{
            color: '#4ade80',
            borderColor: allFilled ? 'rgba(74, 222, 128, 0.3)' : 'rgba(74, 222, 128, 0.1)',
            fontFamily: '"Courier New", monospace',
          }}
          whileHover={allFilled ? { scale: 1.02 } : {}}
          whileTap={allFilled ? { scale: 0.98 } : {}}
        >
          CONFIRMAR
        </motion.button>
      )}

      {answered && (
        <motion.div
          className="p-4 border text-sm leading-relaxed"
          style={{
            borderColor: isCorrect ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            backgroundColor: isCorrect ? 'rgba(74, 222, 128, 0.05)' : 'rgba(239, 68, 68, 0.05)',
            color: isCorrect ? '#86efac' : 'rgba(239, 68, 68, 0.7)',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {isCorrect ? ac.feedback.success : ac.feedback.error}
          {isCorrect && (
            <motion.button
              onClick={onComplete}
              className="block mt-4 px-6 py-2 text-xs tracking-widest uppercase border"
              style={{
                color: '#4ade80',
                borderColor: 'rgba(74, 222, 128, 0.3)',
                fontFamily: '"Courier New", monospace',
              }}
              whileHover={{ scale: 1.02 }}
            >
              CONTINUAR
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  )
}
