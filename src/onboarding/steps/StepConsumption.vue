<script setup lang="ts">
import { inject } from 'vue'
import OptionCard from '@/components/wizard/OptionCard.vue'
import { wizardInjectionKey, type ConsumptionRange } from '@/composables/useWizard'

const w = inject(wizardInjectionKey)!

const options: { value: ConsumptionRange; label: string }[] = [
  { value: 'lt50', label: 'Menos de $50.000' },
  { value: '50_100', label: '$50.000 a $100.000' },
  { value: '100_200', label: '$100.000 a $200.000' },
  { value: 'gt200', label: 'Más de $200.000' },
  { value: 'unknown', label: 'No lo sé' },
]

function pick(v: ConsumptionRange) {
  w.consumptionRange = v
  w.next()
}
</script>

<template>
  <div class="step">
    <h2 class="step-q">¿Cuánto pagas aproximadamente en tu cuenta de luz?</h2>
    <p class="step-hint">
      Con este dato estimaremos un <strong>rango preliminar</strong> de ahorro. No es una promesa de ahorro
      exacto: depende de ubicación, consumo y superficie disponible.
    </p>
    <div class="step-list">
      <OptionCard
        v-for="o in options"
        :key="o.value"
        :label="o.label"
        :selected="w.consumptionRange === o.value"
        @select="pick(o.value)"
      />
    </div>
  </div>
</template>

<style scoped>
.step-q {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 0.75rem;
  line-height: 1.35;
}

.step-hint {
  font-size: 0.88rem;
  color: var(--se-text-muted);
  line-height: 1.45;
  margin: 0 0 1.1rem;
}

.step-hint strong {
  color: var(--se-cyan);
  font-weight: 600;
}

.step-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}
</style>
