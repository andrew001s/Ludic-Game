import type { FillBlanksActivity } from '@/types/activity'

export const activity04: FillBlanksActivity = {
  id: 'activity-04',
  type: 'fill-blanks',
  title: 'Completa el Circuito',
  instruction: 'Completa las oraciones con las palabras correctas.',
  text: 'La corriente eléctrica fluye a través de un ___.\n\nEl ___ convierte la energía eléctrica en luz.\n\nEl ___ controla el flujo de corriente.',
  blanks: [
    { placeholder: 'conductor', index: 0 },
    { placeholder: 'foco', index: 1 },
    { placeholder: 'interruptor', index: 2 },
  ],
  correctAnswers: ['conductor', 'foco', 'interruptor'],
  feedback: {
    success: 'Correcto. Has completado correctamente el circuito eléctrico.',
    error: 'Algunas respuestas no son correctas. Revisa los términos.',
  },
}
