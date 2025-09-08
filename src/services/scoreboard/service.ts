// src/services/scoreboard/service.ts
import { http, HttpError } from '@/services/http'
import type {
    ScoreboardQuery,
    ScoreboardResponseDTO,
    ScoreboardTotalsDTO,
    AgentMetricsDTO,
    ScoreTab,
} from './types'

/** Public contract used by callers. */
export interface ScoreService {
    getScoreboard(q: ScoreboardQuery): Promise<ScoreboardResponseDTO>
}

/* ─────────── Real HTTP service (ONLY /scoreboard) ─────────── */
export function createHttpScoreService(baseUrl: string): ScoreService {
    const api = (p: string) => baseUrl.replace(/\/$/, '') + p
    return {
        async getScoreboard(q) {
            try {
                const url = new URL(api('/scoreboard'), window.location.origin)
                url.searchParams.set('tab', q.tab)
                if (q.limit != null) url.searchParams.set('limit', String(q.limit))
                if (q.sort)         url.searchParams.set('sort',  q.sort)
                if (q.order)        url.searchParams.set('order', q.order)
                return await http<ScoreboardResponseDTO>(url.toString())
            } catch (e) {
                if (e instanceof HttpError) throw new Error(`Scoreboard HTTP ${e.status}`)
                throw new Error('Scoreboard fetch failed')
            }
        },
    }
}

/* ─────────── Mock dataset (stable) ─────────── */
function mulberry32(seed: number): () => number {
    let t = seed >>> 0
    return function () {
        t += 0x6D2B79F5
        let r = Math.imul(t ^ (t >>> 15), 1 | t)
        r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296
    }
}
const round2 = (n: number) => Math.round(n * 100) / 100

const FIRST_NAMES = ['Lia','Olivia','Jane','Mason','Ethan','Noah','Ava','Emma','Lucas','Mia','Sofia','Amelia','Henry','Jack','Leo','Mila','Elena','Aria','Chloe','Nora']
const LAST_NAMES  = ['Delough','Agent','Johnson','Miller','Brown','Davis','Wilson','Taylor','Anderson','Thomas','Jackson','White','Harris','Martin','Thompson','Garcia','Martinez','Robinson','Clark','Lewis']
function makeAgentName(rand: () => number, i: number): string {
    const f = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)]
    const l = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)]
    const maybeSuffix = rand() > 0.93 ? ` ${String(i).padStart(3,'0')}` : ''
    return `${f} ${l}${maybeSuffix}`
}

function makeRows(count: number, seed: number): AgentMetricsDTO[] {
    const rand = mulberry32(seed)
    const rows: AgentMetricsDTO[] = []
    for (let i = 1; i <= count; i++) {
        const skill = rand()
        const heavy = Math.pow(skill, 2.2)

        const cD = Math.max(0, Math.round(heavy * 25 + rand() * 3))
        const cW = Math.max(0, Math.round(cD * (5 * (0.9 + rand() * 0.3))))
        const cM = Math.max(0, Math.round(cW * (4 * (0.9 + rand() * 0.3))))

        const rD = round2(cD * (50 * (0.9 + rand() * 0.3)))
        const rW = round2(cW * (55 * (0.9 + rand() * 0.3)))
        const rM = round2(cM * (60 * (0.9 + rand() * 0.3)))

        rows.push({
            agentId: String(i),
            agentName: makeAgentName(rand, i),
            counts:  { daily: cD, weekly: cW, monthly: cM },
            revenue: { daily: rD, weekly: rW, monthly: rM },
            goal: null, // "unset" by design
        })
    }
    return rows
}

function computeTotals(rows: AgentMetricsDTO[]): ScoreboardTotalsDTO {
    const t: ScoreboardTotalsDTO = {
        counts:  { daily: 0, weekly: 0, monthly: 0 },
        revenue: { daily: 0, weekly: 0, monthly: 0 },
        goal: null,
    }
    let goalSeen = false
    for (const r of rows) {
        t.counts.daily    += Number(r.counts.daily    || 0)
        t.counts.weekly   += Number(r.counts.weekly   || 0)
        t.counts.monthly  += Number(r.counts.monthly  || 0)
        t.revenue.daily   += Number(r.revenue.daily   || 0)
        t.revenue.weekly  += Number(r.revenue.weekly  || 0)
        t.revenue.monthly += Number(r.revenue.monthly || 0)
        if (typeof r.goal === 'number' && Number.isFinite(r.goal)) {
            t.goal = (t.goal ?? 0) + r.goal
            goalSeen = true
        }
    }
    if (!goalSeen) t.goal = null
    return t
}

/** Generates datasets once; returns top-N + totals across ALL rows. */
export function createMockScoreService(): ScoreService {
    const datasets: Record<ScoreTab, AgentMetricsDTO[]> = {
        sales:     makeRows(1000, 1),
        retention: makeRows(600,  2),
    }
    return {
        async getScoreboard(q: ScoreboardQuery): Promise<ScoreboardResponseDTO> {
            const all = [...datasets[q.tab]]
            const sortKey: 'daily' | 'weekly' | 'monthly' = q.sort ?? 'monthly'
            const order = q.order ?? 'desc'
            all.sort((a, b) => {
                const av = a.revenue[sortKey] ?? 0
                const bv = b.revenue[sortKey] ?? 0
                return order === 'asc' ? av - bv : bv - av
            })
            const totals = computeTotals(all)
            const limit  = q.limit ?? 7
            const rows   = all.slice(0, limit)
            return { tab: q.tab, rows, totals }
        },
    }
}




