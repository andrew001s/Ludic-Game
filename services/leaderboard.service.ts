import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { LeaderboardPlayer, LeaderboardResponse, LeaderboardFilters } from '@/types/leaderboard'

const PAGE_SIZE = 10
const COLLECTION_NAME = 'leaderboard'

function toMillis(ts: unknown): number {
  if (ts && typeof ts === 'object' && 'toMillis' in ts && typeof (ts as { toMillis: () => number }).toMillis === 'function') {
    return (ts as { toMillis: () => number }).toMillis()
  }
  return (ts as number) ?? Date.now()
}

function mapDocToPlayer(doc: { id: string; data(): Record<string, unknown> }): LeaderboardPlayer {
  const d = doc.data()
  return {
    id: doc.id,
    playerName: d.playerName as string,
    score: d.score as number,
    level: d.level as number,
    completedLevels: d.completedLevels as number,
    bestStreak: (d.bestStreak as number) ?? 0,
    perfectActivities: (d.perfectActivities as number) ?? 0,
    totalActivitiesCompleted: (d.totalActivitiesCompleted as number) ?? 0,
    createdAt: toMillis(d.createdAt),
    updatedAt: toMillis(d.updatedAt),
  }
}

export async function getLeaderboard(): Promise<LeaderboardResponse> {
  if (!db) throw new Error('Firestore no está disponible')

  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy('score', 'desc'),
    limit(PAGE_SIZE),
  )
  const snapshot = await getDocs(q)
  const players = snapshot.docs.map(mapDocToPlayer)
  return { players, total: players.length }
}

export async function searchLeaderboard(filters: LeaderboardFilters): Promise<LeaderboardResponse> {
  const searchTerm = filters.search.toLowerCase().trim()

  if (!db) throw new Error('Firestore no está disponible')

  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy('score', 'desc'),
    limit(100),
  )
  const snapshot = await getDocs(q)
  let players = snapshot.docs.map(mapDocToPlayer)
  if (searchTerm) {
    players = players.filter((p) => p.playerName.toLowerCase().includes(searchTerm))
  }
  return { players: players.slice(0, PAGE_SIZE), total: players.length }
}

