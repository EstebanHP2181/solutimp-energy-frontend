import { onUnmounted, ref } from 'vue'

function reducedMotion(): boolean {
  if (typeof matchMedia === 'undefined') return false
  return matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Contador numérico 0 → target (ease-out cúbico). */
export function useCountUp(durationMs = 900) {
  const display = ref(0)
  let raf = 0

  function start(target: number) {
    cancelAnimationFrame(raf)
    if (!Number.isFinite(target) || target < 0) {
      display.value = 0
      return
    }
    if (reducedMotion()) {
      display.value = Math.round(target)
      return
    }
    const t0 = performance.now()
    const ease = (t: number) => 1 - (1 - t) ** 3
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / durationMs)
      display.value = Math.round(target * ease(t))
      if (t < 1) raf = requestAnimationFrame(tick)
      else display.value = Math.round(target)
    }
    raf = requestAnimationFrame(tick)
  }

  onUnmounted(() => cancelAnimationFrame(raf))

  return { display, start }
}
