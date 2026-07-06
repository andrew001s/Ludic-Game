'use client'

import { useState, useCallback, useEffect } from 'react'
import type { GameSave } from '@/types/game'
import { SAVE_KEY } from '@/types/game'

export interface UseGameSaveReturn {
  save: GameSave | null
  hasSave: boolean
  loadSave: () => void
  clearSave: () => void
}

export function useGameSave(): UseGameSaveReturn {
  const [save, setSave] = useState<GameSave | null>(null)

  const loadSave = useCallback(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as GameSave
        if (parsed && typeof parsed.level === 'number') {
          setSave(parsed)
          return
        }
      }
      setSave(null)
    } catch {
      setSave(null)
    }
  }, [])

  useEffect(() => {
    loadSave()
  }, [loadSave])

  const clearSave = useCallback(() => {
    try {
      localStorage.removeItem(SAVE_KEY)
    } catch {
      // localStorage unavailable
    }
    setSave(null)
  }, [])

  return {
    save,
    hasSave: save !== null,
    loadSave,
    clearSave,
  }
}
