/**
 * Manual commit message generation handler
 */

const vscode = require('vscode');
const { getConfig } = require('./config');
const { getGitRepositoryRoot, hasChanges, getAllRepositoryDiff, getChangesSummary } = require('./git-utils');
const { analyzeCommitIntent } = require('./api-client');
const { updateStatusBar, hideStatusBar } = require('./status-bar');
const { processAndDisplayIntent } = require('./intent-processor');
const { generateFallbackCommit } = require('./fallback-commit-generator');

/**
 * Handle manual trigger for commit message generation
 */
async function handleManualTrigger() {
  const config = getConfig();
  
  if (!config.enabled) {
    vscode.window.showWarningMessage('CommiTect is disabled. Enable it in settings.');
    return;
  }

  // Get the active workspace folder
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showErrorMessage('No workspace folder is open. Please open a folder or workspace.');
    return;
  }

  // Use the first workspace folder (or let user choose if multiple)
  let workspaceFolder = workspaceFolders[0];
  
  if (workspaceFolders.length > 1) {
    const selected = await vscode.window.showQuickPick(
      workspaceFolders.map(folder => ({
        label: folder.name,
        description: folder.uri.fsPath,
        folder: folder
      })),
      { placeHolder: 'Select a workspace folder to analyze' }
    );
    
    if (!selected) {
      return; // User cancelled
    }
    
    workspaceFolder = selected.folder;
  }

  const workspacePath = workspaceFolder.uri.fsPath;
  console.log('Analyzing workspace:', workspacePath);

  try {
    updateStatusBar('$(sync~spin) Checking repository...', undefined);

    // Check if it's a git repository
    const repoRoot = await getGitRepositoryRoot(workspacePath);
    if (!repoRoot) {
      vscode.window.showWarningMessage('This is not a Git repository. Initialize Git first.');
      hideStatusBar();
      return;
    }

    console.log('Git repository found:', repoRoot);

    // Check if there are any changes
    const changesExist = await hasChanges(repoRoot);
    if (!changesExist) {
      vscode.window.showInformationMessage('No changes detected in the repository. Nothing to commit!');
      hideStatusBar();
      return;
    }

    // Get changes summary for user feedback
    const summary = await getChangesSummary(repoRoot);
    console.log('Changes summary:', summary);

    updateStatusBar(`$(sync~spin) Analyzing ${summary.total} file(s)...`, undefined);

    // Get all repository changes
    const diff = await getAllRepositoryDiff(repoRoot);
    
    if (!diff || diff.trim().length === 0) {
      vscode.window.showInformationMessage('No diff content available. All changes may be binary files.');
      hideStatusBar();
      return;
    }

    console.log('Repository diff retrieved, length:', diff.length, 'characters');

    updateStatusBar('$(sync~spin) Generating commit message...', undefined);

    // Try to analyze the diff with the API, with fallback on failure
    let intent;
    let usedFallback = false;
    
    try {
      intent = await analyzeCommitIntent(diff, config);
      console.log('Detected intent from API:', intent);
    } catch (apiError) {
      console.warn('API failed, using fallback commit generator:', apiError.message);
      
      // Generate fallback commit message
      intent = generateFallbackCommit(diff, summary);
      usedFallback = true;
      
      console.log('Generated fallback intent:', intent);
      
      // Show a subtle notification that fallback was used
      vscode.window.showWarningMessage(
        'API unavailable, using local commit analysis',
        'Dismiss'
      );
    }

    // Display the result
    processAndDisplayIntent(intent, usedFallback);

  } catch (error) {
    console.error('Error generating commit message:', error);
    const errorMessage = error.message || 'Unknown error occurred';
    vscode.window.showErrorMessage(`Failed to generate commit message: ${errorMessage}`);
    hideStatusBar();
  }
}

module.exports = {
  handleManualTrigger
};