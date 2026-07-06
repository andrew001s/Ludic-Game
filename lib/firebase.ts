import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getAuth, type Auth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
}

function isFirebaseConfigured(config: typeof firebaseConfig): boolean {
  return Boolean(config.apiKey && config.projectId)
}

let app: FirebaseApp | null = null
let db: Firestore | null = null
let auth: Auth | null = null

function initFirebase(): void {
  if (typeof window === 'undefined') return

  if (!isFirebaseConfigured(firebaseConfig)) {
    console.info('Firebase not configured. Leaderboard features will use mock data.')
    return
  }

  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig)
    } else {
      app = getApps()[0]
    }
    db = getFirestore(app!)
    auth = getAuth(app!)
  } catch (error) {
    console.error('Failed to initialize Firebase:', error)
  }
}

initFirebase()

export { db, auth }
export { isFirebaseConfigured }
