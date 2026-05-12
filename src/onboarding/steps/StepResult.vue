<script setup lang="ts">
import { inject } from 'vue'
import { wizardInjectionKey } from '@/composables/useWizard'

const w = inject(wizardInjectionKey)!

const firstName = () => {
  const n = w.name.trim().split(/\s+/)[0]
  return n || 'Cliente'
}
</script>

<template>
  <div class="step step-result">
    <h2 class="step-q">Gracias, {{ firstName() }}. Ya tenemos los datos iniciales.</h2>
    <p class="step-hint">
      La siguiente etapa es una <strong>evaluación técnica</strong> y propuesta personalizada. Los valores abajo son
      orientativos, no cifras finales.
    </p>
    <div class="cards">
      <div class="mini se-glass shimmer">
        <h3>Ahorro estimado</h3>
        <p>Rango preliminar, sujeto a evaluación técnica y medición real.</p>
      </div>
      <div class="mini se-glass">
        <h3>Respaldo</h3>
        <p>Disponible según configuración y necesidades que indicaste.</p>
      </div>
      <div class="mini se-glass">
        <h3>Siguiente paso</h3>
        <p>Revisión técnica por parte del equipo Solutimp Energy.</p>
      </div>
      <div class="mini se-glass">
        <h3>Asesoría</h3>
        <p>Propuesta personalizada según tu región, consumo y objetivos.</p>
      </div>
    </div>
    <div class="actions">
      <a class="se-btn" href="https://solutimp.cl" target="_blank" rel="noopener noreferrer">Visitar solutimp.cl</a>
      <button type="button" class="se-btn se-btn--ghost" disabled title="Próximamente">Hablar con un asesor</button>
    </div>
  </div>
</template>

<style scoped>
.step-result .step-q {
  text-align: center;
  font-size: 1.15rem;
}

.step-hint {
  font-size: 0.88rem;
  color: var(--se-text-muted);
  line-height: 1.45;
  margin: 0 0 1.25rem;
  text-align: center;
}

.step-hint strong {
  color: var(--se-cyan);
}

.cards {
  display: grid;
  gap: 0.65rem;
  margin-bottom: 1.25rem;
}

@media (min-width: 600px) {
  .cards {
    grid-template-columns: 1fr 1fr;
  }
}

.mini {
  border-radius: var(--se-radius-md);
  padding: 0.85rem 1rem;
  transition:
    transform var(--se-transition),
    box-shadow var(--se-transition);
}

.mini:hover {
  transform: scale(1.02);
  box-shadow: 0 0 20px var(--se-glow);
}

.mini h3 {
  margin: 0 0 0.35rem;
  font-size: 0.95rem;
  color: var(--se-text);
}

.mini p {
  margin: 0;
  font-size: 0.8rem;
  color: var(--se-text-muted);
  line-height: 1.4;
}

.shimmer {
  position: relative;
  overflow: hidden;
}

.shimmer::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    100deg,
    transparent 40%,
    rgba(255, 255, 255, 0.06) 50%,
    transparent 60%
  );
  animation: shimmer-move 2.5s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .shimmer::after {
    animation: none;
  }
}

@keyframes shimmer-move {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.actions .se-btn {
  text-decoration: none;
  box-sizing: border-box;
}
</style>
