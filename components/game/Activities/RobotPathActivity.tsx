'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Bot, Cog, Gauge, Lightbulb, Sparkles, Triangle, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ActivityComponentProps, ActivityConfig } from '@/types/activity'
import { useActivityMetrics } from '@/hooks/useActivityMetrics'

function getStepIcon(item: string): LucideIcon {
  const normalized = item.toLowerCase()
  if (normalized.includes('fuente')) return Zap
  if (normalized.includes('cable')) return ArrowRight
  if (normalized.includes('interruptor')) return Cog
  if (normalized.includes('bombilla')) return Lightbulb
  if (normalized.includes('movimiento')) return Gauge
  if (normalized.includes('cinética') || normalized.includes('cinetica')) return Zap
  if (normalized.includes('motor')) return Cog
  if (normalized.includes('robot')) return Bot
  return Zap
}

function getCircuitTerminalLabel(item: string): string {
  const normalized = item.toLowerCase()
  if (normalized.includes('fuente')) return 'entrada de energia'
  if (normalized.includes('cable')) return 'conexion conductora'
  if (normalized.includes('interruptor')) return 'control del paso'
  if (normalized.includes('bombilla')) return 'salida de luz'
  return 'terminal'
}

function getNodeIcon(type: 'source' | 'mirror' | 'prism' | 'receiver'): LucideIcon {
  if (type === 'source') return Zap
  if (type === 'prism') return Triangle
  if (type === 'receiver') return Sparkles
  return ArrowRight
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
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  for (let index = result.length - 1; index > 0; index -= 1) {
    hash = (hash * 1664525 + 1013904223) >>> 0
    const swapIndex = hash % (index + 1)
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }
  if (result.every((value, index) => value === arr[index]) && result.length > 1) {
    ;[result[0], result[1]] = [result[1], result[0]]
  }
  return result
}

function arraysMatch(a: number[], b: number[]) {
  return a.length === b.length && a.every((value, index) => value === b[index])
}

export function RobotPathActivity({ activity, onComplete }: ActivityComponentProps) {
  const ac = activity as Extract<ActivityConfig, { type: 'robot-path' }>
  const isRotationMode = ac.mode === 'light-rotation' && Array.isArray(ac.nodes) && ac.nodes.length > 0
  const isMagneticCircuitMode = ac.mode === 'magnetic-circuit'

  const [slots, setSlots] = useState<(number | null)[]>([null, null, null, null])
  const [shakeSlots, setShakeSlots] = useState<Set<number>>(new Set())
  const [wrongItemIndex, setWrongItemIndex] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [glowStep, setGlowStep] = useState(-1)
  const [powerOn, setPowerOn] = useState(false)
  const [rotations, setRotations] = useState<number[]>(() => ac.nodes?.map((node) => node.initialRotation) ?? [])
  const [followUpSelected, setFollowUpSelected] = useState<number[]>([])
  const [followUpAnswered, setFollowUpAnswered] = useState(false)
  const dragIndexRef = useRef<number | null>(null)
  const { buildCompletion, registerInteraction, registerMistake, registerRetry } = useActivityMetrics(ac)
  const nodes = useMemo(() => ac.nodes ?? [], [ac.nodes])

  const shuffledItems = useMemo(
    () => seededShuffle(ac.items.map((_, index) => index), ac.id),
    [ac.id, ac.items],
  )
  const placedIndices = useMemo(() => slots.filter((slot): slot is number => slot !== null), [slots])
  const availableItems = useMemo(() => shuffledItems.filter((index) => !placedIndices.includes(index)), [shuffledItems, placedIndices])
  const isFilled = slots.every((slot) => slot !== null)
  const nextMagneticSlot = useMemo(() => slots.findIndex((slot) => slot === null), [slots])

  const orderSolved = useMemo(
    () => slots.every((slot, index) => slot === ac.correctOrder[index]),
    [ac.correctOrder, slots],
  )

  const rotationSolved = useMemo(
    () => !isRotationMode || nodes.every((node, index) => rotations[index] === node.correctRotation),
    [isRotationMode, nodes, rotations],
  )

  const followUpSolved = useMemo(
    () =>
      !isRotationMode ||
      !ac.followUpCorrectIndices ||
      arraysMatch([...followUpSelected].sort((a, b) => a - b), [...ac.followUpCorrectIndices].sort((a, b) => a - b)),
    [ac.followUpCorrectIndices, followUpSelected, isRotationMode],
  )

  const isCorrect = isRotationMode ? rotationSolved && followUpSolved : answered && orderSolved
  const canConfirmRotation = rotationSolved && followUpSelected.length > 0
  const showFollowUp = isRotationMode && rotationSolved

  useEffect(() => {
    if (answered && isCorrect) {
      const timers = [
        setTimeout(() => setGlowStep(0), 200),
        setTimeout(() => setGlowStep(1), 500),
        setTimeout(() => setGlowStep(2), 800),
        setTimeout(() => setGlowStep(3), 1100),
        setTimeout(() => setPowerOn(true), 1500),
      ]

      return () => {
        for (const timer of timers) clearTimeout(timer)
      }
    }
  }, [answered, isCorrect])

  const handleDragStart = (e: React.DragEvent, index: number) => {
    registerInteraction()
    dragIndexRef.current = index
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault()
    if (answered) return
    const itemIndex = parseInt(e.dataTransfer.getData('text/plain'), 10)
    if (Number.isNaN(itemIndex) || slots[slotIndex] !== null) return

    if (itemIndex === ac.correctOrder[slotIndex]) {
      const next = [...slots]
      next[slotIndex] = itemIndex
      setSlots(next)
      return
    }

    registerMistake()
    setShakeSlots((prev) => new Set(prev).add(slotIndex))
    setTimeout(() => {
      setShakeSlots((prev) => {
        const next = new Set(prev)
        next.delete(slotIndex)
        return next
      })
    }, 500)
  }

  const handleSlotClick = (slotIndex: number) => {
    if (answered || slots[slotIndex] === null || isMagneticCircuitMode) return
    registerInteraction()
    const next = [...slots]
    next[slotIndex] = null
    setSlots(next)
  }

  const handleMagneticSelect = (itemIndex: number) => {
    if (!isMagneticCircuitMode || answered) return
    if (nextMagneticSlot < 0) return
    registerInteraction()

    const expectedIndex = ac.correctOrder[nextMagneticSlot]
    if (itemIndex !== expectedIndex) {
      registerMistake()
      setWrongItemIndex(itemIndex)
      window.setTimeout(() => {
        setWrongItemIndex((current) => (current === itemIndex ? null : current))
      }, 420)
      return
    }

    const nextSlots = [...slots]
    nextSlots[nextMagneticSlot] = itemIndex
    setSlots(nextSlots)

    if (nextSlots.every((slot) => slot !== null)) {
      window.setTimeout(() => setAnswered(true), 220)
    }
  }

  const handleRotateNode = (index: number) => {
    if (!isRotationMode || answered) return
    registerInteraction()
    setRotations((prev) => prev.map((value, nodeIndex) => (nodeIndex === index ? (value + 90) % 360 : value)))
  }

  const handleFollowUpToggle = (index: number) => {
    if (!showFollowUp || followUpAnswered || answered) return
    registerInteraction()
    setFollowUpSelected((prev) =>
      prev.includes(index) ? prev.filter((value) => value !== index) : [...prev, index],
    )
  }

  const handleReset = () => {
    registerRetry()
    setSlots([null, null, null, null])
    setShakeSlots(new Set())
    setWrongItemIndex(null)
    setGlowStep(-1)
    setPowerOn(false)
    setRotations(ac.nodes?.map((node) => node.initialRotation) ?? [])
    setFollowUpSelected([])
    setFollowUpAnswered(false)
    setAnswered(false)
  }

  const handleConfirm = () => {
    if (isRotationMode) {
      if (!canConfirmRotation) return
      registerInteraction()
      if (!followUpSolved) {
        registerMistake()
      }
      setFollowUpAnswered(true)
      setAnswered(true)
      return
    }

    if (!isFilled) return
    registerInteraction()
    if (!orderSolved) {
      registerMistake()
    }
    setAnswered(true)
  }

  return (
    <div className="activity-compact flex flex-col gap-5" style={{ fontFamily: '"Courier New", monospace' }}>
      <div className="activity-instruction text-xs tracking-widest uppercase" style={{ color: 'rgba(74, 222, 128, 0.4)' }}>
        {ac.instruction}
      </div>
      <p className="activity-text text-sm sm:text-base leading-relaxed" style={{ color: '#86efac' }}>
        {ac.question}
      </p>

      {isRotationMode ? (
        <div
          className="relative rounded-sm border p-4 sm:p-6"
          style={{
            borderColor: 'rgba(74, 222, 128, 0.14)',
            background: 'radial-gradient(ellipse at 50% 50%, rgba(251, 191, 36, 0.06), transparent 70%)',
          }}
        >
          <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-widest" style={{ color: 'rgba(216, 226, 143, 0.5)' }}>
            <span>haz clic para girar 90°</span>
            <span>{rotationSolved ? 'haz alineado' : 'guia la luz al receptor'}</span>
          </div>

          <div className="relative h-[300px] overflow-hidden rounded-sm border" style={{ borderColor: 'rgba(74, 222, 128, 0.12)', backgroundColor: 'rgba(0, 0, 0, 0.18)' }}>
            <svg className="absolute inset-0 h-full w-full pointer-events-none">
              {rotationSolved && (
                <>
                  {nodes.slice(0, -1).map((node, index) => {
                    const next = nodes[index + 1]
                    return (
                      <motion.line
                        key={`${node.id}-${next.id}`}
                        x1={`${node.x}%`}
                        y1={`${node.y}%`}
                        x2={`${next.x}%`}
                        y2={`${next.y}%`}
                        stroke="rgba(251, 191, 36, 0.85)"
                        strokeWidth="4"
                        initial={{ pathLength: 0, opacity: 0.35 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.45, delay: index * 0.18 }}
                      />
                    )
                  })}
                </>
              )}
              {!rotationSolved && nodes.length > 1 && (
                <line
                  x1={`${nodes[0].x}%`}
                  y1={`${nodes[0].y}%`}
                  x2={`${nodes[1].x}%`}
                  y2={`${nodes[1].y}%`}
                  stroke="rgba(251, 191, 36, 0.18)"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                />
              )}
            </svg>

            {nodes.map((node, index) => {
              const NodeIcon = getNodeIcon(node.type)
              const isNodeCorrect = rotations[index] === node.correctRotation

              return (
                <motion.button
                  key={node.id}
                  type="button"
                  onClick={() => handleRotateNode(index)}
                  className="absolute grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-sm border-2"
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    borderColor: isNodeCorrect ? 'rgba(251, 191, 36, 0.62)' : 'rgba(74, 222, 128, 0.28)',
                    backgroundColor: isNodeCorrect ? 'rgba(251, 191, 36, 0.12)' : 'rgba(74, 222, 128, 0.05)',
                    boxShadow: isNodeCorrect ? '0 0 24px rgba(251, 191, 36, 0.18)' : 'none',
                    transform: `translate(-50%, -50%) rotate(${rotations[index]}deg)`,
                  }}
                  whileHover={answered ? {} : { scale: 1.04 }}
                  whileTap={answered ? {} : { scale: 0.97 }}
                  disabled={answered}
                >
                  <NodeIcon size={22} style={{ color: isNodeCorrect ? '#facc15' : '#86efac' }} />
                  <span
                    className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] uppercase tracking-wider"
                    style={{ color: 'rgba(223, 233, 174, 0.6)', transform: `translateX(-50%) rotate(${-rotations[index]}deg)` }}
                  >
                    {node.label}
                  </span>
                  <span
                    className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px]"
                    style={{ color: 'rgba(251, 191, 36, 0.72)', transform: `translateX(-50%) rotate(${-rotations[index]}deg)` }}
                  >
                    {rotations[index]}°
                  </span>
                </motion.button>
              )
            })}
          </div>

          <AnimatePresence>
            {showFollowUp && (
              <motion.div
                className="mt-4 rounded-sm border p-4"
                style={{
                  borderColor: 'rgba(251, 191, 36, 0.24)',
                  backgroundColor: 'rgba(251, 191, 36, 0.06)',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <div className="mb-3 text-sm leading-relaxed" style={{ color: '#fef3c7' }}>
                  {ac.followUpQuestion}
                </div>
                <div className="flex flex-col gap-2">
                  {ac.followUpOptions?.map((option, index) => {
                    const selected = followUpSelected.includes(index)

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleFollowUpToggle(index)}
                        className="w-full rounded-sm border px-4 py-3 text-left text-sm transition-all duration-150"
                        style={{
                          borderColor: selected ? 'rgba(251, 191, 36, 0.58)' : 'rgba(74, 222, 128, 0.18)',
                          backgroundColor: selected ? 'rgba(251, 191, 36, 0.12)' : 'rgba(74, 222, 128, 0.03)',
                          color: selected ? '#fef3c7' : 'rgba(134, 239, 172, 0.8)',
                        }}
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : isMagneticCircuitMode ? (
        <>
          <div
            className="relative overflow-hidden rounded-sm border p-4 sm:p-6"
            style={{
              borderColor: 'rgba(74, 222, 128, 0.14)',
              background:
                'radial-gradient(circle at 50% 28%, rgba(74,222,128,0.08), transparent 42%), linear-gradient(180deg, rgba(74,222,128,0.04), rgba(0,0,0,0.12))',
            }}
          >
            <div className="mb-4 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.28em]" style={{ color: 'rgba(216, 226, 143, 0.52)' }}>
              <span>terminal activo: {nextMagneticSlot >= 0 ? `paso ${nextMagneticSlot + 1}` : 'circuito completo'}</span>
              <span>{powerOn ? 'bombilla encendida' : 'elige el modulo que encaja'}</span>
            </div>

            <div className="relative overflow-hidden rounded-sm border p-4 sm:p-5" style={{ borderColor: 'rgba(74, 222, 128, 0.1)', backgroundColor: 'rgba(0, 0, 0, 0.16)' }}>
              <svg className="absolute inset-0 h-full w-full pointer-events-none">
                {ac.correctOrder.slice(0, -1).map((_, index) => {
                  const lit = slots[index] !== null && (slots[index + 1] !== null || answered)
                  const x1 = `${16 + index * 22}%`
                  const x2 = `${34 + index * 22}%`

                  return (
                    <line
                      key={index}
                      x1={x1}
                      y1="45%"
                      x2={x2}
                      y2="45%"
                      stroke={lit ? 'rgba(96, 165, 250, 0.85)' : 'rgba(74, 222, 128, 0.12)'}
                      strokeWidth="4"
                      strokeDasharray={lit ? '0' : '8 7'}
                    />
                  )
                })}
              </svg>

              <div className="relative grid grid-cols-4 gap-3">
                {ac.correctOrder.map((expectedItemIndex, slotIndex) => {
                  const placedItemIndex = slots[slotIndex]
                  const isActive = !answered && nextMagneticSlot === slotIndex
                  const isLit = glowStep >= slotIndex || (placedItemIndex !== null && !answered)
                  const ItemIcon = placedItemIndex !== null ? getStepIcon(ac.items[placedItemIndex]) : getStepIcon(ac.items[expectedItemIndex])

                  return (
                    <motion.div
                      key={slotIndex}
                      className="flex flex-col items-center gap-2"
                      animate={isActive ? { y: [0, -3, 0] } : {}}
                      transition={isActive ? { duration: 1.3, repeat: Infinity, ease: 'easeInOut' } : undefined}
                    >
                      <div
                        className="relative flex aspect-[0.9] w-full min-h-[118px] items-center justify-center rounded-sm border-2 px-3 py-3"
                        style={{
                          borderColor: answered
                            ? isLit
                              ? 'rgba(96, 165, 250, 0.72)'
                              : 'rgba(74, 222, 128, 0.2)'
                            : isActive
                              ? 'rgba(250, 204, 21, 0.58)'
                              : placedItemIndex !== null
                                ? 'rgba(74, 222, 128, 0.34)'
                                : 'rgba(74, 222, 128, 0.12)',
                          backgroundColor: placedItemIndex !== null
                            ? 'rgba(74, 222, 128, 0.08)'
                            : isActive
                              ? 'rgba(250, 204, 21, 0.07)'
                              : 'rgba(74, 222, 128, 0.025)',
                          boxShadow: answered && isLit
                            ? '0 0 24px rgba(96, 165, 250, 0.24), inset 0 0 18px rgba(96, 165, 250, 0.12)'
                            : isActive
                              ? '0 0 20px rgba(250, 204, 21, 0.16)'
                              : 'none',
                        }}
                      >
                        <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-[9px] uppercase tracking-[0.22em]" style={{ color: 'rgba(223, 233, 174, 0.36)' }}>
                          <span>terminal</span>
                          <span>{slotIndex + 1}</span>
                        </div>

                        <div className="absolute top-8 left-1/2 h-2 w-10 -translate-x-1/2 rounded-full" style={{ backgroundColor: 'rgba(74, 222, 128, 0.1)' }} />

                        <div className="flex flex-col items-center gap-2 text-center">
                          <div
                            className="grid h-14 w-14 place-items-center rounded-full border"
                            style={{
                              borderColor: placedItemIndex !== null ? 'rgba(96, 165, 250, 0.58)' : 'rgba(74, 222, 128, 0.18)',
                              backgroundColor: placedItemIndex !== null ? 'rgba(96, 165, 250, 0.12)' : 'rgba(0, 0, 0, 0.16)',
                              color: placedItemIndex !== null ? '#93c5fd' : 'rgba(134, 239, 172, 0.42)',
                            }}
                          >
                            <ItemIcon size={24} aria-hidden="true" />
                          </div>

                          <div className="min-h-[2.2rem] text-[11px] leading-snug" style={{ color: placedItemIndex !== null ? '#dbeafe' : 'rgba(223, 233, 174, 0.62)' }}>
                            {placedItemIndex !== null ? ac.items[placedItemIndex] : 'Esperando modulo'}
                          </div>
                        </div>

                        <div className="absolute bottom-2 left-2 right-2 text-center text-[9px] uppercase tracking-[0.16em]" style={{ color: isActive ? 'rgba(250, 204, 21, 0.86)' : 'rgba(134, 239, 172, 0.28)' }}>
                          {getCircuitTerminalLabel(ac.items[expectedItemIndex])}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              <motion.div
                className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full border"
                animate={powerOn ? { scale: [1, 1.08, 1], opacity: [0.92, 1, 0.92] } : {}}
                transition={powerOn ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } : undefined}
                style={{
                  borderColor: powerOn ? 'rgba(250, 204, 21, 0.8)' : 'rgba(250, 204, 21, 0.18)',
                  backgroundColor: powerOn ? 'rgba(250, 204, 21, 0.16)' : 'rgba(250, 204, 21, 0.04)',
                  boxShadow: powerOn ? '0 0 26px rgba(250, 204, 21, 0.34)' : 'none',
                  color: powerOn ? '#fde68a' : 'rgba(250, 204, 21, 0.38)',
                }}
              >
                <Lightbulb size={24} aria-hidden="true" />
              </motion.div>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-[10px] tracking-widest uppercase" style={{ color: 'rgba(74, 222, 128, 0.24)' }}>
              <span>Modulos disponibles</span>
              <span>{availableItems.length > 0 ? 'haz clic para probar' : 'todos conectados'}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {availableItems.map((itemIndex) => {
                const item = ac.items[itemIndex]
                const ItemIcon = getStepIcon(item)
                const isWrong = wrongItemIndex === itemIndex

                return (
                  <motion.button
                    key={itemIndex}
                    type="button"
                    onClick={() => handleMagneticSelect(itemIndex)}
                    className="rounded-sm border px-3 py-3 text-left"
                    style={{
                      borderColor: isWrong ? 'rgba(239, 68, 68, 0.46)' : 'rgba(74, 222, 128, 0.2)',
                      backgroundColor: isWrong ? 'rgba(239, 68, 68, 0.08)' : 'rgba(74, 222, 128, 0.035)',
                      color: isWrong ? '#fca5a5' : '#86efac',
                    }}
                    animate={isWrong ? { x: [0, -4, 4, -4, 4, 0] } : { x: 0 }}
                    whileHover={{ scale: 1.015, borderColor: 'rgba(74, 222, 128, 0.4)' }}
                    whileTap={{ scale: 0.985 }}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <div
                        className="grid h-9 w-9 place-items-center rounded-full border"
                        style={{
                          borderColor: isWrong ? 'rgba(239, 68, 68, 0.3)' : 'rgba(74, 222, 128, 0.24)',
                          backgroundColor: isWrong ? 'rgba(239, 68, 68, 0.08)' : 'rgba(0, 0, 0, 0.18)',
                        }}
                      >
                        <ItemIcon size={16} aria-hidden="true" />
                      </div>
                      <div className="text-[11px] uppercase tracking-[0.2em]" style={{ color: 'rgba(223, 233, 174, 0.44)' }}>
                        modulo
                      </div>
                    </div>
                    <div className="text-sm leading-snug">{item}</div>
                    <div className="mt-2 text-[10px] uppercase tracking-[0.18em]" style={{ color: isWrong ? 'rgba(252, 165, 165, 0.76)' : 'rgba(134, 239, 172, 0.35)' }}>
                      {isWrong ? 'no encaja aqui' : 'probar conexion'}
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className="relative rounded-sm border p-4 sm:p-6 pt-8 sm:pt-10 pb-6"
            style={{
              borderColor: 'rgba(74, 222, 128, 0.14)',
              background: 'radial-gradient(ellipse at 50% 50%, rgba(74, 222, 128, 0.03), transparent 70%)',
            }}
          >
            <svg className="absolute inset-0 pointer-events-none h-full w-full" style={{ opacity: 0.2 }}>
              {[0, 1, 2].map((index) => {
                const x1 = `${(index + 1) * 20 + 5}%`
                const x2 = `${(index + 2) * 20 - 5}%`
                const lit = answered && orderSolved && glowStep >= index + 1
                return (
                  <line
                    key={index}
                    x1={x1}
                    y1="50%"
                    x2={x2}
                    y2="50%"
                    stroke={lit ? 'rgba(74, 222, 128, 0.6)' : 'rgba(74, 222, 128, 0.1)'}
                    strokeWidth="2"
                    strokeDasharray="4 3"
                  />
                )
              })}
            </svg>

            <div className="relative flex items-start justify-between gap-1 sm:gap-2">
              {ac.correctOrder.map((_, slotIndex) => {
                const placedItemIndex = slots[slotIndex]
                const ItemIcon = placedItemIndex !== null ? getStepIcon(ac.items[placedItemIndex]) : undefined
                const isShaking = shakeSlots.has(slotIndex)
                const isLit = answered && orderSolved && glowStep >= slotIndex

                return (
                  <div key={slotIndex} className="flex flex-1 flex-col items-center gap-1.5">
                    <motion.div
                      className="relative flex aspect-square w-full max-w-[90px] cursor-pointer select-none flex-col items-center justify-center gap-1 rounded-sm border-2"
                      style={{
                        borderColor: isLit ? getStepBorder(slotIndex) : placedItemIndex !== null ? 'rgba(74, 222, 128, 0.25)' : 'rgba(74, 222, 128, 0.08)',
                        backgroundColor: placedItemIndex !== null ? 'rgba(74, 222, 128, 0.06)' : 'rgba(74, 222, 128, 0.02)',
                        boxShadow: isLit ? `0 0 18px ${getStepBorder(slotIndex)}, inset 0 0 12px ${getStepBorder(slotIndex)}` : placedItemIndex !== null ? '0 0 8px rgba(74, 222, 128, 0.08)' : 'none',
                      }}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, slotIndex)}
                      onClick={() => handleSlotClick(slotIndex)}
                      animate={isShaking ? { x: [0, -4, 4, -4, 4, 0] } : {}}
                      transition={isShaking ? { duration: 0.35 } : undefined}
                      whileHover={!answered && placedItemIndex !== null ? { borderColor: 'rgba(239, 68, 68, 0.3)' } : undefined}
                    >
                      {placedItemIndex !== null && ItemIcon ? (
                        <ItemIcon size={22} style={{ color: isLit ? getStepBorder(slotIndex) : 'rgba(74, 222, 128, 0.5)' }} />
                      ) : (
                        <span className="text-lg" style={{ color: 'rgba(74, 222, 128, 0.06)' }}>?</span>
                      )}
                      {placedItemIndex !== null && (
                        <span className="px-1 text-center text-[8px] leading-tight" style={{ color: isLit ? getStepBorder(slotIndex) : 'rgba(74, 222, 128, 0.35)' }}>
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

          <div>
            <div className="mb-2 text-[10px] tracking-widest uppercase" style={{ color: 'rgba(74, 222, 128, 0.2)' }}>
              PIEZAS DISPONIBLES
            </div>
            <div className="flex min-h-[60px] flex-wrap gap-2">
              {availableItems.length === 0 && !answered && (
                <div className="w-full py-4 text-center text-[10px]" style={{ color: 'rgba(74, 222, 128, 0.15)' }}>
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
                    onDragStart={(e) => handleDragStart(e, itemIndex)}
                    className="flex cursor-grab select-none items-center gap-2 rounded-sm border px-3 py-2 text-xs transition-all hover:scale-[1.03] active:scale-95"
                    style={{
                      borderColor: getStepBorder(itemIndex),
                      color: 'rgba(134, 239, 172, 0.7)',
                      backgroundColor: 'rgba(74, 222, 128, 0.04)',
                      transition: 'transform 0.1s, border-color 0.15s',
                    }}
                  >
                    <ItemIcon size={14} aria-hidden="true" />
                    {item}
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

      <div className="flex items-center gap-3">
        {((isRotationMode && !answered) || (!isRotationMode && placedIndices.length > 0 && !answered)) && (
          <motion.button
            onClick={handleReset}
            className="px-4 py-2 text-xs tracking-wider uppercase border"
            style={{ color: 'rgba(134, 239, 172, 0.4)', borderColor: 'rgba(74, 222, 128, 0.15)' }}
            whileHover={{ borderColor: 'rgba(74, 222, 128, 0.3)' }}
          >
            REINICIAR
          </motion.button>
        )}
        {isRotationMode ? (
          !answered && (
            <motion.button
              onClick={handleConfirm}
              className="btn-compact px-5 py-2 sm:px-6 text-xs tracking-widest uppercase border"
              style={{
                color: canConfirmRotation ? '#facc15' : 'rgba(250, 204, 21, 0.35)',
                borderColor: canConfirmRotation ? 'rgba(250, 204, 21, 0.4)' : 'rgba(250, 204, 21, 0.14)',
              }}
              whileHover={canConfirmRotation ? { scale: 1.02 } : {}}
            >
              VALIDAR HAZ
            </motion.button>
          )
        ) : (
          isFilled && !answered && !isMagneticCircuitMode && (
            <motion.button
              onClick={handleConfirm}
              className="btn-compact px-5 py-2 sm:px-6 text-xs tracking-widest uppercase border"
              style={{ color: '#4ade80', borderColor: 'rgba(74, 222, 128, 0.3)' }}
              whileHover={{ scale: 1.02 }}
            >
              CONFIRMAR
            </motion.button>
          )
        )}
      </div>

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
            {isCorrect && (
              <motion.div
                className="mb-3 flex items-center gap-2 text-xs tracking-widest"
                initial={{ opacity: 0 }}
                animate={powerOn ? { opacity: 1 } : {}}
                style={{ color: isRotationMode ? 'rgba(250, 204, 21, 0.75)' : 'rgba(74, 222, 128, 0.6)' }}
              >
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  style={{ display: 'inline-block' }}
                >
                  {isRotationMode ? <Sparkles size={16} /> : <Bot size={16} />}
                </motion.span>
                {isRotationMode ? 'HAZ FOTONICO ESTABLE' : 'SISTEMA ACTIVADO'}
              </motion.div>
            )}
            {isCorrect ? ac.feedback.success : ac.feedback.error}
            {isCorrect && (
              <motion.button
                onClick={() =>
                  onComplete(
                    buildCompletion({
                      accuracyRatio:
                        isRotationMode && ac.followUpCorrectIndices
                          ? ac.followUpCorrectIndices.length > 0
                            ? followUpSelected.filter((index) => ac.followUpCorrectIndices?.includes(index)).length /
                              ac.followUpCorrectIndices.length
                            : 1
                          : isCorrect
                            ? 1
                            : 0,
                    }),
                  )
                }
                className="btn-compact block mt-4 px-5 py-2 sm:px-6 text-xs tracking-widest uppercase border"
                style={{ color: '#4ade80', borderColor: 'rgba(74, 222, 128, 0.3)' }}
                whileHover={{ scale: 1.02 }}
              >
                CONTINUAR
              </motion.button>
            )}
            {!isCorrect && (
              <motion.button
                onClick={handleReset}
                className="btn-compact block mt-4 px-5 py-2 sm:px-6 text-xs tracking-widest uppercase border"
                style={{ color: 'rgba(239, 68, 68, 0.8)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                whileHover={{ scale: 1.02 }}
              >
                REINTENTAR
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
