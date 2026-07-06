import type { BossQuizActivity } from '@/types/activity'

export const activity09: BossQuizActivity = {
  id: 'activity-09',
  type: 'boss-quiz',
  title: 'Desafío Relámpago',
  instruction: 'RESPONDE RÁPIDO',
  questions: [
    {
      question: '¿Qué magnitud física es directamente proporcional a la energía cinética?',
      options: ['La altura', 'La masa', 'El tiempo', 'La temperatura'],
      correctIndex: 1,
    },
    {
      question: 'Si duplicas la velocidad de un objeto, ¿qué ocurre con su energía cinética?',
      options: ['Se duplica', 'Se cuadruplica', 'Se reduce a la mitad', 'No cambia'],
      correctIndex: 1,
    },
    {
      question: '¿Cuál es la unidad de medida de la energía cinética en el SI?',
      options: ['Watts', 'Newtons', 'Joules', 'Hertz'],
      correctIndex: 2,
    },
    {
      question: 'Un objeto en reposo tiene energía cinética igual a:',
      options: ['Máxima', 'Depende de la masa', 'Cero', 'Infinita'],
      correctIndex: 2,
    },
    {
      question: 'La energía cinética depende de la masa y de la:',
      options: ['Altura', 'Velocidad', 'Presión', 'Densidad'],
      correctIndex: 1,
    },
  ],
  timePerQuestion: 10,
  passThreshold: 3,
  feedback: {
    success: '¡Has demostrado un dominio completo de la energía cinética!\n\nEl núcleo del reactor se estabiliza.',
    error: 'Debes reforzar tus conocimientos.\n\nRevisa los conceptos de energía cinética y vuelve a intentarlo.',
  },
}
