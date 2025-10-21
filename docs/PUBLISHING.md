# Publishing to crates.io

This document describes the process for publishing llm-link to crates.io.

## 📋 Pre-Publication Checklist

### 1. Code Quality
- [x] All tests pass: `cargo test`
- [x] No compiler warnings: `cargo build --release`
- [x] Code is formatted: `cargo fmt`
- [x] Clippy passes: `cargo clippy`

### 2. Documentation
- [x] README.md is up to date
- [x] CHANGELOG.md is updated with latest changes
- [x] All docs/ files are current
- [x] API documentation is complete

### 3. Cargo.toml Metadata
- [x] Version number is correct
- [x] Description is accurate and concise
- [x] Authors are listed
- [x] License is specified (MIT)
- [x] Repository URL is correct
- [x] Homepage URL is correct
- [x] Documentation URL is correct
- [x] Keywords are relevant (max 5)
- [x] Categories are appropriate
- [x] README path is specified
- [x] Exclude list includes test files and sensitive data

### 4. License
- [x] LICENSE file exists
- [x] License matches Cargo.toml declaration

### 5. Git Repository
- [x] All changes are committed
- [x] All commits are pushed to GitHub
- [x] Working directory is clean
- [x] On the correct branch (master)

### 6. Package Verification
- [x] Package builds: `cargo package`
- [x] Package size is reasonable
- [x] All necessary files are included
- [x] No sensitive files are included (keys, secrets, etc.)

## 🚀 Publication Steps

### Step 1: Get crates.io API Token

1. Visit https://crates.io/
2. Log in with your GitHub account
3. Go to Account Settings
4. Click "New Token"
5. Give it a name (e.g., "llm-link-publish")
6. Copy the token

### Step 2: Login to crates.io

```bash
cargo login <your-api-token>
```

This will save your token to `~/.cargo/credentials.toml`

### Step 3: Dry Run

```bash
cargo publish --dry-run
```

This will:
- Package the crate
- Verify all metadata
- Check for errors
- NOT actually publish

### Step 4: Publish

```bash
cargo publish
```

This will:
- Package the crate
- Upload to crates.io
- Make it available for download

**Note**: Once published, a version cannot be unpublished or modified. You can only yank it (hide from new projects).

### Step 5: Verify Publication

1. Visit https://crates.io/crates/llm-link
2. Check that the version is listed
3. Verify the documentation link works
4. Test installation:
   ```bash
   cargo install llm-link
   ```

## 📝 Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** version (X.0.0): Incompatible API changes
- **MINOR** version (0.X.0): New functionality, backwards compatible
- **PATCH** version (0.0.X): Bug fixes, backwards compatible

### Current Version: 0.1.0

This is the initial release.

### Next Versions

- **0.1.1**: Bug fixes
- **0.2.0**: New features (e.g., new provider support)
- **1.0.0**: Stable API, production ready

## 🔄 Update Process

When publishing a new version:

1. Update version in `Cargo.toml`
2. Update `CHANGELOG.md` with changes
3. Commit changes:
   ```bash
   git add Cargo.toml CHANGELOG.md
   git commit -m "Bump version to X.Y.Z"
   git push origin master
   ```
4. Create a git tag:
   ```bash
   git tag -a vX.Y.Z -m "Release vX.Y.Z"
   git push origin vX.Y.Z
   ```
5. Publish to crates.io:
   ```bash
   cargo publish
   ```

## 📦 Package Contents

The published package includes:

```
llm-link-0.1.0/
├── Cargo.toml
├── Cargo.lock
├── LICENSE
├── README.md
├── CHANGELOG.md
├── docs/
│   ├── MODEL_MARKETPLACE.md
│   ├── QUICK_START.md
│   ├── TESTING_REPORT_v0.4.20.md
│   └── ZED_INTEGRATION.md
└── src/
    ├── main.rs
    ├── lib.rs
    ├── api/
    ├── apps/
    ├── cli/
    ├── llm/
    ├── models/
    ├── adapters.rs
    ├── service.rs
    └── settings.rs
```

**Excluded**:
- `tests/` directory
- `keys.yaml` (sensitive data)
- `.git/` directory
- `.gitignore`

## ⚠️ Important Notes

1. **Cannot Unpublish**: Once a version is published, it cannot be deleted or modified
2. **Yanking**: You can yank a version to hide it from new projects, but existing users can still use it
3. **Ownership**: The first publisher becomes the owner and can add other owners
4. **Name Reservation**: The crate name `llm-link` will be reserved once published
5. **Documentation**: Docs are automatically built and hosted at docs.rs

## 🔗 Useful Links

- **crates.io**: https://crates.io/
- **docs.rs**: https://docs.rs/
- **Cargo Book**: https://doc.rust-lang.org/cargo/
- **Publishing Guide**: https://doc.rust-lang.org/cargo/reference/publishing.html

## 📊 Post-Publication

After publishing:

1. Update README.md with installation instructions:
   ```markdown
   ## Installation
   
   ```bash
   cargo install llm-link
   ```
   ```

2. Announce on:
   - GitHub Releases
   - Reddit r/rust
   - Twitter/X
   - Discord communities

3. Monitor:
   - Download statistics on crates.io
   - Issues on GitHub
   - User feedback

## 🎉 Success Criteria

- [x] Package published successfully
- [ ] Visible on crates.io
- [ ] Documentation built on docs.rs
- [ ] Installation works: `cargo install llm-link`
- [ ] GitHub release created
- [ ] README updated with installation instructions

