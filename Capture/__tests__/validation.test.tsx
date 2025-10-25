import {
    validateEmail,
    validatePassword,
    validateUsername,
    validateConfirmPassword,
  } from '../src/utils/validation';
  
  describe('Validation Functions', () => {
    test('validates a correct email', () => {
      const result = validateEmail('user@example.com');
      expect(result.valid).toBe(true);
    });
  
    test('rejects invalid email format', () => {
      const result = validateEmail('userexample');
      expect(result.valid).toBe(false);
    });
  
    test('empty username fails', () => {
        const result = validateUsername('');
        expect(result.valid).toBe(false);
      });

    test('valid username passes', () => {
        const result = validateUsername('abc123');
        expect(result.valid).toBe(true);
      });
    test('rejects short password', () => {
      const result = validatePassword('Ab1!');
      expect(result.valid).toBe(false);
    });
  
    test('accepts strong password', () => {
      const result = validatePassword('Abcdef1!');
      expect(result.valid).toBe(true);
    });
  
    test('rejects non-matching confirm password', () => {
      const result = validateConfirmPassword('Password1!', 'Password2!');
      expect(result.valid).toBe(false);
    });
  });
  