import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isValidSlug, normalizeSlug } from './slug.util.ts';

describe('slug allow-list', () => {
  it('accepts normal slugs', () => {
    assert.equal(isValidSlug('nike-store'), true);
    assert.equal(isValidSlug('Shipping-Nextjs-16'), true);
  });
  it('rejects injection / bad input', () => {
    assert.equal(isValidSlug('INVALID!!ID'), false);
    assert.equal(isValidSlug('../etc/passwd'), false);
    assert.equal(isValidSlug('a'), false);
    assert.equal(isValidSlug(''), false);
    assert.equal(isValidSlug(undefined), false);
    assert.equal(isValidSlug(42), false);
  });
  it('normalizes case for lookups', () => {
    assert.equal(normalizeSlug('Nike-Store'), 'nike-store');
  });
});
