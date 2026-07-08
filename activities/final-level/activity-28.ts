import type { DragOrderActivity } from '@/types/activity'

export const activity28: DragOrderActivity = {
  id: 'activity-28',
  type: 'drag-order',
  title: 'Cascada de Energia',
  instruction: 'Activa la cascada eligiendo, paso a paso, la energia que sigue en la transformacion.',
  question: 'Comienza con la fuente inicial y completa la ruta hasta que el sistema vuelva a encender su luz.',
  items: ['Quimica', 'Potencial gravitacional', 'Cinetica', 'Electrica', 'Luminica'],
  correctOrder: [0, 1, 2, 3, 4],
  mode: 'guided-energy',
  slotLabels: ['Reserva inicial', 'Altura acumulada', 'Movimiento de caida', 'Generacion del circuito', 'Luz restaurada'],
  itemDescriptions: [
    'La bateria o el combustible guardan energia lista para usarse.',
    'La energia se almacena cuando el agua o una masa sube y queda en altura.',
    'Al caer o moverse, la energia almacenada se convierte en movimiento.',
    'El generador transforma el movimiento en corriente electrica.',
    'La electricidad alimenta la bombilla y la luz reaparece.',
  ],
  itemAccents: ['#f59e0b', '#60a5fa', '#22c55e', '#a78bfa', '#fde047'],
  stepHints: [
    'Empieza con la energia almacenada en una sustancia o bateria.',
    'Despues, esa energia permite elevar o almacenar algo en altura.',
    'Cuando cae o se mueve, aparece la energia del movimiento.',
    'Ese movimiento activa el sistema que produce corriente.',
    'Por ultimo, la corriente enciende la luz.',
  ],
  feedback: {
    success: 'Excelente.\n\nSeguiste toda la cascada: energia quimica, potencial gravitacional, cinetica, electrica y finalmente luminica.\n\nAhora se entiende como la energia cambia de forma sin desaparecer, y el primer pilar energetico se activa.',
    error: 'Todavia no.\n\nObserva que cada forma de energia prepara la siguiente: primero se almacena, luego se eleva, despues se mueve, genera electricidad y termina produciendo luz.',
  },
}
