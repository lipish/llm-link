# Release Checklist for v0.3.2

## ✅ Pre-Release Checks

### Code Quality
- [x] No compilation errors
- [x] No compilation warnings
- [x] All tests pass
- [x] Clippy warnings reviewed (only minor suggestions, no critical issues)

### Version Updates
- [x] Cargo.toml version updated to 0.3.2
- [x] API version in src/api/mod.rs updated to 0.3.2
- [x] CHANGELOG.md updated with v0.3.2 changes

### Documentation
- [x] README.md updated with new features
- [x] Added API_PROVIDERS_MODELS.md documentation
- [x] Provider count updated (9 providers)
- [x] Model discovery API documented
- [x] All provider lists updated

### Code Changes
- [x] ModelsConfig refactored to use HashMap
- [x] All providers load from models.yaml
- [x] OpenAI and Anthropic models added to YAML
- [x] Moonshot provider fully integrated
- [x] Dead code warnings fixed
- [x] Documentation tests fixed

### Testing
- [x] Test scripts moved to tests/ directory
- [x] API endpoint tested and working
- [x] All 9 providers return correct model counts
- [x] YAML loading verified with logging

## 📋 Release Steps

### 1. Git Commit and Tag

```bash
# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "Release v0.3.2: Dynamic model discovery API and 9 provider support

Major changes:
- Added dynamic model discovery API (/api/info)
- Refactored ModelsConfig to use HashMap for flexible providers
- Added Moonshot Kimi provider support
- Fixed model loading from YAML (now returns complete lists)
- Updated all documentation
- Fixed all compilation warnings

Providers: OpenAI, Anthropic, Zhipu, Aliyun, Volcengine, Tencent, LongCat, Moonshot, Ollama
Models: 47+ models across all providers"

# Create tag
git tag -a v0.3.2 -m "Release v0.3.2: Dynamic model discovery and 9 providers"

# Push to GitHub
git push origin master
git push origin v0.3.2
```

### 2. Publish to crates.io

```bash
# Verify package contents
cargo package --list

# Build and verify
cargo package

# Publish (dry-run first)
cargo publish --dry-run

# Actual publish
cargo publish
```

### 3. GitHub Release

Create a new release on GitHub:
- Tag: v0.3.2
- Title: "v0.3.2: Dynamic Model Discovery API"
- Description: Copy from CHANGELOG.md

### 4. Post-Release Verification

```bash
# Wait a few minutes, then verify on crates.io
cargo search llm-link

# Test installation
cargo install llm-link --version 0.3.2

# Verify it works
llm-link --help
```

## 🎯 Key Features to Highlight

1. **Dynamic Model Discovery API**
   - REST API to query all providers and models
   - No hardcoded provider lists
   - Easy to extend

2. **9 LLM Providers**
   - OpenAI, Anthropic, Zhipu, Aliyun, Volcengine, Tencent, LongCat, Moonshot, Ollama
   - 47+ models total

3. **Flexible Configuration**
   - HashMap-based provider system
   - Add new providers without code changes
   - Complete model definitions in YAML

4. **Bug Fixes**
   - Models now load correctly from YAML
   - All compilation warnings fixed
   - Clean build

## 📊 Statistics

- **Providers**: 9 (was 8)
- **Models**: 47+ (was ~20 in defaults)
- **New API Endpoints**: 1 (/api/info)
- **Documentation Files**: 2 new (API_PROVIDERS_MODELS.md, RELEASE_CHECKLIST.md)
- **Code Quality**: 0 warnings, 0 errors

## 🔗 Links

- Repository: https://github.com/lipish/llm-link
- Crates.io: https://crates.io/crates/llm-link
- Documentation: https://github.com/lipish/llm-link/blob/master/README.md

