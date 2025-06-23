// Cache gradient strings to avoid recalculating colors for the same logger names
const bgMap = new Map();

/**
 * Generates two deterministic hue values from a string using a hash function.
 * This ensures consistent colors for the same logger names across sessions.
 *
 * @param {string} str - The string to hash (typically a logger name)
 * @returns {{hue1: number, hue2: number}} Two hue values for gradient generation
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Ensure 32-bit integer to prevent overflow issues
  }

  // Use modulo to constrain hue to valid CSS degree range
  const hue1 = Math.abs(hash) % 361;

  // Use different bits to generate independent offset value
  const offset = (Math.abs(hash >> 8) % 9) + 2;

  // Create second hue with sufficient separation for visual distinction
  const hue2 = (hue1 + (offset * 30)) % 360;

  return { hue1, hue2 };
}

/**
 * Retrieves or generates a CSS gradient background for a logger identifier.
 * Uses caching to prevent expensive color calculations for repeated calls.
 *
 * @param {string} id - The logger identifier (name) to generate colors for
 * @returns {string} CSS linear-gradient string for styling console output
 */
function getBackground(id) {
  if (bgMap.has(id)) {
    return bgMap.get(id);
  }

  const { hue1, hue2 } = hashString(id);

  // Generate OKLCH colors with good lightness and chroma values for readability
  const color1 = `oklch(0.6 0.2 ${hue1})`;
  const color2 = `oklch(0.6 0.2 ${hue2})`;

  const bg = `linear-gradient(90deg, ${color1}, ${color2})`;

  bgMap.set(id, bg);
  return bg;
}

/**
 * loglevel plugin that adds visual formatting to console output with colored backgrounds.
 * Each logger gets a unique gradient background based on its name for easy identification.
 *
 * @param {Object} logger - The loglevel logger instance to enhance
 * @param {string} rootName - The root logger name used for fallback identification
 * @returns {Object} The enhanced logger with formatting capabilities
 */
export default function loglevelBrowserPrefix(logger, rootName) {
  // Add a format method to the logger instance
  logger.prefix = function (...args) {
    const id = logger.name || rootName;
    return [
      `%c${id}`,
      `background: ${getBackground(id)}; color: #fff; font-weight: bold; padding: 2px 4px; border-radius: 2px;`,
      ...args,
    ];
  };

  logger.p = logger.prefix; // Alias for convenience

  // Preserve a reference to the original getLogger method
  const defaultGetLogger = logger.getLogger;

  // Override the getLogger method to apply formatting recursively
  logger.getLogger = function (name) {
    const newLogger = defaultGetLogger.call(logger, name);
    // Recursively apply formatting to child loggers to maintain consistent styling
    loglevelBrowserPrefix(newLogger, rootName);
    return newLogger;
  };

  // Return the enhanced logger to enable method chaining and proper plugin composition
  return logger;
}
