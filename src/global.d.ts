/**
 * The module for importing CSS files.
 */
declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

/**
 * The type definition for the Node.js process object with additional properties.
 */
type ProcessType = NodeJS.Process & {
  browser: boolean
  env: {
    [key: string]: string | undefined
  }
}

/**
 * The global process object.
 */
declare let process: ProcessType

/**
 * The type definition for the Hot Module object.
 */
interface HotModule {
  hot?: {
    status: () => string
  }
}

interface Window {
  fbAsyncInit: () => void
  FB: {
    api: any
    init: (params: Record<string, any>) => void
    getLoginStatus: any //(callback: (response: any) => void) => void
    login: (
      callback: (response: any) => void,
      options?: { scope: string }
    ) => void
    logout: (callback: () => void) => void
  }
}

declare const module: HotModule
