import type { LevelConfig } from '@/types/level'

export const level1: LevelConfig = {
  id: 'level-1',
  title: 'Laboratorio del Movimiento',
  background: '/backgrounds/laboratory-motion.png',
  character: 'kira',
  introduction: [
    {
      speaker: 'KIRA',
      text: 'Todo parece inm\u00F3vil...',
    },
    {
      speaker: 'KIRA',
      text: 'Pero el movimiento es el inicio de casi todas las transformaciones de energ\u00EDa.',
    },
    {
      speaker: 'KIRA',
      text: 'Si recuperamos el movimiento, el laboratorio comenzar\u00E1 a despertar.',
    },
    {
      speaker: 'SISTEMA',
      text: 'Ruta de restauraci\u00F3n bloqueada: Pizarra > Molino > R\u00EDo > Robot > Terminal > Puerta.',
    },
  ],
  completionDialogue: [
    {
      speaker: 'KIRA',
      text: 'Excelente trabajo.',
    },
    {
      speaker: 'KIRA',
      text: 'Has restaurado el Laboratorio del Movimiento.',
    },
    {
      speaker: 'KIRA',
      text: 'Ahora comprendes que toda energ\u00EDa asociada al movimiento depende de la masa y la velocidad.',
    },
    {
      speaker: 'KIRA',
      text: 'La expedici\u00F3n apenas comienza.',
    },
  ],
  nextLevel: 'level-2',
  interactiveObjects: [
    {
      id: 'pizarra',
      type: 'interactive',
      title: 'Pizarra Cient\u00EDfica',
      area: { x: 9, y: 34, width: 15, height: 24 },
      unlockAfter: null,
      activityId: 'activity-01',
    },
    {
      id: 'molino',
      type: 'interactive',
      title: 'Molino Experimental',
      area: { x: 29, y: 39, width: 13, height: 21 },
      unlockAfter: 'pizarra',
      activityId: 'activity-02',
    },
    {
      id: 'rio',
      type: 'interactive',
      title: 'R\u00EDo Experimental',
      area: { x: 21, y: 63, width: 24, height: 15 },
      unlockAfter: 'molino',
      activityId: 'activity-03',
    },
    {
      id: 'robot',
      type: 'interactive',
      title: 'Robot Cient\u00EDfico',
      area: { x: 54, y: 37, width: 13, height: 23 },
      unlockAfter: 'rio',
      activityId: 'activity-04',
    },
    {
      id: 'terminal',
      type: 'interactive',
      title: 'Terminal de Simulaci\u00F3n',
      area: { x: 74, y: 31, width: 17, height: 25 },
      unlockAfter: 'robot',
      activityId: 'activity-05',
    },
    {
      id: 'puerta',
      type: 'interactive',
      title: 'Puerta Principal',
      area: { x: 83, y: 17, width: 13, height: 29 },
      unlockAfter: 'terminal',
      activityId: 'activity-06',
    },
  ],
}
