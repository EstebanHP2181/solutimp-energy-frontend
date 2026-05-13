<script setup lang="ts">
import { inject } from 'vue'
import { calculadoraFlowKey, type CalcMainGoal } from '@/composables/useCalculadoraFlow'

const flow = inject(calculadoraFlowKey)!

/** UI nueva → mismo `mainGoal` / API que antes (primaryObjective = mainGoal). */
const goalOptions: { value: Exclude<CalcMainGoal, ''>; label: string; hint: string }[] = [
  { value: 'ahorro', label: 'Reducir mi boleta eléctrica', hint: 'Optimizar costos mensuales' },
  { value: 'respaldo', label: 'Mantener mi propiedad operativa durante cortes', hint: 'Continuidad cuando falla la red' },
  { value: 'equipos_criticos', label: 'Lograr mayor autonomía energética', hint: 'Más control sobre tu energía' },
  { value: 'vender_excedente', label: 'Aprovechar excedentes solares', hint: 'Uso inteligente de lo que generas' },
  { value: 'empresa', label: 'Busco un equilibrio general', hint: 'Balance entre ahorro, respaldo y crecimiento' },
]

function onSelect(v: Exclude<CalcMainGoal, ''>) {
  flow.selectMainGoal(v)
}
</script>

<template>
  <div class="calc-step">
    <p class="calc-step__eyebrow">Objetivo</p>
    <h2 class="calc-step__title">¿Cuál es tu objetivo principal?</h2>
    <p class="calc-step__hint">Selecciona la intención que mejor te represente hoy.</p>
    <div class="calc-step__list" role="list">
      <button
        v-for="o in goalOptions"
        :key="o.value"
        type="button"
        class="goal-card"
        :class="{ 'goal-card--selected': flow.mainGoal === o.value }"
        :aria-pressed="flow.mainGoal === o.value ? 'true' : 'false'"
        role="listitem"
        @click="onSelect(o.value)"
      >
        <span class="goal-card__text">{{ o.label }}</span>
        <span class="goal-card__hint">{{ o.hint }}</span>
        <span v-if="flow.mainGoal === o.value" class="goal-card__check" aria-hidden="true">✓</span>
      </button>
    </div>
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
  margin: 0 0 1.05rem;
}

.calc-step__list {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.goal-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2rem;
  width: 100%;
  padding: 0.95rem 1rem 0.95rem 1.05rem;
  border-radius: var(--se-radius-md);
  border: 1px solid var(--se-glass-border);
  background: rgba(6, 20, 38, 0.42);
  color: var(--se-text);
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  transition:
    border-color var(--se-transition),
    background var(--se-transition),
    transform var(--se-transition),
    box-shadow var(--se-transition);
}

.goal-card:hover {
  border-color: rgba(0, 212, 255, 0.35);
  transform: translateY(-1px);
}

.goal-card--selected {
  border-color: var(--se-blue-electric);
  background: rgba(0, 102, 217, 0.18);
  box-shadow: 0 0 0 1px rgba(0, 132, 255, 0.2);
}

.goal-card__text {
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.3;
  padding-right: 1.5rem;
}

.goal-card__hint {
  font-size: 0.78rem;
  color: var(--se-text-muted);
  line-height: 1.35;
}

.goal-card__check {
  position: absolute;
  right: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--se-green);
  font-weight: 700;
  font-size: 1.05rem;
}
</style>
