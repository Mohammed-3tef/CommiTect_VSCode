/**
 * Constants used throughout the extension
 */

/**
 * Maximum size of git diff in bytes (5MB)
 */
const MAX_DIFF_SIZE = 5 * 1024 * 1024;

/**
 * Default debounce delay in milliseconds
 */
const DEBOUNCE_DELAY = 1000;

/**
 * Binary file extensions that should be skipped
 */
const BINARY_FILE_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.ico', '.svg',
  '.pdf', '.zip', '.tar', '.gz', '.7z', '.rar',
  '.exe', '.dll', '.so', '.dylib',
  '.mp3', '.mp4', '.avi', '.mov', '.wmv',
  '.woff', '.woff2', '.ttf', '.eot',
  '.bin', '.dat', '.db', '.sqlite'
]);

/**
 * Directory patterns that should be ignored
 */
const IGNORE_PATTERNS = [
  '/node_modules/',
  '/.git/',
  '/.vscode/',
  '/dist/',
  '/build/',
  '/.next/',
  '/coverage/',
  '/.nyc_output/'
];

/**
 * Git command timeout in milliseconds
 */
const GIT_COMMAND_TIMEOUT = 5000;

/**
 * Status bar display duration after showing result (milliseconds)
 */
const STATUS_BAR_DISPLAY_DURATION = 3000;

module.exports = {
  MAX_DIFF_SIZE,
  DEBOUNCE_DELAY,
  BINARY_FILE_EXTENSIONS,
  IGNORE_PATTERNS,
  GIT_COMMAND_TIMEOUT,
  STATUS_BAR_DISPLAY_DURATION
};
