/**
 * Fallback commit message generator
 * Provides basic commit message suggestions when API is unavailable
 */

/**
 * Generate a fallback commit message based on git diff patterns
 * @param {string} diff - The git diff string
 * @param {Object} summary - Changes summary from getChangesSummary
 * @returns {string} Generated fallback commit message in the format "Intent: Type\nMessage: Description"
 */
function generateFallbackCommit(diff, summary = {}) {
  const analysis = analyzeDiff(diff, summary);
  const intent = determineIntent(analysis, summary);
  const message = generateMessage(analysis, summary, intent);

  return `Intent: ${intent}\nMessage: ${message}`;
}

/**
 * Analyze the diff content for patterns
 * @param {string} diff - The git diff string
 * @param {Object} summary - Optional summary
 * @returns {Object} Analysis results
 */
function analyzeDiff(diff, summary = {}) {
  const lowerDiff = diff.toLowerCase();
  const lines = diff.split('\n');

  const matchesAny = (patterns, text) => patterns.some(p => p.test(text));

  // Define pattern groups
  const patterns = {
    bugFix: [/\b(fix|bug|error|issue|patch|correct|resolve)\b/i],
    testFix: [/\b(test.*fix|fix.*test)\b/i],
    refactor: [/\b(refactor|restructure|reorganize|simplify|optimize|cleanup|clean up)\b/i],
    docs: [/\b(readme|documentation|comment|doc|\.md)\b/i],
    test: [/\b(test|spec|\.test\.|\.spec\.)\b/i],
    style: [/\b(style|format|lint|prettier|indent)\b/i],
    config: [/\b(config|settings|\.json|\.yml|\.yaml|\.env)\b/i],
    dependency: [/\b(package\.json|requirements\.txt|gemfile|go\.mod)\b/i]
  };

  const additions = lines.filter(l => l.startsWith('+') && !l.startsWith('+++')).length;
  const deletions = lines.filter(l => l.startsWith('-') && !l.startsWith('---')).length;

  return {
    hasBugFix: matchesAny(patterns.bugFix, diff),
    hasTestFix: matchesAny(patterns.testFix, diff),
    hasNewFunction: /^\+.*function\s+\w+/m.test(diff) || /^\+.*const\s+\w+\s*=/m.test(diff),
    hasNewClass: /^\+.*class\s+\w+/m.test(diff),
    hasNewEndpoint: /\b(route|endpoint|api|controller)\b/i.test(diff) && /^\+/.test(diff),
    hasNewComponent: /\b(component|module|service)\b/i.test(diff) && /^\+/.test(diff),
    hasRefactor: matchesAny(patterns.refactor, diff),
    hasRename: /^\+.*\w+.*\n.*^-.*\w+/m.test(diff),
    hasMovedCode: summary?.renamed > 0,
    hasDocsChange: matchesAny(patterns.docs, diff),
    hasCommentChange: /^\+.*\/\/|^\+.*\/\*|^\+.*\*\//m.test(diff),
    hasTestChange: matchesAny(patterns.test, diff),
    hasDeletions: deletions > 0,
    hasStyleChange: matchesAny(patterns.style, diff),
    hasWhitespaceOnly: /^[+-]\s*$/m.test(diff) && !/\w/.test(diff.replace(/^[^+-]/gm, '')),
    hasConfigChange: matchesAny(patterns.config, diff),
    hasDependencyChange: matchesAny(patterns.dependency, lowerDiff),
    additions,
    deletions,
    hasChanges: additions + deletions > 0
  };
}

/**
 * Determine the commit intent type
 * @param {Object} analysis - Analysis results from analyzeDiff
 * @param {Object} summary - Changes summary
 * @returns {string} The intent type
 */
function determineIntent(analysis, summary = {}) {
  const total = summary?.total || 0;

  if (analysis.hasTestChange && !analysis.hasBugFix) return 'Test';
  if (analysis.hasDocsChange && total <= 2) return 'Documentation';
  if (analysis.hasBugFix || analysis.hasTestFix) return 'Bug Fix';
  if (analysis.hasRefactor || (analysis.hasRename && !analysis.hasNewFunction)) return 'Refactor';
  if (analysis.deletions > analysis.additions * 2 && !analysis.hasNewFunction) return 'Refactor';
  if (analysis.hasConfigChange || analysis.hasDependencyChange) return 'Chore';
  if (analysis.hasStyleChange || analysis.hasWhitespaceOnly) return 'Style';
  if (analysis.hasNewFunction || analysis.hasNewClass || analysis.hasNewComponent || analysis.hasNewEndpoint) return 'Feature';
  if (analysis.additions > analysis.deletions) return 'Feature';

  return 'Update';
}

/**
 * Generate a descriptive commit message
 * @param {Object} analysis - Analysis results
 * @param {Object} summary - Changes summary
 * @param {string} intent - The determined intent
 * @returns {string} Generated commit message
 */
function generateMessage(analysis, summary = {}, intent) {
  const fileCount = summary?.total || 0;
  const fileWord = fileCount === 1 ? 'file' : 'files';

  switch (intent) {
    case 'Bug Fix':
      return analysis.hasTestFix ? `Fix failing tests in ${fileCount} ${fileWord}` : `Fix issues in ${fileCount} ${fileWord}`;
    case 'Feature':
      if (analysis.hasNewEndpoint) return `Add new API endpoints and functionality`;
      if (analysis.hasNewComponent) return `Add new components and modules`;
      if (analysis.hasNewClass || analysis.hasNewFunction) return `Add new functionality to ${fileCount} ${fileWord}`;
      return `Implement new features in ${fileCount} ${fileWord}`;
    case 'Refactor':
      if (analysis.hasMovedCode) return `Restructure and reorganize ${fileCount} ${fileWord}`;
      if (analysis.deletions > analysis.additions * 2) return `Clean up and remove unused code from ${fileCount} ${fileWord}`;
      return `Refactor code in ${fileCount} ${fileWord}`;
    case 'Documentation':
      return fileCount === 1 ? 'Update documentation' : `Update documentation in ${fileCount} ${fileWord}`;
    case 'Test':
      return `Add/update tests in ${fileCount} ${fileWord}`;
    case 'Chore':
      if (analysis.hasDependencyChange) return 'Update dependencies';
      if (analysis.hasConfigChange) return 'Update configuration files';
      return `Update project configuration`;
    case 'Style':
      return `Format and style improvements in ${fileCount} ${fileWord}`;
    default:
      return `Update ${fileCount} ${fileWord}`;
  }
}

module.exports = {
  generateFallbackCommit,
  analyzeDiff,
  determineIntent,
  generateMessage
};
