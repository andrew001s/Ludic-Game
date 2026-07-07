import { Character as NarraLeafCharacter, Image as NarraLeafImage, Sentence as NarraLeafSentence } from 'narraleaf-react'

interface NarraLeafImageRuntimeState {
  state?: {
    currentSrc?: unknown
  }
}

export interface SpeakerProfile {
  displayName: string
  spriteAlt?: string
  spriteClassName?: string
  character?: NarraLeafCharacter
  image?: NarraLeafImage
}

const kiraImage = new NarraLeafImage({
  name: 'Dr.Kira Newton',
  src: '/assets/sprites/kira.png',
  zoom: 1,
  position: {
    xalign: 0.5,
    yalign: 0.5,
  },
})

const kiraCharacter = new NarraLeafCharacter('Dr.Kira Newton')
kiraCharacter.addPortrait(kiraImage)

const atlasImage = new NarraLeafImage({
  name: 'Dr.Atlas Vega',
  src: '/assets/sprites/atlas.png',
  zoom: 1,
  position: {
    xalign: 0.5,
    yalign: 0.5,
  },
})

const atlasCharacter = new NarraLeafCharacter('Dr.Atlas Vega')
atlasCharacter.addPortrait(atlasImage)

export const SPEAKER_PROFILES: Record<string, SpeakerProfile> = {
  KIRA: {
    displayName: 'Dr.Kira Newton',
    spriteAlt: 'Dr.Kira Newton',
    character: kiraCharacter,
    image: kiraImage,
  },
  VEGA: {
    displayName: 'Dr.Atlas Vega',
    spriteAlt: 'Dr.Atlas Vega',
    character: atlasCharacter,
    image: atlasImage,
  },
  SISTEMA: {
    displayName: 'SISTEMA',
    character: new NarraLeafCharacter('SISTEMA'),
  },
}

export function getSpeakerProfile(speaker: string): SpeakerProfile {
  return SPEAKER_PROFILES[speaker] ?? { displayName: speaker }
}

export function getSpeakerImageSrc(profile: SpeakerProfile): string | null {
  const currentSrc = (profile.image as NarraLeafImageRuntimeState | undefined)?.state?.currentSrc
  return typeof currentSrc === 'string' ? currentSrc : null
}

export function getSpeakerImage(profile: SpeakerProfile): NarraLeafImage | null {
  return profile.image ?? null
}

export function getSpeakerCharacter(profile: SpeakerProfile): NarraLeafCharacter {
  if (!profile.character) {
    profile.character = new NarraLeafCharacter(profile.displayName)
  }

  return profile.character
}

export function createSpeakerSentence(profile: SpeakerProfile, text: string): NarraLeafSentence {
  return new NarraLeafSentence(text, {
    character: getSpeakerCharacter(profile),
  })
}
