<script setup lang="ts">
import { computed, inject, watch } from 'vue'
import { wizardInjectionKey } from '@/composables/useWizard'
import { useSavingsRangeAnimation } from '@/composables/useSavingsRangeAnimation'
import { formatCLP } from '@/shared/formatCLP'

const w = inject(wizardInjectionKey)!

const sim = computed(() => w.simulationResult)
const econ = computed(() => sim.value?.economics)
const backup = computed(() => sim.value?.backup)

const hasSavingsRange = computed(() => {
  const e = econ.value
  const a = e?.monthly_savings_min
  const b = e?.monthly_savings_max
  if (typeof a !== 'number' || typeof b !== 'number' || !Number.isFinite(a) || !Number.isFinite(b)) return false
  return Math.max(a, b) > 0
})

const anim = useSavingsRangeAnimation(800)

watch(
  () => [econ.value?.monthly_savings_min, econ.value?.monthly_savings_max] as const,
  ([min, max]) => {
    if (typeof min === 'number' && typeof max === 'number' && max > 0) {
      anim.start(min, max)
    }
  },
  { immediate: true }
)

const showBattery = computed(
  () => !!(sim.value?.includes_battery || backup.value?.available)
)

function formatRoi(y: number | undefined): string {
  if (y == null || !Number.isFinite(y)) return '—'
  return `${y.toLocaleString('es-CL', { maximumFractionDigits: 1 })} años`
}

function goContact() {
  w.next()
}
</script>

<template>
  <div class="prop">
    <!-- Header impacto -->
    <header class="prop-hero">
      <p class="prop-kicker">☀️ Tu sistema solar estimado</p>
      <template v-if="hasSavingsRange">
        <p class="prop-big" aria-live="polite">{{ anim.label }}</p>
        <p class="prop-sub">de ahorro mensual estimado</p>
      </template>
      <template v-else>
        <p class="prop-big prop-big--soft">Ahorro estimado entre 60% y 80%</p>
        <p class="prop-sub">respecto de tu cuenta de luz actual (rango orientativo, sujeto a evaluación técnica)</p>
      </template>
    </header>

    <!-- Sistema -->
    <section class="prop-sec">
      <h3 class="prop-h">Tu sistema</h3>
      <div class="prop-stag prop-stag-1 se-glass mini">
        <p v-if="sim?.panels != null && sim?.power_kwp != null" class="mini-line">
          <strong>{{ sim.panels }}</strong> paneles solares · <strong>{{ sim.power_kwp }}</strong> kWp
        </p>
        <p v-else class="mini-line">Sistema dimensionado según tu perfil y región</p>
        <p v-if="sim?.panel_model" class="mini-muted">Modelo: {{ sim.panel_model }}</p>
      </div>
      <div v-if="sim?.inverter" class="prop-stag prop-stag-2 se-glass mini">
        <p class="mini-line">Inversor <strong>{{ sim.inverter }}</strong></p>
      </div>
      <div v-if="showBattery" class="prop-stag prop-stag-3 se-glass mini mini--bat">
        <p class="mini-line">🔋 Batería / respaldo incluido en la propuesta</p>
      </div>
    </section>

    <!-- Económico -->
    <section class="prop-sec">
      <h3 class="prop-h">Impacto económico</h3>
      <div class="grid2">
        <div class="prop-stag prop-stag-4 se-glass dash">
          <span class="dash-l">Boleta actual</span>
          <span class="dash-v">{{
            econ?.bill_current != null ? formatCLP(econ.bill_current) : 'Según tu rango indicado'
          }}</span>
        </div>
        <div class="prop-stag prop-stag-5 se-glass dash">
          <span class="dash-l">Nueva boleta estimada</span>
          <span class="dash-v">{{ econ?.bill_new != null ? formatCLP(econ.bill_new) : 'Tras solar + optimización' }}</span>
        </div>
        <div class="prop-stag prop-stag-6 se-glass dash">
          <span class="dash-l">Ahorro anual estimado</span>
          <span class="dash-v">{{ econ?.annual_savings != null ? formatCLP(econ.annual_savings) : 'Sujeto a medición' }}</span>
        </div>
        <div class="prop-stag prop-stag-7 se-glass dash">
          <span class="dash-l">Retorno (ROI)</span>
          <span class="dash-v">{{ formatRoi(econ?.roi_years) }}</span>
        </div>
      </div>
    </section>

    <!-- Financiamiento -->
    <section class="prop-sec prop-fin">
      <h3 class="prop-h">Financiamiento referencial</h3>
      <p v-if="econ?.installment_60 != null" class="fin-line">
        Desde <strong>{{ formatCLP(econ.installment_60) }}</strong> / mes (referencial, sin interés)
      </p>
      <p v-else class="fin-line fin-line--muted">Cuotas referenciales según evaluación técnica.</p>
      <p v-if="econ?.installment_120 != null" class="fin-line">
        O <strong>{{ formatCLP(econ.installment_120) }}</strong> / mes a 10 años
      </p>
      <p class="fin-note">
        El valor real se confirma en visita técnica gratuita. Depende de ubicación, consumo y superficie disponible.
      </p>
      <p v-if="econ?.system_price != null" class="fin-note">
        Precio sistema orientativo: <strong>{{ formatCLP(econ.system_price) }}</strong>
      </p>
    </section>

    <!-- Respaldo -->
    <section v-if="backup?.available" class="prop-sec prop-back">
      <h3 class="prop-h">🔋 Respaldo inteligente Solutimp</h3>
      <ul v-if="backup.protected_equipment?.length" class="back-list">
        <li v-for="(item, i) in backup.protected_equipment" :key="i">{{ item }}</li>
      </ul>
      <p class="back-copy">
        Tu portón, cámaras y red WiFi pueden seguir funcionando aunque se vaya la luz. Solutimp Energy integra
        domótica y respaldo con enfoque técnico.
      </p>
    </section>

    <!-- Disclaimer -->
    <p v-if="sim?.disclaimer" class="prop-disclaimer">{{ sim.disclaimer }}</p>
    <p v-else class="prop-disclaimer">
      Los montos son estimación inicial y no constituyen oferta vinculante. La propuesta final requiere visita técnica.
    </p>

    <button type="button" class="se-btn se-btn--pulse prop-cta" @click="goContact">Quiero esta propuesta →</button>
  </div>
</template>

<style scoped>
.prop {
  text-align: left;
}

.prop-hero {
  text-align: center;
  margin-bottom: 1.35rem;
}

.prop-kicker {
  font-size: 0.85rem;
  color: var(--se-cyan);
  font-weight: 600;
  margin: 0 0 0.5rem;
}

.prop-big {
  font-size: clamp(1.35rem, 5.5vw, 2rem);
  font-weight: 800;
  line-height: 1.15;
  margin: 0;
  letter-spacing: -0.02em;
  background: linear-gradient(120deg, #fff 0%, var(--se-cyan) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.prop-big--soft {
  font-size: clamp(1.1rem, 4vw, 1.45rem);
  background: none;
  color: var(--se-text);
}

.prop-sub {
  margin: 0.5rem 0 0;
  font-size: 0.92rem;
  color: var(--se-text-muted);
}

.prop-sec {
  margin-bottom: 1.15rem;
}

.prop-h {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--se-text-muted);
  margin: 0 0 0.55rem;
}

.mini {
  border-radius: var(--se-radius-md);
  padding: 0.75rem 0.9rem;
  margin-bottom: 0.5rem;
}

.mini--bat {
  border-color: rgba(0, 200, 150, 0.35);
}

.mini-line {
  margin: 0;
  font-size: 0.95rem;
}

.mini-muted {
  margin: 0.35rem 0 0;
  font-size: 0.82rem;
  color: var(--se-text-muted);
}

.grid2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

@media (max-width: 480px) {
  .grid2 {
    grid-template-columns: 1fr;
  }
}

.dash {
  border-radius: var(--se-radius-md);
  padding: 0.65rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.dash-l {
  font-size: 0.72rem;
  color: var(--se-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.dash-v {
  font-size: 1rem;
  font-weight: 700;
}

.prop-fin .fin-line {
  margin: 0 0 0.35rem;
  font-size: 0.95rem;
}

.fin-line--muted {
  color: var(--se-text-muted);
  font-size: 0.88rem;
}

.fin-note {
  font-size: 0.8rem;
  color: var(--se-text-muted);
  line-height: 1.45;
  margin: 0.5rem 0 0;
}

.back-list {
  margin: 0 0 0.5rem 1rem;
  padding: 0;
  color: var(--se-text);
  font-size: 0.9rem;
}

.back-copy {
  font-size: 0.86rem;
  color: var(--se-text-muted);
  line-height: 1.45;
  margin: 0;
}

.prop-disclaimer {
  font-size: 0.72rem;
  color: var(--se-text-muted);
  line-height: 1.4;
  margin: 0 0 1rem;
  opacity: 0.95;
}

.prop-cta {
  width: 100%;
  margin-top: 0.25rem;
}

/* Stagger fade-in */
.prop-stag {
  opacity: 0;
  animation: prop-in 0.5s ease forwards;
}

.prop-stag-1 {
  animation-delay: 0ms;
}
.prop-stag-2 {
  animation-delay: 80ms;
}
.prop-stag-3 {
  animation-delay: 160ms;
}
.prop-stag-4 {
  animation-delay: 240ms;
}
.prop-stag-5 {
  animation-delay: 320ms;
}
.prop-stag-6 {
  animation-delay: 400ms;
}
.prop-stag-7 {
  animation-delay: 480ms;
}

@keyframes prop-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .prop-stag {
    opacity: 1;
    animation: none;
  }
}
</style>
