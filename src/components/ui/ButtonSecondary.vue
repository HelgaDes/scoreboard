<script setup lang="ts">
import type { CSSProperties } from 'vue'

withDefaults(defineProps<{
  label: string
  iconSrc?: string
  pressed?: boolean
  disabled?: boolean
  title?: string
}>(), {
  pressed: false,
  disabled: false,
})

const emit = defineEmits<{ (e:'click', ev:MouseEvent): void }>()

/** Inline style for mask-image (no custom CSS vars -> cleaner in IDE). */
function icoStyle(src?: string): CSSProperties {
  return src
      ? { WebkitMaskImage: `url(${src})`, maskImage: `url(${src})` }
      : {}
}
</script>

<template>
  <button
      type="button"
      class="btn-secondary"
      :title="title || label"
      :aria-pressed="pressed ? 'true' : 'false'"
      :disabled="disabled"
      @click="emit('click', $event)"
  >

    <span
        v-if="iconSrc"
        class="ico"
        :style="icoStyle(iconSrc)"
        aria-hidden="true"
    />
    <span class="lbl">{{ label }}</span>
  </button>
</template>

<style scoped>

.btn-secondary{
  display:flex;
  height:28px;
  padding:0 14px 0 10px;
  justify-content:center;
  align-items:center;
  gap:6px;
  border:0;
  border-radius:999px;
  background: var(--On-Surface-Blur, rgba(255,255,255,0.04));
  cursor:pointer;

  font-family: Oswald, sans-serif;
  font-size:12px;
  font-weight:600;
  line-height:16px;

  color: var(--On-Surface-Container, var(--OnSurfaceContainer, #E6E9E7));
}

.btn-secondary:hover:not(:disabled){
  background: var(--On-Surface-Container, #C4C7C5);
  color: var(--Surface-Container, var(--SurfaceContainer, #1A1C1A));
}

.btn-secondary:disabled{
  opacity:.6;
  cursor:default;
}

.ico{
  width:16px;
  height:16px;
  display:inline-block;
  flex:0 0 16px;
  background-color: currentColor;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-size: 16px 16px;
  mask-size: 16px 16px;
}
</style>

