import type { MultipleChoiceActivity } from '@/types/activity'

export const activity03: MultipleChoiceActivity = {
  id: 'activity-03',
  type: 'multiple-choice',
  title: 'Fuentes Renovables',
  instruction: 'Identifica la fuente de energía renovable.',
  question: '¿Cuál de las siguientes es una fuente de energía renovable?',
  options: [
    'Carbón mineral',
    'Gas natural',
    'Energía solar',
    'Petróleo',
  ],
  correctIndex: 2,
  feedback: {
    success: 'Correcto. La energía solar es renovable e inagotable.',
    error: 'Incorrecto. Las fuentes renovables se regeneran naturalmente.',
  },
}
