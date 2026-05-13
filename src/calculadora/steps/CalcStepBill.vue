<script setup lang="ts">
import { inject } from 'vue'
import { calculadoraFlowKey } from '@/composables/useCalculadoraFlow'
import { formatCLP } from '@/shared/formatCLP'

const flow = inject(calculadoraFlowKey)!

function billDisplay(): string {
  return formatCLP(flow.monthlyBillAmount)
}

function onSliderInput(e: Event) {
  const t = e.target as HTMLInputElement
  flow.monthlyBillAmount = Number(t.value)
}

function continueNext() {
  if (!flow.canAdvanceBill()) return
  flow.next()
}
</script>

<template>
  <div class="calc-step">
    <p class="calc-step__eyebrow">Consumo</p>
    <h2 class="calc-step__title">¿Cuánto pagas al mes de luz?</h2>
    <p class="calc-step__hint">Aproximado según tu última boleta o promedio trimestral.</p>

    <div class="bill-block" aria-live="polite">
      <p class="bill-amount">{{ billDisplay() }}</p>
      <label class="sr-only" for="calc-bill-slider">Monto mensual estimado de electricidad</label>
      <input
        id="calc-bill-slider"
        type="range"
        class="bill-slider"
        :min="flow.SLIDER_MIN"
        :max="flow.SLIDER_MAX"
        :step="flow.SLIDER_STEP"
        :value="flow.monthlyBillAmount"
        @input="onSliderInput"
      />
      <p class="bill-foot">Mientras más exacto, mejor será tu estimación.</p>
    </div>

    <button type="button" class="se-btn se-btn--mt" :disabled="!flow.canAdvanceBill()" @click="continueNext">
      Continuar
    </button>
  </div>
</template>

<style scoped>
.calc-step__eyebrow {
  margin: 0 0 0.35rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--se-cyan);
}

.calc-step__title {
  font-size: clamp(1.1rem, 4.2vw, 1.28rem);
  font-weight: 700;
  margin: 0 0 0.45rem;
  line-height: 1.3;
  letter-spacing: -0.02em;
}

.calc-step__hint {
  font-size: 0.86rem;
  color: var(--se-text-muted);
  line-height: 1.45;
  margin: 0 0 1.1rem;
}

.bill-block {
  margin-bottom: 1.1rem;
  padding: 1rem 0.85rem 1.1rem;
  border-radius: var(--se-radius-md);
  border: 1px solid var(--se-glass-border);
  background: rgba(6, 20, 38, 0.45);
}

.bill-amount {
  margin: 0 0 0.85rem;
  font-size: clamp(1.75rem, 6.5vw, 2.35rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--se-cyan);
  text-align: center;
  line-height: 1.1;
}

.bill-slider {
  width: 100%;
  height: 2.35rem;
  margin: 0 0 0.65rem;
  cursor: pointer;
  touch-action: manipulation;
  accent-color: var(--se-blue-electric);
}

.bill-foot {
  margin: 0;
  font-size: 0.82rem;
  color: var(--se-text-muted);
  text-align: center;
  line-height: 1.4;
}

.se-btn--mt {
  margin-top: 0.2rem;
  width: 100%;
  min-height: 3rem;
  font-size: 1rem;
  padding: 0.85rem 1rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
