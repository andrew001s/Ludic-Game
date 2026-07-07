import { Image as NarraLeafImage } from 'narraleaf-react'

interface NarraLeafImageRuntimeState {
  state?: {
    currentSrc?: unknown
  }
}

export interface SpeakerProfile {
  displayName: string
  spriteAlt?: string
  spriteClassName?: string
  image?: NarraLeafImage
}

export const SPEAKER_PROFILES: Record<string, SpeakerProfile> = {
  KIRA: {
    displayName: 'Dr.Kira Newton',
    spriteAlt: 'Dr.Kira Newton',
    image: new NarraLeafImage({
      name: 'Dr.Kira Newton',
      src: '/assets/sprites/kira.png',
      zoom: 1,
      position: {
        xalign: 0.5,
        yalign: 0.5,
      },
    }),
  },
}

export function getSpeakerProfile(speaker: string): SpeakerProfile {
  return SPEAKER_PROFILES[speaker] ?? { displayName: speaker }
}

export function getSpeakerImageSrc(profile: SpeakerProfile): string | null {
  const currentSrc = (profile.image as NarraLeafImageRuntimeState | undefined)?.state?.currentSrc
  return typeof currentSrc === 'string' ? currentSrc : null
}
