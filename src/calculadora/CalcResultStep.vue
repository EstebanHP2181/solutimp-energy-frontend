<script setup lang="ts">
import { computed, inject, nextTick, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { calculadoraFlowKey } from '@/composables/useCalculadoraFlow'
import {
  AUTONOMY_RANGE_DISCLAIMER,
  getEnergyNarrativeContext,
} from '@/calculadora/narrativeEngine'
import { getRoofFeasibilityCopy } from '@/calculadora/roofFeasibilityEngine'
import { preliminaryInvestmentDisplayLine } from '@/calculadora/investmentEstimate'
import { getContinuityDuringOutageRows } from '@/calculadora/continuityDuringOutageCopy'
import { resolveNarrativeSegment } from '@/calculadora/semanticDecisionEngine'
import { formatCLP } from '@/shared/formatCLP'
import { buildWhatsAppLink } from '@/shared/whatsapp'
import CalcContactBlock from './CalcContactBlock.vue'

const flow = inject(calculadoraFlowKey)!

const router = useRouter()

const narration = computed(() =>
  getEnergyNarrativeContext({
    propertyType: flow.propertyType,
    mainGoal: flow.mainGoal,
  })
)

const visualPriority = computed(() => narration.value.primaryKpiMode)

const showContactForm = ref(false)

watch(
  () => [flow.propertyType, flow.mainGoal] as const,
  () => {
    showContactForm.value = false
  }
)

onUnmounted(() => {
  showContactForm.value = false
})

function revealContactForm() {
  showContactForm.value = true
  nextTick(() => {
    const el = document.getElementById('calc-name')
    el?.focus({ preventScroll: false })
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  })
}

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

/** Jerarquía fija de secciones (orden visual unificado). */
const PLAN_ORDER = {
  technical: 12,
  investment: 20,
  continuity: 28,
  roof: 40,
  impact: 45,
  roi: 55,
  narrative: 62,
} as const

const INVESTMENT_SUBTEXT =
  'Estimación referencial sujeta a visita técnica, orientación solar, estructura y configuración final.'

const RESULT_LEGAL_DISCLAIMER =
  'Evaluación preliminar referencial. La configuración final depende de orientación, sombras, superficie útil, consumo real, estructura, distribuidora eléctrica, factibilidad SEC y hábitos energéticos.'

const segmentKey = computed(() =>
  resolveNarrativeSegment({
    propertyType: flow.propertyType,
    mainGoal: flow.mainGoal,
  }),
)

const isExportSegment = computed(() => segmentKey.value.startsWith('export_'))

const continuityMainTitle = computed(() =>
  isExportSegment.value
    ? 'Independencia energética y valorización de excedentes'
    : 'Capacidad de continuidad, autonomía parcial y resiliencia',
)

const showContinuityScenarioList = computed(() => !isExportSegment.value)

const continuityOutageRows = computed(() => getContinuityDuringOutageRows(flow.propertyType))

const continuityAccent = computed(
  () => visualPriority.value === 'continuity' || visualPriority.value === 'coverage',
)

const investmentPrimaryLine = computed(() => {
  const k = powerKwp.value
  if (k == null || !Number.isFinite(k) || k <= 0) return null
  return preliminaryInvestmentDisplayLine(k)
})

const systemConfigLead = computed(() => {
  const parts: string[] = []
  const k = powerKwp.value
  const p = panels.value
  if (k != null && Number.isFinite(k) && k > 0) {
    parts.push(`Infraestructura solar referencial ~${k.toLocaleString('es-CL', { maximumFractionDigits: 1 })} kWp`)
  }
  if (p != null && Number.isFinite(p) && p > 0) {
    parts.push(`${Math.round(p)} módulos fotovoltaicos`)
  }
  if (includesBattery.value) {
    parts.push('Sistema de almacenamiento inteligente (referencial)')
  } else if (backup.value?.available) {
    parts.push('Espacio técnico para configuración híbrida y continuidad (a validar en visita)')
  }
  return parts.length ? parts.join(' · ') : null
})

const showTechnicalConfig = computed(
  () => !!systemConfigLead.value || narrativeKwpStr.value != null || narrativePanelsN.value != null,
)

const showNarrativeSpecs = computed(() => visualPriority.value !== 'coverage')

const roiReferentialUi = computed(() => {
  const y = roiYearsSafe.value
  if (y == null || !Number.isFinite(y) || y <= 0) return null
  const center = Math.round(y)
  const low = Math.max(5, center - 2)
  const high = Math.min(16, center + 2)
  const life = lifetime25Safe.value
  return {
    rangeLine: `Retorno estimado entre ${low} y ${high} años según consumo, orientación y hábitos energéticos.`,
    financialLongTermNote:
      life != null
        ? `Ahorro acumulado referencial a 25 años del orden de ${formatCLP(life)} (proyección, no garantía contractual).`
        : null,
    continuityNote:
      'La continuidad operacional se valora aparte del retorno financiero: depende de cargas seleccionadas, almacenamiento e ingeniería de integración.',
  }
})

const roofFeasibilityCopy = computed(() =>
  getRoofFeasibilityCopy({
    panelCount: narrativePanelsN.value,
    propertyType: flow.propertyType,
  })
)

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

const waHref = computed(() => {
  const dec = declaredMonthlyBill.value
  const sol = solarBill.value
  const ann = econ.value?.annual_savings

  let body = 'Hola, completé una evaluación preliminar de autonomía energética en Solutimp Energy.'
  const hasDec = dec != null && Number.isFinite(dec) && dec > 0
  const hasSol = sol != null && Number.isFinite(sol) && sol >= 0
  const hasAnn = ann != null && Number.isFinite(ann) && ann > 0

  if (hasDec && dec != null) {
    body += ` Declaré una boleta de ${formatCLP(Math.round(dec))}/mes`
  }
  if (hasSol && sol != null) {
    body += hasDec
      ? ` y el evaluador estimó un escenario con infraestructura solar de ${formatCLP(Math.round(sol))}/mes`
      : ` El evaluador estimó un escenario con infraestructura solar de ${formatCLP(Math.round(sol))}/mes`
  }
  if (hasAnn && ann != null) {
    body += hasDec || hasSol
      ? `, con ahorro anual aproximado de ${formatCLP(Math.round(ann))}`
      : ` Ahorro anual aproximado de ${formatCLP(Math.round(ann))}`
  }
  body += ' ' + narration.value.whatsappIntentLine
  body += ' Quiero que un especialista revise mi caso.'
  return buildWhatsAppLink(body)
})
</script>

<template>
  <div class="plan">
    <header class="plan-head animate">
      <p class="plan-eyebrow">{{ narration.resultSubtitle }}</p>
      <p class="plan-kicker">Diagnóstico energético preliminar</p>
      <h2 class="plan-title">{{ narration.resultTitle }}</h2>
      <p v-if="narration.mainClaim" class="plan-claim">{{ narration.mainClaim }}</p>
    </header>

    <div class="plan-flow">
      <!-- 2. Configuración técnica sugerida -->
      <section
        v-if="showTechnicalConfig"
        class="plan-slot plan-tech animate"
        :style="{ order: PLAN_ORDER.technical }"
      >
        <h3 class="plan-section-title">Configuración técnica sugerida</h3>
        <p v-if="systemConfigLead" class="plan-tech-lead">{{ systemConfigLead }}</p>
        <template v-if="narrativeKwpStr != null || narrativePanelsN != null">
          <p class="plan-narr-callout">Referencia de dimensionamiento</p>
          <ul class="plan-narr-specs" aria-label="Dimensionamiento referencial">
            <li v-if="narrativeKwpStr != null" class="plan-narr-spec">
              <span class="plan-narr-ico" aria-hidden="true">☀️</span>
              <span><strong>{{ narrativeKwpStr }} kWp</strong> de infraestructura solar</span>
            </li>
            <li v-if="narrativePanelsN != null" class="plan-narr-spec">
              <span class="plan-narr-ico" aria-hidden="true">⚡</span>
              <span><strong>{{ narrativePanelsN }} módulos fotovoltaicos</strong></span>
            </li>
          </ul>
        </template>
      </section>

      <!-- 3. Inversión preliminar -->
      <section
        class="plan-slot plan-invest animate"
        :style="{ order: PLAN_ORDER.investment }"
      >
        <h3 class="plan-section-title">Inversión preliminar estimada</h3>
        <p v-if="investmentPrimaryLine" class="plan-invest-line">{{ investmentPrimaryLine }}</p>
        <p v-else class="plan-invest-line plan-invest-line--soft">
          Monto sujeto a dimensionamiento en visita técnica (referencial).
        </p>
        <p class="plan-invest-sub">{{ INVESTMENT_SUBTEXT }}</p>
      </section>

      <!-- 4. Continuidad / resiliencia (o independencia en export) -->
      <section
        class="plan-slot plan-continuity animate"
        :class="{ 'plan-continuity--accent': continuityAccent }"
        :style="{ order: PLAN_ORDER.continuity }"
      >
        <h3 class="plan-section-title">{{ continuityMainTitle }}</h3>

        <div
          v-if="visualPriority === 'coverage' && narration.referentialAutonomy"
          class="plan-autonomy plan-autonomy--hero plan-autonomy--embed"
        >
          <p class="plan-autonomy-kpi">Autonomía referencial</p>
          <p class="plan-autonomy-range">
            Entre {{ narration.referentialAutonomy.hoursMin }}–{{ narration.referentialAutonomy.hoursMax }} h
            <span class="plan-autonomy-scope">{{ narration.referentialAutonomy.scopeLine }}</span>
          </p>
          <p class="plan-autonomy-disclaimer">{{ AUTONOMY_RANGE_DISCLAIMER }}</p>
        </div>

        <p class="plan-continuity-keyline">{{ narration.backupTitle }}</p>
        <p class="plan-backup-lead">{{ narration.backupCopy }}</p>

        <div
          v-if="visualPriority === 'continuity' && narration.referentialAutonomy"
          class="plan-autonomy plan-autonomy--hero plan-autonomy--embed"
        >
          <p class="plan-autonomy-kpi">Autonomía referencial</p>
          <p class="plan-autonomy-range">
            Entre {{ narration.referentialAutonomy.hoursMin }}–{{ narration.referentialAutonomy.hoursMax }} h
            <span class="plan-autonomy-scope">{{ narration.referentialAutonomy.scopeLine }}</span>
          </p>
          <p class="plan-autonomy-disclaimer">{{ AUTONOMY_RANGE_DISCLAIMER }}</p>
        </div>

        <template v-if="showContinuityScenarioList">
          <h4 class="plan-continuity-subtitle">Qué podría seguir funcionando durante cortes</h4>
          <ul class="plan-outage-list" aria-label="Ejemplos referenciales ante interrupciones">
            <li
              v-for="(row, i) in continuityOutageRows"
              :key="i"
              :class="['plan-outage-item', `plan-outage-item--${row.tier}`]"
            >
              <span class="plan-outage-ico" aria-hidden="true">{{ row.tier === 'ok' ? '✅' : '⚠️' }}</span>
              <span>{{ row.text }}</span>
            </li>
          </ul>
        </template>

        <h4 class="plan-systems-heading">Cargas priorizadas en esta evaluación</h4>
        <ul class="plan-chip-list" aria-label="Cargas priorizadas">
          <li v-for="(c, i) in narration.protectedLoadChips" :key="i" class="plan-chip">
            <span class="plan-chip-ico" aria-hidden="true">✓</span>{{ c }}
          </li>
        </ul>
        <p class="plan-backup-foot">{{ narration.backupFootDisclaimer }}</p>
      </section>

      <!-- 5. Factibilidad técnica de superficie -->
      <section
        v-if="roofFeasibilityCopy"
        class="plan-slot plan-roof animate"
        :style="{ order: PLAN_ORDER.roof }"
      >
        <h3 class="plan-roof-title">{{ roofFeasibilityCopy.title }}</h3>
        <p class="plan-roof-headline">{{ roofFeasibilityCopy.headline }}</p>
        <p class="plan-roof-context">{{ roofFeasibilityCopy.contextLine }}</p>
        <p v-if="roofFeasibilityCopy.parkingEquivalence" class="plan-roof-parking">
          Equivale aprox. a {{ roofFeasibilityCopy.parkingEquivalence }} (referencia visual).
        </p>
        <p class="plan-roof-orient">{{ roofFeasibilityCopy.orientation }}</p>
        <p v-if="roofFeasibilityCopy.advancedWarning" class="plan-roof-warn" role="status">
          {{ roofFeasibilityCopy.advancedWarning }}
        </p>
        <p class="plan-roof-foot">{{ roofFeasibilityCopy.disclaimer }}</p>
      </section>

      <!-- 6. Impacto en boleta + beneficio mensual -->
      <section class="plan-slot plan-impact animate" :style="{ order: PLAN_ORDER.impact }">
        <h3 class="plan-section-title">Impacto estimado en tu boleta</h3>
        <div class="plan-cards">
          <div class="plan-card">
            <span class="plan-card-label">{{ referenceBillLabel }}</span>
            <span class="plan-card-val">{{ referenceBillDisplay }}</span>
          </div>
          <div class="plan-card plan-card--solar">
            <span class="plan-card-label">Escenario con infraestructura solar</span>
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
        <p v-else class="plan-bar-fallback">
          Comparación visual cuando haya boleta de referencia y escenario con infraestructura solar.
        </p>

        <div
          class="plan-kpi plan-kpi--in-impact"
          :class="{ 'plan-kpi--secondary': visualPriority !== 'savings' }"
        >
          <template v-if="monthlySavingsUi.kind === 'lowConsumption'">
            <p class="plan-kpi-label">Beneficio mensual referencial</p>
            <p class="plan-kpi-note">
              Tu perfil permite evaluar una configuración energética prudente, con foco en eficiencia y espacio técnico
              para continuidad futura.
            </p>
          </template>
          <template v-else>
            <p class="plan-kpi-label">{{ narration.primaryKpiLabel }}</p>
            <p
              v-if="monthlySavingsUi.kind === 'amount' || monthlySavingsUi.kind === 'range'"
              class="plan-kpi-value"
            >
              {{ monthlySavingsUi.kind === 'amount' ? monthlySavingsUi.text : monthlySavingsUi.main }}
            </p>
            <p v-else class="plan-kpi-value plan-kpi-value--soft">—</p>
            <p class="plan-kpi-unit">al mes (referencial)</p>
            <p v-if="monthlySavingsUi.kind === 'range' && monthlySavingsUi.sub" class="plan-kpi-range">
              {{ monthlySavingsUi.sub }}
            </p>
            <p
              v-if="visualPriority === 'continuity' && (monthlySavingsUi.kind === 'amount' || monthlySavingsUi.kind === 'range')"
              class="plan-kpi-complement"
            >
              Beneficio financiero complementario a la continuidad operacional.
            </p>
            <p
              v-if="visualPriority === 'coverage' && (monthlySavingsUi.kind === 'amount' || monthlySavingsUi.kind === 'range')"
              class="plan-kpi-complement"
            >
              Complementario a cobertura y autonomía referencial en campo o parcela.
            </p>
          </template>
        </div>
      </section>

      <!-- 7. ROI referencial -->
      <section
        v-if="roiReferentialUi"
        class="plan-slot plan-roi animate"
        :style="{ order: PLAN_ORDER.roi }"
      >
        <h3 class="plan-section-title">ROI referencial</h3>
        <p v-if="annualSavingsHero" class="plan-roi-annual">
          Beneficio financiero referencial: aprox. <strong>{{ annualSavingsHero }}</strong> al año por menor costo
          de energía.
        </p>
        <p class="plan-roi-range-line">{{ roiReferentialUi.rangeLine }}</p>
        <p v-if="roiReferentialUi.financialLongTermNote" class="plan-roi-note">{{ roiReferentialUi.financialLongTermNote }}</p>
        <p class="plan-roi-note plan-roi-note--continuity">{{ roiReferentialUi.continuityNote }}</p>
      </section>

      <!-- Detalle de consumo / dimensionamiento (si hay boleta de referencia) -->
      <div
        v-if="narrativeBillFormatted"
        class="plan-slot plan-narrative animate"
        :style="{ order: PLAN_ORDER.narrative }"
      >
        <h3 class="plan-section-title plan-section-title--compact">Contexto de consumo declarado</h3>
        <p v-if="declaredMonthlyBill != null" class="plan-narr-line">
          Con una boleta declarada de <strong class="plan-narr-num">{{ narrativeBillFormatted }}</strong>,
        </p>
        <p v-else class="plan-narr-line">
          Con una boleta de referencia de <strong class="plan-narr-num">{{ narrativeBillFormatted }}</strong>,
        </p>
        <p class="plan-narr-sub">{{ narration.narrativeConsumptionHint }}</p>

        <template v-if="showNarrativeSpecs">
          <template v-if="narrativeKwpStr != null || narrativePanelsN != null">
            <p class="plan-narr-callout">Consistencia con la configuración técnica sugerida</p>
            <ul class="plan-narr-specs" aria-label="Dimensionamiento referencial">
              <li v-if="narrativeKwpStr != null" class="plan-narr-spec">
                <span class="plan-narr-ico" aria-hidden="true">☀️</span>
                <span><strong>{{ narrativeKwpStr }} kWp</strong></span>
              </li>
              <li v-if="narrativePanelsN != null" class="plan-narr-spec">
                <span class="plan-narr-ico" aria-hidden="true">⚡</span>
                <span><strong>{{ narrativePanelsN }} módulos fotovoltaicos</strong></span>
              </li>
            </ul>
          </template>
          <p v-else class="plan-narr-fallback">
            Solutimp Energy puede dimensionar una configuración energética acorde a tu perfil, techumbre y consumo.
          </p>
        </template>
      </div>
    </div>

    <div class="plan-badges animate" style="animation-delay: 0.16s">
      <span class="badge badge--main">Solutimp Energy · Infraestructura energética inteligente + continuidad operacional</span>
      <span class="badge badge--gw">Powered by GoodWe</span>
    </div>

    <p class="plan-disclaimer animate" style="animation-delay: 0.18s">
      {{ narration.planDisclaimer }}
    </p>
    <p class="plan-disclaimer plan-disclaimer--legal animate" style="animation-delay: 0.181s">
      {{ RESULT_LEGAL_DISCLAIMER }}
    </p>

    <p class="plan-social animate" style="animation-delay: 0.185s">
      Evaluación de autonomía energética · Ingeniería aplicada, integración y resiliencia operacional
    </p>

    <p class="plan-mail animate" style="animation-delay: 0.2s">
      También puedes solicitar una revisión técnica por correo:
      <a href="mailto:info@solutimp.cl">info@solutimp.cl</a>
    </p>

    <div class="plan-cta-row animate" style="animation-delay: 0.2s">
      <button
        type="button"
        class="plan-primary-cta"
        :aria-expanded="showContactForm"
        aria-controls="calc-contact-panel"
        @click="revealContactForm"
      >
        {{ narration.formRevealCtaLabel }}
      </button>
      <div class="plan-wa-desktop">
        <a
          class="wa-btn wa-btn--secondary"
          :href="waHref"
          target="_blank"
          rel="noopener noreferrer"
          >{{ narration.whatsappButtonLabel }}</a
        >
      </div>
    </div>

    <p class="sim-disclaimer">
      <span aria-hidden="true">ℹ️</span>
      Simulación preliminar basada en el valor de tu boleta. Para una propuesta exacta revisaremos consumo real,
      orientación, sombras y superficie disponible.
    </p>

    <button type="button" class="btn-onboarding-cta" @click="router.push('/onboarding')">
      Quiero una evaluación técnica completa →
    </button>

    <div
      v-if="showContactForm"
      id="calc-contact-panel"
      class="plan-form animate"
      style="animation-delay: 0.22s"
    >
      <CalcContactBlock />
    </div>

    <div class="wa-sticky hidden-md-up" role="region" aria-label="Contacto WhatsApp">
      <a class="wa-sticky-btn wa-sticky-btn--secondary" :href="waHref" target="_blank" rel="noopener noreferrer">{{
        narration.whatsappButtonLabel
      }}</a>
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

.plan-flow {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

@media (min-width: 768px) {
  .plan {
    margin: -1.25rem -1.25rem -1.5rem;
    padding: 1.5rem 1.25rem 2rem;
  }

  .hidden-md-up {
    display: none !important;
  }

  .plan-cta-row {
    flex-direction: row;
    align-items: stretch;
    gap: 1rem;
  }

  .plan-primary-cta {
    flex: 1.15;
  }

  .plan-wa-desktop {
    flex: 1;
    display: flex;
    align-items: center;
  }

  .plan-wa-desktop .wa-btn {
    margin-bottom: 0;
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

.plan-slot {
  width: 100%;
  min-width: 0;
}

.plan-systems-heading {
  margin: 0.85rem 0 0.45rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #7dd3fc;
}

.plan-coverage-title,
.plan-sistema-title {
  margin: 0 0 0.65rem;
  font-size: 1rem;
  font-weight: 700;
  color: #e2e8f0;
}

.plan-coverage {
  padding: 1.1rem 1rem 1.05rem;
  border-radius: var(--se-radius-md);
  background: var(--plan-surface);
  border: 1px solid rgba(94, 234, 212, 0.35);
}

.plan-sistema {
  text-align: center;
  padding: 1rem 0.85rem 1.1rem;
  border-radius: var(--se-radius-md);
  background: rgba(0, 0, 0, 0.18);
  border: 1px solid var(--plan-border);
}

.plan-sistema-lead {
  margin: 0 0 0.75rem;
  font-size: 0.88rem;
  color: #b8c5d9;
  line-height: 1.5;
}

.plan-roof {
  text-align: center;
  padding: 1rem 0.85rem 1.1rem;
  border-radius: var(--se-radius-md);
  background: rgba(14, 165, 233, 0.06);
  border: 1px solid rgba(14, 165, 233, 0.28);
}

.plan-roof-title {
  margin: 0 0 0.5rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #7dd3fc;
}

.plan-roof-headline {
  margin: 0 0 0.45rem;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.45;
  color: #f1f5f9;
}

.plan-roof-context {
  margin: 0 0 0.5rem;
  font-size: 0.82rem;
  line-height: 1.45;
  color: #b8c5d9;
}

.plan-roof-parking {
  margin: 0 0 0.5rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: #cbd5e1;
  line-height: 1.4;
}

.plan-roof-orient {
  margin: 0 0 0.45rem;
  font-size: 0.78rem;
  color: #94a3b8;
  line-height: 1.4;
}

.plan-roof-warn {
  margin: 0 0 0.55rem;
  font-size: 0.78rem;
  font-weight: 600;
  line-height: 1.45;
  color: #fcd34d;
}

.plan-roof-foot {
  margin: 0;
  font-size: 0.72rem;
  line-height: 1.45;
  color: #8899af;
}

.plan-autonomy {
  text-align: center;
}

.plan-autonomy--hero {
  padding: 1rem 0.85rem 1.1rem;
  border-radius: var(--se-radius-md);
  background: linear-gradient(145deg, rgba(94, 234, 212, 0.1) 0%, rgba(0, 0, 0, 0.15) 60%);
  border: 1px solid rgba(94, 234, 212, 0.35);
}

.plan-autonomy-kpi {
  margin: 0 0 0.35rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #7dd3fc;
}

.plan-autonomy-range {
  margin: 0;
  font-size: clamp(1.35rem, 5vw, 1.85rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #5eead4;
  line-height: 1.2;
}

.plan-autonomy-scope {
  display: block;
  margin-top: 0.45rem;
  font-size: 0.88rem;
  font-weight: 500;
  color: #cbd5e1;
  letter-spacing: normal;
}

.plan-autonomy-disclaimer {
  margin: 0.75rem 0 0;
  font-size: 0.74rem;
  line-height: 1.45;
  color: #8899af;
}

.plan-kpi--secondary .plan-kpi-value {
  font-size: clamp(2rem, 8vw, 2.75rem);
}

.plan-kpi--secondary {
  opacity: 0.95;
  border-color: rgba(255, 255, 255, 0.08);
}

.plan-backup--subtle {
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: none;
  background: var(--plan-surface);
  padding-top: 0.95rem;
  padding-bottom: 0.95rem;
}

.plan-backup--subtle::before {
  display: none;
}

.plan-cta-row {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin: 1rem 0 0.75rem;
}

.plan-primary-cta {
  width: 100%;
  box-sizing: border-box;
  padding: 0.95rem 1rem;
  border-radius: var(--se-radius-md);
  border: none;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  color: #0d1f35;
  background: linear-gradient(135deg, #5eead4 0%, #38bdf8 100%);
}

.plan-primary-cta:focus {
  outline: 2px solid #e0f2fe;
  outline-offset: 2px;
}

.plan-primary-cta:focus:not(:focus-visible) {
  outline: none;
}

.plan-primary-cta:focus-visible {
  outline: 2px solid #e0f2fe;
  outline-offset: 2px;
}

.plan-wa-desktop {
  display: block;
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

.plan-claim {
  margin: 0.45rem 0 0;
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1.45;
  color: #b8c5d9;
  max-width: 22rem;
  margin-left: auto;
  margin-right: auto;
}

.plan-kicker {
  margin: 0.35rem 0 0.25rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #94a3b8;
}

.plan-section-title {
  margin: 0 0 0.65rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #7dd3fc;
}

.plan-section-title--compact {
  margin-bottom: 0.5rem;
}

.plan-tech {
  text-align: center;
  padding: 1rem 0.85rem 1.1rem;
  border-radius: var(--se-radius-md);
  background: rgba(0, 0, 0, 0.18);
  border: 1px solid var(--plan-border);
}

.plan-tech-lead {
  margin: 0 0 0.75rem;
  font-size: 0.88rem;
  color: #b8c5d9;
  line-height: 1.5;
}

.plan-invest {
  text-align: center;
  padding: 1rem 0.85rem 1.1rem;
  border-radius: var(--se-radius-md);
  background: linear-gradient(145deg, rgba(56, 189, 248, 0.08) 0%, rgba(0, 0, 0, 0.12) 55%);
  border: 1px solid rgba(56, 189, 248, 0.35);
}

.plan-invest-line {
  margin: 0 0 0.5rem;
  font-size: clamp(1.05rem, 3.8vw, 1.25rem);
  font-weight: 700;
  color: #f1f5f9;
  line-height: 1.35;
}

.plan-invest-line--soft {
  font-size: 0.92rem;
  font-weight: 500;
  color: #94a3b8;
}

.plan-invest-sub {
  margin: 0;
  font-size: 0.76rem;
  line-height: 1.45;
  color: #8899af;
}

.plan-continuity {
  margin-bottom: 1rem;
  padding: 1.1rem 1rem 1.05rem;
  border-radius: var(--se-radius-md);
  background: var(--plan-surface);
  border: 1px solid var(--plan-border);
}

.plan-continuity--accent {
  border-color: rgba(94, 234, 212, 0.45);
  box-shadow:
    0 0 0 1px rgba(94, 234, 212, 0.12),
    0 12px 36px rgba(0, 0, 0, 0.25);
  background: linear-gradient(145deg, rgba(94, 234, 212, 0.08) 0%, rgba(0, 0, 0, 0.12) 55%);
}

.plan-continuity-keyline {
  margin: 0 0 0.35rem;
  font-size: 0.88rem;
  font-weight: 700;
  color: #e2e8f0;
}

.plan-continuity-subtitle {
  margin: 0.85rem 0 0.45rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #5eead4;
}

.plan-outage-list {
  list-style: none;
  margin: 0 0 0.85rem;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.plan-outage-item {
  display: flex;
  align-items: flex-start;
  gap: 0.45rem;
  font-size: 0.8rem;
  line-height: 1.4;
  color: #cbd5e1;
}

.plan-outage-item--partial,
.plan-outage-item--caution {
  color: #fcd34d;
}

.plan-outage-ico {
  flex-shrink: 0;
  line-height: 1.35;
}

.plan-autonomy--embed {
  margin-bottom: 0.85rem;
}

.plan-impact {
  padding: 0.25rem 0 0.35rem;
}

.plan-kpi--in-impact {
  margin-top: 1rem;
  border-radius: var(--se-radius-md);
  padding: 1rem 0.75rem 1.1rem;
  background: rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.plan-roi {
  text-align: center;
  padding: 1rem 0.85rem 1.15rem;
  border-radius: var(--se-radius-md);
  background: rgba(0, 0, 0, 0.16);
  border: 1px solid var(--plan-border);
}

.plan-roi-annual {
  margin: 0 0 0.65rem;
  font-size: 0.88rem;
  color: #cbd5e1;
  line-height: 1.45;
}

.plan-roi-range-line {
  margin: 0 0 0.55rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #f1f5f9;
  line-height: 1.45;
}

.plan-roi-note {
  margin: 0.45rem 0 0;
  font-size: 0.78rem;
  line-height: 1.45;
  color: #94a3b8;
}

.plan-roi-note--continuity {
  margin-top: 0.65rem;
  padding-top: 0.65rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.plan-disclaimer--legal {
  margin-top: 0.35rem;
  font-size: 0.76rem;
  color: #7c8ca0;
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

.plan-kpi-complement {
  margin: 0.75rem 0 0;
  font-size: 0.78rem;
  line-height: 1.4;
  color: #8899af;
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

.wa-btn--secondary {
  font-weight: 600;
  font-size: 0.92rem;
  padding: 0.75rem 1rem;
  background: transparent;
  color: #a5f3fc !important;
  border: 1px solid rgba(94, 234, 212, 0.45);
}

.wa-btn--secondary:hover {
  background: rgba(94, 234, 212, 0.08);
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

.wa-sticky-btn--secondary {
  font-weight: 600;
  font-size: 0.92rem;
  background: rgba(37, 211, 102, 0.2);
  border: 1px solid rgba(37, 211, 102, 0.55);
  color: #ecfdf5 !important;
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

.sim-disclaimer {
  font-size: 0.78rem;
  color: var(--se-text-muted, #8899aa);
  margin-top: 12px;
  line-height: 1.5;
  display: flex;
  gap: 6px;
  align-items: flex-start;
}

.btn-onboarding-cta {
  width: 100%;
  margin-top: 8px;
  padding: 12px 16px;
  border: 1.5px solid var(--se-green, #1d9e75);
  background: transparent;
  color: var(--se-green, #1d9e75);
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
}

.btn-onboarding-cta:hover {
  background: var(--se-green, #1d9e75);
  color: #fff;
}
</style>
