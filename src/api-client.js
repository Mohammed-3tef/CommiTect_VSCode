/**
 * API client for commit intent detection
 */

let fetch;

/**
 * Initialize the fetch module
 * @returns {Promise<void>}
 */
async function initializeFetch() {
  if (!fetch) {
    fetch = (await import('node-fetch')).default;
  }
}

/**
 * Analyze commit intent from a git diff
 * @param {string} diff - The git diff string
 * @param {Object} config - Configuration object
 * @returns {Promise<string>} The detected commit intent
 * @throws {Error} If the API request fails
 */
async function analyzeCommitIntent(diff, config) {
  await initializeFetch();
  
  console.log('Sending diff to API:', config.apiUrl, 'Size:', diff.length);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);
    
    try {
      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ diff }),
        signal: controller.signal
      };

      // Handle insecure SSL for self-signed certificates (development only)
      if (config.allowInsecureSSL && config.apiUrl.startsWith('https://')) {
        try {
          // node-fetch v3 uses undici internally, use undici Agent to bypass SSL verification
          const { Agent } = require('undici');
          fetchOptions.agent = new Agent({
            connect: {
              rejectUnauthorized: false
            }
          });
          console.warn('WARNING: SSL certificate verification is disabled. This should only be used for development with self-signed certificates!');
        } catch {
          throw new Error('Failed to load undici module. Please run "npm install" to install dependencies.');
        }
      }

      const response = await fetch(config.apiUrl, fetchOptions);

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`API returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      if (!data || typeof data.intent !== 'string') {
        throw new Error('Invalid response format: expected { intent: string }');
      }

      return data.intent;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout: Cannot reach backend API at ${config.apiUrl} within ${config.timeout / 1000} seconds.`);
    }
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || 
        error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED') ||
        error.message.includes('ENOTFOUND')) {
      throw new Error(`Cannot reach backend API at ${config.apiUrl}. Please check if the server is running and the URL is correct.`);
    }
    if (error.message.includes('certificate') || error.message.includes('UNABLE_TO_VERIFY_LEAF_SIGNATURE') ||
        error.message.includes('unable to verify the first certificate')) {
      throw new Error(`SSL certificate verification failed. If using a self-signed certificate, enable 'commitIntentDetector.allowInsecureSSL' in settings (development only).`);
    }
    throw error;
  }
}

module.exports = {
  initializeFetch,
  analyzeCommitIntent
};
