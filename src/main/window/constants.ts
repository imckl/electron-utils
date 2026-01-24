import type { ScreenBreakpoint, WindowSize } from '../../shared/types'

/**
 * 默认屏幕断点配置
 *
 * 设计原理：
 * - 小屏幕（≤1366x768）：窗口接近最大化（~88%），充分利用有限空间
 * - 中等屏幕（≤1920x1080）：适度缩小（~73%），保留多窗口协作空间
 * - 高分屏（≤2560x1440）：进一步缩小（~66%），更多屏幕管理空间
 * - 超高分辨率：固定尺寸，避免窗口过大
 */
export const DEFAULT_BREAKPOINTS: ScreenBreakpoint[] = [
  {
    maxWidth: 1366,
    maxHeight: 768,
    windowSize: { width: 1200, height: 700 } // ~87.9% 宽度
  },
  {
    maxWidth: 1920,
    maxHeight: 1080,
    windowSize: { width: 1400, height: 850 } // ~72.9% 宽度
  },
  {
    maxWidth: 2560,
    maxHeight: 1440,
    windowSize: { width: 1700, height: 950 } // ~66.4% 宽度
  }
]

/** 默认 fallback 尺寸（超高分屏） */
export const DEFAULT_FALLBACK_SIZE: WindowSize = {
  width: 2000,
  height: 1200
}
