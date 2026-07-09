'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Bike, Box, Car, Circle, Gauge, Mountain, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ActivityComponentProps, ActivityConfig } from '@/types/activity'
import { useActivityMetrics } from '@/hooks/useActivityMetrics'

function getOptionIcon(option: string): LucideIcon {
  const normalized = option.toLowerCase()

  if (normalized.includes('movimiento') || normalized.includes('rápido')) return Gauge
  if (normalized.includes('automóvil') || normalized.includes('auto')) return Car
  if (normalized.includes('bicicleta')) return Bike
  if (normalized.includes('altura') || normalized.includes('roca')) return Mountain
  if (normalized.includes('caja') || normalized.includes('detenida') || normalized.includes('inmóvil')) return Box
  if (normalized.includes('energía') || normalized.includes('electricidad')) return Zap

  return Circle
}

export function MultipleChoiceActivity({ activity, onComplete }: ActivityComponentProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const ac = activity as Extract<ActivityConfig, { type: 'multiple-choice' }>
  const { buildCompletion, registerInteraction, registerMistake, registerRetry } = useActivityMetrics(ac)

  const handleSelect = useCallback(
    (index: number) => {
      if (answered) return
      registerInteraction()
      setSelected(index)
    },
    [answered, registerInteraction],
  )

  const handleConfirm = useCallback(() => {
    if (selected === null) return
    registerInteraction()
    if (selected !== ac.correctIndex) {
      registerMistake()
    }
    setAnswered(true)
  }, [ac.correctIndex, registerInteraction, registerMistake, selected])

  const handleRetry = useCallback(() => {
    registerRetry()
    setAnswered(false)
    setSelected(null)
  }, [registerRetry])

  const isCorrect = selected === ac.correctIndex

  return (
    <div
      className="activity-compact flex flex-col gap-5 sm:gap-6"
      style={{ fontFamily: '"Courier New", monospace' }}
    >
      <div className="activity-instruction text-xs tracking-widest uppercase" style={{ color: 'rgba(74, 222, 128, 0.4)' }}>
        {ac.instruction}
      </div>

      <p className="activity-text text-sm sm:text-base leading-relaxed" style={{ color: '#86efac' }}>
        {ac.question}
      </p>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'masa', icon: Box, value: 'importa' },
          { label: 'velocidad', icon: Gauge, value: 'impacta más' },
          { label: 'movimiento', icon: Zap, value: 'activa energía' },
        ].map((hint) => (
          <div
            key={hint.label}
            className="flex items-center gap-2 rounded-sm border px-3 py-2"
            style={{
              borderColor: 'rgba(74, 222, 128, 0.14)',
              backgroundColor: 'rgba(74, 222, 128, 0.035)',
              color: 'rgba(134, 239, 172, 0.68)',
            }}
          >
            <hint.icon size={16} aria-hidden="true" />
            <div className="min-w-0">
              <div className="text-[9px] uppercase tracking-widest opacity-50">{hint.label}</div>
              <div className="truncate text-[11px]">{hint.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {ac.options.map((option, i) => {
          const OptionIcon = getOptionIcon(option)
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
              <span className="flex items-center gap-3">
                <span
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full border"
                  style={{
                    borderColor,
                    backgroundColor: i === selected ? 'rgba(74, 222, 128, 0.1)' : 'rgba(0, 0, 0, 0.16)',
                  }}
                >
                  <OptionIcon size={16} aria-hidden="true" />
                </span>
                <span className="leading-relaxed">{option}</span>
              </span>
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
              onClick={() => onComplete(buildCompletion({ accuracyRatio: 1 }))}
              className="btn-compact block mt-4 px-5 py-2 sm:px-6 text-xs tracking-widest uppercase border"
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
          {!isCorrect && (
            <motion.button
              onClick={handleRetry}
              className="btn-compact block mt-4 px-5 py-2 sm:px-6 text-xs tracking-widest uppercase border"
              style={{
                color: 'rgba(239, 68, 68, 0.7)',
                borderColor: 'rgba(239, 68, 68, 0.3)',
                fontFamily: '"Courier New", monospace',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              REINTENTAR
            </motion.button>
          )}
        </motion.div>
      )}

      {!answered && selected !== null && (
        <motion.button
          onClick={handleConfirm}
          className="btn-compact self-start px-5 py-2 sm:px-6 text-xs tracking-widest uppercase border"
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
