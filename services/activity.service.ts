import type { ActivityConfig } from '@/types/activity'
import { activity01 } from '@/activities/activity-01'
import { activity02 } from '@/activities/activity-02'
import { activity03 } from '@/activities/activity-03'
import { activity04 } from '@/activities/activity-04'
import { activity05 } from '@/activities/activity-05'
import { activity06 } from '@/activities/activity-06'
import { activity07 } from '@/activities/activity-07'
import { activity08 } from '@/activities/activity-08'
import { activity09 } from '@/activities/activity-09'

const activities: Record<string, ActivityConfig> = {
  'activity-01': activity01,
  'activity-02': activity02,
  'activity-03': activity03,
  'activity-04': activity04,
  'activity-05': activity05,
  'activity-06': activity06,
  'activity-07': activity07,
  'activity-08': activity08,
  'activity-09': activity09,
}

export function getActivityConfig(activityId: string): ActivityConfig | null {
  return activities[activityId] ?? null
}
