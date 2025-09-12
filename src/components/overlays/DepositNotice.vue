<script setup lang="ts">
import Divider from '@/components/ui/Divider.vue'
import ButtonAction from '@/components/ui/ButtonAction.vue'
import { onMounted, onBeforeUnmount } from 'vue'
import { useSound } from '@/composables/useSound'
import { useOverlayGate } from '@/composables/useOverlayGate'
import bgCardBlurUrl from '@/assets/bg-blur-modal-deposit.svg?url'

/** Props supplied by host */
const props = defineProps<{
  id: string | number
  agentName: string
  amount: number
  currency?: string
}>()

const emit = defineEmits<{ (e: 'close'): void }>()

/** While notice is shown, keep a global overlay gate open (hide the table). */
const releaseGate = useOverlayGate('deposit')

/** Format with exactly 2 decimals (USD by default). */
function formatMoney(value: number, curr: string = 'USD') {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: curr,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/** Sound hook (plays the melody chosen in SelectMelodyModal). */
const sound = useSound()
let timer: number | undefined

onMounted(() => {
  // Play once if sound is enabled in header.
  if (!sound.enabled.value) return

  try {
    const r = sound.play()

    // r may be void or Promise<void>; catch AbortError/NotAllowedError if any.
    if (r && typeof (r as any).catch === 'function') {
      (r as Promise<void>).catch(() => {})
    }
  } catch {
    /* noop */
  }
  // Auto-close after 8 seconds
  timer = window.setTimeout(() => emit('close'), 8000)
})

onBeforeUnmount(() => {
  if (timer) window.clearTimeout(timer)
  // Release the global gate so the table can reappear.
  releaseGate()
})
</script>

<template>
  <!-- Inside-scene overlay (teleport target is the stage overlay layer) -->
  <teleport to="#stage-overlay">
    <div
        class="layer"
        role="dialog"
        aria-modal="true"
        aria-live="polite"
        aria-label="Deposit notification"
    >
      <div class="card" :style="{ backgroundImage: `url(${bgCardBlurUrl})` }">
        <!-- Title / agent name -->
        <div class="hdr">
          <div class="name">{{ props.agentName }}</div>
        </div>

        <!-- Amount row -->
        <div class="body">
          <span>+&nbsp;{{ formatMoney(props.amount, props.currency ?? 'USD') }}</span>
        </div>

        <Divider class="divider" aria-hidden="true" />
        <ButtonAction
            class="act"
            label="Close"
            variant="secondary"
            :block="true"
            @click="emit('close')"
        />
      </div>
    </div>
  </teleport>
</template>

<style scoped>
/* Overlay layer inside the 960x540 stage */
.layer{
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  pointer-events: auto;
}

.card{
  position: relative;
  display: flex;
  width: 280px;
  min-height: 240px;
  padding: 12px;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: none center / 100% 100% no-repeat;
}

/* Header / name */
.hdr{
  display: flex;
  height: 32px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  margin-bottom: 12px;
}
.name{
  color: var(--On-Surface, #E3E3E3);
  text-align: center;
  font-family: Oswald, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
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
  font-family: Oswald, sans-serif;
  font-size: 20px;
  font-weight: 500;
  line-height: 32px;
}

.divider{ align-self: stretch; margin: 8px 0 6px; }
.act{ min-width: 120px; }
</style>


