import React, { useState } from 'react';
import {
  Cpu,
  Sparkles,
  Layers,
  Database,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Sliders
} from 'lucide-react';

interface RetrievedDoc {
  id: string;
  title: string;
  snippet: string;
  priorProb: number; // p_eta(z | x)
  dotScore: number;
}

interface TokenStep {
  token: string;
  docProbs: { [docId: string]: number }; // p_theta(y_i | x, z_k, y_<i)
  explanation: string;
}

interface RagScenario {
  id: string;
  name: string;
  taskType: string;
  query: string;
  supportsHotSwap?: boolean;
  closedBookOutput: {
    text: string;
    isHallucination: boolean;
    note: string;
  };
  docsByYear: {
    [year: string]: {
      docs: RetrievedDoc[];
      tokens: TokenStep[];
      sequenceScores: { [docId: string]: number };
      groundTruth: string;
    };
  };
}

const SCENARIOS: RagScenario[] = [
  {
    id: 'hemingway-jeopardy',
    name: '场景1：Jeopardy 跨文档事实拼图 (论文图2经典案例)',
    taskType: 'Jeopardy Question Generation (多文档合成)',
    query: '目标答案实体：Ernest Hemingway (海明威) — 生成涵盖其两部代表作的竞赛谜面',
    closedBookOutput: {
      text: 'This author of "Brave New World" and "For Whom the Bell Tolls" won the Nobel Prize.',
      isHallucination: true,
      note: '纯参数化 BART 发生严重幻觉：将阿道司·赫胥黎的《美丽新世界 (Brave New World)》张冠李戴到了海明威头上！'
    },
    docsByYear: {
      default: {
        groundTruth:
          'The Sun Also Rises is a 1926 novel by this author of A Farewell to Arms',
        docs: [
          {
            id: 'z1',
            title: 'Doc z₁: Ernest Hemingway (Biography)',
            snippet:
              'Ernest Miller Hemingway (1899–1961) was an American novelist. His 1929 novel "A Farewell to Arms" cemented his stature as a modern literary master...',
            priorProb: 0.42,
            dotScore: 81.4
          },
          {
            id: 'z2',
            title: 'Doc z₂: The Sun Also Rises (1926 Novel)',
            snippet:
              '"The Sun Also Rises" is the 1926 debut novel by American writer Ernest Hemingway, portraying the "Lost Generation" expatriates in Paris and Spain...',
            priorProb: 0.38,
            dotScore: 80.3
          },
          {
            id: 'z3',
            title: 'Doc z₃: Nobel Prize in Literature 1954',
            snippet:
              'The 1954 Nobel Prize in Literature was awarded to Ernest Hemingway for his mastery of the art of narrative, demonstrated in "The Old Man and the Sea"...',
            priorProb: 0.2,
            dotScore: 76.9
          }
        ],
        sequenceScores: {
          z1: 0.31,
          z2: 0.36,
          z3: 0.08
        },
        tokens: [
          {
            token: 'The Sun Also Rises',
            docProbs: { z1: 0.12, z2: 0.94, z3: 0.05 },
            explanation:
              '生成第一部小说《The Sun Also Rises》时，文档 z₂ 提供了直接证据，其条件生成概率高达 94.0%！'
          },
          {
            token: 'is a 1926 novel',
            docProbs: { z1: 0.18, z2: 0.91, z3: 0.08 },
            explanation:
              '1926 年份信息同样来自文档 z₂，因此 RAG-Token 在前半句主要依赖文档 z₂ 的非参数化记忆。'
          },
          {
            token: 'by this author of',
            docProbs: { z1: 0.78, z2: 0.76, z3: 0.72 },
            explanation:
              '过渡连接短语主要由 BART 参数化语言语法能力驱动，三篇文档给出相近的高概率。'
          },
          {
            token: 'A Farewell to Arms',
            docProbs: { z1: 0.95, z2: 0.09, z3: 0.11 },
            explanation:
              '关键切换时刻！文档 z₂ 中根本没有提及《A Farewell to Arms》，此时 RAG-Token 自动将后验权重切换到包含该书名的文档 z₁（生成概率 95.0%）！'
          }
        ]
      }
    }
  },
  {
    id: 'peru-president-hotswap',
    name: '场景2：维基百科索引热插拔实验 (2016 vs 2018 零训练更新)',
    taskType: 'Index Hot-Swapping (世界知识实时更新)',
    query: 'Who is the President of Peru? (秘鲁现任总统是谁？)',
    supportsHotSwap: true,
    closedBookOutput: {
      text: 'Ollanta Humala (参数记忆停留在旧语料，无法随外部世界更新)',
      isHallucination: true,
      note: '纯参数化模型将知识写死在权重中，除非耗费巨资重新训练，否则永远无法感知现实世界政权更迭。'
    },
    docsByYear: {
      '2016': {
        groundTruth: 'Pedro Pablo Kuczynski (2016年12月维基百科索引)',
        docs: [
          {
            id: 'z1',
            title: 'Doc z₁ [2016 Wiki]: President of Peru',
            snippet:
              'Pedro Pablo Kuczynski was sworn in as President of Peru on 28 July 2016 following the general election...',
            priorProb: 0.65,
            dotScore: 86.2
          },
          {
            id: 'z2',
            title: 'Doc z₂ [2016 Wiki]: Politics of Peru',
            snippet:
              'The President of Peru is the head of state and head of government, elected for a five-year term...',
            priorProb: 0.25,
            dotScore: 79.1
          },
          {
            id: 'z3',
            title: 'Doc z₃ [2016 Wiki]: Lima Government Palace',
            snippet:
              'The Government Palace in Lima serves as the official residence of President Kuczynski...',
            priorProb: 0.1,
            dotScore: 74.0
          }
        ],
        sequenceScores: { z1: 0.92, z2: 0.08, z3: 0.71 },
        tokens: [
          {
            token: 'Pedro',
            docProbs: { z1: 0.96, z2: 0.05, z3: 0.65 },
            explanation: '挂载 2016 年维基索引时，DPR 召回 2016 年当选总统条目，首词高概率指向 Pedro。'
          },
          {
            token: 'Pablo',
            docProbs: { z1: 0.98, z2: 0.04, z3: 0.68 },
            explanation: '延续文档 z₁ 中的精确全名表征。'
          },
          {
            token: 'Kuczynski',
            docProbs: { z1: 0.99, z2: 0.06, z3: 0.88 },
            explanation: '文档 z₁ 和 z₃ 共同确认姓氏 Kuczynski，边缘化概率高达 91.5%。'
          }
        ]
      },
      '2018': {
        groundTruth: 'Martín Vizcarra (热插拔切换至 2018年12月维基百科索引，零重训练！)',
        docs: [
          {
            id: 'z1',
            title: 'Doc z₁ [2018 Wiki]: President of Peru',
            snippet:
              'Martín Vizcarra assumed office as President of Peru on 23 March 2018 following the resignation of Kuczynski...',
            priorProb: 0.68,
            dotScore: 87.0
          },
          {
            id: 'z2',
            title: 'Doc z₂ [2018 Wiki]: Martín Vizcarra',
            snippet:
              'Martín Alberto Vizcarra Cornejo (born 1963) is a Peruvian engineer and politician serving as the current President of Peru...',
            priorProb: 0.24,
            dotScore: 82.5
          },
          {
            id: 'z3',
            title: 'Doc z₃ [2018 Wiki]: Politics of Peru',
            snippet:
              'Executive power is exercised by the President. Since March 2018, the administration is led by Vizcarra...',
            priorProb: 0.08,
            dotScore: 75.8
          }
        ],
        sequenceScores: { z1: 0.95, z2: 0.93, z3: 0.79 },
        tokens: [
          {
            token: 'Martín',
            docProbs: { z1: 0.97, z2: 0.96, z3: 0.72 },
            explanation:
              '无需修改 BART 或 DPR 的任何一行权重！仅把 FAISS 索引替换为 2018 版，首词立即更新为 Martín！'
          },
          {
            token: 'Vizcarra',
            docProbs: { z1: 0.99, z2: 0.98, z3: 0.91 },
            explanation: '三篇 2018 年检索文档高度一致指向新任总统 Vizcarra，边缘化总概率达 97.6%！'
          }
        ]
      }
    }
  }
];

export const RagMarginalizationSimulator: React.FC = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(SCENARIOS[0].id);
  const [modelMode, setModelMode] = useState<'rag-token' | 'rag-sequence' | 'closed-book'>(
    'rag-token'
  );
  const [wikiYear, setWikiYear] = useState<'2016' | '2018'>('2018');
  const [selectedTokenIdx, setSelectedTokenIdx] = useState<number>(0);

  const scenario = SCENARIOS.find(s => s.id === selectedScenarioId) || SCENARIOS[0];
  const activeData = scenario.supportsHotSwap
    ? scenario.docsByYear[wikiYear]
    : scenario.docsByYear.default;

  const activeToken = activeData.tokens[selectedTokenIdx] || activeData.tokens[0];

  // Calculate marginalized token probability: sum_k p_eta(z_k|x) * p_theta(y_i|x, z_k)
  const marginalizedTokenProb = activeData.docs.reduce((acc, doc) => {
    const genProb = activeToken.docProbs[doc.id] || 0;
    return acc + doc.priorProb * genProb;
  }, 0);

  // Calculate RAG-Sequence marginalized total score
  const marginalizedSequenceProb = activeData.docs.reduce((acc, doc) => {
    const seqProb = activeData.sequenceScores[doc.id] || 0;
    return acc + doc.priorProb * seqProb;
  }, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>RAG 隐变量边缘化与知识热插拔实验台</span>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                  NeurIPS 2020 原版数学模拟
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                直观体验 RAG-Token（逐词跨文档融合）、RAG-Sequence（整句单文档加权）与索引热插拔（Index Hot-Swapping）的概率计算全过程。
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setModelMode('rag-token')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                modelMode === 'rag-token'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              RAG-Token (词元级)
            </button>
            <button
              onClick={() => setModelMode('rag-sequence')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                modelMode === 'rag-sequence'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              RAG-Sequence (序列级)
            </button>
            <button
              onClick={() => setModelMode('closed-book')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                modelMode === 'closed-book'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              纯参数化 BART (闭卷)
            </button>
          </div>
        </div>

        {/* Scenario Switcher & Optional Hot-Swap Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-medium">选择实验场景：</span>
            {SCENARIOS.map(sc => (
              <button
                key={sc.id}
                onClick={() => {
                  setSelectedScenarioId(sc.id);
                  setSelectedTokenIdx(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  selectedScenarioId === sc.id
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {sc.name}
              </button>
            ))}
          </div>

          {scenario.supportsHotSwap && (
            <div className="flex items-center gap-2 bg-teal-950/30 border border-teal-500/30 px-3 py-1.5 rounded-xl text-xs">
              <RefreshCw className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-teal-300 font-semibold">FAISS 维基索引版本热插拔：</span>
              <button
                onClick={() => {
                  setWikiYear('2016');
                  setSelectedTokenIdx(0);
                }}
                className={`px-2.5 py-0.5 rounded font-mono cursor-pointer ${
                  wikiYear === '2016'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                2016年12月索引
              </button>
              <button
                onClick={() => {
                  setWikiYear('2018');
                  setSelectedTokenIdx(0);
                }}
                className={`px-2.5 py-0.5 rounded font-mono cursor-pointer ${
                  wikiYear === '2018'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                2018年12月索引
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Closed-Book Warning View */}
      {modelMode === 'closed-book' ? (
        <div className="p-6 rounded-2xl bg-slate-900 border border-amber-500/40 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
            <AlertTriangle className="w-5 h-5" />
            <span>纯参数化 BART（Closed-Book 无外部检索）输出诊断</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400">输入 Query：{scenario.query}</span>
            <div className="text-base font-mono text-red-400 font-bold">
              输出：“{scenario.closedBookOutput.text}”
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              ❌ <strong>缺陷分析：</strong>
              {scenario.closedBookOutput.note}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Non-Parametric DPR Retrieval Top-K Priors */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  1. 非参数化记忆：DPR Top-K 检索先验 p_η(z|x)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">MIPS Inner Product</span>
            </div>

            <div className="space-y-3">
              {activeData.docs.map(doc => {
                const tokenGenProb = activeToken.docProbs[doc.id] || 0;
                const contribution = doc.priorProb * tokenGenProb;

                return (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-emerald-300">{doc.title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        p_η(z|x) = {(doc.priorProb * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-serif">
                      “{doc.snippet}”
                    </p>
                    <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-500">q(x)ᵀd(z) = {doc.dotScore}</span>
                      {modelMode === 'rag-token' ? (
                        <span className="text-teal-400">
                          当前词元贡献: {(contribution * 100).toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-teal-400">
                          整句生成概率 p_θ(y|x,z):{' '}
                          {((activeData.sequenceScores[doc.id] || 0) * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Parametric BART Generator & Marginalization */}
          <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  2. 参数化生成器 BART +{' '}
                  {modelMode === 'rag-token'
                    ? 'RAG-Token 逐词边缘化拆解'
                    : 'RAG-Sequence 整句边缘化拆解'}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-teal-400">
                {modelMode === 'rag-token'
                  ? '∏ᵢ ∑_z p_η(z|x) p_θ(yᵢ|x,z,y_<i)'
                  : '∑_z p_η(z|x) ∏ᵢ p_θ(yᵢ|x,z,y_<i)'}
              </span>
            </div>

            {/* Interactive Generated Sequence Tokens */}
            <div className="space-y-2">
              <span className="text-xs text-slate-400 block">
                点击下方任意生成的词元片段（Token $y_i$），查看各检索文档对该词元的条件概率贡献：
              </span>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center gap-2">
                {activeData.tokens.map((t, idx) => {
                  const isSelected = selectedTokenIdx === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedTokenIdx(idx)}
                      className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-md'
                          : 'bg-slate-900 text-slate-200 border-slate-700 hover:border-emerald-500/50'
                      }`}
                    >
                      {t.token}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Per-Document Conditional Probability Breakdown for Selected Token */}
            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  当前选中词元：<span className="text-emerald-400 font-mono">"{activeToken.token}"</span>
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  边缘化合成概率 p(yᵢ|x) = {(marginalizedTokenProb * 100).toFixed(1)}%
                </span>
              </div>

              <div className="space-y-2.5">
                {activeData.docs.map(doc => {
                  const genProb = activeToken.docProbs[doc.id] || 0;
                  const weighted = doc.priorProb * genProb;
                  return (
                    <div key={doc.id} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-300">{doc.title}</span>
                        <span className="text-slate-400">
                          p_η({(doc.priorProb * 100).toFixed(0)}%) × p_θ(
                          {(genProb * 100).toFixed(0)}%) ={' '}
                          <strong className="text-emerald-400">
                            {(weighted * 100).toFixed(1)}%
                          </strong>
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${genProb * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 leading-relaxed">
                <Sparkles className="w-3.5 h-3.5 inline mr-1.5 text-emerald-400" />
                {activeToken.explanation}
              </div>
            </div>

            {/* Final Marginalized Result Summary */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 to-emerald-950/30 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-emerald-400 font-semibold block">
                  最终生成输出与事实溯源：
                </span>
                <div className="text-sm font-bold text-white mt-0.5">
                  {activeData.groundTruth}
                </div>
              </div>
              <div className="text-right font-mono">
                <span className="text-[10px] text-slate-400 block">
                  {modelMode === 'rag-token' ? '当前词元边际概率' : '整句序列边际概率'}
                </span>
                <span className="text-lg font-extrabold text-emerald-400">
                  {(
                    (modelMode === 'rag-token'
                      ? marginalizedTokenProb
                      : marginalizedSequenceProb) * 100
                  ).toFixed(1)}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
