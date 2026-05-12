import { buildWhatsAppLink } from '@/shared/whatsapp'

/** Enlaces WhatsApp comercial (número desde env o fallback 56222013315). */
export const waSpecialistHref = buildWhatsAppLink(
  'Hola, quiero hablar con un especialista energético de Solutimp Energy.',
)

export const waCondominiumHref = buildWhatsAppLink(
  'Hola, me interesa energía solar, espacios comunes y continuidad operativa para un condominio.',
)
