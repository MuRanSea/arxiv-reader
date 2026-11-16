import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Smartphone,
  Download,
  FileCode2,
  CheckCircle2,
  Sparkles,
  Copy,
  Check,
  Search,
  Bookmark,
  BookOpen,
  ExternalLink,
  Cpu,
  FolderArchive,
  CloudDownload,
  HardDrive,
  RefreshCw,
  Trash2,
  FileJson,
  GitBranch
} from 'lucide-react';
import { REGISTERED_PAPERS } from '../../../papers/registry.js';
import { ThemeToggle } from '../../shared/components/ThemeToggle.js';
import { PWAInstallButton } from './components/PWAInstallButton.js';
import {
  ApkDataStrategy,
  ApkExportConfig,
  PaperExportSummary,
  sanitizePackageId,
  buildGitHubSyncUrls,
  generateMobileOfflineHtml,
  generateRemotePapersManifestJson,
  generateAndroidProjectFiles,
  createZipArchive,
  estimateExportMetrics
} from './utils/apkPackager.js';

interface ApkExporterStudioProps {
  onBackToHub: () => void;
  onSelectPaper?: (paperId: string, view?: string) => void;
}

const ALL_CATEGORIES = [
  '大模型架构',
  '训练与扩展定律',
  '高效微调 (PEFT)',
  '推理与服务栈',
  '对齐与推理智能体',
  '视觉与生成模型',
  'RAG与检索'
];

const SIMULATED_OTA_NEW_PAPER: PaperExportSummary = {
  id: 'deepseek-v3-ota-demo',
  folderName: 'DeepSeek-V3-OTA',
  titleZh: '[GitHub 热更新演示] DeepSeek-V3：无辅助损失负载均衡 MoE 与多 Token 预测训练',
  titleEn: 'DeepSeek-V3 Technical Report (OTA Newly Synced from GitHub)',
  arxivId: 'arXiv:2412.19437',
  doi: 'https://arxiv.org/abs/2412.19437',
  authors: ['DeepSeek-AI'],
  affiliations: ['DeepSeek'],
  publishDate: '2024.12 (GitHub 远端热更新)',
  category: '大模型架构',
  tags: ['GitHub-OTA热更新', '671B-MoE', 'FP8混合精度训练', 'Multi-Token-Prediction'],
  tldrZh:
    '这是一篇通过 GitHub 远端 papers-manifest.json 动态热更新拉取并保存到手机本地存储的演示论文！无需重新编译或重装 APK，只要更新 GitHub 仓库中的 JSON，手机端即可一键拉取最新论文并持久化保存在本机 filesDir 中离线阅读。',
  keyMetrics: [
    { label: '总参数 / 激活参数', value: '671B / 37B', highlight: true },
    { label: '预训练总算力成本', value: '仅 2.788M H800 GPU 小时', highlight: true },
    { label: '同步来源', value: 'GitHub OTA -> 本机 filesDir' },
    { label: '重装 APK 需求', value: '0 次 (纯数据热更新)' }
  ],
  features: [
    '无辅助损失（Auxiliary-Loss-Free）动态偏置负载均衡策略',
    '原生 FP8 细粒度混合精度训练框架',
    '多 Token 预测（MTP）训练目标兼顾投机解码加速'
  ]
};

export const ApkExporterStudio: React.FC<ApkExporterStudioProps> = ({
  onBackToHub,
  onSelectPaper
}) => {
  // APK & Mobile Reader configuration state
  const [appName, setAppName] = useState('AI 论文随身读');
  const [packageIdInput, setPackageIdInput] = useState('com.aipaperlab.reader');
  const [versionName, setVersionName] = useState('2.0.0');
  const [defaultTheme, setDefaultTheme] = useState<'dark' | 'light' | 'sepia'>('dark');
  const [defaultFontSize, setDefaultFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [includeInteractiveNotes, setIncludeInteractiveNotes] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(ALL_CATEGORIES);

  // New: APK Data Strategy ('github_ota_empty_shell' by default per user request!)
  const [dataStrategy, setDataStrategy] = useState<ApkDataStrategy>('github_ota_empty_shell');
  const [githubOwner, setGithubOwner] = useState('karryw188');
  const [githubRepo, setGithubRepo] = useState('ai-paper-lab-data');
  const [githubBranch, setGithubBranch] = useState('main');
  const [githubFilePath, setGithubFilePath] = useState('papers-manifest.json');
  const [autoCheckOnLaunch, setAutoCheckOnLaunch] = useState(true);

  // Code Inspector state
  const [activeCodeTab, setActiveCodeTab] = useState<string>('.github/workflows/build-android-apk.yml');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedReleaseCmd, setCopiedReleaseCmd] = useState(false);

  // Export status banner state
  const [lastExportBanner, setLastExportBanner] = useState<{
    type: 'zip' | 'json' | 'html';
    fileName: string;
    sizeKB: number;
    paperCount: number;
    timestamp: string;
  } | null>(null);

  // Interactive Phone Simulator state (simulates local persistent storage + GitHub OTA sync)
  const [simSearch, setSimSearch] = useState('');
  const [simCategory, setSimCategory] = useState('全部');
  const [simActivePaperId, setSimActivePaperId] = useState<string | null>(null);
  const [simTab, setSimTab] = useState<'all' | 'saved' | 'ota'>('all');
  const [simBookmarks, setSimBookmarks] = useState<string[]>([
    'transformer',
    'flashattention',
    'deepseek-r1'
  ]);
  const [simLocalPersisted, setSimLocalPersisted] = useState<boolean>(true);
  const [simHasOtaNewPaper, setSimHasOtaNewPaper] = useState<boolean>(false);
  const [simSyncing, setSimSyncing] = useState<boolean>(false);
  const [simLastSyncLog, setSimLastSyncLog] = useState<string>(
    '已从 GitHub 同步并持久化于本机 /data/user/0/com.aipaperlab.reader/files/papers-manifest.json'
  );

  const allPaperSummaries: PaperExportSummary[] = useMemo(() => {
    return REGISTERED_PAPERS.filter((p) => p.status === 'active').map((p) => ({
      id: p.id,
      folderName: p.folderName,
      titleZh: p.titleZh,
      titleEn: p.titleEn,
      arxivId: p.arxivId,
      doi: p.doi,
      authors: p.authors,
      affiliations: p.affiliations,
      publishDate: p.publishDate,
      category: p.category,
      tags: p.tags,
      tldrZh: p.tldrZh,
      keyMetrics: p.keyMetrics,
      features: p.features
    }));
  }, []);

  const bundledPapers = useMemo(() => {
    return allPaperSummaries.filter((p) => selectedCategories.includes(p.category));
  }, [allPaperSummaries, selectedCategories]);

  const githubSyncConfig = useMemo(
    () => ({
      owner: githubOwner.trim() || 'karryw188',
      repo: githubRepo.trim() || 'ai-paper-lab-data',
      branch: githubBranch.trim() || 'main',
      filePath: githubFilePath.trim() || 'papers-manifest.json',
      autoCheckOnLaunch
    }),
    [githubOwner, githubRepo, githubBranch, githubFilePath, autoCheckOnLaunch]
  );

  const syncUrls = useMemo(() => buildGitHubSyncUrls(githubSyncConfig), [githubSyncConfig]);

  const buildConfig: ApkExportConfig = useMemo(
    () => ({
      appName: appName.trim() || 'AI 论文随身读',
      packageId: sanitizePackageId(packageIdInput),
      versionName: versionName.trim() || '2.0.0',
      versionCode: 2,
      defaultTheme,
      defaultFontSize,
      includeSections: {
        beginner: true,
        formulas: includeInteractiveNotes,
        benchmarks: true,
        glossary: includeInteractiveNotes
      },
      selectedCategories,
      dataStrategy,
      githubSync: githubSyncConfig
    }),
    [
      appName,
      packageIdInput,
      versionName,
      defaultTheme,
      defaultFontSize,
      includeInteractiveNotes,
      selectedCategories,
      dataStrategy,
      githubSyncConfig
    ]
  );

  const projectFiles = useMemo(() => {
    return generateAndroidProjectFiles(buildConfig, bundledPapers);
  }, [buildConfig, bundledPapers]);

  const metrics = useMemo(() => {
    return estimateExportMetrics(buildConfig, bundledPapers);
  }, [bundledPapers, buildConfig]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat)
        ? prev.length > 1
          ? prev.filter((c) => c !== cat)
          : prev
        : [...prev, cat]
    );
  };

  const triggerBrowserDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const handleDownloadApkProjectZip = () => {
    const zipBytes = createZipArchive(projectFiles);
    const blob = new Blob([zipBytes.buffer as ArrayBuffer], { type: 'application/zip' });
    const fileName = `AI-Paper-Lab-Android-APK-OTA-v${buildConfig.versionName}.zip`;
    triggerBrowserDownload(blob, fileName);
    setLastExportBanner({
      type: 'zip',
      fileName,
      sizeKB: Math.max(1, Math.round(zipBytes.byteLength / 1024)),
      paperCount: bundledPapers.length,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  const handleDownloadRemoteManifestJson = () => {
    const jsonContent = generateRemotePapersManifestJson(buildConfig, bundledPapers);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
    const fileName = githubSyncConfig.filePath.split('/').pop() || 'papers-manifest.json';
    triggerBrowserDownload(blob, fileName);
    setLastExportBanner({
      type: 'json',
      fileName,
      sizeKB: Math.max(1, Math.round(blob.size / 1024)),
      paperCount: bundledPapers.length,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  const handleDownloadMobileOfflineHtml = () => {
    const htmlContent = generateMobileOfflineHtml(buildConfig, bundledPapers);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const fileName = `AI-Paper-Lab-Mobile-OTA-Reader.html`;
    triggerBrowserDownload(blob, fileName);
    setLastExportBanner({
      type: 'html',
      fileName,
      sizeKB: Math.max(1, Math.round(blob.size / 1024)),
      paperCount: bundledPapers.length,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  // Simulator OTA actions
  const handleSimClearLocalCache = () => {
    setSimLocalPersisted(false);
    setSimHasOtaNewPaper(false);
    setSimActivePaperId(null);
    setSimLastSyncLog('已清空手机本地 filesDir/papers-manifest.json（当前模拟刚安装完的 0 数据空壳 APK）');
  };

  const handleSimSyncFromGitHub = (includeNewPaper: boolean = false) => {
    setSimSyncing(true);
    setTimeout(() => {
      setSimSyncing(false);
      setSimLocalPersisted(true);
      if (includeNewPaper) {
        setSimHasOtaNewPaper(true);
      }
      const total = bundledPapers.length + (includeNewPaper || simHasOtaNewPaper ? 1 : 0);
      setSimLastSyncLog(
        `✅ 已从 GitHub (${githubSyncConfig.owner}/${githubSyncConfig.repo}) 拉取 ${total} 篇论文并永久保存至本机 filesDir/papers-manifest.json`
      );
    }, 350);
  };

  // Resolve active file in code inspector
  const activeInspectorFile = useMemo(() => {
    const exact = projectFiles.find((f) => f.path === activeCodeTab);
    if (exact) return exact;
    const mainKt = projectFiles.find((f) => f.path.endsWith('MainActivity.kt'));
    return mainKt || projectFiles[0];
  }, [projectFiles, activeCodeTab]);

  const handleCopyInspectorCode = () => {
    if (!activeInspectorFile) return;
    navigator.clipboard?.writeText(activeInspectorFile.content);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1800);
  };

  // Papers currently available inside the simulated phone's local storage
  const simDevicePapers = useMemo(() => {
    if (!simLocalPersisted && dataStrategy === 'github_ota_empty_shell') {
      return [];
    }
    return simHasOtaNewPaper
      ? [SIMULATED_OTA_NEW_PAPER, ...bundledPapers]
      : bundledPapers;
  }, [simLocalPersisted, dataStrategy, simHasOtaNewPaper, bundledPapers]);

  // Filtered papers inside the simulated phone screen
  const simFilteredPapers = useMemo(() => {
    return simDevicePapers.filter((p) => {
      if (simTab === 'saved' && !simBookmarks.includes(p.id)) return false;
      if (simCategory !== '全部' && p.category !== simCategory) return false;
      const q = simSearch.trim().toLowerCase();
      if (!q) return true;
      return (
        p.titleZh.toLowerCase().includes(q) ||
        p.titleEn.toLowerCase().includes(q) ||
        p.arxivId.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [simDevicePapers, simTab, simBookmarks, simCategory, simSearch]);

  const simSelectedPaper = useMemo(() => {
    if (!simActivePaperId) return null;
    return simDevicePapers.find((p) => p.id === simActivePaperId) || null;
  }, [simDevicePapers, simActivePaperId]);

  const toggleSimBookmark = (paperId: string) => {
    setSimBookmarks((prev) =>
      prev.includes(paperId) ? prev.filter((id) => id !== paperId) : [...prev, paperId]
    );
  };

  // Phone simulator theme classes
  const phoneThemeClasses = useMemo(() => {
    if (defaultTheme === 'light') {
      return {
        shell: 'bg-slate-50 text-slate-900',
        card: 'bg-white border-slate-200 text-slate-900',
        subtext: 'text-slate-500',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        nav: 'bg-white/95 border-slate-200'
      };
    }
    if (defaultTheme === 'sepia') {
      return {
        shell: 'bg-[#f6f0e2] text-[#2d2419]',
        card: 'bg-[#efe6d4] border-[#dcd0b9] text-[#2d2419]',
        subtext: 'text-[#6c5b46]',
        badge: 'bg-[#e3d5bb] text-[#0f5b43] border-[#c8b798]',
        nav: 'bg-[#efe6d4]/95 border-[#dcd0b9]'
      };
    }
    return {
      shell: 'bg-slate-950 text-slate-100',
      card: 'bg-slate-900 border-slate-800 text-slate-100',
      subtext: 'text-slate-400',
      badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      nav: 'bg-slate-900/95 border-slate-800'
    };
  }, [defaultTheme]);

  const phoneFontClass =
    defaultFontSize === 'sm'
      ? 'text-[11px] leading-relaxed'
      : defaultFontSize === 'lg'
        ? 'text-[14px] leading-relaxed'
        : 'text-[12.5px] leading-relaxed';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToHub}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer border border-slate-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>返回论文探索大厅</span>
            </button>

            <div className="h-5 w-px bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Smartphone className="w-4 h-4 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-white tracking-tight">
                    安卓 APK 与 GitHub 云端同步阅读器工坊
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    空壳 APK + GitHub 本地持久化
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  APK 壳与论文数据彻底解耦：App 从 GitHub 拉取最新论文 JSON 并保存在手机本地存储，论文更新永不重装 APK
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <PWAInstallButton compact />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Export Success Notification Banner */}
        {lastExportBanner && (
          <div className="rounded-2xl bg-emerald-950/60 border border-emerald-500/40 p-4 sm:p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-white">
                    已生成并触发下载：{lastExportBanner.fileName}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-emerald-500/20 text-emerald-300">
                    {lastExportBanner.sizeKB} KB · 关联 {lastExportBanner.paperCount} 篇论文
                  </span>
                </div>
                {lastExportBanner.type === 'zip' ? (
                  <p className="text-xs text-slate-300 leading-relaxed">
                    工程包内含零内置数据的轻量 Kotlin WebView 宿主（带 <code className="text-emerald-300 font-mono">AndroidLocalStore</code> 原生文件持久化接口）与 <code className="text-emerald-300 font-mono">papers-manifest.json</code>。推送到 GitHub 后不仅自动编译 APK，以后更新仓库里的 <code className="text-emerald-300 font-mono">papers-manifest.json</code> 即可让手机端一键拉取最新论文保存到本机！
                  </p>
                ) : lastExportBanner.type === 'json' ? (
                  <p className="text-xs text-slate-300 leading-relaxed">
                    远端论文数据包 <code className="text-emerald-300 font-mono">{lastExportBanner.fileName}</code> 已生成！将此文件提交到你的 GitHub 仓库（<code className="text-emerald-300 font-mono">{githubSyncConfig.owner}/{githubSyncConfig.repo}</code>），手机上的 APK 点击「☁️ 同步 GitHub」即可下载并永久保存在手机本地。
                  </p>
                ) : (
                  <p className="text-xs text-slate-300 leading-relaxed">
                    支持 GitHub 云端拉取与本地持久化的单文件阅读器已导出！发到手机浏览器即可随时从 GitHub 同步最新论文并保存在本机缓存。
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setLastExportBanner(null)}
              className="px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs font-medium self-end md:self-center cursor-pointer"
            >
              收起提示
            </button>
          </div>
        )}

        {/* Main Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Architecture Switch + GitHub Config + Export Actions + Code Inspector (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Data Architecture Mode & Three Export Pathways */}
            <section className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-5 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>核心架构：APK 空壳与 GitHub 论文数据解耦热更新</span>
                  </span>
                  <h2 className="text-lg font-bold text-white mt-0.5">
                    安装一次 APK，后续新论文从 GitHub 下载并保存在手机本地
                  </h2>
                </div>
                <div className="text-right font-mono text-xs text-slate-400">
                  远端 JSON 包 <strong className="text-emerald-400">{metrics.manifestSizeKb} KB</strong> · 预估 APK{' '}
                  <strong className="text-white">{metrics.estimatedApkSizeMb} MB</strong>
                </div>
              </div>

              {/* Data Strategy Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDataStrategy('github_ota_empty_shell')}
                  className={`text-left p-4 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                    dataStrategy === 'github_ota_empty_shell'
                      ? 'bg-emerald-500/15 border-emerald-500/60 shadow-lg shadow-emerald-500/5'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <CloudDownload className="w-3.5 h-3.5" />
                      <span>模式 A · 纯空壳 APK + GitHub 下载存本机</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950">
                      推荐
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    APK 内部<strong>不写死任何论文数据（0 内置冗余）</strong>。打开 App 自动从 GitHub 下载 <code className="font-mono text-emerald-300">papers-manifest.json</code> 并永久写入手机原生私有目录 <code className="font-mono text-emerald-300">filesDir</code>，离线秒开、随时热更新！
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setDataStrategy('github_ota_with_seed')}
                  className={`text-left p-4 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                    dataStrategy === 'github_ota_with_seed'
                      ? 'bg-emerald-500/15 border-emerald-500/60 shadow-lg shadow-emerald-500/5'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5" />
                      <span>模式 B · 混合模式（内置初始种子 + GitHub 更新）</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-slate-300">
                      可选
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    APK 内置当前 {metrics.paperCount} 篇论文作为首次无网启动兜底，同时支持点击「同步 GitHub」拉取新论文覆盖保存到手机本地。
                  </p>
                </button>
              </div>

              {/* Three Download Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                {/* Action 1: Download Empty-Shell APK Project ZIP */}
                <div className="rounded-xl bg-slate-950/90 border border-emerald-500/35 p-4 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        1 · 首次安装构建
                      </span>
                      <FolderArchive className="w-4 h-4 text-emerald-400" />
                    </div>
                    <h3 className="text-xs font-bold text-white">
                      导出安卓空壳 APK 工程包 (.zip)
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      含 Kotlin <code className="font-mono text-slate-200">AndroidLocalStore</code> 本地持久化桥接、GitHub Actions 自动编译脚本与远端 JSON。
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadApkProjectZip}
                    data-testid="download-apk-zip-btn"
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>下载 APK 源码工程 (.zip)</span>
                  </button>
                </div>

                {/* Action 2: Download Remote papers-manifest.json for GitHub */}
                <div className="rounded-xl bg-slate-950/90 border border-teal-500/35 p-4 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30">
                        2 · 论文更新只传它
                      </span>
                      <FileJson className="w-4 h-4 text-teal-400" />
                    </div>
                    <h3 className="text-xs font-bold text-white">
                      导出 GitHub 论文数据包 (.json)
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      以后新增论文无需重新编译 APK！只需导出此 <code className="font-mono text-slate-200">papers-manifest.json</code> 传到 GitHub 供手机拉取。
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadRemoteManifestJson}
                    data-testid="download-manifest-json-btn"
                    className="w-full py-2.5 px-3 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 font-bold text-xs border border-teal-500/40 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <FileJson className="w-3.5 h-3.5" />
                    <span>导出 papers-manifest.json</span>
                  </button>
                </div>

                {/* Action 3: Download Single-File Mobile HTML Reader */}
                <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-4 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        3 · 手机浏览器即用
                      </span>
                      <Smartphone className="w-4 h-4 text-slate-400" />
                    </div>
                    <h3 className="text-xs font-bold text-white">
                      导出手机单文件阅读器 (.html)
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      同样支持从 GitHub 一键同步最新 JSON 或直接手动导入本地 <code className="font-mono text-slate-200">.json</code> 文件并写入手机缓存。
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadMobileOfflineHtml}
                    data-testid="download-mobile-html-btn"
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>导出手机阅读器 (.html)</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Step 2: GitHub Remote Repository & Multi-CDN Sync Configuration */}
            <section className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-4 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-emerald-400" />
                  <span>GitHub 远端论文数据源配置（内置三通道国内/全球自动加速）</span>
                </h2>
                <span className="text-xs font-mono text-emerald-400">
                  自动写入 APK 同步引擎
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    GitHub 用户名 / 组织
                  </label>
                  <input
                    type="text"
                    value={githubOwner}
                    onChange={(e) => setGithubOwner(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500"
                    placeholder="karryw188"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    GitHub 仓库名 (Repo)
                  </label>
                  <input
                    type="text"
                    value={githubRepo}
                    onChange={(e) => setGithubRepo(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500"
                    placeholder="ai-paper-lab-data"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    分支 (Branch)
                  </label>
                  <input
                    type="text"
                    value={githubBranch}
                    onChange={(e) => setGithubBranch(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                    placeholder="main"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    远端数据文件路径
                  </label>
                  <input
                    type="text"
                    value={githubFilePath}
                    onChange={(e) => setGithubFilePath(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                    placeholder="papers-manifest.json"
                  />
                </div>
              </div>

              {/* Multi-CDN Fallback URL Preview */}
              <div className="rounded-xl bg-slate-950 border border-slate-800/90 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-300">
                    手机端自动故障转移拉取链路（防止手机直连 GitHub Raw 超时）：
                  </span>
                  <label className="inline-flex items-center gap-1.5 text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoCheckOnLaunch}
                      onChange={(e) => setAutoCheckOnLaunch(e.target.checked)}
                      className="accent-emerald-500"
                    />
                    <span>首次启动若本机无数据自动从 GitHub 拉取</span>
                  </label>
                </div>
                <div className="space-y-1 text-[11px] font-mono">
                  <div className="flex items-center gap-2 text-emerald-400 truncate">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-[10px]">主源 CDN</span>
                    <span className="truncate">{syncUrls.jsDelivrUrl}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 truncate">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px]">备用源 1</span>
                    <span className="truncate">{syncUrls.rawUrl}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 truncate">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px]">备用源 2</span>
                    <span className="truncate">{syncUrls.ghProxyUrl}</span>
                  </div>
                </div>
              </div>

              {/* Automated GitHub Releases Publisher Card */}
              <div className="rounded-xl bg-emerald-950/30 border border-emerald-500/35 p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950">
                      GitHub Releases 自动发版已就绪
                    </span>
                    <span className="text-xs font-bold text-white">
                      推送后自动编译并发布 <code className="font-mono text-emerald-300">{buildConfig.packageId}-v{buildConfig.versionName}.apk</code> 到 Releases
                    </span>
                  </div>
                  <a
                    href={`https://github.com/${githubSyncConfig.owner}/${githubSyncConfig.repo}/releases`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:underline"
                  >
                    <span>打开目标 GitHub Releases 页面</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  由于当前云端沙箱未挂载你的个人 GitHub 私钥，工程包内已为你预置好 <strong>免配置自动发版流水线</strong>（<code className="font-mono text-emerald-300">softprops/action-gh-release@v2</code> + <code className="font-mono text-emerald-300">publish-to-github-release.sh</code>）。下载上方 <code className="font-mono text-emerald-300">.zip</code> 解压后运行以下一行命令，GitHub Actions 就会在云端自动编译 APK 并直接发布到你的 <strong>GitHub Releases</strong>：
                </p>

                <div className="flex items-center justify-between gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 font-mono text-xs text-emerald-300">
                  <span className="truncate">
                    chmod +x publish-to-github-release.sh && ./publish-to-github-release.sh
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(
                        'chmod +x publish-to-github-release.sh && ./publish-to-github-release.sh'
                      );
                      setCopiedReleaseCmd(true);
                      setTimeout(() => setCopiedReleaseCmd(false), 1800);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-sans font-semibold shrink-0 cursor-pointer flex items-center gap-1"
                  >
                    {copiedReleaseCmd ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-300">已复制命令</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>复制发版命令</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* Step 3: APK Basic Metadata & Reading Preferences */}
            <section className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-5 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span>APK 包名与手机端默认阅读偏好定制</span>
                </h2>
                <span className="text-xs font-mono text-slate-400">
                  实时同步右侧真机预览
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    手机桌面应用名称 (App Name)
                  </label>
                  <input
                    type="text"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="AI 论文随身读"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Android 包名 (Application ID)
                  </label>
                  <input
                    type="text"
                    value={packageIdInput}
                    onChange={(e) => setPackageIdInput(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500"
                    placeholder="com.aipaperlab.reader"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    版本号 (Version Name)
                  </label>
                  <input
                    type="text"
                    value={versionName}
                    onChange={(e) => setVersionName(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                    placeholder="2.0.0"
                  />
                </div>
              </div>

              {/* Theme & Font Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    手机端默认阅读主题
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'dark', label: '深空极夜' },
                      { id: 'light', label: '晨曦纯白' },
                      { id: 'sepia', label: '护眼羊皮纸' }
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setDefaultTheme(t.id as 'dark' | 'light' | 'sepia')}
                        className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          defaultTheme === t.id
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    手机端默认排版字号
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'sm', label: 'A- 紧凑' },
                      { id: 'md', label: 'A 标准' },
                      { id: 'lg', label: 'A+ 舒适大字' }
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setDefaultFontSize(f.id as 'sm' | 'md' | 'lg')}
                        className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          defaultFontSize === f.id
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category Selection */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    导出至 GitHub <code className="font-mono text-emerald-300">papers-manifest.json</code> 的论文分类（共 {bundledPapers.length} 篇）
                  </label>
                  <button
                    type="button"
                    onClick={() => setSelectedCategories(ALL_CATEGORIES)}
                    className="text-[11px] text-emerald-400 hover:underline cursor-pointer"
                  >
                    全选全部 37 篇
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {ALL_CATEGORIES.map((cat) => {
                    const active = selectedCategories.includes(cat);
                    const count = allPaperSummaries.filter((p) => p.category === cat).length;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                          active
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                            : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <span>{cat}</span>
                        <span className="text-[10px] font-mono opacity-80">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Generated Android Project Source Code Inspector */}
            <section className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-4 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FileCode2 className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-base font-bold text-white">
                    生成的 Android 原生持久化桥接与 GitHub 数据包源码预览
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleCopyInspectorCode}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer border border-slate-700"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">已复制代码</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>复制当前文件</span>
                    </>
                  )}
                </button>
              </div>

              {/* File Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {projectFiles
                  .filter((f) => !f.path.endsWith('assets/index.html'))
                  .map((file) => {
                    const shortLabel = file.path.split('/').pop() || file.path;
                    const isSelected = activeInspectorFile?.path === file.path;
                    return (
                      <button
                        key={file.path}
                        type="button"
                        onClick={() => setActiveCodeTab(file.path)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {shortLabel}
                      </button>
                    );
                  })}
              </div>

              <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
                <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>{activeInspectorFile?.path}</span>
                  <span>{activeInspectorFile?.descZh}</span>
                </div>
                <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-80 leading-relaxed">
                  <code>{activeInspectorFile?.content}</code>
                </pre>
              </div>
            </section>
          </div>

          {/* Right Column: Interactive Android Phone Simulator with GitHub OTA Sync & Local Storage Demo (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 flex flex-col items-center">
            <div className="w-full max-w-[390px] space-y-3">
              {/* Interactive OTA Test Bench Controls above Phone */}
              <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CloudDownload className="w-3.5 h-3.5" />
                    <span>真机 GitHub 同步与本机持久化演练台</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    本机已存: {simDevicePapers.length} 篇
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={handleSimClearLocalCache}
                    data-testid="sim-clear-local-btn"
                    className="py-1.5 px-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[10px] font-semibold cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3 h-3 text-rose-400" />
                    <span>模拟空壳初装</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSimSyncFromGitHub(false)}
                    data-testid="sim-sync-github-btn"
                    className="py-1.5 px-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold cursor-pointer flex items-center justify-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${simSyncing ? 'animate-spin' : ''}`} />
                    <span>拉取GitHub存本机</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSimSyncFromGitHub(true)}
                    data-testid="sim-ota-new-paper-btn"
                    className="py-1.5 px-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-[10px] font-bold cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>模拟新论文热更</span>
                  </button>
                </div>

                <div className="text-[10px] font-mono text-slate-400 bg-slate-950/90 px-2.5 py-1.5 rounded-lg border border-slate-800/80 truncate">
                  {simLastSyncLog}
                </div>
              </div>

              {/* Phone Bezel Frame */}
              <div className="rounded-[40px] p-3 bg-slate-900 border-4 border-slate-800 shadow-2xl">
                <div
                  className={`rounded-[30px] overflow-hidden flex flex-col h-[700px] border border-slate-800/60 transition-colors ${phoneThemeClasses.shell}`}
                >
                  {/* Simulated Android Status Bar */}
                  <div className="px-5 pt-2.5 pb-1.5 flex items-center justify-between text-[11px] font-mono opacity-80 shrink-0">
                    <span>09:41</span>
                    <div className="w-16 h-3.5 rounded-full bg-black/40" />
                    <span>5G · 本机离线可用</span>
                  </div>

                  {/* Mobile Reader App Header */}
                  <div className={`px-4 py-2.5 border-b shrink-0 ${phoneThemeClasses.nav}`}>
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-sm font-extrabold tracking-tight flex items-center gap-1.5">
                          <span>{buildConfig.appName}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                            本机 {simDevicePapers.length} 篇
                          </span>
                        </div>
                        <div className={`text-[10px] truncate max-w-[210px] ${phoneThemeClasses.subtext}`}>
                          源: github.com/{githubSyncConfig.owner}/{githubSyncConfig.repo}
                        </div>
                      </div>

                      {/* Quick in-phone theme switcher */}
                      <div className="flex items-center gap-1">
                        {(['dark', 'light', 'sepia'] as const).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setDefaultTheme(t)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold border cursor-pointer ${
                              defaultTheme === t
                                ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                                : 'border-current/20 opacity-70'
                            }`}
                          >
                            {t === 'dark' ? '夜' : t === 'light' ? '日' : '纸'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* In-Phone GitHub Sync Bar */}
                    <div className="mt-2 px-2.5 py-1.5 rounded-xl bg-black/15 border border-current/10 flex items-center justify-between gap-2 text-[10px]">
                      <span className="truncate opacity-80">
                        {simDevicePapers.length === 0
                          ? '☁️ 空壳状态：本机尚无论文数据'
                          : simHasOtaNewPaper
                            ? '✅ 已热更 GitHub 新增论文并存本机'
                            : '💾 已持久化于手机 filesDir 本地存储'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSimSyncFromGitHub(false)}
                        className="px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-bold shrink-0 cursor-pointer"
                      >
                        {simSyncing ? '同步中...' : '☁️ 同步GitHub'}
                      </button>
                    </div>

                    {/* Search bar inside phone */}
                    {!simSelectedPaper && simTab !== 'ota' && simDevicePapers.length > 0 && (
                      <div className="mt-2 space-y-2">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 opacity-50" />
                          <input
                            type="text"
                            value={simSearch}
                            onChange={(e) => setSimSearch(e.target.value)}
                            placeholder="搜索已保存在手机本地的论文..."
                            className="w-full rounded-xl pl-8 pr-3 py-1.5 text-xs bg-black/10 border border-current/15 focus:outline-none"
                          />
                        </div>

                        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
                          {['全部', ...selectedCategories].map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setSimCategory(c)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap cursor-pointer ${
                                simCategory === c
                                  ? 'bg-emerald-500 text-slate-950'
                                  : 'bg-black/10 opacity-75'
                              }`}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Phone Scrollable Viewport */}
                  <div className={`flex-1 overflow-y-auto p-3.5 space-y-3 ${phoneFontClass}`}>
                    {simTab === 'ota' ? (
                      <div className={`rounded-2xl border p-4 space-y-3 ${phoneThemeClasses.card}`}>
                        <div className="text-xs font-bold text-emerald-400">
                          ☁️ GitHub 远端数据源与本机存储管理
                        </div>
                        <div className="text-[11px] space-y-1">
                          <div className="opacity-75">安卓原生持久化路径：</div>
                          <code className="block p-2 rounded-lg bg-black/20 font-mono text-[10px] text-emerald-400 break-all">
                            /data/user/0/{buildConfig.packageId}/files/papers-manifest.json
                          </code>
                        </div>
                        <div className="text-[11px] space-y-1">
                          <div className="opacity-75">GitHub 自动同步源 (jsDelivr CDN)：</div>
                          <code className="block p-2 rounded-lg bg-black/20 font-mono text-[10px] break-all">
                            {syncUrls.jsDelivrUrl}
                          </code>
                        </div>
                        <div className="pt-1 flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => handleSimSyncFromGitHub(true)}
                            className="w-full py-2 px-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer"
                          >
                            ☁️ 立即拉取 GitHub 最新论文并写入本机
                          </button>
                          <button
                            type="button"
                            onClick={handleSimClearLocalCache}
                            className="w-full py-1.5 px-3 rounded-xl border border-current/20 text-xs opacity-80 cursor-pointer"
                          >
                            清空本机已下载的论文数据
                          </button>
                        </div>
                      </div>
                    ) : simDevicePapers.length === 0 ? (
                      /* Empty-Shell Initial State before GitHub Download */
                      <div className={`rounded-2xl border p-5 text-center space-y-3 my-6 ${phoneThemeClasses.card}`}>
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                          <CloudDownload className="w-5 h-5" />
                        </div>
                        <div className="text-sm font-extrabold">
                          当前 APK 为零内置数据空壳
                        </div>
                        <p className={`text-xs leading-relaxed ${phoneThemeClasses.subtext}`}>
                          手机本地 <code className="font-mono">filesDir/papers-manifest.json</code> 尚无缓存。点击下方按钮从 GitHub 仓库下载最新论文库并永久保存在本机！
                        </p>
                        <button
                          type="button"
                          onClick={() => handleSimSyncFromGitHub(false)}
                          className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg cursor-pointer"
                        >
                          ☁️ 从 GitHub 下载 {bundledPapers.length} 篇论文并保存至本机
                        </button>
                      </div>
                    ) : simSelectedPaper ? (
                      /* Mobile Paper Detail Reader View */
                      <div className="space-y-3">
                        <button
                          type="button"
                          onClick={() => setSimActivePaperId(null)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 text-xs font-bold cursor-pointer"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>返回手机本地论文列表</span>
                        </button>

                        <div className={`rounded-2xl border p-4 space-y-3 ${phoneThemeClasses.card}`}>
                          <div className="flex flex-wrap items-center justify-between gap-1.5">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${phoneThemeClasses.badge}`}>
                              {simSelectedPaper.arxivId} · {simSelectedPaper.category}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleSimBookmark(simSelectedPaper.id)}
                              className="text-xs font-bold text-emerald-400 cursor-pointer"
                            >
                              {simBookmarks.includes(simSelectedPaper.id) ? '★ 已收藏' : '☆ 收藏'}
                            </button>
                          </div>

                          <h3 className="text-base font-extrabold leading-snug">
                            {simSelectedPaper.titleZh}
                          </h3>
                          <p className={`text-[11px] italic font-serif ${phoneThemeClasses.subtext}`}>
                            {simSelectedPaper.titleEn}
                          </p>

                          <div className={`text-[11px] ${phoneThemeClasses.subtext}`}>
                            {simSelectedPaper.authors.join(', ')} ({simSelectedPaper.publishDate})
                          </div>

                          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-1">
                            <div className="text-[11px] font-bold text-emerald-400">
                              💡 手机速通核心结论 (TL;DR)
                            </div>
                            <p className="leading-relaxed">{simSelectedPaper.tldrZh}</p>
                          </div>

                          <div className="space-y-1.5">
                            <div className="text-xs font-bold">📊 关键实验指标</div>
                            <div className="grid grid-cols-2 gap-2">
                              {simSelectedPaper.keyMetrics.map((m, idx) => (
                                <div
                                  key={idx}
                                  className="p-2 rounded-xl bg-black/10 border border-current/10"
                                >
                                  <span className={`text-[10px] block ${phoneThemeClasses.subtext}`}>
                                    {m.label}
                                  </span>
                                  <span className="text-xs font-mono font-bold text-emerald-400">
                                    {m.value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {includeInteractiveNotes && simSelectedPaper.features.length > 0 && (
                            <div className="space-y-1.5">
                              <div className="text-xs font-bold">🔬 核心机制与实验台要点</div>
                              <ul className="space-y-1 pl-4 list-disc">
                                {simSelectedPaper.features.map((f, idx) => (
                                  <li key={idx}>{f}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {onSelectPaper && simSelectedPaper.id !== SIMULATED_OTA_NEW_PAPER.id && (
                            <button
                              type="button"
                              onClick={() => onSelectPaper(simSelectedPaper.id, 'simulator')}
                              className="w-full py-2 px-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                            >
                              <span>打开完整交互式算法实验台</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Mobile Paper Feed List */
                      simFilteredPapers.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => setSimActivePaperId(p.id)}
                          className={`rounded-2xl border p-3.5 space-y-2 transition-all cursor-pointer hover:border-emerald-500/50 ${phoneThemeClasses.card}`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${phoneThemeClasses.badge}`}>
                              {p.category}
                            </span>
                            <span className={`text-[10px] font-mono ${phoneThemeClasses.subtext}`}>
                              {p.arxivId}
                            </span>
                          </div>

                          <div className="font-bold text-sm leading-snug">{p.titleZh}</div>

                          <p className={`line-clamp-2 text-[11px] ${phoneThemeClasses.subtext}`}>
                            {p.tldrZh}
                          </p>

                          <div className="flex items-center justify-between pt-1 text-[10px]">
                            <span className="text-emerald-400 font-semibold">
                              点击本机离线精读 →
                            </span>
                            <span className="opacity-70">
                              {simBookmarks.includes(p.id) ? '★ 已收藏' : ''}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Simulated Android Bottom Navigation Bar */}
                  <div className={`px-3 py-2 border-t grid grid-cols-3 gap-1 shrink-0 ${phoneThemeClasses.nav}`}>
                    <button
                      type="button"
                      onClick={() => {
                        setSimTab('all');
                        setSimActivePaperId(null);
                      }}
                      className={`py-1 rounded-xl flex flex-col items-center gap-0.5 text-[10px] font-bold cursor-pointer ${
                        simTab === 'all' ? 'text-emerald-400' : 'opacity-60'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>本机文库 ({simDevicePapers.length})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSimTab('saved');
                        setSimActivePaperId(null);
                      }}
                      className={`py-1 rounded-xl flex flex-col items-center gap-0.5 text-[10px] font-bold cursor-pointer ${
                        simTab === 'saved' ? 'text-emerald-400' : 'opacity-60'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>书签 ({simBookmarks.length})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSimTab('ota');
                        setSimActivePaperId(null);
                      }}
                      className={`py-1 rounded-xl flex flex-col items-center gap-0.5 text-[10px] font-bold cursor-pointer ${
                        simTab === 'ota' ? 'text-emerald-400' : 'opacity-60'
                      }`}
                    >
                      <CloudDownload className="w-3.5 h-3.5" />
                      <span>GitHub同步</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
