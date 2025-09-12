<script setup lang="ts">
import { ref, provide } from 'vue'
import { RouterView } from 'vue-router'
import { useStageScale } from '@/composables/useStageScale'
import BgFull from '@/components/BgFull.vue'
import DesignOverlay from '@/components/dev/DesignOverlay.vue'
import DepositHost from '@/components/overlays/DepositHost.vue'

import { OverLayGateKey } from '@/composables/overlayGate'

useStageScale()

const overlayActive = ref(0)
provide(OverLayGateKey, { active: overlayActive })
</script>

<template>
  <BgFull />
  <div class="viewport">
    <div ref="shell" class="stage-shell">
      <div class="stage">
        <DesignOverlay />
        <div id="stage-overlay" class="stage-overlay" />
        <RouterView />

        <DepositHost />
      </div>
    </div>
  </div>
</template>





