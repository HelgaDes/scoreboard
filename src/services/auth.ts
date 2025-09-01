import { ENV } from '@/env'
import { http, HttpError } from './http'
import type { AuthService, LoginInput, LoginSuccess, TwoFARequired } from './types'
import { AuthError } from './types'

let _authService: AuthService | null = null
export function setAuthService(svc: AuthService){ _authService = svc }
export function getAuthService(): AuthService { if(!_authService) setAuthService(ENV.USE_MOCK ? createMockAuthService() : createHttpAuthService(ENV.API_BASE_URL)); return _authService! }

export function createMockAuthService(): AuthService {
  return {
    async checkTwoFA(login: string): Promise<TwoFARequired> {
      return { required: /2fa|admin|secure/i.test(login) }
    },
    async login({ login, password, code2fa }: LoginInput): Promise<LoginSuccess> {
      await new Promise(r => setTimeout(r, 200))
      const needs2 = /2fa|admin|secure/i.test(login)
      if(needs2 && !code2fa) throw new AuthError('TWOFA_REQUIRED', '2FA code required')
      if(!login || !password || password === 'wrong') throw new AuthError('INVALID_CREDENTIALS', 'Invalid credentials')
      return { userId: 'demo-user', token: 'demo-token' }
    },
    async logout(){ /* no-op */ },
  }
}

export function createHttpAuthService(baseUrl?: string): AuthService {
  const api = (p: string) => (baseUrl ? baseUrl.replace(/\/$/, '') : '') + p
  return {
    async checkTwoFA(login: string): Promise<TwoFARequired> {
      try {
        return await http<TwoFARequired>(api(`/auth/2fa-required?login=${encodeURIComponent(login)}`))
      } catch (e) {
        if (e instanceof HttpError) throw new AuthError('NETWORK', `Auth check failed: ${e.status}`)
        throw new AuthError('UNKNOWN', 'Auth check failed')
      }
    },
    async login(input: LoginInput): Promise<LoginSuccess> {
      try {
        return await http<LoginSuccess>(api('/auth/login'), { method: 'POST', body: JSON.stringify(input) })
      } catch (e) {
        if (e instanceof HttpError) {
          const code = (e.body as any)?.code as string | undefined
          if (e.status === 401 || code === 'INVALID_CREDENTIALS') throw new AuthError('INVALID_CREDENTIALS', 'Invalid credentials')
          if (e.status === 409 || code === 'TWOFA_REQUIRED') throw new AuthError('TWOFA_REQUIRED', '2FA code required')
          throw new AuthError('NETWORK', `Login failed: ${e.status}`)
        }
        throw new AuthError('UNKNOWN', 'Login failed')
      }
    },
    async logout(){ /* optional */ },
  }
}
