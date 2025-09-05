<script setup lang="ts">
import Checkbox from '@/components/ui/Checkbox.vue'
import Icon from '@/components/ui/Icon.vue'

export type BaseRow = {
  id: string|number
  agent: string
  a1?: number|string
  daily?: number
  a2?: number|string
  weekly?: number
  a3?: number|string
  monthly?: number
  goal?: number|string
}
export type GroupRow = BaseRow & { type: 'group', memberIds: Array<string|number> }

const props = defineProps<{
  rows: (BaseRow|GroupRow)[]
  groupingOn?: boolean
  selectedIds?: Array<string|number>
}>()
const emit = defineEmits<{
  (e:'toggle-select', id:string|number): void
  (e:'ungroup', id:string|number): void
}>()

function money(n?: number){ return n==null ? '-' : n.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}) }
function isGroup(r: BaseRow|GroupRow): r is GroupRow { return (r as any).type === 'group' }
</script>

<template>
  <div class="tbl-wrap">
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

    <div class="tbody">
      <div v-for="(r,i) in rows" :key="r.id" class="tr" :class="{ 'tr--group': isGroup(r) }">
        <div class="td td--num Numbering">{{ i+1 }}</div>

        <div class="td td--agent">
          <div class="agent-cell">
            <Checkbox v-if="!isGroup(r) && props.groupingOn" :model-value="props.selectedIds?.includes(r.id) ?? false" @update:model-value="() => emit('toggle-select', r.id)" />
            <Icon v-if="isGroup(r)" name="grouping-on" :size="16" style="margin-right:6px"/>
            <span class="agent-text">{{ r.agent }}</span>
            <button v-if="isGroup(r)" class="inline-icon" title="Ungroup" @click="emit('ungroup', r.id)">
              <Icon name="remove-group" :size="16"/>
            </button>
          </div>
        </div>

        <div class="td td--amt">{{ r.a1 ?? '-' }}</div>
        <div class="td td--period">{{ money((r as any).daily) }}</div>
        <div class="td td--amt">{{ r.a2 ?? '-' }}</div>
        <div class="td td--period">{{ money((r as any).weekly) }}</div>
        <div class="td td--amt">{{ r.a3 ?? '-' }}</div>
        <div class="td td--period">{{ money((r as any).monthly) }}</div>
        <div class="td td--goal">{{ r.goal ?? '-' }}</div>
      </div>
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
.th--amt,
.th--goal  { width:60px;  }
.th--period{ flex:1 0 0;  text-align:left; align-items:flex-start; }

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
.td--amt,
.td--goal{ width:60px; }
.td--period{
  width:120px; flex:1 0 0;
  text-align:left; align-items:flex-start;
}

.agent-cell{ display:flex; align-items:center; gap:8px; }
.inline-icon{ margin-left:8px; background:none; border:0; padding:0; display:inline-flex; align-items:center; cursor:pointer; }
.tr--group .agent-text{ font-weight:600 }
</style>

