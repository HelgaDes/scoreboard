import type { AgentMetricsDTO } from '@/services/scoreboard/types'

export type UIRow = { id: string|number; agent: string; a1?: number|string; daily?: number; a2?: number|string; weekly?: number; a3?: number|string; monthly?: number; goal?: number|string }

export function toRow(a: AgentMetricsDTO): UIRow {
  return {
    id: a.agentId,
    agent: a.agentName,
    a1: a.counts.daily,
    daily: a.revenue.daily,
    a2: a.counts.weekly,
    weekly: a.revenue.weekly,
    a3: a.counts.monthly,
    monthly: a.revenue.monthly,
    goal: a.goal ?? '-',
  }
}
