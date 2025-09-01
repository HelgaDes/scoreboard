<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Put a 960x540 PNG export from the design at /public/design-overlay.png
// Hotkeys: "o" toggle, "[" reduce opacity, "]" increase opacity.
const visible = ref(false)
const alpha = ref(0.5)
const failed = ref(false)
const src = '/design-overlay.png'

function onKeydown(e: KeyboardEvent){
  const k = e.key.toLowerCase()
  if (k === 'o') visible.value = !visible.value
  else if (k === '[') alpha.value = Math.max(0, alpha.value - 0.05)
  else if (k === ']') alpha.value = Math.min(1, alpha.value + 0.05)
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div v-if="visible && !failed" class="overlay" :style="{ opacity: String(alpha) }">
    <img :src="src" @error="failed = true" alt="design overlay" />
  </div>
</template>

<style scoped>
.overlay{ position:absolute; inset:0; pointer-events:none; }
.overlay img{ width:100%; height:100%; object-fit:cover; }
</style>
