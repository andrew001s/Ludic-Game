import type { LevelConfig } from '@/types/level'

export const level5: LevelConfig = {
  id: 'level-5',
  title: 'Laboratorio Final',
  background: '/backgrounds/final-lab.png',
  character: 'kira',
  introduction: [
    { speaker: 'SISTEMA', text: 'Laboratorio Final desbloqueado.' },
    { speaker: 'KIRA', text: 'Es momento de unir todo lo aprendido.' },
  ],
  completionDialogue: [
    { speaker: 'SISTEMA', text: 'Todos los análisis completados.' },
    { speaker: 'KIRA', text: 'Hemos restaurado el equilibrio energético del laboratorio.' },
    { speaker: 'SISTEMA', text: 'Misión cumplida. El legado de la conservación continúa.' },
  ],
  nextLevel: null,
  interactiveObjects: [
    {
      id: 'console',
      type: 'interactive',
      title: 'Consola Central',
      area: { x: 30, y: 40, width: 16, height: 20 },
      unlockAfter: null,
      activityId: 'activity-06',
    },
    {
      id: 'reactor',
      type: 'interactive',
      title: 'Núcleo del Reactor',
      area: { x: 55, y: 35, width: 14, height: 22 },
      unlockAfter: 'console',
      activityId: 'activity-07',
    },
  ],
}
