<script setup lang="ts">
const props = defineProps<{
  icon?: string
  label: string
  pressed?: boolean
  type?: 'button' | 'submit' | 'reset'
}>()
</script>

<template>
  <button class="btn-sec" :data-pressed="pressed ? '' : null" :type="type || 'button'">
    <Icon v-if="icon" :name="icon" :size="16" class="ic"/>
    <span class="label">{{ label }}</span>
  </button>
</template>

<style scoped>
.btn-sec{
  display:flex; align-items:center; justify-content:center; gap:6px;
  height:28px; padding:0 14px 0 10px; border-radius:16px;
  font-family: Oswald, sans-serif; font-weight:600; font-size:12px; letter-spacing:.25px; line-height:16px;
  color: var(--OnSurfaceContainer, #C4C7C5);
  background: var(--OnSurfaceBlur, rgba(255,255,255,.04));
  transition: background .15s ease, color .15s ease;
}
.btn-sec:hover{ background: var(--OnSurfaceContainer, #C4C7C5); color: var(--SurfaceContainer, #242426); }
.ic{ flex:0 0 auto; }
</style>
