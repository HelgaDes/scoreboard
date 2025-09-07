import { ENV } from '@/env'
import { createHttpScoreService, createMockScoreService } from './service'
import type { ScoreService } from './types'

let _svc: ScoreService | null = null

/**
 * Returns a singleton ScoreService.
 *
 * Selection rules:
 * - If ENV.USE_MOCK is true → always use the mock service.
 * - Else, if ENV.API_BASE_URL is defined → use the real HTTP service.
 * - Else → fall back to the mock service (local dev without backend).
 */
export function getScoreService(): ScoreService {
    if (_svc) return _svc

    const useMock = ENV.USE_MOCK || !ENV.API_BASE_URL
    _svc = useMock
        ? createMockScoreService()
        : createHttpScoreService(ENV.API_BASE_URL as string)

    return _svc
}

/** Optional helper for tests/dev to force re-selection on next call. */
// noinspection JSUnusedGlobalSymbols
export function __resetScoreServiceSingleton(): void {
    _svc = null
}


