import type { MultipleChoiceActivity } from '@/types/activity'

export const activity02: MultipleChoiceActivity = {
  id: 'activity-02',
  type: 'multiple-choice',
  title: 'Molino Experimental',
  instruction: 'Compara los objetos y selecciona cu\u00E1l posee mayor energ\u00EDa cin\u00E9tica.',
  question: '\u00BFCu\u00E1l de los siguientes objetos posee mayor energ\u00EDa cin\u00E9tica?',
  options: [
    'Una bicicleta lenta.',
    'Un autom\u00F3vil r\u00E1pido.',
    'Una roca inm\u00F3vil.',
    'Una caja detenida.',
  ],
  correctIndex: 1,
  feedback: {
    success: 'Correcto.\n\nLa energ\u00EDa cin\u00E9tica aumenta cuando existe mayor velocidad y masa.\n\nEl molino comienza a girar.',
    error: 'Incorrecto.\n\nRecuerda que a mayor velocidad y masa, mayor energ\u00EDa cin\u00E9tica.',
  },
}
