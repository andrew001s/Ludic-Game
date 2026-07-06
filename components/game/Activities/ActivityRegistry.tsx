'use client'

import type { ActivityConfig, ActivityType } from '@/types/activity'
import { MultipleChoiceActivity } from './MultipleChoiceActivity'
import { DragOrderActivity } from './DragOrderActivity'
import { FillBlanksActivity } from './FillBlanksActivity'

interface ActivityRendererProps {
  activity: ActivityConfig
  onComplete: () => void
}

const registry: Record<ActivityType, React.ComponentType<{ activity: ActivityConfig; onComplete: () => void }>> = {
  'multiple-choice': MultipleChoiceActivity,
  'drag-order': DragOrderActivity,
  'fill-blanks': FillBlanksActivity,
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
