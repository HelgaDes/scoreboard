<!-- src/components/scoreboard/ScoreTable.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import Divider from '@/components/ui/Divider.vue'
import Checkbox from '@/components/ui/Checkbox.vue'

/** 16px remove-group icon (colored via CSS mask via currentColor) */
import iconRemoveGroup from '@/assets/icons/Icon-remove-group.svg?url'

/** Base agent row used by the table. */
export type BaseRow = {
  id: string | number
  type?: 'base'
  agent: string
  a1?: number | string
  daily?: number | string
  a2?: number | string
  weekly?: number | string
  a3?: number | string
  monthly?: number | string
  goal?: number | string
}

/** Aggregated group row. */
export type GroupRow = {
  id: string | number
  type: 'group'
  agent: string
  memberIds: Array<string | number>
  a1?: number | string
  daily?: number | string
  a2?: number | string
  weekly?: number | string
  a3?: number | string
  monthly?: number | string
  goal?: number | string
}

const props = defineProps<{
  rows: Array<BaseRow | GroupRow>
  groupingOn: boolean
  selectedIds: Array<string | number>
}>()

const emit = defineEmits<{
  (e: 'toggle-select', id: string | number): void
  (e: 'ungroup', id: string | number): void
}>()

/** Always render exactly 7 rows (real + skeleton fillers). */
const MAX_ROWS = 7
const realRows = computed(() => props.rows ?? [])
const emptyCount = computed(() => Math.max(0, MAX_ROWS - realRows.value.length))

/** Selection set for checkboxes (used only when groupingOn). */
const selectedSet = computed(() => new Set(props.selectedIds.map(String)))
const isSelected  = (id: string | number) => selectedSet.value.has(String(id))

/** Safe cell passthrough for non-money values. */
function cell(v: unknown) {
  return (v ?? '') as any
}

/** Money formatter (USD) – hard round to 2 decimals to avoid float artifacts. */
function moneyCell(v: unknown) {
  const n = Number(v)
  if (!Number.isFinite(n)) return (v ?? '') as any
  const rounded = Math.round(n * 100) / 100
  return rounded.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
</script>

<template>
  <div class="tbl-wrap">
    <!-- header -->
    <div class="thead">
      <div class="th th--num">#</div>
      <div class="th th--agent">Agent</div>

      <div class="th th--amt">Amount</div>
      <div class="th th--period">Daily</div>

      <div class="th th--amt">Amount</div>
      <div class="th th--period">Weekly</div>

      <div class="th th--amt">Amount</div>
      <div class="th th--period">Monthly</div>

      <div class="th th--goal">Goal</div>
    </div>

    <!-- divider under header -->
    <Divider class="row-divider" aria-hidden="true" />

    <!-- body -->
    <div class="tbody">
      <!-- real rows -->
      <template v-for="(r, i) in realRows" :key="`row-${(r as any).id}`">
        <div class="tr" :class="{ 'tr--group': (r as any).type === 'group' }">
          <!-- index -->
          <div class="td td--num">{{ i + 1 }}</div>

          <!-- agent / group with LEFT control column:
               - checkbox (base rows) when groupingOn
               - remove-group icon (group rows) when groupingOn
               Keeps a single aligned control column. -->
          <div class="td td--agent">
            <div class="agent-cell">
              <Checkbox
                  v-if="groupingOn && (r as any).type !== 'group'"
                  :model-value="isSelected((r as any).id)"
                  :title="isSelected((r as any).id) ? 'Selected' : 'Not selected'"
                  @update:modelValue="() => emit('toggle-select', (r as any).id)"
              />
              <button
                  v-else-if="groupingOn && (r as any).type === 'group'"
                  class="icon-btn"
                  :style="{ '--ico': `url(${iconRemoveGroup})` }"
                  title="Remove group"
                  aria-label="Remove group"
                  @click="emit('ungroup', (r as any).id)"
              />
              <span class="agent-text" :title="(r as any).agent">{{ (r as any).agent }}</span>
            </div>
          </div>

          <!-- values -->
          <div class="td td--amt">{{ cell((r as any).a1) }}</div>
          <div class="td td--period">{{ moneyCell((r as any).daily) }}</div>
          <div class="td td--amt">{{ cell((r as any).a2) }}</div>
          <div class="td td--period">{{ moneyCell((r as any).weekly) }}</div>
          <div class="td td--amt">{{ cell((r as any).a3) }}</div>
          <div class="td td--period">{{ moneyCell((r as any).monthly) }}</div>
          <div class="td td--goal">{{ moneyCell((r as any).goal) }}</div>
        </div>

        <!-- divider between rows -->
        <Divider
            v-if="i < realRows.length - 1 || emptyCount > 0"
            class="row-divider"
            aria-hidden="true"
        />
      </template>

      <!-- skeleton rows to always fill 7 -->
      <template v-for="n in emptyCount" :key="`empty-${n}`">
        <div class="tr tr--empty" aria-hidden="true">
          <div class="td td--num"></div>
          <div class="td td--agent">
            <div class="agent-cell">
              <!-- keep the control column width (16px) aligned with checkboxes/icons -->
              <span class="placeholder-16"></span>
              <span class="agent-text"></span>
            </div>
          </div>

          <div class="td td--amt"></div>
          <div class="td td--period"></div>

          <div class="td td--amt"></div>
          <div class="td td--period"></div>

          <div class="td td--amt"></div>
          <div class="td td--period"></div>

          <div class="td td--goal"></div>
        </div>

        <Divider v-if="n < emptyCount" class="row-divider" aria-hidden="true" />
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
$onSurfVar: var(--OnSurfaceVariant, var(--On-Surface-Variant, #7B8592));
$onSurf:    var(--OnSurface,        var(--On-Surface,        #E3E3E3));

.tbl-wrap{ width:100%; display:flex; flex-direction:column; }

/* header */
.thead{ display:flex; align-items:center; gap:1px; align-self:stretch; }
.th{
  color:#{$onSurfVar};
  font: 400 12px/16px Oswald;
  letter-spacing:.25px;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  text-align:center;
  align-self:stretch;
}
.th--num   { width:40px;  padding:5px 14px; }
.th--agent { width:160px; text-align:left; align-items:flex-start; }
.th--amt   { width:60px; }
.th--goal  { width:70px; }
.th--period{ flex:1 0 0; text-align:left; align-items:flex-start; }

/* body */
.tbody{ display:flex; flex-direction:column; }
.tr{
  display:flex;
  height:40px;
  align-items:center;
  gap:1px;
}
.td{
  color:#{$onSurf};
  font: 400 14px/20px Oswald;
  letter-spacing:.25px;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  text-align:center;
}
.td--num{
  width:40px;
  padding:5px 14px;
  color:#{$onSurfVar};
  font: 700 20px/32px Oswald;
}
.td--agent{
  width:160px;
  text-align:left;
  align-items:flex-start;
}
.td--amt  { width:60px; }
.td--goal { width:70px; }
.td--period{
  width:120px; flex:1 0 0;
  text-align:left; align-items:flex-start;
}

/* row divider (header & rows) */
.row-divider{
  align-self: stretch;
  height: 1px;
  background: var(--Outline-Variant, rgba(255,255,255,.06));
}

/* keep layout height for empty skeleton rows */
.tr--empty{
  display:flex;
  height:40px;
  align-items:center;
  gap:1px;
}

/* agent cell: let content shrink for proper ellipsis */
.agent-cell{
  display:flex;
  align-items:center;
  gap:8px;
  width:100%;
  min-width:0; /* allow inner text to shrink */
}

/* 16px mask-based icon button (aligns with checkbox column) */
.icon-btn{
  width:16px; height:16px; flex:0 0 16px;
  display:inline-block;
  border:0; padding:0;
  cursor:pointer;

  background: currentColor;
  -webkit-mask: var(--ico) no-repeat center / 16px 16px;
  mask: var(--ico) no-repeat center / 16px 16px;

  opacity:.85;
}
.icon-btn:hover{ opacity:1; }

/* placeholder to keep control column aligned in skeleton rows */
.placeholder-16{ width:16px; height:16px; flex:0 0 16px; }

/* Truncate long names (agents & groups) */
.agent-text{
  flex:1 1 auto;
  min-width:0;
  overflow:hidden;
  white-space:nowrap;
  text-overflow:ellipsis;
}

/* Emphasize group name only */
.tr--group .agent-text{ font-weight:600; }
</style>

