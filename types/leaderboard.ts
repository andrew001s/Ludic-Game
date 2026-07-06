export interface LeaderboardPlayer {
  id: string
  playerName: string
  score: number
  level: number
  createdAt: number
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
