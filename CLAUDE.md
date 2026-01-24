# CLAUDE.md

## 源码结构

```
src/
├── index.ts                 # 类型导出入口
├── main/
│   ├── index.ts             # 导出主进程工具
│   └── window/              # 窗口工具
│       ├── index.ts
│       ├── constants.ts     # 窗口尺寸常量
│       └── getWindowSize.ts # 窗口尺寸计算
├── preload/
│   └── index.ts             # 预加载脚本工具
├── renderer/
│   └── index.ts             # 渲染进程工具
└── shared/
    └── types.ts             # 共享类型定义
```

## 开发环境

在 WSL2 环境下安装依赖时，跳过 Electron 二进制下载（本包只需类型定义）：

```bash
ELECTRON_SKIP_BINARY_DOWNLOAD=1 npm install
```

## 构建配置

使用 tsup 多入口构建，每个入口独立配置：

```typescript
// tsup.config.ts 要点
- main:     format: ['cjs', 'esm'], external: ['electron']
- preload:  format: ['cjs', 'esm'], external: ['electron']  // 必须有 esm
- renderer: format: ['cjs', 'esm']
- index:    format: ['cjs', 'esm']  // 仅类型导出
```

## 已知坑点

### 1. Preload 沙盒限制

Electron preload 无法 require node_modules。消费方必须配置：

```typescript
// electron.vite.config.ts
preload: {
  build: {
    externalizeDeps: {
      exclude: ['@imckl/electron-utils'],
    },
  },
}
```

**注意**：是 `externalizeDeps.exclude`，不是 `rollupOptions.external`。

### 2. tsup 构建格式

preload 必须同时输出 CJS + ESM，否则 Vite 无法解析：

```typescript
{
  entry: { 'preload/index': 'src/preload/index.ts' },
  format: ['cjs', 'esm'],  // 必须包含 esm
}
```

### 3. package.json exports 顺序

`types` 必须在 `import`/`require` 之前，否则 TypeScript 无法解析类型：

```json
{
  "./preload": {
    "types": "./dist/preload/index.d.ts",
    "import": "./dist/preload/index.mjs",
    "require": "./dist/preload/index.js"
  }
}
```

## 发布

使用 `/new-version` 命令发布新版本，详见 `.claude/commands/new-version.md`。

## 提交规范

采用 Conventional Commits 规范：

```
<type>(<scope>): <subject>
```

**注意**：提交信息中不要添加 Co-Authored-By 或其他 AI 署名信息。

### Type

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档变更 |
| `refactor` | 重构 |
| `chore` | 构建/依赖/发版 |

### Scope（可选）

- `main` - 主进程模块
- `preload` - 预加载模块
- `renderer` - 渲染进程模块
- `types` - 类型定义
- `window` - 窗口工具

### 示例

```
feat(window): 添加窗口尺寸计算工具
fix(preload): 修复 API 暴露问题
chore: release v0.1.0
```
