<script setup lang="ts">
import { computed, inject } from 'vue'
import { calculadoraFlowKey } from '@/composables/useCalculadoraFlow'
import { formatCLP } from '@/shared/formatCLP'
import { buildWhatsAppLink } from '@/shared/whatsapp'
import CalcContactBlock from './CalcContactBlock.vue'

const flow = inject(calculadoraFlowKey)!

const sim = computed(() => flow.simulationResult)
const econ = computed(() => sim.value?.economics)
const backup = computed(() => sim.value?.backup)

/** Monto que el usuario ingresó en el slider (> 0). */
const declaredMonthlyBill = computed(() => {
  const v = flow.monthlyBillAmount
  if (typeof v === 'number' && Number.isFinite(v) && v > 0) return v
  return null
})

const fallbackCurrentBill = computed(
  () => econ.value?.current_bill_estimate ?? econ.value?.bill_current ?? null
)

const referenceBill = computed(() => declaredMonthlyBill.value ?? fallbackCurrentBill.value ?? null)

const referenceBillLabel = computed(() =>
  declaredMonthlyBill.value != null ? 'Tu boleta declarada' : 'Boleta estimada'
)

const solarBill = computed(() => econ.value?.new_bill_estimate ?? econ.value?.bill_new ?? null)

const solarBillDisplay = computed(() => {
  const s = solarBill.value
  if (s != null && Number.isFinite(s) && s >= 0) return formatCLP(s)
  return 'Sujeto a evaluación técnica'
})

const referenceBillDisplay = computed(() => {
  const r = referenceBill.value
  if (r != null && Number.isFinite(r) && r > 0) return formatCLP(r)
  return '—'
})

type MonthlySavingsUi =
  | { kind: 'amount'; text: string }
  | { kind: 'lowConsumption' }
  | { kind: 'range'; main: string; sub?: string }
  | { kind: 'none' }

const monthlySavingsUi = computed((): MonthlySavingsUi => {
  const dec = declaredMonthlyBill.value
  const sol = solarBill.value
  if (dec != null && sol != null && Number.isFinite(dec) && Number.isFinite(sol)) {
    const calculated = dec - sol
    if (calculated > 0) {
      return { kind: 'amount', text: formatCLP(Math.round(calculated)) }
    }
    return { kind: 'lowConsumption' }
  }
  const e = econ.value
  if (e?.monthly_savings_min != null && e?.monthly_savings_max != null) {
    const a = e.monthly_savings_min
    const b = e.monthly_savings_max
    if (Number.isFinite(a) && Number.isFinite(b) && Math.max(a, b) > 0) {
      return {
        kind: 'range',
        main: formatCLP(Math.round((a + b) / 2)),
        sub: `Entre ${formatCLP(a)} y ${formatCLP(b)} / mes`,
      }
    }
  }
  if (e?.monthly_savings_min != null && e.monthly_savings_min > 0 && Number.isFinite(e.monthly_savings_min)) {
    return { kind: 'range', main: formatCLP(e.monthly_savings_min) }
  }
  return { kind: 'none' }
})

const annualSavingsHero = computed(() => {
  const a = econ.value?.annual_savings
  if (a != null && Number.isFinite(a) && a > 0) return formatCLP(Math.round(a))
  return null
})

const panels = computed(() => sim.value?.system?.panels ?? sim.value?.panels)
const powerKwp = computed(() => sim.value?.system?.power_kwp ?? sim.value?.power_kwp)
const includesBattery = computed(
  () => !!(sim.value?.system?.includes_battery ?? sim.value?.includes_battery)
)

const roiYearsSafe = computed(() => {
  const y = econ.value?.roi_years
  if (y == null || !Number.isFinite(y) || y <= 0) return null
  return y
})

const lifetime25Safe = computed(() => {
  const e = econ.value
  const direct = e?.lifetime_savings_25y
  if (direct != null && Number.isFinite(direct) && direct > 0) return Math.round(direct)
  const raw = e as { savings_25_years?: number } | undefined
  const alt = raw?.savings_25_years
  if (alt != null && Number.isFinite(alt) && alt > 0) return Math.round(alt)
  const ann = e?.annual_savings
  if (ann != null && Number.isFinite(ann) && ann > 0) return Math.round(ann * 25)
  return null
})

/** Texto de boleta para narrativa (misma referencia que el comparador). */
const narrativeBillFormatted = computed(() => {
  const r = referenceBill.value
  if (r == null || !Number.isFinite(r) || r <= 0) return null
  return formatCLP(Math.round(r))
})

const narrativeKwpStr = computed(() => {
  const k = powerKwp.value
  if (k == null || !Number.isFinite(k) || k <= 0) return null
  return k.toLocaleString('es-CL', { maximumFractionDigits: 1 })
})

const narrativePanelsN = computed(() => {
  const p = panels.value
  if (p == null || !Number.isFinite(p) || p <= 0) return null
  return Math.round(p)
})

const narrativeRoiBlock = computed(() => {
  const roi = roiYearsSafe.value
  if (roi == null) return null
  const roiStr = roi.toLocaleString('es-CL', { maximumFractionDigits: 1 })
  const life = lifetime25Safe.value
  const lifeLine =
    life != null ? `Proyectamos un ahorro referencial de ${formatCLP(life)} acumulado a 25 años.` : null
  return { roiStr, lifeLine }
})

const systemTeaser = computed(() => {
  const parts: string[] = []
  if (panels.value != null && powerKwp.value != null) {
    parts.push(`${panels.value} paneles · ${powerKwp.value} kWp`)
  } else if (powerKwp.value != null) {
    parts.push(`${powerKwp.value} kWp estimados`)
  }
  if (includesBattery.value) parts.push('Respaldo con batería')
  else if (backup.value?.available) parts.push('Opción de respaldo')
  return parts.length ? parts.join(' · ') : null
})

/** Barra: ancla = boleta de referencia (declarada o estimada); segmentos = nueva boleta + ahorro. */
const compareBar = computed(() => {
  const cur = referenceBill.value
  const neu = solarBill.value
  if (cur == null || neu == null || cur <= 0 || neu < 0 || !Number.isFinite(neu)) {
    return { newPct: 0, savingsPct: 0, hasData: false as const }
  }
  const savings = Math.max(0, cur - neu)
  const newPct = Math.min(100, Math.round((neu / cur) * 100))
  const savingsPct = Math.min(100, Math.round((savings / cur) * 100))
  return { newPct, savingsPct, hasData: true as const }
})

const backupChips = ['Portón automático', 'CCTV / cámaras', 'Router / WiFi', 'Iluminación crítica']

const waHref = computed(() => {
  const dec = declaredMonthlyBill.value
  const sol = solarBill.value
  const ann = econ.value?.annual_savings

  let body = 'Hola, simulé mi sistema solar en Solutimp Energy.'
  const hasDec = dec != null && Number.isFinite(dec) && dec > 0
  const hasSol = sol != null && Number.isFinite(sol) && sol >= 0
  const hasAnn = ann != null && Number.isFinite(ann) && ann > 0

  if (hasDec && dec != null) {
    body += ` Declaré una boleta de ${formatCLP(Math.round(dec))}/mes`
  }
  if (hasSol && sol != null) {
    body += hasDec
      ? ` y el simulador estimó un escenario con solar de ${formatCLP(Math.round(sol))}/mes`
      : ` El simulador estimó un escenario con solar de ${formatCLP(Math.round(sol))}/mes`
  }
  if (hasAnn && ann != null) {
    body += hasDec || hasSol
      ? `, con ahorro anual aproximado de ${formatCLP(Math.round(ann))}`
      : ` Ahorro anual aproximado de ${formatCLP(Math.round(ann))}`
  }
  body += ' Quiero que un especialista revise mi caso.'
  return buildWhatsAppLink(body)
})
</script>

<template>
  <div class="plan">
    <header class="plan-head animate">
      <p class="plan-eyebrow">Plan de independencia energética</p>
      <h2 class="plan-title">Tu estimación en un vistazo</h2>
    </header>

    <section class="plan-kpi animate" style="animation-delay: 0.05s">
      <template v-if="monthlySavingsUi.kind === 'lowConsumption'">
        <p class="plan-kpi-label">Ahorro mensual estimado</p>
        <p class="plan-kpi-note">
          Tu nivel de consumo permite evaluar un sistema optimizado para ahorro base y respaldo inteligente.
        </p>
      </template>
      <template v-else>
        <p class="plan-kpi-label">Podrías dejar de pagar aprox.</p>
        <p
          v-if="monthlySavingsUi.kind === 'amount' || monthlySavingsUi.kind === 'range'"
          class="plan-kpi-value"
        >
          {{ monthlySavingsUi.kind === 'amount' ? monthlySavingsUi.text : monthlySavingsUi.main }}
        </p>
        <p v-else class="plan-kpi-value plan-kpi-value--soft">—</p>
        <p class="plan-kpi-unit">al mes</p>
        <p v-if="monthlySavingsUi.kind === 'range' && monthlySavingsUi.sub" class="plan-kpi-range">
          {{ monthlySavingsUi.sub }}
        </p>
      </template>
    </section>

    <section class="plan-backup plan-backup--prominent animate" style="animation-delay: 0.08s">
      <h3 class="plan-backup-title">Respaldo inteligente Solutimp</h3>
      <p class="plan-backup-lead">
        Además del ahorro, Solutimp Energy puede ayudarte a mantener operativas tus cargas críticas ante cortes de luz.
      </p>
      <ul class="plan-chip-list" aria-label="Ejemplos de cargas críticas">
        <li v-for="(c, i) in backupChips" :key="i" class="plan-chip">
          <span class="plan-chip-ico" aria-hidden="true">✓</span>{{ c }}
        </li>
      </ul>
      <p class="plan-backup-foot">
        La autonomía real depende de batería, consumo y configuración final.
      </p>
    </section>

    <p v-if="annualSavingsHero" class="plan-annual animate" style="animation-delay: 0.1s">
      Equivale a aprox. <strong>{{ annualSavingsHero }}</strong> al año
    </p>

    <div v-if="narrativeBillFormatted" class="plan-narrative animate" style="animation-delay: 0.11s">
      <p v-if="declaredMonthlyBill != null" class="plan-narr-line">
        Con una boleta declarada de <strong class="plan-narr-num">{{ narrativeBillFormatted }}</strong>,
      </p>
      <p v-else class="plan-narr-line">
        Con una boleta de referencia de <strong class="plan-narr-num">{{ narrativeBillFormatted }}</strong>,
      </p>
      <p class="plan-narr-sub">Estimamos un consumo residencial acorde a ese nivel.</p>

      <template v-if="narrativeKwpStr != null || narrativePanelsN != null">
        <p class="plan-narr-callout">Estimamos un sistema cercano a:</p>
        <ul class="plan-narr-specs" aria-label="Tamaño de sistema estimado">
          <li v-if="narrativeKwpStr != null" class="plan-narr-spec">
            <span class="plan-narr-ico" aria-hidden="true">☀️</span>
            <span><strong>{{ narrativeKwpStr }} kWp</strong></span>
          </li>
          <li v-if="narrativePanelsN != null" class="plan-narr-spec">
            <span class="plan-narr-ico" aria-hidden="true">🔋</span>
            <span><strong>{{ narrativePanelsN }} paneles solares</strong></span>
          </li>
        </ul>
      </template>
      <p v-else class="plan-narr-fallback">
        Solutimp Energy podría dimensionar un sistema solar acorde a tu perfil y consumo.
      </p>

      <div v-if="narrativeRoiBlock" class="plan-narr-roi">
        <p class="plan-narr-roi-line">Esto podría ayudarte a recuperar tu inversión</p>
        <p class="plan-narr-roi-line">
          en aproximadamente <strong class="plan-narr-num">{{ narrativeRoiBlock.roiStr }} años</strong>.
        </p>
        <p v-if="narrativeRoiBlock.lifeLine" class="plan-narr-roi-life">{{ narrativeRoiBlock.lifeLine }}</p>
      </div>
    </div>

    <section class="plan-compare animate" style="animation-delay: 0.12s">
      <div class="plan-cards">
        <div class="plan-card">
          <span class="plan-card-label">{{ referenceBillLabel }}</span>
          <span class="plan-card-val">{{ referenceBillDisplay }}</span>
        </div>
        <div class="plan-card plan-card--solar">
          <span class="plan-card-label">Escenario con solar</span>
          <span class="plan-card-val">{{ solarBillDisplay }}</span>
          <span class="plan-card-hint">Valor referencial sujeto a evaluación técnica.</span>
        </div>
      </div>

      <div v-if="compareBar.hasData" class="plan-bar-wrap" aria-hidden="true">
        <div class="plan-bar-total">
          <div class="plan-bar-new" :style="{ width: compareBar.newPct + '%' }" />
          <div class="plan-bar-save" :style="{ width: compareBar.savingsPct + '%' }" />
        </div>
        <div class="plan-bar-legend">
          <span><span class="dot dot--new" aria-hidden="true" /> Nueva boleta ({{ compareBar.newPct }}%)</span>
          <span><span class="dot dot--save" aria-hidden="true" /> Ahorro ({{ compareBar.savingsPct }}%)</span>
        </div>
      </div>
      <p v-else class="plan-bar-fallback">Comparación visual cuando haya datos de boleta de referencia y escenario solar.</p>
    </section>

    <div v-if="systemTeaser && !narrativeBillFormatted" class="plan-system animate" style="animation-delay: 0.14s">
      {{ systemTeaser }}
    </div>

    <div class="plan-badges animate" style="animation-delay: 0.16s">
      <span class="badge badge--main">Solutimp Energy · Tecnología solar + respaldo inteligente</span>
      <span class="badge badge--gw">Powered by GoodWe</span>
    </div>

    <p class="plan-disclaimer animate" style="animation-delay: 0.18s">
      Estimación preliminar. Un especialista Solutimp puede validar tu techo, consumo real y respaldo ideal.
    </p>

    <p class="plan-social animate" style="animation-delay: 0.185s">
      Evaluación preliminar · Solutimp Energy · Ingeniería energética aplicada, automatización y respaldo inteligente
    </p>

    <p class="plan-mail animate" style="animation-delay: 0.2s">
      También puedes solicitar cotización por correo:
      <a href="mailto:info@solutimp.cl">info@solutimp.cl</a>
    </p>

    <div class="plan-wa-desktop animate" style="animation-delay: 0.2s">
      <a class="wa-btn" :href="waHref" target="_blank" rel="noopener noreferrer">Hablar por WhatsApp</a>
    </div>

    <div class="plan-form animate" style="animation-delay: 0.22s">
      <CalcContactBlock />
    </div>

    <div class="wa-sticky hidden-md-up" role="region" aria-label="Contacto WhatsApp">
      <a class="wa-sticky-btn" :href="waHref" target="_blank" rel="noopener noreferrer">Hablar por WhatsApp</a>
    </div>
  </div>
</template>

<style scoped>
.plan {
  --plan-bg: #0d1f35;
  --plan-surface: rgba(255, 255, 255, 0.06);
  --plan-border: rgba(255, 255, 255, 0.12);
  background: var(--plan-bg);
  color: #e8eef6;
  margin: -1.25rem -1.1rem -1.35rem;
  padding: 1.35rem 1.1rem 5.75rem;
  border-radius: var(--se-radius-lg);
}

.plan-wa-desktop {
  display: none;
}

@media (min-width: 768px) {
  .plan {
    margin: -1.25rem -1.25rem -1.5rem;
    padding: 1.5rem 1.25rem 2rem;
  }

  .hidden-md-up {
    display: none !important;
  }

  .plan-wa-desktop {
    display: block;
    margin-bottom: 1rem;
  }

  .plan-form {
    padding-bottom: 0;
  }
}

@media (max-width: 767.98px) {
  .plan-form {
    padding-bottom: 0.5rem;
  }
}

.plan-head {
  text-align: center;
  margin-bottom: 1.25rem;
}

.plan-eyebrow {
  margin: 0 0 0.4rem;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #7dd3fc;
}

.plan-title {
  margin: 0;
  font-size: clamp(1.15rem, 4.2vw, 1.45rem);
  font-weight: 700;
  line-height: 1.2;
  color: #fff;
}

.plan-kpi {
  text-align: center;
  padding: 1.25rem 0.85rem 1.35rem;
  border-radius: var(--se-radius-md);
  background: var(--plan-surface);
  border: 1px solid var(--plan-border);
  margin-bottom: 0.65rem;
}

.plan-kpi-label {
  margin: 0 0 0.35rem;
  font-size: 1rem;
  font-weight: 500;
  color: #b8c5d9;
}

.plan-kpi-note {
  margin: 0;
  font-size: 0.92rem;
  font-weight: 500;
  line-height: 1.45;
  color: #cbd5e1;
  text-align: center;
  max-width: 22rem;
  margin-left: auto;
  margin-right: auto;
}

.plan-kpi-value {
  margin: 0;
  font-size: clamp(3rem, 11vw, 3.5rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: #5eead4;
}

.plan-kpi-value--soft {
  color: #94a3b8;
  font-size: 2rem;
}

.plan-kpi-unit {
  margin: 0.2rem 0 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: #e2e8f0;
}

.plan-kpi-range {
  margin: 0.65rem 0 0;
  font-size: 0.82rem;
  color: #94a3b8;
}

.plan-annual {
  text-align: center;
  font-size: 1rem;
  color: #cbd5e1;
  margin: 0 0 1.25rem;
  line-height: 1.45;
}

.plan-annual strong {
  color: #f1f5f9;
  font-weight: 700;
}

.plan-narrative {
  text-align: center;
  font-size: 0.88rem;
  line-height: 1.55;
  color: #b8c5d9;
  margin: 0 0 1.2rem;
  padding: 1rem 0.75rem 1.1rem;
  border-radius: var(--se-radius-md);
  background: rgba(0, 0, 0, 0.18);
  border: 1px solid var(--plan-border);
}

.plan-narr-line {
  margin: 0 0 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: #e2e8f0;
  line-height: 1.45;
}

.plan-narr-sub {
  margin: 0 0 0.85rem;
  font-size: 0.82rem;
  color: #94a3b8;
  line-height: 1.45;
}

.plan-narr-fallback {
  margin: 0 0 0.85rem;
  font-size: 0.82rem;
  color: #94a3b8;
  line-height: 1.45;
}

.plan-narr-callout {
  margin: 0 0 0.45rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #7dd3fc;
}

.plan-narr-specs {
  list-style: none;
  margin: 0 0 1rem;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.plan-narr-spec {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: #f1f5f9;
}

.plan-narr-ico {
  font-size: 1.15rem;
  line-height: 1;
  flex-shrink: 0;
}

.plan-narr-num {
  color: #5eead4;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.plan-narr-roi {
  margin-top: 0.35rem;
  padding-top: 0.85rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.plan-narr-roi-line {
  margin: 0 0 0.25rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #e2e8f0;
  line-height: 1.4;
}

.plan-narr-roi-life {
  margin: 0.65rem 0 0;
  font-size: 0.82rem;
  color: #94a3b8;
  line-height: 1.45;
}

.plan-compare {
  margin-bottom: 1.1rem;
}

.plan-cards {
  display: grid;
  gap: 0.65rem;
  margin-bottom: 0.85rem;
}

@media (min-width: 480px) {
  .plan-cards {
    grid-template-columns: 1fr 1fr;
  }
}

.plan-card {
  border-radius: var(--se-radius-md);
  padding: 1rem 1rem 0.95rem;
  background: var(--plan-surface);
  border: 1px solid var(--plan-border);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.plan-card--solar {
  border-color: rgba(94, 234, 212, 0.35);
  box-shadow: 0 0 0 1px rgba(94, 234, 212, 0.08);
}

.plan-card-label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #94a3b8;
}

.plan-card-val {
  font-size: 1.2rem;
  font-weight: 800;
  color: #fff;
}

.plan-card--solar .plan-card-val {
  color: #5eead4;
}

.plan-card-hint {
  font-size: 0.75rem;
  color: #8899af;
}

.plan-bar-wrap {
  margin-top: 0.25rem;
}

.plan-bar-total {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 14px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--plan-border);
}

.plan-bar-new {
  height: 100%;
  background: linear-gradient(90deg, #0ea5e9, #38bdf8);
  min-width: 4px;
}

.plan-bar-save {
  height: 100%;
  background: linear-gradient(90deg, #14b8a6, #5eead4);
  min-width: 4px;
}

.plan-bar-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem 1rem;
  margin-top: 0.5rem;
  font-size: 0.72rem;
  color: #94a3b8;
}

.dot {
  display: inline-block;
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  margin-right: 0.25rem;
  vertical-align: 0.05em;
}

.dot--new {
  background: #38bdf8;
}

.dot--save {
  background: #5eead4;
}

.plan-bar-fallback {
  font-size: 0.8rem;
  color: #8899af;
  margin: 0;
  text-align: center;
}

.plan-backup {
  margin-bottom: 1rem;
  padding: 1.1rem 1rem 1.05rem;
  border-radius: var(--se-radius-md);
  background: var(--plan-surface);
  border: 1px solid var(--plan-border);
}

.plan-backup--prominent {
  position: relative;
  padding-left: 1.15rem;
  border-color: rgba(94, 234, 212, 0.45);
  box-shadow:
    0 0 0 1px rgba(94, 234, 212, 0.12),
    0 12px 36px rgba(0, 0, 0, 0.25);
  background: linear-gradient(145deg, rgba(94, 234, 212, 0.08) 0%, rgba(0, 0, 0, 0.12) 55%);
}

.plan-backup--prominent::before {
  content: '';
  display: block;
  width: 3px;
  border-radius: 99px;
  background: linear-gradient(180deg, #5eead4, #0ea5e9);
  position: absolute;
  left: 0;
  top: 0.85rem;
  bottom: 0.85rem;
}

.plan-backup-title {
  margin: 0 0 0.5rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: #e2e8f0;
}

.plan-backup--prominent .plan-backup-title {
  font-size: 1.02rem;
  letter-spacing: -0.01em;
}

.plan-backup-lead {
  margin: 0 0 0.65rem;
  font-size: 0.84rem;
  line-height: 1.45;
  color: #b8c5d9;
}

.plan-backup-foot {
  margin: 0.65rem 0 0;
  font-size: 0.72rem;
  line-height: 1.4;
  color: #8899af;
}

.plan-chip-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.plan-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.72rem;
  font-weight: 600;
  color: #cbd5e1;
  padding: 0.35rem 0.55rem;
  border-radius: 999px;
  border: 1px solid var(--plan-border);
  background: rgba(0, 0, 0, 0.15);
}

.plan-chip-ico {
  color: #5eead4;
  font-weight: 800;
}

.plan-system {
  text-align: center;
  font-size: 0.84rem;
  color: #b8c5d9;
  margin: 0 0 1rem;
  line-height: 1.45;
}

.plan-badges {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 1rem;
}

.badge {
  display: inline-block;
  font-size: 0.72rem;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  border: 1px solid var(--plan-border);
  background: rgba(255, 255, 255, 0.04);
  color: #cbd5e1;
  text-align: center;
  line-height: 1.35;
  max-width: 100%;
}

.badge--main {
  font-weight: 600;
  color: #e2e8f0;
}

.badge--gw {
  font-size: 0.65rem;
  font-weight: 500;
  color: #94a3b8;
  border-style: dashed;
}

.plan-disclaimer {
  font-size: 0.82rem;
  line-height: 1.5;
  color: #94a3b8;
  text-align: center;
  margin: 0 0 0.55rem;
  max-width: 26rem;
  margin-left: auto;
  margin-right: auto;
}

.plan-social {
  font-size: 0.72rem;
  line-height: 1.4;
  color: #7c8ca0;
  text-align: center;
  margin: 0 0 0.85rem;
}

.plan-mail {
  font-size: 0.78rem;
  text-align: center;
  color: #7c8ca0;
  margin: 0 0 1rem;
}

.plan-mail a {
  color: #7dd3fc;
  text-decoration: none;
}

.plan-mail a:hover {
  text-decoration: underline;
}

.plan-wa-inline {
  margin-bottom: 1rem;
}

.wa-btn {
  display: block;
  text-align: center;
  text-decoration: none;
  box-sizing: border-box;
  padding: 0.9rem 1rem;
  border-radius: var(--se-radius-md);
  font-weight: 700;
  background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
  color: #fff !important;
}

.wa-sticky {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1200;
  padding: 0.65rem 1rem max(0.65rem, env(safe-area-inset-bottom));
  background: linear-gradient(180deg, transparent 0%, rgba(13, 31, 53, 0.92) 28%, #0d1f35 100%);
  border-top: 1px solid var(--plan-border);
  display: flex;
  justify-content: center;
}

.wa-sticky-btn {
  display: block;
  width: 100%;
  max-width: 520px;
  text-align: center;
  text-decoration: none;
  box-sizing: border-box;
  padding: 0.95rem 1rem;
  border-radius: var(--se-radius-md);
  font-weight: 700;
  font-size: 1rem;
  background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
  color: #fff !important;
}

.animate {
  opacity: 0;
  transform: translateY(12px);
  animation: plan-fade-up 0.55s ease forwards;
}

@media (prefers-reduced-motion: reduce) {
  .animate {
    animation: none;
    opacity: 1;
    transform: none;
  }
}

@keyframes plan-fade-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
