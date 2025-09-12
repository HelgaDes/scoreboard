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
import GroupingModal from '@/components/modals/GroupingModal.vue'

import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSound } from '@/composables/useSound'
import { getScoreService } from '@/services/scoreboard'
import { toRow } from '@/mappers/scoreboard'
import { getGroupService } from '@/services/groups'
import type { ScoreboardTotalsDTO, ScoreTab } from '@/services/scoreboard/types'

import { useOverlayActive } from '@/composables/useOverlayGate'

import iconGroupingOn  from '@/assets/icons/Icon-grouping-on.svg?url'
import iconGroupingOff from '@/assets/icons/Icon-grouping-off.svg?url'
import iconAdd         from '@/assets/icons/Icon-add.svg?url'

const MAX_ROWS = 7
const FETCH_LIMIT = 50

const overlayActive = useOverlayActive()

/* ---- routing / tabs ---- */
const route = useRoute(), router = useRouter()
const activeTab = ref<ScoreTab>(String(route.query.tab ?? 'sales') as ScoreTab)
const tabs = [{ label: 'Sales', value: 'sales' }, { label: 'Retention', value: 'retention' }]
watch(activeTab, v => router.replace({ query: { ...route.query, tab: v } }))

/* ---- sound / modals ---- */
const sound = useSound()
const showMelody   = ref(false)
const showGrouping = ref(false)

/* ---- table data ---- */
const rawRows   = ref<BaseRow[]>([])
const apiTotals = ref<ScoreboardTotalsDTO | null>(null)
async function load () {
  try {
    const res = await getScoreService().getScoreboard({
      tab: activeTab.value, limit: FETCH_LIMIT, sort: 'monthly', order: 'desc'
    })
    rawRows.value   = res.rows.map(toRow)
    apiTotals.value = res.totals ?? null
  } catch {
    rawRows.value = []
    apiTotals.value = null
  }
}

/* ---- groups ---- */
type GroupDef = { id: string; name: string; memberIds: (string | number)[] }
const groups = ref<GroupDef[]>([])
async function refreshGroups () {
  const api = await getGroupService().list(activeTab.value) as any[]
  groups.value = api.map(g => ({
    id: g.id, name: g.name, memberIds: g.memberAgentIds ?? g.memberIds ?? []
  }))
}

/* ---- grouping state ---- */
const groupingOn  = ref(false)
const selectedIds = ref<Array<string | number>>([])
const GROUPING_KEY = (tab: ScoreTab) => `sb:grouping:${tab}`
function loadGroupingState(tab: ScoreTab){
  groupingOn.value = localStorage.getItem(GROUPING_KEY(tab)) === '1'
}
watch(groupingOn, v => localStorage.setItem(GROUPING_KEY(activeTab.value), v ? '1' : '0'))

watch(activeTab, async (tab) => {
  selectedIds.value = []
  loadGroupingState(tab)
  await load()
  await refreshGroups()
}, { immediate: true })

/* ---- selection ---- */
const canAddGroup    = computed(() => groupingOn.value && selectedIds.value.length > 0)
const groupingOnBool = computed<boolean>(() => !!groupingOn.value)
const selectedNames  = computed(() => {
  const sel = new Set(selectedIds.value.map(String))
  return rawRows.value.filter(r => sel.has(String(r.id))).map(r => r.agent)
})
function toggleGrouping(){ groupingOn.value = !groupingOn.value; if (!groupingOn.value) selectedIds.value = [] }
function toggleSelect(id: string | number){
  const s = new Set(selectedIds.value)
  s.has(id) ? s.delete(id) : s.add(id)
  selectedIds.value = [...s]
}

/* ---- visible rows (merge groups) ---- */
function toNum (v: any) { const n = Number(v); return Number.isFinite(n) ? n : 0 }
const visibleRows = computed<(BaseRow | GroupRow)[]>(() => {
  const rows = rawRows.value
  if (!rows.length) return []
  if (!groupingOn.value) return rows.slice(0, MAX_ROWS)

  const posById = new Map<string, number>()
  rows.forEach((r, i) => posById.set(String(r.id), i))

  const groupMemberIds = new Set(groups.value.flatMap(g => g.memberIds.map(String)))
  const baseCandidates = rows
      .filter(r => !groupMemberIds.has(String(r.id)))
      .map(r => ({ kind:'base' as const, row:r, pos:posById.get(String(r.id))! }))

  const groupCandidates: Array<{ kind:'group'; row: GroupRow; pos:number }> = []
  for (const g of groups.value) {
    const idx = g.memberIds.map(id => posById.get(String(id))).filter((x): x is number => typeof x === 'number')
    if (!idx.length) continue
    const members = rows.filter(r => g.memberIds.map(String).includes(String(r.id)))
    const agg: GroupRow = {
      id: g.id, type:'group', memberIds:[...g.memberIds], agent:g.name,
      a1: members.reduce((s, r) => s + toNum(r.a1), 0),
      daily: members.reduce((s, r) => s + toNum(r.daily), 0),
      a2: members.reduce((s, r) => s + toNum(r.a2), 0),
      weekly: members.reduce((s, r) => s + toNum(r.weekly), 0),
      a3: members.reduce((s, r) => s + toNum(r.a3), 0),
      monthly: members.reduce((s, r) => s + toNum(r.monthly), 0),
      goal: members.reduce((s, r) => s + toNum(r.goal), 0) || '-'
    }
    groupCandidates.push({ kind:'group', row:agg, pos: Math.min(...idx) })
  }
  return [...baseCandidates, ...groupCandidates]
      .sort((a,b) => a.pos - b.pos)
      .slice(0, MAX_ROWS)
      .map(c => c.row)
})

/* ---- totals ---- */
const monthlyTotal = computed(() =>
    apiTotals.value ? (Number(apiTotals.value.revenue.monthly) || 0)
        : rawRows.value.reduce((s, r) => s + (Number((r as any).monthly) || 0), 0)
)

/* ---- grouping modal ---- */
async function openGroupingModal(){ if (canAddGroup.value) showGrouping.value = true }
async function onGroupingCreate(name: string){
  if (!name?.trim() || selectedIds.value.length === 0) return
  await getGroupService().create({ name: name.trim(), memberAgentIds: [...selectedIds.value], tab: activeTab.value })
  selectedIds.value = []
  showGrouping.value = false
  await refreshGroups()
}
async function ungroup(id: string | number){ await getGroupService().remove(String(id)); await refreshGroups() }

/* ---- ESC ---- */
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    if (showMelody.value) showMelody.value = false
    else if (showGrouping.value) showGrouping.value = false
  }
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <HeaderBar
      :show-actions="true"
      :volume-on="sound.enabled.value"
      @toggle-volume="sound.toggleEnabled()"
      @open-melody="showMelody = true"
      @logout="$router.push('/login')"
  />

  <section
      v-show="!showMelody && !showGrouping && overlayActive === 0"
      class="table-section"
      style="width:960px;padding:15px 70px 36px 70px;display:flex;justify-content:center;align-items:center;"
  >
    <TableContainer :width="820" :overlay-top="-20">
      <template #overlay><TotalWidget :value="monthlyTotal" /></template>

      <template #header>
        <SegmentedControl v-model="activeTab" :options="tabs" :width="210" />
        <div style="display:inline-grid;grid-auto-flow:column;column-gap:8px;align-items:center;">
          <ButtonAccent v-if="canAddGroup" label="Add Group" :icon-src="iconAdd" @click="openGroupingModal" />
          <ButtonSecondary :label="'Grouping'" :pressed="groupingOnBool"
                           :icon-src="groupingOnBool ? iconGroupingOn : iconGroupingOff"
                           @click="toggleGrouping" />
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
        <div class="totals"><TotalsRow :rows="rawRows as any" :totals="apiTotals" /></div>
      </template>
    </TableContainer>
  </section>

  <div v-if="showMelody" class="melody-layer" role="dialog" aria-modal="true" aria-label="Select melody">
    <SelectMelodyModal @close="showMelody = false" />
  </div>

  <div v-if="showGrouping" class="grouping-layer" role="dialog" aria-modal="true" aria-label="Grouping agents">
    <GroupingModal :members="selectedNames" @close="showGrouping = false" @create="onGroupingCreate" />
  </div>
</template>

<style scoped>
.melody-layer,
.grouping-layer{
  position: fixed;
  inset: 0;
  display: grid;
  place-items: start center;
  padding-top: 155px;
  z-index: 30;
  pointer-events: auto;
}
.totals{ display:flex; justify-content:center; align-items:center; width:100%; height:100%; }
</style>


