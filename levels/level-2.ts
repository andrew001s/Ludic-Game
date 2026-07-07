import type { LevelConfig } from '@/types/level'

export const level2: LevelConfig = {
  id: 'level-2',
  title: 'Centro de Investigaci\u00F3n Gravitacional',
  background: '/backgrounds/level2.png',
  character: 'vega',
  introduction: [
    {
      speaker: 'VEGA',
      text: 'La gravedad parece invisible...',
    },
    {
      speaker: 'VEGA',
      text: 'pero mantiene unido el universo.',
    },
    {
      speaker: 'VEGA',
      text: 'Sin ella... todo perder\u00EDa el equilibrio.',
    },
    {
      speaker: 'VEGA',
      text: 'Necesitamos restaurar el Centro Gravitacional.',
    },
  ],
  completionDialogue: [
    {
      speaker: 'VEGA',
      text: 'Excelente trabajo.',
    },
    {
      speaker: 'VEGA',
      text: 'Ahora comprendes que un objeto puede almacenar energ\u00EDa gracias a su posici\u00F3n.',
    },
    {
      speaker: 'VEGA',
      text: 'La gravedad no solo atrae los cuerpos... tambi\u00E9n permite transformar la energ\u00EDa de formas sorprendentes.',
    },
    {
      speaker: 'VEGA',
      text: 'La expedici\u00F3n contin\u00FAa.',
    },
  ],
  nextLevel: 'level-3',
  interactiveObjects: [
    {
      id: 'consola',
      type: 'interactive',
      title: 'Consola Gravitacional',
      area: { x: 1, y: 32, width: 17, height: 32 },
      unlockAfter: null,
      activityId: 'activity-10',
    },
    {
      id: 'esfera',
      type: 'interactive',
      title: 'Esfera Met\u00E1lica',
      area: { x: 20, y: 36, width: 16, height: 38 },
      unlockAfter: 'consola',
      activityId: 'activity-11',
    },
    {
      id: 'laboratorio',
      type: 'interactive',
      title: 'Laboratorio de Comparaci\u00F3n',
      area: { x: 37, y: 27, width: 18, height: 42 },
      unlockAfter: 'esfera',
      activityId: 'activity-12',
    },
    {
      id: 'roca',
      type: 'interactive',
      title: 'Roca Suspendida',
      area: { x: 55, y: 8, width: 15, height: 38 },
      unlockAfter: 'laboratorio',
      activityId: 'activity-13',
    },
    {
      id: 'simulador',
      type: 'interactive',
      title: 'Simulador de Gravedad',
      area: { x: 71, y: 30, width: 15, height: 36 },
      unlockAfter: 'roca',
      activityId: 'activity-14',
    },
    {
      id: 'torre',
      type: 'interactive',
      title: 'Torre Gravitacional',
      area: { x: 84, y: 2, width: 18, height: 88 },
      unlockAfter: 'simulador',
      activityId: 'activity-15',
    },
  ],
}
