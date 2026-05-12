/**
 * Número WhatsApp comercial en formato wa.me (solo dígitos, con código país).
 * Configurar con `VITE_WHATSAPP_E164` (acepta "56222013315" o "+56222013315"); fallback 56222013315.
 */
const DEFAULT_WHATSAPP_WA_ME_DIGITS = '56222013315'

function readWhatsAppWaMeDigitsFromEnv(): string {
  const raw = import.meta.env.VITE_WHATSAPP_E164?.trim()
  if (!raw) return DEFAULT_WHATSAPP_WA_ME_DIGITS
  const digits = raw.replace(/\D/g, '')
  return digits.length > 0 ? digits : DEFAULT_WHATSAPP_WA_ME_DIGITS
}

/** Dígitos para `https://wa.me/<digits>` (sin +). */
export function getWhatsAppWaMeDigits(): string {
  return readWhatsAppWaMeDigitsFromEnv()
}

/** @deprecated Usar `getWhatsAppWaMeDigits()`; mismo valor para compatibilidad. */
export function getWhatsAppBusinessE164(): string {
  return getWhatsAppWaMeDigits()
}

export function buildWhatsAppLink(text: string): string {
  const msg = encodeURIComponent(text)
  return `https://wa.me/${getWhatsAppWaMeDigits()}?text=${msg}`
}
