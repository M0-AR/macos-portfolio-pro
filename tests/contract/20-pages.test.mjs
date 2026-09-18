// Layer: contract/pages — server-rendered HTML markers per route.
// Asserts on user-visible outcomes, never on CSS classes.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fetchJson } from '../helpers.mjs';

describe('pages', () => {
  it('/ renders desktop shell (title, viewport, key entry points)', async () => {
    const r = await fetchJson('/');
    assert.equal(r.status, 200);
    for (const marker of [
      '<title>', 'Portfolio OS', 'name="viewport"', 'Browse projects', 'Projects', 'Blog', 'Contact',
    ]) {
      assert.ok(r.text.includes(marker), `homepage missing: ${marker}`);
    }
  });

  it('/ serves the same core content markers for crawlers (SEO shell)', async () => {
    const r = await fetchJson('/');
    assert.equal(r.status, 200);
    assert.ok(r.text.includes('application/ld+json'), 'JSON-LD structured data');
  });

  it('/robots.txt + /sitemap.xml exist', async () => {
    assert.equal((await fetchJson('/robots.txt')).status, 200);
    assert.equal((await fetchJson('/sitemap.xml')).status, 200);
  });

  it('/does-not-exist renders branded 404', async () => {
    const r = await fetchJson('/does-not-exist');
    assert.equal(r.status, 404);
    assert.ok(r.text.includes('Nothing at this address'));
  });
});
