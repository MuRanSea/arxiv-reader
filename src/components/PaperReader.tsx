import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Lightbulb, 
  Sparkles, 
  ChevronRight, 
  ExternalLink, 
  CheckCircle2, 
  Bookmark, 
  Share2, 
  Layers, 
  Zap, 
  Cpu, 
  ShieldAlert,
  GitFork
} from 'lucide-react';
import { PAPER_META, PAPER_SECTIONS, PaperSection } from '../data/paperContent.js';
import { LangMode } from './Header.js';

interface PaperReaderProps {
  langMode: LangMode;
  fontSize: 'sm' | 'md' | 'lg';
  searchFilter: string;
  onJumpToSimulator: () => void;
  onJumpToGlossary: () => void;
}

export const PaperReader: React.FC<PaperReaderProps> = ({
  langMode,
  fontSize,
  searchFilter,
  onJumpToSimulator,
  onJumpToGlossary
}) => {
  const [activeSectionId, setActiveSectionId] = useState<string>(PAPER_SECTIONS[0].id);
  const [bookmarkedSections, setBookmarkedSections] = useState<string[]>([]);
  const [expandedTakeaways, setExpandedTakeaways] = useState<{ [secId: string]: boolean }>({
    'sec-intro': true,
    'sec-architecture': true
  });

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

  // Font sizing styles
  const textClass =
    fontSize === 'sm' ? 'text-xs leading-relaxed' :
    fontSize === 'lg' ? 'text-base leading-loose' : 'text-sm leading-relaxed';

  const headingClass =
    fontSize === 'sm' ? 'text-lg' :
    fontSize === 'lg' ? 'text-2xl' : 'text-xl';

  // Filter sections by search query if any
  const displayedSections = PAPER_SECTIONS.filter((s) => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      s.titleZh.toLowerCase().includes(q) ||
      s.titleEn.toLowerCase().includes(q) ||
      s.summaryZh.toLowerCase().includes(q) ||
      s.contentZh.some(c => c.toLowerCase().includes(q))
    );
  });

  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sticky Table of Contents (TOC) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-28 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>论文章节目录 (TOC)</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                {PAPER_SECTIONS.length} 章节
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

              {PAPER_SECTIONS.map((sec) => {
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

            {/* Quick action buttons */}
            <div className="pt-2 border-t border-slate-800 space-y-1.5">
              <button
                onClick={onJumpToSimulator}
                className="w-full text-left px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-medium transition-colors cursor-pointer flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3 h-3 text-emerald-400" />
                  <span>分层决策实验台</span>
                </span>
                <ChevronRight className="w-3 h-3" />
              </button>
              <button
                onClick={onJumpToGlossary}
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
          {/* Header Metadata Section */}
          <section id="sec-header" className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div className="space-y-3 border-b border-slate-800 pb-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {PAPER_META.arxivId}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/30">
                  Cornell University & ASAPP
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {PAPER_META.publishDate}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {PAPER_META.titleZh}
              </h1>

              <p className="text-sm sm:text-base font-serif italic text-slate-400">
                {PAPER_META.titleEn}
              </p>

              {/* Authors List */}
              <div className="pt-2 text-xs text-slate-300 flex flex-wrap gap-x-4 gap-y-1.5">
                {PAPER_META.authors.map((auth, i) => (
                  <span key={i} className="font-medium text-slate-200">
                    {auth}
                    {i < PAPER_META.authors.length - 1 && <span className="text-slate-600 ml-4">•</span>}
                  </span>
                ))}
              </div>

              <div className="text-xs text-slate-500">
                机构：{PAPER_META.affiliations.join(' / ')}
              </div>
            </div>

            {/* TL;DR Box */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-500/30 text-xs text-emerald-200/90 leading-relaxed space-y-1">
              <div className="font-bold text-emerald-300 flex items-center gap-1.5 text-sm">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>一句话极速读懂 (TL;DR):</span>
              </div>
              <p className="pl-5 text-slate-200 font-serif">
                {PAPER_META.tldrZh}
              </p>
            </div>

            {/* Core Innovations Grid */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400">论文四大颠覆性创新支柱：</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PAPER_META.coreInnovations.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {item.title}
                    </span>
                    <p className="text-xs text-slate-400 leading-normal">
                      {item.desc}
                    </p>
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
                  {PAPER_META.abstractZh}
                </div>
              )}

              {langMode !== 'zh' && (
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs sm:text-sm text-slate-400 leading-relaxed font-serif italic">
                  {PAPER_META.abstractEn}
                </div>
              )}
            </div>
          </section>

          {/* Paper Sections Loop */}
          {displayedSections.map((sec) => {
            const isBookmarked = bookmarkedSections.includes(sec.id);
            const isTakeawayOpen = expandedTakeaways[sec.id] ?? false;

            return (
              <article
                key={sec.id}
                id={sec.id}
                className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6 scroll-mt-28"
              >
                {/* Chapter Title & Action Header */}
                <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                      <span>第 {sec.chapterNumber} 章</span>
                      <span className="text-slate-600">•</span>
                      <span>CHAPTER {sec.chapterNumber}</span>
                    </div>

                    <h2 className={`${headingClass} font-extrabold text-white mt-1 tracking-tight`}>
                      {sec.titleZh}
                    </h2>

                    <p className="text-xs sm:text-sm font-serif italic text-slate-400 mt-0.5">
                      {sec.titleEn}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleBookmark(sec.id)}
                      className={`p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                        isBookmarked
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                      title={isBookmarked ? '取消收藏本章' : '收藏本章'}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Section Overview / Summary callout */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border-l-4 border-emerald-500 text-xs text-slate-300 font-medium">
                  <strong>本章导读：</strong>{sec.summaryZh}
                </div>

                {/* Beginner Conceptual Callout Card */}
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
                          <div key={tIdx} className="space-y-1.5 p-3 rounded-lg bg-slate-950/60 border border-amber-950">
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

                {/* Main Translated Content */}
                <div className="space-y-4">
                  {sec.contentZh.map((paragraph, pIdx) => (
                    <div key={pIdx} className="space-y-2">
                      {langMode !== 'en' && (
                        <p className={`${textClass} text-slate-200 leading-relaxed font-serif indent-6 sm:indent-8 text-justify`}>
                          {paragraph}
                        </p>
                      )}

                      {langMode === 'bilingual' && sec.contentEn && sec.contentEn[pIdx] && (
                        <p className={`${textClass} text-slate-400 leading-relaxed font-serif italic pl-4 border-l-2 border-slate-700 text-justify`}>
                          {sec.contentEn[pIdx]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Mathematical Formulas if any */}
                {sec.formulas && sec.formulas.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-teal-400" />
                      <span>核心数学推导与计算复杂度：</span>
                    </span>
                    <div className="space-y-2">
                      {sec.formulas.map((form, fIdx) => (
                        <div key={fIdx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
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

                {/* Key Insights Box */}
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
  );
};
