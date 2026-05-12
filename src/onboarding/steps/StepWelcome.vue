<script setup lang="ts">
import { inject } from 'vue'
import { wizardInjectionKey } from '@/composables/useWizard'

const w = inject(wizardInjectionKey)!
</script>

<template>
  <div class="sw">
    <p class="sw-brand">SOLUTIMP ENERGY</p>
    <h1 class="sw-title">Energía solar inteligente para ahorrar y proteger tu hogar o empresa</h1>
    <p class="sw-sub">
      Evalúa tu proyecto en menos de 2 minutos. Sin compromiso.
    </p>
    <div class="sw-badges">
      <span class="sw-badge">Solar</span>
      <span class="sw-badge">Respaldo</span>
      <span class="sw-badge">Ahorro</span>
      <span class="sw-badge sw-badge--accent">GoodWe Smart Solar</span>
    </div>
    <button type="button" class="se-btn se-btn--pulse" @click="w.next()">Comenzar evaluación</button>
  </div>
</template>

<style scoped>
.sw {
  text-align: center;
}

.sw-brand {
  font-size: 0.75rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--se-cyan);
  margin: 0 0 1rem;
  font-weight: 600;
}

.sw-title {
  font-size: clamp(1.35rem, 4.5vw, 1.75rem);
  font-weight: 700;
  line-height: 1.25;
  margin: 0 0 0.85rem;
  color: var(--se-text);
}

.sw-sub {
  color: var(--se-text-muted);
  font-size: 1rem;
  line-height: 1.5;
  margin: 0 0 1.5rem;
}

.sw-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1.75rem;
}

.sw-badge {
  font-size: 0.78rem;
  padding: 0.35rem 0.75rem;
  border-radius: 99px;
  border: 1px solid var(--se-glass-border);
  background: var(--se-glass);
  color: var(--se-text-muted);
}

.sw-badge--accent {
  color: var(--se-yellow);
  border-color: rgba(255, 209, 102, 0.35);
}
</style>

<style>
.se-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 100%;
  padding: 1rem 1.5rem;
  border-radius: var(--se-radius-md);
  border: none;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  background: linear-gradient(135deg, var(--se-blue) 0%, var(--se-blue-electric) 100%);
  color: #fff;
  box-shadow: 0 4px 24px var(--se-glow);
  transition:
    transform var(--se-transition),
    box-shadow var(--se-transition);
}

.se-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px var(--se-glow);
}

.se-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
}

.se-btn--ghost {
  background: transparent;
  border: 1px solid var(--se-glass-border);
  box-shadow: none;
  color: var(--se-text);
}

.se-btn--ghost:hover {
  border-color: var(--se-blue-electric);
  box-shadow: 0 0 16px rgba(10, 132, 255, 0.25);
}

.se-btn--pulse {
  animation: se-pulse 2.8s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .se-btn--pulse {
    animation: none;
  }
}

@keyframes se-pulse {
  0%,
  100% {
    box-shadow: 0 4px 24px var(--se-glow);
  }
  50% {
    box-shadow: 0 4px 36px rgba(0, 212, 255, 0.35);
  }
}
</style>
