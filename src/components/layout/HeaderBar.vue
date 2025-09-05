<script setup lang="ts">
import Icon from '@/components/ui/Icon.vue'

const props = withDefaults(defineProps<{
  title?: string
  showActions?: boolean
  volumeOn?: boolean
}>(), {
  title: 'Sales Scoreboard',
  showActions: true,
  volumeOn: true,
})

const emit = defineEmits<{
  (e: 'toggle-volume'): void
  (e: 'open-melody'): void
  (e: 'logout'): void
}>()
</script>

<template>
  <header class="hdr">
    <h1 class="H1">{{ props.title }}</h1>

    <div v-if="props.showActions" class="actions">
      <div class="group">
        <button class="icon-btn" aria-label="sound" title="sound" @click="emit('open-melody')">
          <Icon name="sound" />
        </button>

        <button
            class="icon-btn"
            :aria-pressed="props.volumeOn ? 'true' : 'false'"
            :title="props.volumeOn ? 'volume-up' : 'volume-off'"
            aria-label="volume"
            @click="emit('toggle-volume')"
        >
          <Icon :name="props.volumeOn ? 'volume-up' : 'volume-off'" />
        </button>
      </div>

      <button class="icon-btn" aria-label="logout" title="logout" @click="emit('logout')">
        <Icon name="logout" />
      </button>
    </div>
  </header>
</template>

<style scoped>
.hdr{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:12px 16px;
}

.actions{
  display:flex;
  align-items:center;
  gap:16px;
  --hdr-icon: rgba(255,255,255,.86);
  --hdr-icon-active: #fff;
  color: var(--hdr-icon);
}
.group{ display:flex; align-items:center; gap:8px; }

.icon-btn{
  width:28px; height:28px;
  display:grid; place-items:center;
  border-radius:999px;
  background: var(--SurfaceContainer, rgba(255,255,255,.06));
  color: inherit; /* svg бере currentColor */
  transition: background .15s ease, color .15s ease, opacity .15s ease;
}

.actions :deep(svg),
.actions :deep(path),
.actions :deep(circle),
.actions :deep(rect){
  fill: currentColor;
  stroke: currentColor;
}

@media (hover:hover){
  .actions .icon-btn:hover{
    background: var(--OnSurfaceContainer, #C4C7C5);
    color: var(--SurfaceContainer, #242426);
  }
}

.icon-btn[aria-pressed="true"]{
  color: var(--hdr-icon-active);
}

.hdr .H1{
  color: var(--On-Surface-Variant, #7B8592);
}
</style>
