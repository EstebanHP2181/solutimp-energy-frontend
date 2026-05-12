import { onUnmounted, ref } from 'vue'
import { formatCLP } from '@/shared/formatCLP'

function reducedMotion(): boolean {
  if (typeof matchMedia === 'undefined') return false
  return matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Animación 0 → objetivo para rango de ahorro mensual (800ms). */
export function useSavingsRangeAnimation(durationMs = 800) {
  const displayMin = ref(0)
  const displayMax = ref(0)
  const label = ref('')
  let raf = 0

  function start(targetMin: number, targetMax: number) {
    cancelAnimationFrame(raf)
    const a0 = Number.isFinite(targetMin) ? targetMin : 0
    const b0 = Number.isFinite(targetMax) ? targetMax : 0
    const lo = Math.min(a0, b0)
    const hi = Math.max(a0, b0)
    if (hi <= 0) {
      label.value = ''
      return
    }
    if (reducedMotion()) {
      displayMin.value = lo
      displayMax.value = hi
      label.value = `${formatCLP(lo)}–${formatCLP(hi)}`
      return
    }
    const t0 = performance.now()
    const ease = (t: number) => 1 - (1 - t) ** 3
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / durationMs)
      const e = ease(t)
      displayMin.value = Math.round(lo * e)
      displayMax.value = Math.round(hi * e)
      label.value = `${formatCLP(displayMin.value)}–${formatCLP(displayMax.value)}`
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        displayMin.value = lo
        displayMax.value = hi
        label.value = `${formatCLP(lo)}–${formatCLP(hi)}`
      }
    }
    raf = requestAnimationFrame(tick)
  }

  onUnmounted(() => cancelAnimationFrame(raf))

  return { displayMin, displayMax, label, start }
}
