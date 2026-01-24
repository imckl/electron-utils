/**
 * 主进程模块导出
 *
 * @example
 * ```typescript
 * import { getWindowSize, getWindowSizeSimple } from '@imckl/electron-utils/main'
 *
 * const mainWindow = new BrowserWindow({
 *   ...getWindowSizeSimple(),
 *   // other options
 * })
 * ```
 */

// Window utilities
export { getWindowSize, getWindowSizeSimple, DEFAULT_BREAKPOINTS, DEFAULT_FALLBACK_SIZE } from './window'

// Re-export types
export type {
  WindowSize,
  WindowSizeResult,
  GetWindowSizeOptions,
  ScreenBreakpoint
} from '../shared/types'
