import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const configPath = path.join(root, 'legal', 'legal.config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

function flatten(obj, prefix = '') {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const next = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) Object.assign(acc, flatten(value, next));
    else acc[next] = String(value);
    return acc;
  }, {});
}

function render(template, vars) {
  return template.replace(/{{\s*([\w.]+)\s*}}/g, (_, key) => {
    if (!(key in vars)) throw new Error(`Missing template variable: ${key}`);
    return vars[key];
  });
}

const vars = flatten(config);
let changed = false;
for (const page of config.legalPages) {
  const source = path.join(root, page.source);
  const target = path.join(root, page.target);
  const html = render(fs.readFileSync(source, 'utf8'), vars);
  const current = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : '';
  if (current !== html) {
    fs.writeFileSync(target, html);
    changed = true;
    console.log(`synced ${page.target}`);
  } else {
    console.log(`unchanged ${page.target}`);
  }
}
if (!changed) console.log('legal docs already in sync');
