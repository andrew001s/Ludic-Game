'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Play, Save, Trophy } from 'lucide-react'
import { MenuButton } from '@/components/ui/MenuButton'
import { Modal } from '@/components/ui/Modal'
import { GameLogo } from '@/components/game/GameLogo'
import { Footer } from '@/components/game/Footer'
import { useGameSave } from '@/hooks/useGameSave'
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable'
import { LeaderboardSearch } from '@/components/leaderboard/LeaderboardSearch'
import { LeaderboardPagination } from '@/components/leaderboard/LeaderboardPagination'
import { LeaderboardSkeleton } from '@/components/leaderboard/LeaderboardSkeleton'
import { LeaderboardEmpty } from '@/components/leaderboard/LeaderboardEmpty'
import { LeaderboardError } from '@/components/leaderboard/LeaderboardError'
import { useLeaderboard } from '@/hooks/useLeaderboard'

export function MainMenu() {
  const router = useRouter()
  const { hasSave, save } = useGameSave()
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false)

  const leaderboard = useLeaderboard()

  const handleNewGame = useCallback(() => {
    router.push('/game')
  }, [router])

  const handleContinue = useCallback(() => {
    if (!hasSave || !save) return
    const params = new URLSearchParams({
      level: String(save.level),
      progress: String(save.progress),
      character: save.character,
    })
    router.push(`/game?${params.toString()}`)
  }, [hasSave, save, router])

  const handleOpenLeaderboard = useCallback(() => {
    setIsLeaderboardOpen(true)
  }, [])

  const handleCloseLeaderboard = useCallback(() => {
    setIsLeaderboardOpen(false)
  }, [])

  const menuItems = [
    {
      key: 'new-game',
      label: 'Nuevo Juego',
      icon: Play,
      onClick: handleNewGame,
      disabled: false,
      variant: 'primary' as const,
    },
    {
      key: 'continue',
      label: 'Continuar',
      icon: Save,
      onClick: handleContinue,
      disabled: !hasSave,
      variant: 'secondary' as const,
    },
    {
      key: 'leaderboard',
      label: 'Tabla de Puntuaci\u00F3n',
      icon: Trophy,
      onClick: handleOpenLeaderboard,
      disabled: false,
      variant: 'secondary' as const,
    },
  ]

  return (
    <>
      <div className="fixed inset-0 flex flex-col justify-center px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24">
        <div className="flex flex-col items-start gap-12 max-w-lg">
          <GameLogo />

          <motion.nav
            className="flex flex-col items-start gap-3"
            aria-label="Main menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {menuItems.map((item, index) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.12, ease: 'easeOut' }}
              >
                <MenuButton
                  variant={item.variant}
                  disabled={item.disabled}
                  onClick={item.onClick}
                >
                  <span className="flex items-center gap-3">
                    <item.icon
                      size={18}
                      className={item.disabled ? 'opacity-30' : ''}
                      aria-hidden="true"
                    />
                    {item.label}
                  </span>
                </MenuButton>
              </motion.div>
            ))}
          </motion.nav>
        </div>

        <Footer />
      </div>

      <Modal
        isOpen={isLeaderboardOpen}
        onClose={handleCloseLeaderboard}
        title="TABLA DE PUNTUACIÓN"
        ariaLabel="Leaderboard modal"
      >
        <div className="flex flex-col gap-6 h-full">
          <LeaderboardSearch value={leaderboard.search} onChange={leaderboard.setSearch} />

          <div className="flex-1">
            {leaderboard.loading ? (
              <LeaderboardSkeleton />
            ) : leaderboard.error ? (
              <LeaderboardError message={leaderboard.error} onRetry={leaderboard.retry} />
            ) : leaderboard.players.length === 0 ? (
              <LeaderboardEmpty />
            ) : (
              <LeaderboardTable players={leaderboard.players} />
            )}
          </div>

          {!leaderboard.loading && !leaderboard.error && leaderboard.players.length > 0 && (
            <LeaderboardPagination
              pagination={leaderboard.pagination}
              onNext={leaderboard.nextPage}
              onPrevious={leaderboard.previousPage}
            />
          )}
        </div>
      </Modal>
    </>
  )
}
