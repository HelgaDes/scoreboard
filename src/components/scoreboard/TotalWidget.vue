<script setup lang="ts">
import bgPill from '@/assets/bg-blur-widget.svg?url'

defineProps<{ value: string | number }>()

function fmt(v: string | number){
  return typeof v === 'number'
      ? v.toLocaleString('en-US', { style:'currency', currency:'USD', maximumFractionDigits:2 })
      : v
}
</script>

<template>
  <div class="total-pill" :style="{ '--pill-bg': `url(${bgPill})` }" role="status" aria-live="polite" :aria-label="`Total: ${fmt(value)}`">
    <span class="label">Total</span>
    <span class="value">{{ fmt(value) }}</span>
  </div>
</template>

<style scoped>
.total-pill{ position:relative; display:inline-flex; align-items:center; gap:8px; height:40px; padding:8px 20px; border-radius:999px; box-sizing:border-box; }
.total-pill::before{ content:""; position:absolute; inset:0; border-radius:inherit; pointer-events:none; background:var(--pill-bg) center/100% 100% no-repeat; }
.label,.value{ position:relative; z-index:1; }
.label{ color:var(--On-Surface-Variant,#7B8592); font:500 14px/24px Oswald, sans-serif; letter-spacing:1px; }
.value{ color:var(--On-Secondary,#F6F7F7); font:500 14px/24px Oswald, sans-serif; letter-spacing:1px; }
</style>

