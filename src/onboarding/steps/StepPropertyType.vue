<script setup lang="ts">
import { inject } from 'vue'
import OptionCard from '@/components/wizard/OptionCard.vue'
import { wizardInjectionKey, type PropertyType } from '@/composables/useWizard'

const w = inject(wizardInjectionKey)!

const options: { value: PropertyType; label: string; icon: string }[] = [
  { value: 'casa', label: 'Casa', icon: '🏠' },
  { value: 'parcela', label: 'Parcela / campo', icon: '🌾' },
  { value: 'empresa', label: 'Empresa / oficina', icon: '🏢' },
  { value: 'condominio', label: 'Condominio', icon: '🏘️' },
  { value: 'bodega', label: 'Bodega / industrial', icon: '🏭' },
]

function pick(v: PropertyType) {
  w.propertyType = v
  w.next()
}
</script>

<template>
  <div class="step">
    <h2 class="step-q">¿Qué tipo de propiedad quieres evaluar?</h2>
    <div class="step-list">
      <OptionCard
        v-for="o in options"
        :key="o.value"
        :label="o.label"
        :icon="o.icon"
        :selected="w.propertyType === o.value"
        @select="pick(o.value)"
      />
    </div>
  </div>
</template>

<style scoped>
.step-q {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 1.25rem;
  line-height: 1.35;
}

.step-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}
</style>
