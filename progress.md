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

- Improved ctivity-28 into a guided energy-cascade flow with step hints, per-energy descriptions, visual accents, and auto-complete on correct sequence.
- Extended drag-order activities with optional metadata (mode, slotLabels, itemDescriptions, itemAccents, stepHints) while keeping existing activities compatible.
- Upgraded DragOrderActivity UI with progress state, richer cards, energy-map sidebar, and guided next-step feedback for final-level energy restoration.

- Refactored drag-order into declarative metadata with itemDetails, interactionMode, helper-panel copy, and empty-state messaging.
- Extracted drag-order inference/shuffle helpers to components/game/Activities/dragOrder.shared.ts so the renderer no longer hardcodes domain-specific activity cases.
- Rebuilt ctivity-29 as a guided ecosystem flow with explicit energy-transfer stages, richer hints, and clearer biological roles.
