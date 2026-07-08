import type { SliderActivity } from '@/types/activity'

export const activity14: SliderActivity = {
  id: 'activity-14',
  type: 'slider',
  title: 'Simulador de Gravedad',
  instruction: 'Sube la caja con el deslizador hasta 60 m. Observa como aumentan la altura y la energia potencial.',
  question: 'Lleva la caja a 60 m de altura para estabilizar el simulador gravitacional.',
  label: 'Altura',
  min: 0,
  max: 100,
  step: 1,
  correctValue: 60,
  tolerance: 5,
  unit: 'm',
  feedback: {
    success: 'Correcto.\n\nAl aumentar la altura, la caja almacena mas energia potencial gravitacional. Se cumple Ep = m x g x h: si la masa y la gravedad se mantienen, al subir la altura tambien sube la energia almacenada.\n\nEl simulador de gravedad se estabiliza.',
    error: 'Aun no esta en la altura objetivo.\n\nSigue ajustando el deslizador hasta acercarte a 60 m. Recuerda: a mayor altura, mayor energia potencial gravitacional.',
  },
}
