/**
 * Factory Town 2: Paradise — post-build V2 validator with ad allowlist.
 * Ad allowlist replaces the old "all ads forbidden" rule.
 */
import { readFileSync, readdirSync } from 'fs';
import { join, relative, resolve, sep } from 'path';

const BUILD_DIR = resolve('dist');
const ORIGIN = 'https://ft2paradiseguide.com';
const ROUTES = [
  '/',
  '/release-date-and-early-access/',
  '/demo-guide/',
  '/campaign-vs-custom-maps/',
  '/getting-started-checklist/',
  '/logistics-and-transport/',
  '/power-and-water-systems/',
  '/recipe-book-and-volcano-rewards/',
  '/patch-notes/',
  '/faq/',
];
const CORE_RULES = {
  '/': [/class="answer-strip"/, /Latest Official Updates/i, /All Guides/i],
  '/patch-notes/': [/class="answer-strip"/, /class="update-timeline"/, /Official Update Hub/i, /Frequently Asked Questions/i, /Related Guides/i],
  '/logistics-and-transport/': [/class="answer-strip"/, /<table/i, /Frequently Asked Questions/i, /Related Guides/i],
  '/release-date-and-early-access/': [/class="answer-strip"/, /class="check-list"/, /Frequently Asked Questions/i, /Related Guides/i],
};
const PARTIAL_ROUTES = new Set([
  '/demo-guide/', '/campaign-vs-custom-maps/', '/getting-started-checklist/',
  '/logistics-and-transport/', '/power-and-water-systems/',
  '/recipe-book-and-volcano-rewards/',
]);
const FORBIDDEN = [
  [/\b(best|optimal|tier\s*list|top\s*tier|lowest\s*tier)\b/i, 'unsupported optimality/tier claim'],
  [/\b(exact\s+recipe|recipe\s+cost|output\s*rate|damage\s*number|hp\s+value|stat\s+value)\b/i, 'unsupported exact numeric claim'],
  [/\b(map\s+route|hidden\s+location|secret\s+spot|optimal\s+route|best\s+path)\b/i, 'unsupported route/map claim'],
  [/\b(active\s+code|working\s+code|code\s+value|valid\s+code|redeem\s+code)\b/i, 'unsupported active-code claim'],
  [/\b(fps\s*boost|performance\s*tip|lag\s*fix|optimize\s*setting)\b/i, 'unsupported performance claim'],
];
const PLACEHOLDERS = [/\bGAME_NAME\b/, /\bTEMPLATE_SOURCE_ID\b/, /\bYYYY-MM-DD\b/, /\bYOUR_GAME\b/, /\bexample\.com\b/];

// Ad allowlist — exactly one approved Native Banner per page
const APPROVED_AD_SCRIPT = 'pl30442180.effectivecpmnetwork.com/9a7cd2e135679d13e508d2236ba4e177/invoke.js';
const APPROVED_CONTAINER_ID = 'container-9a7cd2e135679d13e508d2236ba4e177';

// Forbidden ad terms — must never appear in generated HTML
const FORBIDDEN_AD = [
  'highperformanceformat.com',
  'eed91f616a924154f60b5ba942b5e9a9',   // held 320x50 key
  'cc587728c0d2d7fa69f65f4553516ded',   // held 728x90 key
  'atOptions',
  'invoke.html',
  'adsterra',
  'adsense',
  'google analytics',
  'gtag',
  'fbq',
  'popunder',
  'smartlink',
  'socialbar',
  'anti-adblock',
];

// Stale advertising-off disclosures that must not remain in deployed HTML
const STALE_AD_PAT = /Advertising is off|No ads on this site|no third-party content are used|No images, analytics, or third-party content/i;

// Patterns for order validation
const QUICK_ANSWER_PAT = /class="answer-strip"/;
const AD_WRAPPER_PAT = /aria-label="Sponsored content"/;
const AD_SCRIPT_ESCAPED = APPROVED_AD_SCRIPT.replace(/\./g, '\\.');
const AD_SCRIPT_PAT = new RegExp(AD_SCRIPT_ESCAPED);
const AD_CONTAINER_ESCAPED = APPROVED_CONTAINER_ID.replace(/-/g, '\\-');
const AD_CONTAINER_PAT = new RegExp(AD_CONTAINER_ESCAPED);

const issues = [];
let htmlChecked = 0;
let coreChecked = 0;
let partialChecked = 0;
let totalScriptCount = 0;
let totalContainerCount = 0;
let totalWrapperCount = 0;
const scriptCountsByRoute = {};
const containerCountsByRoute = {};
const wrapperCountsByRoute = {};

function routeFromRelativePath(relPath) {
  if (relPath === 'index.html') return '/';
  if (!relPath.endsWith('/index.html')) return null;
  return `/${relPath.slice(0, -'index.html'.length)}`;
}

function add(relPath, message) {
  issues.push(`${relPath}: ${message}`);
}

function scanFile(fullPath) {
  const relPath = relative(BUILD_DIR, fullPath).split(sep).join('/');
  const content = readFileSync(fullPath, 'utf8');

  if (relPath.endsWith('.html')) {
    const route = routeFromRelativePath(relPath);

    // Count approved script occurrences
    const scriptMatches = content.match(AD_SCRIPT_PAT) || [];
    totalScriptCount += scriptMatches.length;
    if (route) scriptCountsByRoute[route] = scriptMatches.length;

    // Count approved container ID occurrences
    const containerMatches = content.match(AD_CONTAINER_PAT) || [];
    totalContainerCount += containerMatches.length;
    if (route) containerCountsByRoute[route] = containerMatches.length;

    // Count ad wrapper occurrences
    const wrapperMatches = content.match(AD_WRAPPER_PAT) || [];
    totalWrapperCount += wrapperMatches.length;
    if (route) wrapperCountsByRoute[route] = wrapperMatches.length;

    // Check for forbidden ad terms
    for (const term of FORBIDDEN_AD) {
      if (content.toLowerCase().includes(term.toLowerCase())) {
        add(relPath, `forbidden ad term: ${term}`);
      }
    }

    // Check for stale advertising-off disclosures
    if (STALE_AD_PAT.test(content)) {
      add(relPath, 'stale advertising-off disclosure still present');
    }

    // Order check: Quick Answer must appear before the ad wrapper
    if (QUICK_ANSWER_PAT.test(content) && AD_WRAPPER_PAT.test(content)) {
      const qaIdx = content.search(QUICK_ANSWER_PAT);
      const adIdx = content.search(AD_WRAPPER_PAT);
      if (adIdx < qaIdx) {
        add(relPath, 'ad wrapper appears before Quick Answer on this page');
      }
    }
  }

  if (!relPath.endsWith('.html')) return;
  htmlChecked += 1;
  const route = routeFromRelativePath(relPath);
  if (!route || !ROUTES.includes(route)) add(relPath, `generated HTML is not in the 10-route registry (${route ?? 'unknown route'})`);

  for (const [pattern, label] of FORBIDDEN) if (pattern.test(content)) add(relPath, label);
  for (const pattern of PLACEHOLDERS) if (pattern.test(content)) add(relPath, `template placeholder: ${pattern}`);

  if (!/<h1[\s>]/i.test(content)) add(relPath, 'missing h1');
  if (!/"@type":"WebPage"/.test(content)) add(relPath, 'missing WebPage JSON-LD');
  if (route !== '/' && !/"@type":"BreadcrumbList"/.test(content)) add(relPath, 'missing BreadcrumbList JSON-LD');

  if (route && CORE_RULES[route]) {
    coreChecked += 1;
    for (const pattern of CORE_RULES[route]) if (!pattern.test(content)) add(relPath, `missing core module matching ${pattern}`);
  }
  if (route && PARTIAL_ROUTES.has(route)) {
    partialChecked += 1;
    if (!/(Evidence Boundary|PARTIAL|not confirmed|unconfirmed|Last checked)/i.test(content)) add(relPath, 'missing visible evidence boundary');
  }

  const hrefs = [...content.matchAll(/href="(\/[^"#?]*)/g)].map(match => match[1]);
  for (const href of hrefs) {
    if (href.startsWith('/_astro/')) continue;
    const normalized = href.endsWith('/') ? href : `${href}/`;
    if (!ROUTES.includes(normalized) && !['/robots.txt/', '/sitemap-index.xml/'].includes(normalized)) {
      add(relPath, `internal link target is outside route registry: ${href}`);
    }
  }
}

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else if (entry.isFile()) scanFile(fullPath);
  }
}

try {
  readdirSync(BUILD_DIR);
} catch {
  console.error('ERROR: dist/ not found. Run npm run build first.');
  process.exit(1);
}

walk(BUILD_DIR);

const sitemapPath = join(BUILD_DIR, 'sitemap-0.xml');
try {
  const sitemap = readFileSync(sitemapPath, 'utf8');
  const actual = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]).sort();
  const expected = ROUTES.map(route => `${ORIGIN}${route}`).sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    add('sitemap-0.xml', `route set mismatch; expected ${expected.length}, found ${actual.length}`);
  }
  if (actual.some(url => url.startsWith('http://'))) add('sitemap-0.xml', 'contains non-HTTPS URL');
} catch {
  add('sitemap-0.xml', 'missing generated sitemap');
}

if (htmlChecked !== ROUTES.length) add('dist', `expected ${ROUTES.length} HTML pages, checked ${htmlChecked}`);
if (coreChecked !== Object.keys(CORE_RULES).length) add('dist', `expected ${Object.keys(CORE_RULES).length} core pages, checked ${coreChecked}`);
if (partialChecked !== PARTIAL_ROUTES.size) add('dist', `expected ${PARTIAL_ROUTES.size} PARTIAL pages, checked ${partialChecked}`);

// Ad allowlist total counts
if (totalScriptCount !== ROUTES.length) add('dist', `expected ${ROUTES.length} approved Native script occurrences, found ${totalScriptCount}`);
if (totalContainerCount !== ROUTES.length) add('dist', `expected ${ROUTES.length} approved container ID occurrences, found ${totalContainerCount}`);
if (totalWrapperCount !== ROUTES.length) add('dist', `expected ${ROUTES.length} ad wrapper occurrences, found ${totalWrapperCount}`);

// Per-route ad checks
for (const route of ROUTES) {
  if ((scriptCountsByRoute[route] || 0) !== 1) add(route, `expected 1 Native script on ${route}, found ${scriptCountsByRoute[route] || 0}`);
  if ((containerCountsByRoute[route] || 0) !== 1) add(route, `expected 1 container on ${route}, found ${containerCountsByRoute[route] || 0}`);
  if ((wrapperCountsByRoute[route] || 0) !== 1) add(route, `expected 1 ad wrapper on ${route}, found ${wrapperCountsByRoute[route] || 0}`);
}

console.log(`Canonical HTML routes checked: ${htmlChecked}/${ROUTES.length}`);
console.log(`Core V2 pages checked: ${coreChecked}/${Object.keys(CORE_RULES).length}`);
console.log(`PARTIAL pages checked: ${partialChecked}/${PARTIAL_ROUTES.size}`);
console.log(`Approved Native script occurrences: ${totalScriptCount}/${ROUTES.length}`);
console.log(`Approved container ID occurrences: ${totalContainerCount}/${ROUTES.length}`);
console.log(`Ad wrapper occurrences: ${totalWrapperCount}/${ROUTES.length}`);

if (issues.length) {
  console.error(`VALIDATION FAILED: ${issues.length} issue(s)`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('ALL CHECKS PASSED — route set, ad allowlist, modules, boundaries, links, structured data, placeholders, and ads');
