// Core tabs used by the scoreboard.
export type ScoreTab = 'sales' | 'retention'

/** Public query accepted by the API/service. */
export type ScoreboardQuery = {
    tab: ScoreTab
    limit?: number
    sort?: 'monthly' | 'weekly' | 'daily'
    order?: 'desc' | 'asc'
}

/** Per-agent metrics returned by the backend. */
export type AgentMetricsDTO = {
    agentId: string | number
    agentName: string
    counts: { daily: number; weekly: number; monthly: number }
    revenue: { daily: number; weekly: number; monthly: number }
    goal?: number | null
}

/** Aggregated totals over the FULL dataset (not only the limited slice). */
export type ScoreboardTotalsDTO = {
    counts: { daily: number; weekly: number; monthly: number }
    revenue: { daily: number; weekly: number; monthly: number }
    goal?: number | null
}

/**
 * API response: limited rows for display + full totals for badges/summary.
 * `totals` is always present (backend always returns it).
 */
export type ScoreboardResponseDTO = {
    tab: ScoreTab
    rows: AgentMetricsDTO[]
    totals: ScoreboardTotalsDTO
}

/**
 * Real-time deposit event used by the notifier/toast system.
 * The project doesn’t use it yet; we keep the type for upcoming features.
 * Suppress “unused” warnings in IDE and ESLint for now.
 */
// noinspection JSUnusedGlobalSymbols
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type DepositEventDTO = {
    type: 'deposit'
    agentId: string | number
    agentName: string
    amount: number
    currency?: string
    at?: string
}

/** Score service contract used by the app. */
export interface ScoreService {
    getScoreboard(q: ScoreboardQuery): Promise<ScoreboardResponseDTO>
}

