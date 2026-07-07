export interface SpeakerProfile {
  displayName: string
  spriteSrc?: string
  spriteAlt?: string
  spriteClassName?: string
}

export const SPEAKER_PROFILES: Record<string, SpeakerProfile> = {
  KIRA: {
    displayName: 'Dr.Kira Newton',
    spriteSrc: '/assets/sprites/kira.png',
    spriteAlt: 'Dr.Kira Newton',
  },
}

export function getSpeakerProfile(speaker: string): SpeakerProfile {
  return SPEAKER_PROFILES[speaker] ?? { displayName: speaker }
}
