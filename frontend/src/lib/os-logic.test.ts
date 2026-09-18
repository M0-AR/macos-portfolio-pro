import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseTerminalCommand, filterSpotlight, TERMINAL_HELP } from './os-logic.ts';

describe('terminal parser (real user behavior)', () => {
  it('help lists all commands', () => {
    const out = parseTerminalCommand('help');
    assert.equal(out.length, 1);
    assert.equal((out[0] as { text: string }).text, TERMINAL_HELP);
  });
  it('empty input is no-op', () => {
    assert.deepEqual(parseTerminalCommand('   '), []);
  });
  it('open valid app returns open action', () => {
    assert.deepEqual(parseTerminalCommand('open finder'), [{ kind: 'open', app: 'finder' }]);
    assert.deepEqual(parseTerminalCommand('OPEN Safari'), [{ kind: 'open', app: 'safari' }]);
    assert.deepEqual(parseTerminalCommand('open notes'), [{ kind: 'open', app: 'notes' }]);
    assert.deepEqual(parseTerminalCommand('open calc'), [{ kind: 'open', app: 'calc' }]);
    assert.deepEqual(parseTerminalCommand('open vscode'), [{ kind: 'open', app: 'vscode' }]);
  });
  it('open unknown app is err, never throws', () => {
    const out = parseTerminalCommand('open calculator') as { tone: string }[];
    assert.equal(out[0].tone, 'err');
  });
  it('unknown command is err with help hint', () => {
    const out = parseTerminalCommand('sudo rm -rf /') as { text: string; tone: string }[];
    assert.equal(out[0].tone, 'err');
    assert.match(out[0].text, /help/);
  });
  it('clear returns clear action', () => {
    assert.deepEqual(parseTerminalCommand('clear'), [{ kind: 'clear' }]);
  });
  it('whoami/skills/projects/github/date print', () => {
    for (const c of ['whoami', 'skills', 'projects', 'github', 'date']) {
      const out = parseTerminalCommand(c) as { kind: string }[];
      assert.equal(out[0].kind, 'print', c);
    }
  });
});

describe('spotlight filter (real user behavior)', () => {
  const apps = [
    { key: 'finder', label: 'Projects — Finder', hint: 'Browse', kind: 'app' as const },
    { key: 'safari', label: 'Blog — Safari', hint: 'Read', kind: 'app' as const },
  ];
  const projects = [{ title: 'Nike Store', tagline: 'Headless commerce', tech: ['Next.js'], slug: 'nike-store' }];
  const posts = [{ title: 'Shipping Next.js', excerpt: 'Dark mode guide' }];
  it('empty query returns apps', () => {
    assert.deepEqual(filterSpotlight('', apps, projects, posts), apps);
  });
  it('matches project by tech', () => {
    const r = filterSpotlight('next.js', apps, projects, posts);
    assert.ok(r.some((x) => x.kind === 'project' && x.slug === 'nike-store'));
  });
  it('matches post by title', () => {
    const r = filterSpotlight('shipping', apps, projects, posts);
    assert.ok(r.some((x) => x.kind === 'post'));
  });
  it('caps at 9 results', () => {
    const many = Array.from({ length: 20 }, (_, i) => ({ key: 'finder', label: `App ${i}`, hint: '', kind: 'app' as const }));
    assert.ok(filterSpotlight('app', many, [], []).length <= 9);
  });
  it('no match returns empty, never throws', () => {
    assert.deepEqual(filterSpotlight('zzz-no-match', apps, [], []), []);
  });
});
