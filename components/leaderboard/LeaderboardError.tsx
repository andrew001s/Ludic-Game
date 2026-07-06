'use client'

import { memo } from 'react'
import { RefreshCw } from 'lucide-react'

interface LeaderboardErrorProps {
  message: string
  onRetry: () => void
}

function LeaderboardErrorComponent({ message, onRetry }: LeaderboardErrorProps) {
  return (
    <div
      className="flex flex-col items-center justify-center h-full py-16 gap-5 border-2 border-red-900/30 bg-red-950/10"
      style={{ fontFamily: '"Courier New", monospace', imageRendering: 'pixelated' }}
    >
      <div className="border-2 border-red-900/40 bg-red-950/30 px-4 py-2">
        <span className="text-red-400 text-lg font-bold">!</span>
      </div>
      <p className="text-red-400/80 text-xs uppercase tracking-widest text-center max-w-xs leading-relaxed">
        {message}
      </p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-5 py-2.5 text-xs tracking-wider uppercase text-green-400 border-2 border-green-700/40 bg-green-950/50 hover:bg-green-900/50 hover:border-green-500/60 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
        aria-label="Retry loading leaderboard"
        style={{ fontFamily: '"Courier New", monospace', imageRendering: 'pixelated' }}
      >
        <RefreshCw size={14} />
        Reintentar
      </button>
    </div>
  )
}

export const LeaderboardError = memo(LeaderboardErrorComponent)
