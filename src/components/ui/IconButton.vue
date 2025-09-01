<script setup lang="ts">
const props = defineProps<{
  icon: string
  title?: string
  disabled?: boolean
  active?: boolean
}>()
</script>

<template>
  <button
    class="icon-btn"
    :aria-label="title || icon"
    :title="title || icon"
    :disabled="disabled"
    :data-active="active ? '' : null"
  >
    <Icon variant="fill" :name="icon" :size="16" />
  </button>
</template>

<style scoped>
.icon-btn{
  border-radius: 100px;
  display:flex; align-items:center; justify-content:center;
  width:28px; height:28px;
  color: var(--OnSurfaceContainer, #C4C7C5);
  background: var(--SurfaceContainer, #242426);
  transition: background .15s ease, color .15s ease, opacity .15s ease;
}
.icon-btn:hover{ background: var(--OnSurfaceContainer, #C4C7C5); color: var(--SurfaceContainer, #242426); }
.icon-btn:disabled{ opacity:.5; pointer-events:none; }
</style>
