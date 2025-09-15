# Scoreboard (Frontend) — Backend Integration Guide

This document explains how to run the app locally and how the backend should integrate with the frontend. It focuses only on the endpoints, payloads, and wiring you need to provide to plug in a real backend.

---

## Tech stack (quick)
- **Vite + Vue 3 + TypeScript**
- **SCSS** for styles
- No state manager required (simple composables)
- Mock data is built-in for local UI work

---

## Run locally

### 1) Prerequisites
- **Node.js 18+** (recommended: 20+)
- npm or pnpm

### 2) Install & start
```bash
npm install
npm run dev
# open http://localhost:5173
```

### 3) Configure environment (backend URL / mock toggle)

The frontend reads **Vite** env vars (`import.meta.env`). Create `.env.local` in the project root if you don’t have one.

```env
# If set, the frontend will call this backend. Must be reachable from the browser.
VITE_API_BASE_URL=http://localhost:3000

# Set to 0 to disable mocks when API base URL is present.
VITE_USE_MOCK=0
```

> Internally the app uses a tiny `ENV` wrapper. If **`VITE_USE_MOCK=1`** and **`VITE_API_BASE_URL`** is **empty**, UI falls back to the built-in mock service.

---

## What the backend must provide

### 1) `GET /scoreboard` — core endpoint

**Query parameters**
- `tab`: `"sales"` | `"retention"`
- `limit` (optional): integer; how many top rows to return (UI typically asks for 50+ and renders top 7)
- `sort` (optional): `"monthly"` | `"weekly"` | `"daily"` — which revenue field to sort by (desc by default)
- `order` (optional): `"desc"` | `"asc"`

**Response JSON**
```ts
type ScoreTab = 'sales' | 'retention'

type AgentMetricsDTO = {
  agentId: string | number
  agentName: string
  counts:  { daily: number; weekly: number; monthly: number }
  revenue: { daily: number; weekly: number; monthly: number }
  /**
   * Monthly sales goal in USD for this agent (from CRM).
   * If unknown, return null or omit.
   * NOTE: The UI currently displays this value as currency in the “Goal” column.
   */
  goal?: number | null
}

type ScoreboardTotalsDTO = {
  // Totals computed across the FULL dataset that matches filters (not only the limited slice).
  counts:  { daily: number; weekly: number; monthly: number }
  revenue: { daily: number; weekly: number; monthly: number }
  /**
   * Sum of goals across agents that have a numeric goal; null if none present.
   */
  goal?: number | null
}

type ScoreboardResponseDTO = {
  tab: ScoreTab
  rows: AgentMetricsDTO[]          // limited list for the table (e.g., top 50)
  totals: ScoreboardTotalsDTO      // totals over the FULL dataset
}
```

**Rules / expectations**
- **Sorting & limiting happen on the server.** The UI requests a larger `limit` (e.g., 50) and renders the top **7** rows. When agents are grouped in the UI, the frontend computes group aggregates locally using the already-fetched list.
- **Totals must be computed over the full dataset** that matches the query, **not** just the limited `rows` slice. The UI uses these totals for the footer and the top “Total” pill.
- **`goal`** is the **monthly goal in USD** (as entered in CRM). The table displays it as currency. (If you later expose a completion %, we can map it separately.)

### 2) (Optional) Grouping endpoints (if you plan to persist groups)

The UI currently groups agents **locally** and calls a simple service abstraction. If you want server persistence, provide something like:

```http
GET    /groups?tab=sales
POST   /groups  { name: string, tab: 'sales'|'retention', memberAgentIds: (string|number)[] }
DELETE /groups/:id
```

The UI calls these via `src/services/groups` (a thin wrapper). If there is no backend yet, the app still works with local state or mocks.

### 3) (Optional) Deposit overlay trigger

The app shows a **deposit overlay** (with sound) when the page receives a browser event. You can integrate from a WebSocket/bridge by dispatching on `window`:

```js
window.dispatchEvent(new CustomEvent('app:deposit', {
  detail: {
    agentName: 'Admin Admin',  // string
    amount: 1250.75,           // number (USD)
    currency: 'USD'            // optional, defaults to USD
  }
}))
```

- Only **one** overlay is shown at a time; a new event **replaces** the current overlay.
- Sound will not overlap: the player stops any previous channel before playing again.
- The overlay auto-closes after ~8s or on “Close” click.

---

## Where code lives (map for backend devs)

- **Data contracts**: `src/services/scoreboard/types.ts`
- **Score service (HTTP + mock)**: `src/services/scoreboard/service.ts`
  - `createHttpScoreService(baseUrl)` uses `GET /scoreboard`
  - `createMockScoreService()` produces stable fake data for UI
- **Mapper (DTO → UI row)**: `src/mappers/scoreboard.ts`
- **Consumers**
  - Page: `src/pages/Scoreboard.vue`
  - Table: `src/components/scoreboard/ScoreTable.vue`
  - Totals row: `src/components/scoreboard/TotalsRow.vue`
  - Total pill: `src/components/scoreboard/TotalWidget.vue`
- **Deposit overlay** (optional integration)
  - Host: `src/components/overlay/DepositHost.vue`
  - Notice: `src/components/overlay/DepositNotice.vue`
  - Sound: `src/composables/useSound.ts`
  - Overlay gate: `src/composables/useOverlayGate.ts`, `src/composables/overlayGate.ts`

---

## Integration checklist

1. Expose `GET /scoreboard` per contract above.
2. Make sure it’s **CORS-enabled** for the dev origin (e.g., `http://localhost:5173`).
3. Ensure `totals` are computed over the full matching dataset.
4. Return `goal` as the **monthly USD goal** from CRM (or `null` if unknown).
5. Provide stable identifiers (`agentId`), names, and numeric fields.
6. (Optional) Implement groups persistence; otherwise the UI will keep grouping locally.
7. (Optional) Hook your real-time layer to dispatch `app:deposit` events in the browser.

---

## Scripts
```bash
# Dev
npm run dev

# Type check + build
npm run build

# Preview built app
npm run preview
```

If you have any questions while wiring the backend, check `src/services/scoreboard/service.ts` and `src/services/scoreboard/types.ts` first — they are the single source of truth for the expected payloads.
