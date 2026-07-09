'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUp, CircleDot, MoveUpRight, Orbit, Weight } from 'lucide-react'
import type { ActivityComponentProps, ActivityConfig } from '@/types/activity'
import { useActivityMetrics } from '@/hooks/useActivityMetrics'

interface DragInfo {
  point: {
    x: number
    y: number
  }
}

function splitFillBlanksText(text: string) {
  return text.split(/(\[[^\]]+\]|___)/g)
}

function getSeededShuffle(words: string[], seed: string) {
  const values = [...words]
  let hash = 0

  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  }

  for (let index = values.length - 1; index > 0; index -= 1) {
    hash = (hash * 1664525 + 1013904223) >>> 0
    const swapIndex = hash % (index + 1)
    ;[values[index], values[swapIndex]] = [values[swapIndex], values[index]]
  }

  if (values.every((word, index) => word === words[index]) && values.length > 1) {
    ;[values[0], values[1]] = [values[1], values[0]]
  }

  return values
}

export function FillBlanksActivity({ activity, onComplete }: ActivityComponentProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [answered, setAnswered] = useState(false)
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [sphereElevated, setSphereElevated] = useState(false)
  const [spherePosition, setSpherePosition] = useState({ x: 24, y: 122 })
  const sceneRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<HTMLDivElement>(null)
  const ac = activity as Extract<ActivityConfig, { type: 'fill-blanks' }>
  const isSphereActivity = ac.id === 'activity-11'
  const { buildCompletion, registerInteraction, registerMistake, registerRetry } = useActivityMetrics(ac)

  const handleChange = useCallback(
    (index: number, value: string) => {
      if (answered) return
      registerInteraction()
      setAnswers((prev) => ({ ...prev, [index]: value }))
    },
    [answered, registerInteraction],
  )

  const handleWordSelect = useCallback(
    (word: string) => {
      if (answered || !sphereElevated) return
      registerInteraction()
      setSelectedWord((prev) => (prev === word ? null : word))
    },
    [answered, registerInteraction, sphereElevated],
  )

  const handleBlankSelect = useCallback(
    (index: number) => {
      if (answered || !sphereElevated || !selectedWord) return
      registerInteraction()
      setAnswers((prev) => ({ ...prev, [index]: selectedWord }))
      setSelectedWord(null)
    },
    [answered, registerInteraction, selectedWord, sphereElevated],
  )

  const handleBlankClear = useCallback(
    (index: number) => {
      if (answered) return
      registerInteraction()
      setAnswers((prev) => {
        const next = { ...prev }
        delete next[index]
        return next
      })
      setSelectedWord(null)
    },
    [answered, registerInteraction],
  )

  const handleConfirm = useCallback(() => {
    if (isSphereActivity && !sphereElevated) return
    if (Object.keys(answers).length !== ac.blanks.length) return
    registerInteraction()
    const correct = ac.blanks.every(
      (blank) => answers[blank.index]?.trim().toLowerCase() === ac.correctAnswers[blank.index].toLowerCase(),
    )
    if (!correct) {
      registerMistake()
    }
    setAnswered(true)
  }, [ac.blanks, ac.correctAnswers, answers, isSphereActivity, registerInteraction, registerMistake, sphereElevated])

  const handleRetry = useCallback(() => {
    registerRetry()
    setAnswered(false)
  }, [registerRetry])

  const isCorrect = useMemo(() => {
    if (!answered) return false
    return ac.blanks.every(
      (blank) => answers[blank.index]?.trim().toLowerCase() === ac.correctAnswers[blank.index].toLowerCase(),
    )
  }, [ac.blanks, ac.correctAnswers, answered, answers])

  const allFilled = Object.keys(answers).length === ac.blanks.length

  const wordBank = useMemo(
    () => getSeededShuffle(Array.from(new Set(ac.correctAnswers)), ac.id),
    [ac.correctAnswers, ac.id],
  )
  const usedWords = useMemo(() => new Set(Object.values(answers)), [answers])

  const handleSphereDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: DragInfo) => {
      if (answered) return

      const targetRect = targetRef.current?.getBoundingClientRect()
      if (!targetRect) {
        setSpherePosition({ x: 24, y: 122 })
        return
      }

      const landed =
        info.point.x >= targetRect.left - 12 &&
        info.point.x <= targetRect.right + 12 &&
        info.point.y >= targetRect.top - 12 &&
        info.point.y <= targetRect.bottom + 18

      if (!landed) {
        setSphereElevated(false)
        setSpherePosition({ x: 24, y: 122 })
        return
      }

      const sceneRect = sceneRef.current?.getBoundingClientRect()
      if (!sceneRect) return

      setSphereElevated(true)
      setSpherePosition({
        x: targetRect.left - sceneRect.left + targetRect.width / 2 - 18,
        y: targetRect.top - sceneRect.top - 18,
      })
    },
    [answered],
  )

  const renderText = useMemo(() => {
    const parts = splitFillBlanksText(ac.text)
    let blankCursor = 0

    return parts.map((part, index) => {
      const isPlaceholder = part === '___' || /^\[[^\]]+\]$/.test(part)
      const blank = isPlaceholder ? ac.blanks[blankCursor++] : null

      if (!isPlaceholder || !blank) {
        return <span key={index}>{part}</span>
      }

      const answerValue = answers[blank.index] || ''
      const isBlankCorrect = answerValue.trim().toLowerCase() === ac.correctAnswers[blank.index]?.toLowerCase()

      if (isSphereActivity) {
        return answered ? (
          <span
            key={index}
            className="inline-flex min-w-[88px] items-center justify-center mx-1 px-2 py-1 border rounded-sm"
            style={{
              borderColor: isBlankCorrect ? 'rgba(74, 222, 128, 0.5)' : 'rgba(239, 68, 68, 0.4)',
              color: isBlankCorrect ? '#4ade80' : 'rgba(239, 68, 68, 0.7)',
              backgroundColor: isBlankCorrect ? 'rgba(74, 222, 128, 0.08)' : 'rgba(239, 68, 68, 0.06)',
            }}
          >
            {answerValue}
          </span>
        ) : (
          <button
            key={index}
            type="button"
            onClick={() => (answerValue ? handleBlankClear(blank.index) : handleBlankSelect(blank.index))}
            disabled={!sphereElevated}
            className="inline-flex min-w-[88px] items-center justify-center mx-1 px-2 py-1 border rounded-sm text-sm transition-all duration-150 disabled:opacity-40"
            style={{
              borderColor: answerValue
                ? 'rgba(74, 222, 128, 0.4)'
                : selectedWord
                  ? 'rgba(216, 226, 143, 0.45)'
                  : 'rgba(74, 222, 128, 0.18)',
              color: answerValue ? '#4ade80' : selectedWord ? '#dfe9ae' : 'rgba(134, 239, 172, 0.6)',
              backgroundColor: answerValue ? 'rgba(74, 222, 128, 0.08)' : 'rgba(74, 222, 128, 0.03)',
              fontFamily: '"Courier New", monospace',
            }}
          >
            {answerValue || blank.placeholder}
          </button>
        )
      }

      return answered ? (
        <span
          key={index}
          className="inline-block mx-1 px-2 border-b-2"
          style={{
            borderColor: isBlankCorrect ? 'rgba(74, 222, 128, 0.5)' : 'rgba(239, 68, 68, 0.4)',
            color: isBlankCorrect ? '#4ade80' : 'rgba(239, 68, 68, 0.7)',
            minWidth: '80px',
          }}
        >
          {answerValue}
        </span>
      ) : (
        <input
          key={index}
          type="text"
          value={answerValue}
          onChange={(e) => handleChange(blank.index, e.target.value)}
          placeholder={blank.placeholder}
          className="inline-block mx-1 px-2 bg-transparent border-b-2 outline-none text-sm"
          style={{
            borderColor: answerValue ? 'rgba(74, 222, 128, 0.4)' : 'rgba(74, 222, 128, 0.15)',
            color: '#4ade80',
            caretColor: '#4ade80',
            minWidth: '100px',
            fontFamily: '"Courier New", monospace',
          }}
          autoComplete="off"
          spellCheck={false}
        />
      )
    })
  }, [
    ac.blanks,
    ac.correctAnswers,
    ac.text,
    answers,
    answered,
    handleBlankClear,
    handleBlankSelect,
    handleChange,
    isSphereActivity,
    selectedWord,
    sphereElevated,
  ])

  return (
    <div
      className="activity-compact flex flex-col gap-5 sm:gap-6"
      style={{ fontFamily: '"Courier New", monospace' }}
    >
      <div className="activity-instruction text-xs tracking-widest uppercase" style={{ color: 'rgba(74, 222, 128, 0.4)' }}>
        {ac.instruction}
      </div>

      {isSphereActivity && (
        <div className="grid gap-4">
          <div
            ref={sceneRef}
            className="relative h-56 overflow-hidden rounded-sm border"
            style={{
              borderColor: 'rgba(74, 222, 128, 0.16)',
              background:
                'radial-gradient(circle at 25% 75%, rgba(74, 222, 128, 0.08), transparent 22%), linear-gradient(180deg, rgba(74, 222, 128, 0.035), rgba(0, 0, 0, 0.12))',
            }}
          >
            <div className="absolute left-5 bottom-6 text-[10px] uppercase tracking-[0.25em]" style={{ color: 'rgba(134, 239, 172, 0.38)' }}>
              base
            </div>
            <div className="absolute right-6 top-8 text-[10px] uppercase tracking-[0.25em]" style={{ color: 'rgba(216, 226, 143, 0.48)' }}>
              plataforma alta
            </div>

            <div className="absolute left-4 right-4 bottom-5 h-3 rounded-full" style={{ backgroundColor: 'rgba(74, 222, 128, 0.12)' }} />

            <div
              ref={targetRef}
              className="absolute right-10 top-16 h-4 w-28 rounded-full border"
              style={{
                borderColor: sphereElevated ? 'rgba(216, 226, 143, 0.5)' : 'rgba(216, 226, 143, 0.26)',
                backgroundColor: sphereElevated ? 'rgba(216, 226, 143, 0.16)' : 'rgba(216, 226, 143, 0.06)',
                boxShadow: sphereElevated ? '0 0 22px rgba(216, 226, 143, 0.2)' : 'none',
              }}
            />

            <div className="absolute right-[90px] top-20 bottom-8 w-1 rounded-full" style={{ backgroundColor: 'rgba(216, 226, 143, 0.14)' }} />

            <div className="absolute left-4 right-4 top-0 bottom-0 pointer-events-none">
              <div className="absolute left-16 bottom-14 flex items-center gap-2 text-[11px]" style={{ color: 'rgba(134, 239, 172, 0.55)' }}>
                <MoveUpRight size={14} />
                Arrastra la esfera a la plataforma elevada
              </div>
              {sphereElevated && (
                <div className="absolute right-8 top-5 flex items-center gap-2 text-[11px]" style={{ color: '#dfe9ae' }}>
                  <ArrowUp size={14} />
                  Altura aumentada
                </div>
              )}
            </div>

            <motion.div
              drag={!answered}
              dragConstraints={sceneRef}
              dragElastic={0.08}
              onDragEnd={handleSphereDragEnd}
              animate={{ x: spherePosition.x, y: spherePosition.y }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className="absolute z-10 h-9 w-9 rounded-full border cursor-grab active:cursor-grabbing"
              style={{
                borderColor: 'rgba(216, 226, 143, 0.58)',
                background:
                  'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.55), rgba(216,226,143,0.24) 28%, rgba(74,222,128,0.28) 70%, rgba(0,0,0,0.4) 100%)',
                boxShadow: '0 0 28px rgba(74, 222, 128, 0.16), inset -6px -6px 14px rgba(0,0,0,0.25)',
              }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Orbit, label: 'altura', value: sphereElevated ? 'alta' : 'baja' },
              { icon: Weight, label: 'masa', value: 'constante' },
              { icon: CircleDot, label: 'gravedad', value: 'activa' },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-sm border px-3 py-2"
                style={{
                  borderColor: 'rgba(74, 222, 128, 0.14)',
                  backgroundColor: 'rgba(74, 222, 128, 0.035)',
                  color: 'rgba(134, 239, 172, 0.72)',
                }}
              >
                <div className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-widest">
                  <item.icon size={13} />
                  {item.label}
                </div>
                <div className="text-xs" style={{ color: item.label === 'altura' && sphereElevated ? '#dfe9ae' : '#86efac' }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-sm border p-3" style={{ borderColor: 'rgba(74, 222, 128, 0.14)', backgroundColor: 'rgba(74, 222, 128, 0.025)' }}>
            <div className="mb-3 text-[10px] uppercase tracking-[0.25em]" style={{ color: 'rgba(216, 226, 143, 0.55)' }}>
              Banco de palabras
            </div>
            <div className="flex flex-wrap gap-2">
              {wordBank.map((word) => {
                const isUsed = usedWords.has(word)
                const isSelected = selectedWord === word

                return (
                  <button
                    key={word}
                    type="button"
                    onClick={() => handleWordSelect(word)}
                    disabled={answered || !sphereElevated || isUsed}
                    className="px-3 py-2 text-xs uppercase tracking-widest border rounded-sm transition-all duration-150 disabled:opacity-35"
                    style={{
                      borderColor: isSelected ? 'rgba(216, 226, 143, 0.55)' : 'rgba(74, 222, 128, 0.24)',
                      backgroundColor: isSelected ? 'rgba(216, 226, 143, 0.1)' : 'rgba(74, 222, 128, 0.04)',
                      color: isSelected ? '#dfe9ae' : '#86efac',
                      fontFamily: '"Courier New", monospace',
                    }}
                  >
                    {word}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <div className="activity-text text-sm sm:text-base leading-relaxed whitespace-pre-line" style={{ color: '#86efac' }}>
        {renderText}
      </div>

      {!answered && (
        <motion.button
          onClick={handleConfirm}
          disabled={!allFilled || (isSphereActivity && !sphereElevated)}
          className="btn-compact self-start px-5 py-2 sm:px-6 text-xs tracking-widest uppercase border transition-all duration-150 disabled:opacity-30"
          style={{
            color: '#4ade80',
            borderColor: allFilled && (!isSphereActivity || sphereElevated) ? 'rgba(74, 222, 128, 0.3)' : 'rgba(74, 222, 128, 0.1)',
            fontFamily: '"Courier New", monospace',
          }}
          whileHover={allFilled && (!isSphereActivity || sphereElevated) ? { scale: 1.02 } : {}}
          whileTap={allFilled && (!isSphereActivity || sphereElevated) ? { scale: 0.98 } : {}}
        >
          CONFIRMAR
        </motion.button>
      )}

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
