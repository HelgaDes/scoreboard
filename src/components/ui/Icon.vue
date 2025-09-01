<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  /** logical name like: sound | volume-up | volume-off | logout | grouping-on | grouping-off | add | check | close | remove-group */
  name: string
  /** pixel size: width & height */
  size?: number | string
  /** fill strategy: "auto" keeps original SVG paints, "fill" uses currentColor fill, "stroke" uses currentColor stroke */
  variant?: 'auto' | 'fill' | 'stroke'
  label?: string
}>(), {
  size: 16,
  variant: 'fill',
})

const px = computed(() => (props.size as number | string) + 'px')

// Eager import raw SVGs
const files = import.meta.glob('@/assets/icons/*.svg', { as: 'raw', eager: true }) as Record<string, string>

const map: Record<string, string> = {
  'sound': 'Icon-sound.svg',
  'volume-up': 'Icon-volume-up.svg',
  'volume-off': 'Icon-volume-off.svg',
  'logout': 'Icon-logout.svg',
  'grouping-on': 'Icon-grouping-on.svg',
  'grouping-off': 'Icon-grouping-off.svg',
  'add': 'Icon-add.svg',
  'check': 'Icon-check.svg',
  'close': 'Icon-close.svg',
  'remove-group': 'Icon-remove-group.svg',
}

function normalize(svg: string): string {
  if (!svg) return ''
  // Strip fixed width/height from root
  svg = svg.replace(/<svg([^>]*?)\s(width|height)="[^"]*"([^>]*?)>/g, '<svg$1$3>')
  // Ensure viewBox
  if (!/viewBox=/.test(svg)) svg = svg.replace(/<svg([^>]*?)>/, '<svg$1 viewBox="0 0 24 24">')
  return svg
}

const raw = computed(() => {
  const file = map[props.name] || props.name
  const key = '/src/assets/icons/' + file
  return normalize(files[key] || '')
})
</script>

<template>
  <span
    class="svg-icon"
    :class="['-v-' + variant]"
    :style="{ '--s': px }"
    :aria-label="label || name"
    role="img"
    v-html="raw"
  />
</template>

<style scoped>
.svg-icon{
  display:inline-flex;
  width:var(--s);
  height:var(--s);
  line-height:0;
}
.svg-icon :deep(svg){
  width:100%;
  height:100%;
  display:block;
}
/* FILL variant: only fill uses currentColor, stroke disabled */
.-v-fill :deep(path),
.-v-fill :deep(circle),
.-v-fill :deep(rect),
.-v-fill :deep(ellipse),
.-v-fill :deep(polygon){
  fill: currentColor !important;
  stroke: none !important;
}

/* STROKE variant: only stroke uses currentColor, no fill */
.-v-stroke :deep(path),
.-v-stroke :deep(circle),
.-v-stroke :deep(rect),
.-v-stroke :deep(ellipse),
.-v-stroke :deep(line),
.-v-stroke :deep(polyline){
  fill: none !important;
  stroke: currentColor !important;
  vector-effect: non-scaling-stroke;
}

/* AUTO variant: retain original paints; no overrides */
</style>