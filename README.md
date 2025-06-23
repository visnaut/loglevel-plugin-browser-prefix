# loglevel-plugin-browser-prefix

A visual formatting plugin for [loglevel](https://github.com/pimterry/loglevel) that adds the logger name to colorful gradient backgrounds, making it easier to distinguish between them.

## Features

- 🎨 Prefixes `loglevel` output with the logger name on a gradient background.
- 💪🏻 Maintains original source stack trace in browser console.
- 🔄 Consistent colors across sessions (deterministic)
- ⚡ Cached color generation for performance
- 🎯 Zero external dependencies
- 🌈 Uses modern OKLCH color space for better visual quality

## Installation

```bash
npm install loglevel-plugin-browser-prefix
```

## Usage

```javascript
import log from 'loglevel';
import prefix from 'loglevel-plugin-browser-prefix';

// Apply the plugin to your logger
prefix(log, '🛠️ MyApp');

// Wrap your output with the prefix function shorthand
log.info(...log.p('Hello', 'World!'));

// Child loggers automatically inherit formatting
const loggy = log.getLogger('👧🏽 MyApp Jr.');
loggy.info(...loggy.prefix('Child logger with different colors'));
```

## API

### `loglevelBrowserPrefix(logger, rootName)`

Enhances a loglevel logger instance with visual formatting capabilities.

**Parameters:**
- `logger` - The loglevel logger instance to enhance
- `rootName` - The root logger name used for fallback identification

**Returns:** The enhanced logger with formatting capabilities

### `logger.prefix(...args)`

Formats arguments with a colored background based on the logger's name.

**Parameters:**
- `...args` - Arguments to format

**Returns:** Array of formatted arguments ready for console methods

### `.p` Shorthand

For convenience, a `.p` alias is provided for `.prefix`, so you can use `log.p(...)` as a shorter alternative.

## How It Works

The plugin generates deterministic gradient backgrounds by:
1. Hashing the logger name to create consistent colors
2. Generating two complementary hues in the OKLCH color space
3. Creating a CSS linear gradient for visual appeal
4. Caching results for performance

Each logger gets a unique color combination that remains consistent across sessions, making it easy to identify log messages from different parts of your application.

## Changelog

### 1.0.0

- Initial release
- Added colorful gradient prefixing for loglevel loggers
- Deterministic color generation and caching
- No external dependencies
- OKLCH color space
- `.prefix` and `.p` shorthand methods
- Child logger support

## License

MIT
