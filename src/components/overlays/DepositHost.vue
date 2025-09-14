<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import DepositNotice from './DepositNotice.vue'

/** Payload coming from backend/socket (or dev helper). */
type DepositPayload = {
  id: string
  agentName: string
  amount: number
  currency?: string
}

/** Show only one notice at a time. */
const current = ref<DepositPayload | null>(null)

/** Replace any existing notice with a new one (no queue). */
async function showNotice(input: Omit<DepositPayload,'id'> & { id?: string }) {
  const n: DepositPayload = {
    id: input.id ?? String(Date.now() + Math.random()),
    agentName: String(input.agentName ?? 'Agent'),
    amount: Number(input.amount) || 0,
    currency: input.currency ?? 'USD',
  }

  // 1) Unmount previous notice to release overlay gate first.
  if (current.value) {
    current.value = null
    await nextTick()
  }

  // 2) Mount the new notice.
  current.value = n
}

/** Handle app-level event fired by backend/socket/bridge. */
function onDepositEvent(ev: Event) {
  const detail = (ev as CustomEvent<Partial<DepositPayload>>).detail
  if (!detail || typeof detail.amount !== 'number') return
  showNotice(detail as any)
}

/** Dev helper: window.__deposit({agentName?, amount?, currency?}) */
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
  <!-- render exactly one notice; :key forces a fresh instance (sound plays once) -->
  <DepositNotice
      v-if="current"
      :key="current.id"
      :id="current.id"
      :agent-name="current.agentName"
      :amount="current.amount"
      :currency="current.currency ?? 'USD'"
      @close="current = null"
  />
</template>

