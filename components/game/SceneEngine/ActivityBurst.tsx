'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface BurstParticle {
  id: number
  x: number
  y: number
  size: number
  color: string
}

interface ActivityBurstProps {
  trigger: 'enter' | 'complete' | null
}

function generateBurst(count: number, colors: string[], range: number): BurstParticle[] {
  const particles: BurstParticle[] = []
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const dist = Math.random() * range * 0.5 + range * 0.3
    particles.push({
      id: i,
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      size: Math.random() * 3 + 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    })
  }
  return particles
}

export function ActivityBurst({ trigger }: ActivityBurstProps) {
  const [particles, setParticles] = useState<BurstParticle[]>([])
  const [visible, setVisible] = useState(false)
  const idRef = useRef(0)
  const keyRef = useRef(0)

  useEffect(() => {
    if (!trigger) return

    keyRef.current++

    if (trigger === 'enter') {
      const burst = generateBurst(
        20,
        ['rgba(183, 209, 103, 0.7)', 'rgba(207, 181, 114, 0.6)', 'rgba(129, 153, 74, 0.5)'],
        120,
      )
      setParticles(burst)
    } else {
      const burst = generateBurst(
        30,
        ['rgba(250, 204, 21, 0.8)', 'rgba(253, 224, 71, 0.7)', 'rgba(255, 255, 200, 0.6)'],
        160,
      )
      setParticles(burst)
    }

    setVisible(true)
    const timer = setTimeout(() => {
      setVisible(false)
      setParticles([])
    }, 700)

    return () => clearTimeout(timer)
  }, [trigger])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={keyRef.current}
          className="fixed inset-0 z-40 pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full"
                style={{
                  width: p.size * 3,
                  height: p.size * 3,
                  backgroundColor: p.color,
                  boxShadow: `0 0 ${p.size * 6}px ${p.color}`,
                  left: -p.size * 1.5,
                  top: -p.size * 1.5,
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                animate={{
                  x: p.x,
                  y: p.y,
                  opacity: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.55,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
