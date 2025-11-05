# GitHub 仓库设置检查清单

## ✅ 部署前检查清单

### 1. 仓库基本设置
- [ ] 仓库为公开（public）或私有（private）状态
- [ ] master 分支存在且为默认分支
- [ ] `.github/workflows/deploy-docs.yml` 文件已提交

### 2. GitHub Pages 设置
- [ ] 进入 Settings → Pages
- [ ] Source 设置为 "GitHub Actions"
- [ ] 无自定义域名要求（或已正确配置）

### 3. Actions 权限设置
- [ ] Settings → Actions → General
- [ ] Workflow permissions: "Read and write permissions"
- [ ] Allow GitHub Actions to create and approve pull requests: ✅

### 4. 文件结构检查
- [ ] `docs-site/` 目录存在
- [ ] `docs-site/package.json` 包含正确的构建脚本
- [ ] `docs-site/package-lock.json` 存在
- [ ] `docs-site/svelte.config.js` 配置正确

### 5. 依赖和构建
- [ ] 本地 `npm run build` 成功
- [ ] 生成的 `build/` 目录包含静态文件
- [ ] 无 TypeScript 或其他编译错误

## 🚀 推送和部署

### 第一次部署
```bash
# 添加所有文件
git add .
git commit -m "Add documentation site with GitHub Pages deployment"

# 推送到 master 分支
git push origin master
```

### 监控部署
1. 进入 GitHub 仓库的 **Actions** 标签页
2. 查看 "Deploy Documentation to GitHub Pages" 工作流
3. 确认所有步骤都成功完成

## 🔍 验证部署

### 检查部署状态
- [ ] Actions 工作流显示绿色 ✅
- [ ] Settings → Pages 显示部署成功
- [ ] 可以访问 `https://[username].github.io/llm-link/`

### 功能测试
- [ ] 首页加载正常
- [ ] 导航链接工作正常
- [ ] 文档页面显示正确
- [ ] 提供商页面渲染正常

## 🐛 常见问题解决

### 如果部署失败
1. 检查 Actions 日志中的错误信息
2. 确认权限设置正确
3. 验证本地构建是否成功
4. 检查文件路径和配置

### 如果页面显示 404
1. 确认 Pages 源设置为 "GitHub Actions"
2. 检查 `svelte.config.js` 中的 `paths.base` 配置
3. 验证构建文件是否正确生成

---

🎯 完成所有检查项后，你的文档站点将自动部署到 GitHub Pages！
