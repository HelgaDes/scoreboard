<script setup lang="ts">
import HeaderBar from '@/components/layout/HeaderBar.vue'
import TableContainer from '@/components/scoreboard/TableContainer.vue'
import SegmentedControl from '@/components/ui/SegmentedControl.vue'
import ButtonAccent from '@/components/ui/ButtonAccent.vue'
import ButtonSecondary from '@/components/ui/ButtonSecondary.vue'
import ScoreTable, { type BaseRow, type GroupRow } from '@/components/scoreboard/ScoreTable.vue'
import TotalsRow from '@/components/scoreboard/TotalsRow.vue'
import TotalWidget from '@/components/scoreboard/TotalWidget.vue'
import SelectMelodyModal from '@/components/modals/SelectMelodyModal.vue'

import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSound } from '@/composables/useSound'
import { getScoreService } from '@/services/scoreboard'
import { toRow } from '@/mappers/scoreboard'
import { getGroupService } from '@/services/groups'

/* ------- router / tabs ------- */
const route = useRoute(), router = useRouter()
const activeTab = ref(String(route.query.tab ?? 'sales'))
watch(activeTab, v => router.replace({ query: { ...route.query, tab: v } }))
const tabs = [{ label: 'Sales', value: 'sales' }, { label: 'Retention', value: 'retention' }]

/* ------- sound / modal ------- */
const sound = useSound()
const showMelody = ref(false)
const volumeOn = computed<boolean>(() => !!sound.enabled.value)

/* ------- дані таблиці ------- */
const rawRows = ref<BaseRow[]>([])
async function load () {
  const res = await getScoreService().getScoreboard({
    tab: activeTab.value as any,
    limit: 7,
    sort: 'monthly',
    order: 'desc'
  })
  rawRows.value = res.rows.map(toRow)
}
watch(activeTab, load, { immediate: true })

/* ------- групи ------- */
type GroupDef = { id: string; name: string; memberIds: (string | number)[] }
const groups = ref<GroupDef[]>([])

async function refreshGroups () {
  const api = await getGroupService().list() as any[]
  groups.value = api.map(g => ({
    id: g.id,
    name: g.name,
    memberIds: g.memberIds ?? g.memberAgentIds ?? []
  }))
}
refreshGroups()

const groupingOn  = ref(false)
const selectedIds = ref<Array<string | number>>([])
const canAddGroup = computed(() => groupingOn.value && selectedIds.value.length > 0)

/* допоміжний boolean щоб TS не бурчав у шаблоні */
const groupingOnBool = computed<boolean>(() => !!groupingOn.value)

function toggleGrouping () {
  groupingOn.value = !groupingOn.value
  if (!groupingOn.value) selectedIds.value = []
}
function toggleSelect (id: string | number) {
  const s = new Set(selectedIds.value)
  s.has(id) ? s.delete(id) : s.add(id)
  selectedIds.value = Array.from(s)
}

function toNum (v: any) { const n = Number(v); return Number.isFinite(n) ? n : 0 }
const visibleRows = computed<(BaseRow | GroupRow)[]>(() => {
  const members = new Set(groups.value.flatMap(g => g.memberIds))
  const base: (BaseRow | GroupRow)[] = rawRows.value.filter(r => !members.has(r.id))
  const list: (BaseRow | GroupRow)[] = [...base]

  for (const g of groups.value) {
    const memberRows = rawRows.value.filter(r => g.memberIds.includes(r.id))
    if (memberRows.length === 0) continue
    const agg: GroupRow = {
      id: g.id, type: 'group', memberIds: [...g.memberIds], agent: g.name,
      a1: memberRows.reduce((s, r) => s + toNum(r.a1), 0),
      daily:   memberRows.reduce((s, r) => s + toNum(r.daily),   0),
      a2:      memberRows.reduce((s, r) => s + toNum(r.a2),      0),
      weekly:  memberRows.reduce((s, r) => s + toNum(r.weekly),  0),
      a3:      memberRows.reduce((s, r) => s + toNum(r.a3),      0),
      monthly: memberRows.reduce((s, r) => s + toNum(r.monthly), 0),
      goal:    memberRows.reduce((s, r) => s + toNum(r.goal),    0) || '-'
    }
    const minIndex = Math.min(...memberRows.map(r => rawRows.value.findIndex(x => x.id === r.id)))
    list.splice(minIndex, 0, agg)
  }
  return list
})

function fmt (n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
}
const totalMonthly = computed(() => visibleRows.value.reduce((s, r) => s + (Number((r as any).monthly) || 0), 0))

async function openGroupingModal () {
  if (!canAddGroup.value) return
  const name = window.prompt('Name group')
  if (!name) return
  await getGroupService().create({ name, memberAgentIds: [...selectedIds.value], tab: activeTab.value as any })
  selectedIds.value = []
  await refreshGroups()
}
async function ungroup (id: string | number) {
  await getGroupService().remove(String(id))
  await refreshGroups()
}

/* ------- UX: закриття модала по Esc ------- */
const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') showMelody.value = false }
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <HeaderBar
      :show-actions="true"
      :volume-on="volumeOn"
      @toggle-volume="sound.toggleEnabled()"
      @open-melody="showMelody = true"
      @logout="$router.push('/login')"
  />

  <!-- Таблиця ховається, коли відкрито модал -->
  <section
      v-show="!showMelody"
      class="table-section"
      style="width:960px;padding:15px 70px 36px 70px;display:flex;justify-content:center;align-items:center;"
  >
    <TableContainer :width="820" :overlay-top="-20">
      <template #overlay>
        <TotalWidget :value="fmt(totalMonthly)" />
      </template>

      <template #header>
        <SegmentedControl v-model="activeTab" :options="tabs" :width="210" />
        <div style="display:inline-grid;grid-auto-flow:column;column-gap:8px;align-items:center;">
          <ButtonAccent v-if="canAddGroup" label="Add Group" @click="openGroupingModal" />
          <ButtonSecondary
              :label="groupingOnBool ? 'Done' : 'Group agents'"
              :pressed="groupingOnBool"
              @click="toggleGrouping"
          />
        </div>
      </template>

      <ScoreTable
          :rows="visibleRows"
          :grouping-on="groupingOnBool"
          :selected-ids="selectedIds"
          @toggle-select="toggleSelect"
          @ungroup="ungroup"
      />

      <template #totals>
        <TotalsRow :rows="visibleRows as any" />
      </template>
    </TableContainer>
  </section>

  <!-- Модал-шар без бекдропа. Видно Header + ця область -->
  <div
      v-if="showMelody"
      class="melody-layer"
      role="dialog"
      aria-modal="true"
      aria-label="Select melody"
  >
    <SelectMelodyModal @close="showMelody = false" />
  </div>
</template>

<style scoped>
.melody-layer{
  position: fixed;
  inset: 0;
  display: grid;
  place-items: start center;
  padding-top: 40px;     /* як просили */
  z-index: 20;
  pointer-events: auto;  /* кліки в модалі працюють, поза ним – ігнор */
}
</style>
