<script setup lang="ts">
import { _useDepositState } from '@/composables/useDepositNotifier'
import DepositNotice from './DepositNotice.vue'
const state = _useDepositState()
</script>
<template>
  <teleport to="#stage-overlay">
    <DepositNotice v-if="state.active" :amount="state.active.amount" :agent="state.active.agent" :message="state.active.message" />
  </teleport>
</template>
