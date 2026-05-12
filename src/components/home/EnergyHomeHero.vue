<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="eh-hero se-glass" aria-labelledby="eh-hero-title">
    <p class="eh-eyebrow">Solutimp Energy</p>
    <h1 id="eh-hero-title" class="eh-title">
      Infraestructura energética para continuidad, autonomía y ahorro.
    </h1>
    <p class="eh-sub">
      Diseñamos sistemas solares, respaldo energético y soluciones inteligentes para hogares, empresas y propiedades que
      no pueden depender solo de la red eléctrica.
    </p>
    <p class="eh-badge" role="status">
      Evaluación preliminar en 45 segundos · Chile · Especialistas en automatización e infraestructura
    </p>
    <div class="eh-actions">
      <RouterLink
        class="eh-btn eh-btn--primary"
        :to="{ name: 'calculadora' }"
        aria-label="Ir a la calculadora: estimar ahorro y autonomía"
      >
        Calcular mi ahorro y autonomía
      </RouterLink>
      <RouterLink
        class="eh-btn eh-btn--ghost"
        :to="{ name: 'onboarding' }"
        aria-label="Solicitar evaluación técnica guiada"
      >
        Solicitar evaluación técnica
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.se-glass {
  background: var(--se-glass);
  border: 1px solid var(--se-glass-border);
  backdrop-filter: blur(14px);
}

.eh-hero {
  border-radius: var(--se-radius-lg);
  padding: 1.1rem 0.95rem 1.2rem;
  margin: 0 auto 1.5rem;
  max-width: 52rem;
}

@media (min-width: 560px) {
  .eh-hero {
    padding: 1.35rem 1.2rem 1.45rem;
    margin-bottom: 1.75rem;
  }
}

.eh-eyebrow {
  margin: 0 0 0.4rem;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--se-cyan);
}

.eh-title {
  margin: 0 0 0.65rem;
  font-size: clamp(1.3rem, 4.2vw, 1.95rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--se-text);
}

.eh-sub {
  margin: 0 0 0.85rem;
  font-size: clamp(0.9rem, 2.6vw, 1.05rem);
  line-height: 1.58;
  letter-spacing: 0.01em;
  color: var(--se-text-muted);
}

.eh-badge {
  margin: 0 0 1.1rem;
  font-size: 0.72rem;
  line-height: 1.45;
  letter-spacing: 0.02em;
  color: #8ea0b8;
  padding: 0.42rem 0.6rem;
  border-radius: var(--se-radius-md);
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.eh-actions {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

@media (min-width: 560px) {
  .eh-actions {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }
}

.eh-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 0.02em;
  padding: 0.78rem 1rem;
  border-radius: var(--se-radius-md);
  border: none;
  cursor: pointer;
  transition: transform var(--se-transition), box-shadow var(--se-transition), background var(--se-transition);
}

@media (min-width: 560px) {
  .eh-btn {
    font-size: 0.93rem;
    padding: 0.85rem 1.1rem;
  }
}

.eh-btn--primary {
  color: #061426;
  background: linear-gradient(135deg, var(--se-green) 0%, var(--se-cyan) 100%);
  box-shadow: 0 6px 22px rgba(0, 200, 150, 0.22);
}

.eh-btn--primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 28px rgba(0, 200, 150, 0.28);
}

.eh-btn--ghost {
  color: var(--se-text);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--se-glass-border);
}

.eh-btn--ghost:hover {
  background: rgba(255, 255, 255, 0.08);
}

@media (min-width: 560px) {
  .eh-btn {
    flex: 1 1 auto;
    min-width: 12rem;
  }
}
</style>
