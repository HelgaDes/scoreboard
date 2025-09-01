import { ENV } from '@/env'
import { createHttpGroupService, createMockGroupService, type GroupService } from './service'

let _groups: GroupService | null = null
export function getGroupService(): GroupService {
  if (!_groups) _groups = ENV.USE_MOCK && !ENV.API_BASE_URL ? createMockGroupService() : createHttpGroupService(ENV.API_BASE_URL!)
  return _groups
}
