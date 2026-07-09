'use client'

import type { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'

interface GameIconButtonProps {
  icon: LucideIcon
  label: string
  onClick: () => void
  tone?: 'default' | 'warning'
  size?: 'sm' | 'lg'
}

export function GameIconButton({
  icon: Icon,
  label,
  onClick,
  tone = 'default',
  size = 'sm',
}: GameIconButtonProps) {
  const isWarning = tone === 'warning'
  const isLarge = size === 'lg'

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 border uppercase tracking-[0.18em] ${
        isLarge ? 'px-5 py-3 text-xs' : 'px-3 py-2 text-[10px]'
      }`}
      style={{
        borderColor: isWarning
          ? isLarge
            ? 'rgba(248, 113, 113, 0.7)'
            : 'rgba(248, 113, 113, 0.34)'
          : 'rgba(183, 209, 103, 0.28)',
        color: isWarning ? (isLarge ? '#ffb0b0' : '#fca5a5') : '#dfe9ae',
        backgroundColor: isWarning
          ? isLarge
            ? 'rgba(180, 30, 30, 0.35)'
            : 'rgba(127, 29, 29, 0.16)'
          : 'rgba(7, 18, 14, 0.62)',
        fontFamily: '"Courier New", monospace',
        textShadow: isLarge ? '0 0 8px rgba(248,113,113,0.5), 1px 1px 0 #050603' : '1px 1px 0 #050603',
        boxShadow: isLarge ? '0 0 12px rgba(248,113,113,0.2)' : undefined,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
      title={label}
    >
      <Icon size={isLarge ? 18 : 14} aria-hidden="true" />
      <span>{label}</span>
    </motion.button>
  )
}
