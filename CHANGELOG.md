# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.4] - 2025-10-18

### Added
- **Smart `finish_reason` correction for streaming tool_calls** 🎯
  - Automatically detects tool_calls in streaming responses
  - Corrects `finish_reason` from `"stop"` to `"tool_calls"` when tool_calls are present
  - Ensures Codex and other clients correctly execute tools instead of just displaying text
  - Preserves full streaming experience: users see both content and tool execution

### Changed
- **Updated llm-connector to 0.4.15**: Full streaming tool_calls support
  - ✅ llm-connector correctly parses streaming tool_calls from Zhipu API
  - ✅ Streaming mode now works correctly with tool messages
  - ✅ Zhipu GLM-4.6 streaming + tool messages fully functional
  - ✅ Codex workflow now works perfectly in streaming mode

### Fixed
- **Critical: `finish_reason` correction for tool_calls** 🔧
  - GLM-4.6 returns `finish_reason: "stop"` even when tool_calls are present
  - llm-link now detects tool_calls and corrects `finish_reason` to `"tool_calls"`
  - This fixes Codex not executing tools (Codex checks `finish_reason` to decide action)
  - Root cause: Codex's logic: `finish_reason == "tool_calls"` → execute tool, `== "stop"` → display text
- **Streaming tool_calls extraction**: Now correctly extracts from `choices[0].delta.tool_calls`
  - Was checking wrong field (`chunk.tool_calls` instead of `chunk.choices[0].delta.tool_calls`)
  - Now properly forwards tool_calls in streaming responses
- Streaming responses with tool messages now return complete content
- Tool calls now appear in real-time during streaming

## [0.1.3] - 2025-10-18

### Added
- **Full Tool Message Support**: Complete support for OpenAI-style tool messages workflow
  - Support for `role="tool"` messages in conversation history
  - Support for `tool_call_id` field in tool response messages
  - Support for `tool_calls` field in assistant messages
  - Enables multi-turn function calling conversations (Codex workflow)

### Changed
- **Updated llm-connector to 0.4.13**: Full tool message support
  - Message structure now includes `tool_calls` and `tool_call_id` fields
  - Role enum now includes `Tool` variant
  - Support for reasoning fields (reasoning_content, reasoning, thought, thinking)
- **Simplified message handling**: Now directly use llm-connector's Message type
  - Removed custom Message type conversion
  - Direct pass-through of tool_calls and tool messages
  - Better content extraction from various reasoning fields

### Fixed
- Tool messages now correctly passed to LLM (previously converted to user messages)
- Assistant messages with tool_calls now properly handled (content can be null)
- Content extraction now checks multiple fields (content, reasoning_content, reasoning)

## [0.1.2] - 2025-10-18

### Added
- **Tool Calls Support in Non-Streaming Responses**: Full support for tool_calls in non-streaming mode
  - Added `tool_calls` field to Response structure
  - Extract and forward tool_calls from LLM responses
  - Compatible with OpenAI tool_calls format

### Changed
- **Updated llm-connector to 0.4.12**: Includes fixes for Zhipu GLM streaming and tool calling
  - Fixed Zhipu API SSE parsing (single newline separator)
  - Fixed StreamingResponse.content population
  - Added tools and tool_choice support to ZhipuRequest
  - Added tool_calls support to ZhipuMessage

### Fixed
- Non-streaming requests now properly pass tools parameter to LLM
- Tool calls are now correctly extracted and returned in responses
- Ollama handler updated to support new service signature

## [0.1.1] - 2025-10-18

### Added
- **Provider Override Feature**: Switch between LLM providers via command-line
  - New `--provider` flag to override LLM provider (openai, anthropic, zhipu, ollama)
  - New `--model` flag to override LLM model name
  - New `--llm-api-key` flag to override provider API key
  - Support for OpenAI, Anthropic, Zhipu, and Ollama providers
  - Smart default model selection for each provider
  - See [Provider Override Documentation](docs/PROVIDER_OVERRIDE.md) for details

- **Tools/Function Calling Support**: Full support for OpenAI-style function calling
  - Tools parameter support in OpenAI API handler
  - Tools conversion from OpenAI format to llm-connector format
  - Tools propagation through service and client layers
  - Verified with Zhipu API (returns standard OpenAI format)

- **XML to JSON Conversion Enhancement**: Improved handling of Zhipu XML responses
  - Fixed streaming response parsing (handle SSE `data:` prefix)
  - Move XML function calls from `content` to `function_call` field (OpenAI standard)
  - Provider isolation - only applies to Zhipu provider
  - Comprehensive unit tests

- **Documentation**:
  - [Provider Override Guide](docs/PROVIDER_OVERRIDE.md) - Complete usage guide
  - [Quick Start Guide](docs/QUICK_START.md) - Fast reference
  - [Provider Override Feature](docs/PROVIDER_OVERRIDE_FEATURE.md) - Implementation details
  - Environment variables configuration in README
  - Organized issue tracking in `docs/issues/` directory

- **Testing**:
  - Test scripts in `tests/` directory
  - Provider override tests
  - XML conversion tests
  - Tools support tests
  - Direct Zhipu API tests

### Changed
- Updated README with provider override examples and environment variables section
- Improved Codex CLI integration guide with multiple provider options
- Enhanced CLI help messages
- Reorganized test files into `tests/` directory
- Moved logs to `logs/` directory
- Moved issue tracking documents to `docs/issues/` directory
- Cleaned up root directory (only essential files remain)

### Fixed
- Streaming response XML conversion (was not parsing SSE format correctly)
- Model name in streaming responses (was hardcoded to `gpt-3.5-turbo`)
- Content field XML handling (now moves to `function_call` field per OpenAI spec)

### Known Issues
- ~~llm-connector may not pass `tools` parameter in streaming requests~~ ✅ Fixed in llm-connector 0.4.12
- ~~Zhipu function calling requires llm-connector fix~~ ✅ Fixed in llm-connector 0.4.12
- ~~Tool messages not supported in conversation history~~ ✅ Fixed in llm-connector 0.4.13
- ~~Streaming responses with tool messages return empty content~~ ✅ Fixed in llm-connector 0.4.15
- No known issues! All major features working correctly 🎉

## [0.1.0] - 2025-10-17

### Added
- Initial release
- Application-oriented configuration system
- Support for Codex CLI, Zed.dev, Claude Code
- Multi-protocol support (OpenAI, Ollama, Anthropic APIs)
- Smart client adaptation
- XML to JSON conversion for Zhipu responses
- Built-in application configurations
- CLI-first design with helpful guidance
- Comprehensive documentation

### Features
- Zero-configuration startup for common use cases
- Automatic client detection and optimization
- Bearer token authentication
- Health check endpoints
- Model listing endpoints
- Streaming and non-streaming support

---

## Version History

- **v0.1.4** (2025-10-18) - Streaming tool messages fix, llm-connector 0.4.15 update, Codex fully working
- **v0.1.3** (2025-10-18) - Full tool message support, llm-connector 0.4.13 update, Codex workflow enabled
- **v0.1.2** (2025-10-18) - Tool calls support, llm-connector 0.4.12 update
- **v0.1.1** (2025-10-18) - Provider override, tools support, XML conversion fixes
- **v0.1.0** (2025-10-17) - Initial release

## Upgrade Guide

### From 0.1.0 to 0.1.1

No breaking changes. All existing configurations and usage patterns continue to work.

**New capabilities:**
1. You can now override provider and model via command-line
2. Function calling is now supported (pending llm-connector fix)
3. XML conversion is more robust

**Migration:**
- No migration needed
- Optionally, you can start using `--provider` and `--model` flags

**Example:**
```bash
# Before (still works)
./target/release/llm-link --app codex-cli

# After (new option)
./target/release/llm-link --app codex-cli --provider openai --model gpt-4
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

## Support

If you encounter any issues or have questions:
1. Check the [documentation](docs/)
2. Search [existing issues](https://github.com/your-repo/llm-link/issues)
3. Create a [new issue](https://github.com/your-repo/llm-link/issues/new)

---

**Note**: This changelog follows [Keep a Changelog](https://keepachangelog.com/) format.

