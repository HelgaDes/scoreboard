<script setup lang="ts">
import Divider from '@/components/ui/Divider.vue'

/** Props for the single deposit notification. */
const { agentName, amount, currency } = defineProps<{
  agentName: string
  amount: number
  currency: string // 'USD' by now; kept generic
}>()

/** Format amount with currency (exactly 2 decimals). */
function formatAmount(n: number, cur: string) {
  return Number(n).toLocaleString('en-US', {
    style: 'currency',
    currency: cur || 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/** Close event is emitted by the host after 5s; keep local API for button. */
const emit = defineEmits<{ (e: 'close'): void }>()
</script>

<template>
  <!-- Teleport anchor is #stage-overlay; parent (DepositHost) handles it -->
  <div class="notice" role="dialog" aria-live="polite" aria-label="Deposit notification">
    <!-- title -->
    <div class="hdr">
      <div class="name" :title="agentName">{{ agentName }}</div>
    </div>

    <!-- amount row -->
    <div class="body">
      <span class="label">Deposit</span>
      <span class="sum">{{ formatAmount(amount, currency) }}</span>
    </div>

    <Divider class="divider" aria-hidden="true" />

    <!-- close action -->
    <button class="act" data-variant="secondary" type="button" @click="emit('close')">
      Close
    </button>
  </div>
</template>

<style scoped>
/* Card shell follows the 280×auto modal spec (same visual family as other modals). */
.notice{
  display: flex;
  width: 280px;
  padding: 12px;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

/* Header (agent name) — single line with ellipsis */
.hdr{
  display: flex;
  height: 32px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  margin-bottom: 4px;
}

.name{
  color: var(--On-Surface, #E3E3E3);
  text-align: center;
  font-family: Oswald, system-ui, -apple-system, "Segoe UI", Roboto,
  "Helvetica Neue", Arial, "Noto Sans",
  "Apple Color Emoji","Segoe UI Emoji", sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;                /* 125% */
  letter-spacing: 0.016rem;         /* ≈ 0.25px @16px, avoids fractional px warning */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Amount row */
.body{
  display: flex;
  height: 48px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  align-self: stretch;

  color: var(--On-Surface, #E3E3E3);
  text-align: center;
  font-family: Oswald, system-ui, -apple-system, "Segoe UI", Roboto,
  "Helvetica Neue", Arial, "Noto Sans",
  "Apple Color Emoji","Segoe UI Emoji", sans-serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 32px;                /* 160% */
  letter-spacing: 0.031rem;         /* ≈ 0.5px @16px */
}

.label{ opacity: .8; }
.sum  { font-weight: 600; }

/* Divider between amount and action */
.divider{
  align-self: stretch;
  height: 1px;
  background: var(--Outline-Variant, rgba(255,255,255,.06));
  margin: 4px 0;
}

/* Action button (visual matches secondary modal actions) */
.act{
  min-width: 120px;
  height: 32px;
  padding: 0 14px;
  border: 0;
  border-radius: 999px;
  cursor: pointer;

  background: var(--On-Surface-Blur, rgba(255,255,255,0.04));
  color: var(--On-Surface-Container, #E6E9E7);

  font-family: Oswald, system-ui, -apple-system, "Segoe UI", Roboto,
  "Helvetica Neue", Arial, "Noto Sans",
  "Apple Color Emoji","Segoe UI Emoji", sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: 0.016rem;
}

.act:hover{
  background: var(--On-Surface-Container, #C4C7C5);
  color: var(--Surface-Container, #1A1C1A);
}
</style>

