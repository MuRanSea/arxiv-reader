import React from 'react';
import { BookOpen, Sparkles, Cpu, BarChart3, HelpCircle, Globe, Search, ArrowUpRight, Compass } from 'lucide-react';
import { PAPER_META } from '../data/paperContent.js';
import { ThemeToggle } from '../../../../src/shared/components/ThemeToggle.js';

export type ViewMode = 'reader' | 'beginner' | 'simulator' | 'comparison' | 'glossary';
export type LangMode = 'zh' | 'bilingual' | 'en';

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  langMode: LangMode;
  onLangModeChange: (lang: LangMode) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  fontSize: 'sm' | 'md' | 'lg';
  onFontSizeChange: (size: 'sm' | 'md' | 'lg') => void;
  onBackToHub?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  langMode,
  onLangModeChange,
  searchQuery,
  onSearchChange,
  fontSize,
  onFontSizeChange,
  onBackToHub,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      {/* Top Banner with Paper Citation Meta */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/60 text-xs text-slate-400">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono font-medium border border-emerald-500/20">
            {PAPER_META.arxivId}
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="text-slate-300 font-medium">Cornell University & ASAPP Research</span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="text-slate-400">{PAPER_META.publishDate}</span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href={PAPER_META.doi}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <span>arXiv 原文</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <a
            href={PAPER_META.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <span>代码仓库</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Title & Brand */}
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
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                DecisionRAG 论文精读与探索系统
              </h1>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                中文完整版
              </span>
            </div>
            <p className="text-xs text-slate-400 line-clamp-1">
              Retriever-Free Retrieval: Navigating Documents with Decision Models
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center overflow-x-auto pb-1 md:pb-0 gap-1 scrollbar-none" aria-label="主要功能导航">
          <button
            onClick={() => onViewChange('beginner')}
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
            onClick={() => onViewChange('reader')}
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
            onClick={() => onViewChange('simulator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              currentView === 'simulator'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>决策导航实验台</span>
          </button>

          <button
            onClick={() => onViewChange('comparison')}
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
            onClick={() => onViewChange('glossary')}
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

      {/* Control Bar: Language, Font Size, Search Filter */}
      <div className="bg-slate-950/60 border-t border-slate-800/80 px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="搜索论文内容、概念、数学公式或实验..."
              className="w-full bg-slate-900/80 border border-slate-700/60 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40"
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Language toggle (Active in Reader mode) */}
            {currentView === 'reader' && (
              <div
                className="inline-flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-0.5"
                role="group"
                aria-label="阅读语言切换"
              >
                <Globe className="w-3.5 h-3.5 text-slate-400 ml-2 mr-0.5" />
                <button
                  type="button"
                  onClick={() => onLangModeChange('zh')}
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
                  onClick={() => onLangModeChange('bilingual')}
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
                  onClick={() => onLangModeChange('en')}
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

            {/* Font size adjustments (Works across all views) */}
            <div
              className="inline-flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-0.5"
              role="group"
              aria-label="全局字号调节"
            >
              <span className="text-slate-400 pl-2 pr-1 text-xs font-medium">字号:</span>
              <button
                type="button"
                onClick={() => onFontSizeChange('sm')}
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
                onClick={() => onFontSizeChange('md')}
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
                onClick={() => onFontSizeChange('lg')}
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

            {/* Theme Toggle (Light / Dark) */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
