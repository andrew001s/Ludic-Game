import type { BossQuizActivity } from '@/types/activity'

export const activity06: BossQuizActivity = {
  id: 'activity-06',
  type: 'boss-quiz',
  title: 'Puerta Principal — Desaf\u00EDo Final',
  instruction: 'Cinco respuestas r\u00E1pidas. Cada acierto activa un engranaje.',
  questions: [
    {
      question: '\u00BFQu\u00E9 es la energ\u00EDa cin\u00E9tica?',
      options: [
        'La energ\u00EDa almacenada por la altura.',
        'La energ\u00EDa del movimiento.',
        'La energ\u00EDa producida por el calor.',
        'La energ\u00EDa de la electricidad.',
      ],
      correctIndex: 1,
    },
    {
      question: '\u00BFDe qu\u00E9 depende principalmente?',
      options: ['Altura y temperatura.', 'Masa y velocidad.', 'Color y forma.', 'Tiempo y distancia.'],
      correctIndex: 1,
    },
    {
      question: '\u00BFQu\u00E9 ocurre cuando aumenta la velocidad?',
      options: ['La energ\u00EDa cin\u00E9tica aumenta.', 'La energ\u00EDa cin\u00E9tica desaparece.', 'No cambia nada.', 'Se convierte en luz.'],
      correctIndex: 0,
    },
    {
      question: 'Menciona un ejemplo cotidiano de energ\u00EDa cin\u00E9tica.',
      options: ['Una piedra en una mesa.', 'Un auto en movimiento.', 'Un libro cerrado.', 'Una pared.'],
      correctIndex: 1,
    },
    {
      question: '\u00BFQu\u00E9 objeto posee mayor energ\u00EDa cin\u00E9tica?',
      options: [
        'Un objeto inm\u00F3vil.',
        'Una bicicleta lenta.',
        'Un autom\u00F3vil r\u00E1pido y pesado.',
        'Una caja detenida.',
      ],
      correctIndex: 2,
    },
  ],
  timePerQuestion: 10,
  passThreshold: 4,
  feedback: {
    success: '\u00A1Correcto!\n\nEl enorme brazo rob\u00F3tico mueve el mecanismo principal.\n\nLa puerta se abre lentamente.',
    error: 'A\u00FAn necesitas reforzar los conceptos clave.\n\nRevisa movimiento, masa y velocidad antes de abrir la puerta.',
  },
}
