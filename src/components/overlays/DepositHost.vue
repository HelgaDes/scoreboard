<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import DepositNotice from './DepositNotice.vue'

type DepositPayload = {
  id: string
  agentName: string
  amount: number
  currency?: string
}

const notices = ref<DepositPayload[]>([])

function addNotice(input: Omit<DepositPayload,'id'> & { id?: string }) {
  const n: DepositPayload = {
    id: input.id ?? String(Date.now() + Math.random()),
    agentName: String(input.agentName ?? 'Agent'),
    amount: Number(input.amount) || 0,
    currency: input.currency ?? 'USD',
  }
  notices.value = [...notices.value, n]
}

function onDepositEvent(ev: Event) {
  const detail = (ev as CustomEvent<Partial<DepositPayload>>).detail
  if (!detail || typeof detail.amount !== 'number') return
  addNotice(detail as any)
}

declare global { interface Window { __deposit?: (o?: Partial<DepositPayload>) => void } }
let removeDev: (() => void) | undefined
function installDevHelper() {
  window.__deposit = (o = {}) => {
    const demo: Partial<DepositPayload> = {
      agentName: 'Admin Admin',
      amount: Math.round((200 + Math.random() * 500) * 100) / 100,
      currency: 'USD',
      ...o,
    }
    window.dispatchEvent(new CustomEvent('app:deposit', { detail: demo }))
  }
  return () => { try { delete window.__deposit } catch {} }
}

onMounted(() => {
  window.addEventListener('app:deposit', onDepositEvent as EventListener)
  if (import.meta.env.DEV) removeDev = installDevHelper()
})
onBeforeUnmount(() => {
  window.removeEventListener('app:deposit', onDepositEvent as EventListener)
  removeDev?.()
})

</script>

<template>
  <DepositNotice
      v-for="n in notices"
      :key="n.id"
      :id="n.id"
      :agent-name="n.agentName"
      :amount="n.amount"
      :currency="n.currency ?? 'USD'"
      @close="notices = notices.filter(x => x.id !== n.id)"
  />
</template>
