<script setup lang="ts"></script>

<template>
  <div class="eb-root" aria-hidden="true">
    <div class="eb-gradient" />
    <svg class="eb-svg" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="eb-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="var(--se-cyan)" stop-opacity="0" />
          <stop offset="40%" stop-color="var(--se-cyan)" stop-opacity="0.6" />
          <stop offset="100%" stop-color="var(--se-blue-electric)" stop-opacity="0" />
        </linearGradient>
      </defs>
      <path
        class="eb-path eb-p1"
        d="M-20 120 Q 120 80 200 200 T 420 320"
        fill="none"
        stroke="url(#eb-line-grad)"
        stroke-width="1.5"
      />
      <path
        class="eb-path eb-p2"
        d="M420 500 Q 280 420 160 520 T -40 680"
        fill="none"
        stroke="url(#eb-line-grad)"
        stroke-width="1.2"
        opacity="0.7"
      />
      <path
        class="eb-path eb-p3"
        d="M0 350 Q 200 300 400 400"
        fill="none"
        stroke="url(#eb-line-grad)"
        stroke-width="1"
        opacity="0.5"
      />
    </svg>
    <div class="eb-orb" />
  </div>
</template>

<style scoped>
.eb-root {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.eb-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 50% at 20% 20%, var(--se-glow) 0%, transparent 55%),
    radial-gradient(ellipse 60% 40% at 85% 70%, rgba(0, 212, 255, 0.12) 0%, transparent 50%),
    linear-gradient(165deg, var(--se-blue-deep) 0%, #0a1a35 45%, #061426 100%);
  animation: eb-shift 18s ease-in-out infinite alternate;
}

@media (prefers-reduced-motion: reduce) {
  .eb-gradient {
    animation: none;
  }

  .eb-path {
    animation: none !important;
  }

  .eb-orb {
    animation: none !important;
  }
}

@keyframes eb-shift {
  0% {
    filter: hue-rotate(0deg);
    transform: scale(1);
  }
  100% {
    filter: hue-rotate(12deg);
    transform: scale(1.03);
  }
}

.eb-svg {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.85;
}

.eb-path {
  stroke-dasharray: 12 420;
  animation: eb-flow 22s linear infinite;
}

.eb-p2 {
  animation-duration: 28s;
  animation-direction: reverse;
}

.eb-p3 {
  animation-duration: 35s;
}

@keyframes eb-flow {
  to {
    stroke-dashoffset: -800;
  }
}

.eb-orb {
  position: absolute;
  width: min(90vw, 420px);
  height: min(90vw, 420px);
  border-radius: 50%;
  top: -12%;
  right: -20%;
  background: radial-gradient(circle, rgba(0, 132, 255, 0.18) 0%, transparent 68%);
  filter: blur(2px);
  animation: eb-pulse-orb 10s ease-in-out infinite;
}

@keyframes eb-pulse-orb {
  0%,
  100% {
    opacity: 0.7;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.06);
  }
}
</style>
