<script setup lang="ts">
const props = withDefaults(defineProps<{ amount?: number; agent?: string; message?: string }>(), {})
const pretty = (n?: number) => typeof n === 'number'
  ? n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
  : ''
</script>
<template>
  <div class="dep">
    <div class="dep__pill">
      <strong class="dep__main BodyMedium">
        <template v-if="props.message">{{ props.message }}</template>
        <template v-else>
          Deposit <span class="dep__amount">{{ pretty(props.amount) }}</span>
          <span v-if="props.agent" class="dep__by">by {{ props.agent }}</span>
        </template>
      </strong>
    </div>
  </div>
</template>
<style scoped>
.dep { position: absolute; inset: 0; display: grid; place-items: center; pointer-events: none; z-index: 60; }
.dep__pill { pointer-events: auto; padding: 10px 18px; border-radius: 999px;
  background: url('/src/assets/bg-blur-widget.svg') center / 100% 100% no-repeat;
  color: var(--OnSurface, #E3E3E3); box-shadow: 0 8px 24px rgba(0,0,0,.25);
  transform: translateY(-12px); opacity: 0; animation: dep-in .18s ease-out forwards; }
.dep__main { display: inline-flex; align-items: baseline; gap: 8px; }
.dep__amount { font-weight: 600; }
.dep__by { color: var(--OnSurfaceVariant, #7B8592); font-weight: 400; }
@keyframes dep-in { to { transform: translateY(0); opacity: 1; } }
</style>
