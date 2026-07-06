export interface Area {
  x: number
  y: number
  width: number
  height: number
}

export interface InteractiveObjectConfig {
  id: string
  type: string
  title: string
  area: Area
  unlockAfter: string | null
  activityId: string
}

export interface DialogueLine {
  speaker: string
  text: string
}

export interface LevelConfig {
  id: string
  title: string
  background: string
  character: string
  introduction: DialogueLine[]
  completionDialogue: DialogueLine[]
  nextLevel: string | null
  interactiveObjects: InteractiveObjectConfig[]
}
