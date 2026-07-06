'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { MenuButton } from '@/components/ui/MenuButton'

export default function GamePage() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050805] gap-8 p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1
          className="text-3xl sm:text-4xl font-black tracking-widest uppercase text-green-500"
          style={{
            fontFamily: '"Courier New", monospace',
            textShadow: '0 0 20px rgba(74, 222, 128, 0.3), 2px 2px 0 #0d1f0d',
            imageRendering: 'pixelated',
          }}
        >
          Cargando Partida...
        </h1>
        <p
          className="text-green-700 text-sm"
          style={{ fontFamily: '"Courier New", monospace' }}
        >
          El juego comenzar&aacute; pronto.
        </p>
      </div>

      <MenuButton variant="secondary" onClick={() => router.push('/')}>
        <span className="flex items-center gap-2">
          <ArrowLeft size={18} />
          Volver al Men&uacute;
        </span>
      </MenuButton>
    </div>
  )
}
