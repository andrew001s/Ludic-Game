import type { DragOrderActivity } from '@/types/activity'

export const activity04: DragOrderActivity = {
  id: 'activity-04',
  type: 'drag-order',
  title: 'Robot Cient\u00EDfico',
  instruction: 'Reconstruye la cadena que convierte el movimiento en una acci\u00F3n visible.',
  question: '\u00BFCu\u00E1l es el orden correcto de la transformaci\u00F3n energ\u00E9tica?',
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
