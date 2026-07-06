'use client'

import { motion } from 'framer-motion'
import type { InteractiveObjectConfig } from '@/types/level'

interface InteractiveObjectProps {
  config: InteractiveObjectConfig
  unlocked: boolean
  completed: boolean
  lockedBy: string | null
  onClick: () => void
}

export function InteractiveObject({ config, unlocked, completed, lockedBy, onClick }: InteractiveObjectProps) {
  if (completed) return null

  return (
    <motion.button
      onClick={unlocked ? onClick : undefined}
      disabled={!unlocked}
      className="absolute cursor-pointer border-2 transition-all duration-300"
      style={{
        left: `${config.area.x}%`,
        top: `${config.area.y}%`,
        width: `${config.area.width}%`,
        height: `${config.area.height}%`,
        borderColor: unlocked
          ? 'rgba(74, 222, 128, 0.3)'
          : 'rgba(74, 222, 128, 0.06)',
        backgroundColor: unlocked
          ? 'rgba(74, 222, 128, 0.04)'
          : 'rgba(0, 0, 0, 0.3)',
        boxShadow: unlocked
          ? '0 0 15px rgba(74, 222, 128, 0.08), inset 0 0 15px rgba(74, 222, 128, 0.03)'
          : 'none',
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: unlocked ? 1 : 0.3,
        scale: unlocked ? 1 : 0.95,
      }}
      whileHover={
        unlocked
          ? {
              borderColor: 'rgba(74, 222, 128, 0.6)',
              boxShadow: '0 0 25px rgba(74, 222, 128, 0.15), inset 0 0 20px rgba(74, 222, 128, 0.05)',
            }
          : {}
      }
      whileTap={unlocked ? { scale: 0.97 } : {}}
    >
      {/* Glow corner decorations */}
      <div
        className="absolute -top-px -left-px w-3 h-3 border-t-2 border-l-2"
        style={{
          borderColor: unlocked ? 'rgba(74, 222, 128, 0.4)' : 'rgba(74, 222, 128, 0.1)',
        }}
      />
      <div
        className="absolute -top-px -right-px w-3 h-3 border-t-2 border-r-2"
        style={{
          borderColor: unlocked ? 'rgba(74, 222, 128, 0.4)' : 'rgba(74, 222, 128, 0.1)',
        }}
      />
      <div
        className="absolute -bottom-px -left-px w-3 h-3 border-b-2 border-l-2"
        style={{
          borderColor: unlocked ? 'rgba(74, 222, 128, 0.4)' : 'rgba(74, 222, 128, 0.1)',
        }}
      />
      <div
        className="absolute -bottom-px -right-px w-3 h-3 border-b-2 border-r-2"
        style={{
          borderColor: unlocked ? 'rgba(74, 222, 128, 0.4)' : 'rgba(74, 222, 128, 0.1)',
        }}
      />

      {/* Label */}
      <div className="absolute -top-6 left-0 right-0 text-center">
        <span
          className="text-[10px] tracking-widest uppercase"
          style={{
            color: unlocked ? 'rgba(74, 222, 128, 0.5)' : 'rgba(74, 222, 128, 0.15)',
          }}
        >
          {config.title}
        </span>
      </div>

      {/* Lock indicator */}
      {!unlocked && lockedBy && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-[10px] tracking-wider text-center px-2"
            style={{ color: 'rgba(74, 222, 128, 0.2)' }}
          >
            Completa &quot;{lockedBy}&quot; primero
          </span>
        </div>
      )}
    </motion.button>
  )
}
