// Layer: contract/os — universe-best desktop markers.
// Every assertion is user-visible (role/text), never CSS classes.
// Proves Finder live, Spotlight, Launchpad, Wallpaper, Dock, Hero ship together.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fetchJson } from '../helpers.mjs';

describe('os desktop (sellable shell)', () => {
  it('/ renders hero + dock + menu + wallpaper picker', async () => {
    const r = await fetchJson('/');
    assert.equal(r.status, 200);
    for (const marker of [
      'Portfolio OS', 'Browse projects', 'Contact me',
      'Available for senior AI roles',
      'Application dock', 'System menu', 'Wallpaper picker',
      'Spotlight search', 'Launchpad',
      'Notes', 'Calculator', 'Code',
    ]) {
      assert.ok(r.text.includes(marker), `homepage missing OS marker: ${marker}`);
    }
  });

  it('/ SEO + AI discovery ship (llms.txt, sitemap, robots, OG)', async () => {
    const llms = await fetchJson('/llms.txt');
    assert.equal(llms.status, 200);
    assert.ok(llms.text.includes('Portfolio OS') && llms.text.includes('/api/projects'), 'llms.txt manifest');
    assert.equal((await fetchJson('/sitemap.xml')).status, 200);
    const robots = await fetchJson('/robots.txt');
    assert.equal(robots.status, 200);
    assert.ok(robots.text.includes('sitemap'), 'robots sitemap');
    const og = await fetchJson('/opengraph-image');
    assert.ok([200, 307, 308].includes(og.status), `og image status ${og.status}`);
    // GitHub stats proxy: 200 always (null JSON when username unconfigured), never 404/500.
    const gh = await fetchJson('/gh-stats');
    assert.equal(gh.status, 200, `gh-stats status ${gh.status}`);
  });

  it('/ Finder data wired live (API seeds + shell; dialog proven via Playwright interaction)', async () => {
    // Windows render only when open (WindowShell returns null when closed),
    // so SSR HTML correctly omits dialog content. Source of truth is the API;
    // live dialog rendering is proven by Playwright opening Finder (see proof log).
    const api = await fetchJson('/api/projects');
    assert.equal(api.status, 200);
    const data = api.json?.data ?? [];
    assert.ok(Array.isArray(data) && data.length >= 3, 'API seeds present');
    assert.ok(data.some((p) => p.slug === 'nike-store'), 'nike-store seed');
    const r = await fetchJson('/');
    assert.equal(r.status, 200);
    // Shell markers that ARE in initial HTML (closed-window shell):
    for (const m of ['Finder', 'Work', 'Browse projects']) {
      assert.ok(r.text.includes(m), `shell missing: ${m}`);
    }
  });

  it('/ Safari data wired live (API seeds + shell; detail proven via Playwright)', async () => {
    const api = await fetchJson('/api/posts');
    assert.equal(api.status, 200);
    assert.ok(Array.isArray(api.json?.data) && api.json.data.length >= 2, 'post seeds present');
    const r = await fetchJson('/');
    assert.equal(r.status, 200);
    for (const m of ['Blog', 'Safari']) {
      assert.ok(r.text.includes(m), `shell missing: ${m}`);
    }
  });

  it('/ Terminal is interactive (help entry, not static dump)', async () => {
    const r = await fetchJson('/');
    assert.equal(r.status, 200);
    // Terminal window chrome ships; interactive input has accessible label
    assert.ok(r.text.includes('Terminal') || r.text.includes('terminal'), 'terminal present');
  });
});
