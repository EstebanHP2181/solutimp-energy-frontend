<script setup lang="ts">
import { computed, inject } from 'vue'
import { calculadoraFlowKey } from '@/composables/useCalculadoraFlow'
import { formatCLP } from '@/shared/formatCLP'
import { buildWhatsAppLink } from '@/shared/whatsapp'
import CalcContactBlock from './CalcContactBlock.vue'

const flow = inject(calculadoraFlowKey)!

const econ = computed(() => flow.simulationResult?.economics)

const currentBill = computed(
  () => econ.value?.current_bill_estimate ?? econ.value?.bill_current
)
const newBill = computed(() => econ.value?.new_bill_estimate ?? econ.value?.bill_new)

const monthlySavingsLine = computed(() => {
  const e = econ.value
  if (e?.monthly_savings_min != null && e?.monthly_savings_max != null) {
    return `${formatCLP(e.monthly_savings_min)} – ${formatCLP(e.monthly_savings_max)} / mes`
  }
  if (e?.monthly_savings_min != null && e.monthly_savings_min > 0) {
    return `${formatCLP(e.monthly_savings_min)} / mes`
  }
  return 'Estimación sujeta a visita técnica'
})

const annualSavingsLine = computed(() => {
  const a = econ.value?.annual_savings
  if (a != null && Number.isFinite(a) && a > 0) return formatCLP(a)
  return '—'
})

const waHref = computed(() => {
  const bill = formatCLP(flow.monthlyBillAmount)
  const reg = flow.regionLabel(flow.region)
  const msg = `Hola, usé la calculadora solar de Solutimp Energy. Pago unos ${bill} al mes de luz en ${reg}. Quiero orientación por WhatsApp.`
  return buildWhatsAppLink(msg)
})
</script>

<template>
  <div class="step step-result">
    <h2 class="step-q">Tu estimación preliminar</h2>
    <p class="step-hint">
      Cifras orientativas según tu perfil y región. La propuesta final depende de la evaluación en terreno.
    </p>

    <div class="grid">
      <div class="tile se-glass">
        <h3>Boleta actual estimada</h3>
        <p class="val">{{ currentBill != null ? formatCLP(currentBill) : '—' }}</p>
        <p class="sub">Referencia según tu cuenta hoy</p>
      </div>
      <div class="tile se-glass">
        <h3>Boleta estimada con solar</h3>
        <p class="val">{{ newBill != null ? formatCLP(newBill) : '—' }}</p>
        <p class="sub">Incluye cargos fijos típicos</p>
      </div>
      <div class="tile se-glass tile--accent">
        <h3>Ahorro mensual estimado</h3>
        <p class="val">{{ monthlySavingsLine }}</p>
        <p class="sub">Rango o valor según datos disponibles</p>
      </div>
      <div class="tile se-glass tile--accent">
        <h3>Ahorro anual estimado</h3>
        <p class="val">{{ annualSavingsLine }}</p>
        <p class="sub">Proyección anual aproximada</p>
      </div>
    </div>

    <div class="wa-row">
      <a class="se-btn wa" :href="waHref" target="_blank" rel="noopener noreferrer">WhatsApp con un asesor</a>
    </div>

    <CalcContactBlock />
  </div>
</template>

<style scoped>
.step-q {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  line-height: 1.35;
  text-align: center;
}

.step-hint {
  font-size: 0.88rem;
  color: var(--se-text-muted);
  line-height: 1.45;
  margin: 0 0 1.15rem;
  text-align: center;
}

.grid {
  display: grid;
  gap: 0.65rem;
  margin-bottom: 1rem;
}

@media (min-width: 520px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
}

.tile {
  border-radius: var(--se-radius-md);
  padding: 0.9rem 1rem;
}

.tile h3 {
  margin: 0 0 0.35rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--se-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.tile .val {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--se-text);
  line-height: 1.35;
}

.tile--accent .val {
  color: var(--se-cyan);
}

.tile .sub {
  margin: 0.35rem 0 0;
  font-size: 0.75rem;
  color: var(--se-text-muted);
  line-height: 1.35;
}

.wa-row {
  margin-top: 0.25rem;
}

.wa {
  display: block;
  text-align: center;
  text-decoration: none;
  box-sizing: border-box;
  background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
  border: none;
  color: #fff !important;
  font-weight: 600;
}

.wa:hover {
  filter: brightness(1.06);
}
</style>
