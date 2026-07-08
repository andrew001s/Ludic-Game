import type { BossQuizActivity } from '@/types/activity'

export const activity31: BossQuizActivity = {
  id: 'activity-31',
  type: 'boss-quiz',
  title: 'NEXUS Ω - Debate Cientifico',
  instruction: 'Responde cientificamente. Cada acierto corrige una parte del nucleo y reduce la distorsion de NEXUS Ω.',
  questions: [
    {
      question: 'Cual afirmacion expresa mejor la Ley de Conservacion de la Energia?',
      options: [
        'La energia no se crea ni se destruye; solo se transforma.',
        'La energia desaparece cuando deja de verse.',
        'La energia solo existe en maquinas.',
        'La energia puede destruirse por completo en una reaccion.',
      ],
      correctIndex: 0,
    },
    {
      question: 'Que ocurre con la materia durante una reaccion quimica?',
      options: [
        'Sus atomos se reorganizan, pero la materia se conserva.',
        'La materia desaparece si hay calor.',
        'La materia deja de existir al romper enlaces.',
        'Solo se conserva si hay electricidad.',
      ],
      correctIndex: 0,
    },
    {
      question: 'Como se le llama a la ley en la que se combina la ley de la conservacion de la materia y la ley de la conservacion de la masa?',
      options: [
        'La ley de conservacion de la masa.',
        'La ley de la gravedad.',
        'La ley de la inercia.',
        'La ley del movimiento uniforme.',
      ],
      correctIndex: 0,
    },
    {
      question: 'Por que no se han detectado los cambios de masa en fenomenos cotidianos?',
      options: [
        'Porque las balanzas analiticas mas sensibles no pueden apreciar una variacion de masa tan pequena.',
        'Porque en la vida cotidiana no existe masa.',
        'Porque la materia deja de transformarse fuera del laboratorio.',
        'Porque la energia impide cualquier medicion.',
      ],
      correctIndex: 0,
    },
    {
      question: 'Cual es un ejemplo cotidiano de transformacion energetica?',
      options: [
        'Una linterna: quimica a electrica y luego luminica.',
        'Una sombra inmovil sobre la pared.',
        'Una piedra quieta sobre el suelo.',
        'Una ventana cerrada sin cambios.',
      ],
      correctIndex: 0,
    },
    {
      question: 'Que demuestra una ecuacion quimica balanceada?',
      options: [
        'Que se conserva la cantidad de atomos de cada elemento.',
        'Que la materia puede desaparecer.',
        'Que la energia se destruye.',
        'Que los productos pesan menos por definicion.',
      ],
      correctIndex: 0,
    },
    {
      question: 'Por que la conservacion de la materia y la energia es fundamental para comprender el universo?',
      options: [
        'Porque permite explicar los cambios sin suponer desapariciones magicas.',
        'Porque evita toda transformacion natural.',
        'Porque demuestra que nada cambia realmente.',
        'Porque solo sirve en laboratorios electricos.',
      ],
      correctIndex: 0,
    },
  ],
  timePerQuestion: 14,
  passThreshold: 6,
  feedback: {
    success: 'Has demostrado que NEXUS Ω estaba equivocado.\n\nLas transformaciones no son un error: son la forma en que la energia y la materia expresan su conservacion.\n\nEl nucleo recupera su estabilidad total.',
    error: 'NEXUS Ω aun conserva dudas.\n\nNecesitas reforzar la relacion entre conservacion, transformacion y equilibrio cientifico.',
  },
}
