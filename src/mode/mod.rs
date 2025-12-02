use clap::ValueEnum;
use std::fmt;

#[derive(Debug, Clone, Copy, PartialEq, Eq, ValueEnum)]
pub enum RunMode {
    /// Single provider mode with YAML config (traditional)
    Single,
    /// Multi-provider mode with database and web interface
    Multi,
}

impl Default for RunMode {
    fn default() -> Self {
        Self::Multi  // Default to multi-mode for better UX
    }
}

impl fmt::Display for RunMode {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            RunMode::Single => write!(f, "single"),
            RunMode::Multi => write!(f, "multi"),
        }
    }
}

impl RunMode {
    #[allow(dead_code)] // Will be used in Phase 2 mode-specific logic
    pub fn is_single(&self) -> bool {
        matches!(self, RunMode::Single)
    }

    #[allow(dead_code)] // Will be used in Phase 2 mode-specific logic
    pub fn is_multi(&self) -> bool {
        matches!(self, RunMode::Multi)
    }
}
