import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { CreatePlayerData, PlayerResult } from '@/types/player'

const COLLECTION_NAME = 'leaderboard'

export async function createPlayer(data: CreatePlayerData): Promise<PlayerResult> {
  if (!db) throw new Error('Firestore no está disponible')

  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    playerName: data.playerName.trim(),
    score: 0,
    level: 1,
    completedLevels: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return {
    id: docRef.id,
    playerName: data.playerName.trim(),
  }
}
