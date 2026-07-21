import { describe, expect, it } from 'vitest';
import { checkoutContactSchema, parseForm } from './validation';

describe('checkoutContactSchema', () => {
  it('reports missing contact details clearly', () => {
    const result = parseForm(checkoutContactSchema, {
      name: '',
      email: 'not-an-email',
      phone: '',
      company: '',
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.name).toBeDefined();
      expect(result.errors.email).toBeDefined();
      expect(result.errors.phone).toBeDefined();
    }
  });
});
