// src/utils/logger.js
import { logger } from 'react-native-logs';
import * as Sentry from '@sentry/react-native';

class SentryTransport {
  log(level, message, additionalData = {}) {
    // Don't send debug logs to Sentry - omits CI logs from monitoring
    if (level === 'debug') return;
    
    switch(level) {
      case 'fatal':
        Sentry.captureException(new Error(message), {
          tags: { type: 'fatal' },
          extra: additionalData
        });
        break;
      case 'error':
        Sentry.captureException(new Error(message), {
          tags: { type: 'error' },
          extra: additionalData
        });
        break;
      case 'warn':
        Sentry.captureMessage(message, {
          level: 'warning',
          extra: additionalData
        });
        break;
      case 'info':
        // Info logs don't go to Sentry
        break;
    }
  }
}

const config = {
  levels: {
    fatal: 0,    // 5x required
    error: 1,    // 10x required  
    warn: 2,     // 20x required
    info: 3,     // 20x required
    debug: 4     // 10x required - your "fine" level for CI
  },
  // ✅ CI gets ALL logs (lowest level - debug)
  // ✅ Production gets only warnings and above
  severity: process.env.CI ? 'debug' : 'warn',
  transport: [console, new SentryTransport()],
  transportOptions: {
    colors: {
      fatal: 'red',
      error: 'red',
      warn: 'yellow',
      info: 'blue',
      debug: 'gray'  // Your "fine" level
    }
  }
};

const log = logger.createLogger(config);

export default log;