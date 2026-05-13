<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { waSpecialistHref } from './energyHomeLinks'
</script>

<template>
  <section class="eh-final se-glass" aria-labelledby="eh-final-title">
    <h2 id="eh-final-title" class="eh-h2">Empieza con una evaluación energética preliminar.</h2>
    <p class="eh-copy">
      En menos de un minuto puedes estimar tu ahorro, inversión referencial y nivel de autonomía potencial.
    </p>
    <div class="eh-actions">
      <RouterLink class="eh-btn eh-btn--primary" :to="{ name: 'calculadora' }" aria-label="Ir a la calculadora">
        Ir a la calculadora
      </RouterLink>
      <a
        class="eh-btn eh-btn--wa"
        :href="waSpecialistHref"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir WhatsApp con un especialista energético"
      >
        Hablar con especialista energético
      </a>
    </div>
  </section>
</template>

<style scoped>
.se-glass {
  background: var(--se-glass);
  border: 1px solid var(--eh-surface-border);
  backdrop-filter: blur(18px);
  box-shadow: var(--eh-surface-inset), var(--eh-surface-shadow);
  border-radius: var(--se-radius-lg);
  padding: 1.2rem 1.05rem 1.3rem;
  margin-bottom: 1.75rem;
}

@media (min-width: 768px) {
  .se-glass {
    padding: 1.45rem 1.3rem 1.55rem;
    margin-bottom: 2rem;
  }
}

.eh-h2 {
  margin: 0 0 0.5rem;
  font-size: clamp(1.06rem, 3.1vw, 1.38rem);
  font-weight: 700;
  letter-spacing: -0.018em;
  line-height: 1.22;
  color: var(--se-text);
}

.eh-copy {
  margin: 0 0 1rem;
  font-size: 0.88rem;
  line-height: 1.55;
  letter-spacing: 0.01em;
  color: var(--se-text-muted);
  max-width: 34rem;
}

@media (min-width: 768px) {
  .eh-copy {
    font-size: 0.92rem;
    margin-bottom: 1.15rem;
  }
}

.eh-actions {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  margin-top: 0.25rem;
}

@media (min-width: 520px) {
  .eh-actions {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

.eh-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.88rem;
  letter-spacing: 0.02em;
  padding: 0.75rem 0.95rem;
  border-radius: var(--se-radius-md);
  text-align: center;
  transition: transform var(--se-transition), box-shadow var(--se-transition);
}

@media (min-width: 768px) {
  .eh-btn {
    font-size: 0.92rem;
    padding: 0.82rem 1.05rem;
  }
}

.eh-btn--primary {
  color: #061426;
  background: linear-gradient(135deg, var(--se-green) 0%, var(--se-cyan) 100%);
  box-shadow: var(--eh-surface-inset), 0 2px 12px rgba(0, 0, 0, 0.22);
}

.eh-btn--primary:hover {
  transform: translateY(-1px);
  box-shadow: var(--eh-surface-inset), 0 4px 18px rgba(0, 0, 0, 0.28);
}

.eh-btn--wa {
  color: #ecfdf5;
  background: linear-gradient(135deg, #128c7e 0%, #25d366 100%);
  border: 1px solid rgba(37, 211, 102, 0.45);
}

.eh-btn--wa:hover {
  transform: translateY(-1px);
  box-shadow: var(--eh-surface-inset), 0 3px 14px rgba(0, 0, 0, 0.2);
}

@media (min-width: 520px) {
  .eh-btn {
    flex: 1 1 auto;
    min-width: 11rem;
  }
}
</style>
