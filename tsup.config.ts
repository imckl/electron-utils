import { defineConfig } from 'tsup'

export default defineConfig([
  // 主入口（类型导出）- 放第一个并负责清理 dist
  {
    entry: { index: 'src/index.ts' },
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
  },
  // 主进程
  {
    entry: { 'main/index': 'src/main/index.ts' },
    format: ['cjs', 'esm'],
    dts: true,
    external: ['electron'],
  },
  // Preload
  {
    entry: { 'preload/index': 'src/preload/index.ts' },
    format: ['cjs', 'esm'],
    dts: true,
    external: ['electron'],
  },
  // 渲染进程
  {
    entry: { 'renderer/index': 'src/renderer/index.ts' },
    format: ['cjs', 'esm'],
    dts: true,
  },
])
