import type { MultipleChoiceActivity } from '@/types/activity'

export const activity05: MultipleChoiceActivity = {
  id: 'activity-05',
  type: 'multiple-choice',
  title: 'Conservación',
  instruction: 'Aplica el principio de conservación.',
  question: 'Según el principio de conservación de la energía, ¿qué sucede con la energía cuando un objeto cae?',
  options: [
    'La energía se destruye al impactar',
    'Se transforma de potencial a cinética',
    'Desaparece gradualmente',
    'Se convierte en masa',
  ],
  correctIndex: 1,
  feedback: {
    success: 'Correcto. La energía potencial se transforma en cinética durante la caída.',
    error: 'Incorrecto. Recuerda que la energía no se destruye, solo se transforma.',
  },
}
