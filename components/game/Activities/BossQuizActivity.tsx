'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { ActivityConfig, BossQuizQuestion } from '@/types/activity'

function QuestionCard({
  question,
  timePerQuestion,
  questionNum,
  totalQuestions,
  onAnswer,
}: {
  question: BossQuizQuestion
  timePerQuestion: number
  questionNum: number
  totalQuestions: number
  onAnswer: (correct: boolean) => void
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const [qAnswered, setQAnswered] = useState(false)
  const [timeLeft, setTimeLeft] = useState(timePerQuestion)
  const answeredRef = useRef(false)

  useEffect(() => {
    if (qAnswered) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1
        if (next <= 0) {
          clearInterval(timer)
          return 0
        }
        return next
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [qAnswered])

  // Auto-timeout when timer reaches 0
  useEffect(() => {
    if (timeLeft > 0 || qAnswered) return
    if (answeredRef.current) return
    answeredRef.current = true
    const id = setTimeout(() => onAnswer(false), 0)
    return () => clearTimeout(id)
  }, [timeLeft, qAnswered, onAnswer])

  const handleSelect = useCallback(
    (index: number) => {
      if (qAnswered) return
      setSelected(index)
    },
    [qAnswered],
  )

  const handleConfirm = useCallback(() => {
    if (selected === null) return
    if (qAnswered) return
    setQAnswered(true)
    const correct = selected === question.correctIndex
    const id = setTimeout(() => onAnswer(correct), 0)
    return () => clearTimeout(id)
  }, [selected, qAnswered, question.correctIndex, onAnswer])

  const handleAutoNext = useCallback(() => {
    onAnswer(selected === question.correctIndex)
  }, [selected, question.correctIndex, onAnswer])

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="text-xs tracking-widest" style={{ color: 'rgba(74, 222, 128, 0.4)' }}>
          {questionNum}/{totalQuestions}
        </div>
        <div
          className="px-2 py-0.5 border text-xs tabular-nums"
          style={{
            borderColor: timeLeft <= 5 && !qAnswered ? 'rgba(239, 68, 68, 0.4)' : 'rgba(74, 222, 128, 0.2)',
            color: timeLeft <= 5 && !qAnswered ? 'rgba(239, 68, 68, 0.8)' : 'rgba(74, 222, 128, 0.6)',
          }}
        >
          {timeLeft}s
        </div>
      </div>

      <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#86efac' }}>
        {question.question}
      </p>

      <div className="flex flex-col gap-2">
        {question.options.map((option, i) => {
          let borderColor = 'rgba(74, 222, 128, 0.2)'
          let bgColor = 'rgba(74, 222, 128, 0.03)'
          let textColor = 'rgba(134, 239, 172, 0.7)'
          let glow = 'none'

          if (qAnswered) {
            if (i === question.correctIndex) {
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
              disabled={qAnswered}
              className="w-full text-left px-4 py-3 text-sm border transition-all duration-150 disabled:cursor-default"
              style={{ borderColor, backgroundColor: bgColor, color: textColor, boxShadow: glow }}
              whileHover={qAnswered ? {} : { scale: 1.005 }}
              whileTap={qAnswered ? {} : { scale: 0.995 }}
            >
              {option}
            </motion.button>
          )
        })}
      </div>

      {qAnswered ? (
        <motion.button
          onClick={handleAutoNext}
          className="self-start px-6 py-2 text-xs tracking-widest uppercase border"
          style={{
            color: '#4ade80',
            borderColor: 'rgba(74, 222, 128, 0.3)',
            fontFamily: '"Courier New", monospace',
          }}
          whileHover={{ scale: 1.02 }}
        >
          {questionNum === totalQuestions ? 'VER RESULTADOS' : 'SIGUIENTE'}
        </motion.button>
      ) : (
        <motion.button
          onClick={handleConfirm}
          className="self-start px-6 py-2 text-xs tracking-widest uppercase border"
          style={{
            color: selected !== null ? '#4ade80' : 'rgba(74, 222, 128, 0.2)',
            borderColor: selected !== null ? 'rgba(74, 222, 128, 0.3)' : 'rgba(74, 222, 128, 0.1)',
            fontFamily: '"Courier New", monospace',
          }}
          whileHover={selected !== null ? { scale: 1.02 } : {}}
          whileTap={selected !== null ? { scale: 0.98 } : {}}
        >
          CONFIRMAR
        </motion.button>
      )}
    </>
  )
}

export function BossQuizActivity({ activity, onComplete }: { activity: ActivityConfig; onComplete: () => void }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [results, setResults] = useState<boolean[]>([])
  const [finished, setFinished] = useState(false)
  const ac = activity as Extract<ActivityConfig, { type: 'boss-quiz' }>

  const totalQuestions = ac.questions.length
  const isLast = currentQ === totalQuestions - 1
  const correctCount = results.filter(Boolean).length
  const passed = correctCount >= ac.passThreshold

  const handleAnswer = useCallback(
    (correct: boolean) => {
      setResults((prev) => {
        const next = [...prev, correct]
        if (isLast) {
          setFinished(true)
        } else {
          setCurrentQ((q) => q + 1)
        }
        return next
      })
    },
    [isLast],
  )

  if (finished) {
    return (
      <div
        className="flex flex-col gap-6"
        style={{ fontFamily: '"Courier New", monospace' }}
      >
        <div className="text-xs tracking-widest uppercase" style={{ color: 'rgba(74, 222, 128, 0.4)' }}>
          EVALUACIÓN COMPLETADA
        </div>

        <div className="text-center py-6">
          <div
            className="text-4xl font-bold mb-2"
            style={{
              color: passed ? '#4ade80' : 'rgba(239, 68, 68, 0.8)',
              textShadow: passed ? '0 0 20px rgba(74, 222, 128, 0.3)' : 'none',
            }}
          >
            {correctCount}/{totalQuestions}
          </div>
          <div className="text-xs tracking-widest" style={{ color: 'rgba(74, 222, 128, 0.3)' }}>
            RESPUESTAS CORRECTAS
          </div>
        </div>

        <div className="flex justify-center gap-2">
          {results.map((r, i) => (
            <div
              key={i}
              className="w-4 h-4 border"
              style={{
                borderColor: r ? 'rgba(74, 222, 128, 0.4)' : 'rgba(239, 68, 68, 0.3)',
                backgroundColor: r ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.1)',
              }}
            />
          ))}
        </div>

        <motion.div
          className="p-4 border text-sm leading-relaxed"
          style={{
            borderColor: passed ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            backgroundColor: passed ? 'rgba(74, 222, 128, 0.05)' : 'rgba(239, 68, 68, 0.05)',
            color: passed ? '#86efac' : 'rgba(239, 68, 68, 0.7)',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {passed ? ac.feedback.success : ac.feedback.error}
          <div className="flex gap-3 mt-4">
            {passed ? (
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
                onClick={() => {
                  setCurrentQ(0)
                  setResults([])
                  setFinished(false)
                }}
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
      </div>
    )
  }

  return (
    <div
      className="flex flex-col gap-6"
      style={{ fontFamily: '"Courier New", monospace' }}
    >
      <div className="text-xs tracking-widest uppercase" style={{ color: 'rgba(74, 222, 128, 0.4)' }}>
        {ac.instruction}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 border" style={{ borderColor: 'rgba(74, 222, 128, 0.15)', backgroundColor: 'rgba(74, 222, 128, 0.03)' }}>
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${(results.length / totalQuestions) * 100}%`,
            backgroundColor: 'rgba(74, 222, 128, 0.2)',
          }}
        />
      </div>

      {/* Keyed by currentQ so timer/state reset on each question */}
      <QuestionCard
        key={currentQ}
        question={ac.questions[currentQ]}
        timePerQuestion={ac.timePerQuestion}
        questionNum={currentQ + 1}
        totalQuestions={totalQuestions}
        onAnswer={handleAnswer}
      />
    </div>
  )
}
