<script setup lang="ts">
const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e:'update:modelValue', v:boolean): void }>()
</script>
<template>
  <button class="chk" :aria-checked="props.modelValue" role="checkbox" @click="emit('update:modelValue', !props.modelValue)">
    <div class="box" :data-on="props.modelValue"></div>
  </button>
</template>
<style scoped>
.chk{display:flex;width:16px;height:16px;align-items:center;justify-content:center}
.box{width:100%;height:100%;border-radius:3px;background:var(--OnSecondaryContainer,#6E7F95);position:relative}
.box[data-on="true"]{background:var(--OnSurface,#E3E3E3)}
.box[data-on="true"]::after{content:'';position:absolute;inset:3px;background:url('@/assets/Icon-check.svg') center/contain no-repeat}
</style>
