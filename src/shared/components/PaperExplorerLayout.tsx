import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Sparkles,
  Cpu,
  BarChart3,
  HelpCircle,
  Globe,
  Search,
  ArrowUpRight,
  Compass,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Bookmark,
  ChevronRight,
  TrendingUp,
  Layers,
  ShieldAlert,
  Copy,
  Check,
  FileDown
} from 'lucide-react';
import { UniversalPaperData } from '../types/universalPaper.js';
import { ThemeToggle } from './ThemeToggle.js';

export type ExplorerViewMode = 'beginner' | 'reader' | 'simulator' | 'comparison' | 'glossary';
export type ExplorerLangMode = 'zh' | 'bilingual' | 'en';

interface PaperExplorerLayoutProps {
  paper: UniversalPaperData;
  simulatorComponent: React.ReactNode;
  onBackToHub?: () => void;
  initialView?: string;
}

export const PaperExplorerLayout: React.FC<PaperExplorerLayoutProps> = ({
  paper,
  simulatorComponent,
  onBackToHub,
  initialView = 'beginner'
}) => {
  const [currentView, setCurrentView] = useState<ExplorerViewMode>(
    (initialView as ExplorerViewMode) || 'beginner'
  );
  const [langMode, setLangMode] = useState<ExplorerLangMode>('zh');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('ai-paper-lab-fontsize');
      if (saved === 'sm' || saved === 'md' || saved === 'lg') return saved;
    }
    return 'md';
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedBibtex, setCopiedBibtex] = useState<boolean>(false);

  // Beginner Guide States
  const [activeStep, setActiveStep] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: number]: number | null }>({});

  // Reader States
  const [activeSectionId, setActiveSectionId] = useState<string>('sec-header');
  const [bookmarkedSections, setBookmarkedSections] = useState<string[]>([]);
  const [expandedTakeaways, setExpandedTakeaways] = useState<{ [secId: string]: boolean }>(() => {
    const init: { [secId: string]: boolean } = {};
    paper.chapters.slice(0, 2).forEach(ch => {
      init[ch.id] = true;
    });
    return init;
  });

  // Comparison States
  const [selectedBenchmarkId, setSelectedBenchmarkId] = useState<string>(
    paper.benchmarks[0]?.id || ''
  );
  const [activeCaseIdx, setActiveCaseIdx] = useState<number>(0);

  // Glossary States
  const [selectedGlossaryCat, setSelectedGlossaryCat] = useState<string>('全部');
  const [expandedTermId, setExpandedTermId] = useState<string | null>(
    paper.glossaryItems[0]?.id || null
  );

  useEffect(() => {
    if (initialView) {
      setCurrentView(initialView as ExplorerViewMode);
    }
  }, [initialView]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView, paper.id]);

  const handleFontSizeChange = (size: 'sm' | 'md' | 'lg') => {
    setFontSize(size);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('ai-paper-lab-fontsize', size);
    }
  };

  const handleCopyBibtex = () => {
    navigator.clipboard.writeText(paper.bibtex);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2000);
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedSections(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleTakeaways = (secId: string) => {
    setExpandedTakeaways(prev => ({
      ...prev,
      [secId]: !prev[secId]
    }));
  };

  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const displayedChapters = useMemo(() => {
    if (!searchQuery.trim()) return paper.chapters;
    const q = searchQuery.toLowerCase();
    return paper.chapters.filter(
      s =>
        s.titleZh.toLowerCase().includes(q) ||
        s.titleEn.toLowerCase().includes(q) ||
        s.summaryZh.toLowerCase().includes(q) ||
        s.contentZh.some(c => c.toLowerCase().includes(q)) ||
        s.contentEn.some(c => c.toLowerCase().includes(q))
    );
  }, [paper.chapters, searchQuery]);

  const filteredGlossary = useMemo(() => {
    return paper.glossaryItems.filter(t => {
      const matchCat = selectedGlossaryCat === '全部' || t.category === selectedGlossaryCat;
      const q = searchQuery.toLowerCase();
      const matchQuery =
        !q ||
        t.termZh.toLowerCase().includes(q) ||
        t.termEn.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q) ||
        t.technicalDetail.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [paper.glossaryItems, selectedGlossaryCat, searchQuery]);

  const activeBenchmark =
    paper.benchmarks.find(b => b.id === selectedBenchmarkId) || paper.benchmarks[0];

  const textClass =
    fontSize === 'sm'
      ? 'text-xs leading-relaxed'
      : fontSize === 'lg'
      ? 'text-base leading-loose'
      : 'text-sm leading-relaxed';

  const headingClass =
    fontSize === 'sm' ? 'text-lg' : fontSize === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
        {/* Top Banner with Citation Meta & Direct PDF / Abs Links */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/60 text-xs text-slate-400">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono font-medium border border-emerald-500/20">
              {paper.arxivId}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 font-medium border border-teal-500/20">
              {paper.venueBadge}
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="text-slate-300 font-medium">
              {paper.affiliations.join(' & ')}
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="text-slate-400">{paper.publishDate}</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={paper.absUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors"
            >
              <span>arXiv 摘要页</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a
              href={paper.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>PDF 原文直链</span>
            </a>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            {onBackToHub && (
              <button
                onClick={onBackToHub}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500/40 transition-all cursor-pointer flex-shrink-0 shadow-sm"
                title="返回论文目录大厅"
              >
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span>返回大厅</span>
              </button>
            )}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  {paper.systemTitleZh}
                </h1>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                  中文完整精读
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-1">{paper.titleEn}</p>
            </div>
          </div>

          {/* 5 Functional Modules Navigation */}
          <nav
            className="flex items-center overflow-x-auto pb-1 md:pb-0 gap-1 scrollbar-none"
            aria-label="主要功能导航"
          >
            <button
              onClick={() => setCurrentView('beginner')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                currentView === 'beginner'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>5分钟速通导览</span>
            </button>

            <button
              onClick={() => setCurrentView('reader')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                currentView === 'reader'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>全文精读 &amp; 解析</span>
            </button>

            <button
              onClick={() => setCurrentView('simulator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                currentView === 'simulator'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>{paper.simulatorTabLabel}</span>
            </button>

            <button
              onClick={() => setCurrentView('comparison')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                currentView === 'comparison'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              <span>范式与基准对比</span>
            </button>

            <button
              onClick={() => setCurrentView('glossary')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                currentView === 'glossary'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>核心概念词典</span>
            </button>
          </nav>
        </div>

        {/* Control Bar: Search, Language, Font Size, Theme */}
        <div className="bg-slate-950/60 border-t border-slate-800/80 px-4 sm:px-6 py-2">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="搜索本论文章节、概念、公式或实验..."
                className="w-full bg-slate-900/80 border border-slate-700/60 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40"
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {currentView === 'reader' && (
                <div
                  className="inline-flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-0.5"
                  role="group"
                  aria-label="阅读语言切换"
                >
                  <Globe className="w-3.5 h-3.5 text-slate-400 ml-2 mr-0.5" />
                  <button
                    type="button"
                    onClick={() => setLangMode('zh')}
                    aria-pressed={langMode === 'zh'}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      langMode === 'zh'
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    中文译本
                  </button>
                  <button
                    type="button"
                    onClick={() => setLangMode('bilingual')}
                    aria-pressed={langMode === 'bilingual'}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      langMode === 'bilingual'
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    双语对照
                  </button>
                  <button
                    type="button"
                    onClick={() => setLangMode('en')}
                    aria-pressed={langMode === 'en'}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      langMode === 'en'
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    英文原版
                  </button>
                </div>
              )}

              <div
                className="inline-flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-0.5"
                role="group"
                aria-label="全局字号调节"
              >
                <span className="text-slate-400 pl-2 pr-1 text-xs font-medium">字号:</span>
                <button
                  type="button"
                  onClick={() => handleFontSizeChange('sm')}
                  aria-pressed={fontSize === 'sm'}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    fontSize === 'sm'
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  小
                </button>
                <button
                  type="button"
                  onClick={() => handleFontSizeChange('md')}
                  aria-pressed={fontSize === 'md'}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    fontSize === 'md'
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  中
                </button>
                <button
                  type="button"
                  onClick={() => handleFontSizeChange('lg')}
                  aria-pressed={fontSize === 'lg'}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    fontSize === 'lg'
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  大
                </button>
              </div>

              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area with Global Font Scaling */}
      <div className={`flex-1 paper-fontsize-${fontSize}`} data-fontsize={fontSize}>
        {/* VIEW 1: BEGINNER GUIDE */}
        {currentView === 'beginner' && (
          <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
            <div className="relative rounded-2xl overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 shadow-2xl">
              <div className="relative z-10 max-w-3xl space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>面向初学者的 5 分钟通俗图文导览 · {paper.venueBadge}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {paper.titleZh}
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {paper.tldrZh}
                </p>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => setCurrentView('simulator')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <span>进入「{paper.simulatorTabLabel}」亲自试玩</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCurrentView('reader')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all cursor-pointer"
                  >
                    <span>阅读完整论文翻译</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 4-Step Walkthrough */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>四步掌握核心精髓</span>
                  <span className="text-xs font-normal text-slate-400">(点击下方卡片依次解锁)</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {activeStep + 1} / {paper.beginnerSteps.length}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {paper.beginnerSteps.map((st, idx) => {
                  const isCurrent = activeStep === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveStep(idx)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-slate-800 border-emerald-500/60 shadow-md ring-1 ring-emerald-500/30'
                          : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            isCurrent
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-slate-800/80 text-slate-500'
                          }`}
                        >
                          STEP 0{idx + 1}
                        </span>
                      </div>
                      <div className="font-semibold text-xs text-slate-200 line-clamp-1">
                        {st.badge}
                      </div>
                    </button>
                  );
                })}
              </div>

              {paper.beginnerSteps[activeStep] && (
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                  <div className="border-b border-slate-800 pb-3">
                    <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                      {paper.beginnerSteps[activeStep].badge}
                    </span>
                    <h4 className="text-lg font-bold text-white mt-0.5">
                      {paper.beginnerSteps[activeStep].title}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {paper.beginnerSteps[activeStep].subtitle}
                    </p>
                  </div>

                  <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
                    {paper.beginnerSteps[activeStep].contentParagraphs.map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}

                    {paper.beginnerSteps[activeStep].highlightBox && (
                      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                        <div className="text-xs font-bold text-emerald-400">
                          {paper.beginnerSteps[activeStep].highlightBox!.title}
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-300 list-disc pl-5 marker:text-emerald-500">
                          {paper.beginnerSteps[activeStep].highlightBox!.points.map((pt, i) => (
                            <li key={i} className="leading-relaxed">
                              {pt}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 font-medium">
                      💡 <strong>核心启示：</strong>
                      {paper.beginnerSteps[activeStep].takeawayCallout}
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between items-center text-xs text-slate-400 border-t border-slate-800/80">
                    <button
                      disabled={activeStep === 0}
                      onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 cursor-pointer"
                    >
                      上一环节
                    </button>
                    <button
                      disabled={activeStep === paper.beginnerSteps.length - 1}
                      onClick={() =>
                        setActiveStep(prev =>
                          Math.min(paper.beginnerSteps.length - 1, prev + 1)
                        )
                      }
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-slate-950 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-emerald-500 cursor-pointer flex items-center gap-1"
                    >
                      <span>下一环节</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Quiz */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">
                  初学者即测即练：检验你对本篇论文核心机制的理解
                </h3>
              </div>

              <div className="space-y-6">
                {paper.beginnerQuiz.map((q, idx) => {
                  const selected = quizAnswers[q.id] ?? null;
                  const isAnswered = selected !== null;
                  const isCorrect = selected === q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3"
                    >
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="font-medium text-slate-200 text-sm">{q.question}</div>
                      </div>

                      <div className="space-y-2 pl-7">
                        {q.options.map((opt, optIdx) => {
                          const isThisSelected = selected === optIdx;
                          let btnStyle =
                            'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800';

                          if (isAnswered) {
                            if (optIdx === q.correctIndex) {
                              btnStyle =
                                'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-medium';
                            } else if (isThisSelected && !isCorrect) {
                              btnStyle = 'bg-red-950/40 border-red-500 text-red-300';
                            } else {
                              btnStyle = 'bg-slate-900/40 border-slate-800/40 text-slate-500';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={isAnswered}
                              onClick={() =>
                                setQuizAnswers(prev => ({ ...prev, [q.id]: optIdx }))
                              }
                              className={`w-full p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${btnStyle}`}
                            >
                              <span>
                                {String.fromCharCode(65 + optIdx)}. {opt}
                              </span>
                              {isAnswered && optIdx === q.correctIndex && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 ml-2" />
                              )}
                              {isAnswered && isThisSelected && !isCorrect && (
                                <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 ml-2" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {isAnswered && (
                        <div
                          className={`mt-2 p-3 rounded-lg text-xs leading-relaxed ml-7 ${
                            isCorrect
                              ? 'bg-emerald-950/30 text-emerald-300 border border-emerald-800/30'
                              : 'bg-amber-950/30 text-amber-300 border border-amber-800/30'
                          }`}
                        >
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: FULL PAPER READER */}
        {currentView === 'reader' && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Sticky TOC */}
              <aside className="hidden lg:block lg:col-span-3 sticky top-28 space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-bold text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                      <span>论文章节目录 (TOC)</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {paper.chapters.length} 章节
                    </span>
                  </div>

                  <nav className="space-y-1 text-xs" aria-label="论文目录">
                    <button
                      onClick={() => scrollToSection('sec-header')}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
                        activeSectionId === 'sec-header'
                          ? 'bg-emerald-500/15 text-emerald-300 font-semibold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="font-mono text-[10px] text-slate-500">00</span>
                      <span className="line-clamp-1">论文元数据与摘要</span>
                    </button>

                    {paper.chapters.map(sec => {
                      const isActive = activeSectionId === sec.id;
                      const isBookmarked = bookmarkedSections.includes(sec.id);

                      return (
                        <button
                          key={sec.id}
                          onClick={() => scrollToSection(sec.id)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                            isActive
                              ? 'bg-emerald-500/15 text-emerald-300 font-semibold border-l-2 border-emerald-500'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-mono text-[10px] text-slate-500 flex-shrink-0">
                              {sec.chapterNumber}
                            </span>
                            <span className="truncate">{sec.titleZh}</span>
                          </div>
                          {isBookmarked && (
                            <Bookmark className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </nav>

                  <div className="pt-2 border-t border-slate-800 space-y-1.5">
                    <button
                      onClick={() => setCurrentView('simulator')}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-medium transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span className="flex items-center gap-1.5">
                        <Cpu className="w-3 h-3 text-emerald-400" />
                        <span>{paper.simulatorTabLabel}</span>
                      </span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setCurrentView('glossary')}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        <span>核心概念词典</span>
                      </span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </aside>

              {/* Main Article Content */}
              <main className="lg:col-span-9 space-y-12">
                <section
                  id="sec-header"
                  className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6"
                >
                  <div className="space-y-3 border-b border-slate-800 pb-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {paper.arxivId}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/30">
                        {paper.venueBadge}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {paper.publishDate}
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                      {paper.titleZh}
                    </h1>

                    <p className="text-sm sm:text-base font-serif italic text-slate-400">
                      {paper.titleEn}
                    </p>

                    <div className="pt-2 text-xs text-slate-300 flex flex-wrap gap-x-4 gap-y-1.5">
                      {paper.authors.map((auth, i) => (
                        <span key={i} className="font-medium text-slate-200">
                          {auth}
                          {i < paper.authors.length - 1 && (
                            <span className="text-slate-600 ml-4">•</span>
                          )}
                        </span>
                      ))}
                    </div>

                    <div className="text-xs text-slate-500">
                      研究机构：{paper.affiliations.join(' / ')}
                    </div>
                  </div>

                  {/* TL;DR Box */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-500/30 text-xs text-emerald-200/90 leading-relaxed space-y-1">
                    <div className="font-bold text-emerald-300 flex items-center gap-1.5 text-sm">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>一句话极速读懂 (TL;DR):</span>
                    </div>
                    <p className="pl-5 text-slate-200 font-serif">{paper.tldrZh}</p>
                  </div>

                  {/* Core Innovations Grid */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-400">
                      论文四大奠基性创新支柱：
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {paper.coreInnovations.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1"
                        >
                          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {item.title}
                          </span>
                          <p className="text-xs text-slate-400 leading-normal">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Abstract */}
                  <div className="space-y-3 pt-2 border-t border-slate-800/80">
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-400" />
                      <span>论文摘要 (Abstract)</span>
                    </h3>

                    {langMode !== 'en' && (
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed font-serif">
                        {paper.abstractZh}
                      </div>
                    )}

                    {langMode !== 'zh' && (
                      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs sm:text-sm text-slate-400 leading-relaxed font-serif italic">
                        {paper.abstractEn}
                      </div>
                    )}
                  </div>
                </section>

                {/* Chapters Loop */}
                {displayedChapters.map(sec => {
                  const isBookmarked = bookmarkedSections.includes(sec.id);
                  const isTakeawayOpen = expandedTakeaways[sec.id] ?? false;

                  return (
                    <article
                      key={sec.id}
                      id={sec.id}
                      className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6 scroll-mt-28"
                    >
                      <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
                        <div>
                          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                            <span>第 {sec.chapterNumber} 章</span>
                            <span className="text-slate-600">•</span>
                            <span>CHAPTER {sec.chapterNumber}</span>
                          </div>

                          <h2
                            className={`${headingClass} font-extrabold text-white mt-1 tracking-tight`}
                          >
                            {sec.titleZh}
                          </h2>

                          <p className="text-xs sm:text-sm font-serif italic text-slate-400 mt-0.5">
                            {sec.titleEn}
                          </p>
                        </div>

                        <button
                          onClick={() => toggleBookmark(sec.id)}
                          className={`p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                            isBookmarked
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                          }`}
                          title={isBookmarked ? '取消收藏本章' : '收藏本章'}
                        >
                          <Bookmark
                            className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`}
                          />
                        </button>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-950/80 border-l-4 border-emerald-500 text-xs text-slate-300 font-medium">
                        <strong>本章导读：</strong>
                        {sec.summaryZh}
                      </div>

                      {sec.beginnerTakeaways.length > 0 && (
                        <div className="rounded-xl border border-amber-900/30 bg-amber-950/15 overflow-hidden">
                          <button
                            onClick={() => toggleTakeaways(sec.id)}
                            className="w-full px-4 py-2.5 flex items-center justify-between text-left text-xs font-bold text-amber-300 hover:bg-amber-950/20 transition-colors cursor-pointer"
                          >
                            <span className="flex items-center gap-2">
                              <Lightbulb className="w-4 h-4 text-amber-400" />
                              <span>初学者通俗白话拆解（不懂专业术语请看这里）</span>
                            </span>
                            <span className="text-[11px] text-amber-400 font-normal">
                              {isTakeawayOpen ? '收起白话笔记 ▲' : '展开白话笔记 ▼'}
                            </span>
                          </button>

                          {isTakeawayOpen && (
                            <div className="p-4 border-t border-amber-900/30 space-y-3 text-xs">
                              {sec.beginnerTakeaways.map((take, tIdx) => (
                                <div
                                  key={tIdx}
                                  className="space-y-1.5 p-3 rounded-lg bg-slate-950/60 border border-amber-950"
                                >
                                  <div className="font-semibold text-amber-200">
                                    ❓ {take.question}
                                  </div>
                                  <p className="text-slate-300 leading-relaxed pl-4">
                                    {take.answerZh}
                                  </p>
                                  <div className="text-[11px] text-amber-300/90 italic pl-4 border-l-2 border-amber-500/40 my-1">
                                    💡 生活化比喻：{take.analogyZh}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="space-y-4">
                        {sec.contentZh.map((paragraph, pIdx) => (
                          <div key={pIdx} className="space-y-2">
                            {langMode !== 'en' && (
                              <p
                                className={`${textClass} text-slate-200 leading-relaxed font-serif indent-6 sm:indent-8 text-justify`}
                              >
                                {paragraph}
                              </p>
                            )}

                            {langMode !== 'zh' && sec.contentEn[pIdx] && (
                              <p
                                className={`${textClass} text-slate-400 leading-relaxed font-serif italic pl-4 border-l-2 border-slate-700 text-justify`}
                              >
                                {sec.contentEn[pIdx]}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>

                      {sec.formulas && sec.formulas.length > 0 && (
                        <div className="space-y-2 pt-2">
                          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                            <Cpu className="w-3.5 h-3.5 text-teal-400" />
                            <span>核心数学推导与目标函数：</span>
                          </span>
                          <div className="space-y-2">
                            {sec.formulas.map((form, fIdx) => (
                              <div
                                key={fIdx}
                                className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
                              >
                                <div className="text-center font-mono text-sm sm:text-base text-teal-300 py-1 overflow-x-auto">
                                  {form.latex}
                                </div>
                                <p className="text-xs text-slate-400 text-center font-serif">
                                  {form.explanationZh}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                        <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>本章关键要点与学术结论：</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-300 pl-4 list-disc marker:text-emerald-500">
                          {sec.keyInsights.map((insight, inIdx) => (
                            <li key={inIdx} className="leading-relaxed">
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </article>
                  );
                })}
              </main>
            </div>
          </div>
        )}

        {/* VIEW 3: INTERACTIVE SIMULATOR */}
        {currentView === 'simulator' && simulatorComponent}

        {/* VIEW 4: BENCHMARK & PARADIGM COMPARISON */}
        {currentView === 'comparison' && (
          <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>技术范式与权威基准深度横向对比</span>
                    <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/15 text-emerald-300 rounded border border-emerald-500/30">
                      {paper.venueBadge} 实验全表
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    全面对比本论文模型与主流基线在标准学术评测集上的准确率、吞吐延迟与架构特性。
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-800/80 flex-wrap">
                <span className="text-xs text-slate-400 font-medium">切换对比基准数据集：</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {paper.benchmarks.map(b => (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBenchmarkId(b.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeBenchmark?.id === b.id
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {b.nameZh}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {activeBenchmark && (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">
                      {activeBenchmark.nameZh} — {activeBenchmark.metricLabel}
                    </h3>
                  </div>
                  <span className="text-xs text-emerald-400 font-mono font-semibold">
                    {activeBenchmark.higherIsBetter ? '越高越好' : '越低越好'} ({activeBenchmark.unit})
                  </span>
                </div>

                <div className="space-y-3">
                  {activeBenchmark.items.map(item => (
                    <div key={item.modelName} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span
                          className={`font-medium flex items-center gap-2 ${
                            item.isOurModel ? 'text-emerald-300 font-bold' : 'text-slate-300'
                          }`}
                        >
                          <span>{item.modelName}</span>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 text-[10px] rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                              {item.badge}
                            </span>
                          )}
                        </span>
                        <span
                          className={`font-mono font-bold ${
                            item.isOurModel ? 'text-emerald-400 text-sm' : 'text-slate-400'
                          }`}
                        >
                          {item.value}
                          {activeBenchmark.unit}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            item.isOurModel
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                              : 'bg-slate-600'
                          }`}
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(6, (item.value / item.maxScale) * 100)
                            )}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/30 text-xs text-emerald-300 leading-relaxed">
                  💡 <strong>实验结论：</strong>
                  {activeBenchmark.summaryConclusion}
                </div>
              </div>
            )}

            {/* Feature Comparison Table */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>主流架构关键特性全景对照表</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                      <th className="py-3 px-3 font-semibold">模型 / 架构范式</th>
                      <th className="py-3 px-3 font-semibold">核心工作机理</th>
                      <th className="py-3 px-3 font-semibold">语义交互模式</th>
                      <th className="py-3 px-3 font-semibold">索引与存储形式</th>
                      <th className="py-3 px-3 font-semibold">查询推理延迟</th>
                      <th className="py-3 px-3 font-semibold">代表性精度水位</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {paper.comparisonTable.map(row => (
                      <tr
                        key={row.paradigmNameEn}
                        className={`transition-colors ${
                          row.isOurModel
                            ? 'bg-emerald-950/20 text-emerald-200 font-medium'
                            : 'text-slate-300 hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="font-semibold text-white">{row.paradigmNameZh}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {row.paradigmNameEn}
                          </div>
                        </td>
                        <td className="py-3 px-3 max-w-[240px] text-slate-400 leading-normal">
                          {row.mechanismZh}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-mono text-emerald-300">
                          {row.interactionMode}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap text-slate-300">
                          {row.indexType}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-mono">
                          {row.queryLatency}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-bold text-emerald-400">
                          {row.accuracyRank}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Real Case Studies */}
            {paper.caseStudies.length > 0 && (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      <span>真实查询案例对比剖析</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      通过论文中的真实测试样本，直观对比不同方法为何成功或翻车。
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {paper.caseStudies.map((sc, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => setActiveCaseIdx(sIdx)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          activeCaseIdx === sIdx
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        案例 0{sIdx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {paper.caseStudies[activeCaseIdx] && (
                  <div className="space-y-4 pt-1">
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[11px] text-slate-500 font-semibold block mb-1">
                        {paper.caseStudies[activeCaseIdx].title} — 测试输入 (Query):
                      </span>
                      <div className="text-sm font-medium text-slate-200">
                        “{paper.caseStudies[activeCaseIdx].query}”
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {paper.caseStudies[activeCaseIdx].cards.map((card, cIdx) => (
                        <div
                          key={cIdx}
                          className={`p-4 rounded-xl border space-y-1.5 ${
                            card.isSuccess
                              ? 'bg-emerald-950/30 border-emerald-500/40 ring-1 ring-emerald-500/20'
                              : 'bg-slate-950/60 border-slate-800/80'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-xs font-bold ${
                                card.isSuccess ? 'text-emerald-300' : 'text-slate-300'
                              }`}
                            >
                              {card.methodName}
                            </span>
                            <span
                              className={`text-[10px] font-semibold flex items-center gap-0.5 ${
                                card.isSuccess
                                  ? 'text-emerald-400'
                                  : card.isWarning
                                  ? 'text-amber-400'
                                  : 'text-red-400'
                              }`}
                            >
                              {card.isSuccess ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : (
                                <XCircle className="w-3 h-3" />
                              )}
                              <span>{card.status}</span>
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">{card.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* VIEW 5: GLOSSARY */}
        {currentView === 'glossary' && (
          <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>核心概念与技术术语双解词典</span>
                    <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20">
                      大白话比喻 + 严谨数学定义
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    点击任意词条展开通俗生活化比喻、严谨学术定义及其在本篇论文中的核心作用。
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-800/80">
                {['全部', ...paper.glossaryCategories].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedGlossaryCat(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      selectedGlossaryCat === cat
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGlossary.map(term => {
                const isExpanded = expandedTermId === term.id;
                return (
                  <div
                    key={term.id}
                    onClick={() => setExpandedTermId(isExpanded ? null : term.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3.5 ${
                      isExpanded
                        ? 'bg-slate-900 border-emerald-500/60 shadow-xl shadow-emerald-500/5 ring-1 ring-emerald-500/30'
                        : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900/90 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-base font-bold text-white tracking-tight">
                            {term.termZh}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-emerald-400 border border-slate-700">
                            {term.category}
                          </span>
                        </div>
                        <div className="text-xs font-mono text-slate-400 mt-0.5">
                          {term.termEn}
                        </div>
                      </div>
                      <span className="text-xs text-emerald-400 font-medium">
                        {isExpanded ? '收起详情 ▲' : '展开详解 ▼'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{term.summary}</p>

                    {isExpanded && (
                      <div className="space-y-3 pt-3 border-t border-slate-800/80 text-xs">
                        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-900/30 text-amber-200/90 space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-amber-300 text-[11px]">
                            <Lightbulb className="w-3.5 h-3.5" />
                            <span>初学者生活化大白话比喻 (Intuitive Analogy):</span>
                          </div>
                          <p className="leading-relaxed text-[11px] text-amber-100/90 pl-5">
                            {term.analogy}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-slate-300 text-[11px]">
                            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                            <span>严谨学术原理解析 (Formal Definition):</span>
                          </div>
                          <p className="leading-relaxed text-slate-400 text-[11px] pl-5 font-serif">
                            {term.technicalDetail}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/30 space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-[11px]">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>在本篇论文中的核心作用:</span>
                          </div>
                          <p className="leading-relaxed text-emerald-200/90 text-[11px] pl-5">
                            {term.paperApplication}
                          </p>
                        </div>

                        {term.formula && (
                          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-teal-300 overflow-x-auto text-center">
                            {term.formula}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer & BibTeX Citation */}
      <footer className="border-t border-slate-800 bg-slate-900/90 py-10 px-4 mt-16 text-slate-400 text-xs">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{paper.systemTitleZh}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400">
                  {paper.arxivId}
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-md">{paper.tldrZh}</p>
              <div className="pt-2 flex items-center gap-4 text-xs">
                <a
                  href={paper.absUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  <span>arXiv 摘要页 ({paper.arxivId})</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href={paper.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal-400 hover:text-teal-300 flex items-center gap-1"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>下载原文 PDF</span>
                </a>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">学术引用 (BibTeX Citation):</span>
                <button
                  onClick={handleCopyBibtex}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                >
                  {copiedBibtex ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">已复制</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>复制 BibTeX</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="text-[10px] font-mono text-slate-400 overflow-x-auto p-2 bg-slate-900/60 rounded border border-slate-800/80 leading-relaxed">
                {paper.bibtex}
              </pre>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 text-[11px]">
            <div>本交互式学习平台依据学者发表成果进行结构化中文翻译与教育型探索展示。</div>
            <div>
              {paper.arxivId} • {paper.venueBadge}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
