import type { LevelConfig } from '@/types/level'

export const level3: LevelConfig = {
  id: 'level-3',
  title: 'Circuito Eléctrico',
  background: '/backgrounds/electrical-circuit.png',
  character: 'kira',
  introduction: [
    { speaker: 'SISTEMA', text: 'Laboratorio de Circuitos Eléctricos.' },
    { speaker: 'KIRA', text: 'La energía eléctrica alimenta todo el laboratorio. Debemos entender cómo fluye.' },
  ],
  completionDialogue: [
    { speaker: 'KIRA', text: 'El circuito está completo. La energía fluye.' },
    { speaker: 'SISTEMA', text: 'Transformación eléctrica comprendida.' },
  ],
  nextLevel: 'level-4',
  interactiveObjects: [
    {
      id: 'circuit-board',
      type: 'interactive',
      title: 'Tablero de Circuitos',
      area: { x: 25, y: 35, width: 16, height: 22 },
      unlockAfter: null,
      activityId: 'activity-04',
    },
  ],
}
