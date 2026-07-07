import type { RobotPathActivity } from '@/types/activity'

export const activity04: RobotPathActivity = {
  id: 'activity-04',
  type: 'robot-path',
  title: 'Robot Cient\u00EDfico',
  instruction: 'Arrastra cada pieza al paso correcto para encender la ruta del robot.',
  question: '\u00BFEn qu\u00E9 orden fluye la energ\u00EDa para activar el robot?',
  items: [
    'Movimiento',
    'Energ\u00EDa Cin\u00E9tica',
    'Motor',
    'Robot funcionando',
  ],
  correctOrder: [0, 1, 2, 3],
  feedback: {
    success: 'Correcto.\n\nEl movimiento genera energ\u00EDa cin\u00E9tica, que acciona el motor y pone el robot en funcionamiento.\n\nEl robot cobra vida.',
    error: 'Orden incorrecto.\n\nRecuerda la cadena: primero hay movimiento, luego energ\u00EDa cin\u00E9tica, despu\u00E9s motor y finalmente robot funcionando.',
  },
}
