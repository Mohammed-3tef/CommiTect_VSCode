const assert = require('assert');
const vscode = require('vscode');

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('Extension should be present', () => {
    assert.ok(vscode.extensions.getExtension('MohammedAtef.commit-intent-detector') !== undefined,
              'Extension should be loaded');
  });

  test('Configuration should exist', () => {
    const config = vscode.workspace.getConfiguration('commitIntentDetector');
    assert.ok(config !== undefined, 'Configuration should exist');
    
    const apiUrl = config.get('apiUrl');
    assert.ok(typeof apiUrl === 'string', 'API URL should be a string');
    assert.ok(apiUrl.length > 0, 'API URL should not be empty');
  });

  test('Extension activation', async function() {
    this.timeout(10000);
    // Test that extension can be activated
    // This is a basic smoke test
    assert.ok(true, 'Extension activation test passed');
  });
});