# Application Support

LLM Link is designed to provide direct, built-in support for popular applications, eliminating the need for complex configuration files.

## 🎯 Design Philosophy

**Application-First Approach**: Instead of generic configuration files, LLM Link provides direct support for specific applications with optimized settings and protocols.

## 🚀 Supported Applications

### Zed Editor (`zed-dev`)
- **Protocol**: Ollama API
- **Port**: 11434
- **Features**: Code completion, chat, model switching
- **Environment**: `ZHIPU_API_KEY` or other provider keys

### Claude Code (`claude-code`)
- **Protocol**: Ollama API
- **Port**: 11434
- **Features**: Code analysis, refactoring, documentation
- **Environment**: `ANTHROPIC_API_KEY`

### Codex CLI (`codex-cli`)
- **Protocol**: Ollama API
- **Port**: 11434
- **Features**: Command-line code assistance
- **Environment**: `OPENAI_API_KEY`

## 📋 Usage

### Basic Application Mode
```bash
# Start for Zed editor
ZHIPU_API_KEY=your-key llm-link --app zed-dev

# Start for Claude Code
ANTHROPIC_API_KEY=your-key llm-link --app claude-code

# Start for Codex CLI
OPENAI_API_KEY=your-key llm-link --app codex-cli
```

### Protocol Mode (Advanced)
```bash
# Support multiple protocols
llm-link --protocols ollama,openai --api-key your-key
```

### List Available Applications
```bash
llm-link --list-apps
```

## 🔧 How It Works

### Built-in Configuration Generation
Each application has optimized settings generated in code:

```rust
// Example: Zed editor configuration
pub fn generate_zed_config(api_key: Option<&str>) -> Config {
    Config {
        server: ServerConfig {
            host: "0.0.0.0".to_string(),
            port: 11434,
            log_level: "info".to_string(),
        },
        protocols: ProtocolsConfig {
            ollama: Some(OllamaConfig {
                enabled: true,
                path: "/api".to_string(),
                // ... optimized settings
            }),
        },
        // ... provider configurations
    }
}
```

### Environment Variable Checking
LLM Link automatically checks for required environment variables:

```bash
# If missing API key:
❌ Missing required environment variables:
   - ZHIPU_API_KEY

💡 For zed-dev mode, you need:
   - ZHIPU_API_KEY: Your Zhipu API key
```

## 🚀 Benefits

### No Configuration Files
- ✅ **Zero Setup**: No YAML files to create or maintain
- ✅ **No Errors**: No configuration syntax issues
- ✅ **Always Works**: Built-in settings are tested and optimized

### Application-Optimized
- ✅ **Tailored Settings**: Each app gets optimal configuration
- ✅ **Right Protocols**: Correct API endpoints and formats
- ✅ **Performance**: Optimized for specific use cases

### Simple Deployment
- ✅ **Single Binary**: No external configuration dependencies
- ✅ **Environment-Based**: Configuration through environment variables
- ✅ **Portable**: Works anywhere without setup

## 🔄 Adding New Applications

To add support for a new application:

1. **Add to SupportedApp enum** (`src/apps.rs`):
```rust
pub enum SupportedApp {
    ZedDev,
    ClaudeCode,
    CodexCli,
    YourNewApp,  // Add here
}
```

2. **Implement configuration generator**:
```rust
fn generate_your_app_config(api_key: Option<&str>) -> Config {
    // Application-specific configuration
}
```

3. **Add environment checking**:
```rust
fn get_your_app_env_vars() -> Vec<String> {
    vec!["YOUR_API_KEY".to_string()]
}
```

## 🎯 Why No Configuration Files?

### Problems with Config Files
- **Complexity**: Users need to understand YAML syntax and structure
- **Errors**: Typos and syntax errors break functionality
- **Maintenance**: Files get out of sync with application needs
- **Deployment**: Extra files to manage and distribute

### Application-First Benefits
- **Simplicity**: Just specify the application name
- **Reliability**: Built-in configurations are tested
- **Optimization**: Settings tailored for each application
- **Maintenance**: Updates happen with code releases

## 📊 Migration from Config Files

If you were using configuration files before:

### Old Way (Removed)
```bash
# No longer supported
llm-link --config configs/zed-dev.yaml
```

### New Way (Current)
```bash
# Simple application mode
ZHIPU_API_KEY=your-key llm-link --app zed-dev
```

The new approach is simpler, more reliable, and provides better out-of-the-box experience for each supported application.
