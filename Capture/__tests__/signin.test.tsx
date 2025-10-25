import { validateEmail, validateSignInPassword } from '../src/utils/validation';

describe('Sign In Validation', () => {
  test('valid email passes', () => {
    const result = validateEmail('test@example.com');
    expect(result.valid).toBe(true);
  });

  test('empty email fails', () => {
    const result = validateEmail('');
    expect(result.valid).toBe(false);
  });

  test('valid password passes', () => {
    const result = validateSignInPassword('123456');
    expect(result.valid).toBe(true);
  });

  test('short password fails', () => {
    const result = validateSignInPassword('123');
    expect(result.valid).toBe(false);
  });

  test('missing password fails', () => {
    const result = validateSignInPassword('');
    expect(result.valid).toBe(false);
  });
});
