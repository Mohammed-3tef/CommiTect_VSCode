/**
 * Configuration management for the extension
 */

const vscode = require('vscode');

/**
 * Get the extension configuration
 * @returns {Object} Configuration object
 */
function getConfig() {
  const config = vscode.workspace.getConfiguration('commitIntentDetector');
  return {
    apiUrl: config.get('apiUrl', 'http://commitintentdetector.runasp.net/api/Commit/analyze'),
    timeout: config.get('timeout', 30000),
    enabled: config.get('enabled', true),
    showStatusBar: config.get('showStatusBar', true),
    allowInsecureSSL: config.get('allowInsecureSSL', false)
  };
}

module.exports = {
  getConfig
};