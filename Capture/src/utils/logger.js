// src/utils/logger.js
import { logger } from 'react-native-logs';
import * as Sentry from '@sentry/react-native';

// Create a proper transport object
const SentryTransport = {
  log: (level, message, additionalData = {}) => {
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
};

const config = {
  levels: {
    fatal: 0,
    error: 1,  
    warn: 2,
    info: 3,
    debug: 4
  },
  severity: process.env.CI ? 'debug' : 'warn',
  transport: SentryTransport, // Use the object directly, not in array
  transportOptions: {
    colors: {
      fatal: 'red',
      error: 'red',
      warn: 'yellow',
      info: 'blue',
      debug: 'gray'
    }
  }
};

const log = logger.createLogger(config);

export default log;