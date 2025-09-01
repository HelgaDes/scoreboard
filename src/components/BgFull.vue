<script setup lang="ts">
import bgUrl from '@/assets/bg-gradient.svg?url'
</script>

<template>
  <div class="bg"></div>
  <img class="grad" :src="bgUrl" alt="" />
</template>

<style scoped>
.bg {
  position: fixed;
  inset: 0;
  background: #0D0D0E;
  z-index: 0;
}
.grad {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  z-index: 0;
}
</style>
