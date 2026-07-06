import type { DragOrderActivity } from '@/types/activity'

export const activity02: DragOrderActivity = {
  id: 'activity-02',
  type: 'drag-order',
  title: 'Transformación de Energía',
  instruction: 'Ordena la secuencia de transformación energética.',
  question: '¿Cuál es el orden correcto de transformación desde la energía solar hasta la eléctrica?',
  items: [
    'Energía Solar',
    'Energía Química',
    'Energía Térmica',
    'Energía Eléctrica',
  ],
  correctOrder: [0, 1, 2, 3],
  feedback: {
    success: 'Correcto. La energía solar se transforma en química, luego térmica y finalmente eléctrica.',
    error: 'Intenta de nuevo. Revisa el orden de las transformaciones.',
  },
}
