<script setup lang="ts">
import Icon from '@/components/ui/Icon.vue'

const props = withDefaults(defineProps<{
  icon: string
  title?: string
  disabled?: boolean
}>(), {})
</script>

<template>
  <button
      class="icon-btn-sm"
      :title="title || icon"
      :aria-label="title || icon"
      :disabled="disabled"
      type="button"
  >
    <Icon variant="fill" :name="icon" :size="12" />
  </button>
</template>

<style scoped>
.icon-btn-sm{
  display:flex; align-items:center; justify-content:center;
  width:20px; height:20px; border-radius:999px;
  background: var(--SurfaceBlur, rgba(255,255,255,.06));
  color: var(--OnSecondary, #F6F7F7);
  transition: background .15s ease, color .15s ease, opacity .15s ease;
}
.icon-btn-sm:hover{
  background: var(--OnSecondary, #F6F7F7);
  color: var(--SurfaceContainer, #242426);
}
.icon-btn-sm:disabled{ opacity:.5; pointer-events:none; }

:deep(svg), :deep(path), :deep(circle), :deep(rect){
  fill: currentColor; stroke: currentColor;
}
</style>

