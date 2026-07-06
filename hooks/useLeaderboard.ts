'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { getLeaderboard, searchLeaderboard } from '@/services/leaderboard.service'
import type { LeaderboardPlayer, LeaderboardPagination } from '@/types/leaderboard'

const PAGE_SIZE = 10

export interface UseLeaderboardReturn {
  players: LeaderboardPlayer[]
  loading: boolean
  error: string | null
  search: string
  pagination: LeaderboardPagination
  setSearch: (search: string) => void
  nextPage: () => void
  previousPage: () => void
  retry: () => void
}

export function useLeaderboard(): UseLeaderboardReturn {
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([])
  const [allPlayers, setAllPlayers] = useState<LeaderboardPlayer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const pageRef = useRef(page)
  pageRef.current = page

  const totalPages = useMemo(() => Math.max(1, Math.ceil(allPlayers.length / PAGE_SIZE)), [allPlayers.length])
  const hasNext = page < totalPages
  const hasPrevious = page > 1

  const applyPagination = useCallback((data: LeaderboardPlayer[], targetPage: number): LeaderboardPlayer[] => {
    const start = (targetPage - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    return data.slice(start, end)
  }, [])

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getLeaderboard()
      setAllPlayers(response.players)
      setPlayers(applyPagination(response.players, 1))
      setPage(1)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load leaderboard'
      setError(message)
      setPlayers([])
      setAllPlayers([])
    } finally {
      setLoading(false)
    }
  }, [applyPagination])

  useEffect(() => {
    fetchLeaderboard()
  }, [fetchLeaderboard])

  useEffect(() => {
    if (!search.trim()) {
      setAllPlayers((prev) => {
        setPlayers(applyPagination(prev, 1))
        return prev
      })
      setPage(1)
      return
    }

    const performSearch = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await searchLeaderboard({ search })
        setAllPlayers(response.players)
        setPlayers(applyPagination(response.players, 1))
        setPage(1)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Search failed'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    performSearch()
  }, [search, applyPagination])

  const nextPage = useCallback(() => {
    if (!hasNext) return
    const next = page + 1
    setPlayers(applyPagination(allPlayers, next))
    setPage(next)
  }, [hasNext, page, allPlayers, applyPagination])

  const previousPage = useCallback(() => {
    if (!hasPrevious) return
    const prev = page - 1
    setPlayers(applyPagination(allPlayers, prev))
    setPage(prev)
  }, [hasPrevious, page, allPlayers, applyPagination])

  const retry = useCallback(() => {
    fetchLeaderboard()
  }, [fetchLeaderboard])

  return {
    players,
    loading,
    error,
    search,
    pagination: useMemo(
      () => ({
        page,
        pageSize: PAGE_SIZE,
        totalPages,
        hasNext,
        hasPrevious,
      }),
      [page, totalPages, hasNext, hasPrevious],
    ),
    setSearch,
    nextPage,
    previousPage,
    retry,
  }
}
