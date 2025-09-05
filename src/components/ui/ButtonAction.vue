<script setup lang="ts">
const { label, variant, type } = defineProps<{
  label: string;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit'
}>()
</script>

<template>
  <button
      class="act"
      :data-variant="variant ?? 'primary'"
      :type="type ?? 'button'"
  >
    {{ label }}
  </button>
</template>

<style scoped>
.act {
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: center;
  align-self: stretch;
  background: transparent;
  border: 0;
  outline: 0;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
  transition: background 0.25s ease, color 0.25s ease, transform 0.1s ease;
}

.act[data-variant="primary"] {
  color: var(--OnSecondary);
  border-radius: 12px;
}

.act[data-variant="secondary"] {
  color: var(--OnSurfaceVariant);
  border-radius: 9px;
}

.act:hover {
  background: var(--SurfaceBlur);
}

.act:active {
  transform: scale(0.96);
}
</style>

