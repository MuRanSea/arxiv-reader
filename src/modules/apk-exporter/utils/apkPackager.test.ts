import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ApkExportConfig,
  PaperExportSummary,
  buildGitHubSyncUrls,
  createZipArchive,
  generateAndroidProjectFiles,
  generateMobileOfflineHtml,
  generateRemotePapersManifestJson,
  estimateExportMetrics,
  sanitizePackageId
} from './apkPackager.js';

const MOCK_CONFIG: ApkExportConfig = {
  appName: 'AI 论文随身读',
  packageId: 'com.aipaperlab.reader',
  versionName: '2.1.0',
  versionCode: 21,
  defaultTheme: 'dark',
  defaultFontSize: 'md',
  includeSections: {
    beginner: true,
    formulas: true,
    benchmarks: true,
    glossary: true
  },
  selectedCategories: ['全部'],
  dataStrategy: 'github_ota_empty_shell',
  githubSync: {
    owner: 'karryw188',
    repo: 'ai-paper-lab-data',
    branch: 'main',
    filePath: 'papers-manifest.json',
    autoCheckOnLaunch: true
  }
};

const MOCK_PAPERS: PaperExportSummary[] = [
  {
    id: 'transformer-2017',
    folderName: 'Attention-Is-All-You-Need',
    titleZh: '注意力就是你所需的一切',
    titleEn: 'Attention Is All You Need',
    arxivId: 'arXiv:1706.03762',
    doi: 'https://arxiv.org/abs/1706.03762',
    authors: ['Ashish Vaswani'],
    affiliations: ['Google Brain'],
    publishDate: 'NeurIPS 2017',
    category: '大模型架构',
    tags: ['Transformer', 'Self-Attention'],
    tldrZh: '完全基于自注意力机制的序列建模架构。',
    keyMetrics: [{ label: 'WMT14 英德', value: '28.4 BLEU', highlight: true }],
    features: ['5分钟速通']
  }
];

test('sanitizePackageId normalizes invalid package strings into valid Android package IDs', () => {
  assert.equal(sanitizePackageId('com.aipaperlab.reader'), 'com.aipaperlab.reader');
  assert.equal(sanitizePackageId('My-App!'), 'com.aipaperlab.reader');
  assert.equal(sanitizePackageId('org.123lab.paper'), 'org.app123lab.paper');
});

test('createZipArchive builds a valid PKZIP binary with Local Header and EOCD signatures', () => {
  const zip = createZipArchive([
    { path: 'hello.txt', content: 'Hello Android APK!' },
    { path: 'nested/config.json', content: '{"ok":true}' }
  ]);

  assert.ok(zip.length > 60);
  const view = new DataView(zip.buffer);
  assert.equal(view.getUint32(0, true), 0x04034b50);
  assert.equal(view.getUint32(zip.length - 22, true), 0x06054b50);
  assert.equal(view.getUint16(zip.length - 12, true), 2);
});

test('github_ota_empty_shell generates an empty-shell APK HTML without hardcoded papers and configures GitHub multi-CDN sync', () => {
  const html = generateMobileOfflineHtml(MOCK_CONFIG, MOCK_PAPERS);
  assert.ok(html.includes('AI 论文随身读'));
  assert.ok(html.includes('const SEED_PAPERS = [];'));
  assert.ok(!html.includes('Attention Is All You Need'));
  assert.ok(html.includes('https://cdn.jsdelivr.net/gh/karryw188/ai-paper-lab-data@main/papers-manifest.json'));
  assert.ok(html.includes('AndroidLocalStore'));
});

test('generateRemotePapersManifestJson exports complete paper manifest for GitHub hosting', () => {
  const manifestRaw = generateRemotePapersManifestJson(MOCK_CONFIG, MOCK_PAPERS);
  const parsed = JSON.parse(manifestRaw);
  assert.equal(parsed.schemaVersion, '1.0');
  assert.equal(parsed.paperCount, 1);
  assert.equal(parsed.papers[0].id, 'transformer-2017');

  const urls = buildGitHubSyncUrls(MOCK_CONFIG.githubSync);
  assert.equal(
    urls.rawUrl,
    'https://raw.githubusercontent.com/karryw188/ai-paper-lab-data/main/papers-manifest.json'
  );
  assert.equal(
    urls.jsDelivrUrl,
    'https://cdn.jsdelivr.net/gh/karryw188/ai-paper-lab-data@main/papers-manifest.json'
  );
});

test('generateAndroidProjectFiles creates MainActivity with AndroidLocalStore filesDir bridge and papers-manifest.json', () => {
  const files = generateAndroidProjectFiles(MOCK_CONFIG, MOCK_PAPERS);
  const paths = files.map((f) => f.path);
  assert.ok(paths.includes('papers-manifest.json'));
  assert.ok(paths.includes('android/app/src/main/AndroidManifest.xml'));
  assert.ok(paths.includes('android/app/src/main/java/com/aipaperlab/reader/MainActivity.kt'));
  assert.ok(paths.includes('.github/workflows/build-android-apk.yml'));
  assert.ok(paths.includes('android/app/src/main/assets/index.html'));

  const mainKt = files.find((f) => f.path.endsWith('MainActivity.kt'))!.content;
  assert.ok(mainKt.includes('class AndroidLocalStore'));
  assert.ok(mainKt.includes('File(context.filesDir, "papers-manifest.json")'));

  const metrics = estimateExportMetrics(MOCK_CONFIG, MOCK_PAPERS);
  assert.equal(metrics.paperCount, 1);
  assert.equal(metrics.estimatedApkSizeMb, 1.85);
  assert.ok(metrics.manifestSizeKb >= 1);
});
