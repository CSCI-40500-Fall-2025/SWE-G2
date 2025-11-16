import { validateEmail, validateSignInPassword } from '../src/utils/validation';
import log from '../src/utils/logger';

describe('Sign In Validation', () => {
  test('valid email passes', () => {
    log.info('INFO: Testing valid email for sign-in');
    const result = validateEmail('test@example.com');
    if (result.valid) {
      log.info('INFO: Valid email test passed');
    } else {
      log.error(`ERROR: Valid email test failed: ${result.error}`);
    }
    expect(result.valid).toBe(true);
  });

  test('empty email fails', () => {
    log.info('INFO: Testing empty email validation for sign-in');
    const result = validateEmail('');
    if (!result.valid) {
      log.info('INFO: Empty email test passed - correctly failed validation');
    } else {
      log.error('ERROR: Empty email test failed - should have failed validation');
    }
    expect(result.valid).toBe(false);
  });

  test('valid password passes', () => {
    log.info('INFO: Testing valid password for sign-in');
    const result = validateSignInPassword('123456');
    if (result.valid) {
      log.info('INFO: Valid password test passed');
    } else {
      log.error(`ERROR: Valid password test failed: ${result.error}`);
    }
    expect(result.valid).toBe(true);
  });

  test('short password fails', () => {
    log.info('INFO: Testing short password validation for sign-in');
    const result = validateSignInPassword('123');
    if (!result.valid) {
      log.info('INFO: Short password test passed - correctly failed validation');
    } else {
      log.error('ERROR: Short password test failed - should have failed validation');
    }
    expect(result.valid).toBe(false);
  });

  test('missing password fails', () => {
    log.info('INFO: Testing missing password validation for sign-in');
    const result = validateSignInPassword('');
    if (!result.valid) {
      log.info('INFO: Missing password test passed - correctly failed validation');
    } else {
      log.error('ERROR: Missing password test failed - should have failed validation');
    }
    expect(result.valid).toBe(false);
  });
});