<script setup lang="ts">
import HeaderBar from '@/components/layout/HeaderBar.vue'
import TextField from '@/components/ui/TextField.vue'
import ButtonAction from '@/components/ui/ButtonAction.vue'
import Divider from '@/components/ui/Divider.vue'

import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { AuthError } from '@/services/types'

import bgUrl from '@/assets/bg-blur-modal.svg?url'

const r = useRouter()
const auth = useAuth()

const loginV = ref('')
const password = ref('')
const code2fa = ref('')
const err = ref<string | null>(null)

watch(loginV, (v) => { if (v) void auth.checkTwoFA(v) })

function canSubmit() {
  return Boolean(
      loginV.value &&
      password.value &&
      (!auth.twoFARequired.value || code2fa.value)
  )
}

async function onSubmit() {
  err.value = null
  if (!canSubmit()) { err.value = 'Please fill all required fields'; return }

  try {
    await auth.login({
      login: loginV.value,
      password: password.value,
      code2fa: auth.twoFARequired.value ? code2fa.value : undefined
    })
    await r.push('/scoreboard')
  } catch (e) {
    if (e instanceof AuthError) {
      if (e.code === 'TWOFA_REQUIRED') err.value = 'Enter 2FA code'
      else if (e.code === 'INVALID_CREDENTIALS') err.value = 'Invalid credentials'
      else err.value = 'Network error. Try again'
    } else err.value = 'Unexpected error'
  }
}
</script>

<template>
  <HeaderBar title="Sales Scoreboard" :show-actions="false" />

  <div class="row" style="justify-content:center;margin-top:76px">
    <div class="loginWrap">

      <div class="loginCard">
        <div
            class="loginCard__bg"
            :style="{ background: `url(${bgUrl}) center / 100% 100% no-repeat` }"
            aria-hidden="true"
        ></div>

        <div class="loginCard__content">
          <div class="cardHdr">
            <div class="H2" style="text-align:center">Welcome back</div>
          </div>

          <div class="cardBody">
            <TextField v-model="loginV" placeholder="Login" :block="true" clearable />
            <TextField v-model="password" placeholder="Password" type="password" :block="true" clearable />
            <TextField v-if="auth.twoFARequired" v-model="code2fa" placeholder="2FA (if enabled)" :block="true" clearable />
          </div>

          <Divider class="divider" />

          <ButtonAction
              label="Login"
              variant="primary"
              :block="true"
              @click="onSubmit"
          />
        </div>
      </div>

      <div v-if="err" class="err BodySmall">{{ err }}</div>
    </div>
  </div>
</template>

<style scoped>

.loginWrap{
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:12px;
}


.loginCard{
  position:relative;
  width:280px;
  height:255px;
  display:block;
}


.loginCard__bg{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  pointer-events:none;
  user-select:none;
}


.loginCard__content{
  position:relative;
  z-index:1;
  width:100%;
  height:100%;
  padding:12px;
  box-sizing:border-box;
  display:flex;
  flex-direction:column;
  gap:4px;
  align-items:stretch;
  min-width:0;
}

.cardHdr{
  display:flex;
  align-items:center;
  justify-content:center;
  height:32px;
  margin-bottom:12px;
}

.cardBody{
  display:flex;
  flex-direction:column;
  gap:16px;
}

.divider{
  margin-top:16px;
  margin-bottom:6px;
  align-self:stretch;
}


:deep(button){ width:100%; }


.err{
  color:#ffb4ab;
  text-align:center;
}
</style>









