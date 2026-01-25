# 发布新版本

执行 npm 包发布流程。

## 参数

- `$ARGUMENTS` 可包含：
  - `[version]` - 可选，新版本号（如 `0.1.0`），默认自动 bump patch
  - `--major` - 可选，bump major 版本（如 0.1.0 → 1.0.0）
  - `--minor` - 可选，bump minor 版本（如 0.0.1 → 0.1.0）

## 用法示例

```
/new-version              # 自动 bump patch（0.0.1 → 0.0.2）
/new-version --minor      # bump minor（0.0.1 → 0.1.0）
/new-version --major      # bump major（0.1.0 → 1.0.0）
/new-version 1.0.0        # 指定版本号
```

## 执行流程

### 1. 解析参数

从 `$ARGUMENTS` 中解析：
- 版本号：匹配 `\d+\.\d+\.\d+` 格式的参数
- `--major`：是否存在
- `--minor`：是否存在

校验：`--major`、`--minor` 和指定版本号互斥。

### 2. 读取当前状态

读取 `package.json`，获取当前 `version`。

### 3. 计算新版本

- 如果参数指定了版本号 → 使用指定版本
- 如果 `--major` → major +1，minor 和 patch 归零
- 如果 `--minor` → minor +1，patch 归零
- 否则 → patch +1

### 4. 校验版本号

新版本必须 > 当前版本，否则报错。

### 5. 查看 git log

运行 `git log v{当前版本}..HEAD --oneline` 获取提交记录。

如果没有 tag，运行 `git log --oneline -10` 获取最近提交。

### 6. 生成 CHANGELOG 内容

解析 Conventional Commits 格式，按类型分组：

| Commit Type | Changelog Section |
|-------------|-------------------|
| `feat` | Added |
| `fix` | Fixed |
| `refactor`, `perf` | Changed |
| `docs` | Documentation |
| 其他 | 忽略（chore, style, test, ci, build） |

生成格式：

```markdown
## [0.1.0] - 2026-01-25

### Added
- **layout:** 菜单自动关联 Tab

### Changed
- **types:** 移除 useTabManager 泛型

### Fixed
- **main:** 修复右键菜单不显示问题
```

规则：
- 版本号格式：`[x.x.x]`
- 日期格式：`YYYY-MM-DD`
- 每条记录格式：`- **scope:** description`（无 scope 则省略）
- 空的 section 不输出

### 7. 展示发版计划并确认

使用 AskUserQuestion 工具展示计划并请求确认：

```
发版计划
────────────────────────────
版本: {当前版本} → {新版本}

CHANGELOG 预览:
## [{新版本}] - {今天日期}

### Added
- **layout:** xxx

### Changed
- **types:** xxx
────────────────────────────
```

提供选项：
- "确认发版"
- "取消"

如果用户选择"取消"，则终止流程。

### 8. 验证构建

```bash
npm run build
```

如果构建失败，终止流程。此步骤验证代码能成功构建，失败不会污染版本。

### 9. 更新 CHANGELOG.md

- 如果文件不存在，创建并添加标题 `# Changelog\n\n`
- 在标题后插入新版本内容（保留历史版本）

### 10. 更新 package.json

修改 `package.json`：
- `version` → 新版本

### 11. 正式构建

```bash
npm run build
```

用新版本号重新构建，确保构建产物中版本号正确。

### 12. 提交改动

```bash
git add package.json CHANGELOG.md
git commit -m "chore: release v{新版本}"
```

### 13. 创建 Git tag

```bash
git tag v{新版本}
```

### 14. 发布到 npm

提示用户手动执行（因为需要 2FA 验证码）：

```bash
npm publish
```

等待用户确认发布成功后继续。

### 15. 推送到远程

```bash
git push && git push --tags
```

### 16. 完成提示

```
✅ 版本 {新版本} 发布完成！

已完成：
- 更新 CHANGELOG.md
- npm publish
- git push + tags
```

## 注意事项

- 在 WSL2 环境下运行，安装依赖时使用 `ELECTRON_SKIP_BINARY_DOWNLOAD=1 npm install` 跳过 electron 二进制下载
- npm publish 需要已登录（`npm login`）
- npm publish 需要 2FA 验证（Security Key）
- 发布前会运行两次构建：第一次验证代码，第二次用新版本号正式构建
- CHANGELOG.md 遵循 [Keep a Changelog](https://keepachangelog.com/) 格式
