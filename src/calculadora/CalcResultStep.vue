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

const currentBill = computed(
  () => econ.value?.current_bill_estimate ?? econ.value?.bill_current
)
const newBill = computed(() => econ.value?.new_bill_estimate ?? econ.value?.bill_new)

/** Valor principal del KPI mensual (medio si hay rango). */
const monthlySavingsHero = computed(() => {
  const e = econ.value
  if (e?.monthly_savings_min != null && e?.monthly_savings_max != null) {
    const a = e.monthly_savings_min
    const b = e.monthly_savings_max
    if (Number.isFinite(a) && Number.isFinite(b) && Math.max(a, b) > 0) {
      return formatCLP(Math.round((a + b) / 2))
    }
  }
  if (e?.monthly_savings_min != null && e.monthly_savings_min > 0) {
    return formatCLP(e.monthly_savings_min)
  }
  return null
})

const monthlySavingsSubline = computed(() => {
  const e = econ.value
  if (e?.monthly_savings_min != null && e?.monthly_savings_max != null) {
    return `Entre ${formatCLP(e.monthly_savings_min)} y ${formatCLP(e.monthly_savings_max)} / mes`
  }
  return null
})

const annualSavingsHero = computed(() => {
  const a = econ.value?.annual_savings
  if (a != null && Number.isFinite(a) && a > 0) return formatCLP(a)
  return null
})

const panels = computed(() => sim.value?.system?.panels ?? sim.value?.panels)
const powerKwp = computed(() => sim.value?.system?.power_kwp ?? sim.value?.power_kwp)
const includesBattery = computed(
  () => !!(sim.value?.system?.includes_battery ?? sim.value?.includes_battery)
)

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

/** Barra: total = boleta actual; segmentos = nueva boleta + ahorro. */
const compareBar = computed(() => {
  const cur = currentBill.value
  const neu = newBill.value
  if (cur == null || neu == null || cur <= 0) {
    return { newPct: 0, savingsPct: 0, hasData: false as const }
  }
  const savings = Math.max(0, cur - neu)
  const newPct = Math.min(100, Math.round((neu / cur) * 100))
  const savingsPct = Math.min(100, Math.round((savings / cur) * 100))
  return { newPct, savingsPct, hasData: true as const }
})

const waHref = computed(() => {
  const bill = formatCLP(flow.monthlyBillAmount)
  const reg = flow.regionLabel(flow.region)
  const msg = `Hola, usé la calculadora solar de Solutimp Energy. Pago unos ${bill} al mes de luz en ${reg}. Quiero orientación por WhatsApp.`
  return buildWhatsAppLink(msg)
})
</script>

<template>
  <div class="plan">
    <header class="plan-head animate">
      <p class="plan-eyebrow">Plan de independencia energética</p>
      <h2 class="plan-title">Tu estimación en un vistazo</h2>
    </header>

    <section class="plan-kpi animate" style="animation-delay: 0.05s">
      <p class="plan-kpi-label">Podrías dejar de pagar aprox.</p>
      <p v-if="monthlySavingsHero" class="plan-kpi-value">{{ monthlySavingsHero }}</p>
      <p v-else class="plan-kpi-value plan-kpi-value--soft">—</p>
      <p class="plan-kpi-unit">al mes</p>
      <p v-if="monthlySavingsSubline" class="plan-kpi-range">{{ monthlySavingsSubline }}</p>
    </section>

    <p v-if="annualSavingsHero" class="plan-annual animate" style="animation-delay: 0.1s">
      Equivale a aprox. <strong>{{ annualSavingsHero }}</strong> al año
    </p>

    <section class="plan-compare animate" style="animation-delay: 0.12s">
      <div class="plan-cards">
        <div class="plan-card">
          <span class="plan-card-label">Hoy pagas</span>
          <span class="plan-card-val">{{ currentBill != null ? formatCLP(currentBill) : '—' }}</span>
          <span class="plan-card-hint">Boleta estimada</span>
        </div>
        <div class="plan-card plan-card--solar">
          <span class="plan-card-label">Con solar estimado</span>
          <span class="plan-card-val">{{ newBill != null ? formatCLP(newBill) : '—' }}</span>
          <span class="plan-card-hint">Incluye cargos típicos</span>
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
      <p v-else class="plan-bar-fallback">Comparación visual cuando haya datos de boleta actual y nueva.</p>
    </section>

    <div v-if="systemTeaser" class="plan-system animate" style="animation-delay: 0.14s">
      {{ systemTeaser }}
    </div>

    <div class="plan-badges animate" style="animation-delay: 0.16s">
      <span class="badge badge--main">Solutimp Energy · Tecnología solar + respaldo inteligente</span>
      <span class="badge badge--gw">Powered by GoodWe</span>
    </div>

    <p class="plan-disclaimer animate" style="animation-delay: 0.18s">
      Estimación preliminar. Un especialista Solutimp puede validar tu techo, consumo real y respaldo ideal.
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

    <!-- Sticky solo móvil; en desktop el CTA inline arriba basta -->
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
  margin-bottom: 0.85rem;
}

.plan-kpi-label {
  margin: 0 0 0.35rem;
  font-size: 1rem;
  font-weight: 500;
  color: #b8c5d9;
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
  margin: 0 0 0.85rem;
  max-width: 26rem;
  margin-left: auto;
  margin-right: auto;
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
