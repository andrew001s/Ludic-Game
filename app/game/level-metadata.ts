import type { Metadata } from 'next'
import { getLevelConfig } from '@/services/level.service'

const LEVEL_DESCRIPTIONS: Record<string, string> = {
  'level-1': 'Restaura el Laboratorio del Movimiento y comprende cómo la masa y la velocidad activan la transformación de la energía.',
  'level-2': 'Explora el Centro de Investigación Gravitacional y descubre cómo la gravedad almacena y transforma energía.',
  'level-3': 'Recupera el Instituto Fotónico y devuelve la luz al laboratorio para revelar cómo transporta energía.',
  'level-4': 'Repara la Central Electrotecnológica y restablece el flujo eléctrico que conecta la tecnología con la energía.',
  'level-5': 'Activa el Laboratorio Bioquímico y aprende cómo la energía química impulsa la vida y los procesos naturales.',
  'level-6': 'Entra en el Núcleo de Conservación y resuelve el equilibrio final entre materia, energía y restauración ecológica.',
}

const OG_IMAGE = '/icons/icon-512.png'

export function generateLevelMetadata(levelId: string): Metadata {
  const levelConfig = getLevelConfig(levelId)

  if (!levelConfig) {
    return {}
  }

  const description = LEVEL_DESCRIPTIONS[levelId] ?? levelConfig.title
  const pageTitle = `${levelConfig.title} | NEXUS Ω: Guardianes de la Conservación`

  return {
    title: pageTitle,
    description,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: pageTitle,
      description,
      type: 'website',
      siteName: 'NEXUS Ω: Guardianes de la Conservación',
      locale: 'es_ES',
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: [OG_IMAGE],
    },
  }
}