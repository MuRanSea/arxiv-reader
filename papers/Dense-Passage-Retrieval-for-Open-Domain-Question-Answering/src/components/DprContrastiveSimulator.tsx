import React, { useState } from 'react';
import {
  Cpu,
  Sparkles,
  Layers,
  CheckCircle2,
  XCircle,
  Grid,
  Zap
} from 'lucide-react';

interface CandidatePassage {
  id: string;
  type: 'positive' | 'bm25-hard' | 'in-batch';
  typeBadge: string;
  text: string;
  lexicalOverlapWords: string[];
  bm25Score: number;
  dprScoresByStrategy: {
    random: number;
    inBatch: number;
    inBatchPlusHard: number;
  };
}

interface DprQueryCase {
  id: string;
  title: string;
  query: string;
  goldAnswer: string;
  passages: CandidatePassage[];
}

const DPR_CASES: DprQueryCase[] = [
  {
    id: 'lotr-bad-guy',
    title: '案例1：同义词跨词汇匹配（论文 Table 6 经典案例）',
    query: 'Who is the bad guy in Lord of the Rings?',
    goldAnswer: 'Sauron (索伦)',
    passages: [
      {
        id: 'p-pos',
        type: 'positive',
        typeBadge: 'p⁺ 真实正样本 (含答案)',
        text: 'Sauron is the title character and the main antagonist of J. R. R. Tolkien\'s The Lord of the Rings, ruling the land of Mordor.',
        lexicalOverlapWords: ['Lord', 'of', 'the', 'Rings'],
        bm25Score: 14.2,
        dprScoresByStrategy: {
          random: 68.5,
          inBatch: 76.2,
          inBatchPlusHard: 84.8
        }
      },
      {
        id: 'p-hard',
        type: 'bm25-hard',
        typeBadge: 'p⁻ BM25 困难负样本 (词面陷阱)',
        text: 'In the Lord of the Rings film trilogy, actor Sala Baker played the bad guy in several battle scenes alongside Viggo Mortensen.',
        lexicalOverlapWords: ['bad', 'guy', 'in', 'Lord', 'of', 'the', 'Rings'],
        bm25Score: 28.9,
        dprScoresByStrategy: {
          random: 71.0,
          inBatch: 74.1,
          inBatchPlusHard: 61.3
        }
      },
      {
        id: 'p-inbatch-1',
        type: 'in-batch',
        typeBadge: 'p⁻ 批内其他问题正样本 #1',
        text: 'Thorin Oakenshield is a fictional character in J. R. R. Tolkien\'s 1937 novel The Hobbit, leader of the Company of Dwarves.',
        lexicalOverlapWords: [],
        bm25Score: 4.1,
        dprScoresByStrategy: {
          random: 58.2,
          inBatch: 49.5,
          inBatchPlusHard: 44.0
        }
      },
      {
        id: 'p-inbatch-2',
        type: 'in-batch',
        typeBadge: 'p⁻ 批内其他问题正样本 #2',
        text: 'The Golden Gate Bridge is a suspension bridge spanning the Golden Gate, the one-mile-wide strait connecting San Francisco Bay.',
        lexicalOverlapWords: ['the', 'is', 'in'],
        bm25Score: 1.2,
        dprScoresByStrategy: {
          random: 22.4,
          inBatch: 15.1,
          inBatchPlusHard: 12.8
        }
      }
    ]
  },
  {
    id: 'canal-venice',
    title: '案例2：高仿关键词陷阱辨析（运河名称问答）',
    query: 'What is the name of the main canal in Venice?',
    goldAnswer: 'Grand Canal (大运河)',
    passages: [
      {
        id: 'p-pos',
        type: 'positive',
        typeBadge: 'p⁺ 真实正样本 (含答案)',
        text: 'The Grand Canal (Italian: Canal Grande) is the largest and most important water-traffic corridor in the city of Venice, Italy.',
        lexicalOverlapWords: ['Canal', 'in', 'Venice'],
        bm25Score: 16.8,
        dprScoresByStrategy: {
          random: 70.1,
          inBatch: 77.8,
          inBatchPlusHard: 86.2
        }
      },
      {
        id: 'p-hard',
        type: 'bm25-hard',
        typeBadge: 'p⁻ BM25 困难负样本 (词面陷阱)',
        text: 'The name of the main canal system in Venice, California was conceived by Abbot Kinney in 1905 to drain the marshes.',
        lexicalOverlapWords: ['name', 'of', 'the', 'main', 'canal', 'in', 'Venice'],
        bm25Score: 31.4,
        dprScoresByStrategy: {
          random: 73.5,
          inBatch: 75.0,
          inBatchPlusHard: 59.4
        }
      },
      {
        id: 'p-inbatch-1',
        type: 'in-batch',
        typeBadge: 'p⁻ 批内其他问题正样本 #1',
        text: 'The Suez Canal is an artificial sea-level waterway in Egypt, connecting the Mediterranean Sea to the Red Sea.',
        lexicalOverlapWords: ['Canal', 'is', 'in'],
        bm25Score: 8.5,
        dprScoresByStrategy: {
          random: 54.0,
          inBatch: 46.2,
          inBatchPlusHard: 41.5
        }
      }
    ]
  }
];

export const DprContrastiveSimulator: React.FC = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(DPR_CASES[0].id);
  const [trainingStrategy, setTrainingStrategy] = useState<
    'inBatchPlusHard' | 'inBatch' | 'random'
  >('inBatchPlusHard');
  const [hybridLambda, setHybridLambda] = useState<number>(0);

  const activeCase = DPR_CASES.find(c => c.id === selectedCaseId) || DPR_CASES[0];

  // Compute softmax probabilities and ranking under current strategy
  const scoredPassages = activeCase.passages
    .map(p => {
      const dprDot = p.dprScoresByStrategy[trainingStrategy];
      const combinedScore = dprDot + hybridLambda * p.bm25Score;
      return {
        ...p,
        dprDot,
        combinedScore
      };
    })
    .sort((a, b) => b.combinedScore - a.combinedScore);

  // Compute NLL Contrastive Loss: -log( exp(pos/10) / sum(exp(all/10)) )
  const maxDot = Math.max(...scoredPassages.map(p => p.dprDot / 10));
  const expSum = scoredPassages.reduce(
    (acc, p) => acc + Math.exp(p.dprDot / 10 - maxDot),
    0
  );
  const posPassage = scoredPassages.find(p => p.type === 'positive')!;
  const posSoftmaxProb = Math.exp(posPassage.dprDot / 10 - maxDot) / expSum;
  const nllLoss = -Math.log(posSoftmaxProb);

  const isTop1Correct = scoredPassages[0]?.type === 'positive';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header & Strategy Switcher */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>DPR 双编码器对比学习与负样本策略实验台</span>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                  EMNLP 2020 核心机理
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                切换不同的负样本训练策略（随机负样本 vs. 批内负样本 vs. 批内+BM25困难负样本），观察双编码器如何识破“关键词高仿陷阱”并击败 BM25。
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs flex-wrap">
            <button
              onClick={() => setTrainingStrategy('random')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                trainingStrategy === 'random'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              仅随机负样本 (Random)
            </button>
            <button
              onClick={() => setTrainingStrategy('inBatch')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                trainingStrategy === 'inBatch'
                  ? 'bg-teal-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              批内负样本 (In-Batch)
            </button>
            <button
              onClick={() => setTrainingStrategy('inBatchPlusHard')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                trainingStrategy === 'inBatchPlusHard'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🌟 批内 + BM25 困难负样本 (DPR完整版)
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-medium">选择测试问题：</span>
            {DPR_CASES.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  selectedCaseId === c.id
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-slate-400">正样本概率 P(p⁺|q):</span>
            <span className="font-mono font-bold text-emerald-400">
              {(posSoftmaxProb * 100).toFixed(1)}%
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400">对比损失 L_NLL:</span>
            <span className="font-mono font-bold text-teal-400">{nllLoss.toFixed(3)}</span>
          </div>
        </div>
      </div>

      {/* Main Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Ranked Candidate Passages */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">
                查询 Query：<span className="text-emerald-400">“{activeCase.query}”</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                标准答案：<strong className="text-slate-200">{activeCase.goldAnswer}</strong>
              </p>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                isTop1Correct
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}
            >
              {isTop1Correct ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Top-1 检索成功命中正样本！</span>
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5" />
                  <span>被 BM25 词面陷阱误导 (Top-1 失败)</span>
                </>
              )}
            </span>
          </div>

          <div className="space-y-3">
            {scoredPassages.map((p, rankIdx) => {
              const isPos = p.type === 'positive';
              return (
                <div
                  key={p.id}
                  className={`p-4 rounded-xl border transition-all space-y-2 ${
                    rankIdx === 0 && isPos
                      ? 'bg-emerald-950/20 border-emerald-500/50 ring-1 ring-emerald-500/30'
                      : rankIdx === 0 && !isPos
                      ? 'bg-red-950/20 border-red-500/50'
                      : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-xs font-bold ${
                          rankIdx === 0
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        Rank #{rankIdx + 1}
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          isPos
                            ? 'text-emerald-400'
                            : p.type === 'bm25-hard'
                            ? 'text-amber-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {p.typeBadge}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="text-slate-400">
                        BM25 得分: <strong className="text-amber-300">{p.bm25Score}</strong>
                      </span>
                      <span className="text-emerald-400 font-bold">
                        DPR 内积 E_QᵀE_P: {p.dprDot.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed font-serif">
                    “{p.text}”
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                    <span>
                      字面重合词 ({p.lexicalOverlapWords.length}个):{' '}
                      <code className="text-amber-300">
                        {p.lexicalOverlapWords.join(', ') || '无'}
                      </code>
                    </span>
                    <div className="w-32 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isPos ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(100, p.dprDot)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: B x 2B In-Batch Matrix & Strategy Explanation */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Grid className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              批内相似度矩阵 S = Q·Pᵀ 可视化
            </h3>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            在一个训练 Batch 内，对角线 <code className="text-emerald-400">(qᵢ, pᵢ⁺)</code> 为正样本，非对角线 <code className="text-slate-300">(qᵢ, pⱼ⁺)</code> 自动复用为批内负样本，右侧附加列为专属 <code className="text-amber-400">BM25 Hard Negative</code>：
          </p>

          <div className="grid grid-cols-5 gap-1.5 text-center font-mono text-[10px] p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-slate-500 py-1">Q \ P</div>
            <div className="text-emerald-400 py-1">p₁⁺</div>
            <div className="text-emerald-400 py-1">p₂⁺</div>
            <div className="text-emerald-400 py-1">p₃⁺</div>
            <div className="text-amber-400 py-1">p₁⁻(BM25)</div>

            <div className="text-slate-300 py-2 font-bold">q₁</div>
            <div className="bg-emerald-500/30 border border-emerald-500 text-emerald-300 py-2 rounded font-bold">
              {posPassage.dprDot.toFixed(0)}
            </div>
            <div className="bg-slate-900 border border-slate-800 text-slate-400 py-2 rounded">
              44
            </div>
            <div className="bg-slate-900 border border-slate-800 text-slate-400 py-2 rounded">
              13
            </div>
            <div
              className={`py-2 rounded font-bold border ${
                trainingStrategy === 'inBatchPlusHard'
                  ? 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                  : 'bg-red-950/40 border-red-500 text-red-300'
              }`}
            >
              {activeCase.passages
                .find(x => x.type === 'bm25-hard')
                ?.dprScoresByStrategy[trainingStrategy].toFixed(0)}
            </div>

            <div className="text-slate-300 py-2 font-bold">q₂</div>
            <div className="bg-slate-900 border border-slate-800 text-slate-400 py-2 rounded">
              39
            </div>
            <div className="bg-emerald-500/30 border border-emerald-500 text-emerald-300 py-2 rounded font-bold">
              83
            </div>
            <div className="bg-slate-900 border border-slate-800 text-slate-400 py-2 rounded">
              18
            </div>
            <div className="bg-slate-900 border border-slate-800 text-slate-400 py-2 rounded">
              29
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/30 text-xs text-emerald-300 space-y-1.5 leading-relaxed">
            <div className="font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>当前策略解析：</span>
            </div>
            {trainingStrategy === 'random' && (
              <p>
                <strong>仅用随机负样本：</strong>模型从未见过“关键词高度重合但实则错误”的干扰项，因此面对 BM25 困难负样本时 easily 被表面重合词欺骗（给出了 71.0 的高分，高于正样本的 68.5）！
              </p>
            )}
            {trainingStrategy === 'inBatch' && (
              <p>
                <strong>纯批内负样本（In-Batch）：</strong>借助 127 个同批正样本互作负样本，模型大幅拉开了与无关主题段落的距离，但对高仿词面陷阱的压制仍不够彻底。
              </p>
            )}
            {trainingStrategy === 'inBatchPlusHard' && (
              <p>
                <strong>批内 + BM25 困难负样本：</strong>专门把 BM25 误判的高仿段落加入分母惩罚项，迫使 BERT 深入理解“bad guy = main antagonist”，一举将正样本内积推升至 84.8，压低假阳性至 61.3！
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
