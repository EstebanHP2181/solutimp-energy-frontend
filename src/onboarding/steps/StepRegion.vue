<script setup lang="ts">
import { computed, inject } from 'vue'
import { CHILE_REGIONS } from '@/shared/chileRegions'
import { wizardInjectionKey } from '@/composables/useWizard'

const w = inject(wizardInjectionKey)!

const canContinue = computed(() => w.region.length > 0)

function continueNext() {
  if (canContinue.value) w.next()
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
    <button type="button" class="se-btn se-btn--mt" :disabled="!canContinue" @click="continueNext">Continuar</button>
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
</style>
