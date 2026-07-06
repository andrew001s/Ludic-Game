'use client'

import { memo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { LeaderboardPagination as PaginationType } from '@/types/leaderboard'

interface LeaderboardPaginationProps {
  pagination: PaginationType
  onNext: () => void
  onPrevious: () => void
}

function LeaderboardPaginationComponent({ pagination, onNext, onPrevious }: LeaderboardPaginationProps) {
  return (
    <div className="flex items-center justify-center gap-3 pt-3 border-t-2 border-green-800/20" style={{ imageRendering: 'pixelated' }}>
      <button
        onClick={onPrevious}
        disabled={!pagination.hasPrevious}
        className="flex items-center gap-1.5 px-4 py-2 text-xs tracking-wider uppercase transition-all duration-150 disabled:opacity-25 disabled:cursor-not-allowed enabled:text-green-400 enabled:hover:bg-green-900/50 enabled:hover:border-green-500/50 border-2 border-green-800/30 bg-green-950/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
        aria-label="Previous page"
        style={{ fontFamily: '"Courier New", monospace', imageRendering: 'pixelated' }}
      >
        <ChevronLeft size={14} />
        Anterior
      </button>

      <span
        className="text-xs tracking-wider text-green-600 min-w-[72px] text-center"
        style={{ fontFamily: '"Courier New", monospace', imageRendering: 'pixelated' }}
      >
        {pagination.page}/{pagination.totalPages}
      </span>

      <button
        onClick={onNext}
        disabled={!pagination.hasNext}
        className="flex items-center gap-1.5 px-4 py-2 text-xs tracking-wider uppercase transition-all duration-150 disabled:opacity-25 disabled:cursor-not-allowed enabled:text-green-400 enabled:hover:bg-green-900/50 enabled:hover:border-green-500/50 border-2 border-green-800/30 bg-green-950/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
        aria-label="Next page"
        style={{ fontFamily: '"Courier New", monospace', imageRendering: 'pixelated' }}
      >
        Siguiente
        <ChevronRight size={14} />
      </button>
    </div>
  )
}

export const LeaderboardPagination = memo(LeaderboardPaginationComponent)
