import type { StoryScene } from '@/types/story'

export const STORY_SCENES: StoryScene[] = [
  {
    id: 'scene-1',
    text: 'A\u00F1o 2189.\n\nLa Tierra ya no es el planeta que alguna vez conocimos.\n\nLas ciudades permanecen en silencio...',
    gradient: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 30%, #16213e 60%, #0f3460 100%)',
    overlayColor: 'rgba(0, 20, 10, 0.4)',
    duration: 6000,
  },
  {
    id: 'scene-2',
    text: 'Nadie recuerda exactamente qu\u00E9 ocurri\u00F3.\n\nSolo existe un nombre...\n\nEL COLAPSO.',
    gradient: 'linear-gradient(180deg, #0d0d0d 0%, #1a0a0a 30%, #2d1b00 60%, #1a1a0a 100%)',
    overlayColor: 'rgba(30, 10, 0, 0.5)',
    duration: 6000,
  },
  {
    id: 'scene-3',
    text: 'Las transformaciones de la energ\u00EDa dejaron de comportarse como antes.',
    gradient: 'linear-gradient(180deg, #050510 0%, #0a0a2e 30%, #0d1b2a 60%, #1b2838 100%)',
    overlayColor: 'rgba(0, 10, 30, 0.4)',
    duration: 5000,
  },
  {
    id: 'scene-4',
    text: '"Las transformaciones han sido alteradas.\n\nEl equilibrio ha desaparecido."',
    gradient: 'linear-gradient(180deg, #0a0500 0%, #1a0a00 30%, #2d1300 60%, #1a0a00 100%)',
    overlayColor: 'rgba(40, 20, 0, 0.3)',
    duration: 5000,
  },
  {
    id: 'scene-5',
    text: 'Un grupo de j\u00F3venes cient\u00EDficos ha sido seleccionado para restaurar el equilibrio.',
    gradient: 'linear-gradient(180deg, #050a05 0%, #0a1a0a 30%, #0d2d0d 60%, #051a05 100%)',
    overlayColor: 'rgba(0, 30, 10, 0.4)',
    duration: 5000,
  },
  {
    id: 'scene-6',
    text: 'Algo contin\u00FAa observando...',
    gradient: 'linear-gradient(180deg, #000000 0%, #050a05 30%, #001a0a 60%, #000d05 100%)',
    overlayColor: 'rgba(0, 50, 20, 0.2)',
    duration: 6000,
  },
  {
    id: 'scene-final',
    text: 'EXPEDICI\u00D3N CIENT\u00CDFICA\n\nGuardianes de la Conservaci\u00F3n\n\n\nTu expedici\u00F3n est\u00E1 a punto de comenzar.',
    gradient: 'linear-gradient(180deg, #050805 0%, #0a1a0a 20%, #0d2d0d 50%, #061a06 80%, #020502 100%)',
    overlayColor: 'rgba(0, 40, 15, 0.3)',
    duration: 8000,
  },
]
