<script setup lang="ts">
const emit = defineEmits<{
  start: []
}>()
</script>

<template>
  <div class="hero">
    <p class="eyebrow">Calculadora solar</p>
    <h1 class="title">Descubre cuánto podrías ahorrar en tu cuenta de luz</h1>
    <p class="lead">
      Indica lo que pagas hoy y en segundos verás una estimación orientativa. Sin compromiso.
    </p>
    <button type="button" class="se-btn se-btn--pulse" @click="emit('start')">Calcular mi ahorro</button>
  </div>
</template>

<style scoped>
.hero {
  text-align: center;
  padding: 0.25rem 0 1rem;
}

.eyebrow {
  font-size: 0.72rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--se-cyan);
  margin: 0 0 0.85rem;
  font-weight: 600;
}

.title {
  font-size: clamp(1.35rem, 5vw, 1.75rem);
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 0.85rem;
}

.lead {
  color: var(--se-text-muted);
  font-size: 1rem;
  line-height: 1.5;
  margin: 0 0 1.5rem;
  max-width: 26rem;
  margin-left: auto;
  margin-right: auto;
}
</style>
