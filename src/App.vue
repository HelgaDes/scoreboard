<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useStageScale } from '@/composables/useStageScale'
import BgFull from '@/components/BgFull.vue'
import DesignOverlay from '@/components/dev/DesignOverlay.vue'

useStageScale()
</script>

<template>
  <BgFull />
  <div class="viewport">
    <div ref="shell" class="stage-shell">
      <div class="stage">
        <DesignOverlay />
        <div id="stage-overlay" class="stage-overlay" />
        <RouterView />
      </div>
    </div>
  </div>
</template>
