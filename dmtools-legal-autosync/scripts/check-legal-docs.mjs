import fs from 'node:fs';
import path from 'node:path';

const bundleRoot = process.cwd();
const siteRoot = path.resolve(bundleRoot, '..');
const config = JSON.parse(fs.readFileSync(path.join(bundleRoot, 'legal', 'legal.config.json'), 'utf8'));
const expectedDate = config.dates.lastUpdated;
const staleDates = ['April 25, 2026', 'May 27, 2026', 'June 18, 2026', 'July 11, 2026'];

const files = [
  ...config.legalPages.map((page) => ({
    path: path.join(bundleRoot, page.target),
    label: `generated ${page.title}`,
    required: [expectedDate]
  })),
  {
    path: path.join(siteRoot, 'privacy-policy.html'),
    label: 'published Privacy Policy',
    required: [expectedDate, 'Third-Party Online Tracking', 'designated privacy-request address']
  },
  {
    path: path.join(siteRoot, 'terms-of-service.html'),
    label: 'published Terms of Service',
    required: [expectedDate, 'Consumer withdrawal rights', 'expressly authorize']
  },
  {
    path: path.join(siteRoot, 'refund-policy.html'),
    label: 'published Refund Policy',
    required: [expectedDate, 'Statutory Withdrawal Rights for Digital Services', 'Lemon Squeezy']
  },
  {
    path: path.join(siteRoot, 'cookie-policy.html'),
    label: 'published Cookie Policy',
    required: [expectedDate, 'updating its technical consent controls', 'opt-out preference signal']
  },
  {
    path: path.join(siteRoot, 'tap-out-privacy.html'),
    label: 'Tap-Out Privacy Policy',
    required: [expectedDate, 'Children And Mixed-Audience Use', 'Google’s Privacy Policy']
  },
  {
    path: path.join(siteRoot, 'gravity-runner-privacy.html'),
    label: 'Gravity Runner Privacy Policy',
    required: [expectedDate, 'Your Choices And Requests', 'DMTools.fun LLC']
  }
];

let failed = false;

function fail(label, check) {
  failed = true;
  console.error(`${label}: failed ${check}`);
}

for (const file of files) {
  if (!fs.existsSync(file.path)) {
    fail(file.label, `file exists (${file.path})`);
    continue;
  }

  const html = fs.readFileSync(file.path, 'utf8');
  const checks = [
    ['single doctype', (html.match(/<!DOCTYPE html>/gi) || []).length === 1],
    ['single html open', (html.match(/<html\b/gi) || []).length === 1],
    ['single html close', (html.match(/<\/html>/gi) || []).length === 1],
    ['single body open', (html.match(/<body\b/gi) || []).length === 1],
    ['single body close', (html.match(/<\/body>/gi) || []).length === 1],
    ['current updated date', html.includes(expectedDate)],
    ['no known stale legal date', !staleDates.some((date) => date !== expectedDate && html.includes(date))],
    ...file.required.map((text) => [`required wording: ${text}`, html.includes(text)])
  ];

  for (const [label, ok] of checks) {
    if (!ok) fail(file.label, label);
  }
}

if (failed) process.exit(1);
console.log(`legal docs passed structural, date, and required-wording checks for ${files.length} files`);
