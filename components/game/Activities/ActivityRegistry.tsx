'use client'

import type { ActivityComponentProps, ActivityConfig, ActivityType } from '@/types/activity'
import type { ActivityCompletionMetrics } from '@/types/progress'
import { MultipleChoiceActivity } from './MultipleChoiceActivity'
import { DragOrderActivity } from './DragOrderActivity'
import { FillBlanksActivity } from './FillBlanksActivity'
import { SliderActivity } from './SliderActivity'
import { BossQuizActivity } from './BossQuizActivity'
import { RobotPathActivity } from './RobotPathActivity'
import { SimulatorActivity } from './SimulatorActivity'

interface ActivityRendererProps {
  activity: ActivityConfig
  onComplete: (metrics: ActivityCompletionMetrics) => void
}

const registry: Record<ActivityType, React.ComponentType<ActivityComponentProps>> = {
  'multiple-choice': MultipleChoiceActivity,
  'drag-order': DragOrderActivity,
  'fill-blanks': FillBlanksActivity,
  'slider': SliderActivity,
  'boss-quiz': BossQuizActivity,
  'robot-path': RobotPathActivity,
  'simulator': SimulatorActivity,
}

export function ActivityRenderer({ activity, onComplete }: ActivityRendererProps) {
  const Component = registry[activity.type]
  if (!Component) {
    return (
      <div
        className="text-sm"
        style={{ fontFamily: '"Courier New", monospace', color: 'rgba(239, 68, 68, 0.5)' }}
      >
        Actividad desconocida: {activity.type}
      </div>
    )
  }
  return <Component activity={activity} onComplete={onComplete} />
}
