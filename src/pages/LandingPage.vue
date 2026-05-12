<script setup lang="ts">
import { useRouter } from 'vue-router'
import EnergyBackground from '@/components/wizard/EnergyBackground.vue'

const router = useRouter()

function start() {
  void router.push({ name: 'onboarding', query: { start: '1' } })
}
</script>

<template>
  <div class="landing">
    <EnergyBackground />
    <div class="landing-grid">
      <div class="landing-visual" aria-hidden="true">
        <div class="orb-ring" />
      </div>
      <div class="landing-panel se-glass">
        <p class="brand">SOLUTIMP ENERGY</p>
        <h1>Energía solar inteligente para ahorrar y proteger tu hogar o empresa</h1>
        <p class="sub">
          Evalúa tu proyecto en menos de 2 minutos. Sin compromiso.
        </p>
        <div class="badges">
          <span>Solar</span>
          <span>Respaldo</span>
          <span>Ahorro</span>
          <span class="accent">GoodWe Smart Solar</span>
        </div>
        <button type="button" class="se-btn se-btn--pulse" @click="start">Comenzar evaluación</button>
        <p class="fine">
          Resultados iniciales y rangos son <strong>estimaciones preliminares</strong>, sujetos a evaluación técnica en
          terreno.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.landing {
  position: relative;
  min-height: 100%;
  display: flex;
  align-items: stretch;
}

.landing-grid {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 1.25rem 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 960px) {
  .landing-grid {
    flex-direction: row;
    align-items: center;
    gap: 2.5rem;
    padding: 2rem 1.5rem 3rem;
  }

  .landing-visual {
    flex: 1;
    min-height: 360px;
  }

  .landing-panel {
    flex: 1;
    max-width: 480px;
  }
}

.landing-visual {
  display: none;
}

@media (min-width: 960px) {
  .landing-visual {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.orb-ring {
  width: min(72vw, 320px);
  height: min(72vw, 320px);
  border-radius: 50%;
  border: 2px solid rgba(0, 212, 255, 0.25);
  box-shadow:
    0 0 60px rgba(0, 102, 217, 0.25),
    inset 0 0 40px rgba(0, 132, 255, 0.08);
  animation: spin-slow 24s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .orb-ring {
    animation: none;
  }
}

@keyframes spin-slow {
  to {
    transform: rotate(360deg);
  }
}

.landing-panel {
  border-radius: var(--se-radius-lg);
  padding: 1.5rem 1.35rem 1.6rem;
}

.brand {
  font-size: 0.72rem;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: var(--se-cyan);
  margin: 0 0 0.85rem;
  font-weight: 600;
}

h1 {
  font-size: clamp(1.4rem, 4.2vw, 1.85rem);
  font-weight: 700;
  line-height: 1.22;
  margin: 0 0 0.85rem;
}

.sub {
  color: var(--se-text-muted);
  font-size: 1rem;
  line-height: 1.5;
  margin: 0 0 1.25rem;
}

.badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-bottom: 1.5rem;
}

.badges span {
  font-size: 0.76rem;
  padding: 0.32rem 0.7rem;
  border-radius: 99px;
  border: 1px solid var(--se-glass-border);
  background: var(--se-glass);
  color: var(--se-text-muted);
}

.badges .accent {
  color: var(--se-yellow);
  border-color: rgba(255, 209, 102, 0.35);
}

.fine {
  margin: 1rem 0 0;
  font-size: 0.78rem;
  color: var(--se-text-muted);
  line-height: 1.4;
}

.fine strong {
  color: var(--se-text);
}
</style>
