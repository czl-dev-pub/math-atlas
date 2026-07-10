const fs = require('fs');
const https = require('https');
const http = require('http');

const lines = fs.readFileSync('math-atlas.html', 'utf8').split('\n');
let start = -1, end = -1;
for (let i = 0; i < lines.length; i++) {
  if (/const NODES\s*=/.test(lines[i])) start = i;
  if (start >= 0 && /^\s*\};\s*$/.test(lines[i])) { end = i; break; }
}
const block = lines.slice(start, end + 1).join('\n').replace(/^const NODES\s*=\s*/, '').replace(/;\s*$/, '');
const NODES = eval('(' + block + ')');

const all = [];
for (const id of Object.keys(NODES)) {
  const n = NODES[id];
  if (Array.isArray(n.res)) {
    for (const r of n.res) {
      if (r.url) all.push({ id, title: r.t, url: r.url });
    }
  }
}
console.log('Total URLs to verify:', all.length);

function check(url) {
  return new Promise(res => {
    const lib = url.startsWith('http://') ? http : https;
    const req = lib.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }, timeout: 15000 }, r => res({ status: r.statusCode, url }));
    req.on('error', e => res({ status: 'ERR:' + e.message.split('\n')[0], url }));
    req.on('timeout', () => { req.destroy(); res({ status: 'TIMEOUT', url }); });
  });
}

(async () => {
  let ok = 0, bad = 0, timeouts = 0;
  const CHUNK = 8;
  for (let i = 0; i < all.length; i += CHUNK) {
    const chunk = all.slice(i, i + CHUNK);
    const results = await Promise.all(chunk.map(c => check(c.url).then(r => ({ ...r, id: c.id, title: c.title }))));
    for (const r of results) {
      const isOk = typeof r.status === 'number' && r.status >= 200 && r.status < 400;
      if (isOk) ok++;
      else if (r.status === 'TIMEOUT') timeouts++;
      else bad++;
      if (!isOk) console.log((isOk ? 'OK ' : 'XX ') + String(r.status).padEnd(8) + r.id.padEnd(18) + ' ' + r.url);
    }
  }
  console.log('\nOK: ' + ok + ', BAD(4xx): ' + bad + ', TIMEOUT: ' + timeouts + ', TOTAL: ' + all.length);
})();
