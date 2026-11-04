import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  Search, 
  Filter, 
  FolderGit2, 
  ExternalLink, 
  Cpu, 
  HelpCircle, 
  Layers, 
  Clock, 
  CheckCircle2, 
  Zap, 
  PlusCircle, 
  BarChart3, 
  Compass, 
  ChevronRight 
} from 'lucide-react';
import { REGISTERED_PAPERS } from '../../papers/registry.js';
import { ThemeToggle } from '../shared/components/ThemeToggle.js';

interface PaperHubProps {
  onSelectPaper: (paperId: string, initialView?: string) => void;
}

export const PaperHub: React.FC<PaperHubProps> = ({ onSelectPaper }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddGuide, setShowAddGuide] = useState<boolean>(false);

  const categories = ['全部', 'RAG与检索', '大模型架构', '智能体与推理', '知识图谱'];

  const filteredPapers = REGISTERED_PAPERS.filter((p) => {
    const matchCat = selectedCategory === '全部' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchQuery =
      !q ||
      p.titleZh.toLowerCase().includes(q) ||
      p.titleEn.toLowerCase().includes(q) ||
      p.arxivId.toLowerCase().includes(q) ||
      p.authors.some(a => a.toLowerCase().includes(q)) ||
      p.tags.some(t => t.toLowerCase().includes(q));
    return matchCat && matchQuery;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Hub Navbar */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">AI Paper Lab 论文探索大厅</h1>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-300 rounded-full border border-emerald-500/30">
                  多论文体系
                </span>
              </div>
              <p className="text-xs text-slate-400">
                一个论文一个文件夹 · 完整中文精读 · 概念白话拆解 · 在线算法实验台
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setShowAddGuide(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 cursor-pointer transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>如何添加新论文？</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10 flex-1 w-full">
        {/* Hero Banner */}
        <section className="relative rounded-3xl overflow-hidden p-6 sm:p-10 bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>前沿 AI 论文交互探索平台</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              告别枯燥 PDF，以交互式实验台与双语精读探索学术前沿
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              平台遵循<strong>“一个论文一个文件夹”</strong>的标准化架构规范。每篇收录的论文均包含忠实中文全译、初学者生活化比喻、算法单步交互模拟器与权威 Benchmark 横向对比。
            </p>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block">收录全功能论文</span>
                <span className="text-xl font-bold font-mono text-white mt-0.5 block">
                  {REGISTERED_PAPERS.filter(p => p.status === 'active').length} 篇全功能
                </span>
                <span className="text-[10px] text-emerald-400">RAG / DPR / ColBERT / DecisionRAG</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block">概念双解词条</span>
                <span className="text-xl font-bold font-mono text-emerald-400 mt-0.5 block">40+ 项</span>
                <span className="text-[10px] text-slate-400">白话比喻 + 严谨定义</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block">专属算法实验台</span>
                <span className="text-xl font-bold font-mono text-white mt-0.5 block">4 套模拟器</span>
                <span className="text-[10px] text-teal-400">边缘化 / 对比矩阵 / MaxSim / 树导航</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block">评测对比基准</span>
                <span className="text-xl font-bold font-mono text-white mt-0.5 block">10+ Benchmark</span>
                <span className="text-[10px] text-slate-400">NQ / MS MARCO / MultiDoc2Dial</span>
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
        <section className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>当前筛选显示：{filteredPapers.length} 篇论文</span>
            <span className="text-emerald-400 font-mono">架构格式：papers/&lt;论文目录&gt;/</span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {filteredPapers.map((paper) => {
              const isActive = paper.status === 'active';

              return (
                <div
                  key={paper.id}
                  className={`rounded-2xl border p-6 transition-all ${
                    isActive
                      ? 'bg-slate-900/90 border-slate-800 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/5'
                      : 'bg-slate-900/40 border-slate-800/60 opacity-80'
                  }`}
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
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                          isActive
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {isActive ? '⚡ 全功能已上线' : '⏳ 规划中'}
                        </span>
                      </div>

                      {/* Titles */}
                      <div>
                        <h3 className="text-xl font-bold text-white tracking-tight hover:text-emerald-300 transition-colors">
                          {paper.titleZh}
                        </h3>
                        <p className="text-xs sm:text-sm font-serif italic text-slate-400 mt-0.5">
                          {paper.titleEn}
                        </p>
                      </div>

                      {/* TL;DR */}
                      <p className="text-xs text-slate-300 leading-relaxed font-serif bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                        <strong className="text-emerald-400 font-sans">💡 核心概要：</strong>{paper.tldrZh}
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
                            <span className={`text-xs font-mono font-bold block mt-0.5 ${
                              m.highlight ? 'text-emerald-400' : 'text-slate-200'
                            }`}>
                              {m.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions Panel */}
                    <div className="lg:w-64 flex flex-col justify-between space-y-3 pt-4 lg:pt-0 lg:border-l lg:border-slate-800 lg:pl-6 flex-shrink-0">
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-semibold text-slate-400 block">专属独立子目录：</span>
                        <div className="p-2 rounded bg-slate-950 border border-slate-800 font-mono text-[10px] text-emerald-400 break-all">
                          papers/{paper.folderName}/
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        {isActive ? (
                          <>
                            <button
                              onClick={() => onSelectPaper(paper.id)}
                              className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <span>进入论文交互全套系统</span>
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
                          </>
                        ) : (
                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-500">
                            即将上线，欢迎按规范提交接入！
                          </div>
                        )}

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
              );
            })}
          </div>
        </section>

        {/* Multi-Paper Specification Card */}
        <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              多论文架构设计规范：一个论文一个文件夹 (One Paper, One Folder)
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            本项目已全面完成架构升级，采用路由分发模式（Router-based Architecture）：
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-emerald-400">1. 独立目录隔离</span>
              <p className="text-slate-400">
                每篇新论文存放在 <code>papers/&lt;论文英文全称&gt;/</code> 专属文件夹中，自带独立 README、代码、测试与数据，互不干扰。
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-emerald-400">2. 统一大厅路由</span>
              <p className="text-slate-400">
                主页 <code>index.html</code> 担当导航大厅与动态路由（支持 Hash 路由深度链接），点击任意论文卡片即无缝载入。
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-emerald-400">3. 规范化即插即用</span>
              <p className="text-slate-400">
                只需在 <code>papers/registry.ts</code> 中注册新论文元数据与入口，主页自动生成卡片并挂载路由！
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Add Paper Guide Modal */}
      {showAddGuide && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-xs text-slate-300">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                <span>如何在项目中添加一篇新论文？(3 步极简接入指南)</span>
              </h3>
              <button
                onClick={() => setShowAddGuide(false)}
                className="text-slate-400 hover:text-white text-base px-2 py-0.5 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="font-bold text-emerald-400 text-sm">第 1 步：在 papers/ 下新建论文专属文件夹</span>
                <p className="text-slate-400">
                  文件夹名称建议使用论文的英文全名（连字符或下划线连接）：
                </p>
                <pre className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] text-teal-300">
mkdir papers/Your-Paper-Title-Here/
                </pre>
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-emerald-400 text-sm">第 2 步：按标准规范准备模块内容</span>
                <p className="text-slate-400">
                  在该文件夹内放入：
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  <li><code>README.md</code>：论文中文介绍、核心痛点与创新机理剖析</li>
                  <li><code>src/App.tsx</code>：该论文的前端交互主入口组件</li>
                  <li><code>src/data/paperContent.ts</code>：忠实全译中文本与章节导读</li>
                  <li><code>src/utils/</code>：相关算法逻辑模拟与测试用例</li>
                </ul>
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-emerald-400 text-sm">第 3 步：在 papers/registry.ts 中登记</span>
                <p className="text-slate-400">
                  只需在 <code>REGISTERED_PAPERS</code> 数组中添加一个配置对象，主页即可自动展示论文卡片并完成路由接入！
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowAddGuide(false)}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-600 cursor-pointer"
              >
                知道了，关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/60 py-6 text-center text-xs text-slate-500">
        AI Paper Lab • 顶级 AI 论文精读与交互探索平台 • 采用“一个论文一个文件夹”标准化模块架构
      </footer>
    </div>
  );
};
