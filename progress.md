Original prompt: usa estas skills para mejorar el lock indicator, que no muestre un cuadro con texto hazle algo a los estiloos del elemento perce

## Updates

- Replaced the visible locked text box with object-level locked styling in `InteractiveObject`.
- Locked objects now stay visible with dimmed filters, subtle scan lines, and inset shadow treatment.
- Removed the unused `lockedBy` prop from `SceneEngine`.
- Ran focused ESLint on `components/game/SceneEngine/InteractiveObject.tsx` and `components/game/SceneEngine/SceneEngine.tsx`; it passed.

## Notes

- The `develop-web-game` Playwright client was not available at the default `$CODEX_HOME/skills/develop-web-game/scripts/web_game_playwright_client.js` path.
- The app does not currently expose `window.render_game_to_text` or `window.advanceTime`, so the skill's automated game-observation loop is not wired yet.

- Started Level 1 activity pass: improve robot ordering/flow, terminal visuals/speed feedback, and icon-led activity UI.

- Restored reusable NarraLeaf character sprite motion with soft entry fade and visual-novel breathing for sprites under /assets/sprites/.
