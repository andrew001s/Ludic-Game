'use client'

import { useState, useCallback, useMemo } from 'react'
import type { LevelConfig, InteractiveObjectConfig, DialogueLine } from '@/types/level'
import { getActivityConfig } from '@/services/activity.service'
import type { ActivityConfig } from '@/types/activity'
import type { ActivityCompletionMetrics } from '@/types/progress'

export type EnginePhase = 'introduction' | 'exploration' | 'activity' | 'completion'

export interface SceneEngineState {
  phase: EnginePhase
  dialogueLines: DialogueLine[]
  activeObject: InteractiveObjectConfig | null
  activeActivity: ActivityConfig | null
  completedObjects: Set<string>
  currentDialogueIndex: number
  dialogueComplete: boolean
  completedActivities: ActivityCompletionMetrics[]
}

export interface SceneEngineActions {
  startExploration: () => void
  interactWithObject: (obj: InteractiveObjectConfig) => void
  completeActivity: (metrics: ActivityCompletionMetrics) => void
  closeActivity: () => void
  nextDialogue: () => void
  setDialogueComplete: (v: boolean) => void
}

export function useSceneEngine(levelConfig: LevelConfig) {
  const [phase, setPhase] = useState<EnginePhase>('introduction')
  const [completedObjects, setCompletedObjects] = useState<Set<string>>(new Set())
  const [activeObject, setActiveObject] = useState<InteractiveObjectConfig | null>(null)
  const [activeActivity, setActiveActivity] = useState<ActivityConfig | null>(null)
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0)
  const [dialogueComplete, setDialogueComplete] = useState(false)
  const [completedActivities, setCompletedActivities] = useState<ActivityCompletionMetrics[]>([])

  const dialogueLines = useMemo((): DialogueLine[] => {
    if (phase === 'introduction') return levelConfig.introduction
    if (phase === 'completion') return levelConfig.completionDialogue
    return []
  }, [phase, levelConfig])

  const allCompleted = useMemo(
    () => levelConfig.interactiveObjects.every((obj) => completedObjects.has(obj.id)),
    [levelConfig.interactiveObjects, completedObjects],
  )

  const findLockedByTitle = useCallback(
    (obj: InteractiveObjectConfig): string | null => {
      if (!obj.unlockAfter) return null
      if (completedObjects.has(obj.unlockAfter)) return null
      const blocker = levelConfig.interactiveObjects.find((o) => o.id === obj.unlockAfter)
      return blocker?.title ?? obj.unlockAfter
    },
    [levelConfig.interactiveObjects, completedObjects],
  )

  const isUnlocked = useCallback(
    (obj: InteractiveObjectConfig): boolean => {
      if (!obj.unlockAfter) return true
      return completedObjects.has(obj.unlockAfter)
    },
    [completedObjects],
  )

  const startExploration = useCallback(() => {
    setPhase('exploration')
    setCurrentDialogueIndex(0)
    setDialogueComplete(false)
  }, [])

  const interactWithObject = useCallback(
    (obj: InteractiveObjectConfig) => {
      const activity = getActivityConfig(obj.activityId)
      if (!activity) return
      setActiveObject(obj)
      setActiveActivity(activity)
      setPhase('activity')
    },
    [],
  )

  const completeActivity = useCallback((metrics: ActivityCompletionMetrics) => {
    if (!activeObject) return
    setCompletedActivities((prev) => [...prev, metrics])
    setCompletedObjects((prev) => {
      const next = new Set(prev)
      next.add(activeObject.id)
      return next
    })
    setActiveObject(null)
    setActiveActivity(null)

    // Check if all completed
    const updated = new Set(completedObjects)
    updated.add(activeObject.id)
    const allDone = levelConfig.interactiveObjects.every((obj) => updated.has(obj.id))

    if (allDone) {
      setPhase('completion')
      setCurrentDialogueIndex(0)
      setDialogueComplete(false)
    } else {
      setPhase('exploration')
    }
  }, [activeObject, completedObjects, levelConfig.interactiveObjects])

  const closeActivity = useCallback(() => {
    setActiveObject(null)
    setActiveActivity(null)
    setPhase('exploration')
  }, [])

  const nextDialogue = useCallback(() => {
    setCurrentDialogueIndex((prev) => prev + 1)
    setDialogueComplete(false)
  }, [])

  return {
    state: {
      phase,
      dialogueLines,
      activeObject,
      activeActivity,
      completedObjects,
      currentDialogueIndex,
      dialogueComplete,
      completedActivities,
    } as SceneEngineState,
    actions: {
      startExploration,
      interactWithObject,
      completeActivity,
      closeActivity,
      nextDialogue,
      setDialogueComplete,
    } as SceneEngineActions,
    helpers: {
      isUnlocked,
      findLockedByTitle,
      allCompleted,
    },
  }
}
