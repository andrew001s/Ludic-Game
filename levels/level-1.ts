import type { LevelConfig } from '@/types/level'

export const level1: LevelConfig = {
  id: 'level-1',
  title: 'Laboratorio del Movimiento',
  background: '/backgrounds/laboratory-motion.png',
  character: 'kira',
  introduction: [
    {
      speaker: 'KIRA',
      text: 'Todo parece inm\u00F3vil... pero el movimiento es el inicio de casi todas las transformaciones de energ\u00EDa.',
    },
    {
      speaker: 'KIRA',
      text: 'Si recuperamos el movimiento, el laboratorio comenzar\u00E1 a despertar.',
    },
    {
      speaker: 'SISTEMA',
      text: 'Objetivo: Restaurar la energ\u00EDa cin\u00E9tica del laboratorio.',
    },
    {
      speaker: 'SISTEMA',
      text: 'Comienza investigando la Pizarra Cient\u00EDfica.',
    },
  ],
  completionDialogue: [
    {
      speaker: 'SISTEMA',
      text: 'NIVEL COMPLETADO. Energ\u00EDa Cin\u00E9tica Restaurada.',
    },
    {
      speaker: 'KIRA',
      text: 'Excelente trabajo. Has restaurado el Laboratorio del Movimiento.',
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
      area: { x: 10, y: 35, width: 14, height: 22 },
      unlockAfter: null,
      activityId: 'activity-01',
    },
    {
      id: 'molino',
      type: 'interactive',
      title: 'Molino Experimental',
      area: { x: 30, y: 40, width: 12, height: 20 },
      unlockAfter: 'pizarra',
      activityId: 'activity-02',
    },
    {
      id: 'rio',
      type: 'interactive',
      title: 'R\u00EDo Experimental',
      area: { x: 22, y: 65, width: 22, height: 14 },
      unlockAfter: 'molino',
      activityId: 'activity-03',
    },
    {
      id: 'robot',
      type: 'interactive',
      title: 'Robot Cient\u00EDfico',
      area: { x: 55, y: 38, width: 12, height: 22 },
      unlockAfter: 'rio',
      activityId: 'activity-04',
    },
    {
      id: 'terminal',
      type: 'interactive',
      title: 'Terminal de Simulaci\u00F3n',
      area: { x: 75, y: 32, width: 16, height: 24 },
      unlockAfter: 'robot',
      activityId: 'activity-05',
    },
    {
      id: 'puerta',
      type: 'interactive',
      title: 'Puerta Principal',
      area: { x: 84, y: 18, width: 12, height: 28 },
      unlockAfter: 'terminal',
      activityId: 'activity-06',
    },
  ],
}
