'use client'

import { useState, useCallback, useEffect, useRef, useReducer } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Timer, Trophy, XCircle, Zap } from 'lucide-react'
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
  const [timeLeft, setTimeLeft] = useState(timePerQuestion)
  const answeredRef = useRef(false)
  const id = `Q${questionNum}`

  useEffect(() => {
    if (answeredRef.current) return

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

    return () => {
      clearInterval(timer)
    }
  }, [id])

  useEffect(() => {
    if (timeLeft > 0) return
    if (answeredRef.current) return

    answeredRef.current = true
    onAnswer(false)
  }, [timeLeft, onAnswer, id])

  const handleSelect = useCallback(
    (index: number) => {
      if (answeredRef.current) {
        return
      }
      const correct = index === question.correctIndex
      answeredRef.current = true
      onAnswer(correct)
    },
    [question.correctIndex, onAnswer],
  )

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="text-xs tracking-widest" style={{ color: 'rgba(74, 222, 128, 0.4)' }}>
          {questionNum}/{totalQuestions}
        </div>
        <div
          className="flex items-center gap-1.5 px-2 py-0.5 border text-xs tabular-nums"
          style={{
            borderColor: 'rgba(74, 222, 128, 0.2)',
            color: 'rgba(74, 222, 128, 0.6)',
          }}
        >
          <Timer size={13} aria-hidden="true" />
          {timeLeft}s
        </div>
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {Array.from({ length: totalQuestions }).map((_, index) => (
          <div
            key={index}
            className="h-1.5 rounded-full"
            style={{
              backgroundColor:
                index < questionNum ? 'rgba(74, 222, 128, 0.35)' : 'rgba(74, 222, 128, 0.08)',
              boxShadow: index === questionNum - 1 ? '0 0 10px rgba(74, 222, 128, 0.24)' : 'none',
            }}
          />
        ))}
      </div>

      <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#86efac' }}>
        {question.question}
      </p>

      <div className="flex flex-col gap-2">
        {question.options.map((option, i) => (
          <motion.button
            key={i}
            onClick={() => handleSelect(i)}
            className="w-full text-left px-4 py-3 text-sm border"
            style={{
              borderColor: 'rgba(74, 222, 128, 0.2)',
              backgroundColor: 'rgba(74, 222, 128, 0.03)',
              color: 'rgba(134, 239, 172, 0.7)',
            }}
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.995 }}
          >
            <span className="flex items-center gap-3">
              <span
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full border"
                style={{
                  borderColor: 'rgba(74, 222, 128, 0.2)',
                  backgroundColor: 'rgba(0, 0, 0, 0.14)',
                }}
              >
                <Zap size={14} aria-hidden="true" />
              </span>
              <span>{option}</span>
            </span>
          </motion.button>
        ))}
      </div>
    </>
  )
}

export function BossQuizActivity({ activity, onComplete }: { activity: ActivityConfig; onComplete: () => void }) {
  const ac = activity as Extract<ActivityConfig, { type: 'boss-quiz' }>
  const totalQuestions = ac.questions.length

  type State = { currentQ: number; results: boolean[]; finished: boolean }
  const [state, dispatch] = useReducer(
    (prev: State, action: { type: 'answer'; correct: boolean } | { type: 'retry' }): State => {
      switch (action.type) {
        case 'answer': {
          const newResults = [...prev.results, action.correct]
          const isLast = newResults.length >= totalQuestions
          return {
            currentQ: isLast ? prev.currentQ : prev.currentQ + 1,
            results: newResults,
            finished: isLast,
          }
        }
        case 'retry':
          return { currentQ: 0, results: [], finished: false }
      }
    },
    { currentQ: 0, results: [], finished: false },
  )

  const { currentQ, results, finished } = state
  const correctCount = results.filter(Boolean).length
  const passed = correctCount >= ac.passThreshold

  if (finished) {
    return (
      <div className="flex flex-col gap-6" style={{ fontFamily: '"Courier New", monospace' }}>
        <div className="text-xs tracking-widest uppercase" style={{ color: 'rgba(74, 222, 128, 0.4)' }}>
          EVALUACIÓN COMPLETADA
        </div>

        <div className="text-center py-6">
          <div
            className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full border"
            style={{
              borderColor: passed ? 'rgba(74, 222, 128, 0.55)' : 'rgba(239, 68, 68, 0.42)',
              color: passed ? '#4ade80' : 'rgba(239, 68, 68, 0.8)',
              backgroundColor: passed ? 'rgba(74, 222, 128, 0.08)' : 'rgba(239, 68, 68, 0.06)',
              boxShadow: passed ? '0 0 22px rgba(74, 222, 128, 0.2)' : 'none',
            }}
          >
            <Trophy size={30} aria-hidden="true" />
          </div>
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
              className="grid h-7 w-7 place-items-center rounded-full border"
              style={{
                borderColor: r ? 'rgba(74, 222, 128, 0.4)' : 'rgba(239, 68, 68, 0.3)',
                backgroundColor: r ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.1)',
                color: r ? '#86efac' : 'rgba(239, 68, 68, 0.72)',
              }}
            >
              {r ? <CheckCircle2 size={15} aria-hidden="true" /> : <XCircle size={15} aria-hidden="true" />}
            </div>
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
                onClick={() => dispatch({ type: 'retry' })}
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
    <div className="flex flex-col gap-6" style={{ fontFamily: '"Courier New", monospace' }}>
      <div className="text-xs tracking-widest uppercase" style={{ color: 'rgba(74, 222, 128, 0.4)' }}>
        {ac.instruction}
      </div>

      <div
        className="h-1.5 border"
        style={{ borderColor: 'rgba(74, 222, 128, 0.15)', backgroundColor: 'rgba(74, 222, 128, 0.03)' }}
      >
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${(results.length / totalQuestions) * 100}%`,
            backgroundColor: 'rgba(74, 222, 128, 0.2)',
          }}
        />
      </div>

      <QuestionCard
        key={currentQ}
        question={ac.questions[currentQ]}
        timePerQuestion={ac.timePerQuestion}
        questionNum={currentQ + 1}
        totalQuestions={totalQuestions}
        onAnswer={(correct) => dispatch({ type: 'answer', correct })}
      />
    </div>
  )
}
