import type { LeaderboardPlayer, LeaderboardResponse, LeaderboardFilters, LeaderboardPagination } from '@/types/leaderboard'

const PAGE_SIZE = 10
const COLLECTION_NAME = 'leaderboard'

function getMockPlayers(): LeaderboardPlayer[] {
  return [
    { id: '1', playerName: 'ExploradorNocturno', score: 9850, level: 12, createdAt: Date.now() - 86400000 },
    { id: '2', playerName: 'Guardi\u00E1nVerde', score: 7200, level: 9, createdAt: Date.now() - 172800000 },
    { id: '3', playerName: 'SombraDelBosque', score: 6400, level: 8, createdAt: Date.now() - 259200000 },
    { id: '4', playerName: 'LuzDeLuna', score: 5100, level: 6, createdAt: Date.now() - 345600000 },
    { id: '5', playerName: 'Ra\u00EDzAntigua', score: 4800, level: 6, createdAt: Date.now() - 432000000 },
    { id: '6', playerName: 'Cient\u00EDficoOlvidado', score: 3900, level: 5, createdAt: Date.now() - 518400000 },
    { id: '7', playerName: 'NieblaEterna', score: 3200, level: 4, createdAt: Date.now() - 604800000 },
    { id: '8', playerName: 'RunaPerdida', score: 2800, level: 3, createdAt: Date.now() - 691200000 },
    { id: '9', playerName: 'FuegoFatuo', score: 2100, level: 3, createdAt: Date.now() - 777600000 },
    { id: '10', playerName: 'MusgoMilenario', score: 1500, level: 2, createdAt: Date.now() - 864000000 },
    { id: '11', playerName: 'CristalOscuro', score: 1200, level: 1, createdAt: Date.now() - 950400000 },
    { id: '12', playerName: 'VientoDelEste', score: 800, level: 1, createdAt: Date.now() - 1036800000 },
  ]
}

function getFirestoreService() {
  if (typeof window === 'undefined') return null
  try {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    if (!apiKey || !projectId) return null

    const { initializeApp, getApps } = require('firebase/app') as typeof import('firebase/app')
    const { getFirestore, collection, query, orderBy, limit, getDocs, where } =
      require('firebase/firestore') as typeof import('firebase/firestore')

    if (!getApps().length) {
      initializeApp({ apiKey, projectId, authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '' })
    }

    const db = getFirestore()
    return { db, collection, query, orderBy, limit, getDocs, where }
  } catch {
    return null
  }
}

export async function getLeaderboard(): Promise<LeaderboardResponse> {
  const fb = getFirestoreService()
  if (fb) {
    try {
      const q = fb.query(
        fb.collection(fb.db, COLLECTION_NAME),
        fb.orderBy('score', 'desc'),
        fb.limit(PAGE_SIZE),
      )
      const snapshot = await fb.getDocs(q)
      const players: LeaderboardPlayer[] = snapshot.docs.map((doc: { id: string; data(): Record<string, unknown> }) => {
        const data = doc.data()
        return {
          id: doc.id,
          playerName: data.playerName as string,
          score: data.score as number,
          level: data.level as number,
          createdAt: typeof (data.createdAt as { toMillis?: () => number })?.toMillis === 'function'
            ? (data.createdAt as { toMillis: () => number }).toMillis()
            : (data.createdAt as number) ?? Date.now(),
        }
      })
      return { players, total: players.length }
    } catch {
      // Fall through to mock data
    }
  }

  const players = getMockPlayers()
  return { players: players.slice(0, PAGE_SIZE), total: players.length }
}

export async function searchLeaderboard(filters: LeaderboardFilters): Promise<LeaderboardResponse> {
  const searchTerm = filters.search.toLowerCase().trim()

  const fb = getFirestoreService()
  if (fb) {
    try {
      const q = fb.query(
        fb.collection(fb.db, COLLECTION_NAME),
        fb.orderBy('score', 'desc'),
        fb.limit(100),
      )
      const snapshot = await fb.getDocs(q)
      let allPlayers: LeaderboardPlayer[] = snapshot.docs.map((doc: { id: string; data(): Record<string, unknown> }) => {
        const data = doc.data()
        return {
          id: doc.id,
          playerName: data.playerName as string,
          score: data.score as number,
          level: data.level as number,
          createdAt: typeof (data.createdAt as { toMillis?: () => number })?.toMillis === 'function'
            ? (data.createdAt as { toMillis: () => number }).toMillis()
            : (data.createdAt as number) ?? Date.now(),
        }
      })
      if (searchTerm) {
        allPlayers = allPlayers.filter((p) => p.playerName.toLowerCase().includes(searchTerm))
      }
      return { players: allPlayers.slice(0, PAGE_SIZE), total: allPlayers.length }
    } catch {
      // Fall through to mock data
    }
  }

  const players = getMockPlayers()
  const filtered = searchTerm
    ? players.filter((p) => p.playerName.toLowerCase().includes(searchTerm))
    : players
  return { players: filtered.slice(0, PAGE_SIZE), total: filtered.length }
}

export async function getLeaderboardPage(
  page: number,
): Promise<{ players: LeaderboardPlayer[]; pagination: LeaderboardPagination }> {
  const allPlayers = getMockPlayers()
  const totalPages = Math.max(1, Math.ceil(allPlayers.length / PAGE_SIZE))
  const start = (page - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE

  return {
    players: allPlayers.slice(start, end),
    pagination: {
      page,
      pageSize: PAGE_SIZE,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    },
  }
}
