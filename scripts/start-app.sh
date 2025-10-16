#!/bin/bash

# LLM Link Application Launcher
# Simplified launcher for supported applications

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to show usage
show_usage() {
    echo "LLM Link Application Launcher"
    echo ""
    echo "Usage: $0 <app> [options]"
    echo ""
    echo "Supported applications:"
    echo "  codex-cli    - GitHub Codex CLI (port 8088)"
    echo "  zed-dev      - Zed.dev editor (port 11434)"
    echo "  claude-code  - Claude Code (port 8089)"
    echo "  dual         - Both OpenAI and Ollama (port 11434)"
    echo ""
    echo "Options:"
    echo "  --help, -h   - Show this help message"
    echo "  --info       - Show application information"
    echo "  --check-env  - Check required environment variables"
    echo ""
    echo "Examples:"
    echo "  $0 codex-cli"
    echo "  $0 zed-dev --info"
    echo "  $0 claude-code --check-env"
}

# Function to show app info
show_app_info() {
    local app=$1
    
    case $app in
        "codex-cli")
            echo "📱 Codex CLI Configuration"
            echo "   Description: GitHub Codex CLI tool for AI-powered coding assistance"
            echo "   Port: 8088"
            echo "   Protocol: OpenAI API"
            echo "   Endpoints: /v1/chat/completions, /v1/models"
            echo "   Auth: Required (Bearer Token)"
            echo "   Env Vars: ZHIPU_API_KEY, LLM_LINK_API_KEY"
            echo ""
            echo "   Usage example:"
            echo "   codex --profile glm_4_flash \"Write a Python function\""
            ;;
        "zed-dev")
            echo "🎨 Zed.dev Configuration"
            echo "   Description: Zed editor with AI assistant integration"
            echo "   Port: 11434"
            echo "   Protocol: Ollama API"
            echo "   Endpoints: /api/chat, /api/tags"
            echo "   Auth: Not required"
            echo "   Env Vars: ZHIPU_API_KEY"
            echo ""
            echo "   Zed settings.json:"
            echo "   \"language_models\": {"
            echo "     \"llm-link\": {"
            echo "       \"api_url\": \"http://localhost:11434\""
            echo "     }"
            echo "   }"
            ;;
        "claude-code")
            echo "🤖 Claude Code Configuration"
            echo "   Description: Anthropic Claude for code generation and analysis"
            echo "   Port: 8089"
            echo "   Protocol: Anthropic API"
            echo "   Endpoints: /anthropic/messages, /anthropic/models"
            echo "   Auth: Required (API Key)"
            echo "   Env Vars: ZHIPU_API_KEY, ANTHROPIC_API_KEY"
            echo ""
            echo "   Usage example:"
            echo "   claude-code --model claude-3 \"Analyze this code\""
            ;;
        "dual")
            echo "🔄 Dual Protocol Configuration"
            echo "   Description: Both OpenAI and Ollama APIs"
            echo "   Port: 11434"
            echo "   Protocol: OpenAI + Ollama"
            echo "   Auth: Mixed (OpenAI requires auth, Ollama doesn't)"
            echo "   Env Vars: ZHIPU_API_KEY, LLM_LINK_API_KEY"
            ;;
        *)
            print_error "Unknown application: $app"
            return 1
            ;;
    esac
}

# Function to check environment variables
check_env_vars() {
    local app=$1
    local missing_vars=()
    
    # Always check ZHIPU_API_KEY
    if [[ -z "${ZHIPU_API_KEY}" ]]; then
        missing_vars+=("ZHIPU_API_KEY")
    fi
    
    # Check app-specific vars
    case $app in
        "codex-cli"|"dual")
            if [[ -z "${LLM_LINK_API_KEY}" ]]; then
                missing_vars+=("LLM_LINK_API_KEY")
            fi
            ;;
        "claude-code")
            if [[ -z "${ANTHROPIC_API_KEY}" ]]; then
                missing_vars+=("ANTHROPIC_API_KEY")
            fi
            ;;
    esac
    
    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        print_error "Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        echo ""
        echo "Please set these variables before starting the application."
        return 1
    else
        print_success "All required environment variables are set"
        return 0
    fi
}

# Function to get config file for app
get_config_file() {
    local app=$1
    
    case $app in
        "codex-cli")
            echo "$PROJECT_ROOT/configs/codex-cli.yaml"
            ;;
        "zed-dev")
            echo "$PROJECT_ROOT/configs/zed-dev.yaml"
            ;;
        "claude-code")
            echo "$PROJECT_ROOT/configs/claude-code.yaml"
            ;;
        "dual")
            echo "$PROJECT_ROOT/configs/config-dual-protocol.yaml"
            ;;
        *)
            print_error "Unknown application: $app"
            return 1
            ;;
    esac
}

# Main function
main() {
    local app=""
    local show_info=false
    local check_env=false
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --help|-h)
                show_usage
                exit 0
                ;;
            --info)
                show_info=true
                shift
                ;;
            --check-env)
                check_env=true
                shift
                ;;
            *)
                if [[ -z "$app" ]]; then
                    app=$1
                else
                    print_error "Unknown option: $1"
                    show_usage
                    exit 1
                fi
                shift
                ;;
        esac
    done
    
    # Check if app is provided
    if [[ -z "$app" ]]; then
        print_error "No application specified"
        show_usage
        exit 1
    fi
    
    # Show info if requested
    if [[ "$show_info" == true ]]; then
        show_app_info "$app"
        exit 0
    fi
    
    # Check environment variables if requested
    if [[ "$check_env" == true ]]; then
        check_env_vars "$app"
        exit $?
    fi
    
    # Get config file
    config_file=$(get_config_file "$app")
    if [[ $? -ne 0 ]]; then
        exit 1
    fi
    
    # Check if config file exists
    if [[ ! -f "$config_file" ]]; then
        print_error "Configuration file not found: $config_file"
        exit 1
    fi
    
    # Check environment variables
    if ! check_env_vars "$app"; then
        exit 1
    fi
    
    # Check if binary exists
    binary_path="$PROJECT_ROOT/target/release/llm-link"
    if [[ ! -f "$binary_path" ]]; then
        print_error "LLM Link binary not found: $binary_path"
        print_info "Please build the project first: cargo build --release"
        exit 1
    fi
    
    # Start the application
    print_info "Starting LLM Link for $app..."
    print_info "Configuration: $config_file"
    show_app_info "$app"
    echo ""
    
    # Execute the binary
    exec "$binary_path" --config "$config_file"
}

# Run main function
main "$@"
