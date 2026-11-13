import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Search,
  ExternalLink,
  Compass
} from 'lucide-react';
import { REGISTERED_PAPERS } from '../../papers/registry.js';
import { ThemeToggle } from '../shared/components/ThemeToggle.js';

interface PaperHubProps {
  onSelectPaper: (paperId: string, initialView?: string) => void;
}

export const PaperHub: React.FC<PaperHubProps> = ({ onSelectPaper }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    '全部',
    '大模型架构',
    '训练与扩展定律',
    '高效微调 (PEFT)',
    '推理与服务栈',
    '对齐与推理智能体',
    '视觉与生成模型',
    'RAG与检索'
  ];

  const filteredPapers = REGISTERED_PAPERS.filter((p) => {
    const matchCat = selectedCategory === '全部' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchQuery =
      !q ||
      p.titleZh.toLowerCase().includes(q) ||
      p.titleEn.toLowerCase().includes(q) ||
      p.arxivId.toLowerCase().includes(q) ||
      p.authors.some((a) => a.toLowerCase().includes(q)) ||
      p.tags.some((t) => t.toLowerCase().includes(q));
    return matchCat && matchQuery;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Hub Navbar */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">AI Paper Lab 论文探索大厅</h1>
              <p className="text-xs text-slate-400">
                经典与前沿 AI 论文中文精读 · 核心数学推导 · 交互式算法实验台
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">
        {/* Hero Banner */}
        <section className="relative rounded-3xl overflow-hidden p-6 sm:p-10 bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI 经典与现代工业栈核心论文交互式精读库</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              以交互式算法实验台与双语精读深入理解 AI 核心论文
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              每篇论文均配备 5 分钟速通导览、中英双语章节精读、可交互调节超参数的算法实验台、权威 Benchmark 对比以及核心概念词典。
            </p>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block">收录经典与工业栈论文</span>
                <span className="text-xl font-bold font-mono text-white mt-0.5 block">
                  {REGISTERED_PAPERS.filter((p) => p.status === 'active').length} 篇
                </span>
                <span className="text-[10px] text-emerald-400">架构 / 训练 / 推理 / 对齐 / 多模态 / RAG</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block">概念双解词条</span>
                <span className="text-xl font-bold font-mono text-emerald-400 mt-0.5 block">300+ 项</span>
                <span className="text-[10px] text-slate-400">白话比喻 + 严谨数学定义</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block">专属算法实验台</span>
                <span className="text-xl font-bold font-mono text-white mt-0.5 block">
                  {REGISTERED_PAPERS.filter((p) => p.status === 'active').length} 套模拟器
                </span>
                <span className="text-[10px] text-teal-400">全栈训练 / 推理内核 / RL对齐 / 扩散 / 蛋白质</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block">评测对比基准</span>
                <span className="text-xl font-bold font-mono text-white mt-0.5 block">80+ Benchmark</span>
                <span className="text-[10px] text-slate-400">MMLU / AIME / ImageNet / CASP14</span>
              </div>
            </div>
          </div>
        </section>

        {/* Filter & Search Bar */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px] md:w-80">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索论文标题、作者、标签或 arXiv ID..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
            />
          </div>
        </section>

        {/* Paper Cards Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>共展示 {filteredPapers.length} 篇论文</span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {filteredPapers.map((paper) => (
              <div
                key={paper.id}
                className="rounded-2xl border p-6 transition-all bg-slate-900/90 border-slate-800 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/5"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="space-y-3 flex-1">
                    {/* Meta badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {paper.arxivId}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/30">
                        {paper.affiliations.join(' • ')}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {paper.publishDate}
                      </span>
                    </div>

                    {/* Titles */}
                    <div>
                      <h3
                        onClick={() => onSelectPaper(paper.id)}
                        className="text-xl font-bold text-white tracking-tight hover:text-emerald-400 transition-colors cursor-pointer"
                      >
                        {paper.titleZh}
                      </h3>
                      <p className="text-xs sm:text-sm font-serif italic text-slate-400 mt-0.5">
                        {paper.titleEn}
                      </p>
                    </div>

                    {/* TL;DR */}
                    <p className="text-xs text-slate-300 leading-relaxed font-serif bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                      <strong className="text-emerald-400 font-sans">💡 核心概要：</strong>
                      {paper.tldrZh}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {paper.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700/60"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>

                    {/* Key metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                      {paper.keyMetrics.map((m, mIdx) => (
                        <div key={mIdx} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">{m.label}</span>
                          <span
                            className={`text-xs font-mono font-bold block mt-0.5 ${
                              m.highlight ? 'text-emerald-400' : 'text-slate-200'
                            }`}
                          >
                            {m.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions Panel */}
                  <div className="lg:w-64 flex flex-col justify-between space-y-3 pt-4 lg:pt-0 lg:border-l lg:border-slate-800 lg:pl-6 flex-shrink-0">
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-slate-400 block">核心作者：</span>
                      <div className="text-xs text-slate-300 leading-relaxed">
                        {paper.authors.slice(0, 4).join('、')}
                        {paper.authors.length > 4 ? ' 等' : ''}
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <button
                        onClick={() => onSelectPaper(paper.id)}
                        className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>进入论文精读与实验台</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => onSelectPaper(paper.id, 'beginner')}
                          className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors cursor-pointer text-center"
                        >
                          ⚡ 5分钟速通
                        </button>
                        <button
                          onClick={() => onSelectPaper(paper.id, 'simulator')}
                          className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-[11px] transition-colors cursor-pointer text-center"
                        >
                          🔬 算法实验台
                        </button>
                      </div>

                      <a
                        href={paper.doi}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-1.5 px-3 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white text-[11px] transition-colors flex items-center justify-center gap-1 border border-slate-800/80"
                      >
                        <span>查看 arXiv 官方原文</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/60 py-6 text-center text-xs text-slate-500">
        AI Paper Lab · 经典与前沿 AI 论文中文精读与交互式算法实验平台
      </footer>
    </div>
  );
};
