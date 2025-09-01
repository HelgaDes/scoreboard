export type GroupDTO = {
  id: string
  name: string
  memberAgentIds: Array<string | number>
  tab?: 'sales' | 'retention'
  createdAt?: string
}

export type UpsertGroupInput = { name: string; memberAgentIds: Array<string | number>; tab?: 'sales' | 'retention' }
