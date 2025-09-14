<script setup lang="ts">
import Divider from '@/components/ui/Divider.vue'
import ButtonAction from '@/components/ui/ButtonAction.vue'
import { onMounted, onBeforeUnmount } from 'vue'
import { useSound } from '@/composables/useSound'
import { useOverlayGate } from '@/composables/useOverlayGate'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import bgCardBlurUrl from '@/assets/bg-blur-modal-deposit.svg?url'
import moneyAnim from '@/assets/lottie/money.json?url'

const props = defineProps<{
  id: string | number
  agentName: string
  amount: number
  currency?: string
}>()
const emit = defineEmits<{ (e: 'close'): void }>()

/** Keep the global overlay gate open while the notice is mounted. */
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

/** Sound (singleton). `play()` already stops any previous channel to avoid overlap. */
const sound = useSound()
let timer: number | undefined

onMounted(() => {
  if (sound.enabled.value) {
    try { Promise.resolve((sound as any).play?.()).catch(() => {}) } catch {}
  }
  // Auto-close after 8 seconds
  timer = window.setTimeout(() => emit('close'), 8000)
})

onBeforeUnmount(() => {
  if (timer) window.clearTimeout(timer)
  // Ensure any playing melody is stopped when the overlay goes away.
  try { sound.stop() } catch {}
  releaseGate()
})
</script>

<template>
  <teleport to="#stage-overlay">
    <div class="layer" role="dialog" aria-modal="true" aria-live="polite" aria-label="Deposit notification">
      <div class="card" :style="{ backgroundImage: `url(${bgCardBlurUrl})` }">
        <div class="hdr">
          <div class="name" :title="props.agentName">{{ props.agentName }}</div>
        </div>

        <div class="anim" aria-hidden="true">
          <DotLottieVue :src="moneyAnim" autoplay loop style="width:80px;height:80px" />
        </div>

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
.layer{ position:absolute; inset:0; display:grid; place-items:center; pointer-events:auto; }
.card{ position:relative; display:flex; width:280px; min-height:260px; padding:12px; flex-direction:column; align-items:center; gap:4px; background:none center/100% 100% no-repeat; }
.hdr{ display:flex; height:32px; flex-direction:column; justify-content:center; align-items:center; align-self:stretch; margin-bottom:8px; }
.name{ color:var(--On-Surface,#E3E3E3); text-align:center; font-family:Oswald,sans-serif; font-size:16px; font-weight:400; line-height:20px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.anim{ display:grid; place-items:center; width:80px; height:80px; margin-bottom:4px; }
.body{ display:flex; height:48px; justify-content:center; align-items:center; gap:8px; align-self:stretch; color:var(--On-Surface,#E3E3E3); text-align:center; font-family:Oswald,sans-serif; font-size:20px; font-weight:500; line-height:32px; }
.divider{ align-self:stretch; width:100%; display:block; margin:8px 0 6px; }
.act{ width:100%; }
</style>


