<script setup lang="ts">
import IconButton from '@/components/ui/IconButton.vue'
import Icon from '@/components/ui/Icon.vue'
const props = withDefaults(defineProps<{ title?: string; showActions?: boolean; volumeOn?: boolean }>(), { title: 'Sales Scoreboard', showActions: true, volumeOn: true })
const emit = defineEmits<{ (e:'toggle-volume'):void; (e:'open-melody'):void; (e:'logout'):void }>()
</script>
<template>
  <header class="hdr">
    <h1 class="H1">{{ props.title }}</h1>
    <div class="spacer"></div>
    <div class="actions" v-if="props.showActions">
      <button class="ibtn" title="Select melody" @click="emit('open-melody')"><Icon name="sound" :size="16"/></button>
      <button class="ibtn" title="Toggle volume" @click="emit('toggle-volume')"><Icon :name="props.volumeOn ? 'volume-up' : 'volume-off'" :size="16"/></button>
      <button class="ibtn" title="Logout" @click="emit('logout')"><Icon name="logout" :size="16"/></button>
    </div>
  </header>
</template>
<style scoped>
.hdr{display:flex;width:960px;padding:12px 24px;align-items:center}
.spacer{flex:1}
.actions{display:flex;gap:8px}
.ibtn{border-radius:100px;display:flex;width:28px;height:28px;align-items:center;justify-content:center;background:var(--SurfaceContainer);color:var(--OnSurfaceContainer);}
.ibtn:hover{background:var(--OnSurfaceContainer);color:var(--SurfaceContainer)}
</style>
