// src/utils/logger.js
import { logger } from "react-native-logs";
import * as Sentry from '@sentry/react-native';

// Create a proper transport FUNCTION
const SentryTransport = (props) => {
  const { level, rawMsg } = props;
  
  // Get the message from rawMsg array
  const message = Array.isArray(rawMsg) ? rawMsg[0] : rawMsg;
  console.log(`[${level?.text?.toUpperCase()}] ${message}`);

  // Map levels to Sentry
  switch(level?.text) {
    case 'debug':
      Sentry.captureMessage(message, 'debug');
      break;
    case 'info':
      Sentry.captureMessage(message, 'info');
      break;
    case 'warn':
      Sentry.captureMessage(message, 'warning');
      break;
    case 'error':
      Sentry.captureMessage(message, 'error');
      break;
    case 'fatal':
      Sentry.captureMessage(message, 'fatal');
      break;
  }
};

const config = {
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    fatal: 4
  },
  severity: 'debug', // Show all levels
  transport: SentryTransport, // Function, not object
  enabled: true
};

const log = logger.createLogger(config);

export default log;