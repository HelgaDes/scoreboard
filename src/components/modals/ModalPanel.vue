<script setup lang="ts">
import Divider from '@/components/ui/Divider.vue'
import bgUrl from '@/assets/bg-blur-modal.svg?url'
const props = withDefaults(defineProps<{ title?: string; description?: string }>(), {})
</script>

<template>
  <div class="modal">
    <!-- фон рівно під контейнером -->
    <div class="modal-bg" :style="{ backgroundImage: `url(${bgUrl})` }" aria-hidden="true"></div>

    <div class="modal-content">
      <div class="hdr">
        <div class="H2" style="text-align:center">{{ props.title }}</div>
        <div v-if="props.description" class="BodySmall desc">{{ props.description }}</div>
      </div>

      <div class="body"><slot /></div>

      <Divider />

      <div class="actions"><slot name="footer" /></div>
    </div>
  </div>
</template>

<style scoped>
/* Контейнер модалки: ширина фіксована, висота росте від контенту */
.modal{
  position: relative;
  display: block;
  width: 280px;            /* <-- фіксуємо 280px */
}

/* Шар фону: завжди точно дорівнює розмірам модалки */
.modal-bg{
  position: absolute;
  inset: 0;                /* top/right/bottom/left = 0 */
  background-repeat: no-repeat;
  background-position: center;
  background-size: 280px 100%;   /* <-- ширина 280px, висота = 100% модалки */
  pointer-events: none;
  user-select: none;
  z-index: 0;
}

/* Весь контент поверх фону */
.modal-content{
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  box-sizing: border-box;  /* щоб внутрішні відступи не роздували ширину */
  align-items: stretch;
}

.hdr{
  display: flex;
  padding: 8px 0;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  align-self: stretch;
}
.desc{ color: var(--On-Surface-Variant); }

.body{
  display: flex;
  padding-top: 12px;
  flex-direction: column;
  gap: 16px;
  align-self: stretch;     /* інпути/повідомлення тягнуться на 100% */
}

.actions{
  display: flex;
  gap: 8px;
  align-self: stretch;
  justify-content: stretch;
}
.actions > *{ flex: 1 1 0; }
</style>











