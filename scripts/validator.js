#!/usr/bin/env node
'use strict';

/**
 * OKF v0.1 bundle validator.
 *
 * Two tiers, never conflated:
 *
 *   CONFORMANCE (OKF v0.1 spec, §-references below) -> default `error`.
 *     These are the spec's own conformance criteria. Violating them produces a
 *     non-conformant bundle.
 *
 *   HOUSE STYLE (stricter than the spec) -> default `warn`.
 *     Drift signals for a human curator. The spec is deliberately permissive
 *     (consumers MUST tolerate broken links and unknown types; only `type` is
 *     required), so these never fail CI unless a producer opts in.
 *
 * Severity per rule is configured in okf.config.json. Set OKF_STRICT=1 to
 * promote every `warn` rule to `error` (the `validate:strict` script).
 *
 * Spec: https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// --- Configuration -------------------------------------------------------

const DEFAULT_CONFIG = {
  bundleRoot: '.',
  ignore: [
    'node_modules/**',
    '.git/**',
    'templates/**',
    'README.md',
    'CONTRIBUTING.md',
    'CLAUDE.md',
    'AGENTS.md',
  ],
  okfVersion: '0.1',
  types: ['concept', 'project', 'procedure'],
  rules: {
    // Conformance (OKF v0.1)
    'frontmatter-parseable': 'error',
    'type-present': 'error',
    'index-frontmatter': 'error',
    // House style (stricter than spec)
    'okf-version': 'warn',
    'log-structure': 'warn',
    'type-known': 'warn',
    'title-present': 'warn',
    'description-present': 'warn',
    'timestamp-present': 'warn',
    'timestamp-iso8601': 'warn',
    'no-wikilinks': 'warn',
    'broken-link': 'warn',
  },
};

// Spec section each rule maps to (for citation in output).
const SECTION = {
  'frontmatter-parseable': '§9.1',
  'type-present': '§9.2',
  'index-frontmatter': '§6',
  'okf-version': '§11',
  'log-structure': '§7',
  'broken-link': '§5',
};

const STRICT = process.env.OKF_STRICT === '1';

function loadConfig() {
  const configPath = path.resolve('okf.config.json');
  if (!fs.existsSync(configPath)) return DEFAULT_CONFIG;
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (err) {
    console.error(`Could not parse okf.config.json: ${err.message}`);
    process.exit(2);
  }
  return {
    ...DEFAULT_CONFIG,
    ...parsed,
    rules: { ...DEFAULT_CONFIG.rules, ...(parsed.rules || {}) },
  };
}

// --- Small helpers -------------------------------------------------------

const COLOR = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
};

function globToRegExp(glob) {
  let re = glob.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  re = re.replace(/\*\*/g, ' ');
  re = re.replace(/\*/g, '[^/]*');
  re = re.replace(/ /g, '.*');
  return new RegExp('^' + re + '$');
}

function makeIgnoreMatcher(patterns) {
  const regexes = patterns.map(globToRegExp);
  return (relPath) => regexes.some((r) => r.test(relPath));
}

function walk(dirAbs, rootAbs, isIgnored, out) {
  for (const name of fs.readdirSync(dirAbs)) {
    const abs = path.join(dirAbs, name);
    const rel = path.relative(rootAbs, abs).split(path.sep).join('/');
    let stat;
    try {
      stat = fs.statSync(abs);
    } catch {
      continue; // dangling symlink, etc.
    }
    if (stat.isDirectory()) {
      if (name === 'node_modules' || name.startsWith('.')) continue;
      if (isIgnored(rel + '/') || isIgnored(rel)) continue;
      walk(abs, rootAbs, isIgnored, out);
    } else if (name.endsWith('.md') && !isIgnored(rel)) {
      out.push(abs);
    }
  }
  return out;
}

/**
 * Split a leading YAML frontmatter fence. Returns whether a fence was opened,
 * whether it was left unterminated, the raw YAML, and the body.
 */
function splitFrontmatter(content) {
  if (!/^---\r?\n/.test(content)) {
    return { hasFence: false, unterminated: false, raw: '', body: content };
  }
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---[ \t]*(\r?\n|$)/);
  if (!m) return { hasFence: true, unterminated: true, raw: '', body: '' };
  return {
    hasFence: true,
    unterminated: false,
    raw: m[1],
    body: content.slice(m[0].length),
  };
}

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim() !== '';
}

function isPresent(v) {
  return v !== undefined && v !== null && String(v).trim() !== '';
}

function isIso8601(value) {
  if (value instanceof Date) return !isNaN(value.getTime());
  if (typeof value !== 'string') return false;
  const re = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;
  if (!re.test(value)) return false;
  return !isNaN(new Date(value).getTime());
}

function isValidDate(y, m, d) {
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
}

// --- Link extraction -----------------------------------------------------

function extractMarkdownLinkTargets(content) {
  const targets = [];
  const re = /\[[^\]]*\]\(\s*([^)\s]+)[^)]*\)/g;
  let m;
  while ((m = re.exec(content)) !== null) targets.push(m[1]);
  return targets;
}

function isExternalLink(target) {
  return /^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('//');
}

function resolveLink(target, fileAbs, rootAbs) {
  const clean = target.split('#')[0].split('?')[0];
  if (clean === '') return null; // pure anchor
  if (clean.startsWith('/')) return path.join(rootAbs, clean);
  return path.resolve(path.dirname(fileAbs), clean);
}

// --- Validation ----------------------------------------------------------

function makeReporter(rules) {
  return function add(findings, ruleId, message) {
    let level = rules[ruleId] || 'off';
    if (STRICT && level === 'warn') level = 'error';
    if (level === 'off') return;
    findings.push({ level, ruleId, message, section: SECTION[ruleId] || null });
  };
}

function validateConcept(parsed, findings, add, config) {
  if (!parsed.hasFence) {
    add(findings, 'frontmatter-parseable', 'No YAML frontmatter block.');
    return;
  }
  if (parsed.unterminated) {
    add(
      findings,
      'frontmatter-parseable',
      'Frontmatter fence opened but never closed (missing closing `---`).'
    );
    return;
  }

  let data;
  try {
    data = yaml.load(parsed.raw);
  } catch (err) {
    const reason = String(err.message).split('\n')[0];
    add(findings, 'frontmatter-parseable', `Invalid YAML frontmatter: ${reason}`);
    return;
  }
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    add(
      findings,
      'frontmatter-parseable',
      'Frontmatter must be a YAML mapping of key/value pairs.'
    );
    return;
  }

  if (!isNonEmptyString(data.type)) {
    add(findings, 'type-present', 'Missing or empty required `type` field.');
  } else if (!config.types.includes(data.type)) {
    add(
      findings,
      'type-known',
      `Unknown type "${data.type}". Known types: ${config.types.join(', ')}. ` +
        'Add it to okf.config.json#types if this is intentional.'
    );
  }

  if (!isPresent(data.title)) {
    add(findings, 'title-present', 'Recommended field `title` is missing.');
  }
  if (!isPresent(data.description)) {
    add(
      findings,
      'description-present',
      'Recommended field `description` is missing (used by index.md entries).'
    );
  }
  if (!isPresent(data.timestamp)) {
    add(findings, 'timestamp-present', 'Recommended field `timestamp` is missing.');
  } else if (!isIso8601(data.timestamp)) {
    add(
      findings,
      'timestamp-iso8601',
      '`timestamp` is not ISO 8601 (e.g. 2026-06-16T17:22:39+10:00).'
    );
  }
}

function validateIndex(fileAbs, rootAbs, parsed, findings, add, config) {
  const isRoot = path.dirname(fileAbs) === rootAbs;

  if (!isRoot) {
    if (parsed.hasFence) {
      add(
        findings,
        'index-frontmatter',
        'Non-root `index.md` must contain no frontmatter.'
      );
    }
    return;
  }

  // Bundle-root index.md: frontmatter permitted, but only for `okf_version`.
  if (!parsed.hasFence) {
    add(
      findings,
      'okf-version',
      `Bundle-root index.md should declare \`okf_version: "${config.okfVersion}"\`.`
    );
    return;
  }
  if (parsed.unterminated) {
    add(
      findings,
      'frontmatter-parseable',
      'Frontmatter fence opened but never closed (missing closing `---`).'
    );
    return;
  }
  let data;
  try {
    data = yaml.load(parsed.raw);
  } catch (err) {
    const reason = String(err.message).split('\n')[0];
    add(findings, 'frontmatter-parseable', `Invalid YAML frontmatter: ${reason}`);
    return;
  }
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    add(findings, 'index-frontmatter', 'Frontmatter must be a YAML mapping.');
    return;
  }
  const extraKeys = Object.keys(data).filter((k) => k !== 'okf_version');
  if (extraKeys.length > 0) {
    add(
      findings,
      'index-frontmatter',
      'Bundle-root index.md frontmatter may only contain `okf_version`; ' +
        `found: ${extraKeys.join(', ')}.`
    );
  }
  if (!isPresent(data.okf_version)) {
    add(
      findings,
      'okf-version',
      `Bundle-root index.md should declare \`okf_version: "${config.okfVersion}"\`.`
    );
  }
}

function validateLog(body, findings, add) {
  const headingDates = [];
  const re = /^#{1,6}[ \t]+(\d{4})-(\d{2})-(\d{2})\b/gm;
  let m;
  while ((m = re.exec(body)) !== null) {
    const [y, mo, d] = [+m[1], +m[2], +m[3]];
    if (!isValidDate(y, mo, d)) {
      add(findings, 'log-structure', `Invalid date heading: ${m[0].trim()}`);
    } else {
      headingDates.push(`${m[1]}-${m[2]}-${m[3]}`);
    }
  }
  if (headingDates.length === 0) {
    add(
      findings,
      'log-structure',
      'No ISO 8601 (YYYY-MM-DD) date headings found; log entries should be ' +
        'grouped under date headings, newest first.'
    );
    return;
  }
  for (let i = 1; i < headingDates.length; i++) {
    if (headingDates[i] > headingDates[i - 1]) {
      add(
        findings,
        'log-structure',
        `Date headings are not newest-first (${headingDates[i - 1]} ` +
          `precedes ${headingDates[i]}).`
      );
      break;
    }
  }
}

function checkLinks(content, fileAbs, rootAbs, findings, add) {
  // WikiLinks (multi-line safe).
  if (/\[\[[\s\S]*?\]\]/.test(content)) {
    add(
      findings,
      'no-wikilinks',
      'Found [[WikiLinks]] — use standard Markdown links ([text](./path.md)).'
    );
  }
  // Broken intra-bundle .md links.
  for (const target of extractMarkdownLinkTargets(content)) {
    if (isExternalLink(target)) continue;
    const resolved = resolveLink(target, fileAbs, rootAbs);
    if (!resolved) continue;
    if (!/\.md$/i.test(resolved.split('#')[0])) continue;
    if (!fs.existsSync(resolved)) {
      add(
        findings,
        'broken-link',
        `Link target not found: ${target} — confirm this is an intentional ` +
          'not-yet-written stub (allowed by OKF) and not a typo.'
      );
    }
  }
}

// --- Main ----------------------------------------------------------------

function main() {
  const config = loadConfig();
  const rootAbs = path.resolve(config.bundleRoot);
  const isIgnored = makeIgnoreMatcher(config.ignore);
  const add = makeReporter(config.rules);

  const files = walk(rootAbs, rootAbs, isIgnored, []).sort();

  let errorCount = 0;
  let warnCount = 0;

  for (const fileAbs of files) {
    const rel = path.relative(process.cwd(), fileAbs) || path.basename(fileAbs);
    const content = fs.readFileSync(fileAbs, 'utf8');
    const parsed = splitFrontmatter(content);
    const base = path.basename(fileAbs);
    const findings = [];

    if (base === 'index.md') {
      validateIndex(fileAbs, rootAbs, parsed, findings, add, config);
    } else if (base === 'log.md') {
      validateLog(parsed.hasFence ? parsed.body : content, findings, add);
    } else {
      validateConcept(parsed, findings, add, config);
    }
    checkLinks(content, fileAbs, rootAbs, findings, add);

    const errors = findings.filter((f) => f.level === 'error');
    const warns = findings.filter((f) => f.level === 'warn');
    errorCount += errors.length;
    warnCount += warns.length;

    if (findings.length === 0) {
      console.log(`${COLOR.green('PASS')} ${rel}`);
      continue;
    }
    const tag = errors.length > 0 ? COLOR.red('FAIL') : COLOR.yellow('WARN');
    console.log(`${tag} ${rel}`);
    for (const f of findings) {
      const lvl =
        f.level === 'error' ? COLOR.red('error') : COLOR.yellow('warn ');
      const cite = f.section ? COLOR.dim(` (${f.section})`) : '';
      console.log(`  ${lvl} [${f.ruleId}]${cite} ${f.message}`);
    }
  }

  console.log('');
  const summary = `${files.length} file(s): ${errorCount} error(s), ${warnCount} warning(s).`;
  if (errorCount > 0) {
    console.error(COLOR.red(`Validation FAILED — ${summary}`));
    console.error(
      COLOR.dim(
        'Errors are OKF v0.1 conformance violations. Warnings are house-style ' +
          'drift signals (run with OKF_STRICT=1 to fail on them too).'
      )
    );
    process.exit(1);
  }
  if (warnCount > 0 && !STRICT) {
    console.log(COLOR.yellow(`Validation passed with warnings — ${summary}`));
  } else {
    console.log(COLOR.green(`Validation successful — ${summary}`));
  }
}

main();
