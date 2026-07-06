'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import type { ActivityConfig } from '@/types/activity'

export function DragOrderActivity({ activity, onComplete }: { activity: ActivityConfig; onComplete: () => void }) {
  const [order, setOrder] = useState<number[]>([])
  const [answered, setAnswered] = useState(false)
  const ac = activity as Extract<ActivityConfig, { type: 'drag-order' }>

  const remaining = useMemo(
    () => ac.items.filter((_, i) => !order.includes(i)),
    [ac.items, order],
  )

  const handleSelectItem = useCallback(
    (index: number) => {
      if (answered) return
      setOrder((prev) => [...prev, index])
    },
    [answered],
  )

  const handleRemoveItem = useCallback(
    (position: number) => {
      if (answered) return
      setOrder((prev) => prev.filter((_, i) => i !== position))
    },
    [answered],
  )

  const handleReset = useCallback(() => {
    if (answered) return
    setOrder([])
  }, [answered])

  const handleConfirm = useCallback(() => {
    if (order.length !== ac.items.length) return
    setAnswered(true)
  }, [order.length, ac.items.length])

  const isCorrect = useMemo(
    () => answered && order.every((item, i) => item === ac.correctOrder[i]),
    [answered, order, ac.correctOrder],
  )

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

      {/* Selected order */}
      <div className="flex flex-col gap-1.5 min-h-[100px]">
        {order.length === 0 && (
          <div className="text-xs py-8 text-center" style={{ color: 'rgba(74, 222, 128, 0.15)' }}>
            Selecciona los elementos en el orden correcto
          </div>
        )}
        {order.map((itemIndex, pos) => (
          <motion.button
            key={`${itemIndex}-${pos}`}
            onClick={() => handleRemoveItem(pos)}
            disabled={answered}
            className="w-full text-left px-4 py-2.5 text-sm border"
            style={{
              borderColor: answered
                ? itemIndex === ac.correctOrder[pos]
                  ? 'rgba(74, 222, 128, 0.4)'
                  : 'rgba(239, 68, 68, 0.3)'
                : 'rgba(74, 222, 128, 0.25)',
              backgroundColor: answered
                ? itemIndex === ac.correctOrder[pos]
                  ? 'rgba(74, 222, 128, 0.08)'
                  : 'rgba(239, 68, 68, 0.05)'
                : 'rgba(74, 222, 128, 0.06)',
              color: answered
                ? itemIndex === ac.correctOrder[pos]
                  ? '#4ade80'
                  : 'rgba(239, 68, 68, 0.6)'
                : '#86efac',
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            layout
          >
            {pos + 1}. {ac.items[itemIndex]}
          </motion.button>
        ))}
      </div>

      {/* Available items */}
      {remaining.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t" style={{ borderColor: 'rgba(74, 222, 128, 0.08)' }}>
          {ac.items.map((item, i) => {
            if (order.includes(i)) return null
            return (
              <motion.button
                key={i}
                onClick={() => handleSelectItem(i)}
                disabled={answered}
                className="px-3 py-1.5 text-xs border"
                style={{
                  borderColor: 'rgba(74, 222, 128, 0.2)',
                  color: 'rgba(134, 239, 172, 0.6)',
                }}
                whileHover={{ borderColor: 'rgba(74, 222, 128, 0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                {item}
              </motion.button>
            )
          })}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {order.length > 0 && !answered && (
          <motion.button
            onClick={handleReset}
            className="px-4 py-2 text-xs tracking-wider uppercase border"
            style={{
              color: 'rgba(134, 239, 172, 0.4)',
              borderColor: 'rgba(74, 222, 128, 0.15)',
              fontFamily: '"Courier New", monospace',
            }}
            whileHover={{ borderColor: 'rgba(74, 222, 128, 0.3)' }}
          >
            REINICIAR
          </motion.button>
        )}
        {order.length === ac.items.length && !answered && (
          <motion.button
            onClick={handleConfirm}
            className="px-6 py-2 text-xs tracking-widest uppercase border"
            style={{
              color: '#4ade80',
              borderColor: 'rgba(74, 222, 128, 0.3)',
              fontFamily: '"Courier New", monospace',
            }}
            whileHover={{ scale: 1.02 }}
          >
            CONFIRMAR
          </motion.button>
        )}
      </div>

      {/* Feedback */}
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
