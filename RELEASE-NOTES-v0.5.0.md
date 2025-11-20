# 🎉 llm-link v0.5.0 Release Notes

## 📦 Release Status

✅ **GitHub**: Code pushed and tagged as v0.5.0
⏳ **crates.io**: Ready to publish (requires authentication)

## 🚀 How to Complete the Release

### 1. Publish to crates.io

```bash
# Login to crates.io (one-time setup)
cargo login

# Publish the new version
cargo publish
```

### 2. Create GitHub Release

Visit: https://github.com/lipish/llm-link/releases/new

- **Tag**: v0.5.0
- **Title**: llm-link v0.5.0: Multi-Provider Support & Zed Compatibility Fixes
- **Description**: Copy from the changelog below

## 📋 Release Highlights

### 🎯 Major Features

#### Multi-Provider Support (10 Providers)
- **OpenAI**: GPT-4o, GPT-4, GPT-3.5-turbo
- **Anthropic**: Claude 3.5 Sonnet, Claude 3 Opus/Sonnet/Haiku
- **Zhipu AI**: GLM-4.6, GLM-4.5 series
- **Aliyun**: Qwen3-Coder-Plus, Qwen3-Max, Qwen series
- **Volcengine**: Doubao models
- **Tencent**: Hunyuan models
- **Moonshot**: Kimi models
- **MiniMax**: MiniMax-M2
- **LongCat**: LongCat models
- **Ollama**: Local models

#### Qwen3-Coder-Plus Integration ⭐
- **262K Context Length**: Handle large codebases
- **Code Specialization**: Optimized for programming tasks
- **Tool Calling**: Full function calling support
- **Zed Integration**: Seamless editor integration

### 🐛 Critical Bug Fixes

#### Zed "Blank Tool" Issue
- **Root Cause**: Missing `id` and `type` fields in tool call responses
- **Solution**: Enhanced tool call format with proper Ollama compatibility
- **Impact**: Tools now display correctly in Zed editor

#### Tool Persistence
- **Problem**: Tools lost after first use in conversations
- **Solution**: Global tool caching per model
- **Benefit**: Continuous tool availability throughout conversations

### 📚 New Scripts & Documentation

#### Quick Start Scripts
```bash
# Qwen3-Coder-Plus (recommended for coding)
./scripts/zed-qwen3-coder.sh "your-aliyun-api-key"

# Universal provider switching
./scripts/switch-provider.sh openai "your-openai-key"
./scripts/switch-provider.sh anthropic "your-anthropic-key"
```

#### Testing & Debugging
- `scripts/debug-zed-tools.sh` - Comprehensive tool call debugging
- `scripts/test-tool-persistence.sh` - Tool persistence validation
- `scripts/test-blank-tool-fix.sh` - Blank tool issue testing

#### Documentation
- `scripts/README-ALL-PROVIDERS.md` - Complete usage guide
- `scripts/ZED-QWEN3-CODER-SETUP.md` - Detailed Zed setup
- `docs/fixes/tool-persistence-fix.md` - Technical details

## 🔧 Technical Improvements

### Tool Call Format Enhancement
```json
// Before (caused blank tools)
{
  "function": {
    "name": "list_files",
    "arguments": {...}
  }
}

// After (proper Ollama format)
{
  "id": "call_abc12345",
  "type": "function", 
  "function": {
    "name": "list_files",
    "arguments": {...}
  }
}
```

### Tool Persistence Architecture
- **Global Cache**: Per-model tool definition storage
- **Thread Safety**: Arc<Mutex<HashMap>> implementation
- **Automatic Fallback**: Use cached tools when not provided

## 📊 Performance & Compatibility

### Zed Editor Integration
- ✅ Tool calls display correctly (no more blank tools)
- ✅ Tool persistence across conversations
- ✅ Proper Ollama protocol compliance
- ✅ Enhanced debugging capabilities

### Multi-Provider Support
- ✅ 10 LLM providers supported
- ✅ Universal switching scripts
- ✅ Provider-specific optimizations
- ✅ Comprehensive testing coverage

## 🎯 Migration Guide

### From v0.4.0 to v0.5.0

#### No Breaking Changes
- Existing configurations continue to work
- All previous functionality preserved
- Enhanced with new features

#### Recommended Updates
```bash
# Old way (still works)
./target/release/llm-link --provider aliyun --model qwen3-max

# New way (recommended)
./scripts/zed-qwen3-coder.sh "your-api-key"
```

## 🔗 Links

- **GitHub**: https://github.com/lipish/llm-link
- **crates.io**: https://crates.io/crates/llm-link
- **Documentation**: https://github.com/lipish/llm-link/blob/master/README.md

## 🙏 Acknowledgments

This release addresses critical user feedback regarding:
- Zed editor compatibility issues
- Tool calling reliability
- Multi-provider support needs
- Enhanced debugging capabilities

Special thanks to the community for reporting and helping debug the "blank tool" issue!

---

**Ready to publish!** 🚀
