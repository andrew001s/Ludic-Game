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
  compact?: boolean
}

export function Modal({ isOpen, onClose, title, children, ariaLabel, compact = false }: ModalProps) {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          <motion.div
            className="absolute inset-0 bg-[#030302]/94"
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
            className={`relative overflow-hidden border-[3px] border-[#786544] bg-[#0f0d09] shadow-[0_24px_80px_rgba(0,0,0,0.9)] ${
              compact
                ? 'w-auto min-w-[280px] max-w-[420px]'
                : 'w-[92vw] sm:w-[80vw] h-[85vh] sm:h-[80vh] max-w-5xl max-h-[900px]'
            }`}
            style={{
              imageRendering: 'pixelated',
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.02), rgba(255,255,255,0.02)), repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.015) 0 2px, transparent 2px 6px), repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.012) 0 2px, transparent 2px 6px)',
              backgroundColor: '#0f0d09',
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <div
              className="modal-header flex items-center justify-between px-4 py-2 sm:px-5 sm:py-3 bg-[#1d1812] border-b-[3px] border-[#786544]"
              style={{
                imageRendering: 'pixelated',
                backgroundImage:
                  'linear-gradient(90deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 100%), linear-gradient(rgba(255,255,255,0.02), rgba(255,255,255,0.02))',
              }}
            >
              <h2
                className="text-sm font-bold tracking-[0.22em] uppercase text-[#f2e4c1]"
                style={{
                  fontFamily: '"Courier New", monospace',
                  imageRendering: 'pixelated',
                  textShadow: '2px 2px 0 #0b0907',
                }}
              >
                {title}
              </h2>
              <button
                onClick={onClose}
                className="px-2 py-1 text-[#bca87a] transition-colors hover:bg-[#2a2319] hover:text-[#f2e4c1] border-2 border-transparent hover:border-[#8b7d5d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8c08b] text-xs tracking-wider uppercase"
                aria-label="Close modal"
                style={{
                  fontFamily: '"Courier New", monospace',
                  imageRendering: 'pixelated',
                  textShadow: '1px 1px 0 #0b0907',
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div
              className="modal-body h-[calc(100%-53px)] overflow-y-auto p-3 sm:p-5"
              style={{
                fontFamily: '"Courier New", monospace',
                imageRendering: 'pixelated',
                backgroundImage:
                  'radial-gradient(circle at top left, rgba(242, 228, 193, 0.03), transparent 35%), radial-gradient(circle at bottom right, rgba(139, 125, 93, 0.08), transparent 35%)',
              }}
            >
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
