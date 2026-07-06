'use client'

import { useState, useCallback, useRef, useEffect, type KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCreatePlayer } from '@/hooks/useCreatePlayer'
import { useAudio } from '@/hooks/useAudio'
import type { PlayerResult } from '@/types/player'

interface PlayerNameModalProps {
  isOpen: boolean
  onComplete: (result: PlayerResult) => void
  onCancel: () => void
}

function validateName(name: string): string | null {
  const trimmed = name.trim()
  if (!trimmed) return 'El nombre es obligatorio'
  if (trimmed.length < 3) return 'Debe tener al menos 3 caracteres'
  if (trimmed.length > 20) return 'Debe tener menos de 20 caracteres'
  return null
}

export function PlayerNameModal({ isOpen, onComplete, onCancel }: PlayerNameModalProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { create } = useCreatePlayer()
  const { playSFX } = useAudio()
  const inputRef = useRef<HTMLInputElement>(null)
  const [showContent, setShowContent] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const [fadeToBlack, setFadeToBlack] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowContent(true)
      const t1 = setTimeout(() => setShowInput(true), 2200)
      const t2 = setTimeout(() => inputRef.current?.focus(), 2400)
      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
      }
    } else {
      setShowContent(false)
      setShowInput(false)
      setName('')
      setError(null)
      setSubmitting(false)
      setFadeToBlack(false)
    }
  }, [isOpen])

  const handleSubmit = useCallback(async () => {
    const validationError = validateName(name)
    if (validationError) {
      setError(validationError)
      playSFX('back')
      return
    }
    playSFX('confirm')
    setSubmitting(true)

    try {
      const result = await create(name.trim())
      setFadeToBlack(true)
      setTimeout(() => onComplete(result), 1500)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear el jugador'
      setError(message)
      setSubmitting(false)
    }
  }, [name, create, onComplete, playSFX])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleSubmit()
      }
      if (e.key === 'Escape') {
        onCancel()
      }
    },
    [handleSubmit, onCancel],
  )

  const handleChange = useCallback((value: string) => {
    if (value.length <= 20) {
      setName(value)
      setError(null)
    }
  }, [])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={fadeToBlack ? undefined : onCancel}
          />

          <motion.div
            className="relative w-full max-w-lg"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={
              fadeToBlack
                ? { opacity: 0, scale: 0.95 }
                : { opacity: 1, scale: 1 }
            }
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: fadeToBlack ? 1.5 : 0.4, ease: 'easeOut' }}
            style={{ imageRendering: 'pixelated' }}
          >
            <div
              className="relative overflow-hidden border-2"
              style={{
                borderColor: 'rgba(74, 222, 128, 0.3)',
                boxShadow: '0 0 30px rgba(74, 222, 128, 0.08), inset 0 0 30px rgba(74, 222, 128, 0.03)',
                backgroundColor: 'rgba(5, 8, 5, 0.95)',
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(74, 222, 128, 0.015) 2px, rgba(74, 222, 128, 0.015) 4px)',
                }}
              />

              <div className="relative p-8 sm:p-10">
                <AnimatePresence>
                  {showContent && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8 }}
                    >
                      <div className="flex items-center gap-2 mb-6">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
                        <span
                          className="text-xs tracking-[0.25em] uppercase"
                          style={{ color: 'rgba(74, 222, 128, 0.5)', fontFamily: '"Courier New", monospace' }}
                        >
                          SISTEMA DE REGISTRO v.2.1.8
                        </span>
                      </div>

                      <div className="space-y-5" style={{ fontFamily: '"Courier New", monospace' }}>
                        <motion.p
                          className="text-base sm:text-lg leading-relaxed"
                          style={{ color: '#86efac' }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                        >
                          BIENVENIDO, INVESTIGADOR.
                        </motion.p>

                        <motion.p
                          className="text-sm leading-relaxed"
                          style={{ color: 'rgba(134, 239, 172, 0.7)' }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.8, delay: 0.8 }}
                        >
                          Antes de iniciar la expedici&oacute;n necesitamos registrar tu identidad.
                        </motion.p>

                        <motion.p
                          className="text-sm leading-relaxed"
                          style={{ color: 'rgba(134, 239, 172, 0.6)' }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.8, delay: 1.3 }}
                        >
                          &iquest;C&oacute;mo deseas que te llamemos?
                        </motion.p>
                      </div>

                      <AnimatePresence>
                        {showInput && (
                          <motion.div
                            className="mt-8 space-y-4"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <div className="relative">
                              <div
                                className="flex items-center gap-2 px-4 py-3 border"
                                style={{
                                  borderColor: error ? 'rgba(239, 68, 68, 0.5)' : 'rgba(74, 222, 128, 0.2)',
                                  backgroundColor: 'rgba(74, 222, 128, 0.03)',
                                  boxShadow: error
                                    ? '0 0 10px rgba(239, 68, 68, 0.1)'
                                    : 'inset 0 0 15px rgba(74, 222, 128, 0.03)',
                                }}
                              >
                                <span
                                  className="text-sm select-none"
                                  style={{ color: 'rgba(74, 222, 128, 0.4)' }}
                                >
                                  &gt;
                                </span>
                                <input
                                  ref={inputRef}
                                  type="text"
                                  value={name}
                                  onChange={(e) => handleChange(e.target.value)}
                                  onKeyDown={handleKeyDown}
                                  placeholder="Escribe tu nombre..."
                                  maxLength={20}
                                  disabled={submitting}
                                  className="w-full bg-transparent text-sm outline-none placeholder:opacity-30"
                                  style={{
                                    color: '#4ade80',
                                    fontFamily: '"Courier New", monospace',
                                    caretColor: '#4ade80',
                                    textShadow: '0 0 8px rgba(74, 222, 128, 0.3)',
                                  }}
                                  autoComplete="off"
                                  spellCheck={false}
                                />
                              </div>

                              {error && (
                                <motion.p
                                  className="text-xs mt-2"
                                  style={{ color: 'rgba(239, 68, 68, 0.8)', fontFamily: '"Courier New", monospace' }}
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                >
                                  ! {error}
                                </motion.p>
                              )}
                            </div>

                            <motion.button
                              onClick={handleSubmit}
                              disabled={submitting}
                              className="w-full py-3 text-sm font-bold tracking-widest uppercase border transition-all duration-150 disabled:opacity-40"
                              style={{
                                color: submitting ? 'rgba(74, 222, 128, 0.4)' : '#4ade80',
                                borderColor: submitting
                                  ? 'rgba(74, 222, 128, 0.15)'
                                  : 'rgba(74, 222, 128, 0.3)',
                                backgroundColor: submitting
                                  ? 'rgba(74, 222, 128, 0.03)'
                                  : 'rgba(74, 222, 128, 0.05)',
                                fontFamily: '"Courier New", monospace',
                                textShadow: submitting ? 'none' : '0 0 10px rgba(74, 222, 128, 0.2)',
                                boxShadow: submitting
                                  ? 'none'
                                  : '0 0 15px rgba(74, 222, 128, 0.05), inset 0 0 15px rgba(74, 222, 128, 0.03)',
                              }}
                              whileHover={submitting ? {} : { scale: 1.01 }}
                              whileTap={submitting ? {} : { scale: 0.99 }}
                            >
                              {submitting ? (
                                <span className="flex items-center justify-center gap-2">
                                  <span
                                    className="inline-block w-4 h-4 border-2 rounded-full animate-spin"
                                    style={{
                                      borderColor: 'rgba(74, 222, 128, 0.2)',
                                      borderTopColor: '#4ade80',
                                    }}
                                  />
                                  REGISTRANDO...
                                </span>
                              ) : (
                                'COMENZAR EXPEDICI\u00D3N'
                              )}
                            </motion.button>

                            <p
                              className="text-[10px] text-center tracking-wider"
                              style={{ color: 'rgba(74, 222, 128, 0.2)', fontFamily: '"Courier New", monospace' }}
                            >
                              3-20 CARACTERES | ENTER PARA CONFIRMAR
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(74, 222, 128, 0.15), transparent)',
                }}
              />
            </div>
          </motion.div>

          {fadeToBlack && (
            <motion.div
              className="absolute inset-0 pointer-events-none z-10"
              style={{ backgroundColor: '#000' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
            />
          )}
        </div>
      )}
    </AnimatePresence>
  )
}
