/**
 * Intent processing and notification utilities
 */

const vscode = require('vscode');
const { STATUS_BAR_DISPLAY_DURATION } = require('./constants');
const { updateStatusBar, resetStatusBar } = require('./status-bar');

/**
 * Parse the intent string into type and message
 * @param {string} intent - The raw intent string from API
 * @returns {{type: string, message: string}} Parsed intent with type and message
 */
function parseIntent(intent) {
  const lines = intent.split('\n');
  let intentType = '';
  let intentMessage = '';

  for (const line of lines) {
    if (line.startsWith('Intent:')) {
      intentType = line.replace('Intent:', '').trim();
    } else if (line.startsWith('Message:')) {
      intentMessage = line.replace('Message:', '').trim();
    }
  }

  return { type: intentType, message: intentMessage };
}

/**
 * Show a notification with the detected intent
 * @param {string} intentType - The intent type
 * @param {string} intentMessage - The intent message
 */
function showIntentNotification(intentType, intentMessage) {
  const fullMessage = `${intentType}: ${intentMessage}`;
  
  vscode.window.showInformationMessage(
    `${fullMessage}`, 
    'Copy Message', 
    'Copy Full'
  ).then(selection => {
    if (selection === 'Copy Message') {
      vscode.env.clipboard.writeText(intentMessage);
      vscode.window.showInformationMessage('Commit message copied to clipboard!');
    } else if (selection === 'Copy Full') {
      vscode.env.clipboard.writeText(fullMessage);
      vscode.window.showInformationMessage('Full commit message copied to clipboard!');
    }
  });
}

/**
 * Process and display the detected commit intent
 * @param {string} intent - The raw intent string from API or fallback
 * @param {boolean} usedFallback - Whether fallback generator was used
 */
function processAndDisplayIntent(intent, usedFallback = false) {
  const { type, message } = parseIntent(intent);
  
  if (type && message) {
    const displayType = usedFallback ? `${type}` : type;
    showIntentNotification(displayType, message);
    updateStatusBar(`${displayType}: ${message}`, 'commitect.generateCommitMessage');
  } else {
    // Fallback to showing raw intent if parsing fails
    const displayPrefix = usedFallback ? 'Commit Intent (Local)' : 'Commit Intent';
    showIntentNotification(displayPrefix, intent);
    updateStatusBar(`$(check) ${intent}`, 'commitect.generateCommitMessage');
  }
  
  // Reset status bar to default after delay
  setTimeout(() => {
    resetStatusBar();
  }, STATUS_BAR_DISPLAY_DURATION);
}

module.exports = {
  parseIntent,
  showIntentNotification,
  processAndDisplayIntent
};