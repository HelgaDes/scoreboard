<script setup lang="ts">
const props = withDefaults(defineProps<{ width?: number; overlayTop?: number }>(), { width: 820, overlayTop: -20 })
</script>
<template>
  <section class="tbl" :style="{ width: props.width + 'px' }">
    <div class="tbl__bg" aria-hidden="true" />
    <div class="tbl__overlay" :style="{ top: props.overlayTop + 'px' }">
      <slot name="overlay" />
    </div>
    <header class="tbl__header"><slot name="header" /></header>
    <div class="tbl__rows"><slot /></div>
    <footer class="tbl__totals"><slot name="totals" /></footer>
  </section>
</template>
<style scoped lang="scss">
.tbl { position: relative; display:flex; padding: 16px 8px 8px 8px; flex-direction: column; align-items:flex-start; flex-shrink:0; box-sizing:border-box; }
.tbl__bg { position:absolute; inset:0; z-index:-1; border-radius:20px; background:url('/src/assets/bg-blur-table.svg') center / 100% 100% no-repeat; }
.tbl__overlay { position:absolute; left:50%; transform:translateX(-50%); z-index:2; }
.tbl__header { display:flex; padding:0 8px 16px; justify-content:space-between; align-items:center; align-self:stretch; }
.tbl__rows { display:flex; padding-bottom:8px; flex-direction:column; align-items:flex-start; align-self:stretch; }
.tbl__totals { display:flex; height:50px; align-items:center; align-self:stretch; border-radius:100px; background: var(--Tonalcontainer); box-shadow: 0 -0.318px 0.636px rgba(255,255,255,.30) inset, 0 -0.318px 0.636px rgba(255,255,255,.25) inset, 0.636px 0.955px 2.545px rgba(0,0,0,.08) inset, 0.636px 0.955px 2.545px rgba(0,0,0,.10) inset; padding:8px 12px; box-sizing:border-box; }
</style>
