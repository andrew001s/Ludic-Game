'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Atom,
  BatteryCharging,
  Beaker,
  Bot,
  Cog,
  FlaskConical,
  Gauge,
  Lightbulb,
  Sparkles,
  Waves,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ActivityConfig } from '@/types/activity'

function getStepIcon(item: string): LucideIcon {
  const normalized = item.toLowerCase()

  if (normalized.includes('quimica')) return FlaskConical
  if (normalized.includes('potencial')) return BatteryCharging
  if (normalized.includes('cinetica') || normalized.includes('cinética')) return Waves
  if (normalized.includes('electrica') || normalized.includes('eléctrica')) return Zap
  if (normalized.includes('luminica') || normalized.includes('lumínica')) return Lightbulb
  if (normalized.includes('reactivo')) return FlaskConical
  if (normalized.includes('reacción') || normalized.includes('reaccion')) return Beaker
  if (normalized.includes('liberación') || normalized.includes('liberacion') || normalized.includes('energía') || normalized.includes('energia')) return Sparkles
  if (normalized.includes('producto')) return Atom
  if (normalized.includes('movimiento')) return Gauge
  if (normalized.includes('cinética')) return Zap
  if (normalized.includes('motor')) return Cog
  if (normalized.includes('robot')) return Bot

  return Zap
}

function getStepSlotLabel(item: string, step: number): string {
  const normalized = item.toLowerCase()

  if (normalized.includes('quimica')) return 'Origen'
  if (normalized.includes('potencial')) return 'Acumulacion'
  if (normalized.includes('cinetica') || normalized.includes('cinética')) return 'Movimiento'
  if (normalized.includes('electrica') || normalized.includes('eléctrica')) return 'Corriente'
  if (normalized.includes('luminica') || normalized.includes('lumínica')) return 'Luz'
  if (normalized.includes('reactivo')) return 'Entrada'
  if (normalized.includes('reacción') || normalized.includes('reaccion')) return 'Proceso'
  if (normalized.includes('liberación') || normalized.includes('liberacion') || normalized.includes('energía') || normalized.includes('energia')) return 'Cambio'
  if (normalized.includes('producto')) return 'Resultado'

  return `Paso ${step + 1}`
}

function getItemDescription(activity: Extract<ActivityConfig, { type: 'drag-order' }>, itemIndex: number) {
  return activity.itemDescriptions?.[itemIndex] ?? 'Selecciona esta pieza para colocarla en la secuencia.'
}

function getItemAccent(activity: Extract<ActivityConfig, { type: 'drag-order' }>, itemIndex: number) {
  return activity.itemAccents?.[itemIndex] ?? '#4ade80'
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
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [statusTone, setStatusTone] = useState<'info' | 'success' | 'error'>('info')
  const ac = activity as Extract<ActivityConfig, { type: 'drag-order' }>
  const isChemistryFlow = ac.items.some((item) => {
    const normalized = item.toLowerCase()
    return normalized.includes('reactivo')
      || normalized.includes('reacción')
      || normalized.includes('reaccion')
      || normalized.includes('producto')
  })
  const isGuidedEnergyFlow = ac.mode === 'guided-energy'

  const availableOrder = useMemo(() => getSeededOrder(ac.items.length, ac.id), [ac.id, ac.items.length])
  const remaining = availableOrder.filter((index) => !order.includes(index))
  const nextExpectedIndex = ac.correctOrder[order.length]
  const nextExpectedItem = nextExpectedIndex !== undefined ? ac.items[nextExpectedIndex] : null

  const handleSelectItem = useCallback(
    (index: number) => {
      if (answered) return

      if (isGuidedEnergyFlow) {
        const expectedIndex = ac.correctOrder[order.length]

        if (index !== expectedIndex) {
          setStatusTone('error')
          setStatusMessage(ac.stepHints?.[order.length] ?? 'Esa pieza no sigue todavia en la cascada.')
          return
        }
      }

      setOrder((prev) => [...prev, index])
      setStatusTone('success')
      setStatusMessage(
        index === ac.correctOrder[ac.correctOrder.length - 1]
          ? 'La cascada esta completa. La luz puede volver a encenderse.'
          : `Bien. Ahora busca la energia que sigue despues de ${ac.items[index]}.`,
      )

      if (isGuidedEnergyFlow && order.length + 1 === ac.items.length) {
        setAnswered(true)
      }
    },
    [ac, answered, isGuidedEnergyFlow, order.length],
  )

  const handleRemoveItem = useCallback(
    (position: number) => {
      if (answered) return
      setOrder((prev) => prev.filter((_, i) => i !== position))
      setStatusTone('info')
      setStatusMessage('Quitamos esa pieza. Vuelve a probar la cascada desde ese punto.')
    },
    [answered],
  )

  const handleReset = useCallback(() => {
    if (answered) return
    setOrder([])
    setStatusTone('info')
    setStatusMessage('Secuencia reiniciada. Empecemos de nuevo desde la energia inicial.')
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
      className="activity-compact flex flex-col gap-5 sm:gap-6"
      style={{ fontFamily: '"Courier New", monospace' }}
    >
      <div className="rounded-sm border p-4 sm:p-5" style={{ borderColor: 'rgba(74, 222, 128, 0.14)', background: 'linear-gradient(135deg, rgba(8,20,14,0.92), rgba(13,38,27,0.84))' }}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="activity-instruction text-[11px] tracking-[0.22em] uppercase" style={{ color: 'rgba(74, 222, 128, 0.42)' }}>
              {ac.instruction}
            </div>
            <p className="activity-text text-sm sm:text-base leading-relaxed" style={{ color: '#d9f99d' }}>
              {ac.question}
            </p>
          </div>
          <div className="rounded-sm border px-3 py-2 text-xs uppercase tracking-[0.18em]" style={{ borderColor: 'rgba(74, 222, 128, 0.18)', color: '#86efac', backgroundColor: 'rgba(74, 222, 128, 0.05)' }}>
            Progreso {order.length}/{ac.items.length}
          </div>
        </div>

        {isGuidedEnergyFlow && (
          <div
            className="mt-4 rounded-sm border px-3 py-3 text-xs sm:text-sm leading-relaxed"
            style={{
              borderColor:
                statusTone === 'error'
                  ? 'rgba(239, 68, 68, 0.28)'
                  : statusTone === 'success'
                    ? 'rgba(74, 222, 128, 0.28)'
                    : 'rgba(74, 222, 128, 0.16)',
              backgroundColor:
                statusTone === 'error'
                  ? 'rgba(127, 29, 29, 0.18)'
                  : statusTone === 'success'
                    ? 'rgba(20, 83, 45, 0.18)'
                    : 'rgba(15, 23, 42, 0.22)',
              color: statusTone === 'error' ? '#fca5a5' : '#dcfce7',
            }}
          >
            {statusMessage ?? (nextExpectedItem
              ? `Siguiente paso: elige ${nextExpectedItem}. ${ac.stepHints?.[order.length] ?? ''}`
              : 'La secuencia esta completa. Revisa la cascada encendida.')}
          </div>
        )}
      </div>

      <div
        className="relative overflow-hidden rounded-sm border p-4"
        style={{
          borderColor: 'rgba(74, 222, 128, 0.14)',
          background: isGuidedEnergyFlow
            ? 'radial-gradient(circle at 10% 20%, rgba(245,158,11,0.16), transparent 20%), radial-gradient(circle at 35% 25%, rgba(96,165,250,0.15), transparent 22%), radial-gradient(circle at 58% 42%, rgba(34,197,94,0.14), transparent 24%), radial-gradient(circle at 78% 48%, rgba(167,139,250,0.13), transparent 18%), radial-gradient(circle at 90% 30%, rgba(253,224,71,0.15), transparent 16%), linear-gradient(135deg, rgba(7, 18, 14, 0.96), rgba(15, 41, 30, 0.88))'
            : isChemistryFlow
            ? 'radial-gradient(circle at 18% 50%, rgba(74,222,128,0.08), transparent 24%), radial-gradient(circle at 80% 40%, rgba(250,204,21,0.06), transparent 18%), linear-gradient(90deg, rgba(74,222,128,0.03), rgba(20,83,45,0.045))'
            : 'radial-gradient(circle at 18% 50%, rgba(74,222,128,0.12), transparent 24%), linear-gradient(90deg, rgba(74,222,128,0.035), rgba(20,83,45,0.04))',
        }}
      >
        <div className="absolute left-8 right-8 top-1/2 h-px -translate-y-1/2" style={{ background: isGuidedEnergyFlow ? 'rgba(255,255,255,0.14)' : 'rgba(74, 222, 128, 0.18)' }} />
        <div className={`relative grid gap-3 ${ac.correctOrder.length > 4 ? 'grid-cols-2 sm:grid-cols-5' : 'grid-cols-4'}`}>
          {ac.correctOrder.map((itemIndex, step) => {
            const selectedIndex = order[step]
            const StepIcon = selectedIndex === undefined ? getStepIcon(ac.items[itemIndex]) : getStepIcon(ac.items[selectedIndex])
            const isStepCorrect = answered && selectedIndex === itemIndex
            const isStepWrong = answered && selectedIndex !== undefined && selectedIndex !== itemIndex
            const accent = getItemAccent(ac, itemIndex)
            const slotLabel = ac.slotLabels?.[step] ?? getStepSlotLabel(ac.items[itemIndex], step)
            const slotDescription = ac.itemDescriptions?.[itemIndex]
            const isUnlockedStep = selectedIndex !== undefined || (!answered && step === order.length)

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
                  className="grid h-14 w-14 place-items-center rounded-full border transition-all duration-300"
                  style={{
                    borderColor: isStepWrong
                      ? 'rgba(239, 68, 68, 0.42)'
                      : isStepCorrect
                        ? accent
                        : selectedIndex !== undefined
                          ? `${accent}aa`
                          : isUnlockedStep
                            ? 'rgba(255,255,255,0.24)'
                            : 'rgba(74, 222, 128, 0.16)',
                    backgroundColor: selectedIndex !== undefined ? `${accent}22` : 'rgba(0, 0, 0, 0.18)',
                    color: isStepWrong ? 'rgba(239, 68, 68, 0.74)' : '#86efac',
                    boxShadow: selectedIndex !== undefined ? `0 0 20px ${accent}33` : 'none',
                  }}
                >
                  <StepIcon size={22} aria-hidden="true" />
                </div>
                <div className="text-center text-[10px] uppercase tracking-wider" style={{ color: 'rgba(134, 239, 172, 0.45)' }}>
                  {slotLabel}
                </div>
                {isGuidedEnergyFlow && (
                  <div className="min-h-[32px] text-center text-[10px] leading-tight px-1" style={{ color: selectedIndex !== undefined ? '#fef08a' : 'rgba(226, 232, 240, 0.58)' }}>
                    {slotDescription}
                  </div>
                )}
                {isChemistryFlow && (
                  <div className="text-center text-[9px] leading-tight" style={{ color: 'rgba(223, 233, 174, 0.4)' }}>
                    {step === 0 && 'Ingresan sustancias'}
                    {step === 1 && 'Ocurre el cambio'}
                    {step === 2 && 'Se transfiere energia'}
                    {step === 3 && 'Aparecen nuevos compuestos'}
                  </div>
                )}
                {(isChemistryFlow || isGuidedEnergyFlow) && selectedIndex === undefined && (
                  <div className="text-center text-[9px] uppercase tracking-[0.18em]" style={{ color: 'rgba(74, 222, 128, 0.18)' }}>
                    {isGuidedEnergyFlow && step === order.length ? 'Activo' : 'Esperando'}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="flex flex-col gap-1.5 min-h-[100px]">
        {order.length === 0 && (
          <div className="text-xs py-8 text-center" style={{ color: 'rgba(74, 222, 128, 0.15)' }}>
            {isGuidedEnergyFlow
              ? 'Elige la primera energia y la cascada se ira construyendo paso a paso.'
              : isChemistryFlow
              ? 'Selecciona las etapas en el orden en que ocurre la reaccion dentro de la camara'
              : 'Selecciona las piezas para completar la secuencia'}
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
                const ItemIcon = getStepIcon(ac.items[itemIndex])
                return <ItemIcon size={17} aria-hidden="true" />
              })()}
              <span className="flex flex-col">
                <span>{pos + 1}. {ac.items[itemIndex]}</span>
                {(isGuidedEnergyFlow || ac.itemDescriptions?.[itemIndex]) && (
                  <span className="text-[10px] mt-1" style={{ color: 'rgba(226, 232, 240, 0.62)' }}>
                    {getItemDescription(ac, itemIndex)}
                  </span>
                )}
              </span>
            </span>
          </motion.button>
        ))}
        </div>

      </div>

      {remaining.length > 0 && (
        <div className="pt-2 border-t" style={{ borderColor: 'rgba(74, 222, 128, 0.08)' }}>
          <div className="mb-3 text-[11px] uppercase tracking-[0.22em]" style={{ color: 'rgba(74, 222, 128, 0.42)' }}>
            Piezas disponibles
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {remaining.map((i) => {
            const item = ac.items[i]
            const ItemIcon = getStepIcon(item)
            const accent = getItemAccent(ac, i)
            const isExpectedNext = isGuidedEnergyFlow && i === nextExpectedIndex

            return (
              <motion.button
                key={i}
                onClick={() => handleSelectItem(i)}
                disabled={answered}
                className="flex items-start gap-3 px-4 py-3 text-left border rounded-sm"
                style={{
                  borderColor: isExpectedNext ? accent : 'rgba(74, 222, 128, 0.2)',
                  color: 'rgba(134, 239, 172, 0.88)',
                  backgroundColor: isExpectedNext ? `${accent}18` : 'rgba(74, 222, 128, 0.035)',
                  boxShadow: isExpectedNext ? `0 0 0 1px ${accent}44 inset` : 'none',
                }}
                whileHover={{ borderColor: accent }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-full border" style={{ borderColor: `${accent}66`, color: accent, backgroundColor: `${accent}18` }}>
                  <ItemIcon size={16} aria-hidden="true" />
                </div>
                <span className="flex flex-col items-start">
                  <span className="text-sm">{item}</span>
                  <span className="mt-1 text-[11px] leading-relaxed" style={{ color: 'rgba(226, 232, 240, 0.72)' }}>
                    {getItemDescription(ac, i)}
                  </span>
                  {isChemistryFlow && (
                    <span className="mt-2 text-[9px] uppercase tracking-[0.16em]" style={{ color: 'rgba(223, 233, 174, 0.34)' }}>
                      {item.toLowerCase().includes('reactivo') && 'Sustancias iniciales'}
                      {(item.toLowerCase().includes('reacción') || item.toLowerCase().includes('reaccion')) && 'Transformacion'}
                      {(item.toLowerCase().includes('liberación') || item.toLowerCase().includes('liberacion') || item.toLowerCase().includes('energia')) && 'Transferencia'}
                      {item.toLowerCase().includes('producto') && 'Resultado final'}
                    </span>
                  )}
                  {isGuidedEnergyFlow && isExpectedNext && (
                    <span className="mt-2 text-[9px] uppercase tracking-[0.16em]" style={{ color: accent }}>
                      Siguiente paso correcto
                    </span>
                  )}
                </span>
              </motion.button>
            )
          })}
          </div>
        </div>
      )}

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
        {!isGuidedEnergyFlow && order.length === ac.items.length && !answered && (
          <motion.button
            onClick={handleConfirm}
            className="btn-compact px-5 py-2 sm:px-6 text-xs tracking-widest uppercase border"
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
              className="btn-compact block mt-4 px-5 py-2 sm:px-6 text-xs tracking-widest uppercase border"
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
