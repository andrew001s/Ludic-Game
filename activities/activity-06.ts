import type { MultipleChoiceActivity } from '@/types/activity'

export const activity06: MultipleChoiceActivity = {
  id: 'activity-06',
  type: 'multiple-choice',
  title: 'Puerta Principal — Desaf\u00EDo Final',
  instruction: 'Cinco laboratorios activados. Una \u00FAltima evaluaci\u00F3n.',
  question: 'Has aprendido que la energ\u00EDa cin\u00E9tica depende de la masa y la velocidad.\n\n\u00BFCu\u00E1l de las siguientes afirmaciones resume mejor lo aprendido?',
  options: [
    'La energ\u00EDa cin\u00E9tica solo existe en objetos muy pesados.',
    'La energ\u00EDa cin\u00E9tica es la energ\u00EDa del movimiento y depende de la masa y la velocidad.',
    'La energ\u00EDa cin\u00E9tica desaparece cuando el objeto se mueve.',
    'La energ\u00EDa cin\u00E9tica solo se produce con electricidad.',
  ],
  correctIndex: 1,
  feedback: {
    success: '\u00A1Correcto!\n\nEl enorme brazo rob\u00F3tico mueve el mecanismo principal.\n\nLa puerta se abre lentamente.\n\nLaboratorio del Movimiento restaurado.',
    error: 'Incorrecto.\n\nRecuerda: energ\u00EDa cin\u00E9tica = \u00BD \u00D7 masa \u00D7 velocidad\u00B2\n\nDepende del movimiento, la masa y la velocidad.',
  },
}
