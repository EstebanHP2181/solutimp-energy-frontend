/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  /** Build/preview: when "true", injects robots noindex meta in index.html */
  readonly VITE_ROBOTS_NOINDEX?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
