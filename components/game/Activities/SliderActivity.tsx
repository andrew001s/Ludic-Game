'use client'

import { useCallback, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUp, Box, Gauge, Orbit, Ruler, Zap } from 'lucide-react'
import type { ActivityComponentProps, ActivityConfig } from '@/types/activity'
import { useActivityMetrics } from '@/hooks/useActivityMetrics'

export function SliderActivity({ activity, onComplete }: ActivityComponentProps) {
  const [value, setValue] = useState<number>(0)
  const [answered, setAnswered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const ac = activity as Extract<ActivityConfig, { type: 'slider' }>
  const isGravityHeightActivity = ac.id === 'activity-14'
  const { buildCompletion, registerInteraction, registerMistake, registerRetry } = useActivityMetrics(ac)

  const range = ac.max - ac.min
  const percent = ((value - ac.min) / range) * 100
  const speedPercent = Math.max(4, Math.min(100, percent))
  const simulationDuration = Math.max(0.55, 4.2 - (speedPercent / 100) * 3.35)
  const massKg = 10
  const gravity = 9.8
  const potentialEnergy = Math.round(massKg * gravity * value)
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
    [ac.min, ac.step, range, value],
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (answered) return
      e.preventDefault()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      setIsDragging(true)
      registerInteraction()
      setValue(getValueFromClientX(e.clientX))
    },
    [answered, getValueFromClientX, registerInteraction],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || answered) return
      registerInteraction()
      setValue(getValueFromClientX(e.clientX))
    },
    [answered, getValueFromClientX, isDragging, registerInteraction],
  )

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleConfirm = useCallback(() => {
    registerInteraction()
    if (!isCorrect) {
      registerMistake()
    }
    setAnswered(true)
  }, [isCorrect, registerInteraction, registerMistake])

  const handleReset = useCallback(() => {
    registerRetry()
    setAnswered(false)
  }, [registerRetry])

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

      <div
        className="overflow-hidden rounded-sm border p-4"
        style={{
          borderColor: 'rgba(74, 222, 128, 0.14)',
          background:
            'linear-gradient(180deg, rgba(74,222,128,0.045), rgba(0,0,0,0.06)), radial-gradient(circle at 15% 30%, rgba(74,222,128,0.12), transparent 26%)',
        }}
      >
        <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-widest" style={{ color: 'rgba(134, 239, 172, 0.45)' }}>
          <span>{isGravityHeightActivity ? 'simulacion gravitacional' : 'simulacion fisica'}</span>
          <span>{isGravityHeightActivity ? 'mas altura = mas energia potencial' : 'mas valor = mas velocidad'}</span>
        </div>

        {isGravityHeightActivity ? (
          <>
            <div className="relative h-48 overflow-hidden rounded-sm border" style={{ borderColor: 'rgba(74, 222, 128, 0.12)', backgroundColor: 'rgba(0, 0, 0, 0.18)' }}>
              <div className="absolute left-7 top-4 bottom-4 w-px" style={{ background: 'rgba(74, 222, 128, 0.18)' }} />
              <div className="absolute left-7 right-5 bottom-4 h-px" style={{ background: 'rgba(74, 222, 128, 0.18)' }} />
              <div className="absolute left-2 top-3 text-[10px] uppercase tracking-widest" style={{ color: 'rgba(134, 239, 172, 0.45)' }}>
                altura
              </div>
              <div className="absolute right-4 top-4 flex items-center gap-2 text-[10px] uppercase tracking-widest" style={{ color: 'rgba(216, 226, 143, 0.55)' }}>
                <ArrowUp size={12} />
                meta: {ac.correctValue} m
              </div>

              {Array.from({ length: 5 }).map((_, index) => {
                const markValue = 100 - index * 25
                const top = 18 + index * 32

                return (
                  <div key={markValue} className="absolute left-5 right-5" style={{ top }}>
                    <div className="absolute -left-3 text-[10px]" style={{ color: 'rgba(134, 239, 172, 0.32)' }}>
                      {markValue}
                    </div>
                    <div className="ml-5 h-px" style={{ backgroundColor: 'rgba(74, 222, 128, 0.08)' }} />
                  </div>
                )
              })}

              <div
                className="absolute left-11 bottom-4 w-16 rounded-t-sm"
                style={{
                  height: `${Math.max(14, percent * 1.28)}px`,
                  background: 'linear-gradient(180deg, rgba(74,222,128,0.2), rgba(74,222,128,0.08))',
                  border: '1px solid rgba(74, 222, 128, 0.18)',
                }}
              />

              <motion.div
                className="absolute left-24 grid h-10 w-10 place-items-center rounded-sm border"
                style={{
                  bottom: `${16 + percent * 1.28}px`,
                  borderColor: answered
                    ? isCorrect
                      ? 'rgba(74, 222, 128, 0.68)'
                      : 'rgba(239, 68, 68, 0.45)'
                    : 'rgba(74, 222, 128, 0.48)',
                  backgroundColor: 'rgba(74, 222, 128, 0.1)',
                  color: answered && !isCorrect ? 'rgba(239, 68, 68, 0.78)' : '#86efac',
                  boxShadow: '0 0 22px rgba(74, 222, 128, 0.16)',
                }}
                animate={{
                  bottom: `${16 + percent * 1.28}px`,
                }}
                transition={{ type: 'spring', stiffness: 220, damping: 24 }}
              >
                <Box size={19} aria-hidden="true" />
              </motion.div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { label: 'masa', value: `${massKg} kg`, icon: Box, fill: 62 },
                { label: 'gravedad', value: `${gravity} m/s²`, icon: Orbit, fill: 78 },
                { label: 'altura', value: `${value}${ac.unit}`, icon: Ruler, fill: percent },
                { label: 'energia potencial', value: `${potentialEnergy} J`, icon: Zap, fill: Math.min(100, (potentialEnergy / 9800) * 100) },
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
          </>
        ) : (
          <>
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
                { label: 'energia', value: `${value}${ac.unit}`, icon: Zap, fill: percent },
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
          </>
        )}
      </div>

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

      <div className="text-xs text-center tracking-wider" style={{ color: 'rgba(74, 222, 128, 0.3)' }}>
        {isGravityHeightActivity ? `${ac.label} objetivo: ${ac.correctValue}${ac.unit}` : ac.label}
      </div>

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
          <div
            className="absolute top-1/2 left-0 right-0 h-2 -translate-y-1/2 border"
            style={{
              borderColor: 'rgba(74, 222, 128, 0.2)',
              backgroundColor: 'rgba(74, 222, 128, 0.04)',
            }}
          />
          <div
            className="absolute top-1/2 left-0 h-2 -translate-y-1/2 border-y"
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
          <div
            className="absolute top-1/2 h-7 w-5 -translate-x-1/2 -translate-y-1/2 border"
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
              boxShadow: answered && isCorrect ? '0 0 8px rgba(74, 222, 128, 0.2)' : 'none',
            }}
          >
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ color: answered && isCorrect ? '#4ade80' : 'rgba(74, 222, 128, 0.4)' }}
            >
              <div className="h-3 w-1" style={{ backgroundColor: 'currentColor' }} />
            </div>
          </div>
          <div className="absolute -bottom-5 left-0 text-[10px]" style={{ color: 'rgba(74, 222, 128, 0.2)' }}>
            {ac.min}
          </div>
          <div className="absolute -bottom-5 right-0 text-[10px]" style={{ color: 'rgba(74, 222, 128, 0.2)' }}>
            {ac.max}
          </div>
        </div>
      </div>

      {!answered ? (
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
      ) : (
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
          <div className="mt-4 flex gap-3">
            {isCorrect ? (
              <motion.button
                onClick={() => onComplete(buildCompletion({ accuracyRatio: isCorrect ? 1 : 0 }))}
                className="btn-compact px-5 py-2 sm:px-6 text-xs tracking-widest uppercase border"
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
                className="btn-compact px-5 py-2 sm:px-6 text-xs tracking-widest uppercase border"
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
      )}
    </div>
  )
}
