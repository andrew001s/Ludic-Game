'use client'

import { memo, useCallback } from 'react'
import { Search } from 'lucide-react'

interface LeaderboardSearchProps {
  value: string
  onChange: (value: string) => void
}

function LeaderboardSearchComponent({ value, onChange }: LeaderboardSearchProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value)
    },
    [onChange],
  )

  return (
    <div className="relative" style={{ imageRendering: 'pixelated' }}>
      <Search
        size={14}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-600 pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Buscar jugador..."
        className="w-full bg-green-950/60 border-2 border-green-800/30 py-2.5 pl-10 pr-3.5 text-green-300 placeholder-green-700/50 text-xs uppercase tracking-wider transition-colors duration-150 focus:outline-none focus:border-green-500/50 hover:border-green-700/40"
        aria-label="Search players by name"
        style={{ fontFamily: '"Courier New", monospace', imageRendering: 'pixelated' }}
      />
    </div>
  )
}

export const LeaderboardSearch = memo(LeaderboardSearchComponent)
