/**
 * URL base pública del sitio (sin path de API), p. ej. https://energy.solutimp.cl
 * Definir en `.env` como VITE_API_BASE_URL (ver `.env.example`).
 * Las rutas del API se pasan completas a `apiUrl()`, p. ej. `/api/v1/energy/bom/auto`.
 */
export function getApiBaseUrl(): string {
  const base = import.meta.env.VITE_API_BASE_URL?.trim() ?? ''
  return base.replace(/\/+$/, '')
}

/**
 * Une base y path evitando barras duplicadas. Útil en tests sin `import.meta.env`.
 *
 * @example joinApiUrl('https://energy.solutimp.cl', '/api/v1/energy/bom/auto')
 */
export function joinApiUrl(base: string, path: string): string {
  const b = base.trim().replace(/\/+$/, '')
  let p = path.trim()
  if (!p) {
    return b || '/'
  }
  if (!p.startsWith('/')) {
    p = `/${p}`
  }
  while (p.includes('//')) {
    p = p.replace(/\/{2,}/g, '/')
  }
  if (!b) {
    return p
  }
  return `${b}${p}`
}

/**
 * URL absoluta o relativa lista para `fetch` según la base configurada.
 *
 * @example apiUrl('/api/v1/energy/bom/auto')
 */
export function apiUrl(path: string): string {
  return joinApiUrl(getApiBaseUrl(), path)
}
