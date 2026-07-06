'use client'

import { useMemo } from 'react'

interface SceneElement {
  type: 'rect' | 'circle' | 'line' | 'grid'
  x: number
  y: number
  width?: number
  height?: number
  size?: number
  color: string
  opacity: number
  glow?: string
  pulse?: boolean
  rotate?: number
}

interface SceneConfig {
  baseGradient: string
  accentColor: string
  elements: SceneElement[]
}

function generateScene(levelId: string): SceneConfig {
  switch (levelId) {
    case 'level-1':
      return {
        baseGradient: 'linear-gradient(160deg, #050805 0%, #0a1a0a 30%, #071207 60%, #0d1f0d 100%)',
        accentColor: 'rgba(74, 222, 128, 0.08)',
        elements: [
          { type: 'rect', x: 5, y: 15, width: 20, height: 35, color: 'rgba(74, 222, 128, 0.04)', opacity: 0.5, glow: '0 0 30px rgba(74, 222, 128, 0.02)' },
          { type: 'rect', x: 45, y: 10, width: 15, height: 28, color: 'rgba(74, 222, 128, 0.03)', opacity: 0.4 },
          { type: 'rect', x: 30, y: 55, width: 25, height: 12, color: 'rgba(74, 222, 128, 0.04)', opacity: 0.3 },
          { type: 'rect', x: 72, y: 20, width: 18, height: 40, color: 'rgba(74, 222, 128, 0.03)', opacity: 0.4 },
          { type: 'circle', x: 15, y: 30, size: 8, color: 'rgba(74, 222, 128, 0.06)', opacity: 0.6, pulse: true },
          { type: 'circle', x: 55, y: 25, size: 6, color: 'rgba(74, 222, 128, 0.05)', opacity: 0.5, pulse: true },
          { type: 'line', x: 0, y: 50, width: 100, height: 1, color: 'rgba(74, 222, 128, 0.04)', opacity: 0.3 },
          { type: 'line', x: 0, y: 70, width: 100, height: 1, color: 'rgba(74, 222, 128, 0.03)', opacity: 0.2 },
          { type: 'grid', x: 0, y: 0, width: 100, height: 100, color: 'rgba(74, 222, 128, 0.015)', opacity: 0.3 },
        ],
      }
    case 'level-2':
      return {
        baseGradient: 'linear-gradient(160deg, #050503 0%, #1a0f05 30%, #0f0a04 60%, #1a1208 100%)',
        accentColor: 'rgba(251, 146, 60, 0.08)',
        elements: [
          { type: 'circle', x: 50, y: 40, size: 25, color: 'rgba(251, 146, 60, 0.06)', opacity: 0.7, pulse: true, glow: '0 0 60px rgba(251, 146, 60, 0.03)' },
          { type: 'circle', x: 50, y: 40, size: 12, color: 'rgba(251, 146, 60, 0.08)', opacity: 0.6, pulse: true },
          { type: 'circle', x: 50, y: 40, size: 5, color: 'rgba(251, 146, 60, 0.12)', opacity: 0.5, pulse: true },
          { type: 'circle', x: 20, y: 30, size: 10, color: 'rgba(251, 146, 60, 0.04)', opacity: 0.4, pulse: true },
          { type: 'circle', x: 78, y: 35, size: 8, color: 'rgba(251, 146, 60, 0.04)', opacity: 0.4, pulse: true },
          { type: 'circle', x: 35, y: 65, size: 14, color: 'rgba(251, 146, 60, 0.03)', opacity: 0.3, pulse: true },
          { type: 'line', x: 25, y: 40, width: 50, height: 2, color: 'rgba(251, 146, 60, 0.04)', opacity: 0.3, rotate: 0 },
          { type: 'line', x: 25, y: 42, width: 50, height: 1, color: 'rgba(251, 146, 60, 0.02)', opacity: 0.2, rotate: 0 },
          { type: 'grid', x: 0, y: 0, width: 100, height: 100, color: 'rgba(251, 146, 60, 0.012)', opacity: 0.3 },
        ],
      }
    case 'level-3':
      return {
        baseGradient: 'linear-gradient(160deg, #030508 0%, #06101a 30%, #040a12 60%, #081420 100%)',
        accentColor: 'rgba(96, 165, 250, 0.08)',
        elements: [
          { type: 'rect', x: 10, y: 20, width: 30, height: 2, color: 'rgba(96, 165, 250, 0.06)', opacity: 0.5 },
          { type: 'rect', x: 10, y: 22, width: 30, height: 1, color: 'rgba(96, 165, 250, 0.03)', opacity: 0.3 },
          { type: 'rect', x: 60, y: 40, width: 25, height: 2, color: 'rgba(96, 165, 250, 0.06)', opacity: 0.5 },
          { type: 'rect', x: 60, y: 42, width: 25, height: 1, color: 'rgba(96, 165, 250, 0.03)', opacity: 0.3 },
          { type: 'rect', x: 35, y: 60, width: 35, height: 2, color: 'rgba(96, 165, 250, 0.05)', opacity: 0.4 },
          { type: 'circle', x: 40, y: 21, size: 4, color: 'rgba(96, 165, 250, 0.1)', opacity: 0.7, pulse: true },
          { type: 'circle', x: 85, y: 41, size: 4, color: 'rgba(96, 165, 250, 0.1)', opacity: 0.7, pulse: true },
          { type: 'circle', x: 50, y: 61, size: 3, color: 'rgba(96, 165, 250, 0.08)', opacity: 0.6, pulse: true },
          { type: 'circle', x: 25, y: 50, size: 2, color: 'rgba(96, 165, 250, 0.06)', opacity: 0.5, pulse: true },
          { type: 'circle', x: 70, y: 30, size: 2, color: 'rgba(96, 165, 250, 0.06)', opacity: 0.5, pulse: true },
          { type: 'grid', x: 0, y: 0, width: 100, height: 100, color: 'rgba(96, 165, 250, 0.012)', opacity: 0.3 },
        ],
      }
    case 'level-4':
      return {
        baseGradient: 'linear-gradient(160deg, #050508 0%, #0f061a 30%, #0a0412 60%, #120820 100%)',
        accentColor: 'rgba(192, 132, 252, 0.08)',
        elements: [
          { type: 'line', x: 50, y: 15, width: 2, height: 50, color: 'rgba(192, 132, 252, 0.05)', opacity: 0.4, rotate: 0 },
          { type: 'circle', x: 50, y: 15, size: 6, color: 'rgba(192, 132, 252, 0.07)', opacity: 0.6, pulse: true },
          { type: 'circle', x: 50, y: 65, size: 8, color: 'rgba(192, 132, 252, 0.05)', opacity: 0.4, pulse: true },
          { type: 'rect', x: 20, y: 30, width: 15, height: 20, color: 'rgba(192, 132, 252, 0.03)', opacity: 0.3 },
          { type: 'rect', x: 65, y: 35, width: 12, height: 25, color: 'rgba(192, 132, 252, 0.03)', opacity: 0.3 },
          { type: 'line', x: 15, y: 55, width: 25, height: 1, color: 'rgba(192, 132, 252, 0.03)', opacity: 0.2 },
          { type: 'line', x: 60, y: 55, width: 25, height: 1, color: 'rgba(192, 132, 252, 0.03)', opacity: 0.2 },
          { type: 'grid', x: 0, y: 0, width: 100, height: 100, color: 'rgba(192, 132, 252, 0.012)', opacity: 0.3 },
        ],
      }
    case 'level-5':
      return {
        baseGradient: 'linear-gradient(160deg, #050500 0%, #1a1a05 30%, #0f0f04 60%, #1a1a08 100%)',
        accentColor: 'rgba(250, 204, 21, 0.08)',
        elements: [
          { type: 'circle', x: 50, y: 45, size: 30, color: 'rgba(250, 204, 21, 0.04)', opacity: 0.5, pulse: true, glow: '0 0 80px rgba(250, 204, 21, 0.02)' },
          { type: 'circle', x: 50, y: 45, size: 18, color: 'rgba(250, 204, 21, 0.06)', opacity: 0.5, pulse: true },
          { type: 'circle', x: 50, y: 45, size: 8, color: 'rgba(250, 204, 21, 0.1)', opacity: 0.6, pulse: true },
          { type: 'circle', x: 50, y: 45, size: 3, color: 'rgba(250, 204, 21, 0.15)', opacity: 0.5, pulse: true },
          { type: 'rect', x: 15, y: 20, width: 70, height: 2, color: 'rgba(250, 204, 21, 0.04)', opacity: 0.3 },
          { type: 'rect', x: 15, y: 68, width: 70, height: 2, color: 'rgba(250, 204, 21, 0.04)', opacity: 0.3 },
          { type: 'line', x: 30, y: 45, width: 40, height: 1, color: 'rgba(250, 204, 21, 0.06)', opacity: 0.4 },
          { type: 'line', x: 30, y: 47, width: 40, height: 1, color: 'rgba(250, 204, 21, 0.03)', opacity: 0.2 },
          { type: 'line', x: 50, y: 20, width: 1, height: 50, color: 'rgba(250, 204, 21, 0.04)', opacity: 0.3 },
          { type: 'grid', x: 0, y: 0, width: 100, height: 100, color: 'rgba(250, 204, 21, 0.012)', opacity: 0.3 },
        ],
      }
    default:
      return {
        baseGradient: 'linear-gradient(160deg, #050805 0%, #0a1a0a 30%, #071207 60%, #0d1f0d 100%)',
        accentColor: 'rgba(74, 222, 128, 0.08)',
        elements: [
          { type: 'grid', x: 0, y: 0, width: 100, height: 100, color: 'rgba(74, 222, 128, 0.015)', opacity: 0.3 },
        ],
      }
  }
}

function SceneElement({ el, index }: { el: SceneElement; index: number }) {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${el.x}%`,
    top: `${el.y}%`,
    opacity: el.opacity,
    pointerEvents: 'none',
  }

  if (el.type === 'rect') {
    Object.assign(style, {
      width: `${el.width}%`,
      height: `${el.height}%`,
      backgroundColor: el.color,
      boxShadow: el.glow ?? 'none',
      transform: el.rotate ? `rotate(${el.rotate}deg)` : undefined,
      animation: el.pulse ? `bg-pulse 3s ease-in-out infinite` : undefined,
      animationDelay: `${index * 0.4}s`,
    })
  }

  if (el.type === 'circle') {
    Object.assign(style, {
      width: `${el.size}%`,
      height: `${el.size}%`,
      borderRadius: '50%',
      backgroundColor: el.color,
      boxShadow: el.glow ?? 'none',
      transform: 'translate(-50%, -50%)',
      animation: el.pulse ? `bg-pulse 4s ease-in-out infinite` : undefined,
      animationDelay: `${index * 0.5}s`,
    })
  }

  if (el.type === 'line') {
    Object.assign(style, {
      width: `${el.width}%`,
      height: `${el.height}px`,
      backgroundColor: el.color,
    })
  }

  if (el.type === 'grid') {
    Object.assign(style, {
      width: '100%',
      height: '100%',
      left: '0',
      top: '0',
      backgroundImage: `
        linear-gradient(90deg, ${el.color} 1px, transparent 1px),
        linear-gradient(0deg, ${el.color} 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px',
    })
  }

  return <div key={index} style={style} />
}

interface LevelBackgroundProps {
  levelId: string
}

export function LevelBackground({ levelId }: LevelBackgroundProps) {
  const scene = useMemo(() => generateScene(levelId), [levelId])

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: scene.baseGradient }}
      />

      {scene.elements.map((el, i) => (
        <SceneElement key={i} el={el} index={i} />
      ))}

      {/* Vignette overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* Top/bottom gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.3) 100%)',
        }}
      />
    </div>
  )
}
