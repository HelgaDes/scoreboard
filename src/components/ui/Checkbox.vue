<script setup lang="ts">
import { computed } from 'vue'
import selectedSvg   from '@/assets/icons/Icon-checkbox-selected.svg?raw'
import unselectedSvg from '@/assets/icons/Icon-checkbox-unselected.svg?raw'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  disabled?: boolean
  title?: string
}>(), { modelValue: false, disabled: false })

const emit = defineEmits<{
  (e:'update:modelValue', v:boolean):void
  (e:'change', v:boolean):void
  (e:'toggle', v:boolean):void
}>()

// simple, because modelValue is already boolean via defaults
const isChecked = computed(() => props.modelValue)

function toggle () {
  if (props.disabled) return
  const next = !isChecked.value
  emit('update:modelValue', next)
  emit('change', next)
  emit('toggle', next)
}
</script>

<template>
  <button
      type="button"
      class="checkbox"
      role="checkbox"
      :aria-checked="isChecked ? 'true' : 'false'"
      :title="title || (isChecked ? 'Selected' : 'Not selected')"
      :disabled="disabled"
      @click="toggle"
  >
    <span class="ico" :class="isChecked ? 'is-checked' : 'is-unchecked'" v-html="isChecked ? selectedSvg : unselectedSvg" />
  </button>
</template>

<style scoped>
.checkbox{ display:flex; width:16px; height:16px; justify-content:center; align-items:center; flex-shrink:0; padding:0; border:0; background:none; cursor:pointer; }
.checkbox:disabled{ cursor:default; opacity:.6 }
.ico{ display:block; width:16px; height:16px; line-height:0; }
.ico :deep(svg){ width:16px; height:16px; display:block; }
.is-unchecked :deep(path){ fill: var(--On-Secondary-Container, var(--OnSecondaryContainer)); }
.is-checked   :deep(path){ fill: var(--On-Secondary, var(--OnSecondary)); }
</style>

