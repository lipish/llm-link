# GitHub Pages 部署指南

## 🚀 自动部署配置

### 1. 仓库设置

确保你的 GitHub 仓库已启用 GitHub Pages：

1. 进入仓库的 **Settings** 页面
2. 在左侧菜单中选择 **Pages**
3. 在 **Build and deployment** 部分设置：
   - **Source**: GitHub Actions

### 2. 权限配置

在仓库设置中确认以下权限：

1. **Settings** → **Actions** → **General**
2. 在 **Workflow permissions** 部分：
   - ✅ 选择 **Read and write permissions**
   - ✅ 启用 **Allow GitHub Actions to create and approve pull requests**

### 3. 环境设置

GitHub Actions 会自动创建 `github-pages` 环境，但你可以自定义：

1. **Settings** → **Environments** → **github-pages**
2. 配置保护规则（可选）

## 📋 工作流特性

### 触发条件
- ✅ 推送到 `main` 分支（仅当文档文件变更时）
- ✅ 针对 `main` 分支的 Pull Request
- ✅ 手动触发 (`workflow_dispatch`)

### 优化特性
- 🔄 **智能触发**: 只在文档相关文件变更时运行
- ⚡ **构建缓存**: Node.js 依赖缓存加速构建
- 🛡️ **并发控制**: 避免重复部署冲突
- 🌍 **生产环境**: 设置 `NODE_ENV=production`

### 构建过程
1. 检出代码
2. 设置 Node.js 18
3. 安装依赖 (`npm ci`)
4. 构建文档站点
5. 上传到 GitHub Pages

## 🔧 本地测试

在推送前，你可以本地测试构建：

```bash
cd docs-site
npm install
npm run build
npm run preview
```

访问 http://localhost:4173 预览构建结果。

## 📊 部署状态

部署成功后，文档将可访问：
- **主域名**: `https://[username].github.io/llm-link/`
- **自定义域名**: 如需配置，在 **Settings** → **Pages** 中设置

## 🐛 故障排除

### 常见问题

1. **权限错误**
   - 检查仓库的 Actions 权限设置
   - 确认 `id-token` 和 `pages` 权限已启用

2. **构建失败**
   - 检查 `package-lock.json` 是否存在
   - 确认 Node.js 版本兼容性

3. **部署失败**
   - 确认 Pages 源设置为 "GitHub Actions"
   - 检查环境配置

### 调试步骤

1. 查看 **Actions** 标签页中的工作流日志
2. 检查构建步骤的错误信息
3. 本地复现构建过程

## 🎯 最佳实践

1. **分支保护**: 为 `main` 分支设置保护规则
2. **状态检查**: 要求 CI 通过才能合并
3. **定期更新**: 保持依赖项最新
4. **监控设置**: 设置部署失败通知

---

🎉 配置完成后，每次推送文档更新都会自动部署到 GitHub Pages！
