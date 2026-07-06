'use client'

import { useState, useCallback } from 'react'
import { createPlayer } from '@/services/player.service'
import type { PlayerResult } from '@/types/player'

interface UseCreatePlayerReturn {
  create: (playerName: string) => Promise<PlayerResult>
  loading: boolean
  error: string | null
  reset: () => void
}

export function useCreatePlayer(): UseCreatePlayerReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = useCallback(async (playerName: string): Promise<PlayerResult> => {
    setLoading(true)
    setError(null)

    try {
      const result = await createPlayer({ playerName })
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear el jugador'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
  }, [])

  return { create, loading, error, reset }
}
