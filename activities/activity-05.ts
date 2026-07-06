import type { FillBlanksActivity } from '@/types/activity'

export const activity05: FillBlanksActivity = {
  id: 'activity-05',
  type: 'fill-blanks',
  title: 'Terminal de Simulaci\u00F3n',
  instruction: 'Completa las oraciones con las palabras clave.',
  text: 'La energ\u00EDa cin\u00E9tica aument\u00F3 porque el ___ y la ___ incrementaron.\n\nLa energ\u00EDa cin\u00E9tica depende del ___ y de la ___.',
  blanks: [
    { placeholder: 'movimiento', index: 0 },
    { placeholder: 'masa', index: 1 },
    { placeholder: 'movimiento', index: 2 },
    { placeholder: 'masa', index: 3 },
  ],
  correctAnswers: ['movimiento', 'masa', 'movimiento', 'masa'],
  feedback: {
    success: 'Correcto.\n\nAl aumentar la velocidad (movimiento) y la masa, la energ\u00EDa cin\u00E9tica se incrementa proporcionalmente.\n\nTerminal de simulaci\u00F3n sincronizada.',
    error: 'Revisa las palabras clave.\n\nPista: la energ\u00EDa cin\u00E9tica depende del movimiento (velocidad) y de la masa.',
  },
}
