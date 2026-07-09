'use client'

import type { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'

interface GameIconButtonProps {
  icon: LucideIcon
  label: string
  onClick: () => void
  tone?: 'default' | 'warning'
}

export function GameIconButton({
  icon: Icon,
  label,
  onClick,
  tone = 'default',
}: GameIconButtonProps) {
  const isWarning = tone === 'warning'

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 border px-3 py-2 text-[10px] uppercase tracking-[0.18em]"
      style={{
        borderColor: isWarning ? 'rgba(248, 113, 113, 0.34)' : 'rgba(183, 209, 103, 0.28)',
        color: isWarning ? '#fca5a5' : '#dfe9ae',
        backgroundColor: isWarning ? 'rgba(127, 29, 29, 0.16)' : 'rgba(7, 18, 14, 0.62)',
        fontFamily: '"Courier New", monospace',
        textShadow: '1px 1px 0 #050603',
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-label={label}
      title={label}
    >
      <Icon size={14} aria-hidden="true" />
      <span>{label}</span>
    </motion.button>
  )
}
