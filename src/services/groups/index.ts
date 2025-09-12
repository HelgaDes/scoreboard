import { ENV } from '@/env'
import { createHttpGroupService, createMockGroupService } from './service'
import type { GroupService } from './service'

let _svc: GroupService | null = null

export function getGroupService(): GroupService {
    if (_svc) return _svc
    _svc =
        ENV.USE_MOCK || !ENV.API_BASE_URL
            ? createMockGroupService()
            : createHttpGroupService(ENV.API_BASE_URL as string)
    return _svc
}

