import { screen } from 'electron'
import type { WindowSize, WindowSizeResult, GetWindowSizeOptions } from '../../shared/types'
import { DEFAULT_BREAKPOINTS, DEFAULT_FALLBACK_SIZE } from './constants'

/**
 * 根据屏幕分辨率计算最佳窗口尺寸（详细版）
 *
 * @param options - 配置选项
 * @returns 窗口尺寸及额外信息
 *
 * @example
 * // 使用默认配置
 * const result = getWindowSize()
 * console.log(`Window: ${result.width}x${result.height}`)
 * console.log(`Screen: ${result.screenWorkArea.width}x${result.screenWorkArea.height}`)
 *
 * @example
 * // 自定义断点
 * const result = getWindowSize({
 *   breakpoints: [
 *     { maxWidth: 1920, maxHeight: 1080, windowSize: { width: 1600, height: 900 } }
 *   ],
 *   fallbackSize: { width: 1800, height: 1000 }
 * })
 */
export function getWindowSize(options: GetWindowSizeOptions = {}): WindowSizeResult {
  const {
    breakpoints = DEFAULT_BREAKPOINTS,
    fallbackSize = DEFAULT_FALLBACK_SIZE,
    minSize,
    maxSize
  } = options

  // 获取主显示器工作区尺寸
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize

  // 查找匹配的断点
  let matchedIndex = -1
  let resultSize: WindowSize = { ...fallbackSize }

  for (let i = 0; i < breakpoints.length; i++) {
    const bp = breakpoints[i]
    if (screenWidth <= bp.maxWidth && screenHeight <= bp.maxHeight) {
      matchedIndex = i
      resultSize = { ...bp.windowSize }
      break
    }
  }

  // 应用最小限制
  if (minSize) {
    resultSize.width = Math.max(resultSize.width, minSize.width)
    resultSize.height = Math.max(resultSize.height, minSize.height)
  }

  // 应用最大限制
  if (maxSize) {
    resultSize.width = Math.min(resultSize.width, maxSize.width)
    resultSize.height = Math.min(resultSize.height, maxSize.height)
  }

  // 确保不超过屏幕工作区
  resultSize.width = Math.min(resultSize.width, screenWidth)
  resultSize.height = Math.min(resultSize.height, screenHeight)

  return {
    ...resultSize,
    screenWorkArea: { width: screenWidth, height: screenHeight },
    matchedBreakpointIndex: matchedIndex
  }
}

/**
 * 根据屏幕分辨率计算最佳窗口尺寸（简化版）
 *
 * @param options - 配置选项
 * @returns 仅返回 { width, height }
 *
 * @example
 * const mainWindow = new BrowserWindow({
 *   ...getWindowSizeSimple(),
 *   // 其他配置...
 * })
 */
export function getWindowSizeSimple(options?: GetWindowSizeOptions): WindowSize {
  const { width, height } = getWindowSize(options)
  return { width, height }
}
