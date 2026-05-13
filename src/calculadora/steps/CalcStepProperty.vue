<script setup lang="ts">
import { inject } from 'vue'
import OptionCard from '@/components/wizard/OptionCard.vue'
import { calculadoraFlowKey, type CalcPropertyType } from '@/composables/useCalculadoraFlow'

const flow = inject(calculadoraFlowKey)!

const propertyOptions: { value: Exclude<CalcPropertyType, ''>; label: string; icon: string }[] = [
  { value: 'casa', label: 'Casa', icon: '🏠' },
  { value: 'parcela', label: 'Parcela / campo', icon: '🌾' },
  { value: 'empresa', label: 'Empresa / oficina', icon: '🏢' },
  { value: 'condominio', label: 'Condominio', icon: '🏘️' },
  { value: 'bodega', label: 'Bodega / industrial', icon: '🏭' },
]

function onSelect(v: Exclude<CalcPropertyType, ''>) {
  flow.selectPropertyType(v)
}
</script>

<template>
  <div class="calc-step">
    <p class="calc-step__eyebrow">Evaluación guiada</p>
    <h2 class="calc-step__title">¿Qué tipo de propiedad quieres evaluar?</h2>
    <p class="calc-step__hint">Elige una opción para continuar.</p>
    <div class="calc-step__list" role="list">
      <OptionCard
        v-for="o in propertyOptions"
        :key="o.value"
        :label="o.label"
        :icon="o.icon"
        :selected="flow.propertyType === o.value"
        @select="onSelect(o.value)"
      />
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
  margin: 0 0 1.15rem;
}

.calc-step__list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
</style>
