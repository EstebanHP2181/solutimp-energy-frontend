<script setup lang="ts">
import EnergyBackground from '@/components/wizard/EnergyBackground.vue'
import EnergyHomeHero from '@/components/home/EnergyHomeHero.vue'
import EnergyHomeSegmentation from '@/components/home/EnergyHomeSegmentation.vue'
import EnergyHomeDifferentiator from '@/components/home/EnergyHomeDifferentiator.vue'
import EnergyHomeResilience from '@/components/home/EnergyHomeResilience.vue'
import EnergyHomeTechnology from '@/components/home/EnergyHomeTechnology.vue'
import EnergyHomeProcess from '@/components/home/EnergyHomeProcess.vue'
import EnergyHomeTrust from '@/components/home/EnergyHomeTrust.vue'
import EnergyHomeClosingCta from '@/components/home/EnergyHomeClosingCta.vue'
</script>

<template>
  <div class="eh-page">
    <EnergyBackground />
    <a href="#main-content" class="eh-skip">Ir al contenido principal</a>
    <main id="main-content" class="eh-main" tabindex="-1">
      <EnergyHomeHero />
      <EnergyHomeSegmentation />
      <EnergyHomeDifferentiator />
      <EnergyHomeResilience />
      <EnergyHomeTechnology />
      <EnergyHomeProcess />
      <EnergyHomeTrust />
      <EnergyHomeClosingCta />
    </main>
  </div>
</template>

<style scoped>
.eh-page {
  position: relative;
  min-height: 100%;
  min-height: 100dvh;
}

.eh-main {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 72rem;
  margin: 0 auto;
  /* Mobile: menos relleno lateral, respeta notch; más aire vertical abajo */
  padding: 0.75rem max(0.75rem, env(safe-area-inset-left)) 1.75rem max(0.75rem, env(safe-area-inset-right));
}

@media (min-width: 768px) {
  .eh-main {
    padding: 1.75rem 1.5rem 2.75rem;
  }
}

.eh-skip {
  position: absolute;
  left: -9999px;
  top: 0.5rem;
  z-index: 10;
  padding: 0.5rem 1rem;
  background: var(--se-text);
  color: var(--se-blue-deep);
  font-weight: 700;
  border-radius: 8px;
  text-decoration: none;
}

.eh-skip:focus {
  left: 0.5rem;
  outline: 2px solid var(--se-cyan);
  outline-offset: 2px;
}
</style>
