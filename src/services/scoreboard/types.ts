export type ScoreTab = 'sales' | 'retention'

export type ScoreboardQuery = {
  tab: ScoreTab
  limit?: number
  sort?: 'monthly' | 'weekly' | 'daily'
  order?: 'desc' | 'asc'
}

export type AgentMetricsDTO = {
  agentId: string | number
  agentName: string
  counts: { daily: number; weekly: number; monthly: number }
  revenue: { daily: number; weekly: number; monthly: number }
  goal?: number | null
}

export type ScoreboardTotalsDTO = {
  counts: { daily: number; weekly: number; monthly: number }
  revenue: { daily: number; weekly: number; monthly: number }
  goal?: number | null
}

export type ScoreboardResponseDTO = {
  tab: ScoreTab
  rows: AgentMetricsDTO[]
  totals?: ScoreboardTotalsDTO
}

export type DepositEventDTO = {
  type: 'deposit'
  agentId: string | number
  agentName: string
  amount: number
  currency?: string
  at?: string
}
