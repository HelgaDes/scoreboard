<script setup lang="ts">

const emit = defineEmits<{ (e:'click'): void }>()

withDefaults(defineProps<{
  label: string
  disabled?: boolean
  iconSrc?: string
  iconRight?: boolean
}>(), {
  disabled: false,
  iconRight: false,
})

function icoStyle(src?: string) {
  return src
      ? { WebkitMaskImage: `url(${src})`, maskImage: `url(${src})` }
      : {}
}
</script>

<template>
  <button
      type="button"
      class="btn-accent"
      :disabled="disabled"
      @click="emit('click')"
  >
    <span
        v-if="iconSrc && !iconRight"
        class="btn-ico"
        :style="icoStyle(iconSrc)"
        aria-hidden="true"
    />
    <span class="label">{{ label }}</span>
    <span
        v-if="iconSrc && iconRight"
        class="btn-ico"
        :style="icoStyle(iconSrc)"
        aria-hidden="true"
    />
  </button>
</template>

<style scoped>

.btn-accent{
  display: flex;
  height: 28px;
  padding: 0 14px 0 10px;
  justify-content: center;
  align-items: center;
  gap: 6px;

  border: 0;
  border-radius: 999px;
  cursor: pointer;
  transition: box-shadow .15s ease;

  --btn-text: var(--Surface-Container, #1A1C1A);
  --btn-bg:   var(--On-Surface-Container, #C4C7C5);
  color: var(--btn-text);
  background: var(--btn-bg);
}

.label{
  font-family: Oswald, sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
}

.btn-ico{
  width: 16px;
  height: 16px;
  background: currentColor;

  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-size: 16px 16px;
  mask-size: 16px 16px;
}

.btn-accent:hover:not(:disabled){
  box-shadow:
      0 1px 2px 0 rgba(0,0,0,.30),
      0 1px 3px 1px rgba(0,0,0,.15);
}

.btn-accent:disabled{
  opacity: .6;
  cursor: default;
  box-shadow: none;
}
</style>

