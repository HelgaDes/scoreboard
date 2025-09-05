<script setup lang="ts">
defineProps<{ value: string }>()
</script>

<template>
  <div class="total-pill">
    <span class="label">Total</span>
    <span class="value">{{ value }}</span>
  </div>
</template>

<style scoped>
.total-pill{
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 8px 20px;
  border-radius: 999px;
  box-sizing: border-box;
}

.total-pill::before{
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: var(--pill-bg, url('@/assets/bg-blur-widget.svg'))
  center / 100% 100% no-repeat;
}

.label, .value{ position: relative; z-index: 1; }

.label{
  color: var(--On-Surface-Variant, #7B8592);
  font-family: Oswald, sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 1px;
}

.value{
  color: var(--On-Secondary, #F6F7F7);
  font-family: Oswald, sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 1px;
}
</style>

