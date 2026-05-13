<script setup lang="ts"></script>

<template>
  <section class="eh-section se-glass" aria-labelledby="eh-trust-title">
    <h2 id="eh-trust-title" class="eh-h2">Respaldado por la experiencia técnica de Solutimp.</h2>
    <p class="eh-prose">
      Solutimp lleva años integrando automatización, control de acceso, domótica e infraestructura tecnológica. Solutimp
      Energy nace para llevar esa experiencia al mundo de la energía solar, respaldo y continuidad operacional.
    </p>
  </section>
</template>

<style scoped>
.se-glass {
  background: var(--se-glass);
  border: 1px solid var(--eh-surface-border);
  backdrop-filter: blur(16px);
  box-shadow: var(--eh-surface-inset), var(--eh-surface-shadow);
  border-radius: var(--se-radius-lg);
  padding: 1.15rem 1rem 1.2rem;
}

@media (min-width: 768px) {
  .se-glass {
    padding: 1.35rem 1.2rem 1.4rem;
  }
}

.eh-section {
  margin-bottom: 1.75rem;
}

@media (min-width: 768px) {
  .eh-section {
    margin-bottom: 2.5rem;
  }
}

.eh-h2 {
  margin: 0 0 0.5rem;
  font-size: clamp(1.05rem, 3vw, 1.34rem);
  font-weight: 700;
  letter-spacing: -0.018em;
  line-height: 1.22;
  color: var(--se-text);
}

.eh-prose {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.58;
  letter-spacing: 0.01em;
  color: var(--se-text-muted);
  max-width: 42rem;
}

@media (min-width: 768px) {
  .eh-prose {
    font-size: 0.92rem;
  }
}
</style>
