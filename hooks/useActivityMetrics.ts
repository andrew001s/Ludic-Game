'use client'

import { useCallback, useEffect, useRef } from 'react'
import type { ActivityConfig } from '@/types/activity'
import type { ActivityCompletionMetrics } from '@/types/progress'

interface CompletionOverrides {
  accuracyRatio?: number
  extraTimeRatio?: number
  mistakes?: number
  retries?: number
  hintsUsed?: number
  interactions?: number
}

export function useActivityMetrics(activity: ActivityConfig) {
  const startedAtRef = useRef<number | null>(null)
  const mistakesRef = useRef(0)
  const retriesRef = useRef(0)
  const hintsUsedRef = useRef(0)
  const interactionsRef = useRef(0)

  useEffect(() => {
    startedAtRef.current = Date.now()
  }, [])

  const registerInteraction = useCallback(() => {
    interactionsRef.current += 1
  }, [])

  const registerMistake = useCallback(() => {
    mistakesRef.current += 1
    interactionsRef.current += 1
  }, [])

  const registerRetry = useCallback(() => {
    retriesRef.current += 1
  }, [])

  const registerHint = useCallback(() => {
    hintsUsedRef.current += 1
  }, [])

  const buildCompletion = useCallback(
    (overrides?: CompletionOverrides): ActivityCompletionMetrics => ({
      activityId: activity.id,
      activityType: activity.type,
      durationMs: Math.max(1_000, Date.now() - (startedAtRef.current ?? Date.now())),
      mistakes: overrides?.mistakes ?? mistakesRef.current,
      retries: overrides?.retries ?? retriesRef.current,
      hintsUsed: overrides?.hintsUsed ?? hintsUsedRef.current,
      interactions: overrides?.interactions ?? interactionsRef.current,
      accuracyRatio: overrides?.accuracyRatio,
      extraTimeRatio: overrides?.extraTimeRatio,
    }),
    [activity.id, activity.type],
  )

  return {
    registerInteraction,
    registerMistake,
    registerRetry,
    registerHint,
    buildCompletion,
  }
}
