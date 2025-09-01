<script setup lang="ts">
import { ref } from 'vue'
import IconButtonSmall from './IconButtonSmall.vue'
const props = withDefaults(defineProps<{ modelValue: string; placeholder?: string; type?: string; block?: boolean; clearable?: boolean }>(),{ type:'text', block:false, clearable:true })
const emit = defineEmits<{ (e:'update:modelValue',v:string):void }>()

const inputRef = ref<HTMLInputElement|null>(null)
function onClear(){ emit('update:modelValue',''); inputRef.value?.focus() }
</script>
<template>
  <div class="tf" :data-block="block">
    <input ref="inputRef" :type="type" :placeholder="placeholder" :value="modelValue" @input="(e:any)=>emit('update:modelValue',e.target.value)" />
    <IconButtonSmall v-if="clearable && modelValue" name="close" title="Clear" @click="onClear" />
  </div>
</template>
<style scoped>
.tf{display:flex;width:241px;height:32px;padding:0 14px;align-items:center;gap:8px;border-radius:9px;background:var(--Tonalcontainer);box-shadow:0 -.318px .636px rgba(255,255,255,.30) inset,0 -.318px .636px rgba(255,255,255,.25) inset,.636px .955px 2.545px rgba(0,0,0,.08) inset,.636px .955px 2.545px rgba(0,0,0,.10) inset}
.tf[data-block="true"]{width:100%}
input{flex:1 1 auto;background:transparent;border:0;outline:0;color:var(--OnTertiary);font:600 12px/16px Oswald;letter-spacing:.25px}
input::placeholder{color:var(--OnTertiaryContainer)}
</style>
