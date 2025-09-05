<script setup lang="ts">
import { ref, computed } from 'vue'
import TextField from '@/components/ui/TextField.vue'
import ButtonAction from '@/components/ui/ButtonAction.vue'
import bgUrl from '@/assets/bg-blur-modal-grouping.svg?url'

const props = defineProps<{ members?: string[] }>()
const emit = defineEmits<{ (e:'create', name:string):void; (e:'close'):void }>()

const name = ref('')
const err  = ref<string | null>(null)
const membersText = computed(() => (props.members ?? []).join(', '))  // ✅ додано

function submit() {
  const v = name.value.trim()
  if (!v) { err.value = 'Please enter group name'; return }
  err.value = null
  emit('create', v)
}
</script>


<template>

  <div class="modal" role="dialog" aria-label="Add group">

    <div
        class="modal__bg"
        :style="{ backgroundImage: `url(${bgUrl})` }"
        aria-hidden="true"
    />


    <div class="modal__content">
      <div class="hdr">
        <div class="H2" style="text-align:center">Add group</div>
      </div>

      <!-- ⬇️ новий рядок із вибраними агентами -->
      <div
          v-if="membersText"
          class="members BodySmall"
          :title="membersText"
          aria-label="Selected agents"
      >
        {{ membersText }}
      </div>

      <div class="body">
        <TextField v-model="name" placeholder="Group name" :block="true" clearable />
      </div>

      <div class="actions">
        <ButtonAction label="Create" variant="primary" :block="true" @click="submit" />
        <ButtonAction label="Cancel" variant="secondary" :block="true" @click="emit('close')" />
      </div>

      <div v-if="err" class="err BodySmall">{{ err }}</div>
    </div>
  </div>
</template>

<style scoped>

.modal{
  width: 280px;
  display: grid;

}

.modal__bg{
  grid-area: 1 / 1;
  align-self: stretch;
  justify-self: stretch;
  background: none center / 100% 100% no-repeat;
  pointer-events: none;
}

.modal__content{
  grid-area: 1 / 1;
  position: relative;
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

.members{
  align-self: stretch;
  height: 32px;
  padding: 0 8px;
  border-radius: 8px;
  background: var(--TonalContainer, rgba(255,255,255,.06));
  color: var(--OnSurface, #E5E9F0);
  line-height: 16px;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-clamp: 2;
}

.actions{
  margin-top: 16px;
  margin-bottom: 6px;
  display: grid;
  row-gap: 8px;
}

.err{
  text-align: center;
  color: #ffb4ab;
}

</style>

