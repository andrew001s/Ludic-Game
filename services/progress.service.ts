import { doc, runTransaction, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { LevelScoreSummary } from '@/types/progress'

const COLLECTION_NAME = 'leaderboard'

export async function syncPlayerLevelProgress(params: {
  playerId: string
  nextLevel: number
  summary: LevelScoreSummary
}): Promise<void> {
  if (!db) throw new Error('Firestore no está disponible')

  const { playerId, nextLevel, summary } = params
  const playerRef = doc(db, COLLECTION_NAME, playerId)

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(playerRef)

    if (!snapshot.exists()) {
      throw new Error('No se encontró el jugador para sincronizar su progreso')
    }

    transaction.update(playerRef, {
      score: summary.score,
      level: nextLevel,
      completedLevels: summary.completedLevels,
      currentStreak: summary.currentStreak,
      bestStreak: summary.bestStreak,
      totalActivitiesCompleted: summary.totalActivitiesCompleted,
      perfectActivities: summary.perfectActivities,
      lastLevelId: summary.levelId,
      lastLevelScore: summary.earnedScore,
      updatedAt: serverTimestamp(),
    })
  })
}
