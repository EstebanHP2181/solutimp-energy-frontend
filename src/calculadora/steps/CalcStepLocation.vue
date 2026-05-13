<script setup lang="ts">
import { inject, watch } from 'vue'
import { calculadoraFlowKey } from '@/composables/useCalculadoraFlow'

const flow = inject(calculadoraFlowKey)!

/** Al volver a este paso, rehidratar el borrador desde lo ya confirmado. */
watch(
  () => flow.postHeroStep,
  (step) => {
    if (step === 1 && !flow.calcLocationLine.trim() && flow.communeOrAddress.trim()) {
      flow.calcLocationLine = flow.communeOrAddress
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="calc-step">
    <p class="calc-step__eyebrow">Ubicación</p>
    <h2 class="calc-step__title">¿Dónde está la propiedad?</h2>
    <p class="calc-step__hint">
      Esto nos ayuda a estimar irradiación solar y factibilidad preliminar. Puedes escribir comuna o una dirección
      aproximada.
    </p>
    <label class="field-label" for="calc-location-line">Dirección o comuna</label>
    <input
      id="calc-location-line"
      v-model="flow.calcLocationLine"
      type="text"
      class="field-input"
      name="calc-location"
      autocomplete="street-address"
      placeholder="Ingresa dirección o comuna"
      enterkeyhint="done"
      @keydown.enter.prevent="flow.commitLocationAndAdvance()"
    />
    <p class="field-foot">Tip: si quieres separar calle y comuna, usa una coma.</p>
    <button
      type="button"
      class="se-btn se-btn--mt"
      :disabled="!flow.canAdvanceLocation()"
      @click="flow.commitLocationAndAdvance()"
    >
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

.field-label {
  display: block;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--se-text-muted);
  margin-bottom: 0.45rem;
}

.field-input {
  width: 100%;
  box-sizing: border-box;
  padding: 1rem 1.05rem;
  border-radius: var(--se-radius-md);
  border: 1px solid var(--se-glass-border);
  background: rgba(6, 20, 38, 0.55);
  color: var(--se-text);
  font-size: 1.05rem;
  font-family: inherit;
  line-height: 1.35;
  margin-bottom: 0.5rem;
  transition:
    border-color var(--se-transition),
    box-shadow var(--se-transition),
    background var(--se-transition);
}

.field-input::placeholder {
  color: rgba(168, 179, 199, 0.65);
}

.field-input:hover {
  border-color: rgba(0, 212, 255, 0.35);
}

.field-input:focus {
  outline: none;
  border-color: var(--se-cyan);
  box-shadow: 0 0 0 1px rgba(0, 212, 255, 0.25);
  background: rgba(6, 20, 38, 0.72);
}

.field-foot {
  margin: 0 0 1.15rem;
  font-size: 0.78rem;
  color: var(--se-text-muted);
  line-height: 1.4;
}

.se-btn--mt {
  margin-top: 0.15rem;
  width: 100%;
  min-height: 3rem;
  font-size: 1rem;
  padding: 0.85rem 1rem;
}
</style>
