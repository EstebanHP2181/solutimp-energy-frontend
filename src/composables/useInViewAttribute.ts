import { onMounted, onUnmounted, type Ref } from 'vue'

function reducedMotion(): boolean {
  if (typeof matchMedia === 'undefined') return false
  return matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Marca elementos `[data-io]` dentro del root con `data-io-visible="true"` al entrar en viewport.
 */
export function useInViewChildren(root: Ref<HTMLElement | null>) {
  let obs: IntersectionObserver | null = null

  onMounted(() => {
    if (reducedMotion()) {
      root.value?.querySelectorAll('[data-io]').forEach((el) => el.setAttribute('data-io-visible', 'true'))
      return
    }
    const elRoot = root.value
    if (!elRoot) return
    const targets = elRoot.querySelectorAll('[data-io]')
    if (targets.length === 0) return
    obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.target instanceof HTMLElement) {
            e.target.setAttribute('data-io-visible', 'true')
            obs?.unobserve(e.target)
          }
        }
      },
      { root: null, rootMargin: '0px 0px -6% 0px', threshold: 0.06 }
    )
    targets.forEach((t) => obs!.observe(t))
  })

  onUnmounted(() => {
    obs?.disconnect()
    obs = null
  })
}
