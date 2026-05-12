<script setup lang="ts"></script>

<template>
  <section class="eh-section" aria-labelledby="eh-proc-title">
    <h2 id="eh-proc-title" class="eh-h2">De simulación rápida a proyecto energético real.</h2>
    <ol class="eh-steps">
      <li class="eh-step se-glass">
        <span class="eh-num" aria-hidden="true">1</span>
        <div>
          <h3 class="eh-step-title">Simulación preliminar</h3>
          <p class="eh-step-copy">Calcula ahorro, inversión referencial y potencial de autonomía.</p>
        </div>
      </li>
      <li class="eh-step se-glass">
        <span class="eh-num" aria-hidden="true">2</span>
        <div>
          <h3 class="eh-step-title">Evaluación técnica</h3>
          <p class="eh-step-copy">Revisamos boleta, superficie, consumos críticos y objetivos.</p>
        </div>
      </li>
      <li class="eh-step se-glass">
        <span class="eh-num" aria-hidden="true">3</span>
        <div>
          <h3 class="eh-step-title">Diseño de solución</h3>
          <p class="eh-step-copy">Definimos generación, respaldo, monitoreo y etapas de implementación.</p>
        </div>
      </li>
      <li class="eh-step se-glass">
        <span class="eh-num" aria-hidden="true">4</span>
        <div>
          <h3 class="eh-step-title">Instalación y soporte</h3>
          <p class="eh-step-copy">Implementación técnica, puesta en marcha y acompañamiento.</p>
        </div>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.se-glass {
  background: var(--se-glass);
  border: 1px solid var(--se-glass-border);
  backdrop-filter: blur(10px);
}

.eh-section {
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .eh-section {
    margin-bottom: 2.25rem;
  }
}

.eh-h2 {
  margin: 0 0 0.85rem;
  font-size: clamp(1.05rem, 3vw, 1.35rem);
  font-weight: 700;
  letter-spacing: -0.018em;
  line-height: 1.22;
  color: var(--se-text);
  max-width: 36rem;
}

@media (min-width: 768px) {
  .eh-h2 {
    margin-bottom: 1rem;
  }
}

.eh-steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

@media (min-width: 768px) {
  .eh-steps {
    gap: 0.7rem;
  }
}

.eh-step {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  border-radius: var(--se-radius-md);
  padding: 0.85rem 0.85rem 0.9rem;
}

@media (min-width: 768px) {
  .eh-step {
    gap: 0.95rem;
    padding: 1rem 1rem 1.05rem;
  }
}

.eh-num {
  flex-shrink: 0;
  width: 1.85rem;
  height: 1.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  font-weight: 800;
  font-size: 0.88rem;
  letter-spacing: -0.03em;
  color: #061426;
  background: linear-gradient(135deg, var(--se-cyan), var(--se-green));
}

@media (min-width: 768px) {
  .eh-num {
    width: 2rem;
    height: 2rem;
    font-size: 0.93rem;
    border-radius: 10px;
  }
}

.eh-step-title {
  margin: 0 0 0.28rem;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #f1f5f9;
}

.eh-step-copy {
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.52;
  letter-spacing: 0.01em;
  color: var(--se-text-muted);
}

@media (min-width: 768px) {
  .eh-step-copy {
    font-size: 0.84rem;
  }
}
</style>
