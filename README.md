# @imckl/electron-utils

Electron 通用工具包，提供窗口管理、菜单构建等常用功能。

## 特性

- **窗口尺寸自适应**：根据屏幕分辨率自动计算最佳窗口尺寸
- **断点配置**：支持多档屏幕断点，适配不同分辨率
- **完整类型**：TypeScript 类型支持

## 安装

```bash
npm install @imckl/electron-utils
```

## 快速开始

### 主进程

```typescript
// src/main/index.ts
import { BrowserWindow } from 'electron'
import { getWindowSizeSimple } from '@imckl/electron-utils/main'

const mainWindow = new BrowserWindow({
  ...getWindowSizeSimple(),
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
  },
})
```

## API

### 主进程

#### getWindowSizeSimple(options?)

计算最佳窗口尺寸（简化版），直接返回 `{ width, height }`。

```typescript
import { getWindowSizeSimple } from '@imckl/electron-utils/main'

const mainWindow = new BrowserWindow({
  ...getWindowSizeSimple(),
})
```

#### getWindowSize(options?)

计算最佳窗口尺寸（详细版），返回额外信息。

```typescript
import { getWindowSize } from '@imckl/electron-utils/main'

const result = getWindowSize()
console.log(`Window: ${result.width}x${result.height}`)
console.log(`Screen: ${result.screenWorkArea.width}x${result.screenWorkArea.height}`)
console.log(`Matched breakpoint: ${result.matchedBreakpointIndex}`)
```

#### 配置选项

```typescript
interface GetWindowSizeOptions {
  breakpoints?: ScreenBreakpoint[]  // 自定义断点配置
  fallbackSize?: WindowSize         // 超高分屏的 fallback 尺寸
  minSize?: WindowSize              // 最小尺寸限制
  maxSize?: WindowSize              // 最大尺寸限制
}
```

#### 自定义断点

```typescript
import { getWindowSizeSimple } from '@imckl/electron-utils/main'

const size = getWindowSizeSimple({
  breakpoints: [
    { maxWidth: 1920, maxHeight: 1080, windowSize: { width: 1600, height: 900 } },
    { maxWidth: 2560, maxHeight: 1440, windowSize: { width: 1800, height: 1000 } },
  ],
  fallbackSize: { width: 2000, height: 1200 },
  minSize: { width: 800, height: 600 },
})
```

### 默认断点

| 屏幕分辨率 | 窗口尺寸 | 占比 |
|-----------|---------|------|
| ≤1366x768 | 1200x700 | ~88% |
| ≤1920x1080 | 1400x850 | ~73% |
| ≤2560x1440 | 1700x950 | ~66% |
| 更高 | 2000x1200 | - |

### 类型定义

```typescript
// src/env.d.ts
import type { WindowSize, WindowSizeResult, GetWindowSizeOptions } from '@imckl/electron-utils'
```

## Preload 配置

如果在 preload 中使用本包，需要配置构建工具将其打包进 preload：

```typescript
// electron.vite.config.ts
export default defineConfig({
  preload: {
    build: {
      externalizeDeps: {
        exclude: ['@imckl/electron-utils'],
      },
    },
  },
})
```

## License

MIT
