// Layer: contract/portfolio — projects + posts + contact.
// DB-backed with seed fallback: shapes are strict on 200, 404s are strict, never 500.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fetchJson, assertEnvelope } from '../helpers.mjs';

describe('projects', () => {
  it('GET /api/projects -> envelope array with seed rows', async () => {
    const data = assertEnvelope(await fetchJson('/api/projects'), 'projects');
    assert.ok(Array.isArray(data) && data.length >= 3, 'seed projects present');
    for (const p of data) {
      assert.equal(typeof p.slug, 'string');
      assert.equal(typeof p.title, 'string');
      assert.equal(typeof p.tagline, 'string');
      assert.ok(Array.isArray(p.tech));
    }
    assert.ok(data.some((p) => p.slug === 'nike-store'), 'nike-store seed');
  });

  it('GET /api/projects/nike-store -> single shape', async () => {
    const data = assertEnvelope(await fetchJson('/api/projects/nike-store'), 'project');
    assert.equal(data.slug, 'nike-store');
    assert.equal(typeof data.description, 'string');
  });

  it('unknown slug -> 404; illegal chars -> 404 without DB hit', async () => {
    assert.equal((await fetchJson('/api/projects/no-such-thing')).status, 404);
    assert.equal((await fetchJson('/api/projects/INVALID!!ID')).status, 404);
  });
});

describe('posts', () => {
  it('GET /api/posts -> envelope array with seed rows', async () => {
    const data = assertEnvelope(await fetchJson('/api/posts'), 'posts');
    assert.ok(Array.isArray(data) && data.length >= 2, 'seed posts present');
    assert.equal(typeof data[0].slug, 'string');
    assert.equal(typeof data[0].title, 'string');
  });

  it('unknown slug -> 404', async () => {
    assert.equal((await fetchJson('/api/posts/no-such-post')).status, 404);
  });
});

describe('contact', () => {
  it('POST /api/contact -> 200 ok (persist + enqueue, never blocks)', async () => {
    const r = await fetchJson('/api/contact', {
      method: 'POST',
      body: { name: 'Contract Test', email: 'contract@test.local', body: 'hello from the gate' },
    });
    assert.equal(r.status, 200);
    assert.equal(r.json?.data?.ok, true);
  });

  it('POST /api/contact with bad email / empty body -> 400', async () => {
    const bad = await fetchJson('/api/contact', {
      method: 'POST',
      body: { name: 'X', email: 'not-an-email', body: '' },
    });
    assert.equal(bad.status, 400);
  });
});
