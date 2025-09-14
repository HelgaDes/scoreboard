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
  goal?: number | string | null      // ← monthly goal USD (target), not %
}

const props = defineProps<{
  rows: Row[]
  /**
   * Prefer server-provided totals (aggregated over the FULL dataset).
   * If missing (e.g., during local dev), fall back to summing `rows`.
   */
  totals?: ScoreboardTotalsDTO | null
}>()

/** Safe number coercion. */
function num(v: unknown): number {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

/** Money formatter (USD). */
function money(n: number): string {
  const r = Math.round(n * 100) / 100
  return r.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/** Percent formatter for the totals Goal column. */
function percent(n: number): string {
  const p = Math.round(n)
  return `${p}%`
}

/**
 * Final totals shown in the footer.
 * 1) Use backend totals if provided (correct across entire dataset)
 * 2) Fallback: aggregate from the passed-in rows slice
 */
const view = computed(() => {
  // 1) Server totals (preferred)
  if (props.totals) {
    const t = props.totals
    const c1 = num(t.counts.daily)
    const c2 = num(t.counts.weekly)
    const c3 = num(t.counts.monthly)
    const d  = num(t.revenue.daily)
    const w  = num(t.revenue.weekly)
    const m  = num(t.revenue.monthly)
    const gSum = num(t.goal)
    const gSeen = t.goal != null && gSum > 0
    const gPct = gSeen ? (m / gSum) * 100 : NaN
    return { c1, c2, c3, d, w, m, gSeen, gPct }
  }

  // 2) Fallback: compute from rows
  let c1 = 0, c2 = 0, c3 = 0
  let d = 0, w = 0, m = 0
  let gSum = 0, gSeen = false
  for (const r of props.rows) {
    c1 += num(r.a1); c2 += num(r.a2); c3 += num(r.a3)
    d  += num(r.daily); w += num(r.weekly); m += num(r.monthly)
    const g = num(r.goal)
    if (g > 0) { gSum += g; gSeen = true }
  }
  const gPct = gSeen && gSum > 0 ? (m / gSum) * 100 : NaN
  return { c1, c2, c3, d, w, m, gSeen, gPct }
})
</script>

<template>
  <div class="totals">
    <div class="col col--label BodySmall">Totals</div>

    <div class="col col--amt BodyMedium">{{ view.c1 }}</div>
    <div class="col col--period BodyMedium">{{ money(view.d) }}</div>

    <div class="col col--amt BodyMedium">{{ view.c2 }}</div>
    <div class="col col--period BodyMedium">{{ money(view.w) }}</div>

    <div class="col col--amt BodyMedium">{{ view.c3 }}</div>
    <div class="col col--period BodyMedium">{{ money(view.m) }}</div>

    <!-- Goal as completion % across the whole dataset -->
    <div class="col col--goal BodyMedium">
      {{ view.gSeen ? percent(view.gPct) : '—' }}
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
  width: 60px;
  align-items: center;
  text-align: center;
}

/* Goal */
.col--goal {
  width: 70px;
  align-items: center;
  text-align: center;
}

/* Period $ columns stretch */
.col--period {
  width: 120px;
  flex: 1 0 0;
  align-items: flex-start;
  text-align: left;
}
</style>

