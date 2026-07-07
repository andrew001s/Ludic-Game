'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Bot, Cog, Gauge, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ActivityConfig } from '@/types/activity'

function getRobotStepIcon(item: string): LucideIcon {
  const normalized = item.toLowerCase()

  if (normalized.includes('movimiento')) return Gauge
  if (normalized.includes('cinética')) return Zap
  if (normalized.includes('motor')) return Cog
  if (normalized.includes('robot')) return Bot

  return Zap
}

function getSeededOrder(length: number, seed: string) {
  const values = Array.from({ length }, (_, index) => index)
  let hash = 0

  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  }

  for (let index = values.length - 1; index > 0; index -= 1) {
    hash = (hash * 1664525 + 1013904223) >>> 0
    const swapIndex = hash % (index + 1)
    ;[values[index], values[swapIndex]] = [values[swapIndex], values[index]]
  }

  if (values.every((value, index) => value === index) && values.length > 1) {
    ;[values[0], values[1]] = [values[1], values[0]]
  }

  return values
}

export function DragOrderActivity({ activity, onComplete }: { activity: ActivityConfig; onComplete: () => void }) {
  const [order, setOrder] = useState<number[]>([])
  const [answered, setAnswered] = useState(false)
  const ac = activity as Extract<ActivityConfig, { type: 'drag-order' }>

  const availableOrder = useMemo(() => getSeededOrder(ac.items.length, ac.id), [ac.id, ac.items.length])
  const remaining = availableOrder.filter((index) => !order.includes(index))

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

      <div
        className="relative overflow-hidden rounded-sm border p-4"
        style={{
          borderColor: 'rgba(74, 222, 128, 0.14)',
          background:
            'radial-gradient(circle at 18% 50%, rgba(74,222,128,0.12), transparent 24%), linear-gradient(90deg, rgba(74,222,128,0.035), rgba(20,83,45,0.04))',
        }}
      >
        <div className="absolute left-8 right-8 top-1/2 h-px -translate-y-1/2" style={{ background: 'rgba(74, 222, 128, 0.18)' }} />
        <div className="relative grid grid-cols-4 gap-2">
          {ac.correctOrder.map((itemIndex, step) => {
            const selectedIndex = order[step]
            const StepIcon = selectedIndex === undefined ? getRobotStepIcon(ac.items[itemIndex]) : getRobotStepIcon(ac.items[selectedIndex])
            const isStepCorrect = answered && selectedIndex === itemIndex
            const isStepWrong = answered && selectedIndex !== undefined && selectedIndex !== itemIndex

            return (
              <div key={step} className="relative flex flex-col items-center gap-2">
                {step > 0 && (
                  <ArrowRight
                    size={16}
                    className="absolute -left-3 top-6 hidden sm:block"
                    style={{ color: 'rgba(74, 222, 128, 0.32)' }}
                    aria-hidden="true"
                  />
                )}
                <div
                  className="grid h-12 w-12 place-items-center rounded-full border"
                  style={{
                    borderColor: isStepWrong
                      ? 'rgba(239, 68, 68, 0.42)'
                      : isStepCorrect
                        ? 'rgba(74, 222, 128, 0.68)'
                        : selectedIndex !== undefined
                          ? 'rgba(74, 222, 128, 0.42)'
                          : 'rgba(74, 222, 128, 0.16)',
                    backgroundColor: selectedIndex !== undefined ? 'rgba(74, 222, 128, 0.1)' : 'rgba(0, 0, 0, 0.18)',
                    color: isStepWrong ? 'rgba(239, 68, 68, 0.74)' : '#86efac',
                    boxShadow: selectedIndex !== undefined ? '0 0 18px rgba(74, 222, 128, 0.12)' : 'none',
                  }}
                >
                  <StepIcon size={22} aria-hidden="true" />
                </div>
                <div className="text-center text-[10px] uppercase tracking-wider" style={{ color: 'rgba(134, 239, 172, 0.45)' }}>
                  Paso {step + 1}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected order */}
      <div className="flex flex-col gap-1.5 min-h-[100px]">
        {order.length === 0 && (
          <div className="text-xs py-8 text-center" style={{ color: 'rgba(74, 222, 128, 0.15)' }}>
            Selecciona las piezas para encender la ruta del robot
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
            <span className="flex items-center gap-3">
              {(() => {
                const ItemIcon = getRobotStepIcon(ac.items[itemIndex])
                return <ItemIcon size={17} aria-hidden="true" />
              })()}
              <span>{pos + 1}. {ac.items[itemIndex]}</span>
            </span>
          </motion.button>
        ))}
      </div>

      {/* Available items */}
      {remaining.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t" style={{ borderColor: 'rgba(74, 222, 128, 0.08)' }}>
          {remaining.map((i) => {
            const item = ac.items[i]
            const ItemIcon = getRobotStepIcon(item)

            return (
              <motion.button
                key={i}
                onClick={() => handleSelectItem(i)}
                disabled={answered}
                className="flex items-center gap-2 px-3 py-2 text-xs border"
                style={{
                  borderColor: 'rgba(74, 222, 128, 0.2)',
                  color: 'rgba(134, 239, 172, 0.6)',
                  backgroundColor: 'rgba(74, 222, 128, 0.035)',
                }}
                whileHover={{ borderColor: 'rgba(74, 222, 128, 0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                <ItemIcon size={14} aria-hidden="true" />
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
