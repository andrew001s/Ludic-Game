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

  const normalizeSave = useCallback((parsed: GameSave): GameSave => ({
    ...parsed,
    score: parsed.score ?? 0,
    currentStreak: parsed.currentStreak ?? 0,
    bestStreak: parsed.bestStreak ?? 0,
    completedLevels: parsed.completedLevels ?? 0,
    totalActivitiesCompleted: parsed.totalActivitiesCompleted ?? 0,
    perfectActivities: parsed.perfectActivities ?? 0,
  }), [])

  const loadSave = useCallback(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as GameSave
        if (parsed && typeof parsed.currentLevel === 'number' && parsed.playerId) {
          setSave(normalizeSave(parsed))
          return
        }
      }
      setSave(null)
    } catch {
      setSave(null)
    }
  }, [normalizeSave])

  useEffect(() => {
    // Defer loadSave to avoid calling setState synchronously within an effect
    const t = setTimeout(() => {
      loadSave()
    }, 0)
    return () => clearTimeout(t)
  }, [loadSave])

  const saveGame = useCallback((data: GameSave) => {
    try {
      const normalized = normalizeSave(data)
      localStorage.setItem(SAVE_KEY, JSON.stringify(normalized))
      setSave(normalized)
    } catch {
      // localStorage unavailable
    }
  }, [normalizeSave])

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
