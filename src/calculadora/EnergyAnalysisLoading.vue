<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const MESSAGES = [
  'Analizando radiación solar estimada…',
  'Estimando curva de consumo energético…',
  'Evaluando infraestructura crítica…',
  'Optimizando autonomía híbrida…',
  'Generando diagnóstico energético…',
] as const

/** Ciclo de mensajes: 600–800 ms para sensación orgánica con el fade. */
const ROTATE_MS = 700

const idx = ref(0)
const reduceMotion = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

const line = computed(() => MESSAGES[idx.value % MESSAGES.length])

function tick() {
  idx.value = (idx.value + 1) % MESSAGES.length
}

onMounted(() => {
  if (typeof matchMedia !== 'undefined') {
    reduceMotion.value = matchMedia('(prefers-reduced-motion: reduce)').matches
  }
  if (!reduceMotion.value) {
    timer = setInterval(tick, ROTATE_MS)
  }
})

onUnmounted(() => {
  if (timer != null) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<template>
  <div class="eal" role="status" aria-live="polite" aria-busy="true">
    <div class="eal-glow" aria-hidden="true" />
    <div class="eal-radar" aria-hidden="true">
      <div class="eal-radar-ring eal-radar-ring--a" />
      <div class="eal-radar-ring eal-radar-ring--b" />
      <div class="eal-radar-ring eal-radar-ring--c" />
    </div>

    <div class="eal-inner">
      <p class="eal-logo eal-logo--breathe" aria-hidden="true">S⚡E</p>
      <p class="eal-head">Tu hogar sigue funcionando</p>
      <p class="eal-sub">
        Estamos preparando una preevaluación de ahorro, respaldo y continuidad energética.
      </p>
      <div class="eal-line-wrap">
        <Transition name="eal-fade" mode="out-in">
          <p :key="idx" class="eal-line">{{ line }}</p>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.eal {
  --eal-bg: #0d1f35;
  --eal-green: #00c896;
  --eal-green-soft: rgba(0, 200, 150, 0.35);
  position: absolute;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--eal-bg);
  color: #e8eef6;
  text-align: center;
  padding: 1.5rem 1.25rem;
  overflow: hidden;
}

.eal-glow {
  position: absolute;
  inset: -35%;
  background: radial-gradient(circle at 50% 42%, rgba(0, 200, 150, 0.22) 0%, transparent 42%),
    radial-gradient(circle at 72% 68%, rgba(0, 132, 255, 0.12) 0%, transparent 38%);
  pointer-events: none;
  animation: eal-glow-pulse 3.2s ease-in-out infinite;
}

.eal-radar {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.eal-radar-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid var(--eal-green-soft);
  opacity: 0.55;
}

.eal-radar-ring--a {
  width: 42vmin;
  height: 42vmin;
  animation: eal-radar 2.8s ease-out infinite;
}

.eal-radar-ring--b {
  width: 58vmin;
  height: 58vmin;
  animation: eal-radar 2.8s ease-out infinite 0.55s;
}

.eal-radar-ring--c {
  width: 74vmin;
  height: 74vmin;
  animation: eal-radar 2.8s ease-out infinite 1.1s;
}

.eal-inner {
  position: relative;
  max-width: 22rem;
}

.eal-logo {
  margin: 0 0 0.65rem;
  font-size: clamp(1.75rem, 6vw, 2.25rem);
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #fff;
  text-shadow: 0 0 28px rgba(0, 200, 150, 0.45);
}

/** Misma duración que `eal-glow-pulse` (3.2s) para respirar al unísono con el resplandor. */
.eal-logo--breathe {
  animation: eal-logo-breathe 3.2s ease-in-out infinite;
}

.eal-head {
  margin: 0 0 0.5rem;
  font-size: clamp(1.1rem, 3.8vw, 1.35rem);
  font-weight: 700;
  line-height: 1.25;
  color: #f1f5f9;
}

.eal-sub {
  margin: 0 0 1.15rem;
  font-size: 0.88rem;
  line-height: 1.45;
  color: #94a3b8;
}

.eal-line-wrap {
  position: relative;
  min-height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.eal-line {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 600;
  color: #5eead4;
  line-height: 1.4;
  width: 100%;
}

.eal-fade-enter-active,
.eal-fade-leave-active {
  transition: opacity 0.28s ease;
}

.eal-fade-enter-from,
.eal-fade-leave-to {
  opacity: 0;
}

@keyframes eal-logo-breathe {
  0%,
  100% {
    transform: scale(1);
    text-shadow: 0 0 20px rgba(0, 200, 150, 0.35);
  }
  50% {
    transform: scale(1.045);
    text-shadow: 0 0 36px rgba(0, 200, 150, 0.55);
  }
}

@keyframes eal-glow-pulse {
  0%,
  100% {
    opacity: 0.85;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.03);
  }
}

@keyframes eal-radar {
  0% {
    transform: scale(0.72);
    opacity: 0.5;
  }
  70% {
    opacity: 0.12;
  }
  100% {
    transform: scale(1.08);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .eal-glow {
    animation: none;
    opacity: 0.75;
  }

  .eal-logo--breathe {
    animation: none;
  }

  .eal-fade-enter-active,
  .eal-fade-leave-active {
    transition: none;
  }

  .eal-radar-ring--a,
  .eal-radar-ring--b,
  .eal-radar-ring--c {
    animation: none;
    opacity: 0.2;
  }
}
</style>
