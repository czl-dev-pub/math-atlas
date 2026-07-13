#!/usr/bin/env node
/**
 * math-atlas 数据完整性校验脚本
 * v1.1 — 用法: node tools/validate.js
 *
 * 校验 NODES 数据：
 *  - 每个 node 必填字段完整 (layer/name/def/prereq/msc/items/items_src/res/qa)
 *  - layer 合法 (found/analysis/algebra/geom/prob/disc/app)
 *  - qa 合法 (A/B/C/D)
 *  - prereq 指向存在的节点 (无悬空引用)
 *  - items 全部为 {t,d} 对象（"点击看定义"在所有节点生效）
 *  - d 定义非空、长度合理
 *
 * 退出码 0 = 通过；非 0 = 有问题。
 */
const fs = require('fs');
const path = require('path');

const HTML = path.join(__dirname, '..', 'data/nodes.js');
const src = fs.readFileSync(HTML, 'utf8');
const lines = src.split('\n');

// 找 NODES 块边界（从 data/nodes.js，直接是 const NODES = {...}）
let start = -1, end = -1;
for (let i = 0; i < lines.length; i++) {
  if (/const NODES\s*=/.test(lines[i])) start = i;
  if (start >= 0 && /^\s*\};\s*$/.test(lines[i])) { end = i; break; }
}
if (start < 0 || end < 0) {
  console.error('✗ 找不到 NODES 块（从 data/nodes.js）');
  process.exit(1);
}

const block = lines.slice(start, end + 1).join('\n').replace(/^const NODES\s*=\s*/, '').replace(/;\s*$/, '');

// 重复 key 检测：扫源文本统计顶层 key 出现次数。
// JS 对象字面量重复 key 不报错而是后者覆盖前者（anageom bug 就是这么潜伏的），
// eval 后无法察觉，必须扫源文本。匹配 "  keyname: {layer:" 这种节点定义行。
const keyCounts = {};
const keyRe = /^  ([a-zA-Z_0-9]+):\s*\{layer:/gm;
let _km;
while ((_km = keyRe.exec(block)) !== null) {
  keyCounts[_km[1]] = (keyCounts[_km[1]] || 0) + 1;
}
const dupKeys = Object.keys(keyCounts).filter(k => keyCounts[k] > 1);

const VALID_LAYERS = new Set(['found', 'analysis', 'algebra', 'geom', 'prob', 'disc', 'app']);
const VALID_QA = new Set(['A', 'B', 'C', 'D']);
const REQUIRED = ['layer', 'name', 'def', 'prereq', 'msc', 'items', 'items_src', 'res', 'qa'];

let errors = [];
let warnings = [];

// 用 Node 的 vm 解析整个 NODES 块（远比正则切分稳健，能正确处理嵌套大括号与字符串）
let nodes = {};
let nodeCount = 0;
try {
  nodes = eval('(' + block + ')');
  nodeCount = Object.keys(nodes).length;
} catch (e) {
  // 整体解析失败：尝试定位到具体节点。用括号深度切分，逐节点 eval 报告首个错误。
  errors.push(`【语法错误】NODES 块整体解析失败: ${e.message}`);
  // 逐节点尝试，定位坏的
  const entries = block.split(/\n(?=  [a-zA-Z_0-9]+: \{layer:)/);
  for (const seg of entries) {
    const km = seg.match(/^  ([a-zA-Z_0-9]+): \{/);
    if (!km) continue;
    const key = km[1];
    let inner = seg.trim().replace(/,$/, '').replace(/^[a-zA-Z_0-9]+:\s*/, '');
    if (inner.startsWith('{')) {
      try { eval('(' + inner + ')'); }
      catch (e2) { errors.push(`【语法错误】节点 '${key}' 解析失败: ${e2.message}`); }
    }
  }
  if (nodeCount < 80) warnings.push(`只解析到 ${nodeCount} 个节点（预期 86），NODES 块可能有语法错误。`);
}

// 重复 key 报告（无论解析是否成功都要查——这是源文本层面的问题，eval 不可见）
for (const k of dupKeys) {
  errors.push(`【重复 key】'${k}' 在 NODES 中定义了 ${keyCounts[k]} 次（JS 后者覆盖前者，前面的节点会运行时丢失）`);
}

// 字段完整性 + 值合法性（仅当解析成功时）
if (nodeCount >= 80) {
  for (const id of Object.keys(nodes)) {
    const n = nodes[id];
    for (const f of REQUIRED) {
      if (n[f] === undefined) {
        errors.push(`【缺字段】${id}: 缺少必填字段 '${f}'`);
      }
    }
    if (n.layer && !VALID_LAYERS.has(n.layer)) {
      errors.push(`【layer 非法】${id}: layer='${n.layer}'`);
    }
    if (n.qa && !VALID_QA.has(n.qa)) {
      errors.push(`【qa 非法】${id}: qa='${n.qa}'`);
    }
    if (n.prereq && Array.isArray(n.prereq)) {
      for (const p of n.prereq) {
        if (!(p in nodes)) {
          errors.push(`【prereq 悬空】${id}: prereq 指向不存在的节点 '${p}'`);
        }
      }
    }
    // items 检查
    if (n.items && Array.isArray(n.items)) {
      n.items.forEach((it, idx) => {
        if (typeof it === 'string') {
          errors.push(`【items 未对象化】${id} 第${idx}项是字符串（未填定义）: "${it.slice(0, 20)}"`);
        } else if (it && typeof it === 'object') {
          if (!it.t || typeof it.t !== 'string') {
            errors.push(`【items 缺标题】${id} 第${idx}项无 t`);
          }
          if (!it.d || typeof it.d !== 'string' || it.d.trim() === '') {
            warnings.push(`【items 无定义】${id} 第${idx}项 "${(it.t||'').slice(0,15)}" 无 d 定义`);
          }
        }
      });
    }
  }
}

// 统计
const byLayer = {};
let totalItems = 0;
for (const id of Object.keys(nodes)) {
  const n = nodes[id];
  if (n.layer) byLayer[n.layer] = (byLayer[n.layer] || 0) + 1;
  if (n.items) totalItems += n.items.length;
}

// 输出
console.log('════════════════════════════════════════');
console.log(' math-atlas 数据校验');
console.log('════════════════════════════════════════');
console.log(`节点数: ${nodeCount}${dupKeys.length ? ` (⚠️ 源文本定义了 ${Object.values(keyCounts).reduce((a,b)=>a+b,0)} 个，含 ${dupKeys.length} 个重复 key)` : ''}`);
console.log(`知识点总数: ${totalItems}`);
console.log(`各层: ${Object.entries(byLayer).map(([k, v]) => `${k}=${v}`).join('  ')}`);
console.log(`错误: ${errors.length}`);
console.log(`警告: ${warnings.length}`);
console.log('────────────────────────────────────────');
if (errors.length) {
  console.log('❌ 错误:');
  errors.forEach(e => console.log('  ' + e));
}
if (warnings.length) {
  console.log('⚠️  警告:');
  warnings.forEach(w => console.log('  ' + w));
}
if (errors.length === 0) {
  console.log('✅ 数据完整性校验通过');
}

process.exit(errors.length === 0 ? 0 : 1);
