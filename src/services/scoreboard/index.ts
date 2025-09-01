import { ENV } from '@/env'
import { createHttpScoreService, createMockScoreService, type ScoreService } from './service'

let _svc: ScoreService | null = null
export function getScoreService(): ScoreService {
  if (!_svc) _svc = ENV.USE_MOCK && !ENV.API_BASE_URL ? createMockScoreService() : createHttpScoreService(ENV.API_BASE_URL!)
  return _svc
}
