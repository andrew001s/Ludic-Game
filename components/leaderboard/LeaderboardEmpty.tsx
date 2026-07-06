'use client'

import { memo } from 'react'

function LeaderboardEmptyComponent() {
  return (
    <div
      className="flex flex-col items-center justify-center h-full py-16 gap-5 border-2 border-green-800/20 bg-green-950/20"
      style={{ fontFamily: '"Courier New", monospace', imageRendering: 'pixelated' }}
    >
      <div
        className="w-20 h-20 opacity-25"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(74, 222, 128, 0.08) 3px, rgba(74, 222, 128, 0.08) 6px), repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(74, 222, 128, 0.08) 3px, rgba(74, 222, 128, 0.08) 6px)',
          imageRendering: 'pixelated',
          border: '2px solid rgba(74, 222, 128, 0.1)',
        }}
        aria-hidden="true"
      >
        <div className="flex items-center justify-center w-full h-full">
          <span className="text-3xl text-green-700/40">?</span>
        </div>
      </div>
      <p className="text-green-600 text-xs uppercase tracking-widest">No hay puntuaciones registradas.</p>
      <p className="text-green-800/40 text-[10px] uppercase tracking-widest">S&eacute; el primero en aparecer.</p>
    </div>
  )
}

export const LeaderboardEmpty = memo(LeaderboardEmptyComponent)
