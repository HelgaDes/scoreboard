import { ref } from 'vue'
import { getAuthService } from '@/services/auth'
import type { LoginInput } from '@/services/types'
import { AuthError } from '@/services/types'

export function useAuth(){
  const loading = ref(false)
  const twoFARequired = ref(false)

  async function checkTwoFA(login: string){
    try {
      const res = await getAuthService().checkTwoFA(login)
      twoFARequired.value = !!res.required
      return twoFARequired.value
    } catch { return false }
  }

  async function login(input: LoginInput){
    loading.value = true
    try {
      const res = await getAuthService().login(input)
      return res
    } catch (e) {
      if (e instanceof AuthError) throw e
      throw new AuthError('UNKNOWN', 'Unexpected error')
    } finally {
      loading.value = false
    }
  }

  return { loading, twoFARequired, checkTwoFA, login }
}
