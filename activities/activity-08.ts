import type { SliderActivity } from '@/types/activity'

export const activity08: SliderActivity = {
  id: 'activity-08',
  type: 'slider',
  title: 'Ajuste de Energía Cinética',
  instruction: 'Ajusta el valor correcto usando el control deslizante.',
  question: 'Un objeto de 10 kg se mueve a 4 m/s. ¿Cuál es su energía cinética? (Ec = ½ × m × v²)',
  label: 'Energía Cinética (Joules)',
  min: 0,
  max: 160,
  step: 5,
  correctValue: 80,
  tolerance: 5,
  unit: 'J',
  feedback: {
    success: '¡Correcto!\n\nEc = ½ × 10 kg × (4 m/s)² = ½ × 10 × 16 = 80 J',
    error: 'Incorrecto.\n\nRecuerda: Ec = ½ × masa × velocidad²\n\nCalcula: ½ × 10 × 4² = ?',
  },
}
