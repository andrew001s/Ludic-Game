'use client'

export function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      <img
        src="/backgrounds/start.png"
        alt=""
        className="w-full h-full object-cover pointer-events-none select-none"
        style={{
          imageRendering: 'pixelated',
          objectPosition: 'center center',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0.1) 60%, transparent 100%)',
        }}
      />
    </div>
  )
}
