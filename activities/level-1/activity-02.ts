import type { MultipleChoiceActivity } from '@/types/activity'

export const activity02: MultipleChoiceActivity = {
  id: 'activity-02',
  type: 'multiple-choice',
  title: 'Molino Experimental',
  instruction: 'Compara velocidad y movimiento: elige qu\u00E9 objeto producir\u00EDa m\u00E1s energ\u00EDa cin\u00E9tica.',
  question: '\u00BFQu\u00E9 objeto tiene mayor energ\u00EDa cin\u00E9tica en esta escena?',
  options: [
    'Una bicicleta lenta.',
    'Un autom\u00F3vil r\u00E1pido.',
    'Una roca inm\u00F3vil.',
    'Una caja detenida.',
  ],
  correctIndex: 1,
  feedback: {
    success: 'Correcto.\n\nLa energ\u00EDa cin\u00E9tica aumenta cuando existe mayor velocidad y masa.\n\nEl molino comienza a girar.',
    error: 'Incorrecto.\n\nBusca el objeto que se mueve m\u00E1s r\u00E1pido: a mayor velocidad y masa, mayor energ\u00EDa cin\u00E9tica.',
  },
}
