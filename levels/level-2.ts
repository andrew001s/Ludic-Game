import type { LevelConfig } from '@/types/level'

export const level2: LevelConfig = {
  id: 'level-2',
  title: 'Fuente de Energía',
  background: '/backgrounds/energy-source.png',
  character: 'kira',
  introduction: [
    { speaker: 'SISTEMA', text: 'Laboratorio de Fuentes de Energía activado.' },
    { speaker: 'KIRA', text: 'Necesitamos identificar las diferentes fuentes y sus transformaciones.' },
  ],
  completionDialogue: [
    { speaker: 'KIRA', text: 'Cada fuente de energía tiene un potencial único.' },
    { speaker: 'SISTEMA', text: 'Conocimiento registrado. Continuamos.' },
  ],
  nextLevel: 'level-3',
  interactiveObjects: [
    {
      id: 'generator',
      type: 'interactive',
      title: 'Generador',
      area: { x: 20, y: 40, width: 14, height: 18 },
      unlockAfter: null,
      activityId: 'activity-03',
    },
  ],
}
