import fs from 'node:fs';

const files = ['privacy-policy.html', 'refund-policy.html', 'terms-of-service.html'];
let failed = false;
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const checks = [
    ['single doctype', (html.match(/<!DOCTYPE html>/gi) || []).length === 1],
    ['single html open', (html.match(/<html\b/gi) || []).length === 1],
    ['single body open', (html.match(/<body\b/gi) || []).length === 1],
    ['has current updated date', html.includes('April 25, 2026')],
    ['has footer copyright', html.includes('© 2026 DMTools.fun LLC')]
  ];
  for (const [label, ok] of checks) {
    if (!ok) {
      failed = true;
      console.error(`${file}: failed ${label}`);
    }
  }
}
if (failed) process.exit(1);
console.log('legal docs passed structural checks');
