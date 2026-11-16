export type MobileReaderTheme = 'dark' | 'light' | 'sepia';
export type MobileReaderFontSize = 'sm' | 'md' | 'lg';
export type ApkDataStrategy = 'github_ota_empty_shell' | 'github_ota_with_seed';

export interface GitHubSyncConfig {
  owner: string;
  repo: string;
  branch: string;
  filePath: string;
  customManifestUrl?: string;
  autoCheckOnLaunch: boolean;
}

export interface ApkExportConfig {
  appName: string;
  packageId: string;
  versionName: string;
  versionCode: number;
  defaultTheme: MobileReaderTheme;
  defaultFontSize: MobileReaderFontSize;
  includeSections: {
    beginner: boolean;
    formulas: boolean;
    benchmarks: boolean;
    glossary: boolean;
  };
  selectedCategories: string[];
  dataStrategy?: ApkDataStrategy;
  githubSync?: GitHubSyncConfig;
}

export interface PaperExportSummary {
  id: string;
  folderName: string;
  titleZh: string;
  titleEn: string;
  arxivId: string;
  doi: string;
  authors: string[];
  affiliations: string[];
  publishDate: string;
  category: string;
  tags: string[];
  tldrZh: string;
  keyMetrics: { label: string; value: string; highlight?: boolean }[];
  features: string[];
}

export interface RemotePapersManifest {
  schemaVersion: string;
  appName: string;
  manifestVersion: string;
  updatedAt: string;
  paperCount: number;
  categories: string[];
  papers: PaperExportSummary[];
}

export interface GeneratedProjectFile {
  path: string;
  content: string;
  descZh: string;
}

export const DEFAULT_GITHUB_SYNC: GitHubSyncConfig = {
  owner: 'karryw188',
  repo: 'ai-paper-lab-data',
  branch: 'main',
  filePath: 'papers-manifest.json',
  customManifestUrl: '',
  autoCheckOnLaunch: true
};

const UTF8_ENCODER = new TextEncoder();

export function computeCrc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    c ^= bytes[i];
    for (let k = 0; k < 8; k++) {
      c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

/**
 * Pure zero-dependency ZIP archive packer (Store method 0, standard PKZIP format)
 */
export function createZipArchive(
  entries: { path: string; content: string | Uint8Array }[]
): Uint8Array {
  const localChunks: Uint8Array[] = [];
  const centralChunks: Uint8Array[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBytes = UTF8_ENCODER.encode(entry.path);
    const dataBytes =
      typeof entry.content === 'string'
        ? UTF8_ENCODER.encode(entry.content)
        : entry.content;
    const crc = computeCrc32(dataBytes);
    const size = dataBytes.length;

    // Local file header (30 bytes + file name)
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const lv = new DataView(localHeader.buffer);
    lv.setUint32(0, 0x04034b50, true); // Local file header signature
    lv.setUint16(4, 20, true); // Version needed to extract (2.0)
    lv.setUint16(6, 0x0800, true); // UTF-8 filename flag
    lv.setUint16(8, 0, true); // Compression method: 0 (Store)
    lv.setUint16(10, 0x4800, true); // Mod time
    lv.setUint16(12, 0x56a0, true); // Mod date
    lv.setUint32(14, crc, true); // CRC-32
    lv.setUint32(18, size, true); // Compressed size
    lv.setUint32(22, size, true); // Uncompressed size
    lv.setUint16(26, nameBytes.length, true); // Filename length
    lv.setUint16(28, 0, true); // Extra field length
    localHeader.set(nameBytes, 30);

    localChunks.push(localHeader, dataBytes);

    // Central directory file header (46 bytes + file name)
    const centralHeader = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(centralHeader.buffer);
    cv.setUint32(0, 0x02014b50, true); // Central directory signature
    cv.setUint16(4, 20, true); // Version made by
    cv.setUint16(6, 20, true); // Version needed
    cv.setUint16(8, 0x0800, true); // UTF-8 flag
    cv.setUint16(10, 0, true); // Store method
    cv.setUint16(12, 0x4800, true);
    cv.setUint16(14, 0x56a0, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, size, true);
    cv.setUint32(24, size, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint16(30, 0, true); // Extra length
    cv.setUint16(32, 0, true); // Comment length
    cv.setUint16(34, 0, true); // Disk number
    cv.setUint16(36, 0, true); // Internal attrs
    cv.setUint32(38, 0, true); // External attrs
    cv.setUint32(42, offset, true); // Relative offset of local header
    centralHeader.set(nameBytes, 46);

    centralChunks.push(centralHeader);
    offset += localHeader.length + dataBytes.length;
  }

  let centralSize = 0;
  for (const ch of centralChunks) centralSize += ch.length;

  // End of central directory record (22 bytes)
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true); // EOCD signature
  ev.setUint16(4, 0, true); // Disk number
  ev.setUint16(6, 0, true); // Disk with central dir
  ev.setUint16(8, entries.length, true); // Entries on disk
  ev.setUint16(10, entries.length, true); // Total entries
  ev.setUint32(12, centralSize, true); // Size of central directory
  ev.setUint32(16, offset, true); // Offset of central directory
  ev.setUint16(20, 0, true); // Comment length

  const totalSize = offset + centralSize + 22;
  const output = new Uint8Array(totalSize);
  let pos = 0;
  for (const chunk of localChunks) {
    output.set(chunk, pos);
    pos += chunk.length;
  }
  for (const chunk of centralChunks) {
    output.set(chunk, pos);
    pos += chunk.length;
  }
  output.set(eocd, pos);
  return output;
}

export function sanitizePackageId(raw: string): string {
  const cleaned = raw
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, '')
    .replace(/\.+/g, '.')
    .replace(/^\.|\.$/g, '');
  const parts = cleaned.split('.').filter(Boolean);
  if (parts.length < 2) {
    return 'com.aipaperlab.reader';
  }
  return parts
    .map((p) => (/^[0-9]/.test(p) ? `app${p}` : p))
    .join('.');
}

/**
 * Builds multi-CDN fallback URLs for fetching `papers-manifest.json` from GitHub
 * so mobile users in any network environment can reliably pull updates.
 */
export function buildGitHubSyncUrls(sync: GitHubSyncConfig = DEFAULT_GITHUB_SYNC): {
  rawUrl: string;
  jsDelivrUrl: string;
  ghProxyUrl: string;
  allUrls: string[];
} {
  const owner = (sync.owner || 'karryw188').trim().replace(/^\/+|\/+$/g, '');
  const repo = (sync.repo || 'ai-paper-lab-data').trim().replace(/^\/+|\/+$/g, '');
  const branch = (sync.branch || 'main').trim().replace(/^\/+|\/+$/g, '');
  const filePath = (sync.filePath || 'papers-manifest.json').trim().replace(/^\/+/, '');

  const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
  const jsDelivrUrl = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${filePath}`;
  const ghProxyUrl = `https://mirror.ghproxy.com/${rawUrl}`;

  const custom = sync.customManifestUrl?.trim();
  const allUrls = [
    ...(custom ? [custom] : []),
    jsDelivrUrl,
    rawUrl,
    ghProxyUrl
  ];

  return { rawUrl, jsDelivrUrl, ghProxyUrl, allUrls };
}

/**
 * Generates the standalone `papers-manifest.json` file to host on GitHub.
 * Whenever the user updates this file on GitHub, the installed APK can pull it
 * and persist it to local device storage without reinstalling the app.
 */
export function generateRemotePapersManifestJson(
  config: ApkExportConfig,
  papers: PaperExportSummary[]
): string {
  const categories = Array.from(new Set(papers.map((p) => p.category)));
  const manifest: RemotePapersManifest = {
    schemaVersion: '1.0',
    appName: config.appName.trim() || 'AI 论文随身读',
    manifestVersion: config.versionName.trim() || '1.0.0',
    updatedAt: new Date().toISOString().slice(0, 10),
    paperCount: papers.length,
    categories,
    papers
  };
  return JSON.stringify(manifest, null, 2);
}

export function generateMobileOfflineHtml(
  config: ApkExportConfig,
  papers: PaperExportSummary[]
): string {
  const safeAppName = config.appName.trim() || 'AI 论文随身读';
  const strategy: ApkDataStrategy = config.dataStrategy || 'github_ota_with_seed';
  const syncCfg: GitHubSyncConfig = config.githubSync || DEFAULT_GITHUB_SYNC;
  const syncUrls = buildGitHubSyncUrls(syncCfg);

  // When dataStrategy is 'github_ota_empty_shell', the APK embeds 0 papers in the HTML shell
  // and loads all papers from local persistent storage (populated from GitHub).
  const embeddedSeedPapers = strategy === 'github_ota_empty_shell' ? [] : papers;
  const seedPayloadJson = JSON.stringify(embeddedSeedPapers).replace(/<\//g, '<\\/');
  const defaultUrlsJson = JSON.stringify(syncUrls.allUrls);

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <meta name="theme-color" content="#10b981" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <title>${safeAppName} · GitHub 云端同步阅读器 (v${config.versionName})</title>
  <style>
    :root {
      --bg: #020617;
      --card: #0f172a;
      --border: #1e293b;
      --text: #f8fafc;
      --muted: #94a3b8;
      --accent: #10b981;
      --accent-soft: rgba(16, 185, 129, 0.14);
      --font-scale: ${config.defaultFontSize === 'lg' ? '18px' : config.defaultFontSize === 'sm' ? '14px' : '16px'};
    }
    [data-theme="light"] {
      --bg: #f8fafc;
      --card: #ffffff;
      --border: #e2e8f0;
      --text: #0f172a;
      --muted: #475569;
      --accent: #059669;
      --accent-soft: rgba(5, 150, 105, 0.12);
    }
    [data-theme="sepia"] {
      --bg: #f4ecd8;
      --card: #fbf6e9;
      --border: #e2d5b5;
      --text: #2c2216;
      --muted: #6e5a42;
      --accent: #b45309;
      --accent-soft: rgba(180, 83, 9, 0.12);
    }
    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    body {
      margin: 0;
      padding: 0 0 76px 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans SC", sans-serif;
      background: var(--bg);
      color: var(--text);
      font-size: var(--font-scale);
      line-height: 1.65;
    }
    header {
      position: sticky;
      top: 0;
      z-index: 30;
      background: var(--card);
      border-bottom: 1px solid var(--border);
      padding: 12px 16px;
    }
    .top-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .brand { font-weight: 800; font-size: 1.05rem; letter-spacing: -0.02em; }
    .badge {
      font-size: 0.72rem;
      padding: 2px 8px;
      border-radius: 999px;
      background: var(--accent-soft);
      color: var(--accent);
      font-weight: 700;
    }
    .sync-bar {
      margin-top: 8px;
      padding: 8px 10px;
      border-radius: 10px;
      background: var(--bg);
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      font-size: 0.74rem;
    }
    .sync-btn {
      padding: 5px 10px;
      border-radius: 8px;
      border: none;
      background: var(--accent);
      color: #020617;
      font-weight: 700;
      font-size: 0.73rem;
      cursor: pointer;
      white-space: nowrap;
    }
    .search-input {
      width: 100%;
      margin-top: 10px;
      padding: 9px 12px;
      border-radius: 12px;
      border: 1px solid var(--border);
      background: var(--bg);
      color: var(--text);
      font-size: 0.85rem;
      outline: none;
    }
    .cats {
      display: flex;
      gap: 6px;
      overflow-x: auto;
      padding: 10px 16px 4px;
      scrollbar-width: none;
    }
    .cat-btn {
      white-space: nowrap;
      padding: 5px 12px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: var(--card);
      color: var(--muted);
      font-size: 0.75rem;
      font-weight: 600;
    }
    .cat-btn.active {
      background: var(--accent);
      color: #020617;
      border-color: var(--accent);
      font-weight: 700;
    }
    .container { padding: 12px 16px; max-width: 680px; margin: 0 auto; }
    .paper-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 16px;
      margin-bottom: 12px;
    }
    .meta-row { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin-bottom: 6px; }
    .paper-title { font-size: 1.02rem; font-weight: 700; margin: 4px 0; cursor: pointer; }
    .paper-en { font-size: 0.78rem; color: var(--muted); font-style: italic; margin-bottom: 8px; }
    .tldr {
      font-size: 0.86rem;
      background: var(--bg);
      padding: 10px 12px;
      border-radius: 12px;
      border: 1px solid var(--border);
      margin-bottom: 10px;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 6px;
      margin-top: 8px;
    }
    .metric-box {
      padding: 8px;
      border-radius: 10px;
      background: var(--bg);
      border: 1px solid var(--border);
    }
    .metric-label { font-size: 0.68rem; color: var(--muted); display: block; }
    .metric-val { font-size: 0.8rem; font-weight: 700; color: var(--accent); font-family: monospace; }
    .bottom-nav {
      position: fixed;
      bottom: 0; left: 0; right: 0;
      height: 62px;
      background: var(--card);
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: space-around;
      align-items: center;
      z-index: 40;
    }
    .nav-btn {
      background: none; border: none; color: var(--muted);
      font-size: 0.75rem; font-weight: 600; cursor: pointer;
    }
    .nav-btn.active { color: var(--accent); font-weight: 800; }
    .toolbar-btn {
      padding: 4px 9px; border-radius: 8px; border: 1px solid var(--border);
      background: var(--bg); color: var(--text); font-size: 0.72rem; cursor: pointer;
    }
  </style>
</head>
<body data-theme="${config.defaultTheme}">
  <header>
    <div class="top-row">
      <div>
        <span class="brand">${safeAppName}</span>
        <span class="badge" id="paperCountBadge">本机 0 篇</span>
      </div>
      <div style="display:flex;gap:6px;">
        <button class="toolbar-btn" onclick="cycleTheme()">主题</button>
        <button class="toolbar-btn" onclick="cycleFont()">字号</button>
      </div>
    </div>
    <div class="sync-bar">
      <span id="syncStatusText" style="color:var(--muted);">读取手机本地持久化论文库...</span>
      <div style="display:flex;gap:6px;">
        <button class="sync-btn" onclick="syncFromGitHub()">☁️ 同步 GitHub</button>
        <label class="toolbar-btn" style="display:inline-flex;align-items:center;">
          📂 导入JSON
          <input type="file" accept=".json,application/json" style="display:none;" onchange="importLocalJsonFile(event)" />
        </label>
      </div>
    </div>
    <input class="search-input" id="searchInput" placeholder="搜索论文标题、作者、标签或 arXiv 编号..." oninput="renderList()" />
  </header>
  <div class="cats" id="catBar"></div>
  <main class="container" id="paperList"></main>
  <nav class="bottom-nav">
    <button class="nav-btn active" id="tabAll" onclick="switchTab('all')">📚 本地文库</button>
    <button class="nav-btn" id="tabFav" onclick="switchTab('fav')">⭐ 书签收藏</button>
    <button class="nav-btn" id="tabSync" onclick="switchTab('sync')">☁️ GitHub源设置</button>
  </nav>
  <script>
    const SEED_PAPERS = ${seedPayloadJson};
    const DEFAULT_SYNC_URLS = ${defaultUrlsJson};
    const LOCAL_STORAGE_KEY = 'ai_paper_lab_local_manifest_v1';
    const THEMES = ['dark', 'light', 'sepia'];
    const FONTS = ['14px', '16px', '19px'];
    let PAPERS = [];
    let manifestMeta = { manifestVersion: '${config.versionName}', updatedAt: '未同步', source: '未初始化' };
    let currentCat = '全部';
    let currentTab = 'all';
    let favIds = JSON.parse(localStorage.getItem('ai_paper_favs') || '[]');
    let customRepoUrl = localStorage.getItem('ai_paper_custom_github_url') || DEFAULT_SYNC_URLS[0];

    // 1. Read persisted papers from Android native filesDir or browser localStorage
    function loadFromLocalDevice() {
      try {
        let raw = '';
        if (window.AndroidLocalStore && typeof window.AndroidLocalStore.readPapersJson === 'function') {
          raw = window.AndroidLocalStore.readPapersJson() || '';
        }
        if (!raw) {
          raw = localStorage.getItem(LOCAL_STORAGE_KEY) || '';
        }
        if (raw) {
          const parsed = JSON.parse(raw);
          const list = Array.isArray(parsed) ? parsed : (parsed.papers || []);
          if (list.length > 0) {
            PAPERS = list;
            manifestMeta = {
              manifestVersion: parsed.manifestVersion || '本地缓存',
              updatedAt: parsed.updatedAt || '已持久化于手机本地',
              source: window.AndroidLocalStore ? 'Android filesDir 原生存储' : '手机 LocalStorage 存储'
            };
            updateHeaderStatus('已从本机加载 ' + PAPERS.length + ' 篇论文 (' + manifestMeta.updatedAt + ')');
            return true;
          }
        }
      } catch (e) {
        console.warn('Failed to read local storage:', e);
      }

      if (SEED_PAPERS.length > 0) {
        PAPERS = SEED_PAPERS;
        updateHeaderStatus('使用内置种子数据 (' + PAPERS.length + ' 篇) · 可点击同步 GitHub 更新');
        return true;
      }

      PAPERS = [];
      updateHeaderStatus('本机尚无论文数据，请点击右侧「☁️ 同步 GitHub」下载保存至本机');
      return false;
    }

    // 2. Save downloaded GitHub manifest to both Android Native FilesDir & localStorage
    function saveToLocalDevice(rawJsonString, parsedObj) {
      const list = Array.isArray(parsedObj) ? parsedObj : (parsedObj.papers || []);
      PAPERS = list;
      manifestMeta = {
        manifestVersion: parsedObj.manifestVersion || 'GitHub 最新版',
        updatedAt: parsedObj.updatedAt || new Date().toISOString().slice(0, 10),
        source: window.AndroidLocalStore ? 'Android filesDir 原生存储' : '手机 LocalStorage'
      };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, rawJsonString);
      } catch (e) {}
      try {
        if (window.AndroidLocalStore && typeof window.AndroidLocalStore.savePapersJson === 'function') {
          window.AndroidLocalStore.savePapersJson(rawJsonString);
        }
      } catch (e) {}
      updateHeaderStatus('✅ 已从 GitHub 下载并保存 ' + PAPERS.length + ' 篇论文至手机本地 (' + manifestMeta.updatedAt + ')');
      renderCats();
      renderList();
    }

    // 3. Multi-CDN fallback fetch from GitHub
    async function syncFromGitHub() {
      const urls = [customRepoUrl, ...DEFAULT_SYNC_URLS.filter(u => u !== customRepoUrl)].filter(Boolean);
      updateHeaderStatus('⏳ 正在从 GitHub 拉取最新 papers-manifest.json ...');
      for (let i = 0; i < urls.length; i++) {
        const targetUrl = urls[i];
        try {
          const res = await fetch(targetUrl + (targetUrl.includes('?') ? '&' : '?') + '_t=' + Date.now());
          if (!res.ok) continue;
          const text = await res.text();
          const parsed = JSON.parse(text);
          const list = Array.isArray(parsed) ? parsed : (parsed.papers || []);
          if (Array.isArray(list) && list.length > 0) {
            saveToLocalDevice(text, parsed);
            return;
          }
        } catch (err) {
          console.warn('Mirror failed:', targetUrl, err);
        }
      }
      updateHeaderStatus('⚠️ GitHub 远端连接未响应，请检查仓库 URL 或直接点击「📂 导入JSON」加载本地文件');
    }

    function importLocalJsonFile(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const text = String(e.target.result || '');
          const parsed = JSON.parse(text);
          saveToLocalDevice(text, parsed);
        } catch (err) {
          updateHeaderStatus('❌ JSON 文件格式解析失败');
        }
      };
      reader.readAsText(file, 'utf-8');
    }

    function updateHeaderStatus(msg) {
      document.getElementById('syncStatusText').textContent = msg;
      document.getElementById('paperCountBadge').textContent = '本机 ' + PAPERS.length + ' 篇';
    }

    function cycleTheme() {
      const cur = document.body.getAttribute('data-theme') || 'dark';
      const next = THEMES[(THEMES.indexOf(cur) + 1) % THEMES.length];
      document.body.setAttribute('data-theme', next);
    }
    function cycleFont() {
      const cur = getComputedStyle(document.documentElement).getPropertyValue('--font-scale').trim();
      const next = FONTS[(FONTS.indexOf(cur) + 1) % FONTS.length] || '16px';
      document.documentElement.style.setProperty('--font-scale', next);
    }
    function toggleFav(id) {
      if (favIds.includes(id)) favIds = favIds.filter(x => x !== id);
      else favIds.push(id);
      localStorage.setItem('ai_paper_favs', JSON.stringify(favIds));
      renderList();
    }
    function switchTab(tab) {
      currentTab = tab;
      document.getElementById('tabAll').className = 'nav-btn' + (tab === 'all' ? ' active' : '');
      document.getElementById('tabFav').className = 'nav-btn' + (tab === 'fav' ? ' active' : '');
      document.getElementById('tabSync').className = 'nav-btn' + (tab === 'sync' ? ' active' : '');
      renderList();
    }
    function saveCustomUrl() {
      const val = document.getElementById('customUrlInput').value.trim();
      if (val) {
        customRepoUrl = val;
        localStorage.setItem('ai_paper_custom_github_url', val);
        syncFromGitHub();
      }
    }
    function clearLocalPapers() {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      if (window.AndroidLocalStore && typeof window.AndroidLocalStore.clearPapersJson === 'function') {
        window.AndroidLocalStore.clearPapersJson();
      }
      PAPERS = [];
      updateHeaderStatus('已清空本机缓存论文，可重新从 GitHub 下载');
      renderCats();
      renderList();
    }
    function renderCats() {
      const cats = ['全部', ...Array.from(new Set(PAPERS.map(p => p.category)))];
      document.getElementById('catBar').innerHTML = cats.map(c =>
        '<button class="cat-btn ' + (c === currentCat ? 'active' : '') + '" onclick="currentCat=\\'' + c + '\\';renderCats();renderList();">' + c + '</button>'
      ).join('');
    }
    function renderList() {
      if (currentTab === 'sync') {
        document.getElementById('paperList').innerHTML =
          '<div class="paper-card">' +
            '<div class="paper-title">☁️ GitHub 远端数据源与手机本地存储设置</div>' +
            '<p style="font-size:0.82rem;color:var(--muted);">APK 本身无需内置论文数据。只要将导出的 <code>papers-manifest.json</code> 上传至你的 GitHub 仓库，即可在手机端随时拉取更新并永久保存在本机存储中。</p>' +
            '<div style="margin:10px 0;"><label style="font-size:0.75rem;color:var(--muted);display:block;margin-bottom:4px;">当前 GitHub JSON 远端地址：</label>' +
            '<input id="customUrlInput" class="search-input" style="margin-top:0;" value="' + customRepoUrl + '" /></div>' +
            '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;">' +
              '<button class="sync-btn" onclick="saveCustomUrl()">保存地址并立即从 GitHub 拉取</button>' +
              '<button class="toolbar-btn" onclick="clearLocalPapers()">清空本机已下载论文缓存</button>' +
            '</div>' +
          '</div>';
        return;
      }
      const q = (document.getElementById('searchInput').value || '').toLowerCase();
      const filtered = PAPERS.filter(p => {
        if (currentTab === 'fav' && !favIds.includes(p.id)) return false;
        if (currentCat !== '全部' && p.category !== currentCat) return false;
        if (!q) return true;
        return p.titleZh.toLowerCase().includes(q) || p.titleEn.toLowerCase().includes(q) || p.arxivId.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q));
      });
      document.getElementById('paperList').innerHTML = filtered.map(p => {
        const isFav = favIds.includes(p.id);
        return '<article class="paper-card">' +
          '<div class="meta-row">' +
            '<span class="badge">' + p.arxivId + '</span>' +
            '<span style="font-size:0.72rem;color:var(--muted);">' + p.publishDate + '</span>' +
            '<button class="toolbar-btn" style="margin-left:auto;" onclick="toggleFav(\\'' + p.id + '\\')">' + (isFav ? '★ 已收藏' : '☆ 收藏') + '</button>' +
          '</div>' +
          '<div class="paper-title">' + p.titleZh + '</div>' +
          '<div class="paper-en">' + p.titleEn + ' · ' + p.authors.slice(0, 3).join(', ') + '</div>' +
          '<div class="tldr"><strong>💡 核心速通：</strong>' + p.tldrZh + '</div>' +
          '<div class="metrics-grid">' + p.keyMetrics.map(m =>
            '<div class="metric-box"><span class="metric-label">' + m.label + '</span><span class="metric-val">' + m.value + '</span></div>'
          ).join('') + '</div>' +
          '<div style="margin-top:10px;display:flex;justify-content:space-between;align-items:center;font-size:0.74rem;color:var(--muted);">' +
            '<span>分类：' + p.category + '</span>' +
            '<a href="' + p.doi + '" target="_blank" style="color:var(--accent);text-decoration:none;font-weight:700;">查看原文 PDF ↗</a>' +
          '</div>' +
        '</article>';
      }).join('') || (
        PAPERS.length === 0
          ? '<div class="paper-card" style="text-align:center;padding:32px 16px;">' +
              '<div style="font-size:1.05rem;font-weight:800;margin-bottom:8px;">☁️ 当前 APK 为零数据轻量空壳，本机尚无论文缓存</div>' +
              '<p style="font-size:0.82rem;color:var(--muted);margin-bottom:16px;">点击下方按钮即可从 GitHub 仓库下载最新 <code>papers-manifest.json</code> 并永久保存在手机本地，断网也可随时阅读！</p>' +
              '<button class="sync-btn" style="padding:10px 18px;font-size:0.85rem;" onclick="syncFromGitHub()">☁️ 立即从 GitHub 下载最新论文库至本机</button>' +
            '</div>'
          : '<div style="text-align:center;padding:40px;color:var(--muted);">暂无匹配的论文</div>'
      );
    }

    const hasLocal = loadFromLocalDevice();
    renderCats();
    renderList();
    if (!hasLocal && ${syncCfg.autoCheckOnLaunch ? 'true' : 'false'}) {
      syncFromGitHub();
    }
  </script>
</body>
</html>`;
}

export function generateAndroidProjectFiles(
  config: ApkExportConfig,
  papers: PaperExportSummary[]
): GeneratedProjectFile[] {
  const pkg = sanitizePackageId(config.packageId);
  const pkgPath = pkg.replace(/\./g, '/');
  const appName = config.appName.trim() || 'AI 论文随身读';
  const offlineHtml = generateMobileOfflineHtml(config, papers);
  const remoteManifestJson = generateRemotePapersManifestJson(config, papers);
  const syncCfg = config.githubSync || DEFAULT_GITHUB_SYNC;
  const syncUrls = buildGitHubSyncUrls(syncCfg);

  const manifestXml = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="${pkg}">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:hardwareAccelerated="true"
        android:label="${appName}"
        android:supportsRtl="true"
        android:usesCleartextTraffic="true"
        android:theme="@android:style/Theme.DeviceDefault.NoActionBar">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden|uiMode">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
`;

  const mainActivityKt = `package ${pkg}

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Context
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.view.KeyEvent
import java.io.File

/**
 * 原生本地持久化存储桥接器：
 * 将从 GitHub 拉取的 papers-manifest.json 直接保存在安卓系统私有目录 (context.filesDir) 中，
 * 即使清理浏览器缓存也永不丢失，且支持随时从 GitHub 热更新覆盖！
 */
class AndroidLocalStore(private val context: Context) {
    private val manifestFile: File
        get() = File(context.filesDir, "papers-manifest.json")

    @JavascriptInterface
    fun savePapersJson(jsonContent: String): Boolean {
        return try {
            manifestFile.writeText(jsonContent, Charsets.UTF_8)
            true
        } catch (e: Exception) {
            false
        }
    }

    @JavascriptInterface
    fun readPapersJson(): String {
        return try {
            if (manifestFile.exists()) manifestFile.readText(Charsets.UTF_8) else ""
        } catch (e: Exception) {
            ""
        }
    }

    @JavascriptInterface
    fun clearPapersJson(): Boolean {
        return try {
            if (manifestFile.exists()) manifestFile.delete() else true
        } catch (e: Exception) {
            false
        }
    }

    @JavascriptInterface
    fun getStoragePath(): String = manifestFile.absolutePath
}

class MainActivity : Activity() {
    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        webView = WebView(this)
        setContentView(webView)

        val settings: WebSettings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.allowFileAccess = true
        settings.cacheMode = WebSettings.LOAD_DEFAULT
        settings.setSupportZoom(false)

        // 注入 AndroidLocalStore 原生本地磁盘读写接口
        webView.addJavascriptInterface(AndroidLocalStore(this), "AndroidLocalStore")

        webView.webViewClient = WebViewClient()
        webView.webChromeClient = WebChromeClient()

        // 加载轻量阅读器壳，数据通过 GitHub 远端拉取并持久化在 context.filesDir/papers-manifest.json
        webView.loadUrl("file:///android_asset/index.html")
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack()) {
            webView.goBack()
            return true
        }
        return super.onKeyDown(keyCode, event)
    }
}
`;

  const appBuildGradle = `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "${pkg}"
    compileSdk = 34

    defaultConfig {
        applicationId = "${pkg}"
        minSdk = 24
        targetSdk = 34
        versionCode = ${config.versionCode}
        versionName = "${config.versionName}"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"))
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    implementation("androidx.webkit:webkit:1.11.0")
}
`;

  const rootBuildGradle = `plugins {
    id("com.android.application") version "8.3.0" apply false
    id("org.jetbrains.kotlin.android") version "1.9.22" apply false
}
`;

  const settingsGradle = `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "AIPaperLabReader"
include(":app")
`;

  const releaseApkFileName = `${pkg}-v${config.versionName}.apk`;

  const githubWorkflowYml = `name: Build & Publish Android APK to GitHub Release

on:
  push:
    branches: [ "main", "master" ]
    tags: [ "v*" ]
  workflow_dispatch:
    inputs:
      release_tag:
        description: "GitHub Release 版本号标签 (例如 v${config.versionName})"
        required: false
        default: "v${config.versionName}"

# 赋予 GITHUB_TOKEN 自动创建 GitHub Release 并上传 APK 安装包的权限
permissions:
  contents: write

jobs:
  build-and-release-apk:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Setup Gradle 8.6 (免 gradlew 二进制依赖自动构建)
        uses: gradle/actions/setup-gradle@v3
        with:
          gradle-version: '8.6'

      - name: Build Android APK
        working-directory: ./android
        run: gradle assembleDebug

      - name: Prepare Release APK Asset
        run: |
          cp android/app/build/outputs/apk/debug/app-debug.apk ./${releaseApkFileName}
          ls -lh ./${releaseApkFileName} ./papers-manifest.json

      - name: Upload APK to Actions Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: ${pkg}-v${config.versionName}-apk
          path: |
            ./${releaseApkFileName}
            ./papers-manifest.json

      - name: Publish APK & Manifest to GitHub Releases
        uses: softprops/action-gh-release@v2
        with:
          tag_name: \${{ github.event.inputs.release_tag || 'v${config.versionName}' }}
          name: "${appName} v${config.versionName} (Android APK + 离线论文包)"
          body: |
            ## 📱 ${appName} (v${config.versionName}) 安卓 APK 正式版发布
            
            ### 📥 手机端直接下载安装
            - 点击下方 **Assets** 中的 **\`${releaseApkFileName}\`** 即可直接下载安装到安卓手机！
            - **架构模式**：空壳 APK + GitHub 远端论文库热更新本地持久化（安装一次，后续论文更新无需重装 APK）。
            
            ### ☁️ 内置 GitHub 论文数据包
            - 同步发布的 **\`papers-manifest.json\`** 包含 **${papers.length} 篇** AI 经典与现代工业栈核心论文。
            - 打开手机 App 点击顶栏 **「☁️ 同步 GitHub」**，即可自动通过多源加速拉取最新论文并永久保存至手机本地私有目录 (\`filesDir/papers-manifest.json\`)。
          files: |
            ./${releaseApkFileName}
            ./papers-manifest.json
          draft: false
          prerelease: false
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
`;

  const publishShellScript = `#!/usr/bin/env bash
set -e

REPO_URL="https://github.com/${syncCfg.owner}/${syncCfg.repo}.git"
TAG="v${config.versionName}"

echo "========================================================"
echo "🚀 正在将 ${appName} 推送至 GitHub 并触发 Release 自动发版"
echo "📦 目标仓库: $REPO_URL"
echo "🏷️ 发布版本: $TAG"
echo "========================================================"

if [ ! -d ".git" ]; then
  git init
  git branch -M ${syncCfg.branch}
fi

git add .
git commit -m "release: build and publish ${appName} Android APK $TAG" || true

if git remote | grep -q "^origin$"; then
  git remote set-url origin "$REPO_URL"
else
  git remote add origin "$REPO_URL"
fi

git push -u origin ${syncCfg.branch} --force

echo ""
echo "✅ 推送完成！GitHub Actions 正在云端编译 APK 并自动创建 GitHub Release。"
echo "👉 请访问查看并下载 APK: https://github.com/${syncCfg.owner}/${syncCfg.repo}/releases"
`;

  const capacitorConfigJson = JSON.stringify(
    {
      appId: pkg,
      appName,
      webDir: 'dist',
      bundledWebRuntime: false,
      server: {
        androidScheme: 'https'
      }
    },
    null,
    2
  );

  const readmeGuide = `# ${appName} (${pkg}) — 自动发布 APK 到 GitHub Releases 指南

本工程已配置好 **GitHub Actions 全自动编译 + 自动发布 GitHub Releases** 流水线（\`.github/workflows/build-android-apk.yml\`）：
- **无需本地安装 Android Studio 或配置签名密钥**：代码推送到 GitHub 后，云端自动使用 Gradle 8.6 + JDK 17 编译出 \`${releaseApkFileName}\`，并通过 \`softprops/action-gh-release@v2\` 自动发布到仓库右侧的 **Releases** 页面！
- **APK 壳与论文数据彻底解耦**：Releases 与仓库主分支会同时托管 \`papers-manifest.json\`，以后论文更新只需修改仓库中的 \`papers-manifest.json\`，手机端点击 **「☁️ 同步 GitHub」** 即可下载并永久保存在手机本地 \`context.filesDir/papers-manifest.json\`。

## 三步发布 APK 到你的 GitHub Releases
1. 在 GitHub 创建一个仓库：\`https://github.com/${syncCfg.owner}/${syncCfg.repo}\`
2. 解压本工程包，在终端中运行一键发布脚本：
   \`\`\`bash
   chmod +x publish-to-github-release.sh
   ./publish-to-github-release.sh
   \`\`\`
3. 等待约 2 分钟，直接打开 **https://github.com/${syncCfg.owner}/${syncCfg.repo}/releases** 即可看到自动发布的 **\`${releaseApkFileName}\`** 安装包！
`;

  return [
    {
      path: '.github/workflows/build-android-apk.yml',
      content: githubWorkflowYml,
      descZh: 'GitHub Actions 云端自动编译 APK 并自动发布到 GitHub Releases 工作流'
    },
    {
      path: 'publish-to-github-release.sh',
      content: publishShellScript,
      descZh: '一键推送工程到 GitHub 并触发自动生成 GitHub Release APK 的终端脚本'
    },
    {
      path: 'papers-manifest.json',
      content: remoteManifestJson,
      descZh: `上传至 GitHub 仓库的远端论文数据包（含 ${papers.length} 篇论文，供手机 App 拉取并保存在本地）`
    },
    {
      path: `android/app/src/main/java/${pkgPath}/MainActivity.kt`,
      content: mainActivityKt,
      descZh: 'Kotlin 原生宿主 + AndroidLocalStore 本地持久化接口（写入手机 filesDir/papers-manifest.json）'
    },
    {
      path: 'android/app/src/main/AndroidManifest.xml',
      content: manifestXml,
      descZh: '安卓应用清单文件（定义网络同步权限、包名与启动 Activity）'
    },
    {
      path: 'android/app/build.gradle.kts',
      content: appBuildGradle,
      descZh: 'App 模块 Gradle 构建脚本（配置 SDK 34、应用包名与版本号）'
    },
    {
      path: 'android/build.gradle.kts',
      content: rootBuildGradle,
      descZh: '根工程 Gradle 插件版本声明'
    },
    {
      path: 'android/settings.gradle.kts',
      content: settingsGradle,
      descZh: 'Gradle 仓库源与子模块配置文件'
    },
    {
      path: 'capacitor.config.json',
      content: capacitorConfigJson,
      descZh: 'Capacitor 跨平台原生打包配置文件'
    },
    {
      path: 'android/app/src/main/assets/index.html',
      content: offlineHtml,
      descZh:
        config.dataStrategy === 'github_ota_empty_shell'
          ? '零内置数据的纯净阅读器外壳（支持从 GitHub 拉取 papers-manifest.json 并持久化至手机本地）'
          : `混合模式阅读器（支持从 GitHub 拉取热更新并含 ${papers.length} 篇初始种子数据）`
    },
    {
      path: 'README-APK-BUILD.md',
      content: readmeGuide,
      descZh: '自动发布 APK 到 GitHub Releases 与手机本地持久化中文说明文档'
    }
  ];
}

export function estimateExportMetrics(
  config: ApkExportConfig,
  papers: PaperExportSummary[]
): {
  paperCount: number;
  htmlSizeKb: number;
  manifestSizeKb: number;
  zipSizeKb: number;
  estimatedApkSizeMb: number;
  estimatedReadingMinutes: number;
} {
  const html = generateMobileOfflineHtml(config, papers);
  const manifestJson = generateRemotePapersManifestJson(config, papers);
  const files = generateAndroidProjectFiles(config, papers);
  const zipBytes = createZipArchive(files);

  const htmlSizeKb = Math.max(1, Math.round(UTF8_ENCODER.encode(html).length / 1024));
  const manifestSizeKb = Math.max(1, Math.round(UTF8_ENCODER.encode(manifestJson).length / 1024));
  const zipSizeKb = Math.max(1, Math.round(zipBytes.length / 1024));
  const isEmptyShell = config.dataStrategy === 'github_ota_empty_shell';
  const estimatedApkSizeMb = isEmptyShell
    ? 1.85
    : Number((2.4 + papers.length * 0.045).toFixed(2));
  const estimatedReadingMinutes = papers.length * 12;

  return {
    paperCount: papers.length,
    htmlSizeKb,
    manifestSizeKb,
    zipSizeKb,
    estimatedApkSizeMb,
    estimatedReadingMinutes
  };
}
