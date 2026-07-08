import type { RobotPathActivity } from '@/types/activity'

export const activity21: RobotPathActivity = {
  id: 'activity-21',
  type: 'robot-path',
  title: 'Circuito Experimental',
  mode: 'magnetic-circuit',
  instruction: 'Selecciona el modulo correcto para el terminal activo. Si encaja magneticamente, se conecta solo y la energia avanza hacia la bombilla.',
  question: 'Cierra el circuito eligiendo el siguiente modulo correcto en cada etapa hasta encender la bombilla.',
  items: ['Fuente', 'Cable conductor', 'Interruptor', 'Bombilla'],
  correctOrder: [0, 1, 2, 3],
  feedback: {
    success: 'Excelente.\n\nEl circuito queda cerrado: la fuente entrega energia, el conductor permite el paso de los electrones, el interruptor habilita el recorrido y la bombilla recibe la corriente.\n\nLa electricidad circula porque ahora existe un circuito conductor completo y continuo.',
    error: 'Aun no.\n\nLa electricidad necesita un recorrido completo desde la fuente hasta la bombilla. Revisa el orden del circuito y vuelve a intentarlo.',
  },
}
