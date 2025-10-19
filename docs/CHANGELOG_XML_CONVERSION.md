# Changelog: XML to JSON Conversion Feature

## 版本信息
- **功能**: Zhipu XML Function Call 自动转换
- **日期**: 2025-10-18
- **类型**: 架构改进 + 新功能

## 概述

实现了智能的 XML 到 JSON 转换功能，解决 Zhipu AI 返回 XML 格式 function calls 与标准客户端（Codex、Zed.dev）期望 JSON 格式的兼容性问题。

## 核心设计原则

**延迟转换 + 保留原始格式 + Provider 隔离**
- 只在真正需要的时候转换一次（零冗余）
- 根据客户端类型智能决定是否转换
- 保留对 Zhipu 原生应用的完整支持
- **只对 Zhipu provider 进行 XML 转换，不影响其他 provider** ⭐ 重要

## 代码变更

### 新增文件

1. **`src/utils/`** - 工具模块目录
   - `mod.rs` - 模块声明
   - `xml.rs` - XML 工具模块
     - `contains_xml_function_call()` - XML 检测
     - `convert_xml_to_json_function_call()` - XML 转 JSON（支持两种格式）
     - `transform_xml_in_json_response()` - 递归转换
     - 完整的单元测试（6 个测试）

2. **`docs/ZHIPU_XML_CONVERSION.md`** - 功能文档
   - 详细的使用说明
   - 配置示例
   - 使用场景

3. **`docs/ARCHITECTURE.md`** - 架构文档
   - 系统架构图
   - 数据流说明
   - 设计决策

4. **`docs/CHANGELOG_XML_CONVERSION.md`** - 本文档

### 修改文件

#### 配置层

**`src/config.rs`**
- 添加 `ZhipuAdapterConfig` 结构
- 支持 `convert_xml_to_json` 和 `preserve_xml` 配置选项

```rust
pub struct ZhipuAdapterConfig {
    pub convert_xml_to_json: Option<bool>,
    pub preserve_xml: Option<bool>,
}
```

**`src/apps.rs`**
- 为所有应用配置添加 zhipu 默认配置
- 默认启用 XML 转换（`convert_xml_to_json: true`）

#### 适配器层

**`src/adapters.rs`**
- 添加 `ZhipuNative` 客户端类型
- 实现 `apply_xml_conversion()` 方法，包含 **Provider 检测逻辑** ⭐
- 在 `apply_response_adaptations()` 中集成 XML 转换逻辑

```rust
pub enum ClientAdapter {
    Standard,
    ZedDev,
    OpenAI,
    ZhipuNative,  // 新增
}

// Provider 隔离逻辑
fn apply_xml_conversion(&self, config: &Config, data: &mut Value) {
    // 只对 Zhipu provider 进行转换
    let is_zhipu = matches!(config.llm_backend, LlmBackendConfig::Zhipu { .. });
    if !is_zhipu {
        return; // 跳过非 Zhipu provider
    }
    // ... 转换逻辑
}
```

#### Handler 层

**`src/handlers/ollama.rs`**
- 更新 `detect_ollama_client()` 函数
- 支持检测 ZhipuNative 客户端
- 通过 User-Agent 或 x-client header 识别

**`src/handlers/openai.rs`**
- 添加 `detect_openai_client()` 函数
- 支持 Zhipu 原生客户端检测

#### 模块注册

**`src/lib.rs`** 和 **`src/main.rs`**
- 添加 `utils` 模块声明
- 创建 `src/utils/mod.rs` 模块入口

### 文档更新

**`README.md`**
- 在 Key Features 中添加 XML 转换功能
- 在 Features 章节添加详细说明
- 添加文档链接

**`docs/APPLICATION_SUPPORT.md`**
- 添加客户端适配特性说明
- 更新配置示例
- 添加响应转换表格

## 功能特性

### 1. 自动客户端检测

支持多种检测方式：

| 优先级 | 方式 | 示例 |
|--------|------|------|
| 1 | 配置强制 | `force_adapter: "zhipu-native"` |
| 2 | HTTP Header | `x-client: zhipu-native` |
| 3 | User-Agent | `User-Agent: Zhipu/1.0` |
| 4 | 默认配置 | `default_adapter: "auto"` |

### 2. 智能转换策略

| 客户端类型 | XML 转换 | 说明 |
|-----------|---------|------|
| Standard | ✅ 自动转换 | 标准 Ollama 客户端 |
| ZedDev | ✅ 自动转换 | Zed.dev 编辑器 |
| OpenAI | ✅ 自动转换 | OpenAI API 客户端 |
| ZhipuNative | ❌ 保留原样 | Zhipu 原生应用 |

### 3. 配置灵活性

```yaml
client_adapters:
  zhipu:
    # 默认转换 XML 为 JSON
    convert_xml_to_json: true
    
    # 针对特定场景，可以保留 XML
    preserve_xml: false
```

## 测试覆盖

### 单元测试

```bash
cargo test xml_utils --lib
```

测试项：
- ✅ XML 检测功能
- ✅ XML 标签内容提取
- ✅ XML 到 JSON 转换
- ✅ JSON 响应中的 XML 递归转换

### 构建测试

```bash
cargo build --release
```

- ✅ 编译通过
- ✅ 无警告
- ✅ 所有依赖正确

## 使用示例

### 场景 1: Codex CLI 使用 Zhipu

```bash
# 启动服务
llm-link --app codex-cli --api-key $ZHIPU_API_KEY

# XML 会自动转换为 JSON
# Codex 可以正常使用 function calls
```

### 场景 2: Zhipu 原生应用

```bash
# 启动服务
llm-link --api-key $ZHIPU_API_KEY

# 请求时指定客户端类型
curl -H "x-client: zhipu-native" \
     -H "Content-Type: application/json" \
     -d '{"model": "glm-4-flash", "messages": [...]}' \
     http://localhost:11434/api/chat

# 响应保留原始 XML 格式
```

### 场景 3: 自定义配置

```yaml
# config.yaml
client_adapters:
  zhipu:
    # 禁用转换，保留 XML
    convert_xml_to_json: false
    preserve_xml: true
```

## 性能影响

### 开销分析

1. **检测开销**: 最小（字符串前缀检查）
2. **转换开销**: 仅在检测到 XML 时执行
3. **内存开销**: 无额外内存分配（原地转换）

### 优化措施

- 延迟转换：只在需要时转换
- 递归优化：避免重复检测
- 零拷贝：尽可能使用引用

## 兼容性

### 向后兼容

- ✅ 不影响现有功能
- ✅ 默认行为保持不变
- ✅ 可通过配置禁用

### 客户端兼容

- ✅ Codex CLI
- ✅ Zed.dev
- ✅ OpenAI SDK
- ✅ Zhipu 原生应用

## 已知限制

1. **XML 格式支持**
   - 当前只支持简单的键值对格式
   - 不支持复杂的嵌套结构
   - 不支持 XML 属性

2. **性能**
   - 大量 XML 转换可能有轻微性能影响
   - 建议在生产环境监控性能指标

## 未来改进

### 短期（v0.2.0）
- [ ] 支持更复杂的 XML 结构
- [ ] 添加 XML Schema 验证
- [ ] 性能优化（缓存、并行处理）

### 中期（v0.3.0）
- [ ] 自定义 XML 到 JSON 映射规则
- [ ] 支持 XML 命名空间
- [ ] 添加转换统计和监控

### 长期（v1.0.0）
- [ ] 完整的 XML 解析器
- [ ] 双向转换（JSON to XML）
- [ ] 可插拔的转换引擎

## 迁移指南

### 从旧版本升级

如果你使用的是旧版本的 LLM Link：

1. **无需修改配置**
   - 默认行为：自动转换 XML
   - 现有配置继续工作

2. **如需保留 XML**
   ```yaml
   client_adapters:
     zhipu:
       preserve_xml: true
   ```

3. **如需指定客户端**
   ```bash
   # 通过 header
   curl -H "x-client: zhipu-native" ...
   
   # 或通过配置
   force_adapter: "zhipu-native"
   ```

## 贡献者

- 架构设计: @lipish
- 实现: @lipish
- 文档: @lipish
- 测试: @lipish

## 参考资料

- [Zhipu XML Conversion Guide](ZHIPU_XML_CONVERSION.md)
- [Architecture Overview](ARCHITECTURE.md)
- [Application Support Guide](APPLICATION_SUPPORT.md)

## 反馈

如有问题或建议，请：
1. 查看文档：`docs/ZHIPU_XML_CONVERSION.md`
2. 提交 Issue
3. 参与讨论

---

**版本**: v0.1.0 → v0.2.0
**状态**: ✅ 已完成并测试
**影响**: 架构改进，向后兼容

