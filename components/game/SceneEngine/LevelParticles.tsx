'use client'

import { useEffect, useRef } from 'react'

interface AmbientParticle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  life: number
  maxLife: number
  hue: number
  phase: number
}

interface LevelParticleConfig {
  count: number
  hues: [number, number]
  minSize: number
  maxSize: number
  speed: number
  maxOpacity: number
  behavior: 'float' | 'drift' | 'rise'
}

const LEVEL_CONFIGS: Record<string, LevelParticleConfig> = {
  'level-1': {
    count: 30,
    hues: [80, 120],
    minSize: 2,
    maxSize: 2,
    speed: 0.12,
    maxOpacity: 0.7,
    behavior: 'float',
  },
  'level-2': {
    count: 40,
    hues: [20, 45],
    minSize: 2.5,
    maxSize: 6,
    speed: 0.1,
    maxOpacity: 0.7,
    behavior: 'rise',
  },
  'level-3': {
    count: 50,
    hues: [195, 230],
    minSize: 1.5,
    maxSize: 4,
    speed: 0.15,
    maxOpacity: 0.6,
    behavior: 'drift',
  },
  'level-4': {
    count: 40,
    hues: [250, 290],
    minSize: 2.5,
    maxSize: 6,
    speed: 0.09,
    maxOpacity: 0.7,
    behavior: 'float',
  },
  'level-5': {
    count: 45,
    hues: [40, 55],
    minSize: 2,
    maxSize: 5,
    speed: 0.13,
    maxOpacity: 0.75,
    behavior: 'rise',
  },
}

function createParticle(w: number, h: number, config: LevelParticleConfig): AmbientParticle {
  const angle = Math.random() * Math.PI * 2
  const baseSpeed = config.speed * (Math.random() * 0.6 + 0.7)

  return {
    x: Math.random() * w,
    y: Math.random() * h,
    size: Math.random() * (config.maxSize - config.minSize) + config.minSize,
    speedX: Math.cos(angle) * baseSpeed,
    speedY: Math.sin(angle) * baseSpeed,
    opacity: config.maxOpacity * (0.5 + Math.random() * 0.5),
    life: 0,
    maxLife: Math.random() * 600 + 400,
    hue: Math.random() * (config.hues[1] - config.hues[0]) + config.hues[0],
    phase: Math.random() * Math.PI * 2,
  }
}

interface LevelParticlesProps {
  levelId: string
}

export function LevelParticles({ levelId }: LevelParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const config = LEVEL_CONFIGS[levelId] ?? LEVEL_CONFIGS['level-1']

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const el = canvas
    const resize = () => {
      el.width = window.innerWidth
      el.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles: AmbientParticle[] = []
    for (let i = 0; i < config.count; i++) {
      particles.push(createParticle(el.width, el.height, config))
    }

    let time = 0
    let animId: number

    function animate() {
      time++
      const c = ctx!
      const w = el.width
      const h = el.height
      c.clearRect(0, 0, w, h)

      const wind = Math.sin(time * 0.004) * 0.2 + Math.sin(time * 0.008) * 0.1

      for (const p of particles) {
        p.life++
        const progress = p.life / p.maxLife
        const fade = 1 - progress * progress
        const alpha = Math.min(config.maxOpacity, p.opacity * fade)

        if (alpha < 0.005) {
          if (p.life >= p.maxLife || p.x < -50 || p.x > w + 50 || p.y < -50 || p.y > h + 50) {
            Object.assign(p, createParticle(w, h, config))
          }
          continue
        }

        switch (config.behavior) {
          case 'float':
            p.x += p.speedX + wind * 0.3 + Math.sin(time * 0.01 + p.phase) * 0.15
            p.y += p.speedY + Math.cos(time * 0.008 + p.phase) * 0.1
            break
          case 'drift':
            p.x += p.speedX + wind * 0.5
            p.y += Math.sin(time * 0.006 + p.phase) * 0.12
            break
          case 'rise':
            p.x += Math.sin(time * 0.005 + p.phase) * 0.2 + wind * 0.3
            p.y += p.speedY - 0.05
            break
        }

        const size = p.size * (0.8 + Math.sin(time * 0.02 + p.phase) * 0.2)

        c.beginPath()
        c.arc(p.x, p.y, size * 5, 0, Math.PI * 2)
        c.fillStyle = `hsla(${p.hue}, 80%, 75%, ${alpha * 0.2})`
        c.fill()

        c.beginPath()
        c.arc(p.x, p.y, size, 0, Math.PI * 2)
        c.fillStyle = `hsla(${p.hue}, 85%, 85%, ${alpha})`
        c.fill()
      }

      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [config])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  )
}
