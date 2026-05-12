<script setup lang="ts">
import { inject } from 'vue'
import OptionCard from '@/components/wizard/OptionCard.vue'
import { calculadoraFlowKey, type CalcMainGoal, type CalcPropertyType } from '@/composables/useCalculadoraFlow'
import { formatCLP } from '@/shared/formatCLP'

const flow = inject(calculadoraFlowKey)!

const propertyOptions: { value: Exclude<CalcPropertyType, ''>; label: string; icon: string }[] = [
  { value: 'casa', label: 'Casa', icon: '🏠' },
  { value: 'parcela', label: 'Parcela / campo', icon: '🌾' },
  { value: 'empresa', label: 'Empresa / oficina', icon: '🏢' },
  { value: 'condominio', label: 'Condominio', icon: '🏘️' },
  { value: 'bodega', label: 'Bodega / industrial', icon: '🏭' },
]

const goalOptions: { value: Exclude<CalcMainGoal, ''>; label: string; icon: string }[] = [
  { value: 'ahorro', label: 'Ahorrar en la cuenta de luz', icon: '💡' },
  { value: 'respaldo', label: 'Tener respaldo ante cortes', icon: '⚡' },
  { value: 'equipos_criticos', label: 'Proteger equipos críticos', icon: '🔌' },
  { value: 'vender_excedente', label: 'Vender excedentes de energía', icon: '↗️' },
  { value: 'empresa', label: 'Proyecto para empresa', icon: '📊' },
]

function billDisplay(): string {
  return formatCLP(flow.monthlyBillAmount.value)
}

function onSliderInput(e: Event) {
  const t = e.target as HTMLInputElement
  flow.monthlyBillAmount = Number(t.value)
}

function continueNext() {
  if (!flow.canAdvanceProfile()) return
  flow.next()
}
</script>

<template>
  <div class="step">
    <h2 class="step-q">¿Cuánto pagas al mes de luz?</h2>
    <p class="step-hint">Aproximado según tu última boleta o promedio trimestral.</p>

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

    <h3 class="sub-q">Tipo de propiedad</h3>
    <div class="step-list">
      <OptionCard
        v-for="o in propertyOptions"
        :key="o.value"
        :label="o.label"
        :icon="o.icon"
        :selected="flow.propertyType === o.value"
        @select="flow.propertyType = o.value"
      />
    </div>

    <h3 class="sub-q">Tu objetivo principal</h3>
    <div class="step-list">
      <OptionCard
        v-for="o in goalOptions"
        :key="o.value"
        :label="o.label"
        :icon="o.icon"
        :selected="flow.mainGoal === o.value"
        @select="flow.mainGoal = o.value"
      />
    </div>

    <button type="button" class="se-btn se-btn--mt" :disabled="!flow.canAdvanceProfile()" @click="continueNext">
      Continuar
    </button>
  </div>
</template>

<style scoped>
.step-q {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  line-height: 1.35;
}

.step-hint {
  font-size: 0.88rem;
  color: var(--se-text-muted);
  line-height: 1.45;
  margin: 0 0 1.1rem;
}

.bill-block {
  margin-bottom: 1.35rem;
  padding: 1rem 0.85rem 1.1rem;
  border-radius: var(--se-radius-md);
  border: 1px solid var(--se-glass-border);
  background: rgba(6, 20, 38, 0.45);
}

.bill-amount {
  margin: 0 0 0.85rem;
  font-size: clamp(1.85rem, 7vw, 2.45rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--se-cyan);
  text-align: center;
  line-height: 1.1;
}

.bill-slider {
  width: 100%;
  height: 2.25rem;
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

.sub-q {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 0.65rem;
  line-height: 1.3;
}

.step-list {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  margin-bottom: 1.1rem;
}

.se-btn--mt {
  margin-top: 0.35rem;
  width: 100%;
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
