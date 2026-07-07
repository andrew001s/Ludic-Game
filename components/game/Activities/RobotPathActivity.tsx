'use client'

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gauge, Zap, Cog, Bot, ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ActivityConfig } from '@/types/activity'

function getStepIcon(item: string): LucideIcon {
  const n = item.toLowerCase()
  if (n.includes('movimiento')) return Gauge
  if (n.includes('cin\u00E9tica') || n.includes('cinetica')) return Zap
  if (n.includes('motor')) return Cog
  if (n.includes('robot')) return Bot
  return Zap
}

function getStepColor(index: number): string {
  const colors = [
    'rgba(74, 222, 128, 0.25)',
    'rgba(96, 165, 250, 0.25)',
    'rgba(251, 146, 60, 0.25)',
    'rgba(192, 132, 252, 0.25)',
  ]
  return colors[index] ?? colors[0]
}

function getStepBorder(index: number): string {
  const colors = [
    'rgba(74, 222, 128, 0.4)',
    'rgba(96, 165, 250, 0.4)',
    'rgba(251, 146, 60, 0.4)',
    'rgba(192, 132, 252, 0.4)',
  ]
  return colors[index] ?? colors[0]
}

function seededShuffle<T>(arr: T[], seed: string): T[] {
  const result = [...arr]
  let hash = 0
  for (const c of seed) hash = (hash * 31 + c.charCodeAt(0)) >>> 0
  for (let i = result.length - 1; i > 0; i--) {
    hash = (hash * 1664525 + 1013904223) >>> 0
    const j = hash % (i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  if (result.every((v, i) => v === arr[i]) && result.length > 1) {
    ;[result[0], result[1]] = [result[1], result[0]]
  }
  return result
}

export function RobotPathActivity({ activity, onComplete }: { activity: ActivityConfig; onComplete: () => void }) {
  const ac = activity as Extract<ActivityConfig, { type: 'robot-path' }>
  const [slots, setSlots] = useState<(number | null)[]>([null, null, null, null])
  const [shakeSlots, setShakeSlots] = useState<Set<number>>(new Set())
  const [answered, setAnswered] = useState(false)
  const [glowStep, setGlowStep] = useState(-1)
  const [powerOn, setPowerOn] = useState(false)
  const dragIndexRef = useRef<number | null>(null)

  const shuffledItems = useMemo(() => seededShuffle(
    ac.items.map((_, i) => i),
    ac.id,
  ), [ac.id, ac.items.length])

  const placedIndices = useMemo(() => slots.filter((s): s is number => s !== null), [slots])
  const availableItems = useMemo(() => shuffledItems.filter((i) => !placedIndices.includes(i)), [shuffledItems, placedIndices])

  const isFilled = slots.every((s) => s !== null)
  const isCorrect = useMemo(
    () => answered && slots.every((s, i) => s === ac.correctOrder[i]),
    [answered, slots, ac.correctOrder],
  )

  useEffect(() => {
    if (answered && isCorrect) {
      const t1 = setTimeout(() => setGlowStep(0), 200)
      const t2 = setTimeout(() => setGlowStep(1), 500)
      const t3 = setTimeout(() => setGlowStep(2), 800)
      const t4 = setTimeout(() => setGlowStep(3), 1100)
      const t5 = setTimeout(() => setPowerOn(true), 1500)
      return () => {
        clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5)
      }
    }
  }, [answered, isCorrect])

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    dragIndexRef.current = index
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, slotIndex: number) => {
    e.preventDefault()
    if (answered) return
    const itemIndex = parseInt(e.dataTransfer.getData('text/plain'), 10)
    if (isNaN(itemIndex) || slots[slotIndex] !== null) return
    if (itemIndex === ac.correctOrder[slotIndex]) {
      const next = [...slots]
      next[slotIndex] = itemIndex
      setSlots(next)
    } else {
      setShakeSlots((prev) => new Set(prev).add(slotIndex))
      setTimeout(() => setShakeSlots((prev) => {
        const next = new Set(prev)
        next.delete(slotIndex)
        return next
      }), 500)
    }
  }, [answered, slots, ac.correctOrder])

  const handleSlotClick = useCallback((slotIndex: number) => {
    if (answered) return
    if (slots[slotIndex] === null) return
    const next = [...slots]
    next[slotIndex] = null
    setSlots(next)
  }, [answered, slots])

  const handleReset = useCallback(() => {
    if (answered) return
    setSlots([null, null, null, null])
    setShakeSlots(new Set())
    setGlowStep(-1)
    setPowerOn(false)
  }, [answered])

  const handleConfirm = useCallback(() => {
    if (!isFilled) return
    setAnswered(true)
    if (slots.every((s, i) => s === ac.correctOrder[i])) return
  }, [isFilled, slots, ac.correctOrder])

  return (
    <div className="flex flex-col gap-5" style={{ fontFamily: '"Courier New", monospace' }}>
      <div className="text-xs tracking-widest uppercase" style={{ color: 'rgba(74, 222, 128, 0.4)' }}>
        {ac.instruction}
      </div>
      <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#86efac' }}>
        {ac.question}
      </p>

      {/* Path visualization */}
      <div
        className="relative rounded-sm border p-4 sm:p-6 pt-8 sm:pt-10 pb-6"
        style={{
          borderColor: 'rgba(74, 222, 128, 0.14)',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(74, 222, 128, 0.03), transparent 70%)',
        }}
      >
        {/* Circuit trace lines */}
        <svg className="absolute inset-0 pointer-events-none w-full h-full" style={{ opacity: 0.2 }}>
          {[0, 1, 2].map((i) => {
            const x1 = `${(i + 1) * 20 + 5}%`
            const x2 = `${(i + 2) * 20 - 5}%`
            const lit = answered && isCorrect && glowStep >= i + 1
            return (
              <line key={i} x1={x1} y1="50%" x2={x2} y2="50%"
                stroke={lit ? 'rgba(74, 222, 128, 0.6)' : 'rgba(74, 222, 128, 0.1)'}
                strokeWidth="2" strokeDasharray="4 3"
              />
            )
          })}
        </svg>

        <div className="relative flex items-start justify-between gap-1 sm:gap-2">
          {ac.correctOrder.map((_, slotIndex) => {
            const placedItemIndex = slots[slotIndex]
            const ItemIcon = placedItemIndex !== null ? getStepIcon(ac.items[placedItemIndex]) : undefined
            const isShaking = shakeSlots.has(slotIndex)
            const isLit = answered && isCorrect && glowStep >= slotIndex

            return (
              <div key={slotIndex} className="flex-1 flex flex-col items-center gap-1.5">
                <motion.div
                  className="relative w-full aspect-square max-w-[90px] rounded-sm border-2 flex flex-col items-center justify-center gap-1 cursor-pointer select-none"
                  style={{
                    borderColor: isLit ? getStepBorder(slotIndex) : (placedItemIndex !== null ? 'rgba(74, 222, 128, 0.25)' : 'rgba(74, 222, 128, 0.08)'),
                    backgroundColor: placedItemIndex !== null
                      ? `rgba(74, 222, 128, 0.06)`
                      : 'rgba(74, 222, 128, 0.02)',
                    boxShadow: isLit
                      ? `0 0 18px ${getStepBorder(slotIndex)}, inset 0 0 12px ${getStepBorder(slotIndex)}`
                      : (placedItemIndex !== null ? '0 0 8px rgba(74, 222, 128, 0.08)' : 'none'),
                  }}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, slotIndex)}
                  onClick={() => handleSlotClick(slotIndex)}
                  animate={isShaking ? { x: [0, -4, 4, -4, 4, 0] } : {}}
                  transition={isShaking ? { duration: 0.35 } : undefined}
                  whileHover={!answered && placedItemIndex !== null ? { borderColor: 'rgba(239, 68, 68, 0.3)' } : undefined}
                >
                  {placedItemIndex !== null && ItemIcon ? (
                    <ItemIcon
                      size={22}
                      style={{ color: isLit ? getStepBorder(slotIndex) : 'rgba(74, 222, 128, 0.5)' }}
                    />
                  ) : (
                    <span className="text-lg" style={{ color: 'rgba(74, 222, 128, 0.06)' }}>?</span>
                  )}
                  {placedItemIndex !== null && (
                    <span
                      className="text-[8px] leading-tight text-center px-1"
                      style={{ color: isLit ? getStepBorder(slotIndex) : 'rgba(74, 222, 128, 0.35)' }}
                    >
                      {ac.items[placedItemIndex]}
                    </span>
                  )}
                </motion.div>
                <span className="text-[9px] tracking-wider" style={{ color: 'rgba(74, 222, 128, 0.3)' }}>
                  PASO {slotIndex + 1}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Card pool */}
      <div>
        <div className="text-[10px] tracking-widest uppercase mb-2" style={{ color: 'rgba(74, 222, 128, 0.2)' }}>
          PIEZAS DISPONIBLES
        </div>
        <div className="flex flex-wrap gap-2 min-h-[60px]">
          {availableItems.length === 0 && !answered && (
            <div className="w-full text-[10px] py-4 text-center" style={{ color: 'rgba(74, 222, 128, 0.15)' }}>
              Todas las piezas colocadas
            </div>
          )}
          {availableItems.map((itemIndex) => {
            const item = ac.items[itemIndex]
            const ItemIcon = getStepIcon(item)
            return (
              <div
                key={itemIndex}
                draggable={!answered}
                onDragStart={(e: React.DragEvent) => handleDragStart(e, itemIndex)}
                className="flex items-center gap-2 px-3 py-2 text-xs border rounded-sm cursor-grab active:cursor-grabbing select-none transition-all hover:scale-[1.03] active:scale-95"
                style={{
                  borderColor: getStepBorder(itemIndex),
                  color: 'rgba(134, 239, 172, 0.7)',
                  backgroundColor: 'rgba(74, 222, 128, 0.04)',
                  transition: 'transform 0.1s, border-color 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = getStepBorder(itemIndex).replace('0.4', '0.6') }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = getStepBorder(itemIndex) }}
              >
                <ItemIcon size={14} aria-hidden="true" />
                {item}
              </div>
            )
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 items-center">
        {placedIndices.length > 0 && !answered && (
          <motion.button
            onClick={handleReset}
            className="px-4 py-2 text-xs tracking-wider uppercase border"
            style={{ color: 'rgba(134, 239, 172, 0.4)', borderColor: 'rgba(74, 222, 128, 0.15)' }}
            whileHover={{ borderColor: 'rgba(74, 222, 128, 0.3)' }}
          >
            REINICIAR
          </motion.button>
        )}
        {isFilled && !answered && (
          <motion.button
            onClick={handleConfirm}
            className="px-6 py-2 text-xs tracking-widest uppercase border"
            style={{ color: '#4ade80', borderColor: 'rgba(74, 222, 128, 0.3)' }}
            whileHover={{ scale: 1.02 }}
          >
            CONFIRMAR
          </motion.button>
        )}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {answered && (
          <motion.div
            className="p-4 border text-sm leading-relaxed"
            style={{
              borderColor: isCorrect ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              backgroundColor: isCorrect ? 'rgba(74, 222, 128, 0.04)' : 'rgba(239, 68, 68, 0.04)',
              color: isCorrect ? '#86efac' : '#fca5a5',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {/* Power-on animation for success */}
            {isCorrect && (
              <motion.div
                className="mb-3 flex items-center gap-2 text-xs tracking-widest"
                initial={{ opacity: 0 }}
                animate={powerOn ? { opacity: 1 } : {}}
                style={{ color: 'rgba(74, 222, 128, 0.6)' }}
              >
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  style={{ display: 'inline-block' }}
                >
                  <Bot size={16} />
                </motion.span>
                SISTEMA ACTIVADO
              </motion.div>
            )}
            {isCorrect ? ac.feedback.success : ac.feedback.error}
            {isCorrect && (
              <motion.button
                onClick={onComplete}
                className="block mt-4 px-6 py-2 text-xs tracking-widest uppercase border"
                style={{ color: '#4ade80', borderColor: 'rgba(74, 222, 128, 0.3)' }}
                whileHover={{ scale: 1.02 }}
              >
                CONTINUAR
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
