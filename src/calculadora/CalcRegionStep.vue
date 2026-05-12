<script setup lang="ts">
import { computed, inject } from 'vue'
import { calculadoraFlowKey } from '@/composables/useCalculadoraFlow'
import { CHILE_REGIONS } from '@/shared/chileRegions'

const flow = inject(calculadoraFlowKey)!

const canContinue = computed(() => flow.canAdvanceRegion())
</script>

<template>
  <div class="step">
    <h2 class="step-q">¿En qué región está la propiedad?</h2>
    <p class="step-hint">La estimación considera radiación solar típica de la zona.</p>
    <label class="sr-only" for="calc-region-select">Región</label>
    <select id="calc-region-select" v-model="flow.region" class="se-select" required>
      <option disabled value="">Selecciona una región</option>
      <option v-for="r in CHILE_REGIONS" :key="r.value" :value="r.value">{{ r.label }}</option>
    </select>
    <button
      type="button"
      class="se-btn se-btn--mt"
      :disabled="!canContinue || flow.simulationLoading"
      @click="flow.continueFromRegion()"
    >
      <span v-if="flow.simulationLoading" class="spin" aria-hidden="true" />
      {{ flow.simulationLoading ? 'Calculando…' : 'Ver mi estimación' }}
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

.spin {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  margin-right: 0.45rem;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: var(--se-cyan);
  border-radius: 50%;
  vertical-align: -0.15em;
  animation: calc-spin 0.7s linear infinite;
}

@keyframes calc-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
