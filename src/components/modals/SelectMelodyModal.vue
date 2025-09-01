<script setup lang="ts">
import ModalPanel from './ModalPanel.vue'
import ButtonAction from '@/components/ui/ButtonAction.vue'
import Icon from '@/components/ui/Icon.vue'
import { useSound } from '@/composables/useSound'
const props = defineProps<{ onClose?: () => void }>()
const sound = useSound()
const options = [{ key:'fanfare', label:'Fanfare' }, { key:'herecomes', label:'Here Comes' }, { key:'pimp', label:'Pimp' }]
</script>
<template>
  <ModalPanel title="Select melody">
    <div class="list">
      <button v-for="o in options" :key="o.key" class="item" @click="sound.setMelody(o.key as any)">
        <span class="name BodySmall">{{ o.label }}</span>
        <Icon v-if="sound.getMelody() === (o.key as any)" name="check" :size="16"/>
      </button>
    </div>
    <template #footer>
      <ButtonAction label="Test melody" variant="primary" @click="sound.test()" />
      <ButtonAction label="Close" variant="secondary" @click="props.onClose?.()" />
    </template>
  </ModalPanel>
</template>
<style scoped>
.list{display:flex;flex-direction:column;align-items:stretch;gap:0;align-self:stretch;border-radius:12px;overflow:hidden}
.item{display:flex;height:40px;padding:0 6px 0 14px;align-items:center;gap:6px;justify-content:space-between;border-bottom:1px solid var(--Outline);background:var(--Tonalcontainer);color:#fff}
.name{color:rgba(255,255,255,.96)}
</style>
