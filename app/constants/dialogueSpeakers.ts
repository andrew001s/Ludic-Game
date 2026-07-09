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
  spriteSrc?: string
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

const lumenImage = new NarraLeafImage({
  name: 'Dra. Lumen Solis',
  src: '/assets/sprites/lumen.png',
  zoom: 1,
  position: {
    xalign: 0.5,
    yalign: 0.5,
  },
})

const lumenCharacter = new NarraLeafCharacter('Dra. Lumen Solis')
lumenCharacter.addPortrait(lumenImage)

const voltImage = new NarraLeafImage({
  name: 'Dr. Volt Faraday',
  src: '/assets/sprites/volt.png',
})

const voltCharacter = new NarraLeafCharacter('Dr. Volt Faraday')
voltCharacter.addPortrait(voltImage)

const novaImage = new NarraLeafImage({
  name: 'Dra. Nova Dalton',
  src: '/assets/sprites/nova.png',
  zoom: 0.94,
})

const novaCharacter = new NarraLeafCharacter('Dra. Nova Dalton')
novaCharacter.addPortrait(novaImage)

const nexusImage = new NarraLeafImage({
  name: 'NEXUS Ω',
  src: '/assets/sprites/nexus.png',
  zoom: 0.94,
})

const nexusCharacter = new NarraLeafCharacter('NEXUS Ω')
nexusCharacter.addPortrait(nexusImage)

export const SPEAKER_PROFILES: Record<string, SpeakerProfile> = {
  KIRA: {
    displayName: 'Dr.Kira Newton',
    spriteAlt: 'Dr.Kira Newton',
    spriteSrc: '/assets/sprites/kira.png',
    character: kiraCharacter,
    image: kiraImage,
  },
  LUMEN: {
    displayName: 'Dra. Lumen Solis',
    spriteAlt: 'Dra. Lumen Solis',
    spriteSrc: '/assets/sprites/lumen.png',
    character: lumenCharacter,
    image: lumenImage,
  },
  VEGA: {
    displayName: 'Dr.Atlas Vega',
    spriteAlt: 'Dr.Atlas Vega',
    spriteSrc: '/assets/sprites/atlas.png',
    character: atlasCharacter,
    image: atlasImage,
  },
  VOLT: {
    displayName: 'Dr. Volt Faraday',
    spriteAlt: 'Dr. Volt Faraday',
    spriteSrc: '/assets/sprites/volt.png',
    character: voltCharacter,
    image: voltImage,
  },
  NOVA: {
    displayName: 'Dra. Nova Dalton',
    spriteAlt: 'Dra. Nova Dalton',
    spriteSrc: '/assets/sprites/nova.png',
    character: novaCharacter,
    image: novaImage,
  },
  NEXUS: {
    displayName: 'NEXUS Ω',
    spriteAlt: 'NEXUS Ω',
    spriteSrc: '/assets/sprites/nexus.png',
    character: nexusCharacter,
    image: nexusImage,
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

export function getSpeakerSpriteSrc(profile: SpeakerProfile): string | null {
  return profile.spriteSrc ?? getSpeakerImageSrc(profile)
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
