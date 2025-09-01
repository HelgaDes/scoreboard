<script setup lang="ts">
const props = defineProps<{ icon: string; title?: string }>();
</script>

<template>
  <button class="icon-btn-sm" :title="title || icon" :aria-label="title || icon">
    <Icon variant="fill" :name="icon" :size="12" />
  </button>
</template>

<style scoped>
.icon-btn-sm{
  display:flex; align-items:center; justify-content:center;
  width:20px; height:20px; border-radius:999px;
  background: var(--SurfaceBlur, rgba(255,255,255,0.12));
  color: var(--OnSecondary, #F6F7F7);
  line-height:0;
}
</style>
