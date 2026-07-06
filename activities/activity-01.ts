import type { MultipleChoiceActivity } from '@/types/activity'

export const activity01: MultipleChoiceActivity = {
  id: 'activity-01',
  type: 'multiple-choice',
  title: 'Energía Cinética',
  instruction: 'Analiza la pregunta y selecciona la respuesta correcta.',
  question: '¿Qué es la energía cinética?',
  options: [
    'La energía almacenada en un objeto en reposo',
    'La energía que posee un objeto en movimiento',
    'La energía que viaja a través de cables',
    'La energía liberada por reacciones químicas',
  ],
  correctIndex: 1,
  feedback: {
    success: 'Correcto. La energía cinética es la energía del movimiento.',
    error: 'Incorrecto. La energía cinética depende de la masa y la velocidad del objeto.',
  },
}
