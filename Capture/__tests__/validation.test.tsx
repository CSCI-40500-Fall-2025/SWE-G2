import {
  validateEmail,
  validatePassword,
  validateUsername,
  validateConfirmPassword,
} from '../src/utils/validation';
import log from '../src/utils/logger';

describe('Validation Functions', () => {
  test('validates a correct email', () => {
    log.info('INFO: Testing valid email format');
    const result = validateEmail('user@example.com');
    if (result.valid) {
      log.info('INFO: Valid email test passed');
    } else {
      log.error(`ERROR: Valid email test failed: ${result.error}`);
    }
    expect(result.valid).toBe(true);
  });

  test('rejects invalid email format', () => {
    log.info('INFO: Testing invalid email format rejection');
    const result = validateEmail('userexample');
    if (!result.valid) {
      log.info('INFO: Invalid email test passed - correctly rejected');
    } else {
      log.error('ERROR: Invalid email test failed - should have been rejected');
    }
    expect(result.valid).toBe(false);
  });

  test('empty username fails', () => {
    log.info('INFO: Testing empty username validation');
    const result = validateUsername('');
    if (!result.valid) {
      log.info('INFO: Empty username test passed - correctly failed');
    } else {
      log.error('ERROR: Empty username test failed - should have failed');
    }
    expect(result.valid).toBe(false);
  });

  test('valid username passes', () => {
    log.info('INFO: Testing valid username format');
    const result = validateUsername('abc123');
    if (result.valid) {
      log.info('INFO: Valid username test passed');
    } else {
      log.error(`ERROR: Valid username test failed: ${result.error}`);
    }
    expect(result.valid).toBe(true);
  });

  test('rejects short password', () => {
    log.info('INFO: Testing short password rejection');
    const result = validatePassword('Ab1!');
    if (!result.valid) {
      log.info('INFO: Short password test passed - correctly rejected');
    } else {
      log.error('ERROR: Short password test failed - should have been rejected');
    }
    expect(result.valid).toBe(false);
  });

  test('accepts strong password', () => {
    log.info('INFO: Testing strong password acceptance');
    const result = validatePassword('Abcdef1!');
    if (result.valid) {
      log.info('INFO: Strong password test passed');
    } else {
      log.error(`ERROR: Strong password test failed: ${result.error}`);
    }
    expect(result.valid).toBe(true);
  });

  test('rejects non-matching confirm password', () => {
    log.info('INFO: Testing password mismatch validation');
    const result = validateConfirmPassword('Password1!', 'Password2!');
    if (!result.valid) {
      log.info('INFO: Password mismatch test passed - correctly rejected');
    } else {
      log.error('ERROR: Password mismatch test failed - should have been rejected');
    }
    expect(result.valid).toBe(false);
  });
});