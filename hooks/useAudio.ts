'use client'

import { useCallback, useEffect } from 'react'

type SfxType = 'hover' | 'click' | 'confirm' | 'back'
export type MusicTrack =
  | 'menu'
  | 'intro'
  | 'level-1'
  | 'level-2'
  | 'level-3'
  | 'level-4'
  | 'level-5'
  | 'level-6'

export function isMusicTrack(value: string): value is MusicTrack {
  return value in MUSIC_TRACKS
}

const MUSIC_TRACKS: Record<MusicTrack, string> = {
  menu: '/music/start.mp3',
  intro: '/music/intro.mp3',
  'level-1': '/music/level1.mp3',
  'level-2': '/music/level2.mp3',
  'level-3': '/music/level3.mp3',
  'level-4': '/music/level4.mp3',
  'level-5': '/music/level5.mp3',
  'level-6': '/music/level6.mp3',
}

// Module-level singletons — shared across all hook instances
let ctx: AudioContext | null = null
let music: HTMLAudioElement | null = null
let isPlaying = false
let instanceCount = 0
let retryListenerAttached = false
let currentTrack: MusicTrack = 'menu'

function getCtx(): AudioContext {
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    ctx = new Ctor()
  }
  return ctx
}

function playNote(freq: number, duration: number, type: OscillatorType = 'square', volume = 0.06) {
  try {
    const c = getCtx()
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = type
    osc.frequency.value = freq
    gain.gain.setValueAtTime(volume, c.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration)
    osc.connect(gain)
    gain.connect(c.destination)
    osc.start(c.currentTime)
    osc.stop(c.currentTime + duration)
  } catch {
    // Audio not available
  }
}

export function useAudio() {
  const ensureMusic = useCallback((track: MusicTrack = currentTrack) => {
    if (!music) {
      music = new Audio(MUSIC_TRACKS[track])
      music.loop = true
      music.volume = 0.4
    }
    return music
  }, [])

  const startMusic = useCallback((track: MusicTrack = currentTrack) => {
    const nextSrc = MUSIC_TRACKS[track]
    const player = ensureMusic(track)
    currentTrack = track

    if (player.src !== new URL(nextSrc, window.location.origin).href) {
      player.src = nextSrc
      player.load()
      isPlaying = false
    }

    if (isPlaying) return
    isPlaying = true
    player.currentTime = 0
    player.play().catch(() => {
      isPlaying = false
    })
  }, [ensureMusic])

  const stopMusic = useCallback(() => {
    isPlaying = false
    if (music) {
      music.pause()
      music.currentTime = 0
    }
  }, [])

  const setMusicTrack = useCallback(
    (track: MusicTrack) => {
      currentTrack = track
      const player = ensureMusic(track)
      const nextSrc = MUSIC_TRACKS[track]
      const resolvedSrc = new URL(nextSrc, window.location.origin).href

      if (player.src !== resolvedSrc) {
        player.src = nextSrc
        player.load()
        isPlaying = false
      }

      startMusic(track)
    },
    [ensureMusic, startMusic],
  )

  const playSFX = useCallback((type: SfxType) => {
    try {
      const c = getCtx()
      if (c.state === 'suspended') c.resume()

      switch (type) {
        case 'hover':
          playNote(880, 0.04, 'square', 0.02)
          break
        case 'click':
          playNote(660, 0.06, 'square', 0.05)
          setTimeout(() => playNote(990, 0.08, 'square', 0.05), 60)
          break
        case 'confirm':
          playNote(523, 0.1, 'square', 0.06)
          setTimeout(() => playNote(659, 0.1, 'square', 0.06), 100)
          setTimeout(() => playNote(784, 0.2, 'square', 0.06), 200)
          break
        case 'back':
          playNote(440, 0.06, 'square', 0.04)
          setTimeout(() => playNote(330, 0.1, 'square', 0.04), 60)
          break
      }
    } catch {
      // Audio not available
    }
  }, [])

  const initAudio = useCallback(async () => {
    try {
      const c = getCtx()
      if (c.state === 'suspended') await c.resume()
    } catch {
      // AudioContext not available
    }
    startMusic(currentTrack)
  }, [startMusic])

  // Reference counting — only the first mount initializes, only the last unmount stops
  useEffect(() => {
    instanceCount++

    if (instanceCount === 1) {
      initAudio()

      if (!retryListenerAttached) {
        retryListenerAttached = true
        const retry = () => {
          if (ctx?.state === 'suspended') ctx.resume()
          startMusic()
        }
        window.addEventListener('click', retry, { once: true })
        window.addEventListener('keydown', retry, { once: true })
      }
    }

    return () => {
      instanceCount--
      if (instanceCount <= 0) {
        instanceCount = 0
        stopMusic()
      }
    }
  }, [initAudio, startMusic, stopMusic])

  return { playSFX, initAudio, startMusic, stopMusic, setMusicTrack }
}
