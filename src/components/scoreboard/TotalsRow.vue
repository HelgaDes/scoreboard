<script setup lang="ts">
import { computed } from 'vue'
import type { ScoreboardTotalsDTO } from '@/services/scoreboard/types'

/** Minimal row shape used only for local fallback aggregation. */
export interface Row {
  id: number | string
  agent: string
  a1?: number | string
  daily?: number | null
  a2?: number | string
  weekly?: number | null
  a3?: number | string
  monthly?: number | null
  goal?: number | string | null
}

const props = defineProps<{
  rows: Row[]
  /**
   * Prefer server-provided totals (aggregated over the FULL dataset).
   * If missing (e.g., during local dev), we fall back to summing `rows`.
   */
  totals?: ScoreboardTotalsDTO | null
}>()

/** Safe number coercion. */
function toNum(v: unknown): number {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

/** Money formatter (USD). */
function money(n: number): string {
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  })
}

/**
 * Final totals shown in the footer.
 * 1) Use backend totals if provided (correct across entire dataset)
 * 2) Fallback: aggregate from the passed-in rows slice
 */
const totals = computed(() => {
  if (props.totals) {
    const t = props.totals
    const g = toNum(t.goal)
    return {
      c1: toNum(t.counts.daily),
      c2: toNum(t.counts.weekly),
      c3: toNum(t.counts.monthly),
      d:  toNum(t.revenue.daily),
      w:  toNum(t.revenue.weekly),
      m:  toNum(t.revenue.monthly),
      g,
      gSeen: t.goal != null,
    }
  }

  // Fallback aggregation from the visible/limited rows
  let c1 = 0, c2 = 0, c3 = 0
  let d = 0, w = 0, m = 0, g = 0, gSeen = false
  for (const r of props.rows) {
    c1 += toNum(r.a1)
    c2 += toNum(r.a2)
    c3 += toNum(r.a3)
    d  += toNum(r.daily)
    w  += toNum(r.weekly)
    m  += toNum(r.monthly)
    const gv = toNum(r.goal)
    if (gv) { g += gv; gSeen = true }
  }
  return { c1, c2, c3, d, w, m, g, gSeen }
})
</script>

<template>
  <div class="totals">
    <div class="col col--label BodySmall">Totals</div>

    <div class="col col--amt BodyMedium">{{ totals.c1 }}</div>
    <div class="col col--period BodyMedium">{{ money(totals.d) }}</div>

    <div class="col col--amt BodyMedium">{{ totals.c2 }}</div>
    <div class="col col--period BodyMedium">{{ money(totals.w) }}</div>

    <div class="col col--amt BodyMedium">{{ totals.c3 }}</div>
    <div class="col col--period BodyMedium">{{ money(totals.m) }}</div>

    <div class="col col--goal BodyMedium">
      {{ totals.gSeen ? money(totals.g) : '-' }}
    </div>
  </div>
</template>

<style scoped lang="scss">
$onSurfVar: var(--OnSurfaceVariant, var(--On-Surface-Variant, #7B8592));
$onSurf:    var(--OnSurface,        var(--On-Surface,        #E3E3E3));

.totals {
  display: flex;
  height: 50px;
  align-items: center;
  align-self: stretch;
  gap: 1px;
  width: 100%;
}

.col {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: stretch;
  color: #{$onSurf};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Left label */
.col--label {
  width: 200px;
  padding-left: 16px;
  align-items: flex-start;
  gap: 10px;
  color: #{$onSurfVar};
  text-align: left;
}

/* Centered numeric columns */
.col--amt {
  width: 60px;        /* Amount columns stay 60px */
  align-items: center;
  text-align: center;
}

/* Wider Goal to match table rows (70px) */
.col--goal {
  width: 70px;        /* +10px compared to Amount */
  align-items: center;
  text-align: center;
}

/* Period money columns stretch */
.col--period {
  width: 120px;
  flex: 1 0 0;
  align-items: flex-start;
  text-align: left;
}
</style>
