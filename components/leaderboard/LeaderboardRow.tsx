'use client'

import { memo } from 'react'
import type { LeaderboardPlayer } from '@/types/leaderboard'

interface LeaderboardRowProps {
  player: LeaderboardPlayer
  rank: number
}

function LeaderboardRowComponent({ player, rank }: LeaderboardRowProps) {
  const rankColors = ['text-yellow-300', 'text-gray-300', 'text-amber-600']
  const rankColor = rank <= 3 ? rankColors[rank - 1] : 'text-green-600'

  const bgClass = rank % 2 === 0 ? 'bg-green-950/30' : 'bg-green-950/10'

  return (
    <tr
      className={`${bgClass} transition-colors hover:bg-green-900/40`}
      style={{ fontFamily: '"Courier New", monospace', imageRendering: 'pixelated' }}
    >
      <td className="py-2.5 px-4 border-b border-green-900/20 border-r-2 border-green-800/10">
        <span className={`font-bold text-sm ${rankColor}`}>#{rank}</span>
      </td>
      <td className="py-2.5 px-4 border-b border-green-900/20 border-r-2 border-green-800/10">
        <span className="text-green-300 font-medium truncate block max-w-[180px] text-sm">
          {player.playerName}
        </span>
      </td>
      <td className="py-2.5 px-4 border-b border-green-900/20 border-r-2 border-green-800/10 text-right">
        <span className="text-green-400 font-bold tabular-nums text-sm tracking-wider">
          {player.score.toLocaleString()}
        </span>
      </td>
      <td className="py-2.5 px-4 border-b border-green-900/20 text-right">
        <span className="text-green-500/80 text-sm">{player.level}</span>
      </td>
    </tr>
  )
}

export const LeaderboardRow = memo(LeaderboardRowComponent)
