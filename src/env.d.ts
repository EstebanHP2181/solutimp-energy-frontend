/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  /** Build/preview: when "true", injects robots noindex meta in index.html */
  readonly VITE_ROBOTS_NOINDEX?: string
  /** WhatsApp Solutimp: solo dígitos E.164 sin + (p. ej. 56222013315). Opcional; fallback 56222013315. */
  readonly VITE_WHATSAPP_E164?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
