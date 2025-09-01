<script setup lang="ts">
const props = defineProps<{
  icon?: string
  label: string
  type?: 'button' | 'submit' | 'reset'
}>()
</script>

<template>
  <button class="btn-accent" :type="type || 'button'">
    <Icon v-if="icon" :name="icon" :size="16" class="ic"/>
    <span class="label">{{ label }}</span>
  </button>
</template>

<style scoped>
.btn-accent{
  display:flex; align-items:center; justify-content:center; gap:6px;
  height:28px; padding:0 14px 0 10px; border-radius:16px;
  font-family: Oswald, sans-serif; font-weight:600; font-size:12px; letter-spacing:.25px; line-height:16px;
  color: var(--SurfaceContainer, #242426);
  background: var(--OnSurfaceContainer, #C4C7C5);
  box-shadow: 0 1px 2px 0 rgba(0,0,0,.30), 0 1px 3px 1px rgba(0,0,0,.15);
  transition: box-shadow .15s ease;
}
.btn-accent:hover{
  box-shadow: 0 1px 2px 0 rgba(0,0,0,.30), 0 1px 6px 2px rgba(0,0,0,.18);
}
.ic{ flex:0 0 auto; }
</style>
