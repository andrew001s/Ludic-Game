'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Award, Flame, ShieldCheck, Sparkles, Star, Swords, Trophy } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ActivityCompletionMetrics, LevelScoreSummary, PlayerProgressSnapshot } from '@/types/progress'

const ACHIEVEMENTS_KEY = 'guardianes-achievements'
const TOAST_DURATION_MS = 5200

type AchievementId =
  | 'first_sector'
  | 'perfect_sector'
  | 'boss_resolver'
  | 'streak_guardian'
  | 'score_hunter'
  | 'restoration_complete'

type AchievementDefinition = {
  id: AchievementId
  title: string
  description: string
  accent: string
  Icon: LucideIcon
}

type StoredAchievements = Partial<Record<AchievementId, number>>

type AchievementToast = AchievementDefinition & {
  toastId: string
}

type AchievementEvaluationInput = {
  levelId: string
  summary: LevelScoreSummary
  completedActivities: ActivityCompletionMetrics[]
  previous: PlayerProgressSnapshot
}

type AchievementContextValue = {
  unlockedAchievements: StoredAchievements
  evaluateLevelAchievements: (input: AchievementEvaluationInput) => void
}

const ACHIEVEMENTS: Record<AchievementId, AchievementDefinition> = {
  first_sector: {
    id: 'first_sector',
    title: 'Primer sector restaurado',
    description: 'Completaste tu primer nivel y activaste la expedicion.',
    accent: '#86efac',
    Icon: Sparkles,
  },
  perfect_sector: {
    id: 'perfect_sector',
    title: 'Sector impecable',
    description: 'Terminaste un nivel con todas sus actividades perfectas.',
    accent: '#fef08a',
    Icon: Star,
  },
  boss_resolver: {
    id: 'boss_resolver',
    title: 'Mente de laboratorio',
    description: 'Superaste un desafio maestro sin perder el ritmo.',
    accent: '#93c5fd',
    Icon: Swords,
  },
  streak_guardian: {
    id: 'streak_guardian',
    title: 'Guardian de la racha',
    description: 'Alcanzaste una cadena perfecta de 5 actividades.',
    accent: '#c4b5fd',
    Icon: Flame,
  },
  score_hunter: {
    id: 'score_hunter',
    title: 'Cazador de energia',
    description: 'Acumulaste 5,000 puntos en la campaña.',
    accent: '#f9a8d4',
    Icon: Trophy,
  },
  restoration_complete: {
    id: 'restoration_complete',
    title: 'Restauracion total',
    description: 'Llegaste al final y devolviste el equilibrio al NEXUS.',
    accent: '#fde68a',
    Icon: ShieldCheck,
  },
}

const AchievementContext = createContext<AchievementContextValue | null>(null)

function readAchievements(): StoredAchievements {
  if (typeof window === 'undefined') return {}

  try {
    const raw = window.localStorage.getItem(ACHIEVEMENTS_KEY)
    if (!raw) return {}

    const parsed = JSON.parse(raw) as StoredAchievements
    return parsed ?? {}
  } catch {
    return {}
  }
}

export function AchievementProvider({ children }: { children: React.ReactNode }) {
  const [unlockedAchievements, setUnlockedAchievements] = useState<StoredAchievements>({})
  const [activeToasts, setActiveToasts] = useState<AchievementToast[]>([])
  const unlockedAchievementsRef = useRef<StoredAchievements>({})
  const queuedAchievementsRef = useRef<Set<AchievementId>>(new Set())

  useEffect(() => {
    const achievements = readAchievements()
    unlockedAchievementsRef.current = achievements
    setUnlockedAchievements(achievements)
  }, [])

  const persistAchievements = useCallback((next: StoredAchievements) => {
    try {
      window.localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(next))
    } catch {
      // localStorage unavailable
    }
  }, [])

  const queueAchievementToast = useCallback((achievement: AchievementDefinition) => {
    if (queuedAchievementsRef.current.has(achievement.id)) return

    queuedAchievementsRef.current.add(achievement.id)
    const toastId = `${achievement.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    setActiveToasts((current) => [...current, { ...achievement, toastId }])

    window.setTimeout(() => {
      queuedAchievementsRef.current.delete(achievement.id)
      setActiveToasts((current) => current.filter((toast) => toast.toastId !== toastId))
    }, TOAST_DURATION_MS)
  }, [])

  const unlockAchievement = useCallback((achievementId: AchievementId) => {
    if (unlockedAchievementsRef.current[achievementId]) return

    const next = {
      ...unlockedAchievementsRef.current,
      [achievementId]: Date.now(),
    }

    unlockedAchievementsRef.current = next
    persistAchievements(next)
    setUnlockedAchievements(next)
    queueAchievementToast(ACHIEVEMENTS[achievementId])
  }, [persistAchievements, queueAchievementToast])

  const evaluateLevelAchievements = useCallback((input: AchievementEvaluationInput) => {
    const { levelId, summary, completedActivities, previous } = input

    if (previous.completedLevels < 1 && summary.completedLevels >= 1) {
      unlockAchievement('first_sector')
    }

    if (summary.activityCount > 0 && summary.perfectCount === summary.activityCount) {
      unlockAchievement('perfect_sector')
    }

    if (
      completedActivities.some((activity) => activity.activityType === 'boss-quiz') &&
      summary.perfectCount >= Math.max(1, summary.activityCount - 1)
    ) {
      unlockAchievement('boss_resolver')
    }

    if (previous.bestStreak < 5 && summary.bestStreak >= 5) {
      unlockAchievement('streak_guardian')
    }

    if (previous.score < 5000 && summary.score >= 5000) {
      unlockAchievement('score_hunter')
    }

    if (levelId === 'level-6' && summary.completedLevels >= 6) {
      unlockAchievement('restoration_complete')
    }
  }, [unlockAchievement])

  const value = useMemo<AchievementContextValue>(() => ({
    unlockedAchievements,
    evaluateLevelAchievements,
  }), [evaluateLevelAchievements, unlockedAchievements])

  return (
    <AchievementContext.Provider value={value}>
      {children}

      <div
        className="pointer-events-none fixed right-3 top-3 z-[140] flex w-[min(92vw,22rem)] flex-col gap-3 sm:right-4 sm:top-4"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <AnimatePresence initial={false}>
          {activeToasts.map(({ toastId, title, description, accent, Icon }) => (
            <motion.div
              key={toastId}
              initial={{ opacity: 0, x: 80, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.96 }}
              transition={{ duration: 0.26, ease: 'easeOut' }}
              className="overflow-hidden border"
              style={{
                borderColor: `${accent}80`,
                background:
                  'linear-gradient(135deg, rgba(7,10,8,0.98), rgba(15,23,18,0.96) 58%, rgba(10,15,12,0.98))',
                boxShadow: `0 18px 48px rgba(0,0,0,0.42), 0 0 28px ${accent}22`,
                fontFamily: '"Courier New", monospace',
              }}
            >
              <div className="flex items-start gap-3 p-3 sm:p-4">
                <div
                  className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full border"
                  style={{
                    color: accent,
                    borderColor: `${accent}70`,
                    backgroundColor: `${accent}14`,
                  }}
                >
                  <Award size={16} aria-hidden="true" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase tracking-[0.24em]" style={{ color: 'rgba(223, 233, 174, 0.58)' }}>
                    Logro desbloqueado
                  </div>
                  <div className="mt-1 flex items-center gap-2" style={{ color: '#f0fdf4' }}>
                    <Icon size={15} aria-hidden="true" style={{ color: accent }} />
                    <p className="text-sm font-bold leading-snug">{title}</p>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed sm:text-xs" style={{ color: 'rgba(220, 252, 231, 0.76)' }}>
                    {description}
                  </p>
                </div>
              </div>

              <div className="h-[2px] w-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                <motion.div
                  className="h-full"
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: TOAST_DURATION_MS / 1000, ease: 'linear' }}
                  style={{ background: `linear-gradient(90deg, ${accent}, ${accent}66)` }}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </AchievementContext.Provider>
  )
}

export function useAchievements() {
  const context = useContext(AchievementContext)

  if (!context) {
    throw new Error('useAchievements must be used within an AchievementProvider')
  }

  return context
}
