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

### 6. 展示发版计划并确认

使用 AskUserQuestion 工具展示计划并请求确认：

```
发版计划
────────────────────────────
版本: {当前版本} → {新版本}

提交记录:
  - {提交1}
  - {提交2}
  ...
────────────────────────────
```

提供选项：
- "确认发版"
- "取消"

如果用户选择"取消"，则终止流程。

### 7. 构建

```bash
npm run build
```

如果构建失败，终止流程。

### 8. 更新 package.json

修改 `package.json`：
- `version` → 新版本

### 9. 提交改动

```bash
git add package.json
git commit -m "chore: release v{新版本}"
```

### 10. 创建 Git tag

```bash
git tag v{新版本}
```

### 11. 发布到 npm

```bash
npm publish
```

### 12. 推送到远程

```bash
git push && git push --tags
```

### 13. 完成提示

```
✅ 版本 {新版本} 发布完成！

已完成：
- npm publish
- git push + tags
```

## 注意事项

- 在 WSL2 环境下运行，安装依赖时使用 `ELECTRON_SKIP_BINARY_DOWNLOAD=1 npm install` 跳过 electron 二进制下载
- npm publish 需要已登录（`npm login`）
- npm publish 需要 2FA 验证（Security Key）
- 发布前会自动运行 `npm run build`
