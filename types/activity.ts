export type ActivityType = 'multiple-choice' | 'drag-order' | 'fill-blanks' | 'slider' | 'boss-quiz' | 'robot-path'

export interface ActivityFeedback {
  success: string
  error: string
}

export interface MultipleChoiceActivity {
  id: string
  type: 'multiple-choice'
  title: string
  instruction: string
  question: string
  options: string[]
  correctIndex: number
  feedback: ActivityFeedback
}

export interface DragOrderActivity {
  id: string
  type: 'drag-order'
  title: string
  instruction: string
  question: string
  items: string[]
  correctOrder: number[]
  feedback: ActivityFeedback
}

export interface FillBlanksActivity {
  id: string
  type: 'fill-blanks'
  title: string
  instruction: string
  text: string
  blanks: { placeholder: string; index: number }[]
  correctAnswers: string[]
  feedback: ActivityFeedback
}

export interface SliderActivity {
  id: string
  type: 'slider'
  title: string
  instruction: string
  question: string
  label: string
  min: number
  max: number
  step: number
  correctValue: number
  tolerance: number
  unit: string
  feedback: ActivityFeedback
}

export interface BossQuizQuestion {
  question: string
  options: string[]
  correctIndex: number
}

export interface BossQuizActivity {
  id: string
  type: 'boss-quiz'
  title: string
  instruction: string
  questions: BossQuizQuestion[]
  timePerQuestion: number
  passThreshold: number
  feedback: ActivityFeedback
}

export interface RobotPathActivity {
  id: string
  type: 'robot-path'
  title: string
  instruction: string
  question: string
  items: string[]
  correctOrder: number[]
  feedback: ActivityFeedback
}

export type ActivityConfig =
  | MultipleChoiceActivity
  | DragOrderActivity
  | FillBlanksActivity
  | SliderActivity
  | BossQuizActivity
  | RobotPathActivity
