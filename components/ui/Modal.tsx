'use client'

import { type ReactNode, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  ariaLabel?: string
}

export function Modal({ isOpen, onClose, title, children, ariaLabel }: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/85"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel ?? title}
            className="relative w-[75vw] h-[80vh] max-w-5xl max-h-[900px] overflow-hidden border-2 border-green-700/40 bg-gradient-to-b from-green-950 to-black shadow-2xl shadow-green-900/25"
            style={{ imageRendering: 'pixelated' }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <div
              className="flex items-center justify-between px-5 py-3 bg-green-950/90 border-b-2 border-green-700/40"
              style={{ imageRendering: 'pixelated' }}
            >
              <h2
                className="text-sm font-bold tracking-[0.25em] uppercase text-green-400"
                style={{ fontFamily: '"Courier New", monospace', imageRendering: 'pixelated' }}
              >
                {title}
              </h2>
              <button
                onClick={onClose}
                className="px-2 py-1 text-green-600 transition-colors hover:bg-green-900/60 hover:text-green-400 border-2 border-transparent hover:border-green-700/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 text-xs tracking-wider uppercase"
                aria-label="Close modal"
                style={{ fontFamily: '"Courier New", monospace', imageRendering: 'pixelated' }}
              >
                <X size={16} />
              </button>
            </div>

            <div
              className="h-[calc(100%-53px)] overflow-y-auto p-5"
              style={{ fontFamily: '"Courier New", monospace', imageRendering: 'pixelated' }}
            >
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
