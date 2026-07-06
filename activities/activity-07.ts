import type { MultipleChoiceActivity } from '@/types/activity'

export const activity07: MultipleChoiceActivity = {
  id: 'activity-07',
  type: 'multiple-choice',
  title: 'El Legado',
  instruction: 'Demuestra tu comprensión final.',
  question: '¿Cuál es la principal razón por la que debemos entender las transformaciones de la energía?',
  options: [
    'Para construir máquinas más grandes',
    'Para preservar el equilibrio del planeta',
    'Para gastar más energía',
    'Para almacenar energía indefinidamente',
  ],
  correctIndex: 1,
  feedback: {
    success: 'Exacto. Comprender la energía nos permite proteger el equilibrio del planeta.',
    error: 'Reflexiona sobre la importancia de la energía en nuestra vida.',
  },
}
