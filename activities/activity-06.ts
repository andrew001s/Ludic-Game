import type { DragOrderActivity } from '@/types/activity'

export const activity06: DragOrderActivity = {
  id: 'activity-06',
  type: 'drag-order',
  title: 'Ciclo Energético',
  instruction: 'Ordena las etapas del ciclo energético completo.',
  question: 'Organiza correctamente las etapas desde la captación hasta el uso final.',
  items: [
    'Captación de energía',
    'Transformación',
    'Distribución',
    'Consumo',
  ],
  correctOrder: [0, 1, 2, 3],
  feedback: {
    success: 'Correcto. El ciclo energético sigue un flujo ordenado.',
    error: 'Revisa el orden del ciclo energético.',
  },
}
