<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import Icon from '@/components/ui/Icon.vue'
import ButtonAction from '@/components/ui/ButtonAction.vue'
import { useSound } from '@/composables/useSound'
import bgMelodyUrl from '@/assets/bg-blur-modal-melody.svg?url'

const props = defineProps<{ onClose?: () => void }>()
const emit = defineEmits<{ (e: 'close'): void }>()
const sound = useSound()

const options = [
  { key:'fanfare',   label:'Fanfare' },
  { key:'herecomes', label:'Here Comes' },
  { key:'pimp',      label:'Pimp' }
] as const

function close() {
  sound.stop()
  emit('close')
  props.onClose?.()
}

onBeforeUnmount(() => {
  sound.stop()
})
</script>

<template>
  <div class="modal" role="dialog" aria-label="Select melody">
    <img class="modal__bg" :src="bgMelodyUrl" alt="" aria-hidden="true" />

    <div class="modal__content">
      <div class="hdr">
        <div class="H2" style="text-align:center">Select melody</div>
      </div>

      <div class="list">
        <button
            v-for="o in options"
            :key="o.key"
            class="item"
            type="button"
            @click="sound.setMelody(o.key as any)"
        >
          <span class="name BodySmall">{{ o.label }}</span>
          <Icon v-if="sound.getMelody() === (o.key as any)" name="check" :size="16" />
        </button>
      </div>

      <div class="divider" role="separator" aria-orientation="horizontal" />

      <div class="actions">
        <ButtonAction class="act" label="Test melody"  variant="primary"   @click="sound.test()" />
        <ButtonAction class="act" label="Close"        variant="secondary" @click="close" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal{
  position: relative;
  width: 280px;
  display: grid;
}

.modal__bg{
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  pointer-events: none;
  user-select: none;
}

.modal__content{
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  box-sizing: border-box;
}

.hdr{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  margin-bottom: 12px;
}

.list{ display:flex; flex-direction:column; align-items:stretch; border-radius:12px; overflow:hidden; }
.item{
  display:flex; height:40px; padding:0 6px 0 14px; align-items:center; gap:6px;
  justify-content:space-between; border-bottom:1px solid var(--Outline);
  background: var(--TonalContainer, rgba(10,14,20,.5));
  color:#fff;
}
.item:last-child{ border-bottom:0; }
.name{ color: rgba(255,255,255,.96); }

.divider{ height:1px; background: var(--Outline-Variant); margin:16px 0 6px 0; }
.actions{ display:flex; flex-direction:column; gap:8px; }
.actions .act{ width:100%; }
</style>
