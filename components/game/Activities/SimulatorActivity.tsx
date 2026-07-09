'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Gauge, Zap, ArrowRight, TestTube } from 'lucide-react'
import type { ActivityComponentProps, SimulatorActivity as SimulatorActivityConfig } from '@/types/activity'
import { useActivityMetrics } from '@/hooks/useActivityMetrics'

function useDriveKeyframe(id: string) {
  useEffect(() => {
    const key = `sim-drive-${id}`
    if (document.getElementById(key)) return
    const style = document.createElement('style')
    style.id = key
    style.textContent = `@keyframes ${key} { from { left: 88%; } to { left: 2%; } }`
    document.head.appendChild(style)
    return () => {
      const el = document.getElementById(key)
      if (el) el.remove()
    }
  }, [id])
}

export function SimulatorActivity({ activity, onComplete }: ActivityComponentProps) {
  const ac = activity as SimulatorActivityConfig
  const [phase, setPhase] = useState<'simulate' | 'question' | 'result'>('simulate')
  const [selectedVehicleId, setSelectedVehicleId] = useState(ac.vehicles[0].id)
  const [throttle, setThrottle] = useState(50)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [hasAnswered, setHasAnswered] = useState(false)
  const { buildCompletion, registerInteraction, registerMistake, registerRetry } = useActivityMetrics(ac)

  useDriveKeyframe(ac.id)

  const selectedVehicle = useMemo(
    () => ac.vehicles.find((v) => v.id === selectedVehicleId) ?? ac.vehicles[0],
    [selectedVehicleId, ac.vehicles],
  )

  const speed = (throttle / 100) * selectedVehicle.maxSpeed
  const kineticEnergy = 0.5 * selectedVehicle.massKg * speed * speed
  const duration = Math.max(0.5, 4 - (throttle / 100) * 3.5)

  const maxKE = Math.max(
    ...ac.vehicles.map((v) => 0.5 * v.massKg * v.maxSpeed * v.maxSpeed),
  )
  const energyBarPercent = Math.min(100, (kineticEnergy / maxKE) * 100)

  const isCorrect = selectedAnswer === ac.followUpCorrectIndex

  function handleThrottleChange(e: React.ChangeEvent<HTMLInputElement>) {
    registerInteraction()
    setThrottle(Number(e.target.value))
  }

  function handleProceedToQuestion() {
    registerInteraction()
    setPhase('question')
  }

  function handleAnswer(index: number) {
    if (hasAnswered) return
    registerInteraction()
    if (index !== ac.followUpCorrectIndex) {
      registerMistake()
    }
    setSelectedAnswer(index)
    setHasAnswered(true)
    setPhase('result')
  }

  function handleRetry() {
    registerRetry()
    setPhase('question')
    setSelectedAnswer(null)
    setHasAnswered(false)
  }

  const btnStyle = { fontFamily: '"Courier New", monospace' } as const

  return (
    <div className="activity-compact flex flex-col gap-5 sm:gap-6" style={{ fontFamily: '"Courier New", monospace' }}>
      <div className="activity-instruction text-xs tracking-widest uppercase" style={{ color: 'rgba(74, 222, 128, 0.4)' }}>
        {ac.instruction}
      </div>

      <p className="activity-text text-sm sm:text-base leading-relaxed" style={{ color: '#86efac' }}>
        {ac.description}
      </p>

      {phase === 'simulate' && (
        <div className="flex flex-col gap-5">
          {/* Vehicle selector */}
          <div className="activity-grid-3 grid grid-cols-3 gap-2">
            {ac.vehicles.map((v) => (
              <motion.button
                key={v.id}
                onClick={() => setSelectedVehicleId(v.id)}
                className="rounded-sm border p-3 text-center"
                style={{
                  borderColor:
                    selectedVehicleId === v.id
                      ? 'rgba(74, 222, 128, 0.5)'
                      : 'rgba(74, 222, 128, 0.12)',
                  backgroundColor:
                    selectedVehicleId === v.id
                      ? 'rgba(74, 222, 128, 0.08)'
                      : 'rgba(74, 222, 128, 0.03)',
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="text-xl mb-1">{v.emoji}</div>
                <div className="text-xs tracking-wider" style={{ color: '#86efac' }}>{v.name}</div>
                <div className="text-[10px] mt-1" style={{ color: 'rgba(134, 239, 172, 0.45)' }}>
                  {v.massKg} kg
                </div>
                <div className="text-[10px]" style={{ color: 'rgba(74, 222, 128, 0.3)' }}>
                  máx {v.maxSpeed} m/s
                </div>
              </motion.button>
            ))}
          </div>

          {/* Throttle slider */}
          <div
            className="rounded-sm border p-4"
            style={{
              borderColor: 'rgba(74, 222, 128, 0.14)',
              background:
                'linear-gradient(180deg, rgba(74,222,128,0.045), rgba(0,0,0,0.06)), radial-gradient(circle at 15% 30%, rgba(74,222,128,0.12), transparent 26%)',
            }}
          >
            <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-widest" style={{ color: 'rgba(134, 239, 172, 0.45)' }}>
              <Gauge size={13} aria-hidden="true" />
              <span>
                {selectedVehicle.name}: {speed.toFixed(1)} m/s ({Math.round(speed * 3.6)} km/h)
              </span>
            </div>

            <div className="relative h-8 flex items-center">
              <div
                className="absolute h-2 rounded-sm"
                style={{ left: 0, right: 0, backgroundColor: 'rgba(74, 222, 128, 0.08)' }}
              />
              <div
                className="absolute h-2 rounded-sm"
                style={{
                  left: 0,
                  width: `${throttle}%`,
                  backgroundColor: 'rgba(74, 222, 128, 0.25)',
                }}
              />
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={throttle}
                onChange={handleThrottleChange}
                className="relative w-full h-8 cursor-pointer opacity-0 z-10"
              />
              <div
                className="absolute h-5 w-2 rounded-sm pointer-events-none"
                style={{
                  left: `calc(${throttle}% - 4px)`,
                  backgroundColor: 'rgba(74, 222, 128, 0.6)',
                  transition: 'left 0.05s',
                }}
              />
            </div>

            <div className="flex justify-between text-[10px] mt-1" style={{ color: 'rgba(74, 222, 128, 0.2)' }}>
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Vehicle animation */}
          <div
            className="sim-animation relative h-14 sm:h-16 overflow-hidden rounded-sm border"
            style={{ borderColor: 'rgba(74, 222, 128, 0.12)', backgroundColor: 'rgba(0, 0, 0, 0.18)' }}
          >
            <div className="absolute inset-x-0 bottom-3 h-px" style={{ background: 'rgba(74, 222, 128, 0.18)' }} />
            <div
              className="absolute bottom-4 text-2xl"
              style={{
                animation: speed > 0 ? `sim-drive-${ac.id} ${duration}s linear infinite` : 'none',
                left: speed === 0 ? '44%' : undefined,
              }}
            >
              {selectedVehicle.emoji}
            </div>
            {Array.from({ length: Math.min(8, Math.ceil(throttle / 12)) }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-3 h-px w-5"
                style={{ backgroundColor: 'rgba(134, 239, 172, 0.3)' }}
                animate={{ opacity: [0.1, 0.8, 0.1] }}
                transition={{
                  duration: Math.max(0.15, 0.6 - (throttle / 100) * 0.45),
                  repeat: Infinity,
                  delay: i * 0.08,
                }}
              />
            ))}
          </div>

          {/* KE display */}
          <div
            className="rounded-sm border p-4"
            style={{
              borderColor: 'rgba(74, 222, 128, 0.14)',
              backgroundColor: 'rgba(74, 222, 128, 0.03)',
            }}
          >
            <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-widest" style={{ color: 'rgba(134, 239, 172, 0.45)' }}>
              <Zap size={13} aria-hidden="true" />
              <span>Energía Cinética</span>
            </div>

            <div
              className="mb-3 p-3 rounded-sm text-xs leading-relaxed"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', color: 'rgba(134, 239, 172, 0.7)' }}
            >
              <div>Ec = ½ × m × v²</div>
              <div className="mt-1" style={{ color: '#86efac' }}>
                Ec = ½ × {selectedVehicle.massKg} × ({speed.toFixed(1)})²
              </div>
              <div className="mt-1" style={{ color: '#4ade80' }}>
                Ec = {kineticEnergy.toLocaleString('es-ES', { maximumFractionDigits: 1 })} J
              </div>
            </div>

            <div className="h-2 overflow-hidden rounded-full" style={{ backgroundColor: 'rgba(74, 222, 128, 0.08)' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${energyBarPercent}%`,
                  background: 'linear-gradient(90deg, rgba(74,222,128,0.3), rgba(216,226,143,0.75))',
                  transition: 'width 0.15s',
                }}
              />
            </div>
          </div>

          {/* Continue */}
          <motion.button
            onClick={handleProceedToQuestion}
            className="btn-compact self-start flex items-center gap-2 px-5 py-2 sm:px-6 text-xs tracking-widest uppercase border"
            style={{
              color: '#4ade80',
              borderColor: 'rgba(74, 222, 128, 0.3)',
              ...btnStyle,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <TestTube size={14} aria-hidden="true" />
            Responder pregunta
            <ArrowRight size={14} aria-hidden="true" />
          </motion.button>
        </div>
      )}

      {phase === 'question' && (
        <div className="flex flex-col gap-5">
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#86efac' }}>
            {ac.followUpQuestion}
          </p>

          <div className="flex flex-col gap-2">
            {ac.followUpOptions.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswer(index)}
                className="rounded-sm border p-3 text-left text-xs leading-relaxed"
                style={{
                  borderColor:
                    selectedAnswer === index
                      ? 'rgba(74, 222, 128, 0.35)'
                      : 'rgba(74, 222, 128, 0.12)',
                  backgroundColor:
                    selectedAnswer === index
                      ? 'rgba(74, 222, 128, 0.06)'
                      : 'rgba(74, 222, 128, 0.03)',
                  color: '#86efac',
                }}
                whileHover={{ scale: 1.01, borderColor: 'rgba(74, 222, 128, 0.3)' }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px]"
                    style={{
                      borderColor: 'rgba(74, 222, 128, 0.25)',
                      color: 'rgba(134, 239, 172, 0.5)',
                    }}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {phase === 'result' && (
        <div
          className="p-4 border text-sm leading-relaxed"
          style={{
            borderColor: isCorrect ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            backgroundColor: isCorrect ? 'rgba(74, 222, 128, 0.05)' : 'rgba(239, 68, 68, 0.05)',
            color: isCorrect ? '#86efac' : 'rgba(239, 68, 68, 0.7)',
          }}
        >
          {isCorrect ? ac.feedback.success : ac.feedback.error}
          <div className="flex gap-3 mt-4">
            {isCorrect ? (
              <motion.button
                onClick={() => onComplete(buildCompletion({ accuracyRatio: isCorrect ? 1 : 0 }))}
                className="px-6 py-2 text-xs tracking-widest uppercase border"
                style={{
                  color: '#4ade80',
                  borderColor: 'rgba(74, 222, 128, 0.3)',
                  ...btnStyle,
                }}
                whileHover={{ scale: 1.02 }}
              >
                CONTINUAR
              </motion.button>
            ) : (
              <motion.button
                onClick={handleRetry}
                className="px-6 py-2 text-xs tracking-widest uppercase border"
                style={{
                  color: 'rgba(239, 68, 68, 0.7)',
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                  ...btnStyle,
                }}
                whileHover={{ scale: 1.02 }}
              >
                REINTENTAR
              </motion.button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
