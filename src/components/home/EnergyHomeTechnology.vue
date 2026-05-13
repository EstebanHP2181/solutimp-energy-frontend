<script setup lang="ts"></script>

<template>
  <section class="eh-section" aria-labelledby="eh-tech-title">
    <h2 id="eh-tech-title" class="eh-h2">Tecnología seleccionada por ingeniería, no por catálogo.</h2>
    <p class="eh-prose">
      Integramos fabricantes y plataformas líderes de monitoreo, generación, inversores, almacenamiento y gestión
      energética. Nuestro criterio no está amarrado a una sola marca: priorizamos desempeño, compatibilidad, soporte y
      evolución futura.
    </p>
    <p class="eh-micro">Vendor neutral · Performance focused · Preparado para nuevas tecnologías</p>

    <div class="eh-cards" role="list" aria-label="Categorías de tecnología compatibles">
      <div class="eh-mini se-glass" role="listitem">Inversores híbridos</div>
      <div class="eh-mini se-glass" role="listitem">Módulos fotovoltaicos</div>
      <div class="eh-mini se-glass" role="listitem">Baterías LFP</div>
      <div class="eh-mini se-glass" role="listitem">Monitoreo energético</div>
      <div class="eh-mini se-glass" role="listitem">Cargadores EV</div>
      <div class="eh-mini se-glass" role="listitem">Automatización y control</div>
    </div>
    <p class="eh-foot">
      Si la tecnología evoluciona, Solutimp evoluciona contigo: integramos lo que tenga sentido para tu operación y
      continuidad.
    </p>
  </section>
</template>

<style scoped>
.se-glass {
  background: var(--se-glass);
  border: 1px solid var(--eh-surface-border);
  backdrop-filter: blur(14px);
  box-shadow: var(--eh-surface-inset), var(--eh-surface-shadow);
}

.eh-mini.se-glass {
  box-shadow: var(--eh-surface-inset), var(--eh-surface-shadow-soft);
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
  margin: 0 0 0.55rem;
  font-size: clamp(1.05rem, 3vw, 1.35rem);
  font-weight: 700;
  letter-spacing: -0.018em;
  line-height: 1.22;
  color: var(--se-text);
  max-width: 38rem;
}

.eh-prose {
  margin: 0 0 0.6rem;
  font-size: 0.88rem;
  line-height: 1.58;
  letter-spacing: 0.01em;
  color: var(--se-text-muted);
  max-width: 42rem;
}

@media (min-width: 768px) {
  .eh-prose {
    font-size: 0.92rem;
    margin-bottom: 0.75rem;
  }
}

.eh-micro {
  margin: 0 0 0.85rem;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #8eb4cc;
}

@media (min-width: 768px) {
  .eh-micro {
    font-size: 0.7rem;
    letter-spacing: 0.07em;
    margin-bottom: 1rem;
  }
}

.eh-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.55rem;
}

@media (min-width: 520px) {
  .eh-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 900px) {
  .eh-cards {
    grid-template-columns: repeat(3, 1fr);
  }
}

.eh-mini {
  border-radius: var(--se-radius-md);
  padding: 0.62rem 0.7rem;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.015em;
  color: #e2e8f0;
  text-align: center;
}

@media (min-width: 768px) {
  .eh-mini {
    font-size: 0.84rem;
    padding: 0.72rem 0.8rem;
  }
}

.eh-foot {
  margin: 0.85rem 0 0;
  font-size: 0.8rem;
  line-height: 1.52;
  letter-spacing: 0.01em;
  color: #94a3b8;
  max-width: 40rem;
}

@media (min-width: 768px) {
  .eh-foot {
    font-size: 0.82rem;
    margin-top: 1rem;
  }
}
</style>
