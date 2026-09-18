import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { summarizeRepos } from './github.ts';

describe('github summarize (pure)', () => {
  it('sums stargazers, tolerates missing', () => {
    assert.equal(summarizeRepos([{ stargazers_count: 5 }, {}, { stargazers_count: 7 }]), 12);
    assert.equal(summarizeRepos([]), 0);
  });
});
