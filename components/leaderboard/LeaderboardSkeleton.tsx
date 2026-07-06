'use client'

import { memo } from 'react'

function SkeletonCell({ className = '' }: { className?: string }) {
  return (
    <div className={`h-5 bg-green-900/25 animate-pulse ${className}`} style={{ imageRendering: 'pixelated' }} />
  )
}

function LeaderboardSkeletonComponent() {
  return (
    <div
      className="border-2 border-green-800/30 bg-green-950/40"
      role="status"
      aria-label="Loading leaderboard"
      style={{ fontFamily: '"Courier New", monospace', imageRendering: 'pixelated' }}
    >
      <div className="flex items-center gap-0 bg-green-950/80 border-b-2 border-green-700/50">
        <SkeletonCell className="w-14 m-3" />
        <SkeletonCell className="flex-1 m-3" />
        <SkeletonCell className="w-32 m-3" />
        <SkeletonCell className="w-20 m-3" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={`flex items-center gap-0 ${i % 2 === 0 ? 'bg-green-950/30' : 'bg-green-950/10'} border-b border-green-900/20`}>
          <SkeletonCell className="w-14 m-3" />
          <SkeletonCell className="flex-1 m-3 max-w-[180px]" />
          <SkeletonCell className="w-32 m-3" />
          <SkeletonCell className="w-20 m-3" />
        </div>
      ))}
      <span className="sr-only">Loading leaderboard data...</span>
    </div>
  )
}

export const LeaderboardSkeleton = memo(LeaderboardSkeletonComponent)
