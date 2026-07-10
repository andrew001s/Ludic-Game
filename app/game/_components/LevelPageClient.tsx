'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, FlaskConical, Lightbulb, Orbit, ShieldCheck, Sparkles, Star, TimerReset, Trophy, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SceneEngine } from '@/components/game/SceneEngine/SceneEngine'
import { getLevelConfig } from '@/services/level.service'
import { useGameSave } from '@/hooks/useGameSave'
import { getActivityConfig } from '@/services/activity.service'
import { calculateActivityPerformance, summarizeLevelScore } from '@/lib/scoring'
import { syncPlayerLevelProgress } from '@/services/progress.service'
import type { ActivityCompletionMetrics, LevelScoreSummary } from '@/types/progress'
import { Modal } from '@/components/ui/Modal'
import { useAchievements } from '@/components/game/Achievements/AchievementProvider'

type OutroTone = {
  accent: string
  glow: string
  Icon: LucideIcon
  headline: string
  insight: string
}

const LEVEL_OUTRO_CONTENT: Record<string, OutroTone> = {
  'level-1': {
    accent: '#86efac',
    glow: 'rgba(74, 222, 128, 0.28)',
    Icon: Sparkles,
    headline: 'Movimiento restaurado',
    insight: 'Comprobaste que la energia del movimiento depende de la masa y la velocidad, y que puede activar sistemas completos.',
  },
  'level-2': {
    accent: '#93c5fd',
    glow: 'rgba(96, 165, 250, 0.28)',
    Icon: Orbit,
    headline: 'Equilibrio gravitacional recuperado',
    insight: 'Entendiste que la posicion de un objeto puede almacenar energia y que la gravedad la transforma en movimiento util.',
  },
  'level-3': {
    accent: '#fef08a',
    glow: 'rgba(250, 204, 21, 0.25)',
    Icon: Lightbulb,
    headline: 'Ruta luminica reactivada',
    insight: 'La luz vuelve a circular porque ahora reconoces como transporta energia y como puede convertirse en otras formas utiles.',
  },
  'level-4': {
    accent: '#c4b5fd',
    glow: 'rgba(192, 132, 252, 0.26)',
    Icon: Zap,
    headline: 'Flujo electrico estabilizado',
    insight: 'Restauraste la red electrica comprendiendo como la corriente conecta tecnologia, dispositivos y nuevas transformaciones energeticas.',
  },
  'level-5': {
    accent: '#f9a8d4',
    glow: 'rgba(244, 114, 182, 0.24)',
    Icon: FlaskConical,
    headline: 'Laboratorio bioquimico despierto',
    insight: 'La energia quimica vuelve a impulsar la vida y el laboratorio, dejando listo el camino hacia el Nucleo de Conservacion.',
  },
  'level-6': {
    accent: '#fde68a',
    glow: 'rgba(250, 204, 21, 0.26)',
    Icon: ShieldCheck,
    headline: 'Nucleo de Conservacion restaurado',
    insight: 'Integraste materia, masa y energia para demostrar que comprender las transformaciones es la clave del equilibrio.',
  },
}

const AUTO_ADVANCE_MS = 3600
const INITIAL_LEVEL_LOADER_MS = 900

interface LevelPageClientProps {
  levelId: string
}

export function LevelPageClient({ levelId }: LevelPageClientProps) {
  const router = useRouter()
  const { save, saveGame } = useGameSave()
  const { evaluateLevelAchievements } = useAchievements()
  const [isBooting, setIsBooting] = useState(true)
  const [showOutro, setShowOutro] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [levelSummary, setLevelSummary] = useState<LevelScoreSummary | null>(null)
  const [syncError, setSyncError] = useState<string | null>(null)
  const levelConfig = getLevelConfig(levelId)

  const nextLevelConfig = useMemo(
    () => (levelConfig?.nextLevel ? getLevelConfig(levelConfig.nextLevel) : null),
    [levelConfig],
  )

  const outroTone = useMemo(
    () => (levelConfig ? LEVEL_OUTRO_CONTENT[levelConfig.id] : null),
    [levelConfig],
  )

  useEffect(() => {
    setIsBooting(true)
    const timer = window.setTimeout(() => {
      setIsBooting(false)
    }, INITIAL_LEVEL_LOADER_MS)

    return () => window.clearTimeout(timer)
  }, [levelId])

  useEffect(() => {
    if (!levelConfig?.nextLevel) return
    router.prefetch(`/game/${levelConfig.nextLevel}`)
  }, [levelConfig?.nextLevel, router])

  const completeAndNavigate = useCallback(() => {
    if (!levelConfig || !save || isLeaving) return

    setIsLeaving(true)
    const nextId = levelConfig.nextLevel

    window.setTimeout(() => {
      if (nextId) {
        router.push(`/game/${nextId}`)
      } else {
        router.push('/')
      }
    }, 850)
  }, [isLeaving, levelConfig, router, save])

  const handleConfirmExit = useCallback(() => {
    setShowExitConfirm(false)
    router.push('/')
  }, [router])

  useEffect(() => {
    if (!showOutro || isLeaving) return

    const timer = window.setTimeout(() => {
      completeAndNavigate()
    }, AUTO_ADVANCE_MS)

    return () => window.clearTimeout(timer)
  }, [showOutro, isLeaving, completeAndNavigate])

  const handleLevelComplete = useCallback(async (completedActivities: ActivityCompletionMetrics[]) => {
    if (!save) return
    if (!levelConfig) return

    const previousProgress = {
      score: save.score ?? 0,
      currentStreak: save.currentStreak ?? 0,
      bestStreak: save.bestStreak ?? 0,
      completedLevels: save.completedLevels ?? 0,
      totalActivitiesCompleted: save.totalActivitiesCompleted ?? 0,
      perfectActivities: save.perfectActivities ?? 0,
    }

    const performances = completedActivities.reduce<ReturnType<typeof calculateActivityPerformance>[]>((acc, metrics) => {
      const activity = getActivityConfig(metrics.activityId)
      if (!activity) return acc

      const rollingProgress =
        acc.length === 0
          ? previousProgress
          : {
              score: previousProgress.score + acc.reduce((total, performance) => total + performance.score, 0),
              currentStreak: acc[acc.length - 1].streakAfter,
              bestStreak: Math.max(previousProgress.bestStreak, ...acc.map((performance) => performance.streakAfter)),
              completedLevels: previousProgress.completedLevels,
              totalActivitiesCompleted: previousProgress.totalActivitiesCompleted + acc.length,
              perfectActivities: previousProgress.perfectActivities + acc.filter((performance) => performance.perfect).length,
            }

      acc.push(calculateActivityPerformance(activity, metrics, rollingProgress))
      return acc
    }, [])

    const summary = summarizeLevelScore({
      levelId: levelConfig.id,
      performances,
      previous: previousProgress,
    })

    const nextLevel = levelConfig.nextLevel ? parseInt(levelConfig.nextLevel.replace('level-', '')) : save.currentLevel

    saveGame({
      ...save,
      currentLevel: nextLevel,
      score: summary.score,
      currentStreak: summary.currentStreak,
      bestStreak: summary.bestStreak,
      completedLevels: summary.completedLevels,
      totalActivitiesCompleted: summary.totalActivitiesCompleted,
      perfectActivities: summary.perfectActivities,
      lastSavedAt: Date.now(),
    })

    evaluateLevelAchievements({
      levelId: levelConfig.id,
      summary,
      completedActivities,
      previous: previousProgress,
    })

    setLevelSummary(summary)
    setShowOutro(true)
    setSyncError(null)

    try {
      await syncPlayerLevelProgress({
        playerId: save.playerId,
        nextLevel,
        summary,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo sincronizar el progreso con Firebase.'
      setSyncError(message)
    }
  }, [evaluateLevelAchievements, levelConfig, save, saveGame])

  if (!levelConfig || !outroTone) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <p
          className="text-sm tracking-widest"
          style={{ color: 'rgba(239, 68, 68, 0.5)', fontFamily: '"Courier New", monospace' }}
        >
          Error: nivel no encontrado
        </p>
      </div>
    )
  }

  const { Icon } = outroTone

  return (
    <>
      <SceneEngine
        levelConfig={levelConfig}
        score={save?.score ?? 0}
        onRequestExit={() => setShowExitConfirm(true)}
        onLevelComplete={handleLevelComplete}
      />

      <Modal
        isOpen={showExitConfirm}
        onClose={() => setShowExitConfirm(false)}
        title="CONFIRMAR SALIDA"
        ariaLabel="Confirmar salida al menu principal"
        compact
      >
        <div className="flex flex-col justify-between gap-6" style={{ fontFamily: '"Courier New", monospace' }}>
          <div className="space-y-4">
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#d9f99d' }}>
              ¿Seguro que quieres volver al menú principal?
            </p>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'rgba(220, 252, 231, 0.72)' }}>
              Tu progreso dentro del nivel se perderá. Si estás en medio de un desafío, tendrás que retomarlo desde el nivel.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <motion.button
              type="button"
              onClick={handleConfirmExit}
              className="px-5 py-2 text-xs tracking-[0.22em] uppercase border"
              style={{
                color: '#fca5a5',
                borderColor: 'rgba(248, 113, 113, 0.42)',
                backgroundColor: 'rgba(127, 29, 29, 0.14)',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Sí, salir
            </motion.button>

            <motion.button
              type="button"
              onClick={() => setShowExitConfirm(false)}
              className="px-5 py-2 text-xs tracking-[0.22em] uppercase border"
              style={{
                color: '#d9f99d',
                borderColor: 'rgba(134, 239, 172, 0.3)',
                backgroundColor: 'rgba(21, 128, 61, 0.08)',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Seguir jugando
            </motion.button>
          </div>
        </div>
      </Modal>

      <AnimatePresence>
        {showOutro && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ backgroundColor: 'rgba(2, 6, 4, 0.72)', backdropFilter: 'blur(6px)' }}
          >
            <motion.div
              className="w-full max-w-3xl max-h-[88dvh] overflow-y-auto border p-4 sm:p-7"
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              style={{
                borderColor: `${outroTone.accent}66`,
                background:
                  'linear-gradient(160deg, rgba(6,11,9,0.96), rgba(12,24,19,0.95) 52%, rgba(8,15,12,0.98))',
                boxShadow: `0 0 50px ${outroTone.glow}, inset 0 0 0 1px rgba(255,255,255,0.03)`,
                fontFamily: '"Courier New", monospace',
              }}
            >
              <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className="grid h-11 w-11 sm:h-14 sm:w-14 place-items-center rounded-full border shrink-0"
                    style={{
                      borderColor: `${outroTone.accent}88`,
                      backgroundColor: `${outroTone.accent}18`,
                      color: outroTone.accent,
                    }}
                  >
                    <Icon size={22} aria-hidden="true" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-[11px] uppercase tracking-[0.24em]" style={{ color: 'rgba(223, 233, 174, 0.5)' }}>
                      Retroalimentacion del nivel
                    </div>
                    <h2 className="text-lg sm:text-2xl font-bold" style={{ color: '#ecfccb' }}>
                      {outroTone.headline}
                    </h2>
                    <p className="max-w-xl text-xs sm:text-base leading-relaxed" style={{ color: 'rgba(220, 252, 231, 0.82)' }}>
                      {outroTone.insight}
                    </p>
                    {levelSummary && (
                      <div className="mt-2 flex flex-wrap gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.18em]">
                        <span className="inline-flex items-center gap-2 border px-3 py-2" style={{ borderColor: `${outroTone.accent}33`, color: '#fef08a', backgroundColor: 'rgba(250, 204, 21, 0.08)' }}>
                          <Trophy size={13} aria-hidden="true" />
                          +{levelSummary.earnedScore} puntos
                        </span>
                        <span className="inline-flex items-center gap-2 border px-3 py-2" style={{ borderColor: `${outroTone.accent}33`, color: '#d9f99d', backgroundColor: 'rgba(134, 239, 172, 0.08)' }}>
                          <Star size={13} aria-hidden="true" />
                          Racha {levelSummary.currentStreak}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className="inline-flex items-center gap-2 self-start border px-3 py-2 text-[11px] uppercase tracking-[0.18em]"
                  style={{
                    borderColor: `${outroTone.accent}44`,
                    color: outroTone.accent,
                    backgroundColor: `${outroTone.accent}12`,
                  }}
                >
                  <CheckCircle2 size={14} aria-hidden="true" />
                  <span>{levelConfig.title}</span>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 grid gap-3 sm:gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div
                  className="rounded-sm border p-3 sm:p-4"
                  style={{
                    borderColor: 'rgba(134, 239, 172, 0.14)',
                    backgroundColor: 'rgba(74, 222, 128, 0.04)',
                  }}
                >
                  <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: 'rgba(223, 233, 174, 0.45)' }}>
                    Lo que restauraste
                  </div>
                  <ul className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2 text-xs sm:text-sm leading-relaxed" style={{ color: '#d9f99d' }}>
                    <li>- Completaste {levelConfig.interactiveObjects.length} desafios del sector.</li>
                    <li>- Reforzaste una forma clave de transformacion energetica.</li>
                    <li>- Dejaste el laboratorio listo para seguir avanzando.</li>
                    {levelSummary && <li>- Sumaste {levelSummary.perfectCount} actividades perfectas en este nivel.</li>}
                  </ul>
                </div>

                <div
                  className="rounded-sm border p-3 sm:p-4"
                  style={{
                    borderColor: `${outroTone.accent}44`,
                    backgroundColor: `${outroTone.accent}12`,
                  }}
                >
                  <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: 'rgba(223, 233, 174, 0.45)' }}>
                    Siguiente destino
                  </div>
                  <div className="mt-3 flex items-center gap-3" style={{ color: '#ecfccb' }}>
                    <ArrowRight size={18} aria-hidden="true" />
                    <span className="text-xs sm:text-base font-bold">
                      {nextLevelConfig ? nextLevelConfig.title : 'Cierre de expedicion'}
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] sm:text-sm leading-relaxed" style={{ color: 'rgba(220, 252, 231, 0.72)' }}>
                    {nextLevelConfig
                      ? `Transicionando al ${nextLevelConfig.id.replace('-', ' ')} para continuar la restauracion.`
                      : 'La expedicion concluye. Es momento de volver al laboratorio central.'}
                  </p>
                </div>
              </div>

              {levelSummary && (
                <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3">
                  <div className="rounded-sm border p-3" style={{ borderColor: 'rgba(74, 222, 128, 0.14)', backgroundColor: 'rgba(74, 222, 128, 0.04)' }}>
                    <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em]" style={{ color: 'rgba(223, 233, 174, 0.45)' }}>
                      <Trophy size={13} aria-hidden="true" />
                      Puntuacion
                    </div>
                    <div className="text-lg sm:text-xl font-bold" style={{ color: '#fef08a' }}>
                      {levelSummary.score.toLocaleString()}
                    </div>
                    <div className="text-[11px]" style={{ color: 'rgba(220, 252, 231, 0.62)' }}>
                      Total acumulado
                    </div>
                  </div>

                  <div className="rounded-sm border p-3" style={{ borderColor: 'rgba(74, 222, 128, 0.14)', backgroundColor: 'rgba(74, 222, 128, 0.04)' }}>
                    <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em]" style={{ color: 'rgba(223, 233, 174, 0.45)' }}>
                      <Star size={13} aria-hidden="true" />
                      Cadena perfecta
                    </div>
                    <div className="text-lg sm:text-xl font-bold" style={{ color: '#d9f99d' }}>
                      {levelSummary.perfectCount}/{levelSummary.activityCount}
                    </div>
                    <div className="text-[11px]" style={{ color: 'rgba(220, 252, 231, 0.62)' }}>
                      Actividades sin errores
                    </div>
                  </div>

                  <div className="rounded-sm border p-3 col-span-2 sm:col-span-1" style={{ borderColor: 'rgba(74, 222, 128, 0.14)', backgroundColor: 'rgba(74, 222, 128, 0.04)' }}>
                    <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em]" style={{ color: 'rgba(223, 233, 174, 0.45)' }}>
                      <TimerReset size={13} aria-hidden="true" />
                      Bonus
                    </div>
                    <div className="text-lg sm:text-xl font-bold" style={{ color: '#86efac' }}>
                      +{(levelSummary.levelBonus + levelSummary.perfectChainBonus).toLocaleString()}
                    </div>
                    <div className="text-[11px]" style={{ color: 'rgba(220, 252, 231, 0.62)' }}>
                      Sector + cadena
                    </div>
                  </div>
                </div>
              )}

              {syncError && (
                <div className="mt-4 rounded-sm border px-4 py-3 text-xs leading-relaxed" style={{ borderColor: 'rgba(251, 146, 60, 0.3)', backgroundColor: 'rgba(154, 52, 18, 0.12)', color: '#fdba74' }}>
                  El progreso se guardó localmente, pero Firebase no respondió: {syncError}
                </div>
              )}

              <div className="mt-5 sm:mt-6 space-y-3">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em]" style={{ color: 'rgba(223, 233, 174, 0.42)' }}>
                  <span>{isLeaving ? 'Abriendo siguiente escena...' : 'Preparando transicion natural...'}</span>
                  <span>{Math.ceil(AUTO_ADVANCE_MS / 1000)}s auto</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: 'rgba(134, 239, 172, 0.08)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: 'linear' }}
                    style={{ background: `linear-gradient(90deg, ${outroTone.accent}66, ${outroTone.accent})` }}
                  />
                </div>
              </div>

              <div className="mt-5 sm:mt-6 flex flex-wrap gap-3">
                <motion.button
                  onClick={completeAndNavigate}
                  disabled={isLeaving}
                  className="w-full sm:w-auto px-5 py-2 text-[11px] sm:text-xs tracking-[0.22em] uppercase border"
                  style={{
                    color: outroTone.accent,
                    borderColor: `${outroTone.accent}66`,
                    backgroundColor: `${outroTone.accent}14`,
                  }}
                  whileHover={{ scale: isLeaving ? 1 : 1.02 }}
                  whileTap={{ scale: isLeaving ? 1 : 0.98 }}
                >
                  {nextLevelConfig ? 'Continuar al siguiente nivel' : 'Volver al inicio'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(isLeaving || isBooting) && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{ background: 'linear-gradient(180deg, rgba(4,8,6,0.22), rgba(4,8,6,0.88) 60%, rgba(0,0,0,1))' }}
          >
            <motion.div
              className="flex flex-col items-center gap-4 px-5 py-4 border"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                borderColor: 'rgba(134, 239, 172, 0.25)',
                backgroundColor: 'rgba(5, 8, 5, 0.92)',
                boxShadow: '0 18px 40px rgba(0, 0, 0, 0.45)',
                fontFamily: '"Courier New", monospace',
              }}
            >
              <motion.div
                className="h-10 w-10 rounded-full border"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                style={{
                  borderColor: 'rgba(134, 239, 172, 0.55)',
                  borderTopColor: 'rgba(134, 239, 172, 0.12)',
                }}
              />
              <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: '#d9f99d' }}>
                {isLeaving ? 'Cargando siguiente nivel...' : 'Preparando laboratorio...'}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
