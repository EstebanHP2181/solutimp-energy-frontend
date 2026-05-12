<script setup lang="ts">
import ProgressBar from './ProgressBar.vue'

const props = withDefaults(
  defineProps<{
    currentStep: number
    totalSteps: number
    progressFraction: number
    showBack: boolean
    /** Oculta barra de progreso “paso a paso” para la pantalla de propuesta */
    variant?: 'default' | 'proposal'
  }>(),
  { variant: 'default' }
)

const emit = defineEmits<{
  back: []
}>()
</script>

<template>
  <div class="ws" :class="{ 'ws--proposal': props.variant === 'proposal' }">
    <div class="ws-inner">
      <ProgressBar v-if="props.variant === 'default'" :fraction="progressFraction" />
      <div class="ws-head">
        <button
          v-if="showBack"
          type="button"
          class="ws-back"
          aria-label="Volver al paso anterior"
          @click="emit('back')"
        >
          ← Volver
        </button>
        <span v-else class="ws-spacer" />
        <span v-if="props.variant === 'default'" class="ws-step-label">Paso {{ currentStep + 1 }} de {{ totalSteps }}</span>
        <span v-else class="ws-step-label ws-step-label--accent">Tu propuesta · Solutimp Energy</span>
      </div>
      <div class="ws-card se-glass" :class="{ 'ws-card--proposal': props.variant === 'proposal' }">
        <Transition name="ws-slide" mode="out-in">
          <div :key="currentStep" class="ws-slot" :class="{ 'ws-slot--proposal': props.variant === 'proposal' }">
            <slot />
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ws {
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 0.5rem 0 2rem;
}

.ws-inner {
  max-width: 560px;
  margin: 0 auto;
}

@media (min-width: 1100px) {
  .ws-inner {
    max-width: 520px;
  }

  .ws--proposal .ws-inner {
    max-width: 700px;
  }
}

.ws-step-label--accent {
  color: var(--se-cyan);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-size: 0.72rem;
}

.ws--proposal .ws-head {
  margin-bottom: 0.5rem;
}

.ws-card--proposal {
  min-height: 120px;
  padding: 1.25rem 1.1rem 1.35rem;
}

.ws-slot--proposal {
  min-height: 0;
}

.ws-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  min-height: 2.25rem;
}

.ws-back {
  background: transparent;
  border: none;
  color: var(--se-text-muted);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.35rem 0;
}

.ws-back:hover {
  color: var(--se-text);
}

.ws-spacer {
  width: 4rem;
}

.ws-step-label {
  font-size: 0.8rem;
  color: var(--se-text-muted);
  letter-spacing: 0.02em;
}

.ws-card {
  border-radius: var(--se-radius-lg);
  padding: 1.35rem 1.25rem 1.5rem;
  min-height: 280px;
}

.ws-slot {
  min-height: 220px;
}

.ws-slide-enter-active,
.ws-slide-leave-active {
  transition:
    opacity var(--se-transition),
    transform var(--se-transition);
}

.ws-slide-enter-from {
  opacity: 0;
  transform: translateY(16px);
}

.ws-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>

<style>
.se-glass {
  background: var(--se-glass);
  border: 1px solid var(--se-glass-border);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}
</style>
