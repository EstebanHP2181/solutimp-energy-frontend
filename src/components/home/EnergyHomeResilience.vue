<script setup lang="ts"></script>

<template>
  <section class="eh-section se-glass" aria-labelledby="eh-res-title">
    <h2 id="eh-res-title" class="eh-h2">Qué podría seguir funcionando durante un corte</h2>
    <p class="eh-lead">
      Referencia orientativa: la autonomía real depende del consumo, capacidad de baterías, potencia del inversor y
      cargas seleccionadas. La evaluación técnica permite definir prioridades.
    </p>
    <ul class="eh-list" aria-label="Ejemplos de cargas">
      <li><span class="eh-ico" aria-hidden="true">◎</span> Internet / router / Starlink</li>
      <li><span class="eh-ico" aria-hidden="true">◎</span> Refrigeración</li>
      <li><span class="eh-ico" aria-hidden="true">◎</span> Iluminación esencial</li>
      <li><span class="eh-ico" aria-hidden="true">◎</span> Portón eléctrico</li>
      <li><span class="eh-ico" aria-hidden="true">◎</span> Cámaras y seguridad</li>
      <li><span class="eh-ico" aria-hidden="true">◎</span> Bombas seleccionadas</li>
      <li><span class="eh-ico" aria-hidden="true">◎</span> Equipos críticos de oficina o comercio</li>
    </ul>
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
  font-size: clamp(1.05rem, 3vw, 1.35rem);
  font-weight: 700;
  letter-spacing: -0.018em;
  line-height: 1.22;
  color: var(--se-text);
}

.eh-lead {
  margin: 0 0 0.85rem;
  font-size: 0.82rem;
  line-height: 1.55;
  letter-spacing: 0.01em;
  color: var(--se-text-muted);
}

@media (min-width: 768px) {
  .eh-lead {
    font-size: 0.86rem;
    margin-bottom: 1rem;
  }
}

.eh-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.5rem;
  grid-template-columns: 1fr;
}

@media (min-width: 600px) {
  .eh-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

.eh-list li {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: #e2e8f0;
  padding: 0.48rem 0.62rem;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.07);
}

@media (min-width: 768px) {
  .eh-list li {
    font-size: 0.84rem;
    padding: 0.48rem 0.62rem;
  }
}

.eh-ico {
  color: var(--se-cyan);
  opacity: 0.62;
  font-size: 0.65rem;
  flex-shrink: 0;
}
</style>
