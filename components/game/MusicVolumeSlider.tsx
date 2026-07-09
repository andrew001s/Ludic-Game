'use client'

import { useMemo } from 'react'
import { Volume1, Volume2, VolumeX } from 'lucide-react'
import { useAudio } from '@/hooks/useAudio'

function getVolumeLabel(volume: number) {
  if (volume <= 0) return 'Off'
  if (volume < 0.35) return 'Bajo'
  if (volume < 0.7) return 'Medio'
  return 'Alto'
}

export function MusicVolumeSlider() {
  const { musicVolume, setMusicVolume } = useAudio()
  const fillPercent = Math.round(musicVolume * 100)

  const Icon = useMemo(() => {
    if (musicVolume <= 0) return VolumeX
    if (musicVolume < 0.35) return Volume1
    return Volume2
  }, [musicVolume])

  return (
    <div
      className="inline-flex items-center gap-3 border px-3 py-2"
      style={{
        borderColor: 'rgba(183, 209, 103, 0.28)',
        color: '#dfe9ae',
        backgroundColor: 'rgba(7, 18, 14, 0.62)',
        fontFamily: '"Courier New", monospace',
        textShadow: '1px 1px 0 #050603',
      }}
    >
      <Icon size={14} aria-hidden="true" />

      <div className="flex min-w-[120px] flex-col gap-1">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em]">
          <span>Música</span>
          <span>{getVolumeLabel(musicVolume)}</span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={fillPercent}
          onChange={(event) => setMusicVolume(Number(event.target.value) / 100)}
          aria-label="Volumen de la música"
          className="music-volume-slider h-2 w-full cursor-pointer appearance-none rounded-full"
          style={{
            background: `linear-gradient(90deg, #a3e635 0%, #d9f99d ${fillPercent}%, rgba(163, 230, 53, 0.16) ${fillPercent}%, rgba(163, 230, 53, 0.16) 100%)`,
          }}
        />
      </div>
    </div>
  )
}
