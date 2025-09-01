export type LoginInput = { login: string; password: string; code2fa?: string }
export type LoginSuccess = { userId: string; token: string }
export type TwoFARequired = { required: boolean }

export type AuthErrorCode = 'INVALID_CREDENTIALS' | 'TWOFA_REQUIRED' | 'NETWORK' | 'UNKNOWN'
export class AuthError extends Error {
  code: AuthErrorCode
  constructor(code: AuthErrorCode, message?: string){ super(message ?? code); this.code = code }
}

export interface AuthService {
  checkTwoFA(login: string): Promise<TwoFARequired>
  login(input: LoginInput): Promise<LoginSuccess>
  logout(): Promise<void>
}

