
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_PROJECT_ID: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
  readonly VITE_SUPABASE_URL: string;
  // add other VITE_ env vars here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
