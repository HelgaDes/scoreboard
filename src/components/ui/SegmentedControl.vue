<script setup lang="ts">
const props = defineProps<{ modelValue: string; options: { label:string; value:string }[]; width?: number }>()
const emit = defineEmits<{ (e:'update:modelValue',v:string):void }>()
</script>
<template>
  <div class="seg" :style="{width:(props.width??210)+'px'}">
    <button v-for="o in props.options" :key="o.value" class="seg__btn" :data-on="o.value===props.modelValue" @click="emit('update:modelValue',o.value)">{{ o.label }}</button>
  </div>
</template>
<style scoped>
.seg{display:flex;height:28px;padding:2px;gap:2px;border-radius:64px;background:var(--SecondaryContainer);box-shadow:0 -.318px .636px rgba(255,255,255,.30) inset,0 -.318px .636px rgba(255,255,255,.25) inset,.636px .955px 2.545px rgba(0,0,0,.08) inset,.636px .955px 2.545px rgba(0,0,0,.10) inset}
.seg__btn{flex:1 0 0;height:24px;padding:0 5px;border-radius:13px;border:.318px solid transparent;background:none;color:var(--OnSecondaryContainer);font:600 12px/16px Oswald;letter-spacing:.25px}
.seg__btn[data-on="true"]{border-color:rgba(255,255,255,.40);background:#253243;color:var(--OnSecondary);box-shadow:0 1.273px 2.545px rgba(0,0,0,.10)}
</style>
