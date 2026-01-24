/**
 * @imckl/electron-utils - 类型定义
 */

// ============ 窗口尺寸类型 ============

/** 窗口尺寸 */
export interface WindowSize {
  /** 宽度（像素） */
  width: number
  /** 高度（像素） */
  height: number
}

/** 屏幕断点配置 */
export interface ScreenBreakpoint {
  /** 最大屏幕宽度（包含） */
  maxWidth: number
  /** 最大屏幕高度（包含） */
  maxHeight: number
  /** 此断点下的窗口尺寸 */
  windowSize: WindowSize
}

/** getWindowSize 配置选项 */
export interface GetWindowSizeOptions {
  /**
   * 自定义断点配置
   * 按屏幕尺寸从小到大排序
   * 不提供则使用默认断点
   */
  breakpoints?: ScreenBreakpoint[]

  /**
   * 最大屏幕（超出所有断点）时的窗口尺寸
   * 默认: { width: 2000, height: 1200 }
   */
  fallbackSize?: WindowSize

  /**
   * 最小窗口尺寸限制
   * 计算结果不会小于此值
   */
  minSize?: WindowSize

  /**
   * 最大窗口尺寸限制
   * 计算结果不会大于此值
   */
  maxSize?: WindowSize
}

/** 窗口尺寸计算结果（详细版） */
export interface WindowSizeResult extends WindowSize {
  /** 屏幕工作区尺寸 */
  screenWorkArea: WindowSize
  /** 匹配的断点索引（-1 表示使用 fallback） */
  matchedBreakpointIndex: number
}
