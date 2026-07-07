'use client'

import { useState, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Box, Gauge, Zap } from 'lucide-react'
import type { ActivityConfig } from '@/types/activity'

export function SliderActivity({ activity, onComplete }: { activity: ActivityConfig; onComplete: () => void }) {
  const [value, setValue] = useState<number>(0)
  const [answered, setAnswered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const ac = activity as Extract<ActivityConfig, { type: 'slider' }>

  const range = ac.max - ac.min
  const percent = ((value - ac.min) / range) * 100
  const speedPercent = Math.max(4, Math.min(100, percent))
  const simulationDuration = Math.max(0.55, 4.2 - (speedPercent / 100) * 3.35)
  const isCorrect = Math.abs(value - ac.correctValue) <= ac.tolerance

  const getValueFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current
      if (!track) return value
      const rect = track.getBoundingClientRect()
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      const raw = ac.min + ratio * range
      return Math.round(raw / ac.step) * ac.step
    },
    [ac.min, range, ac.step, value],
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (answered) return
      e.preventDefault()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      setIsDragging(true)
      setValue(getValueFromClientX(e.clientX))
    },
    [answered, getValueFromClientX],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || answered) return
      setValue(getValueFromClientX(e.clientX))
    },
    [isDragging, answered, getValueFromClientX],
  )

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleConfirm = useCallback(() => {
    setAnswered(true)
  }, [])

  const handleReset = useCallback(() => {
    setAnswered(false)
  }, [])

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
        className="overflow-hidden rounded-sm border p-4"
        style={{
          borderColor: 'rgba(74, 222, 128, 0.14)',
          background:
            'linear-gradient(180deg, rgba(74,222,128,0.045), rgba(0,0,0,0.06)), radial-gradient(circle at 15% 30%, rgba(74,222,128,0.12), transparent 26%)',
        }}
      >
        <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-widest" style={{ color: 'rgba(134, 239, 172, 0.45)' }}>
          <span>simulación física</span>
          <span>más valor = más velocidad</span>
        </div>

        <div className="relative h-20 overflow-hidden rounded-sm border" style={{ borderColor: 'rgba(74, 222, 128, 0.12)', backgroundColor: 'rgba(0, 0, 0, 0.18)' }}>
          <div className="absolute inset-x-0 bottom-4 h-px" style={{ background: 'rgba(74, 222, 128, 0.18)' }} />
          <div className="absolute inset-x-4 bottom-5 flex justify-between">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="h-2 w-px" style={{ backgroundColor: 'rgba(74, 222, 128, 0.12)' }} />
            ))}
          </div>
          <motion.div
            className="absolute bottom-7 grid h-10 w-10 place-items-center rounded-sm border"
            style={{
              borderColor: answered
                ? isCorrect
                  ? 'rgba(74, 222, 128, 0.68)'
                  : 'rgba(239, 68, 68, 0.45)'
                : 'rgba(74, 222, 128, 0.48)',
              backgroundColor: 'rgba(74, 222, 128, 0.1)',
              color: answered && !isCorrect ? 'rgba(239, 68, 68, 0.78)' : '#86efac',
              boxShadow: '0 0 22px rgba(74, 222, 128, 0.16)',
            }}
            animate={{ left: ['4%', '88%'] }}
            transition={{ duration: simulationDuration, repeat: Infinity, ease: 'linear' }}
          >
            <Box size={19} aria-hidden="true" />
          </motion.div>
          <div className="absolute left-4 top-4 flex gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <motion.div
                key={index}
                className="h-px w-5"
                style={{ backgroundColor: 'rgba(134, 239, 172, 0.25)' }}
                animate={{ opacity: [0.15, 0.75, 0.15] }}
                transition={{ duration: simulationDuration / 2, repeat: Infinity, delay: index * 0.06 }}
              />
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { label: 'masa', value: '10 kg', icon: Box, fill: 62 },
            { label: 'velocidad', value: `${Math.round(speedPercent)}%`, icon: Gauge, fill: speedPercent },
            { label: 'energía', value: `${value}${ac.unit}`, icon: Zap, fill: percent },
          ].map((metric) => (
            <div key={metric.label} className="rounded-sm border p-2" style={{ borderColor: 'rgba(74, 222, 128, 0.12)', backgroundColor: 'rgba(74, 222, 128, 0.03)' }}>
              <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-widest" style={{ color: 'rgba(134, 239, 172, 0.52)' }}>
                <metric.icon size={13} aria-hidden="true" />
                {metric.label}
              </div>
              <div className="mb-2 text-xs" style={{ color: '#86efac' }}>{metric.value}</div>
              <div className="h-1 overflow-hidden rounded-full" style={{ backgroundColor: 'rgba(74, 222, 128, 0.08)' }}>
                <div
                  className="h-full transition-all duration-150"
                  style={{
                    width: `${Math.max(3, Math.min(100, metric.fill))}%`,
                    background: 'linear-gradient(90deg, rgba(74,222,128,0.35), rgba(216,226,143,0.75))',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Value display */}
      <div className="text-center">
        <span
          className="text-2xl font-bold tracking-wider"
          style={{
            color: answered ? (isCorrect ? '#4ade80' : 'rgba(239, 68, 68, 0.8)') : '#86efac',
            textShadow: answered && isCorrect ? '0 0 12px rgba(74, 222, 128, 0.3)' : 'none',
          }}
        >
          {value}
        </span>
        <span className="ml-2 text-sm" style={{ color: 'rgba(74, 222, 128, 0.4)' }}>
          {ac.unit}
        </span>
      </div>

      {/* Label */}
      <div className="text-xs text-center tracking-wider" style={{ color: 'rgba(74, 222, 128, 0.3)' }}>
        {ac.label}
      </div>

      {/* Slider track */}
      <div className="px-2">
        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="relative h-8 cursor-pointer select-none touch-none"
          style={{ cursor: answered ? 'default' : 'pointer' }}
        >
          {/* Track background */}
          <div
            className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 border"
            style={{
              borderColor: 'rgba(74, 222, 128, 0.2)',
              backgroundColor: 'rgba(74, 222, 128, 0.04)',
            }}
          />
          {/* Filled track */}
          <div
            className="absolute top-1/2 -translate-y-1/2 left-0 h-2 border-y"
            style={{
              width: `${percent}%`,
              borderColor: answered
                ? isCorrect
                  ? 'rgba(74, 222, 128, 0.4)'
                  : 'rgba(239, 68, 68, 0.3)'
                : 'rgba(74, 222, 128, 0.3)',
              backgroundColor: answered
                ? isCorrect
                  ? 'rgba(74, 222, 128, 0.15)'
                  : 'rgba(239, 68, 68, 0.08)'
                : 'rgba(74, 222, 128, 0.08)',
              transition: isDragging ? 'none' : 'width 0.1s',
            }}
          />
          {/* Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-7 border"
            style={{
              left: `${percent}%`,
              borderColor: answered
                ? isCorrect
                  ? 'rgba(74, 222, 128, 0.6)'
                  : 'rgba(239, 68, 68, 0.4)'
                : 'rgba(74, 222, 128, 0.5)',
              backgroundColor: answered
                ? isCorrect
                  ? 'rgba(74, 222, 128, 0.2)'
                  : 'rgba(239, 68, 68, 0.1)'
                : 'rgba(74, 222, 128, 0.1)',
              transition: isDragging ? 'none' : 'left 0.1s',
              boxShadow: answered && isCorrect
                ? '0 0 8px rgba(74, 222, 128, 0.2)'
                : 'none',
            }}
          >
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ color: answered && isCorrect ? '#4ade80' : 'rgba(74, 222, 128, 0.4)' }}
            >
              <div className="w-1 h-3" style={{ backgroundColor: 'currentColor' }} />
            </div>
          </div>
          {/* Min/Max labels */}
          <div className="absolute -bottom-5 left-0 text-[10px]" style={{ color: 'rgba(74, 222, 128, 0.2)' }}>
            {ac.min}
          </div>
          <div className="absolute -bottom-5 right-0 text-[10px]" style={{ color: 'rgba(74, 222, 128, 0.2)' }}>
            {ac.max}
          </div>
        </div>
      </div>

      {/* Actions */}
      {!answered ? (
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
      ) : (
        <>
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
            <div className="flex gap-3 mt-4">
              {isCorrect ? (
                <motion.button
                  onClick={onComplete}
                  className="px-6 py-2 text-xs tracking-widest uppercase border"
                  style={{
                    color: '#4ade80',
                    borderColor: 'rgba(74, 222, 128, 0.3)',
                    fontFamily: '"Courier New", monospace',
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  CONTINUAR
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleReset}
                  className="px-6 py-2 text-xs tracking-widest uppercase border"
                  style={{
                    color: 'rgba(239, 68, 68, 0.7)',
                    borderColor: 'rgba(239, 68, 68, 0.3)',
                    fontFamily: '"Courier New", monospace',
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  REINTENTAR
                </motion.button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}
