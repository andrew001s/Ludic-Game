# Arquitectura

## Visión general

El juego está construido sobre `Next.js App Router` y una capa cliente que controla la experiencia interactiva.

## Capas principales

### `app/`

- Define layout, metadata, manifest, robots y rutas.
- `app/page.tsx` renderiza el menú principal.
- `app/game/level-x/page.tsx` monta cada nivel.

### `levels/`

- Cada archivo exporta un `LevelConfig`.
- Un nivel define:
  - fondo,
  - personaje,
  - diálogos,
  - siguiente nivel,
  - objetos interactivos y orden de desbloqueo.

### `activities/`

- Contenido declarativo de cada actividad.
- Cada actividad se vincula por `activityId` desde los niveles.

### `components/game/SceneEngine/`

- Renderiza fondo, partículas, objetos interactivos y modales.
- Coordina transición entre exploración, actividad y cierre.

### `hooks/useSceneEngine.ts`

Máquina de estados del nivel:

- `introduction`
- `exploration`
- `activity`
- `completion`

También administra:

- objeto activo,
- objetos completados,
- actividades completadas.

### `lib/scoring.ts`

Calcula:

- score por actividad,
- bonus por velocidad y precisión,
- rachas,
- resumen final del nivel.

### `hooks/useGameSave.ts`

Persistencia local del progreso principal en `localStorage`.

### `components/game/Achievements/AchievementProvider.tsx`

Sistema global de logros:

- evaluación por hitos,
- guardado local,
- cola de notificaciones,
- deduplicación de unlocks.

### `lib/firebase.ts` y `services/`

Separan la infraestructura de la lógica del dominio:

- `player.service.ts` crea jugadores,
- `progress.service.ts` sincroniza progreso,
- `leaderboard.service.ts` consulta ranking,
- `activity.service.ts` y `level.service.ts` actúan como registro central.

## Flujo técnico de un nivel

1. `LevelPageClient` obtiene `LevelConfig`.
2. `SceneEngine` maneja el nivel activo.
3. `useSceneEngine` desbloquea objetos y abre actividades.
4. Cada actividad devuelve `ActivityCompletionMetrics`.
5. `LevelPageClient` resume resultados con `summarizeLevelScore`.
6. Se actualiza `localStorage`.
7. Se evalúan logros.
8. Si Firebase existe, se sincroniza progreso.
9. Se muestra resumen de nivel y se navega al siguiente.

## Integración mobile

- Se usan hints de instalación PWA.
- La detección mobile usa `react-device-detect`.
- Algunos estilos compactos solo se activan cuando el dispositivo es realmente móvil.
