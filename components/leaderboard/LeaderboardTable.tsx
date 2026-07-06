'use client'

import { memo } from 'react'
import type { LeaderboardPlayer } from '@/types/leaderboard'
import { LeaderboardRow } from '@/components/leaderboard/LeaderboardRow'

interface LeaderboardTableProps {
  players: LeaderboardPlayer[]
}

function LeaderboardTableComponent({ players }: LeaderboardTableProps) {
  return (
    <div className="overflow-x-auto border-2 border-green-800/30 bg-green-950/40" style={{ imageRendering: 'pixelated' }}>
      <table
        className="w-full border-collapse"
        role="table"
        aria-label="Leaderboard scores"
        style={{ fontFamily: '"Courier New", monospace', imageRendering: 'pixelated' }}
      >
        <thead>
          <tr className="bg-green-950/80">
            <th className="py-3 px-4 text-green-400 font-bold tracking-wider uppercase text-xs border-b-2 border-green-700/50 border-r-2 border-green-800/20 w-14">
              #
            </th>
            <th className="py-3 px-4 text-green-400 font-bold tracking-wider uppercase text-xs border-b-2 border-green-700/50 border-r-2 border-green-800/20">
              Jugador
            </th>
            <th className="py-3 px-4 text-green-400 font-bold tracking-wider uppercase text-xs border-b-2 border-green-700/50 border-r-2 border-green-800/20 w-32 text-right">
              Puntos
            </th>
            <th className="py-3 px-4 text-green-400 font-bold tracking-wider uppercase text-xs border-b-2 border-green-700/50 w-20 text-right">
              Nivel
            </th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <LeaderboardRow
              key={player.id}
              player={player}
              rank={index + 1}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const LeaderboardTable = memo(LeaderboardTableComponent)
