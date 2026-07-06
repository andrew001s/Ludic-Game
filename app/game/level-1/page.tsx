import { Background } from '@/components/game/Background'

export default function Level1() {
  return (
    <>
      <Background />
      <div className="fixed inset-0 flex items-center justify-center">
        <p
          className="text-lg tracking-widest uppercase animate-pulse"
          style={{
            color: 'rgba(74, 222, 128, 0.4)',
            fontFamily: '"Courier New", monospace',
          }}
        >
          Nivel 1 — Pr&oacute;ximamente
        </p>
      </div>
    </>
  )
}
