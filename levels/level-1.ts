import type { LevelConfig } from '@/types/level'

export const level1: LevelConfig = {
  id: 'level-1',
  title: 'Laboratorio del Movimiento',
  background: '/backgrounds/laboratory-motion.png',
  character: 'kira',
  introduction: [
    { speaker: 'SISTEMA', text: 'Bienvenida, Investigadora. Este es el Laboratorio del Movimiento.' },
    { speaker: 'KIRA', text: 'Aquí estudiaremos las transformaciones de la energía cinética.' },
    { speaker: 'KIRA', text: 'Explora el laboratorio y completa los análisis.' },
  ],
  completionDialogue: [
    { speaker: 'SISTEMA', text: 'Análisis de movimiento completado.' },
    { speaker: 'KIRA', text: 'La energía cinética se transforma constantemente. Debemos seguir investigando.' },
    { speaker: 'SISTEMA', text: 'Acceso al siguiente laboratorio desbloqueado.' },
  ],
  nextLevel: 'level-2',
  interactiveObjects: [
    {
      id: 'board',
      type: 'interactive',
      title: 'Pizarra',
      area: { x: 18, y: 38, width: 14, height: 20 },
      unlockAfter: null,
      activityId: 'activity-01',
    },
    {
      id: 'robot',
      type: 'interactive',
      title: 'Brazo Robótico',
      area: { x: 65, y: 35, width: 12, height: 25 },
      unlockAfter: 'board',
      activityId: 'activity-02',
    },
  ],
}
