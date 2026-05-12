<script setup lang="ts">
import { computed, inject } from 'vue'
import { CHILE_REGIONS } from '@/shared/chileRegions'
import { wizardInjectionKey } from '@/composables/useWizard'

const w = inject(wizardInjectionKey)!

const canContinue = computed(() => w.region.length > 0)

async function continueNext() {
  if (!canContinue.value || w.simulationLoading) return
  await w.simulateProject()
  w.next()
}
</script>

<template>
  <div class="step">
    <h2 class="step-q">¿En qué región está la propiedad?</h2>
    <p class="step-hint">La generación solar cambia según la ubicación. Esto nos ayuda con una estimación inicial.</p>
    <label class="sr-only" for="region-select">Región</label>
    <select id="region-select" v-model="w.region" class="se-select" required>
      <option disabled value="">Selecciona una región</option>
      <option v-for="r in CHILE_REGIONS" :key="r.value" :value="r.value">{{ r.label }}</option>
    </select>
    <button type="button" class="se-btn se-btn--mt" :disabled="!canContinue || w.simulationLoading" @click="continueNext">
      <span v-if="w.simulationLoading" class="spin" aria-hidden="true" />
      {{ w.simulationLoading ? 'Preparando tu propuesta…' : 'Continuar' }}
    </button>
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
  margin: 0 0 1rem;
}

.se-select {
  width: 100%;
  padding: 1rem 1rem;
  border-radius: var(--se-radius-md);
  border: 1px solid var(--se-glass-border);
  background: rgba(6, 20, 38, 0.65);
  color: var(--se-text);
  font-size: 1rem;
  font-family: inherit;
  margin-bottom: 1rem;
  cursor: pointer;
}

.se-select:focus {
  outline: 2px solid var(--se-cyan);
  outline-offset: 2px;
}

.se-btn--mt {
  margin-top: 0.25rem;
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

.spin {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  margin-right: 0.45rem;
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-top-color: var(--se-cyan);
  border-radius: 50%;
  vertical-align: -0.15em;
  animation: spin-360 0.7s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .spin {
    animation: none;
    border-top-color: rgba(255, 255, 255, 0.5);
  }
}

@keyframes spin-360 {
  to {
    transform: rotate(360deg);
  }
}
</style>
