import { camelCase, sanitizeFileName } from './naming';

describe('naming helpers', () => {
  describe('camelCase', () => {
    it('should convert to camelCase', () => {
      expect(camelCase('hello world')).toBe('helloWorld');
      expect(camelCase('HELLO_world-test')).toBe('helloWorldTest');
    });
  });

  describe('sanitizeFileName', () => {
    it('should produce kebab-case', () => {
      expect(sanitizeFileName('My Cool Utility')).toBe('my-cool-utility');
      expect(sanitizeFileName('UPPER_case_123')).toBe('upper-case-123');
    });
  });
});
