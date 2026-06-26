# 开发者文档

面向想理解、修改、维护本项目的人。普通用户不需要读本文档——看 [README](../README.md) 即可。

## 技术栈与架构

**单文件纯前端应用**：整个项目就是一个 `math-atlas.html`，无后端、无构建步骤、无依赖安装。

- **图谱引擎**：[Cytoscape.js](https://js.cytoscape.org/) 3.28.1，以压缩库形式内联在 `<script>` 中（约 370KB）。内联是**有意为之**——让用户下载一个文件就能离线用，不依赖 CDN。
- **数据**：所有节点数据在 `const NODES = {...}` 对象中（约 86 个节点）。
- **存储**：用户进度用 `localStorage`（无服务端），键见下文。
- **布局**：Cytoscape 内置 `cose`（力导向）+ 自定义 `layered`（按层分行）两种，可切换。

## 项目结构

```
math-atlas.html      主产品（数据 + 逻辑 + 样式 + Cytoscape 库，全在一个文件）
README.md            用户门面
LICENSE              MIT（代码）+ CC-BY-SA（内容）双许可
CONTRIBUTING.md      贡献与采纳标准
docs/
  content-quality-standard.md   节点内容的字段级质量标准（spec）
  DEVELOPMENT.md                ← 本文件
.github/
  ISSUE_TEMPLATE/               4 类 Issue 模板 + 选择器
  PULL_REQUEST_TEMPLATE.md      PR 模板
```

## NODES 数据结构

每个节点是一个对象：

```js
calculus2: {
  layer: 'analysis',            // 所属层级：found/analysis/algebra/geom/prob/disc/app
  name: '多元微积分',            // 显示名
  def: '...',                   // 一句话定义
  why: '...',                   // 为什么学它
  prereq: ['calculus1','linalg'],  // 前置节点 id 数组
  leads: [],                    // （可选）应用目标占位符
  msc: 'MSC2020 26B05/...',     // 学科分类编码
  items: [{t:'偏导数', d:'固定其他变量只对一个变量求导...'}, ...],  // 知识点清单
  items_src: '同济《高等数学》第七版 ...',  // items 的整体来源依据
  res: [{t:'...', k:'书', lang:'中'}, ...],  // 推荐资源（k: 书/课/视频）
  depth: [{g:'AI/数据', d:'...'}, ...],       // 各目标方向的掌握程度
  qa: 'B'                       // 质量等级：A 权威 / B 已核对 / C 待校对 / D 存疑
}
```

### `items` 的两种格式（兼容）
- **字符串数组**（旧格式，待补定义的节点）：`['偏导数', '梯度', ...]`
- **对象数组**（已补定义）：`[{t:'偏导数', d:'固定其他变量...'}, ...]`

前端渲染兼容两种。逐步把字符串升级为对象是内容维护的主要工作。

### ⚠️ 改 items 时的注意事项
知识点勾选状态按 `${nodeId}::${idx}` 编码存入 localStorage。**若改动某节点 items 的顺序或增删条目，已勾选的状态会错位**。改 items 时务必保持已有项的顺序，或在改动后提示用户清理本地存储。

## localStorage 键

| 键 | 含义 |
|---|---|
| `mathatlas_mastered` | 已掌握的节点 id 数组 |
| `mathatlas_mastered_items` | 已勾选知识点，编码 `${nodeId}::${idx}` |
| `mathatlas_autolock` | 手动标记的节点（不被知识点取消自动移除） |
| `mathatlas_starred` | 收藏的节点 id 数组 |
| `mathatlas_view` | 视图状态 {mode, path, focused, ts} |

## 质量等级（qa）

| 等级 | 含义 | 当前覆盖 |
|---|---|---|
| A | 官方课标/MSC 背书 | 基础层 18 节点 |
| B | 经公认教材核对 | 大学层节点 |
| C/D | 待校对/存疑 | （当前为 0） |

字段级的质量标准详见 [`content-quality-standard.md`](content-quality-standard.md)。

## 本地开发与验证

**预览**：浏览器直接打开 `math-atlas.html`。改完数据刷新即可看效果。

**数据校验**：用 Node 解析 `NODES` 块，检查字段完整性、prereq 悬空引用、qa 合法性等。校验脚本不在仓库内（按需临时写），核心思路：用正则提取 `const NODES = {...};` 块，`eval` 后遍历检查。

**真实浏览器验证（重要）**：改动**不能只看代码/数据**，必须用浏览器实际打开确认渲染。本项目历史上多次出现"数据正确但渲染/交互异常"的情况。

如需自动化截图验证，可用 CDP（Chrome DevTools Protocol）+ headless Edge：
1. PowerShell 启动：`msedge.exe --headless=new --remote-debugging-port=9333`
2. Node 连 `ws://` 通过 `Target.createTarget` 打开页面
3. **注意**：`http://127.0.0.1:9333/json` 会列出 Edge 的 newtab 页，需按 URL 过滤目标页，否则会误连空页面。
4. `Runtime.evaluate` 取返回值需设 `returnByValue:true`；`layoutstop` 等回调会返回巨大的 Cytoscape 对象，resolve 时用 `()=>res()` 而非 `res`，避免 CDP 报 "Object reference chain is too long"。

## 内置 Cytoscape 库的更新

库内联在 `<script>` 中，约第 37 行（`!function(e,t){...cytoscape=t()}...`）开始。如需升级 Cytoscape.js：用新版的压缩构建整体替换这一段，保留前后注释标记。

## 贡献流程

详见 [CONTRIBUTING.md](../CONTRIBUTING.md)。事实性改动必须在 PR 描述附可核对来源。
