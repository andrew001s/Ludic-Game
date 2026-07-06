'use client'

import { type ReactNode, useMemo } from 'react'
import { motion } from 'framer-motion'

interface MenuButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  disabled?: boolean
  onClick?: () => void
  className?: string
}

export function MenuButton({
  children,
  variant = 'primary',
  disabled,
  onClick,
  className = '',
}: MenuButtonProps) {
  const isDisabled = disabled

  const baseClasses =
    'relative px-8 py-3 w-[300px] text-base font-bold tracking-widest uppercase transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black/90'

  const variantClasses = useMemo(() => {
    if (isDisabled) {
      return (
        'text-green-800/35 cursor-not-allowed select-none ' +
        'border-2 border-green-900/25 bg-green-950/20 ' +
        'shadow-[inset_0_0_0_1px_rgba(34,197,94,0.05)]'
      )
    }
    if (variant === 'secondary') {
      return (
        'text-green-400/70 cursor-pointer ' +
        'border-2 border-green-700/30 bg-green-950/40 ' +
        'shadow-[inset_0_0_0_1px_rgba(34,197,94,0.08)] ' +
        'hover:bg-green-900/50 hover:border-green-500/50 hover:text-green-300 ' +
        'active:bg-green-950/60'
      )
    }
    return (
      'text-green-300 cursor-pointer ' +
      'border-2 border-green-600/50 bg-green-950/50 ' +
      'shadow-[inset_0_0_0_1px_rgba(74,222,128,0.12),0_0_12px_rgba(34,197,94,0.15)] ' +
      'hover:bg-green-800/50 hover:border-green-400 hover:text-green-200 ' +
      'hover:shadow-[inset_0_0_0_1px_rgba(74,222,128,0.2),0_0_20px_rgba(34,197,94,0.3)] ' +
      'active:bg-green-950/70'
    )
  }, [isDisabled, variant])

  if (isDisabled) {
    return (
      <button
        className={`${baseClasses} ${variantClasses} ${className}`}
        disabled
        aria-disabled="true"
        tabIndex={-1}
        style={{ fontFamily: '"Courier New", monospace', imageRendering: 'pixelated' }}
      >
        {children}
      </button>
    )
  }

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses} ${className}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      onClick={onClick}
      style={{ fontFamily: '"Courier New", monospace', imageRendering: 'pixelated' }}
    >
      {children}
    </motion.button>
  )
}
