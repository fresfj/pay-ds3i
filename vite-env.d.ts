/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAP_KEY: string
  readonly VITE_API_KEY: string
  readonly VITE_API_BACKEND: string
  readonly VITE_AUTH_DOMAIN: string
  readonly VITE_DATABASE_URL: string
  readonly VITE_PROJECT_ID: string
  readonly VITE_STORAGE_BUCKET: string
  readonly VITE_MESSAGING_SENDER_ID: string
  readonly VITE_GOOGLE_ANALYTICS: string
  readonly VITE_FACEBOOK_PIXEL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
