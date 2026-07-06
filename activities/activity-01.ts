import type { MultipleChoiceActivity } from '@/types/activity'

export const activity01: MultipleChoiceActivity = {
  id: 'activity-01',
  type: 'multiple-choice',
  title: 'Pizarra Cient\u00EDfica',
  instruction: 'Lee atentamente y selecciona la respuesta correcta.',
  question: '\u00BFQu\u00E9 es la energ\u00EDa cin\u00E9tica?',
  options: [
    'La energ\u00EDa almacenada por la altura de un objeto.',
    'La energ\u00EDa producida \u00FAnicamente por el calor.',
    'La energ\u00EDa que posee un cuerpo debido a su movimiento.',
    'La energ\u00EDa producida por la electricidad.',
  ],
  correctIndex: 2,
  feedback: {
    success: '\u00A1Excelente!\n\nTodo objeto que se mueve posee energ\u00EDa cin\u00E9tica.',
    error: 'Observa nuevamente.\n\nRecuerda que la energ\u00EDa cin\u00E9tica depende del movimiento.',
  },
}
