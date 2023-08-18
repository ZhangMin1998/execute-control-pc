/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<{}, {}, any>
  export default component
}

declare interface Window {
  app: any
}

declare module '*.js'
declare module 'js-md5'
declare module 'crypto-js'
