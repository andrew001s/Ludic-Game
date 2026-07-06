import { INTERACTIVE_OBJECT_STYLES } from '@/app/constants/styles/interactiveObjects'
import type { LevelConfig } from '@/types/level'

export const level1: LevelConfig = {
  id: 'level-1',
  title: 'Laboratorio del Movimiento',
  background: '/backgrounds/level1.png',
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
      area: { x: 0, y: 20.5, width: 25, height: 40 },
      unlockAfter: null,
      activityId: 'activity-01',
      visual: {
        resource: '/assets/level1/board.png',
        transform: 'perspective(1400px) rotateY(30deg) rotateX(0deg) rotateZ(2deg) skewY(-1.5deg)',
        transformOrigin: 'center center',
        fit: 'cover',
        opacity: 0.98,
        className: INTERACTIVE_OBJECT_STYLES.hoverDefault,
      },
    },
    {
      id: 'molino',
      type: 'interactive',
      title: 'Molino Experimental',
      area: { x: 25, y: 20, width: 20, height: 50 },
      unlockAfter: 'pizarra',
      activityId: 'activity-02',
      visual: {
        resource: '/assets/level1/molino.png',
        transform: 'perspective(1100px) rotateZ(-1.2deg) skewY(-0.4deg)',
        transformOrigin: 'center center',
        opacity: 1,
        fit: 'cover',
        zIndex: 3,
        className: INTERACTIVE_OBJECT_STYLES.hoverDefault,
      },
    },
    {
      id: 'rio',
      type: 'interactive',
      title: 'R\u00EDo Experimental',
      area: { x: 25, y: 43, width: 80, height: 80 },
      unlockAfter: 'molino',
      activityId: 'activity-03',
      visual: {
        resource: '/assets/level1/river.png',
        transform: 'perspective(1100px) rotateZ(-4.5deg) skewX(-0.3deg)',
        transformOrigin: 'center center',
        fit: 'fill',
        zIndex: 1,
        className: INTERACTIVE_OBJECT_STYLES.hoverDefault ,
      },
    },
    {
      id: 'robot',
      type: 'interactive',
      title: 'Robot Cient\u00EDfico',
      area: { x: 45, y: 28, width: 13, height: 40 },
      unlockAfter: 'rio',
      activityId: 'activity-04',
      visual: {
        resource: '/assets/level1/robot.png',
        transform: 'perspective(1000px) rotateZ(0.8deg) skewY(-0.2deg)',
        transformOrigin: 'center center',
        fit: 'cover',
      },
    },
    {
      id: 'terminal',
      type: 'interactive',
      title: 'Terminal de Simulaci\u00F3n',
      area: { x: 74, y: 31, width: 17, height: 25 },
      unlockAfter: 'robot',
      activityId: 'activity-05',
      visual: {
        transform: 'perspective(1000px) rotateZ(-0.8deg) skewY(0.2deg)',
        transformOrigin: 'center center',
      },
    },
    {
      id: 'puerta',
      type: 'interactive',
      title: 'Puerta Principal',
      area: { x: 83, y: 17, width: 13, height: 29 },
      unlockAfter: 'terminal',
      activityId: 'activity-06',
      visual: {
        transform: 'perspective(1000px) rotateZ(0.5deg) skewX(0.2deg)',
        transformOrigin: 'center center',
      },
    },
  ],
}
