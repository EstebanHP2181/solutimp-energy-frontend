/** Claves UTM estándar que leemos de `route.query`. */
export const UTM_QUERY_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const

export type UtmQueryKey = (typeof UTM_QUERY_KEYS)[number]

export type UtmQueryValues = Partial<Record<UtmQueryKey, string>>

/**
 * Normaliza un valor suelto de query (string, array de strings, null, etc.).
 * - `string` → trim; vacío → `undefined`
 * - `string[]` → primer elemento `string` con trim no vacío
 * - `null` / `undefined` → `undefined`
 * - otro tipo → `undefined`
 */
export function normalizeQueryParamValue(value: unknown): string | undefined {
  if (value == null) return undefined
  if (typeof value === 'string') {
    const t = value.trim()
    return t.length > 0 ? t : undefined
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      if (typeof item === 'string') {
        const t = item.trim()
        if (t.length > 0) return t
      }
    }
    return undefined
  }
  return undefined
}

/**
 * Extrae UTMs desde un objeto de query tipado de forma amplia (p. ej. `route.query` como `Record<string, unknown>`).
 * Ignora valores vacíos o no representables como un solo string de campaña.
 */
export function readUtmsFromQuery(query: Record<string, unknown>): UtmQueryValues {
  const out: UtmQueryValues = {}
  for (const key of UTM_QUERY_KEYS) {
    const v = normalizeQueryParamValue(query[key])
    if (v !== undefined) {
      out[key] = v
    }
  }
  return out
}
