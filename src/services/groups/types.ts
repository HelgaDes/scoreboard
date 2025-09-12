import type { ScoreTab } from '../scoreboard/types'

/** Server/group DTO used across the app. */
export interface GroupDTO {
    id: string
    name: string
    /** Agent IDs that belong to this group. */
    memberAgentIds: Array<string | number>
    /** Which scoreboard tab this group belongs to. */
    tab: ScoreTab
}

/** Payload for create/update ("upsert") operations. */
export interface UpsertGroupInput {
    /** Optional: include for update, omit for create. */
    id?: string
    name: string
    memberAgentIds: Array<string | number>
    tab: ScoreTab
}

export type { ScoreTab }
