import React, { useState, useMemo } from 'react';
import { HelpCircle, Search, Lightbulb, BookOpen, Sparkles, Cpu, Layers } from 'lucide-react';
import { GLOSSARY_ITEMS, GlossaryTerm } from '../data/glossary.js';

interface GlossaryViewProps {
  initialSearchQuery?: string;
  onSelectTerm?: (termId: string) => void;
}

export const GlossaryView: React.FC<GlossaryViewProps> = ({ initialSearchQuery = '' }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [searchFilter, setSearchFilter] = useState<string>(initialSearchQuery);
  const [expandedTermId, setExpandedTermId] = useState<string | null>(GLOSSARY_ITEMS[0].id);

  const categories = ['全部', 'RAG基础', '模型与注意力', '算法与搜索', '评测与指标'];

  const filteredTerms = useMemo(() => {
    return GLOSSARY_ITEMS.filter((t) => {
      const matchCat = selectedCategory === '全部' || t.category === selectedCategory;
      const q = searchFilter.toLowerCase();
      const matchQuery =
        !q ||
        t.termZh.toLowerCase().includes(q) ||
        t.termEn.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q) ||
        t.technicalDetail.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchFilter]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>DecisionRAG 核心概念与技术术语大典</span>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20">
                双解版：白话比喻 + 严谨技术
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              专为初学者与进阶研究者打造。点击任意词条展开通俗生活化比喻、数学定义以及它在 DecisionRAG 论文中的决定性作用。
            </p>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="搜索术语中英文名或释义..."
              className="w-full bg-slate-950 border border-slate-700/60 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
            />
          </div>
        </div>
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTerms.map((term) => {
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

              <p className="text-xs text-slate-300 leading-relaxed">
                {term.summary}
              </p>

              {/* Expanded Deep Dive Content */}
              {isExpanded && (
                <div className="space-y-3 pt-3 border-t border-slate-800/80 text-xs">
                  {/* Analogy Box */}
                  <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-900/30 text-amber-200/90 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-300 text-[11px]">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>初学者生活化大白话比喻 (Intuitive Analogy):</span>
                    </div>
                    <p className="leading-relaxed text-[11px] text-amber-100/90 pl-5">
                      {term.analogy}
                    </p>
                  </div>

                  {/* Technical Breakdown */}
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-300 text-[11px]">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                      <span>严谨学术原理解析 (Formal Definition):</span>
                    </div>
                    <p className="leading-relaxed text-slate-400 text-[11px] pl-5 font-serif">
                      {term.technicalDetail}
                    </p>
                  </div>

                  {/* Role in DecisionRAG */}
                  <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/30 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-[11px]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>在 DecisionRAG 中的关键应用与创新:</span>
                    </div>
                    <p className="leading-relaxed text-emerald-200/90 text-[11px] pl-5">
                      {term.decisionRagApplication}
                    </p>
                  </div>

                  {/* Mathematical Formula if present */}
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

      {filteredTerms.length === 0 && (
        <div className="text-center py-12 text-slate-400 text-xs">
          没有找到匹配的概念或术语，请尝试更换关键词。
        </div>
      )}
    </div>
  );
};
