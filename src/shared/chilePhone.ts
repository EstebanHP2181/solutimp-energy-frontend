/** Prefijo móvil Chile en E.164 (+56 + 9 móvil). */
export const CHILE_MOBILE_PREFIX = '+569'

/** @deprecated Usar `CHILE_MOBILE_PREFIX`; mismo valor (compat onboarding). */
export const CHILE_MOBILE_E164_PREFIX = CHILE_MOBILE_PREFIX

const E164_MOBILE_REGEX = /^\+569[1-9]\d{7}$/

/**
 * Normaliza texto de teléfono (escritura o pegado) hacia forma `+569` + abonado (hasta 8 dígitos).
 * - Quita espacios, guiones, paréntesis y demás no numéricos (salvo el flujo con prefijo 569).
 * - `+569XXXXXXXX` / `569XXXXXXXX` → `+569` + 8 dígitos
 * - `9XXXXXXXX` (9 dígitos nacionales) → `+569XXXXXXXX`
 * - Solo `XXXXXXXX` → `+569` + hasta 8 dígitos
 */
export function normalizeChileMobileInput(input: string): string {
  const d = input.replace(/[\s\-().]/g, '').replace(/\D/g, '')
  if (d.length === 0) return ''

  if (d.startsWith('569')) {
    const sub = d.length >= 11 ? d.slice(3, 11) : d.slice(3)
    return `${CHILE_MOBILE_PREFIX}${sub}`
  }

  if (/^9\d{8}$/.test(d)) {
    return `+56${d}`
  }

  return `${CHILE_MOBILE_PREFIX}${d.slice(0, 8)}`
}

export function isValidChileMobileE164(phone: string): boolean {
  return E164_MOBILE_REGEX.test(phone)
}

export function getChileMobileValidationError(input: string): string | null {
  const d = input.replace(/[\s\-().]/g, '').replace(/\D/g, '')
  if (d.length === 0) return null

  const n = normalizeChileMobileInput(input)
  if (isValidChileMobileE164(n)) return null

  if (d.startsWith('569')) {
    if (d.length > 11) return 'Demasiados dígitos. El formato es +56 9 y 8 dígitos.'
    if (d.length < 11) return 'Faltan dígitos. Tras 569 deben ir 8 dígitos.'
    return 'Número de celular no válido.'
  }

  if (/^9\d{8}$/.test(d)) {
    return 'Número de celular no válido.'
  }

  if (d.length > 8) {
    return 'Demasiados dígitos. Ingresa 8 dígitos o pega el número completo con +569.'
  }
  if (d.length < 8) {
    return 'Faltan dígitos. El celular tiene 8 dígitos después del +569.'
  }
  if (/^0/.test(d)) {
    return 'El número no puede empezar con 0.'
  }
  return 'Número de celular no válido.'
}

/** Solo dígitos, máximo 8 (campo “solo abonado” / onboarding). */
export function sanitizeChileMobileDigits8(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, 8)
}

/** Válido como abonado de 8 dígitos (mismo criterio E.164 +569). */
export function isValidChileMobileDigits8(d: string): boolean {
  return isValidChileMobileE164(normalizeChileMobileInput(d))
}

/** Devuelve E.164 completo o `null` si no es válido (onboarding con 8 dígitos locales). */
export function normalizeChileMobileToE164(input: string): string | null {
  const n = normalizeChileMobileInput(input)
  return isValidChileMobileE164(n) ? n : null
}
