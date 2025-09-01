<script setup lang="ts">
const props = defineProps<{ label: string; variant?: 'primary'|'secondary'; type?: 'button'|'submit' }>()
</script>
<template>
  <button class="act" :data-variant="variant ?? 'primary'" :type="type ?? 'button'">{{ label }}</button>
</template>
<style scoped>
.act{display:flex;height:32px;align-items:center;justify-content:center;align-self:stretch;background:transparent;border:0;outline:0;-webkit-appearance:none;cursor:pointer}
.act[data-variant="primary"]{color:var(--OnSecondary)}
.act[data-variant="secondary"]{color:var(--OnSurfaceVariant)}
.act:hover{background:var(--SurfaceBlur)}
</style>
