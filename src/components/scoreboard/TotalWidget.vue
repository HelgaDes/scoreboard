<script setup lang="ts">
const props = defineProps<{ label?: string; value: string }>()
</script>
<template>
  <div class="total-pill">
    <span class="label">{{ props.label ?? 'Total' }}</span>
    <span class="value">{{ props.value }}</span>
  </div>
</template>
<style scoped>
.total-pill { display: inline-flex; padding: 8px 20px; gap: 12px; justify-content: center; align-items: center;
  background: url('/src/assets/bg-blur-widget.svg') center / 100% 100% no-repeat; border-radius: 999px; backdrop-filter: blur(2px); }
.label, .value { font-family: Oswald, sans-serif; font-size: 16px; line-height: 24px; font-weight: 500; letter-spacing: .5px; }
.label { color: var(--OnSurfaceVariant, #7B8592); }
.value { color: var(--OnSurface, #E3E3E3); }
</style>
