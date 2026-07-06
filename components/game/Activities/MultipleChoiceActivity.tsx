'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import type { ActivityConfig } from '@/types/activity'

export function MultipleChoiceActivity({ activity, onComplete }: { activity: ActivityConfig; onComplete: () => void }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const ac = activity as Extract<ActivityConfig, { type: 'multiple-choice' }>

  const handleSelect = useCallback(
    (index: number) => {
      if (answered) return
      setSelected(index)
    },
    [answered],
  )

  const handleConfirm = useCallback(() => {
    if (selected === null) return
    setAnswered(true)
  }, [selected])

  const isCorrect = selected === ac.correctIndex

  return (
    <div
      className="flex flex-col gap-6"
      style={{ fontFamily: '"Courier New", monospace' }}
    >
      <div className="text-xs tracking-widest uppercase" style={{ color: 'rgba(74, 222, 128, 0.4)' }}>
        {ac.instruction}
      </div>

      <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#86efac' }}>
        {ac.question}
      </p>

      <div className="flex flex-col gap-2">
        {ac.options.map((option, i) => {
          let borderColor = 'rgba(74, 222, 128, 0.2)'
          let bgColor = 'rgba(74, 222, 128, 0.03)'
          let textColor = 'rgba(134, 239, 172, 0.7)'
          let glow = 'none'

          if (answered) {
            if (i === ac.correctIndex) {
              borderColor = 'rgba(74, 222, 128, 0.6)'
              bgColor = 'rgba(74, 222, 128, 0.1)'
              textColor = '#4ade80'
              glow = '0 0 10px rgba(74, 222, 128, 0.2)'
            } else if (i === selected) {
              borderColor = 'rgba(239, 68, 68, 0.4)'
              bgColor = 'rgba(239, 68, 68, 0.08)'
              textColor = 'rgba(239, 68, 68, 0.7)'
            }
          } else if (i === selected) {
            borderColor = 'rgba(74, 222, 128, 0.5)'
            bgColor = 'rgba(74, 222, 128, 0.08)'
            textColor = '#4ade80'
          }

          return (
            <motion.button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className="w-full text-left px-4 py-3 text-sm border transition-all duration-150 disabled:cursor-default"
              style={{
                borderColor,
                backgroundColor: bgColor,
                color: textColor,
                boxShadow: glow,
              }}
              whileHover={answered ? {} : { scale: 1.005 }}
              whileTap={answered ? {} : { scale: 0.995 }}
            >
              {option}
            </motion.button>
          )
        })}
      </div>

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
              whileTap={{ scale: 0.98 }}
            >
              CONTINUAR
            </motion.button>
          )}
        </motion.div>
      )}

      {!answered && selected !== null && (
        <motion.button
          onClick={handleConfirm}
          className="self-start px-6 py-2 text-xs tracking-widest uppercase border"
          style={{
            color: '#4ade80',
            borderColor: 'rgba(74, 222, 128, 0.3)',
            fontFamily: '"Courier New", monospace',
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          CONFIRMAR
        </motion.button>
      )}
    </div>
  )
}
