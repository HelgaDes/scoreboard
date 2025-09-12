<script setup lang="ts">
import { ref, computed } from 'vue'
import TextField from '@/components/ui/TextField.vue'
import ButtonAction from '@/components/ui/ButtonAction.vue'
import Divider from '@/components/ui/Divider.vue'
import bgUrl from '@/assets/bg-blur-modal-grouping.svg?url'

/** Selected agent names to preview (comma-separated). */
const props = defineProps<{ members?: string[] }>()
const emit = defineEmits<{ (e:'create', name:string):void; (e:'close'):void }>()

const name = ref('')
const err  = ref<string | null>(null)
const membersText = computed(() => (props.members ?? []).join(', '))

function submit () {
  const v = name.value.trim()
  if (!v) { err.value = 'Please enter group name'; return }
  err.value = null
  emit('create', v)
}
</script>

<template>
  <div class="modal" role="dialog" aria-label="Add group">
    <!-- keep svg bg for the whole modal -->
    <div class="modal__bg" :style="{ backgroundImage: `url(${bgUrl})` }" aria-hidden="true" />
    <div class="modal__content">
      <div class="hdr"><div class="H2" style="text-align:center">Grouping agents</div></div>

      <!-- selected agents preview (no background) -->
      <div
          v-if="membersText"
          class="members"
          :title="membersText"
          aria-label="Selected agents"
      >
        {{ membersText }}
      </div>

      <div class="body">
        <TextField v-model="name" placeholder="Group name" :block="true" clearable />
      </div>

      <!-- Divider between input and buttons -->
      <Divider class="divider" aria-hidden="true" />

      <div class="actions">
        <ButtonAction label="Add Group" variant="primary" :block="true" @click="submit" />
        <ButtonAction label="Close" variant="secondary" :block="true" @click="emit('close')" />
      </div>

      <div v-if="err" class="err BodySmall">{{ err }}</div>
    </div>
  </div>
</template>

<style scoped>
.modal{ width:280px; display:grid; }

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

/* Selected agents: no background, 2 lines, Body Small spec */
.members{
  /* clamp to 2 lines */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  flex: 1 0 0;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  text-align: center;

  /* tokens & typography */
  color: var(--On-Surface-Variant, #7B8592);
  font-family: Oswald, sans-serif;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;

  min-height: 32px;
  margin: 0 8px 8px;
  padding: 0;
}

.body{ margin-top: 4px; }

.divider{
  margin: 12px 0 8px;
  align-self: stretch;
}

.actions{
  display: grid;
  row-gap: 8px;
  margin-bottom: 6px;
}

.err{
  text-align: center;
  color: #ffb4ab;
}
</style>

