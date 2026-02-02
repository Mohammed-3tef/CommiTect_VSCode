# Changelog

All notable changes to the "CommiTect" extension will be documented in this file.

## 1.3.0 - 2024-02-02

### Added
- **Local Fallback Commit Generator**: New `fallback-commit-generator.js` module that analyzes commits locally when the API is unavailable
- Automatic pattern detection for commit types:
  - Bug fixes (detects "fix", "bug", "error", "issue" keywords)
  - Features (detects new functions, classes, components, endpoints)
  - Refactoring (detects code restructuring, renames, cleanup)
  - Documentation (detects README, comment, and doc file changes)
  - Tests (detects test file modifications)
  - Configuration changes (detects config and dependency updates)
  - Style changes (detects formatting-only changes)
- Smart analysis of git diff patterns:
  - Analyzes additions vs deletions ratio
  - Recognizes code structure changes
  - Identifies file type changes
- New commit intent types: `Chore`, `Style`, `Update`
- Visual indicator "(Local)" in notifications when fallback is used
- Warning notification when API is unavailable but local analysis succeeds
- Enhanced error handling with graceful fallback

### Changed
- `commit-handler.js`: Now includes try-catch for API calls with fallback logic
- `intent-processor.js`: Updated to accept and display fallback indicator
- `package.json`: Version bumped to 1.3.0
- README.md: Comprehensive update with fallback feature documentation
- Improved user experience during network failures

### Fixed
- Extension no longer shows error messages when API is temporarily unavailable
- Commit suggestions always provided, even in offline scenarios
- Better error messages distinguishing between API failures and other errors

### Technical Details
- `generateFallbackCommit()` function analyzes git diffs using pattern matching
- Examines 15+ different code patterns to determine commit intent
- Considers file count, change ratios, and keyword presence
- Returns formatted intent string compatible with existing display logic
- Zero external dependencies for fallback functionality

## 1.2.1 - 2024-01-22

### Fixed
- SSL certificate handling improvements
- Bug fixes and stability improvements

## 1.2.0 - 2024-01-21

### Added
- Manual trigger support via keyboard shortcut (Shift+C)
- Status bar button for easy access
- Command palette integration

### Changed
- Enhanced diff analysis capabilities
- Configuration improvements

## 1.1.0 - 2023-01-07

### Added
- Initial release with basic commit message generation
- Backend API integration
- Git repository detection
- Staged and unstaged changes analysis
