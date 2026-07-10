# Contribuir a NEXUS Ω

Gracias por ayudar con el proyecto.

## Antes de empezar

- Usa `Node.js 20+`.
- Instala dependencias con `npm install`.
- Crea `.env.local` desde `.env.example` si vas a probar Firebase.

## Flujo recomendado

1. Ejecuta `npm run dev`.
2. Haz cambios pequeños y enfocados.
3. Valida con `npm run build`.
4. Si tocas UI sensible, revisa desktop y mobile.

## Convenciones del proyecto

- Mantén cambios mínimos y consistentes.
- Prefiere arreglar la causa raíz.
- No metas refactors grandes no pedidos.
- Reutiliza servicios, hooks y tipos existentes.
- Mantén el tono visual y naming actual del juego.

## Dónde tocar cada cosa

- `levels/` para contenido de niveles
- `activities/` para contenido educativo
- `components/game/Activities/` para UI de minijuegos
- `hooks/useSceneEngine.ts` para flujo del nivel
- `lib/scoring.ts` para score, bonus y rachas
- `components/game/Achievements/` para logros
- `services/` para integración con Firebase

## Checklist antes de abrir cambios

- El proyecto compila con `npm run build`
- No rompiste rutas del App Router
- No agregaste secretos al repo
- Si agregaste variables nuevas, actualizaste `.env.example`
- Si cambiaste arquitectura o setup, actualizaste `README.md`
