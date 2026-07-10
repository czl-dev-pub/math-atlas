#!/usr/bin/env node
/**
 * 审计每个节点的 res.url 覆盖情况
 * 用法: node tools/url-audit.js
 */
const fs = require('fs');
const path = require('path');

const HTML = path.join(__dirname, '..', 'math-atlas.html');
const src = fs.readFileSync(HTML, 'utf8');
const lines = src.split('\n');

let start = -1, end = -1;
for (let i = 0; i < lines.length; i++) {
  if (/const NODES\s*=/.test(lines[i])) start = i;
  if (start >= 0 && /^\s*\};\s*$/.test(lines[i])) { end = i; break; }
}
const block = lines.slice(start, end + 1).join('\n').replace(/^const NODES\s*=\s*/, '').replace(/;\s*$/, '');
const NODES = eval('(' + block + ')');

const ids = Object.keys(NODES);
let withUrl = [], without = [];
for (const id of ids) {
  const n = NODES[id];
  const has = Array.isArray(n.res) && n.res.some(r => r.url);
  if (has) withUrl.push(id);
  else without.push(id);
}
console.log('Total nodes:', ids.length);
console.log(`WITH url (${withUrl.length}):`, withUrl.join(','));
console.log(`WITHOUT url (${without.length}):`, without.join(','));
// Print res details for nodes without url
console.log('\n--- nodes WITHOUT url: current res ---');
for (const id of without) {
  const n = NODES[id];
  const res = Array.isArray(n.res) ? n.res : [];
  console.log(`${id} [${n.layer}] ${n.name}: res=[${res.map(r => JSON.stringify(r)).join(', ')}]`);
}
