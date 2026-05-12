<script setup lang="ts">
import { computed, inject } from 'vue'
import { wizardInjectionKey } from '@/composables/useWizard'
import { formatCLP } from '@/shared/formatCLP'
import { buildWhatsAppLink } from '@/shared/whatsapp'

const w = inject(wizardInjectionKey)!

const firstName = () => {
  const n = w.name.trim().split(/\s+/)[0]
  return n || 'Cliente'
}

const sim = computed(() => w.simulationResult)
const econ = computed(() => sim.value?.economics)

const waHref = computed(() => {
  const who = firstName()
  return buildWhatsAppLink(
    `Hola, soy ${who}. Completé la evaluación SOLUTIMP ENERGY y quiero conversar sobre mi propuesta.`
  )
})

const savingsLine = computed(() => {
  const e = econ.value
  if (e?.monthly_savings_min != null && e?.monthly_savings_max != null) {
    return `${formatCLP(e.monthly_savings_min)} – ${formatCLP(e.monthly_savings_max)} / mes estimado`
  }
  return 'Ahorro orientativo entre 60% y 80% respecto de tu cuenta actual (sujeto a evaluación técnica)'
})

const panelsLine = computed(() => {
  const s = sim.value
  if (s?.panels != null && s?.power_kwp != null) {
    return `${s.panels} paneles · ${s.power_kwp} kWp`
  }
  return 'Sistema dimensionado según tu perfil'
})
</script>

<template>
  <div class="step step-result">
    <h2 class="step-q">Gracias, {{ firstName() }}. Ya tenemos tu solicitud.</h2>
    <p class="step-hint">
      Resumen de tu <strong>propuesta preliminar</strong>. Los valores son orientativos hasta la visita técnica.
    </p>
    <div class="cards">
      <div class="mini se-glass">
        <h3>Ahorro mensual</h3>
        <p>{{ savingsLine }}</p>
      </div>
      <div class="mini se-glass">
        <h3>Tu sistema</h3>
        <p>{{ panelsLine }}</p>
        <p v-if="sim?.panel_model" class="sub">{{ sim.panel_model }}</p>
      </div>
      <div class="mini se-glass">
        <h3>Siguiente paso</h3>
        <p>Te contactaremos para agendar evaluación técnica sin costo en la zona indicada.</p>
      </div>
      <div class="mini se-glass">
        <h3>Asesoría</h3>
        <p>Propuesta personalizada según región, consumo y objetivos que marcaste.</p>
      </div>
    </div>
    <div class="actions">
      <a class="se-btn" href="https://solutimp.cl" target="_blank" rel="noopener noreferrer">Visitar solutimp.cl</a>
      <a class="se-btn se-btn--ghost" :href="waHref" target="_blank" rel="noopener noreferrer"
        >💬 Hablar por WhatsApp</a
      >
    </div>
  </div>
</template>

<style scoped>
.step-result .step-q {
  text-align: center;
  font-size: 1.15rem;
}

.step-hint {
  font-size: 0.88rem;
  color: var(--se-text-muted);
  line-height: 1.45;
  margin: 0 0 1.25rem;
  text-align: center;
}

.step-hint strong {
  color: var(--se-cyan);
}

.cards {
  display: grid;
  gap: 0.65rem;
  margin-bottom: 1.25rem;
}

@media (min-width: 600px) {
  .cards {
    grid-template-columns: 1fr 1fr;
  }
}

.mini {
  border-radius: var(--se-radius-md);
  padding: 0.85rem 1rem;
  transition:
    transform var(--se-transition),
    box-shadow var(--se-transition);
}

.mini:hover {
  transform: scale(1.02);
  box-shadow: 0 0 20px var(--se-glow);
}

.mini h3 {
  margin: 0 0 0.35rem;
  font-size: 0.95rem;
  color: var(--se-text);
}

.mini p {
  margin: 0;
  font-size: 0.8rem;
  color: var(--se-text-muted);
  line-height: 1.4;
}

.mini .sub {
  margin-top: 0.35rem;
  font-size: 0.75rem;
  color: var(--se-text-muted);
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.actions .se-btn {
  text-decoration: none;
  box-sizing: border-box;
  text-align: center;
}
</style>
