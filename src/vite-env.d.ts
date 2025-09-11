/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_API_URL: string
  readonly VITE_EPICOR_FETCH_URL: string
  readonly VITE_PRODUCT_ANALYSIS_API_URL: string
  readonly VITE_EPICOR_INVOICE_AUTO_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}