# Sales Scoreboard — Integration Handoff (Vue 3 + Vite + TypeScript)

Stack: Vue 3, Vite, TypeScript, Sass  
Goal: Hand off a clean, production‑ready front‑end to backend engineers for wiring real APIs (auth, scoreboard data, groups, live events).  
Status: Mock services are enabled by default. Integration points are annotated with `INTEGRATION NOTE` in code.

## Quick Start
```bash
npm i
npm run dev
# build
npm run build
```

### Environment
| Variable | Example | Description |
|---|---|---|
| `VITE_USE_MOCK` | `true` / `false` | Switches all services between mock and HTTP |
| `VITE_API_BASE_URL` | `https://api.yourdomain.com` | Base URL for HTTP services |

`.env.development`:
```
VITE_USE_MOCK=true
VITE_API_BASE_URL=http://localhost:3000
```
`.env.production`:
```
VITE_USE_MOCK=false
VITE_API_BASE_URL=https://api.yourdomain.com
```

## Project Structure (key files)
See `src/` for: pages (`Login.vue`, `Scoreboard.vue`), UI components, services (auth, scoreboard, groups), and composables.

## UI & Layout
- Stage 960×540 uses **fit scaling**: `s = min(window.innerHeight/540, window.innerWidth/960)`; it is centered and fully visible on any desktop/TV. Full‑screen background lives outside the stage.
- Table: max 7 rows, column widths per design. Totals footer and floating Total pill are included.
- Grouping: checkboxes when Grouping ON, group creation (prompt for name), aggregated row with Ungroup action.
- Sound: Select Melody modal, volume toggle, persisted in `localStorage`.
- Deposit notifier: auto‑hide after 5000ms, plays selected melody if enabled.

## API Contracts
- Auth: `checkTwoFA`, `login`, `logout` with DTOs and error mapping in `services/auth.ts` and `services/types.ts`.
- Scoreboard: DTOs and service in `services/scoreboard/**`, mapping to UI rows in `mappers/scoreboard.ts`.
- Groups: CRUD service in `services/groups/**` used by `useScoreboard.ts`.
- Optional SSE/WebSocket for deposit events: skeleton provided.

## Mocks vs HTTP (Dependency Injection)
Set in `env.ts` and `main.ts`:
- `VITE_USE_MOCK=true` → mock services
- `VITE_USE_MOCK=false` + `VITE_API_BASE_URL` → HTTP services

## Business Rules
- Tabs Sales/Retention persist in URL (`?tab=sales|retention`).
- Aggregated group row sums numeric fields and inserts at first member position.
- Totals footer computes sums from `visibleRows` (can be switched to backend totals).

## Assets
Place under `src/assets/`:
- Backgrounds: `bg-gradient.svg`, `bg-blur-modal.svg`, `bg-blur-table.svg`, `bg-blur-widget.svg`
- Icons: `Icon-*.svg` (including `Icon-volume-off.svg`)
- Sounds: `sounds/fanfare.97ad99f4.wav`, `sounds/herecomes.a0e1aefc.mp3`, `sounds/pimp.22249497.mp3`
