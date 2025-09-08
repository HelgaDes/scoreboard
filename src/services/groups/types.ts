import type { ScoreTab } from '@/services/scoreboard/types'

export type GroupDTO = {
    id: string
    name: string
    memberAgentIds: Array<string | number>
    tab: ScoreTab
}

export type CreateGroupDTO = {
    name: string
    memberAgentIds: Array<string | number>
    tab: ScoreTab
}

export interface GroupService {
    /** List groups for a given tab */
    list(tab: ScoreTab): Promise<GroupDTO[]>
    /** Create a new group */
    create(input: CreateGroupDTO): Promise<GroupDTO>
    /** Remove by id */
    remove(id: string): Promise<void>
}

