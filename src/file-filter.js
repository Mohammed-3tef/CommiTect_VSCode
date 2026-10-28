/**
 * File filtering utilities
 */

const path = require('path');
const { BINARY_FILE_EXTENSIONS, IGNORE_PATTERNS } = require('./constants');

/**
 * Check if a file should be processed
 * @param {string} filePath - The file path to check
 * @returns {boolean} True if the file should be processed
 */
function shouldProcessFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  
  // Skip binary files
  if (BINARY_FILE_EXTENSIONS.has(ext)) {
    console.log('Skipping binary file:', filePath);
    return false;
  }

  // Skip files in node_modules, .git, and other common ignore directories
  const normalizedPath = filePath.replace(/\\/g, '/');
  
  if (IGNORE_PATTERNS.some(pattern => {
    const relativePattern = pattern.startsWith('/') ? pattern.slice(1) : pattern;
    return normalizedPath.includes(pattern) || normalizedPath.startsWith(relativePattern);
  })) {
    console.log('Skipping ignored directory:', filePath);
    return false;
  }

  return true;
}

module.exports = {
  shouldProcessFile
};
