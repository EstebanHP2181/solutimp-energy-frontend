import { UTM_QUERY_KEYS, type UtmQueryKey, type UtmQueryValues } from './utmQuery'

export const UTM_SESSION_STORAGE_KEY = 'se_utm_v1'

/** Deja solo claves UTM conocidas con string no vacío (trim). */
function sanitizeUtmsForStorage(utms: UtmQueryValues): UtmQueryValues {
  const out: UtmQueryValues = {}
  for (const k of UTM_QUERY_KEYS) {
    const v = utms[k]
    if (typeof v === 'string' && v.trim() !== '') {
      out[k as UtmQueryKey] = v.trim()
    }
  }
  return out
}

/**
 * Guarda UTMs en sessionStorage (última atribución en sesión).
 * Solo escribe si hay al menos un valor válido; si no, no llama a setItem.
 */
export function saveUtmsToSession(utms: UtmQueryValues): void {
  if (typeof sessionStorage === 'undefined') return
  const cleaned = sanitizeUtmsForStorage(utms)
  if (Object.keys(cleaned).length === 0) return
  try {
    sessionStorage.setItem(UTM_SESSION_STORAGE_KEY, JSON.stringify(cleaned))
  } catch {
    // cuota, modo privado, etc.
  }
}

/** Lee UTMs guardadas; objeto vacío si no hay o JSON inválido. */
export function loadUtmsFromSession(): UtmQueryValues {
  if (typeof sessionStorage === 'undefined') return {}
  try {
    const raw = sessionStorage.getItem(UTM_SESSION_STORAGE_KEY)
    if (raw == null || raw.trim() === '') return {}
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    const rec = parsed as Record<string, unknown>
    const out: UtmQueryValues = {}
    for (const key of UTM_QUERY_KEYS) {
      const v = rec[key]
      if (typeof v === 'string' && v.trim() !== '') {
        out[key as UtmQueryKey] = v.trim()
      }
    }
    return out
  } catch {
    return {}
  }
}
