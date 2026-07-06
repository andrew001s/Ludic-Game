import type { LevelConfig } from '@/types/level'

export const level4: LevelConfig = {
  id: 'level-4',
  title: 'Conservación de la Energía',
  background: '/backgrounds/conservation-lab.png',
  character: 'kira',
  introduction: [
    { speaker: 'SISTEMA', text: 'Laboratorio de Conservación de la Energía.' },
    { speaker: 'KIRA', text: 'La energía no se destruye, solo se transforma. Es hora de demostrarlo.' },
  ],
  completionDialogue: [
    { speaker: 'SISTEMA', text: 'Principio de conservación verificado.' },
    { speaker: 'KIRA', text: 'Todo encaja. La energía siempre persiste.' },
  ],
  nextLevel: 'level-5',
  interactiveObjects: [
    {
      id: 'pendulum',
      type: 'interactive',
      title: 'Péndulo',
      area: { x: 40, y: 30, width: 12, height: 30 },
      unlockAfter: null,
      activityId: 'activity-05',
    },
  ],
}
