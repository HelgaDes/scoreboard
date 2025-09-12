import { http, HttpError } from '@/services/http'
import type { GroupDTO, UpsertGroupInput, ScoreTab } from './types'

export interface GroupService {
    /** Optionally filter by tab (sales | retention). */
    list(tab?: ScoreTab): Promise<GroupDTO[]>
    create(input: UpsertGroupInput): Promise<GroupDTO>
    remove(id: string): Promise<void>
}

export function createHttpGroupService(baseUrl: string): GroupService {
    const api = (p: string) => baseUrl.replace(/\/$/, '') + p
    return {
        async list(tab) {
            const path = tab ? `/groups?tab=${encodeURIComponent(tab)}` : '/groups'
            return http<GroupDTO[]>(api(path))
        },
        async create(input) {
            return http<GroupDTO>(api('/groups'), {
                method: 'POST',
                body: JSON.stringify(input),
            })
        },
        async remove(id) {
            try {
                await http<void>(api(`/groups/${id}`), { method: 'DELETE' })
            } catch (e) {
                if (e instanceof HttpError) throw new Error(`Group delete ${e.status}`)
                throw e
            }
        },
    }
}

export function createMockGroupService(): GroupService {
    const store = new Map<string, GroupDTO>()
    return {
        async list(tab) {
            const all = Array.from(store.values())
            return tab ? all.filter(g => g.tab === tab) : all
        },
        async create(input) {
            const id = `g_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
            const g: GroupDTO = {
                id,
                name: input.name,
                memberAgentIds: [...input.memberAgentIds],
                tab: input.tab,
            }
            store.set(id, g)
            return g
        },
        async remove(id) {
            store.delete(id)
        },
    }
}
