'use client'

import { useCallback, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { ActivityComponentProps, ActivityConfig } from '@/types/activity'
import { useActivityMetrics } from '@/hooks/useActivityMetrics'
import { getSeededOrder, resolveDragOrderItem } from './dragOrder.shared'

function getDefaultEmptyMessage(activity: Extract<ActivityConfig, { type: 'drag-order' }>, isGuided: boolean) {
  if (activity.emptyStateMessage) {
    return activity.emptyStateMessage
  }

  if (isGuided) {
    return 'Elige la primera pieza correcta y la secuencia se ira construyendo paso a paso.'
  }

  return 'Selecciona las piezas para completar la secuencia.'
}

export function DragOrderActivity({ activity, onComplete }: ActivityComponentProps) {
  const ac = activity as Extract<ActivityConfig, { type: 'drag-order' }>
  const isGuided = ac.interactionMode === 'guided'
  const [order, setOrder] = useState<number[]>([])
  const [answered, setAnswered] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [statusTone, setStatusTone] = useState<'info' | 'success' | 'error'>('info')
  const { buildCompletion, registerInteraction, registerMistake, registerRetry } = useActivityMetrics(ac)

  const itemDetails = useMemo(
    () => ac.items.map((_, index) => resolveDragOrderItem(ac, index, index)),
    [ac],
  )
  const availableOrder = useMemo(() => getSeededOrder(ac.items.length, ac.id), [ac.id, ac.items.length])
  const remaining = availableOrder.filter((index) => !order.includes(index))
  const nextExpectedIndex = ac.correctOrder[order.length]
  const nextExpectedItem = nextExpectedIndex !== undefined ? itemDetails[nextExpectedIndex] : null
  const emptyMessage = getDefaultEmptyMessage(ac, isGuided)

  const handleSelectItem = useCallback(
    (index: number) => {
      if (answered) return
      registerInteraction()

      if (isGuided) {
        const expectedIndex = ac.correctOrder[order.length]

        if (index !== expectedIndex) {
          registerMistake()
          setStatusTone('error')
          setStatusMessage(ac.stepHints?.[order.length] ?? 'Esa pieza todavia no sigue en la secuencia.')
          return
        }
      }

      const nextLength = order.length + 1

      setOrder((prev) => [...prev, index])
      setStatusTone('success')

      if (isGuided && nextLength === ac.items.length) {
        setAnswered(true)
      }
    },
    [ac, answered, isGuided, order, registerInteraction, registerMistake],
  )

  const handleRemoveItem = useCallback(
    (position: number) => {
      if (answered) return
      registerInteraction()
      setOrder((prev) => prev.filter((_, index) => index !== position))
      setStatusTone('info')
      setStatusMessage('Quitamos esa pieza. Reajusta la secuencia desde ese punto.')
    },
    [answered, registerInteraction],
  )

  const handleReset = useCallback(() => {
    if (answered) return
    registerRetry()
    setOrder([])
    setStatusTone('info')
    setStatusMessage('Secuencia reiniciada. Empecemos otra vez.')
  }, [answered, registerRetry])

  const handleConfirm = useCallback(() => {
    if (order.length !== ac.items.length) return
    registerInteraction()
    const correct = order.every((itemIndex, index) => itemIndex === ac.correctOrder[index])
    if (!correct) {
      registerMistake()
    }
    setAnswered(true)
  }, [ac.correctOrder, ac.items.length, order, registerInteraction, registerMistake])

  const handleRetry = useCallback(() => {
    registerRetry()
    setAnswered(false)
    setOrder([])
    setStatusTone('info')
    setStatusMessage('Secuencia reiniciada. Intenta detectar mejor el flujo de energia.')
  }, [registerRetry])

  const isCorrect = useMemo(
    () => answered && order.every((itemIndex, index) => itemIndex === ac.correctOrder[index]),
    [ac.correctOrder, answered, order],
  )

  return (
    <div className="activity-compact flex flex-col gap-5 sm:gap-6" style={{ fontFamily: '"Courier New", monospace' }}>
      <div
        className="rounded-sm border p-4 sm:p-5"
        style={{
          borderColor: 'rgba(74, 222, 128, 0.14)',
          background: 'linear-gradient(135deg, rgba(8,20,14,0.92), rgba(13,38,27,0.84))',
        }}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="activity-instruction text-[11px] tracking-[0.22em] uppercase" style={{ color: 'rgba(74, 222, 128, 0.42)' }}>
              {ac.instruction}
            </div>
            <p className="activity-text text-sm sm:text-base leading-relaxed" style={{ color: '#d9f99d' }}>
              {ac.question}
            </p>
          </div>
          <div
            className="rounded-sm border px-3 py-2 text-xs uppercase tracking-[0.18em]"
            style={{
              borderColor: 'rgba(74, 222, 128, 0.18)',
              color: '#86efac',
              backgroundColor: 'rgba(74, 222, 128, 0.05)',
            }}
          >
            Progreso {order.length}/{ac.items.length}
          </div>
        </div>

        {(isGuided || statusMessage) && (
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
              ? `Siguiente paso: ${nextExpectedItem.label}. ${ac.stepHints?.[order.length] ?? ''}`
              : 'La secuencia esta completa.')}
          </div>
        )}
      </div>

      <div
        className="relative overflow-hidden rounded-sm border p-4"
        style={{
          borderColor: 'rgba(74, 222, 128, 0.14)',
          background: 'linear-gradient(135deg, rgba(7, 18, 14, 0.96), rgba(15, 41, 30, 0.88))',
        }}
      >
        <div className="absolute left-8 right-8 top-1/2 h-px -translate-y-1/2" style={{ background: 'rgba(255,255,255,0.12)' }} />
        <div
          className="relative grid gap-3"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))' }}
        >
          {ac.correctOrder.map((itemIndex, step) => {
            const selectedIndex = order[step]
            const expectedDetail = itemDetails[itemIndex]
            const selectedDetail = selectedIndex !== undefined ? itemDetails[selectedIndex] : expectedDetail
            const isStepCorrect = answered && selectedIndex === itemIndex
            const isStepWrong = answered && selectedIndex !== undefined && selectedIndex !== itemIndex
            const isActiveStep = !answered && step === order.length

            return (
              <div key={step} className="relative flex flex-col items-center gap-2">
                {step > 0 && (
                  <ArrowRight
                    size={16}
                    className="absolute -left-3 top-6 hidden xl:block"
                    style={{ color: 'rgba(74, 222, 128, 0.32)' }}
                    aria-hidden="true"
                  />
                )}
                <div
                  className="grid h-14 w-14 place-items-center rounded-full border transition-all duration-300"
                  style={{
                    borderColor: isStepWrong
                      ? 'rgba(239, 68, 68, 0.42)'
                      : selectedIndex !== undefined || isStepCorrect
                        ? selectedDetail.accent
                        : isActiveStep
                          ? 'rgba(255,255,255,0.28)'
                          : 'rgba(74, 222, 128, 0.16)',
                    backgroundColor: selectedIndex !== undefined ? `${selectedDetail.accent}22` : 'rgba(0, 0, 0, 0.18)',
                    color: isStepWrong ? 'rgba(239, 68, 68, 0.74)' : '#dcfce7',
                    boxShadow: selectedIndex !== undefined ? `0 0 20px ${selectedDetail.accent}33` : 'none',
                  }}
                >
                  <selectedDetail.Icon size={22} aria-hidden="true" />
                </div>
                <div className="text-center text-[10px] uppercase tracking-wider" style={{ color: 'rgba(134, 239, 172, 0.45)' }}>
                  {expectedDetail.slotLabel}
                </div>
                <div className="min-h-[36px] text-center text-[10px] leading-tight px-1" style={{ color: selectedIndex !== undefined ? '#fef08a' : 'rgba(226, 232, 240, 0.58)' }}>
                  {selectedDetail.description}
                </div>
                {selectedIndex === undefined && (
                  <div className="text-center text-[9px] uppercase tracking-[0.18em]" style={{ color: 'rgba(74, 222, 128, 0.18)' }}>
                    {isActiveStep ? 'Activo' : 'Esperando'}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="flex flex-col gap-1.5 min-h-[120px]">
          {order.length === 0 && (
            <div className="text-xs py-8 text-center" style={{ color: 'rgba(74, 222, 128, 0.18)' }}>
              {emptyMessage}
            </div>
          )}

          {order.map((itemIndex, position) => {
            const detail = itemDetails[itemIndex]

            return (
              <motion.button
                key={`${itemIndex}-${position}`}
                onClick={() => handleRemoveItem(position)}
                disabled={answered}
                className="w-full text-left px-4 py-3 text-sm border rounded-sm"
                style={{
                  borderColor: answered
                    ? itemIndex === ac.correctOrder[position]
                      ? 'rgba(74, 222, 128, 0.4)'
                      : 'rgba(239, 68, 68, 0.3)'
                    : 'rgba(74, 222, 128, 0.25)',
                  backgroundColor: answered
                    ? itemIndex === ac.correctOrder[position]
                      ? 'rgba(74, 222, 128, 0.08)'
                      : 'rgba(239, 68, 68, 0.05)'
                    : 'rgba(74, 222, 128, 0.06)',
                  color: answered
                    ? itemIndex === ac.correctOrder[position]
                      ? '#4ade80'
                      : 'rgba(239, 68, 68, 0.7)'
                    : '#86efac',
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                layout
              >
                <span className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full border" style={{ borderColor: `${detail.accent}66`, color: detail.accent, backgroundColor: `${detail.accent}18` }}>
                    <detail.Icon size={16} aria-hidden="true" />
                  </div>
                  <span className="flex flex-col">
                    <span>{position + 1}. {detail.label}</span>
                    <span className="mt-1 text-[10px] leading-relaxed" style={{ color: 'rgba(226, 232, 240, 0.62)' }}>
                      {detail.description}
                    </span>
                  </span>
                </span>
              </motion.button>
            )
          })}
        </div>

        {(ac.helperPanelTitle || isGuided) && (
          <div className="rounded-sm border p-4" style={{ borderColor: 'rgba(74, 222, 128, 0.14)', background: 'rgba(7, 18, 14, 0.72)' }}>
            <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: 'rgba(74, 222, 128, 0.42)' }}>
              {ac.helperPanelTitle ?? 'Guia visual'}
            </div>
            {ac.helperPanelDescription && (
              <p className="mt-2 text-xs leading-relaxed" style={{ color: 'rgba(226, 232, 240, 0.68)' }}>
                {ac.helperPanelDescription}
              </p>
            )}
            <div className="mt-3 space-y-3 text-sm">
              {ac.correctOrder.map((itemIndex, step) => {
                const detail = itemDetails[itemIndex]
                const isCompleted = order.length > step

                return (
                  <div
                    key={`helper-${itemIndex}`}
                    className="rounded-sm border p-3"
                    style={{
                      borderColor: 'rgba(74, 222, 128, 0.12)',
                      backgroundColor: isCompleted ? 'rgba(74, 222, 128, 0.06)' : 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <div className="flex items-center gap-2" style={{ color: detail.accent }}>
                      <detail.Icon size={16} aria-hidden="true" />
                      <span className="font-semibold">{detail.label}</span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed" style={{ color: 'rgba(226, 232, 240, 0.72)' }}>
                      {detail.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {remaining.length > 0 && (
        <div className="pt-2 border-t" style={{ borderColor: 'rgba(74, 222, 128, 0.08)' }}>
          <div className="mb-3 text-[11px] uppercase tracking-[0.22em]" style={{ color: 'rgba(74, 222, 128, 0.42)' }}>
            Piezas disponibles
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {remaining.map((itemIndex) => {
              const detail = itemDetails[itemIndex]
              const isExpectedNext = isGuided && itemIndex === nextExpectedIndex

              return (
                <motion.button
                  key={itemIndex}
                  onClick={() => handleSelectItem(itemIndex)}
                  disabled={answered}
                  className="flex items-start gap-3 rounded-sm border px-4 py-3 text-left"
                  style={{
                    borderColor: isExpectedNext ? detail.accent : 'rgba(74, 222, 128, 0.2)',
                    color: 'rgba(134, 239, 172, 0.88)',
                    backgroundColor: isExpectedNext ? `${detail.accent}18` : 'rgba(74, 222, 128, 0.035)',
                    boxShadow: isExpectedNext ? `0 0 0 1px ${detail.accent}44 inset` : 'none',
                  }}
                  whileHover={{ borderColor: detail.accent }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-full border" style={{ borderColor: `${detail.accent}66`, color: detail.accent, backgroundColor: `${detail.accent}18` }}>
                    <detail.Icon size={16} aria-hidden="true" />
                  </div>
                  <span className="flex flex-col items-start">
                    <span className="text-sm">{detail.label}</span>
                    <span className="mt-1 text-[11px] leading-relaxed" style={{ color: 'rgba(226, 232, 240, 0.72)' }}>
                      {detail.description}
                    </span>
                    {isExpectedNext && (
                      <span className="mt-2 text-[9px] uppercase tracking-[0.16em]" style={{ color: detail.accent }}>
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
        {!isGuided && order.length === ac.items.length && !answered && (
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
              onClick={() => onComplete(buildCompletion({ accuracyRatio: isCorrect ? 1 : 0 }))}
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
            >
              REINTENTAR
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  )
}
