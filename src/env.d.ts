// 自定义的环境变量

interface ImportMetaEnv {
  readonly VITE_API_URL: string,
  readonly VITE_WS_URL: string,
  readonly VITE_WS_REWRITE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}