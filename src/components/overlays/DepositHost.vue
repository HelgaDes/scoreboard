<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import DepositNotice from './DepositNotice.vue'

/** Payload that backend (gateway) sends inside CustomEvent detail. */
export type DepositPayload = {
  id?: string
  agentName: string
  amount: number
  currency?: string // e.g. 'USD'
}

/** Internal shape with guaranteed id. */
type Notice = Required<Pick<DepositPayload, 'id'>> & Omit<DepositPayload, 'id'>

const notices = ref<Notice[]>([])

/** Add a new notice and auto-close it in 5s. */
function addNotice(detail: DepositPayload) {
  const id = detail.id ?? crypto?.randomUUID?.() ?? String(Date.now() + Math.random())
  const notice: Notice = { id, agentName: detail.agentName, amount: detail.amount, currency: detail.currency }
  notices.value = [...notices.value, notice]

  // auto dismiss after 5s
  window.setTimeout(() => close(id), 5000)
}

function close(id: string) {
  notices.value = notices.value.filter(n => n.id !== id)
}

/** Handle incoming CustomEvent from backend/gateway. */
function onDepositEvent(ev: Event) {
  const { detail } = ev as CustomEvent<DepositPayload>
  // lightweight runtime guard (keeps TS happy, avoids “typeof always false”)
  if (!detail || !Number.isFinite(detail.amount)) return
  addNotice(detail)
}

/* ---------- Dev helper (manual trigger from console) ---------- */
/** Installs window.__deposit() to fire a demo notice. */
function installDevHelpers() {
  // @ts-expect-error expose for debugging
  window.__deposit = (d: Partial<DepositPayload> = {}) => {
    const demo: DepositPayload = {
      agentName: 'Admin Admin',
      amount: Math.round((Math.random() * 1200 + 50) * 100) / 100,
      currency: 'USD',
      ...d,
    }
    window.dispatchEvent(new CustomEvent<DepositPayload>('app:deposit', { detail: demo }))
  }

  return () => {
    // @ts-expect-error cleanup
    delete window.__deposit
  }
}

let removeDev: (() => void) | undefined

onMounted(() => {
  window.addEventListener('app:deposit', onDepositEvent as EventListener)
  removeDev = installDevHelpers()
})

onBeforeUnmount(() => {
  window.removeEventListener('app:deposit', onDepositEvent as EventListener)
  if (removeDev) removeDev()
})
</script>

<template>
  <!-- Render one overlay per active notice (each notice teleports to #stage-overlay) -->
  <DepositNotice
      v-for="n in notices"
      :key="n.id"
      :id="n.id"
      :agent-name="n.agentName"
      :amount="n.amount"
      :currency="n.currency"
      @close="close"
  />
</template>

