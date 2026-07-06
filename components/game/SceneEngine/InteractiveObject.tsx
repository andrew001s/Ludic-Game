'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { InteractiveObjectConfig } from '@/types/level'

export interface InteractiveHoverStyle {
  borderColor?: string
  boxShadow?: string
  scale?: number
}

export const defaultInteractiveHover: InteractiveHoverStyle = {
  borderColor: 'transparent',
  boxShadow: '0 0 25px rgba(74, 222, 128, 0.18)',
  scale: 1,
}

interface InteractiveObjectProps {
  config: InteractiveObjectConfig
  unlocked: boolean
  completed: boolean
  onClick: () => void
  hoverStyle?: Partial<InteractiveHoverStyle>
}

export function InteractiveObject({ config, unlocked, completed, onClick, hoverStyle }: InteractiveObjectProps) {
  const visual = config.visual
  const hasResource = Boolean(visual?.resource)
  const interactive = unlocked && !completed
  const locked = !unlocked && !completed

  const hover = { ...defaultInteractiveHover, ...hoverStyle }

  return (
    <motion.button
      onClick={interactive ? onClick : undefined}
      disabled={!interactive}
      className={`absolute border-0 bg-transparent transition-all duration-300 ${interactive ? 'cursor-pointer' : 'cursor-default'}`}
      style={{
        left: `${config.area.x}%`,
        top: `${config.area.y}%`,
        width: `${config.area.width}%`,
        height: `${config.area.height}%`,
        borderColor: 'transparent',
        backgroundColor: 'transparent',
        boxShadow: 'none',
        overflow: 'visible',
        zIndex: visual?.zIndex ?? 1,
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: completed ? 0.82 : unlocked ? 1 : 0.82,
        scale: 1,
      }}
      whileHover={
        interactive
          ? {
              borderColor: hasResource ? 'transparent' : hover.borderColor,
              boxShadow: hasResource ? 'none' : hover.boxShadow,
              scale: hover.scale,
            }
          : {}
      }
      whileTap={interactive ? { scale: 0.97 } : {}}
    >
      <div className="relative h-full w-full overflow-visible">
        <div
          className={`absolute inset-0 overflow-hidden ${interactive ? visual?.className ?? '' : ''}`}
          style={{
            inset: visual?.inset ?? '0',
            transform: visual?.transform ?? 'none',
            transformOrigin: visual?.transformOrigin ?? 'center center',
          }}
        >
          {hasResource ? (
            <Image
              src={visual?.resource ?? ''}
              alt={config.title}
              aria-hidden="true"
              fill
              unoptimized
              priority
              className="pointer-events-none select-none object-contain"
              style={{
                objectFit: visual?.fit ?? 'contain',
                opacity: visual?.opacity ?? 1,
                filter: completed
                  ? 'saturate(0.8) contrast(1.02) brightness(0.82)'
                  : unlocked
                    ? 'saturate(0.92) contrast(1.05) brightness(0.96)'
                    : 'grayscale(0.45) saturate(0.72) contrast(0.9) brightness(0.72)',
              }}
            />
          ) : (
            <div
              className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background: completed
                  ? 'rgba(183, 209, 103, 0.34)'
                  : unlocked
                    ? 'rgba(74, 222, 128, 0.42)'
                    : 'rgba(223, 233, 174, 0.18)',
                boxShadow: completed
                  ? '0 0 18px rgba(183, 209, 103, 0.22)'
                  : unlocked
                    ? '0 0 18px rgba(74, 222, 128, 0.26)'
                    : '0 0 14px rgba(223, 233, 174, 0.12)',
                filter: locked ? 'saturate(0.75) brightness(0.8)' : 'none',
              }}
            />
          )}

          {locked && hasResource && (
            <div
              className="absolute inset-0 pointer-events-none"
            />
          )}

          <div
            className="absolute inset-0 pointer-events-none"
            
          />
        </div>
      </div>
    </motion.button>
  )
}
