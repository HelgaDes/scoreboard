import { http, HttpError } from '@/services/http'
import type { ScoreboardQuery, ScoreboardResponseDTO, AgentMetricsDTO, ScoreTab } from './types'

export interface ScoreService {
  getScoreboard(q: ScoreboardQuery): Promise<ScoreboardResponseDTO>
}

export function createHttpScoreService(baseUrl: string): ScoreService {
  const api = (p: string) => baseUrl.replace(/\/$/, '') + p
  return {
    async getScoreboard(q) {
      try {
        const url = new URL(api('/scoreboard'), window.location.origin)
        url.searchParams.set('tab', q.tab)
        if (q.limit) url.searchParams.set('limit', String(q.limit))
        if (q.sort) url.searchParams.set('sort', q.sort)
        if (q.order) url.searchParams.set('order', q.order)
        return await http<ScoreboardResponseDTO>(url.toString())
      } catch (e) {
        if (e instanceof HttpError) throw new Error(`Scoreboard HTTP ${e.status}`)
        throw new Error('Scoreboard fetch failed')
      }
    },
  }
}

export function createMockScoreService(): ScoreService {
  const data: Record<ScoreTab, ScoreboardResponseDTO> = {
    sales: {
      tab: 'sales',
      rows: [
        row('1', 'Admin Admin', 1, 0, 0, 222, 0, 2033404.9, null),
        row('2', 'Lia Delough', 0, 0, 0, 0, 0, 1010002, null),
        row('3', 'Pine Apple', 0, 0, 0, 0, 0, 60764.4, null),
        row('4', 'Jeff Jonson', 0, 0, 0, 0, 0, 41652.81, null),
        row('5', 'Freya Admin', 0, 0, 0, 0, 0, 4500, null),
        row('6', 'Olivia Agent', 0, 0, 0, 0, 0, 400, null),
        row('7', 'Jane Test', 0, 0, 0, 0, 0, 200, null),
      ],
    },
    retention: {
      tab: 'retention',
      rows: [
        row('8', 'Retain Bot', 0, 0, 0, 0, 0, 980000, null),
        row('9', 'Renew King', 0, 0, 0, 0, 0, 120000, null),
      ],
    },
  }
  return {
    async getScoreboard(q) {
      const src = data[q.tab]
      const rows = [...src.rows]
      rows.sort((a, b) => b.revenue.monthly - a.revenue.monthly)
      const limited = rows.slice(0, q.limit ?? 7)
      return { tab: q.tab, rows: limited }
    },
  }

  function row(
    id: string, name: string,
    cD: number, cW: number, cM: number,
    rD: number, rW: number, rM: number,
    goal: number | null,
  ): AgentMetricsDTO {
    return {
      agentId: id, agentName: name,
      counts: { daily: cD, weekly: cW, monthly: cM },
      revenue: { daily: rD, weekly: rW, monthly: rM },
      goal,
    }
  }
}
