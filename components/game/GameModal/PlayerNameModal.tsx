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
      const t0 = setTimeout(() => setShowContent(true), 0)
      const t1 = setTimeout(() => setShowInput(true), 2200)
      const t2 = setTimeout(() => inputRef.current?.focus(), 2400)
      return () => {
        clearTimeout(t0)
        clearTimeout(t1)
        clearTimeout(t2)
      }
    } else {
      const t0 = setTimeout(() => {
        setShowContent(false)
        setShowInput(false)
        setName('')
        setError(null)
        setSubmitting(false)
        setFadeToBlack(false)
      }, 0)
      return () => clearTimeout(t0)
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
            className="absolute inset-0 bg-[#030402]/92"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={fadeToBlack ? undefined : onCancel}
          />

          <motion.div
            className="relative w-full max-w-180 px-4 sm:px-0"
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
              className="relative overflow-hidden border-[3px] border-[#5a5c31] bg-[#10130e] shadow-[0_24px_80px_rgba(0,0,0,0.85)]"
              style={{
                backgroundImage:
                  'radial-gradient(circle at top left, rgba(168, 204, 92, 0.08), transparent 28%), radial-gradient(circle at bottom right, rgba(99, 102, 48, 0.2), transparent 32%), repeating-linear-gradient(0deg, rgba(255,255,255,0.014) 0 2px, transparent 2px 6px), repeating-linear-gradient(90deg, rgba(255,255,255,0.01) 0 2px, transparent 2px 6px)',
                boxShadow:
                  'inset 0 0 0 1px rgba(203, 226, 120, 0.08), inset 0 0 36px rgba(0,0,0,0.55), 0 24px 80px rgba(0,0,0,0.85)',
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(180deg, rgba(255,255,255,0.03), transparent 32%), linear-gradient(90deg, rgba(255,255,255,0.03), transparent 30%)',
                }}
              />

              <div
                className="absolute inset-x-0 top-0 h-4 pointer-events-none"
                style={{ background: 'linear-gradient(90deg, rgba(168,204,92,0.16), transparent 25%, transparent 75%, rgba(168,204,92,0.16))' }}
              />

              <div
                className="absolute inset-y-0 left-0 w-4 pointer-events-none"
                style={{ background: 'linear-gradient(180deg, rgba(168,204,92,0.12), transparent 30%, transparent 70%, rgba(168,204,92,0.12))' }}
              />

              <button
                type="button"
                onClick={onCancel}
                className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center border-[3px] border-[#5a5c31] bg-[#11140f] text-[#a8cc5c] transition-colors hover:bg-[#191d15] hover:text-[#d7e79a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7e79a]"
                aria-label="Cerrar modal"
                style={{ fontFamily: '"Courier New", monospace', textShadow: '1px 1px 0 #050603' }}
              >
                X
              </button>

              <div className="relative p-6 sm:p-10 pt-14 sm:pt-12">
                <AnimatePresence>
                  {showContent && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8 }}
                      style={{ fontFamily: '"Courier New", monospace', imageRendering: 'pixelated' }}
                    >
                      <div className="mx-auto mb-5 flex w-fit items-center justify-center border-[3px] border-[#616440] bg-[#141812] px-6 py-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
                        <span
                          className="text-[13px] sm:text-sm font-bold tracking-[0.22em] uppercase text-[#dfe9ae]"
                          style={{ textShadow: '2px 2px 0 #060705' }}
                        >
                          Nuevo Juego
                        </span>
                      </div>

                      <div className="space-y-4 text-center">
                        <motion.p
                          className="text-[18px] sm:text-[21px] leading-tight uppercase font-bold"
                          style={{ color: '#b9d86d', textShadow: '2px 2px 0 #050603' }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                        >
                          BIENVENIDO, INVESTIGADOR.
                        </motion.p>

                        <motion.p
                          className="text-[15px] sm:text-[16px] leading-relaxed uppercase"
                          style={{ color: '#d2d2c8', textShadow: '1px 1px 0 #050603' }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.8, delay: 0.8 }}
                        >
                          Antes de iniciar la expedici&oacute;n necesitamos registrar tu identidad.
                        </motion.p>

                        <motion.p
                          className="text-[15px] sm:text-[16px] leading-relaxed uppercase"
                          style={{ color: '#b9d86d', textShadow: '1px 1px 0 #050603' }}
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
                                className="flex items-center gap-2 px-4 py-3 border-[3px] bg-[#0d100b]"
                                style={{
                                  borderColor: error ? 'rgba(220, 120, 102, 0.8)' : 'rgba(183, 209, 103, 0.55)',
                                  boxShadow: error
                                    ? 'inset 0 0 0 1px rgba(220, 120, 102, 0.12), 0 0 0 1px rgba(0,0,0,0.25)'
                                    : 'inset 0 0 0 1px rgba(183, 209, 103, 0.08), 0 0 0 1px rgba(0,0,0,0.25)',
                                  backgroundImage:
                                    'repeating-linear-gradient(90deg, rgba(255,255,255,0.018) 0 2px, transparent 2px 6px)',
                                }}
                              >
                                <span
                                  className="text-base select-none"
                                  style={{ color: '#9cb55d', textShadow: '1px 1px 0 #050603' }}
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
                                  className="w-full bg-transparent text-[16px] sm:text-[17px] uppercase outline-none placeholder:opacity-30"
                                  style={{
                                    color: '#dfe9ae',
                                    fontFamily: '"Courier New", monospace',
                                    caretColor: '#dfe9ae',
                                    textShadow: '1px 1px 0 #050603',
                                  }}
                                  autoComplete="off"
                                  spellCheck={false}
                                />
                              </div>

                              {error && (
                                <motion.p
                                  className="text-xs mt-2 uppercase tracking-[0.18em]"
                                  style={{ color: '#e19483', fontFamily: '"Courier New", monospace', textShadow: '1px 1px 0 #050603' }}
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
                              className="w-full py-4 text-sm font-bold tracking-[0.2em] uppercase border-[3px] transition-all duration-150 disabled:opacity-45"
                              style={{
                                color: submitting ? '#9ea77b' : '#e4efbf',
                                borderColor: submitting ? 'rgba(109, 113, 73, 0.9)' : 'rgba(118, 123, 76, 0.95)',
                                backgroundColor: submitting ? '#10130e' : '#1a1f15',
                                fontFamily: '"Courier New", monospace',
                                textShadow: '1px 1px 0 #050603',
                                boxShadow: submitting
                                  ? 'inset 0 0 0 1px rgba(255,255,255,0.03)'
                                  : 'inset 0 0 0 1px rgba(255,255,255,0.05), 0 10px 0 rgba(0,0,0,0.18)',
                              }}
                              whileHover={submitting ? {} : { scale: 1.01 }}
                              whileTap={submitting ? {} : { scale: 0.99 }}
                            >
                              {submitting ? (
                                <span className="flex items-center justify-center gap-2">
                                  <span
                                    className="inline-block w-4 h-4 border-2 rounded-full animate-spin"
                                    style={{
                                      borderColor: 'rgba(223, 233, 174, 0.22)',
                                      borderTopColor: '#dfe9ae',
                                    }}
                                  />
                                  REGISTRANDO...
                                </span>
                              ) : (
                                'COMENZAR EXPEDICI\u00D3N'
                              )}
                            </motion.button>

                            <p
                              className="text-[10px] text-center tracking-[0.22em] uppercase"
                              style={{ color: 'rgba(223, 233, 174, 0.35)', fontFamily: '"Courier New", monospace', textShadow: '1px 1px 0 #050603' }}
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
                  background: 'linear-gradient(90deg, transparent, rgba(183, 209, 103, 0.28), transparent)',
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
