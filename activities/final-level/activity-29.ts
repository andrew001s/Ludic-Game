import type { DragOrderActivity } from '@/types/activity'

export const activity29: DragOrderActivity = {
  id: 'activity-29',
  type: 'drag-order',
  title: 'Ecosistema Inteligente',
  instruction: 'Reconstruye el viaje de la energia dentro del ecosistema para restaurar el segundo pilar del nucleo.',
  question: 'Sigue la energia desde la luz del Sol hasta el movimiento de los seres vivos y su manifestacion final.',
  items: ['Luz solar', 'Fotosintesis', 'Plantas', 'Animales', 'Movimiento', 'Energia cinetica', 'Materia organica'],
  correctOrder: [0, 1, 2, 6, 3, 4, 5],
  feedback: {
    success: 'Excelente.\n\nSeguiste el camino completo: la luz solar impulsa la fotosintesis, las plantas almacenan energia en materia organica, los animales la aprovechan y el movimiento la expresa como energia cinetica.\n\nEl segundo pilar energetico se activa.',
    error: 'Todavia no.\n\nRecuerda que la energia entra como luz, se transforma en alimento, pasa entre seres vivos y finalmente se manifiesta en el movimiento.',
  },
}
