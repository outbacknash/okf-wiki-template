#!/usr/bin/env node
'use strict';

/**
 * Regression suite for scripts/validator.js.
 *
 * The validator is the agent-proof guardrail for the bundle, so the guardrail
 * itself must be protected against regressions. This runs the real validator
 * (as a subprocess, exactly as CI does) against committed fixture bundles under
 * test/fixtures/ and asserts on its exit code and emitted rule ids.
 *
 * Zero dependencies. Run with `npm test`.
 */

const { execFileSync } = require('child_process');
const path = require('path');
const assert = require('assert');

const VALIDATOR = path.resolve(__dirname, '..', 'scripts', 'validator.js');
const FIXTURES = path.resolve(__dirname, 'fixtures');

function run(fixture, env) {
  return runDir(path.join(FIXTURES, fixture), env);
}

function runDir(cwd, env) {
  try {
    const out = execFileSync('node', [VALIDATOR], {
      cwd,
      encoding: 'utf8',
      env: { ...process.env, ...env },
    });
    return { code: 0, out };
  } catch (err) {
    return { code: err.status, out: `${err.stdout || ''}${err.stderr || ''}` };
  }
}

const stripAnsi = (s) => s.replace(/\x1b\[[0-9;]*m/g, '');

let failures = 0;
function check(name, fn) {
  try {
    fn();
    console.log(`ok   - ${name}`);
  } catch (err) {
    failures++;
    console.error(`FAIL - ${name}\n       ${err.message}`);
  }
}

// 1. A fully conformant bundle passes cleanly.
check('conformant bundle exits 0', () => {
  const r = run('conformant');
  assert.strictEqual(r.code, 0, `exit ${r.code}\n${stripAnsi(r.out)}`);
});
check('conformant bundle has no warnings', () => {
  const r = run('conformant');
  assert.match(stripAnsi(r.out), /0 error\(s\), 0 warning\(s\)/);
});

// 2. The violations bundle fails, and each expected rule fires.
const violations = run('violations');
check('violations bundle exits 1', () => {
  assert.strictEqual(violations.code, 1, `exit ${violations.code}`);
});
const vout = stripAnsi(violations.out);
for (const rule of [
  'index-frontmatter',
  'frontmatter-parseable',
  'type-present',
  'type-known',
  'timestamp-iso8601',
  'no-wikilinks',
]) {
  check(`violations bundle flags [${rule}]`, () => {
    assert.ok(vout.includes(`[${rule}]`), `missing [${rule}] in:\n${vout}`);
  });
}
check('unterminated frontmatter does not crash the validator', () => {
  // A crash would surface as a stack trace / non-1 exit; we require a clean exit 1.
  assert.strictEqual(violations.code, 1);
  assert.ok(!/at Object\.<anonymous>|TypeError|ReferenceError/.test(vout), vout);
});

// 3. A broken link alone is a WARNING (forward-reference stub), not an error.
check('broken-link alone passes (exit 0) and warns', () => {
  const r = run('stub-only');
  const out = stripAnsi(r.out);
  assert.strictEqual(r.code, 0, `exit ${r.code}\n${out}`);
  assert.ok(out.includes('[broken-link]'), `missing [broken-link] in:\n${out}`);
});

// 4. OKF_STRICT=1 promotes warnings to errors (hard-CI escape hatch).
check('OKF_STRICT=1 promotes the broken-link warning to a failure', () => {
  const r = run('stub-only', { OKF_STRICT: '1' });
  assert.strictEqual(r.code, 1, `expected exit 1 under strict, got ${r.code}`);
});

// 5. Every shipped recipe is itself a pristine (strict-clean) OKF bundle.
const fs = require('fs');
const recipesDir = path.resolve(__dirname, '..', 'recipes');
for (const name of fs.readdirSync(recipesDir).sort()) {
  const dir = path.join(recipesDir, name);
  if (!fs.statSync(dir).isDirectory()) continue;
  check(`recipe "${name}" is strict-clean (0 errors, 0 warnings)`, () => {
    const r = runDir(dir, { OKF_STRICT: '1' });
    assert.strictEqual(r.code, 0, `not clean:\n${stripAnsi(r.out)}`);
  });
}

console.log('');
if (failures > 0) {
  console.error(`${failures} check(s) failed.`);
  process.exit(1);
}
console.log('All validator regression checks passed.');
