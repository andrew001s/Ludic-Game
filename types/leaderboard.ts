export interface LeaderboardPlayer {
  id: string
  playerName: string
  score: number
  level: number
  completedLevels: number
  bestStreak: number
  perfectActivities: number
  totalActivitiesCompleted: number
  createdAt: number
  updatedAt: number
}

export interface LeaderboardResponse {
  players: LeaderboardPlayer[]
  total: number
}

export interface LeaderboardFilters {
  search: string
}

export interface LeaderboardPagination {
  page: number
  pageSize: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}
