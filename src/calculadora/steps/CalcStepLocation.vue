<script setup lang="ts">
import { computed, inject, watch } from 'vue'
import { calculadoraFlowKey } from '@/composables/useCalculadoraFlow'
import { CHILE_REGIONS } from '@/shared/chileRegions'
import { inferRegionFromText } from '@/shared/inferRegionFromText'

const flow = inject(calculadoraFlowKey)!

const inferredRegionCode = computed(() => inferRegionFromText(flow.calcLocationLine.trim()))

const detectedRegionLabel = computed(() => {
  const c = inferredRegionCode.value
  if (!c) return ''
  return flow.regionLabel(c)
})

const showRegionSelect = computed(() => inferredRegionCode.value === null)

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
      Escribe la comuna o dirección. Usamos esto para estimar la radiación solar de tu zona.
    </p>
    <label class="field-label" for="calc-location-line">Comuna, ciudad o dirección</label>
    <input
      id="calc-location-line"
      v-model="flow.calcLocationLine"
      type="text"
      class="field-input"
      name="calc-location"
      autocomplete="street-address"
      placeholder="Ej: Las Condes, Santiago"
      enterkeyhint="done"
      @keydown.enter.prevent="flow.commitLocationAndAdvance()"
    />
    <p v-if="detectedRegionLabel" class="region-feedback" role="status">
      📍 Región detectada: {{ detectedRegionLabel }}
    </p>
    <template v-if="showRegionSelect">
      <label class="field-label field-label--mt" for="calc-region-inline">Región</label>
      <p class="field-hint-inline">No pudimos inferir la región desde el texto. Selecciónala para continuar.</p>
      <select id="calc-region-inline" v-model="flow.region" class="region-select" required>
        <option disabled value="">Selecciona una región</option>
        <option v-for="r in CHILE_REGIONS" :key="r.value" :value="r.value">{{ r.label }}</option>
      </select>
    </template>
    <p class="field-foot">
      Con la comuna es suficiente. Si quieres más precisión, agrega la dirección completa.
    </p>
    <button
      type="button"
      class="se-btn se-btn--mt"
      :disabled="!flow.canCompleteLocationStep()"
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

.field-label--mt {
  margin-top: 1rem;
}

.field-hint-inline {
  margin: 0 0 0.5rem;
  font-size: 0.82rem;
  color: var(--se-text-muted);
  line-height: 1.4;
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

.region-feedback {
  margin: 0 0 0.75rem;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--se-cyan);
  line-height: 1.4;
}

.region-select {
  width: 100%;
  box-sizing: border-box;
  padding: 1rem 1rem;
  border-radius: var(--se-radius-md);
  border: 1px solid var(--se-glass-border);
  background: rgba(6, 20, 38, 0.65);
  color: var(--se-text);
  font-size: 1rem;
  font-family: inherit;
  margin-bottom: 0.65rem;
  cursor: pointer;
}

.region-select:focus {
  outline: 2px solid var(--se-cyan);
  outline-offset: 2px;
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
