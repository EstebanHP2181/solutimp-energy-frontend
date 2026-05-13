<script setup lang="ts"></script>

<template>
  <section class="eh-section" aria-labelledby="eh-diff-title">
    <h2 id="eh-diff-title" class="eh-h2">Más allá de los paneles</h2>
    <p class="eh-prose">
      Mientras otros venden kits solares, Solutimp Energy diseña <strong>infraestructura energética</strong>. Evaluamos
      consumo, continuidad, respaldo, superficie útil, expansión futura y tecnologías compatibles para construir
      soluciones sostenibles en el tiempo.
    </p>
    <ul class="eh-bullets" aria-label="Capacidades">
      <li>Generación solar</li>
      <li>Respaldo con baterías</li>
      <li>Monitoreo energético</li>
      <li>Continuidad operacional</li>
      <li>Infraestructura inteligente</li>
      <li>Escalabilidad futura</li>
    </ul>
  </section>
</template>

<style scoped>
.eh-section {
  margin-bottom: 1.75rem;
}

@media (min-width: 768px) {
  .eh-section {
    margin-bottom: 2.5rem;
  }
}

.eh-h2 {
  margin: 0 0 0.55rem;
  font-size: clamp(1.08rem, 3.2vw, 1.4rem);
  font-weight: 700;
  letter-spacing: -0.018em;
  line-height: 1.22;
  color: var(--se-text);
}

.eh-prose {
  margin: 0 0 1.05rem;
  font-size: 0.88rem;
  line-height: 1.58;
  letter-spacing: 0.01em;
  color: var(--se-text-muted);
  max-width: 40rem;
}

@media (min-width: 768px) {
  .eh-prose {
    font-size: 0.94rem;
    margin-bottom: 1rem;
  }
}

.eh-prose strong {
  color: #e2e8f0;
  font-weight: 700;
  letter-spacing: 0;
}

.eh-bullets {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
}

@media (min-width: 520px) {
  .eh-bullets {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 900px) {
  .eh-bullets {
    grid-template-columns: repeat(3, 1fr);
  }
}

.eh-bullets li {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.015em;
  color: #cbd5e1;
  padding: 0.52rem 0.68rem;
  border-radius: var(--se-radius-md);
  border: 1px solid var(--eh-surface-border);
  background: rgba(0, 0, 0, 0.12);
  position: relative;
  padding-left: 1.28rem;
}

@media (min-width: 768px) {
  .eh-bullets li {
    font-size: 0.84rem;
    padding: 0.55rem 0.75rem;
    padding-left: 1.42rem;
  }
}

.eh-bullets li::before {
  content: '';
  position: absolute;
  left: 0.55rem;
  top: 50%;
  transform: translateY(-50%);
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--se-green), var(--se-cyan));
}
</style>
