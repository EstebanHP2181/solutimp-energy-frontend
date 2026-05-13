<script setup lang="ts">
import { inject } from 'vue'
import { calculadoraFlowKey, type CalcSecondaryPriorityId } from '@/composables/useCalculadoraFlow'

const flow = inject(calculadoraFlowKey)!

const options: { id: CalcSecondaryPriorityId; label: string }[] = [
  { id: 'internet_wifi', label: 'Internet / WiFi' },
  { id: 'porton', label: 'Portón eléctrico' },
  { id: 'camaras', label: 'Cámaras y seguridad' },
  { id: 'refrigeracion', label: 'Refrigeración' },
  { id: 'iluminacion', label: 'Iluminación crítica' },
  { id: 'aire_acondicionado', label: 'Aire acondicionado' },
  { id: 'bombas', label: 'Bombas de agua' },
  { id: 'oficina', label: 'Equipos de oficina' },
  { id: 'ev', label: 'Carga vehículo eléctrico' },
]

function isOn(id: CalcSecondaryPriorityId) {
  return flow.secondaryPriorities.includes(id)
}

function toggle(id: CalcSecondaryPriorityId) {
  flow.toggleSecondary(id)
}

function continueNext() {
  flow.next()
}
</script>

<template>
  <div class="calc-step">
    <p class="calc-step__eyebrow">Prioridades</p>
    <h2 class="calc-step__title">¿Qué también te gustaría respaldar o proteger?</h2>
    <p class="calc-step__hint">Opcional. Puedes elegir varias; nos ayuda a entender tu contexto.</p>
    <div class="chips" role="group" aria-label="Prioridades secundarias">
      <button
        v-for="o in options"
        :key="o.id"
        type="button"
        class="chip"
        :class="{ 'chip--on': isOn(o.id) }"
        :aria-pressed="isOn(o.id) ? 'true' : 'false'"
        @click="toggle(o.id)"
      >
        {{ o.label }}
      </button>
    </div>
    <button type="button" class="se-btn se-btn--mt" @click="continueNext">Continuar evaluación</button>
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
  font-size: clamp(1.05rem, 4vw, 1.22rem);
  font-weight: 700;
  margin: 0 0 0.45rem;
  line-height: 1.3;
  letter-spacing: -0.02em;
}

.calc-step__hint {
  font-size: 0.86rem;
  color: var(--se-text-muted);
  line-height: 1.45;
  margin: 0 0 1rem;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.15rem;
}

.chip {
  border-radius: 999px;
  padding: 0.62rem 0.95rem;
  font-size: 0.86rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  border: 1px solid var(--se-glass-border);
  background: rgba(6, 20, 38, 0.45);
  color: var(--se-text);
  transition:
    border-color var(--se-transition),
    background var(--se-transition),
    transform var(--se-transition);
}

.chip:hover {
  border-color: rgba(0, 212, 255, 0.35);
}

.chip--on {
  border-color: var(--se-green);
  background: rgba(0, 200, 150, 0.12);
  color: #e8fff8;
}

.se-btn--mt {
  width: 100%;
  min-height: 3rem;
  font-size: 1rem;
  padding: 0.85rem 1rem;
}
</style>
