/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_API_URL: string
  readonly VITE_EPICOR_FETCH_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}