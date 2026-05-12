<script setup lang="ts">
import { inject } from 'vue'
import OptionCard from '@/components/wizard/OptionCard.vue'
import { wizardInjectionKey, type MainGoal } from '@/composables/useWizard'

const w = inject(wizardInjectionKey)!

const options: { value: MainGoal; label: string; icon: string }[] = [
  { value: 'ahorro', label: 'Ahorrar en la cuenta de luz', icon: '💡' },
  { value: 'respaldo', label: 'Tener respaldo ante cortes', icon: '⚡' },
  { value: 'equipos_criticos', label: 'Proteger portón, cámaras, internet o equipos críticos', icon: '🔌' },
  { value: 'vender_excedente', label: 'Vender excedentes de energía', icon: '↗️' },
  { value: 'empresa', label: 'Evaluar un proyecto para empresa', icon: '📊' },
]

function pick(v: MainGoal) {
  w.mainGoal = v
  w.next()
}
</script>

<template>
  <div class="step">
    <h2 class="step-q">¿Qué quieres lograr principalmente?</h2>
    <p class="step-hint">
      Esto nos ayuda a orientar la propuesta: Solutimp Energy combina solar, domótica y respaldo técnico.
    </p>
    <div class="step-list">
      <OptionCard
        v-for="o in options"
        :key="o.value"
        :label="o.label"
        :icon="o.icon"
        :selected="w.mainGoal === o.value"
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

.step-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}
</style>
