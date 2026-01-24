/**
 * @imckl/electron-utils
 *
 * Electron 通用工具包
 *
 * @example
 * ```typescript
 * // 主进程
 * import { getWindowSize } from '@imckl/electron-utils/main'
 *
 * // 类型声明
 * import type { WindowSize } from '@imckl/electron-utils'
 * ```
 */

// 仅导出类型，实际功能通过子路径导入
export type {
  WindowSize,
  WindowSizeResult,
  GetWindowSizeOptions,
  ScreenBreakpoint
} from './shared/types'
