# Git Commit and Release Guide for v0.3.2

## 📋 Files Changed

Run this to see all changes:
```bash
git status
```

Expected changes (19 files):
- CHANGELOG.md
- Cargo.lock
- Cargo.toml
- README.md
- RELEASE_CHECKLIST.md
- RELEASE_SUMMARY.md
- GIT_COMMIT_GUIDE.md
- docs/API_PROVIDERS_MODELS.md
- docs/HOT_RELOAD_API.md
- src/adapters.rs
- src/api/anthropic.rs
- src/api/convert.rs
- src/api/mod.rs
- src/api/ollama.rs
- src/api/openai.rs
- src/llm/chat.rs
- src/llm/stream.rs
- src/llm/types.rs
- src/models/mod.rs
- src/models/models.yaml
- src/service.rs
- tests/verify_release.sh
- tests/test_all_providers.sh

## 🚀 Step-by-Step Release Process

### Step 1: Review Changes

```bash
# See what files changed
git status

# Review specific changes
git diff README.md
git diff Cargo.toml
git diff CHANGELOG.md
```

### Step 2: Add All Changes

```bash
# Add all changes
git add .

# Verify what will be committed
git status
```

### Step 3: Commit with Detailed Message

```bash
git commit -m "Release v0.3.2: Dynamic model discovery API and 9 provider support

Major Features:
- Added dynamic model discovery API (/api/info endpoint)
- Refactored ModelsConfig to use HashMap for flexible provider support
- Added Moonshot Kimi provider (9 providers total)
- Fixed model loading from YAML (now returns complete model lists)

Technical Changes:
- Changed ModelsConfig from fixed struct to HashMap-based
- Added OpenAI and Anthropic models to models.yaml
- Updated all provider model definitions (47+ models)
- Fixed all compilation warnings with #[allow(dead_code)]
- Fixed documentation test examples

Bug Fixes:
- Models now load correctly from embedded YAML
- Zhipu returns 6 models instead of 2 (from defaults)
- All providers show complete model catalogs
- Clean compilation with 0 warnings

Documentation:
- Added docs/API_PROVIDERS_MODELS.md with complete API documentation
- Updated README.md with API endpoints section
- Enhanced CHANGELOG.md with detailed v0.3.2 changes
- Added release verification scripts

Providers (9 total):
OpenAI (7 models), Anthropic (5 models), Zhipu (6 models),
Aliyun (8 models), Volcengine (6 models), Tencent (10 models),
LongCat (2 models), Moonshot (3 models), Ollama (dynamic)

Breaking Changes: None
Migration: No migration needed"
```

### Step 4: Create Git Tag

```bash
# Create annotated tag
git tag -a v0.3.2 -m "Release v0.3.2: Dynamic model discovery API

- Dynamic model discovery via /api/info
- 9 LLM providers with 47+ models
- HashMap-based flexible provider system
- Complete model definitions in YAML
- Fixed model loading bugs
- Zero compilation warnings"

# Verify tag
git tag -l -n9 v0.3.2
```

### Step 5: Push to GitHub

```bash
# Push commits
git push origin master

# Push tag
git push origin v0.3.2

# Or push both at once
git push origin master --tags
```

### Step 6: Verify on GitHub

Visit: https://github.com/lipish/llm-link

Check:
- [x] Commits appear on master branch
- [x] Tag v0.3.2 is visible
- [x] All files updated correctly

### Step 7: Create GitHub Release

1. Go to: https://github.com/lipish/llm-link/releases/new
2. Choose tag: v0.3.2
3. Release title: **v0.3.2: Dynamic Model Discovery API**
4. Description (copy from below):

```markdown
## 🎉 What's New in v0.3.2

### Dynamic Model Discovery API

Query all supported providers and their models via REST API:

```bash
curl http://localhost:11434/api/info
```

Returns complete information about:
- All 9 supported providers
- 47+ available models
- Current configuration
- API endpoints

### 9 LLM Providers

Now supporting:
- **OpenAI** (7 models) - GPT-4o, GPT-4, o1-preview, etc.
- **Anthropic** (5 models) - Claude 3.5 Sonnet, Claude 3 Opus, etc.
- **Zhipu** (6 models) - GLM-4.6, GLM-4.5 series
- **Aliyun** (8 models) - Qwen3 Max, Qwen Plus, etc.
- **Volcengine** (6 models) - Doubao Seed 1.6 series
- **Tencent** (10 models) - Hunyuan T1, Hunyuan Large, etc.
- **LongCat** (2 models) - Flash Chat, Flash Thinking
- **Moonshot** (3 models) - Kimi K2 series ✨ NEW
- **Ollama** (dynamic) - Local models

### Flexible Provider System

- Add new providers by editing YAML only (no code changes)
- HashMap-based configuration for unlimited extensibility
- Automatic loading from embedded models.yaml

### Bug Fixes

- ✅ Models now load correctly from YAML (was using hardcoded defaults)
- ✅ All providers return complete model lists
- ✅ Fixed all compilation warnings
- ✅ Clean build with 0 errors

### Documentation

- 📚 New API documentation: [API_PROVIDERS_MODELS.md](docs/API_PROVIDERS_MODELS.md)
- 📝 Updated README with API examples
- 📋 Enhanced CHANGELOG with detailed changes

## 📦 Installation

```bash
cargo install llm-link
```

## 🔗 Links

- [Full Changelog](CHANGELOG.md)
- [API Documentation](docs/API_PROVIDERS_MODELS.md)
- [README](README.md)
```

### Step 8: Publish to crates.io

```bash
# Verify package contents
cargo package --list

# Dry run
cargo publish --dry-run

# Actual publish
cargo publish
```

### Step 9: Verify Publication

Wait 2-3 minutes, then:

```bash
# Search on crates.io
cargo search llm-link

# Install and test
cargo install llm-link --version 0.3.2
llm-link --version
```

## ✅ Post-Release Checklist

- [ ] Code committed to git
- [ ] Tag v0.3.2 created
- [ ] Pushed to GitHub
- [ ] GitHub release created
- [ ] Published to crates.io
- [ ] Verified on crates.io
- [ ] Installation tested
- [ ] Documentation links work

## 🎊 Done!

Your release is complete! 🚀

Share the news:
- GitHub: https://github.com/lipish/llm-link/releases/tag/v0.3.2
- Crates.io: https://crates.io/crates/llm-link

