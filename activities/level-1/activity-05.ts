import type { SliderActivity } from '@/types/activity'

export const activity05: SliderActivity = {
  id: 'activity-05',
  type: 'slider',
  title: 'Terminal de Simulaci\u00F3n',
  instruction: 'Ajusta el control hasta el valor correcto y observa c\u00F3mo sube la energ\u00EDa.',
  question: 'Un objeto de 10 kg se mueve a 4 m/s. \u00BFCu\u00E1l es su energ\u00EDa cin\u00E9tica? (Ec = ½ × m × v²)',
  label: 'Energ\u00EDa Cin\u00E9tica',
  min: 0,
  max: 160,
  step: 5,
  correctValue: 80,
  tolerance: 5,
  unit: 'J',
  feedback: {
    success: 'Correcto.\n\nEc = ½ × 10 kg × (4 m/s)² = ½ × 10 × 16 = 80 J.\n\nLa barra de energ\u00EDa se estabiliza.',
    error: 'Incorrecto.\n\nRecuerda: Ec = ½ × masa × velocidad².\n\nCalcula ½ × 10 × 4².',
  },
}
