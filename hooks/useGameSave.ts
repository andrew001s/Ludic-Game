'use client'

import { useState, useCallback, useEffect } from 'react'
import type { GameSave } from '@/types/game'
import { SAVE_KEY } from '@/types/game'

export interface UseGameSaveReturn {
  save: GameSave | null
  hasSave: boolean
  loadSave: () => void
  saveGame: (data: GameSave) => void
  clearSave: () => void
}

export function useGameSave(): UseGameSaveReturn {
  const [save, setSave] = useState<GameSave | null>(null)

  const loadSave = useCallback(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as GameSave
        if (parsed && typeof parsed.currentLevel === 'number' && parsed.playerId) {
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
    // Defer loadSave to avoid calling setState synchronously within an effect
    const t = setTimeout(() => {
      loadSave()
    }, 0)
    return () => clearTimeout(t)
  }, [loadSave])

  const saveGame = useCallback((data: GameSave) => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data))
      setSave(data)
    } catch {
      // localStorage unavailable
    }
  }, [])

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
    saveGame,
    clearSave,
  }
}
