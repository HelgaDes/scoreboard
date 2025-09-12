<script setup lang="ts">
import Divider from '@/components/ui/Divider.vue'
import ButtonAction from '@/components/ui/ButtonAction.vue'
import { onMounted, onBeforeUnmount } from 'vue'
import { useSound } from '@/composables/useSound'
import { useOverlayGate } from '@/composables/useOverlayGate'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import bgCardBlurUrl from '@/assets/bg-blur-modal-deposit.svg?url'
import moneyAnim from '@/assets/lottie/money.json?url' // change path if your JSON is elsewhere

const props = defineProps<{
  id: string | number
  agentName: string
  amount: number
  currency?: string
}>()
const emit = defineEmits<{ (e: 'close'): void }>()

/** Keep the global overlay gate open while the notice is mounted (hides the table behind). */
const releaseGate = useOverlayGate('deposit')

/** Money formatting (exactly 2 fraction digits). */
function formatMoney(value: number, curr: string = 'USD') {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: curr,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/** Sound: uses the melody selected in SelectMelodyModal; honors the enabled flag in header. */
const sound = useSound()
let timer: number | undefined

onMounted(() => {
  // Play once if sound is enabled in header (the hook knows the selected melody).
  if (sound.enabled.value) {
    try {
      // Wrap into a promise so both void and Promise are handled; swallow autoplay errors.
      Promise.resolve((sound as any).play?.()).catch(() => {})
    } catch { /* noop */ }
  }
  // Auto-close after 8 seconds
  timer = window.setTimeout(() => emit('close'), 8000)
})

onBeforeUnmount(() => {
  if (timer) window.clearTimeout(timer)
  releaseGate()
})
</script>

<template>
  <!-- Render inside the 960x540 stage -->
  <teleport to="#stage-overlay">
    <div class="layer" role="dialog" aria-modal="true" aria-live="polite" aria-label="Deposit notification">
      <div class="card" :style="{ backgroundImage: `url(${bgCardBlurUrl})` }">
        <!-- Title / agent name -->
        <div class="hdr">
          <div class="name" :title="props.agentName">{{ props.agentName }}</div>
        </div>

        <!-- Lottie animation (80x80) -->
        <div class="anim" aria-hidden="true">
          <DotLottieVue :src="moneyAnim" autoplay loop style="width:80px;height:80px" />
        </div>

        <!-- Amount row -->
        <div class="body">
          <span>+&nbsp;{{ formatMoney(props.amount, props.currency ?? 'USD') }}</span>
        </div>

        <!-- Full-width divider -->
        <Divider class="divider" aria-hidden="true" />

        <!-- Close action -->
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
/* Overlay layer within the stage (covers 960x540 and centers the card) */
.layer{
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  pointer-events: auto;
}

/* 280px wide card with blur background from SVG */
.card{
  position: relative;
  display: flex;
  width: 280px;
  min-height: 260px;
  padding: 12px;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: none center / 100% 100% no-repeat;
}

/* Header / agent name */
.hdr{
  display: flex; height: 32px;
  flex-direction: column; justify-content: center; align-items: center;
  align-self: stretch; margin-bottom: 8px;
}
.name{
  color: var(--On-Surface, #E3E3E3);
  text-align: center;
  font-family: Oswald, sans-serif;
  font-size: 16px; font-weight: 400;
  line-height: 20px; letter-spacing: .25px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

/* Lottie container (80x80) */
.anim{
  display: grid;
  place-items: center;
  width: 80px;
  height: 80px;
  margin-bottom: 4px;
}

/* Amount row */
.body{
  display: flex; height: 48px; justify-content: center; align-items: center; gap: 8px;
  align-self: stretch; color: var(--On-Surface, #E3E3E3);
  text-align: center;
  font-family: Oswald, sans-serif;
  font-size: 20px; font-weight: 500;
  line-height: 32px;
}

/* Full-width divider inside the card */
.divider{
  align-self: stretch;   /* make the Divider fill the card width */
  width: 100%;           /* ensure full width in case component has intrinsic size */
  display: block;        /* some components may be inline by default */
  margin: 8px 0 6px;
}

/* Close button width (visual balance with card) */
.act{ width: 100%; }
</style>

