import React, { useState } from 'react';
import { Header, ViewMode, LangMode } from './components/Header.js';
import { BeginnerGuide } from './components/BeginnerGuide.js';
import { PaperReader } from './components/PaperReader.js';
import { NavigationSimulator } from './components/NavigationSimulator.js';
import { ComparisonMatrix } from './components/ComparisonMatrix.js';
import { GlossaryView } from './components/GlossaryView.js';
import { PAPER_META } from './data/paperContent.js';
import { BookOpen, Copy, Check, ArrowUpRight } from 'lucide-react';

interface AppProps {
  onBackToHub?: () => void;
  initialView?: ViewMode;
}

export default function App({ onBackToHub, initialView = 'beginner' }: AppProps = {}) {
  const [currentView, setCurrentView] = useState<ViewMode>(initialView);
  const [langMode, setLangMode] = useState<LangMode>('zh');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedBibtex, setCopiedBibtex] = useState<boolean>(false);

  const bibtex = `@article{wan2026decisionrag,
  title={Retriever-Free Retrieval: Navigating Documents with Decision Models},
  author={Wan, Chao and J{\\"u}nger, Paul and Du, Beixi and Liu, Bodong and Krishnan, Navaneetha and Weinberger, Kilian Q.},
  journal={arXiv preprint arXiv:2610.35868},
  year={2026},
  doi={10.48550/arXiv.2610.35868}
}`;

  const handleCopyBibtex = () => {
    navigator.clipboard.writeText(bibtex);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Navigation */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        langMode={langMode}
        onLangModeChange={setLangMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        onBackToHub={onBackToHub}
      />

      {/* Main Content Area */}
      <div className="flex-1">
        {currentView === 'beginner' && (
          <BeginnerGuide
            onGoToSimulator={() => setCurrentView('simulator')}
            onGoToPaper={() => setCurrentView('reader')}
          />
        )}

        {currentView === 'reader' && (
          <PaperReader
            langMode={langMode}
            fontSize={fontSize}
            searchFilter={searchQuery}
            onJumpToSimulator={() => setCurrentView('simulator')}
            onJumpToGlossary={() => setCurrentView('glossary')}
          />
        )}

        {currentView === 'simulator' && <NavigationSimulator />}

        {currentView === 'comparison' && <ComparisonMatrix />}

        {currentView === 'glossary' && (
          <GlossaryView initialSearchQuery={searchQuery} />
        )}
      </div>

      {/* Footer & Scholarly Citation */}
      <footer className="border-t border-slate-800 bg-slate-900/90 py-10 px-4 mt-16 text-slate-400 text-xs">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">
                  DecisionRAG 论文深度精读与学术探索系统
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400">
                  {PAPER_META.arxivId}
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-md">
                基于康奈尔大学与 ASAPP 最新发表的研究论文《Retriever-Free Retrieval: Navigating Documents with Decision Models》，系统性呈现免检索器分层决策 RAG 架构的中文译文、概念通俗拆解与交互模拟。
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs">
                <a
                  href={PAPER_META.doi}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  <span>官方 DOI 页面 (arXiv:2610.35868)</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* BibTeX Citation Box */}
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
                {bibtex}
              </pre>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 text-[11px]">
            <div>
              本交互式学习平台依据学者研究成果进行结构化中文翻译与教育型探索展示。
            </div>
            <div>
              arXiv:2610.35868 • Cornell University &amp; ASAPP
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
