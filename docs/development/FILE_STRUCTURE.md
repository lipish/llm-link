# LLM Link 文件结构

## 📁 项目结构概览

```
llm-link/
├── README.md                    # 项目主文档
├── CHANGELOG.md                 # 版本更新日志
├── Cargo.toml                   # Rust 项目配置
├── Cargo.lock                   # 依赖锁定文件
│
├── src/                         # 源代码目录
│   ├── main.rs                  # 程序入口
│   ├── settings.rs              # 配置管理
│   ├── service.rs               # 服务层
│   ├── adapters.rs              # 客户端适配器
│   │
│   ├── api/                     # API 端点
│   │   ├── mod.rs               # API 模块入口（/api/info 等）
│   │   ├── openai.rs            # OpenAI API 兼容层
│   │   ├── ollama.rs            # Ollama API 兼容层
│   │   ├── anthropic.rs         # Anthropic API 兼容层
│   │   └── convert.rs           # 格式转换工具
│   │
│   ├── llm/                     # LLM 核心功能
│   │   ├── mod.rs               # LLM 模块入口
│   │   ├── types.rs             # 类型定义
│   │   ├── chat.rs              # 非流式对话
│   │   └── stream.rs            # 流式对话
│   │
│   ├── apps/                    # 应用配置
│   │   ├── mod.rs               # 应用模块入口
│   │   ├── codex_cli.rs         # Codex CLI 配置
│   │   ├── zed.rs               # Zed 编辑器配置
│   │   └── claude_code.rs       # Claude Code 配置
│   │
│   └── models/                  # 模型配置
│       ├── mod.rs               # 模型模块入口
│       └── models.yaml          # 所有 provider 的模型定义
│
├── docs/                        # 文档目录（18 个文档）
│   ├── README.md                # 文档索引
│   │
│   ├── QUICK_START.md           # 快速开始指南
│   ├── ZED_INTEGRATION.md       # Zed 集成指南
│   ├── CLAUDE_CODE_INTEGRATION.md  # Claude Code 集成指南
│   │
│   ├── API_PROVIDERS_MODELS.md  # API 文档：Provider 和 Model 发现
│   ├── HOT_RELOAD_API.md        # API 文档：热重载
│   ├── CONFIG_UPDATE_API.md     # API 文档：配置更新
│   │
│   ├── RELEASE_SUMMARY.md       # v0.3.2 发布总结
│   ├── RELEASE_CHECKLIST.md     # 发布检查清单
│   ├── GIT_COMMIT_GUIDE.md      # Git 提交指南
│   ├── PUBLISHING.md            # 发布指南
│   │
│   ├── RELEASE_v0.2.0.md        # v0.2.0 发布说明
│   ├── RELEASE_v0.1.0.md        # v0.1.0 发布说明
│   ├── UPGRADE_v0.5.1.md        # v0.5.1 升级指南
│   │
│   ├── PROVIDER_TEST_REPORT.md  # Provider 测试报告
│   ├── TESTING_REPORT_v0.4.20.md  # v0.4.20 测试报告
│   ├── RESTART_VERIFICATION.md  # 重启验证指南
│   │
│   ├── MODEL_MARKETPLACE.md     # 模型市场
│   └── FILE_STRUCTURE.md        # 本文件
│
├── tests/                       # 测试脚本目录
│   ├── verify_release.sh        # 发布验证脚本
│   └── test_all_providers.sh    # Provider 测试脚本
│
└── logs/                        # 日志目录（运行时生成）
```

## 📋 文件说明

### 根目录文件

| 文件 | 说明 |
|------|------|
| `README.md` | 项目主文档，包含安装、使用、配置等信息 |
| `CHANGELOG.md` | 版本更新日志，记录每个版本的变更 |
| `Cargo.toml` | Rust 项目配置，定义依赖和元数据 |
| `Cargo.lock` | 依赖版本锁定文件 |

### 源代码目录 (src/)

#### 核心文件
- `main.rs` - 程序入口，CLI 参数解析，服务启动
- `settings.rs` - 配置管理，环境变量加载
- `service.rs` - 服务层，LLM 调用封装
- `adapters.rs` - 客户端检测和适配

#### API 模块 (src/api/)
- `mod.rs` - API 路由定义，`/api/info` 等端点
- `openai.rs` - OpenAI API 兼容实现
- `ollama.rs` - Ollama API 兼容实现
- `anthropic.rs` - Anthropic API 兼容实现
- `convert.rs` - 消息格式转换工具

#### LLM 模块 (src/llm/)
- `mod.rs` - LLM 模块入口
- `types.rs` - 消息、响应等类型定义
- `chat.rs` - 非流式对话实现
- `stream.rs` - 流式对话实现（OpenAI/Ollama 格式）

#### 应用配置 (src/apps/)
- `mod.rs` - 应用配置管理
- `codex_cli.rs` - Codex CLI 配置生成
- `zed.rs` - Zed 编辑器配置生成
- `claude_code.rs` - Claude Code 配置生成

#### 模型配置 (src/models/)
- `mod.rs` - 模型配置加载，HashMap-based 动态系统
- `models.yaml` - 所有 9 个 provider 的模型定义（47+ models）

### 文档目录 (docs/)

#### 用户文档
- `README.md` - 文档索引和导航
- `QUICK_START.md` - 快速开始指南（中文）
- `ZED_INTEGRATION.md` - Zed 编辑器集成
- `CLAUDE_CODE_INTEGRATION.md` - Claude Code 集成

#### API 文档
- `API_PROVIDERS_MODELS.md` - Provider 和 Model 发现 API
- `HOT_RELOAD_API.md` - 热重载 API
- `CONFIG_UPDATE_API.md` - 配置更新 API

#### 发布文档
- `RELEASE_SUMMARY.md` - v0.3.2 发布总结
- `RELEASE_CHECKLIST.md` - 发布检查清单
- `GIT_COMMIT_GUIDE.md` - Git 提交和发布指南
- `PUBLISHING.md` - crates.io 发布指南

#### 历史文档
- `RELEASE_v0.2.0.md` - v0.2.0 发布说明
- `RELEASE_v0.1.0.md` - v0.1.0 发布说明
- `UPGRADE_v0.5.1.md` - v0.5.1 升级指南

#### 测试文档
- `PROVIDER_TEST_REPORT.md` - Provider 测试报告
- `TESTING_REPORT_v0.4.20.md` - v0.4.20 测试报告
- `RESTART_VERIFICATION.md` - 重启验证指南

#### 其他文档
- `MODEL_MARKETPLACE.md` - 模型市场和官方文档链接
- `FILE_STRUCTURE.md` - 本文件，项目结构说明

### 测试目录 (tests/)

- `verify_release.sh` - 发布前验证脚本
  - 检查版本号
  - 测试 API 端点
  - 验证 provider 数量
  - 验证模型加载

- `test_all_providers.sh` - Provider 测试脚本
  - 测试所有 9 个 providers
  - 验证模型列表
  - 检查 API 响应

## 📊 统计信息

### 代码统计
- **源文件**: 20+ Rust 文件
- **文档**: 18 个 Markdown 文件
- **测试**: 2 个 Shell 脚本

### 功能统计
- **Providers**: 9 个
- **Models**: 47+ 个
- **API 端点**: 10+ 个
- **应用配置**: 3 个

## 🗂️ 文件组织原则

1. **根目录简洁** - 只保留 README.md 和 CHANGELOG.md
2. **文档集中** - 所有文档放在 docs/ 目录
3. **测试独立** - 测试脚本放在 tests/ 目录
4. **代码模块化** - 按功能划分模块（api, llm, apps, models）
5. **配置嵌入** - models.yaml 嵌入到二进制文件中

## 🔗 相关链接

- [项目主页](../README.md)
- [文档索引](README.md)
- [更新日志](../CHANGELOG.md)

---

**最后更新**: 2025-10-30  
**版本**: v0.3.2

