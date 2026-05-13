<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { waCondominiumHref } from './energyHomeLinks'
</script>

<template>
  <section class="eh-section" aria-labelledby="eh-seg-title">
    <h2 id="eh-seg-title" class="eh-h2">¿Qué necesitas resolver?</h2>
    <p class="eh-lead">Elige el perfil que mejor te representa. Te llevamos al siguiente paso adecuado.</p>

    <div class="eh-grid">
      <article class="eh-card se-glass">
        <h3 class="eh-h3">Hogar y autonomía</h3>
        <p class="eh-copy">Reduce tu boleta y mantén operativa tu casa durante cortes eléctricos.</p>
        <RouterLink class="eh-card-cta" :to="{ name: 'calculadora' }" aria-label="Evaluar mi vivienda en la calculadora">
          Evaluar mi vivienda
        </RouterLink>
      </article>

      <article class="eh-card se-glass">
        <h3 class="eh-h3">Empresa y continuidad operacional</h3>
        <p class="eh-copy">
          Protege operación, seguridad, comunicaciones y cargas críticas con una solución energética diseñada por
          etapas.
        </p>
        <RouterLink class="eh-card-cta" :to="{ name: 'onboarding' }" aria-label="Solicitar evaluación técnica empresarial">
          Solicitar evaluación técnica
        </RouterLink>
      </article>

      <article class="eh-card se-glass">
        <h3 class="eh-h3">Parcelas y zonas rurales</h3>
        <p class="eh-copy">
          Soluciones solares híbridas para propiedades con cortes frecuentes, bombas, portones, internet satelital y
          consumo distribuido.
        </p>
        <RouterLink class="eh-card-cta" :to="{ name: 'onboarding' }" aria-label="Evaluar autonomía en propiedad rural">
          Evaluar autonomía
        </RouterLink>
      </article>

      <article class="eh-card se-glass">
        <h3 class="eh-h3">Condominios y comunidades</h3>
        <p class="eh-copy">
          Energía para espacios comunes, portones, iluminación, seguridad y continuidad operativa.
        </p>
        <a
          class="eh-card-cta eh-card-cta--wa"
          :href="waCondominiumHref"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir WhatsApp para hablar con un especialista sobre condominios"
        >
          Hablar con especialista
        </a>
      </article>
    </div>
  </section>
</template>

<style scoped>
.se-glass {
  background: var(--se-glass);
  border: 1px solid var(--eh-surface-border);
  backdrop-filter: blur(16px);
  box-shadow: var(--eh-surface-inset), var(--eh-surface-shadow);
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
  font-size: clamp(1.08rem, 3.2vw, 1.4rem);
  font-weight: 700;
  letter-spacing: -0.018em;
  line-height: 1.22;
  color: var(--se-text);
}

.eh-lead {
  margin: 0 0 1rem;
  font-size: 0.88rem;
  color: var(--se-text-muted);
  line-height: 1.55;
  letter-spacing: 0.01em;
  max-width: 36rem;
}

@media (min-width: 768px) {
  .eh-lead {
    font-size: 0.92rem;
    margin-bottom: 1.1rem;
  }
}

.eh-grid {
  display: grid;
  gap: 0.85rem;
  grid-template-columns: 1fr;
}

@media (min-width: 720px) {
  .eh-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1100px) {
  .eh-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.eh-card {
  border-radius: var(--se-radius-md);
  padding: 0.95rem 0.85rem 1rem;
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

@media (min-width: 768px) {
  .eh-card {
    padding: 1.05rem 1rem 1.1rem;
  }
}

.eh-h3 {
  margin: 0 0 0.45rem;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: -0.012em;
  line-height: 1.25;
  color: #e8eef6;
}

.eh-copy {
  margin: 0 0 0.85rem;
  flex: 1;
  font-size: 0.82rem;
  line-height: 1.52;
  letter-spacing: 0.01em;
  color: var(--se-text-muted);
}

@media (min-width: 768px) {
  .eh-copy {
    font-size: 0.86rem;
    margin-bottom: 0.95rem;
  }
}

.eh-card-cta {
  margin-top: auto;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 0.02em;
  padding: 0.58rem 0.75rem;
  border-radius: 10px;
  color: #061426;
  background: linear-gradient(135deg, var(--se-green) 0%, #5eead4 100%);
  transition: transform var(--se-transition), box-shadow var(--se-transition);
}

@media (min-width: 768px) {
  .eh-card-cta {
    font-size: 0.84rem;
    padding: 0.62rem 0.85rem;
  }
}

.eh-card-cta:hover {
  transform: translateY(-1px);
  box-shadow: var(--eh-surface-inset), 0 3px 14px rgba(0, 0, 0, 0.22);
}

.eh-card-cta--wa {
  background: linear-gradient(135deg, #128c7e 0%, #25d366 100%);
  color: #fff;
}
</style>
