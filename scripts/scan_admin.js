const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(fullPath);
    }
  });
  return results;
}

const adminFiles = walk('./app/admin');
console.log('Total admin ts/tsx files:', adminFiles.length);

const usage = [];
adminFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const relPath = path.relative('.', file).replace(/\\/g, '/');
  
  // Find fetch calls or endpoint mentions
  const fetchRegex = /['"`](\/api\/admin\/[^'"`\s]+)['"`]/g;
  let m;
  const calls = new Set();
  while ((m = fetchRegex.exec(content)) !== null) {
    calls.add(m[1]);
  }
  
  // Also check direct imports
  const importRegex = /from\s+['"]([^'"]*(?:adminDb|dbService|supabase)[^'"]*)['"]/g;
  const imports = new Set();
  while ((m = importRegex.exec(content)) !== null) {
    imports.add(m[1]);
  }

  // Also check POST actions
  const actionRegex = /action:\s*['"]([^'"]+)['"]/g;
  const actions = new Set();
  while ((m = actionRegex.exec(content)) !== null) {
    actions.add(m[1]);
  }

  if (calls.size > 0 || imports.size > 0 || actions.size > 0) {
    usage.push({
      file: relPath,
      calls: Array.from(calls),
      imports: Array.from(imports),
      actions: Array.from(actions)
    });
  }
});

console.log('Files with calls/imports/actions:', usage.length);
usage.forEach(u => {
  console.log(`\nFILE: ${u.file}`);
  if (u.calls.length) console.log(`  Calls: ${u.calls.join(', ')}`);
  if (u.actions.length) console.log(`  Actions: ${u.actions.join(', ')}`);
  if (u.imports.length) console.log(`  Imports: ${u.imports.join(', ')}`);
});
