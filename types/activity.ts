export type ActivityType = 'multiple-choice' | 'drag-order' | 'fill-blanks'

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

export type ActivityConfig =
  | MultipleChoiceActivity
  | DragOrderActivity
  | FillBlanksActivity
