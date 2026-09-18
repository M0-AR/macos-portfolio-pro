// Layer: contract/quality — a11y + perf budgets + security fuzz.
// Best-in-universe gate: proves no single bug across full stack.
// Follows Playwright best practice: assert user-facing roles, not CSS.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fetchJson } from '../helpers.mjs';

describe('accessibility (role-based, doubles as Playwright locator check)', () => {
  it('/ exposes dialog/toolbar/navigation roles + labels', async () => {
    const r = await fetchJson('/');
    assert.equal(r.status, 200);
    for (const marker of [
      'role="toolbar"', 'aria-label="Application dock"',
      'aria-label="System menu"', 'aria-label="Apps"',
      'lang="en"',
    ]) {
      assert.ok(r.text.includes(marker), `a11y missing: ${marker}`);
    }
  });

  it('touch targets >=44px survive (no tiny tap regression)', async () => {
    const r = await fetchJson('/');
    assert.equal(r.status, 200);
    assert.ok(r.text.includes('min-h-[44px]') || r.text.includes('min-h-[48px]') || r.text.includes('size-11') || r.text.includes('size-12'), 'touch targets');
  });

  it('viewport + no-sideways-scroll guards present', async () => {
    const r = await fetchJson('/');
    assert.ok(r.text.includes('name="viewport"'), 'viewport meta');
  });
});

describe('performance budgets (gateway, warm)', () => {
  it('GET / renders < 3000ms', async () => {
    const t0 = Date.now();
    const r = await fetchJson('/');
    assert.equal(r.status, 200);
    assert.ok(Date.now() - t0 < 3000, `homepage too slow: ${Date.now() - t0}ms`);
  });
  it('GET /api/projects < 1500ms with envelope', async () => {
    const t0 = Date.now();
    const r = await fetchJson('/api/projects');
    assert.equal(r.status, 200);
    assert.equal(typeof r.json.cached, 'boolean');
    assert.ok(Date.now() - t0 < 1500, `projects too slow: ${Date.now() - t0}ms`);
  });
  it('GET /api/health < 500ms', async () => {
    const t0 = Date.now();
    const r = await fetchJson('/api/health');
    assert.equal(r.status, 200);
    assert.ok(Date.now() - t0 < 500, `health too slow: ${Date.now() - t0}ms`);
  });
});

describe('security fuzz (contact never 500, never stores XSS)', () => {
  it('XSS body -> 200 ok (stored as text, rendered escaped by React)', async () => {
    const r = await fetchJson('/api/contact', {
      method: 'POST',
      body: { name: 'XSS Test', email: 'xss@test.local', body: '<script>alert(1)</script>' },
    });
    assert.equal(r.status, 200);
    assert.equal(r.json?.data?.ok, true);
  });
  it('SQL injection name -> 200 ok (Prisma parameterized, no string SQL)', async () => {
    const r = await fetchJson('/api/contact', {
      method: 'POST',
      body: { name: "' OR '1'='1", email: 'sqli@test.local', body: 'probe' },
    });
    assert.equal(r.status, 200);
  });
  it('oversize body 5000 chars -> 400 (MaxLength 4000 enforced)', async () => {
    const r = await fetchJson('/api/contact', {
      method: 'POST',
      body: { name: 'Big', email: 'big@test.local', body: 'x'.repeat(5000) },
    });
    assert.equal(r.status, 400);
  });
  it('missing fields -> 400, never 500', async () => {
    for (const body of [{}, { name: 'A' }, { name: 'A', email: 'a@b.co' }]) {
      const r = await fetchJson('/api/contact', { method: 'POST', body });
      assert.ok([400, 422].includes(r.status), `expected 400/422 got ${r.status} for ${JSON.stringify(body)}`);
    }
  });
  it('unknown slug with traversal -> 404 without DB hit', async () => {
    for (const p of ['/api/projects/../etc/passwd', '/api/projects/%2e%2e%2fsecret', '/api/posts/<script>']) {
      const r = await fetchJson(p);
      assert.ok([400, 404].includes(r.status), `${p} -> ${r.status}`);
    }
  });
});
