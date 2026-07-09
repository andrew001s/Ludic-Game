import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NEXUS Ω: Guardianes de la Conservación',
    short_name: 'NEXUS Ω',
    description: 'NEXUS Ω: Guardianes de la Conservación es un videojuego educativo 2D de aventura y pixel art sobre naturaleza, ciencia y restauración ecológica.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050805',
    theme_color: '#050805',
    orientation: 'landscape',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
