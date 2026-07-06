import type { MultipleChoiceActivity } from '@/types/activity'

export const activity03: MultipleChoiceActivity = {
  id: 'activity-03',
  type: 'multiple-choice',
  title: 'R\u00EDo Experimental',
  instruction: 'Analiza las combinaciones de masa y velocidad.',
  question: '\u00BFQu\u00E9 combinaci\u00F3n produce mayor energ\u00EDa cin\u00E9tica?',
  options: [
    'Poca masa y poca velocidad.',
    'Poca masa y mucha velocidad.',
    'Masa moderada y velocidad moderada.',
    'Mucha masa y mucha velocidad.',
  ],
  correctIndex: 3,
  feedback: {
    success: 'Correcto.\n\nLa energ\u00EDa cin\u00E9tica es mayor cuando tanto la masa como la velocidad son grandes.\n\nLa corriente del r\u00EDo se ha activado.',
    error: 'Incorrecto.\n\nLa energ\u00EDa cin\u00E9tica depende de dos factores: la masa y la velocidad. Ambos deben ser grandes para obtener la m\u00E1xima energ\u00EDa.',
  },
}
