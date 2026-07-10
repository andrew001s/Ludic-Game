'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

function isIosStandalone() {
  if (typeof window === 'undefined') return false
  return Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone)
}

function isStandaloneDisplayMode() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(display-mode: standalone)').matches || isIosStandalone()
}

function isAndroidDevice() {
  if (typeof window === 'undefined') return false
  return /Android/i.test(window.navigator.userAgent)
}

export function AppShellHints() {
  const [isStandalone, setIsStandalone] = useState(false)
  const [isPortrait, setIsPortrait] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    const updateMode = () => {
      setIsStandalone(isStandaloneDisplayMode())
      setIsPortrait(window.matchMedia('(orientation: portrait)').matches)
    }

    updateMode()
    mediaQuery.addEventListener('change', updateMode)
    window.addEventListener('resize', updateMode)
    window.addEventListener('orientationchange', updateMode)

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as BeforeInstallPromptEvent)
    }

    const handleInstalled = () => {
      setInstallPrompt(null)
      updateMode()
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleInstalled)

    return () => {
      mediaQuery.removeEventListener('change', updateMode)
      window.removeEventListener('resize', updateMode)
      window.removeEventListener('orientationchange', updateMode)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  const showInstallHint = useMemo(
    () => isAndroidDevice() && !isStandalone,
    [isStandalone],
  )

  const handleInstall = useCallback(async () => {
    if (!installPrompt) return

    await installPrompt.prompt()
    await installPrompt.userChoice.catch(() => undefined)
    setInstallPrompt(null)
  }, [installPrompt])

  return (
    <>
      {showInstallHint && (
        <div
          className="fixed bottom-3 left-1/2 z-[9998] w-[min(92vw,28rem)] -translate-x-1/2 border px-4 py-3"
          style={{
            borderColor: 'rgba(74, 222, 128, 0.34)',
            color: '#dfe9ae',
            backgroundColor: 'rgba(5, 8, 5, 0.94)',
            boxShadow: '0 8px 28px rgba(0,0,0,0.42)',
            fontFamily: '"Courier New", monospace',
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-[0.24em]" style={{ color: '#4ade80' }}>
                Instala la app
              </div>
              <div className="mt-1 text-[10px] leading-relaxed" style={{ color: 'rgba(223, 233, 174, 0.78)' }}>
                En Android puedes instalar esta web como app para usarla mejor en pantalla completa.
              </div>
            </div>

            {installPrompt ? (
              <button
                type="button"
                onClick={handleInstall}
                className="shrink-0 border px-3 py-2 text-[10px] uppercase tracking-[0.22em]"
                style={{
                  borderColor: 'rgba(74, 222, 128, 0.42)',
                  backgroundColor: 'rgba(20, 83, 45, 0.35)',
                }}
              >
                Instalar
              </button>
            ) : (
              <div className="shrink-0 text-[10px] uppercase tracking-[0.18em]" style={{ color: 'rgba(223, 233, 174, 0.62)' }}>
                Menú ⋮ → Instalar
              </div>
            )}
          </div>
        </div>
      )}

      <div
        className={`rotate-device-overlay fixed inset-0 z-[9999] ${isStandalone && isPortrait ? 'flex' : 'hidden'} flex-col items-center justify-center gap-4 bg-[#050805] p-6 text-center`}
        style={{ fontFamily: '"Courier New", monospace' }}
      >
        <div className="mb-2 text-5xl">↻</div>
        <div className="text-sm uppercase tracking-[0.3em]" style={{ color: '#4ade80' }}>
          Gira el dispositivo
        </div>
        <div className="max-w-xs text-[10px] tracking-wider" style={{ color: 'rgba(74, 222, 128, 0.5)' }}>
          Usa la app en modo horizontal para una mejor experiencia
        </div>
      </div>
    </>
  )
}
