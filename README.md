# CommiTect – Smart Commit Name Suggestion

Automatically analyzes your code changes and suggests a clear, professional commit name (Bug Fix, Feature, Refactor, Docs, Tests) using an external backend API.

![Version](https://img.shields.io/badge/version-1.3.0-blue.svg)
![VS Code](https://img.shields.io/badge/VS%20Code-1.107.0+-green.svg)

## Screenshots & Demo

![Notification showing detected commit message](public/notification.png)
*Real-time notification*

## Features

**Manual Commit Message Generation**
- Click the status bar button or use the keyboard shortcut to analyze all repository changes
- Analyzes git diffs from staged, unstaged, and untracked files
- Predicts commit type: Bug Fix, Feature, Refactor, Risky Commit, or Documentation
- Copy commit message directly to clipboard

**Smart & Fast**
- Automatically skips binary files and ignored directories
- Works only in git repositories with changes
- Multiple workspace support

## Requirements

- VS Code 1.107.0 or higher
- Git repository (extension only works in git repos)
- Backend API endpoint running (configurable)

## Installation

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X` or `Cmd+Shift+X`)
3. Search for "CommiTect – Smart Commit Name Suggestion"
4. Click Install

## How to Use

### Three Ways to Generate Commit Messages:

1. **Keyboard Shortcut** (Recommended)
   - Press `Alt+C` from anywhere in VS Code
   
2. **Status Bar Button**
   - Click the `$(git-commit) CommiTect` button in the status bar (bottom-right)
   
3. **Command Palette**
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "CommiTect: Generate Commit Message"
   - Press Enter

### What Happens Next:

1. Extension checks for git repository and changes
2. Analyzes all changes (staged, unstaged, and untracked files)
3. Sends diff to backend API
4. Displays notification with suggested commit message
5. Click "Copy Message" or "Copy Full" to use it

## Extension Settings

Configure in VS Code settings (`File > Preferences > Settings` or `Code > Settings > Settings` on Mac):

* `commitIntentDetector.enabled` - Enable/disable the extension (default: `true`)
* `commitIntentDetector.apiUrl` - Backend API endpoint (default: `http://commitintentdetector.runasp.net/api/Commit/analyze`)
* `commitIntentDetector.timeout` - API request timeout in ms (default: `30000`)
* `commitIntentDetector.showStatusBar` - Show status bar indicator (default: `true`)
* `commitIntentDetector.allowInsecureSSL` - Allow self-signed certificates for development (default: `false`)

## Backend API Setup

The extension requires a running backend API. Your API should accept this format:

**Request:**
```json
POST /api/Commit/analyze
{
  "diff": "=== UNSTAGED CHANGES ===\n\n+ // Added a new feature\n+ function subtract(a, b) {\n+   return a - b;\n+ }\n\n=== STAGED CHANGES ===\n\n- // Old code\n+ // New code"
}
```

**Response:**
```json
{
  "intent": "Intent: Feature\nMessage: Add subtraction support to the calculator"
}
```

Supported intents: `Bug Fix`, `Feature`, `Refactor`, `Risky Commit`, `Documentation`, `Test`

## Keyboard Shortcut Customization

The default keyboard shortcut is `Alt+C`. To customize it:

1. Open Keyboard Shortcuts (`Ctrl+K Ctrl+S` or `Cmd+K Cmd+S` on Mac)
2. Search for "CommiTect: Generate Commit Message"
3. Click the pencil icon and press your desired key combination
4. Press Enter to save

## Troubleshooting

**No notifications appearing?**
- Make sure you're in a git repository
- Check that there are changes (staged, unstaged, or untracked)
- Verify `commitIntentDetector.enabled` is `true`
- Check the Output panel (View > Output > CommiTect) for errors

**"Not a Git repository" message?**
- Initialize git in your workspace: `git init`
- Or open a folder that already contains a `.git` directory

**"No changes detected" message?**
- Make sure you have modified, added, or created files
- The extension analyzes all changes, not just saved files

**SSL certificate errors?**
- For development: Enable `commitIntentDetector.allowInsecureSSL`
- For production: Use a valid SSL certificate

**API connection failed?**
- Verify the backend service is running
- Check `commitIntentDetector.apiUrl` is correct
- Test the endpoint manually with a tool like Postman or curl
- Check your firewall settings

**Changes too large error?**
- The maximum diff size is 5MB
- Consider committing changes in smaller batches
- Large binary files are automatically excluded

## Known Limitations

- Only works in git repositories
- Requires a running backend API
- Binary files are excluded from analysis
- Large diffs (>5MB) are skipped
- Maximum analysis timeout: 30 seconds (configurable)

## Privacy

This extension sends git diff content to your configured backend API for analysis. No data is sent to third parties unless you configure a third-party API endpoint.

## Support

- Report issues: [GitHub Issues](https://github.com/Mohammed-3tef/CommiTect_VSCode/issues)
- Source code: [GitHub Repository](https://github.com/Mohammed-3tef/CommiTect_VSCode)

## License

MIT License - see [LICENSE](LICENSE) file for details

---

**Enjoy better commit messages!** 🚀