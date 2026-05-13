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
    <button type="button" class="hero-cta" @click="emit('start')">Calcular mi ahorro →</button>
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
  margin: 0 0 1.05rem;
  max-width: 26rem;
  margin-left: auto;
  margin-right: auto;
}

.hero-cta {
  display: block;
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 1.05rem 1.35rem;
  border: none;
  border-radius: 14px;
  font-family: inherit;
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: 0.01em;
  color: #0a1628;
  cursor: pointer;
  text-align: center;
  background: linear-gradient(135deg, #5eead4 0%, #2dd4bf 42%, #14b8a6 100%);
  box-shadow:
    0 4px 14px rgba(13, 31, 53, 0.28),
    0 1px 0 rgba(255, 255, 255, 0.35) inset;
  transition:
    transform 0.12s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
}

.hero-cta:hover {
  filter: brightness(1.04);
  box-shadow:
    0 6px 20px rgba(13, 31, 53, 0.32),
    0 1px 0 rgba(255, 255, 255, 0.4) inset;
}

.hero-cta:active {
  transform: translateY(1px);
}

.hero-cta:focus {
  outline: 2px solid rgba(94, 234, 212, 0.85);
  outline-offset: 3px;
}

.hero-cta:focus:not(:focus-visible) {
  outline: none;
}

.hero-cta:focus-visible {
  outline: 2px solid rgba(94, 234, 212, 0.95);
  outline-offset: 3px;
}

@media (min-width: 768px) {
  .hero-cta {
    max-width: 300px;
    padding: 0.95rem 1.25rem;
    font-size: 1rem;
  }
}
</style>
