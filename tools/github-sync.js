#!/usr/bin/env node
/**
 * GitHub 同步兜底: 通过 Contents API 逐文件上传 (api.github.com 路径稳定)
 * 用法: node tools/github-sync.js <file1> [file2 ...]
 * 需要环境变量 GH_TOKEN (gh auth 已登录则从 keyring 读不到, 需显式传)
 */
const fs = require('fs');
const https = require('https');

const REPO = 'czl-dev-pub/math-atlas';
const BRANCH = 'main';
const TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
if (!TOKEN) {
  console.error('ERROR: set GH_TOKEN env var (use: gh auth token)');
  process.exit(1);
}

const files = process.argv.slice(2);
if (!files.length) {
  console.error('Usage: node tools/github-sync.js <file1> [file2 ...]');
  process.exit(1);
}

function apiCall(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = https.request({
      method,
      hostname: 'api.github.com',
      path: '/repos/' + REPO + path,
      headers: {
        'Authorization': 'Bearer ' + TOKEN,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'math-atlas-sync',
        'Content-Type': 'application/json',
        'Content-Length': data ? Buffer.byteLength(data) : 0,
      },
      timeout: 30000,
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        let j = null;
        try { j = d ? JSON.parse(d) : null; } catch (e) {}
        resolve({ status: res.statusCode, body: j, raw: d });
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('TIMEOUT')); });
    if (data) req.write(data);
    req.end();
  });
}

async function uploadFile(localPath, repoPath) {
  const content = fs.readFileSync(localPath);
  const b64 = content.toString('base64');
  // Get current SHA
  const cur = await apiCall('GET', '/contents/' + repoPath + '?ref=' + BRANCH);
  let sha = null;
  if (cur.status === 200 && cur.body && cur.body.sha) sha = cur.body.sha;
  // PUT
  const res = await apiCall('PUT', '/contents/' + repoPath, {
    message: 'sync ' + repoPath + ' (from GitLab main)',
    content: b64,
    branch: BRANCH,
    ...(sha ? { sha } : {}),
  });
  return res;
}

(async () => {
  for (const f of files) {
    const repoPath = f.replace(/\\/g, '/');
    console.log('Uploading', f, '->', repoPath, '...');
    try {
      const r = await uploadFile(f, repoPath);
      if (r.status >= 200 && r.status < 300) {
        console.log('  OK', r.status, r.body && r.body.commit && r.body.commit.sha ? r.body.commit.sha.slice(0, 7) : '');
      } else {
        console.log('  FAIL', r.status, r.raw ? r.raw.slice(0, 200) : '');
      }
    } catch (e) {
      console.log('  ERROR', e.message);
    }
  }
})();
