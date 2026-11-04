import React, { useState } from 'react';
import {
  Cpu,
  Sparkles,
  Grid,
  Zap,
  CheckCircle2,
  Sliders,
  Clock
} from 'lucide-react';

interface ColbertExample {
  id: string;
  title: string;
  queryText: string;
  docTitle: string;
  docText: string;
  queryTokens: {
    token: string;
    isMask?: boolean;
    latentMeaning?: string;
    sims: number[]; // cosine similarity with each doc token
  }[];
  docTokens: string[];
  singleVectorScore: number;
  crossEncoderLatencyMs: number;
  colbertLatencyMs: number;
}

const COLBERT_EXAMPLES: ColbertExample[] = [
  {
    id: 'hormone-imbalance',
    title: '案例1：论文 Figure 3 经典交互 — 细粒度对齐与 [MASK] 软扩展',
    queryText: 'what causes hormone imbalance in men',
    docTitle: 'Passage #48219: Male Endocrine & Testosterone Disorders',
    docText: 'Low testosterone and aging often trigger hormonal imbalances in adult males.',
    docTokens: [
      'Low',
      'testosterone',
      'and',
      'aging',
      'often',
      'trigger',
      'hormonal',
      'imbalances',
      'in',
      'adult',
      'males'
    ],
    queryTokens: [
      {
        token: '[Q]',
        sims: [0.18, 0.25, 0.1, 0.22, 0.12, 0.31, 0.28, 0.29, 0.11, 0.2, 0.27]
      },
      {
        token: 'causes',
        sims: [0.35, 0.28, 0.14, 0.48, 0.22, 0.89, 0.24, 0.3, 0.12, 0.18, 0.21]
      },
      {
        token: 'hormone',
        sims: [0.22, 0.82, 0.09, 0.19, 0.11, 0.25, 0.96, 0.45, 0.08, 0.15, 0.24]
      },
      {
        token: 'imbalance',
        sims: [0.41, 0.36, 0.1, 0.21, 0.15, 0.33, 0.42, 0.95, 0.09, 0.14, 0.19]
      },
      {
        token: 'men',
        sims: [0.14, 0.44, 0.08, 0.19, 0.1, 0.15, 0.22, 0.18, 0.12, 0.62, 0.94]
      },
      {
        token: '[MASK]₁',
        isMask: true,
        latentMeaning: '隐式扩展概念: testosterone / androgen (雄激素)',
        sims: [0.32, 0.88, 0.08, 0.29, 0.11, 0.24, 0.56, 0.38, 0.07, 0.31, 0.52]
      },
      {
        token: '[MASK]₂',
        isMask: true,
        latentMeaning: '隐式扩展概念: aging / deficiency (缺乏/衰老病因)',
        sims: [0.74, 0.41, 0.09, 0.81, 0.16, 0.42, 0.28, 0.35, 0.08, 0.29, 0.25]
      }
    ],
    singleVectorScore: 0.64,
    crossEncoderLatencyMs: 32000,
    colbertLatencyMs: 54
  },
  {
    id: 'canada-tax-records',
    title: '案例2：跨词汇细粒度约束核验（加拿大税务保存年限）',
    queryText: 'how long hold tax records canada',
    docTitle: 'Passage #10942: CRA Document Retention Rules',
    docText: 'Canadian taxpayers must keep supporting financial documents for six years.',
    docTokens: [
      'Canadian',
      'taxpayers',
      'must',
      'keep',
      'supporting',
      'financial',
      'documents',
      'for',
      'six',
      'years'
    ],
    queryTokens: [
      {
        token: '[Q]',
        sims: [0.24, 0.28, 0.15, 0.22, 0.18, 0.21, 0.25, 0.12, 0.31, 0.35]
      },
      {
        token: 'how long',
        sims: [0.15, 0.14, 0.19, 0.28, 0.12, 0.16, 0.18, 0.42, 0.86, 0.93]
      },
      {
        token: 'hold',
        sims: [0.12, 0.18, 0.34, 0.91, 0.29, 0.15, 0.32, 0.19, 0.14, 0.21]
      },
      {
        token: 'tax',
        sims: [0.38, 0.92, 0.14, 0.19, 0.25, 0.78, 0.34, 0.11, 0.15, 0.18]
      },
      {
        token: 'records',
        sims: [0.16, 0.29, 0.12, 0.35, 0.48, 0.52, 0.95, 0.14, 0.12, 0.19]
      },
      {
        token: 'canada',
        sims: [0.97, 0.46, 0.11, 0.14, 0.15, 0.22, 0.19, 0.09, 0.11, 0.15]
      },
      {
        token: '[MASK]₁',
        isMask: true,
        latentMeaning: '隐式扩展概念: duration / period / years (年限周期)',
        sims: [0.18, 0.22, 0.25, 0.44, 0.19, 0.21, 0.31, 0.38, 0.84, 0.89]
      }
    ],
    singleVectorScore: 0.59,
    crossEncoderLatencyMs: 32000,
    colbertLatencyMs: 54
  }
];

export const ColbertMaxSimSimulator: React.FC = () => {
  const [selectedExampleId, setSelectedExampleId] = useState<string>(COLBERT_EXAMPLES[0].id);
  const [enableMaskAugmentation, setEnableMaskAugmentation] = useState<boolean>(true);
  const [vectorDim, setVectorDim] = useState<128 | 32 | 16>(128);
  const [hoveredQueryIdx, setHoveredQueryIdx] = useState<number | null>(null);

  const example =
    COLBERT_EXAMPLES.find(e => e.id === selectedExampleId) || COLBERT_EXAMPLES[0];

  const activeQueryTokens = enableMaskAugmentation
    ? example.queryTokens
    : example.queryTokens.filter(q => !q.isMask);

  // Dimension compression multiplier (tiny realistic drop when compressing 128 -> 32 -> 16)
  const dimFactor = vectorDim === 128 ? 1.0 : vectorDim === 32 ? 0.99 : 0.975;

  // Compute MaxSim per query token and total S_{q,d}
  const rowMaxDetails = activeQueryTokens.map(qt => {
    let maxVal = -1;
    let maxDocIdx = 0;
    qt.sims.forEach((v, dIdx) => {
      const scaled = Number((v * dimFactor).toFixed(2));
      if (scaled > maxVal) {
        maxVal = scaled;
        maxDocIdx = dIdx;
      }
    });
    return {
      ...qt,
      maxVal,
      maxDocIdx,
      bestDocToken: example.docTokens[maxDocIdx]
    };
  });

  const totalMaxSimScore = rowMaxDetails.reduce((acc, r) => acc + r.maxVal, 0);
  const indexSizeGb = vectorDim === 128 ? 154 : vectorDim === 32 ? 29 : 15;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header & Controls */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>ColBERT 词元级延迟交互与 MaxSim 矩阵实验台</span>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                  SIGIR 2020 原版矩阵可视化
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                实时探索每个查询 Token（含 `[MASK]` 软扩展词元）如何在文档 Token 中寻找最佳匹配峰值（MaxSim Peak ★），并测试向量降维压缩对索引体积的影响。
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Toggle [MASK] Query Augmentation */}
            <button
              onClick={() => setEnableMaskAugmentation(!enableMaskAugmentation)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                enableMaskAugmentation
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>[MASK] 查询软扩展: {enableMaskAugmentation ? '已开启' : '已关闭'}</span>
            </button>

            {/* Dimension selector */}
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
              <span className="text-slate-400 px-1.5">词向量维度 m:</span>
              {([128, 32, 16] as const).map(dim => (
                <button
                  key={dim}
                  onClick={() => setVectorDim(dim)}
                  className={`px-2 py-1 rounded-lg font-mono cursor-pointer ${
                    vectorDim === dim
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {dim}d
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Example Switcher & Quick Metrics */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-medium">选择交互案例：</span>
            {COLBERT_EXAMPLES.map(ex => (
              <button
                key={ex.id}
                onClick={() => setSelectedExampleId(ex.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  selectedExampleId === ex.id
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {ex.title}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-emerald-400 font-bold">
              MaxSim 总分 S_q,d = {totalMaxSimScore.toFixed(2)}
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-teal-400">
              880万段索引体积 ({vectorDim}d): {indexSizeGb} GB
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-300">重排耗时: 54ms (快170倍)</span>
          </div>
        </div>
      </div>

      {/* Interactive Late Interaction Matrix (|E_q| x |E_d|) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Grid className="w-4 h-4 text-emerald-400" />
              <span>
                词元级余弦相似度矩阵 E_q · E_dᵀ 与 MaxSim 峰值定位（点击或悬停行查看对齐细节）
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              每一行代表一个查询词向量 $E_{'{q_i}'}$，其中标有 <strong className="text-emerald-400">★</strong> 的高亮格即为该行在文档中找到的最大内积匹配 $\max_j (E_{'{q_i}'} \cdot E_{'{d_j}'}^\top)$！
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400">
            S_q,d = ∑ᵢ maxⱼ (E_qᵢ · E_dⱼᵀ) = {totalMaxSimScore.toFixed(2)}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80">
                <th className="py-2.5 px-3 text-left text-slate-400">查询词 E_qᵢ \ 文档词 E_dⱼ</th>
                {example.docTokens.map((dt, dIdx) => (
                  <th key={dIdx} className="py-2.5 px-2 text-center text-slate-200 font-bold">
                    {dt}
                  </th>
                ))}
                <th className="py-2.5 px-3 text-right text-emerald-400 bg-emerald-950/20">
                  行最大值 (MaxSim)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {rowMaxDetails.map((row, qIdx) => {
                const isHovered = hoveredQueryIdx === qIdx;
                return (
                  <tr
                    key={qIdx}
                    onMouseEnter={() => setHoveredQueryIdx(qIdx)}
                    onMouseLeave={() => setHoveredQueryIdx(null)}
                    className={`transition-colors ${
                      isHovered ? 'bg-slate-800/50' : 'hover:bg-slate-800/30'
                    }`}
                  >
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded font-bold ${
                            row.isMask
                              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                              : 'bg-slate-800 text-white'
                          }`}
                        >
                          {row.token}
                        </span>
                      </div>
                      {row.latentMeaning && (
                        <div className="text-[10px] font-sans text-teal-400 mt-0.5">
                          {row.latentMeaning}
                        </div>
                      )}
                    </td>

                    {row.sims.map((rawVal, dIdx) => {
                      const val = Number((rawVal * dimFactor).toFixed(2));
                      const isRowMax = dIdx === row.maxDocIdx;
                      return (
                        <td key={dIdx} className="py-2 px-1.5 text-center">
                          <div
                            className={`py-1.5 px-1 rounded transition-all ${
                              isRowMax
                                ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm ring-2 ring-emerald-400'
                                : val >= 0.5
                                ? 'bg-emerald-950/40 text-emerald-300 font-semibold'
                                : 'text-slate-500'
                            }`}
                          >
                            {val.toFixed(2)}
                            {isRowMax && ' ★'}
                          </div>
                        </td>
                      );
                    })}

                    <td className="py-2.5 px-3 text-right font-bold text-emerald-400 bg-emerald-950/15 whitespace-nowrap">
                      +{row.maxVal.toFixed(2)}{' '}
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({row.bestDocToken})
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary Alignment Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block">
              单向量双塔 (DPR Single-Vector)
            </span>
            <span className="text-base font-mono font-bold text-slate-300">
              单一全局点积: {example.singleVectorScore} (丢失词级对齐)
            </span>
            <p className="text-[11px] text-slate-500">
              所有词混作一团，无法逐一核验每个查询修饰词是否出现。
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-1">
            <span className="text-[11px] text-emerald-400 font-semibold block">
              🌟 ColBERT 延迟交互 (本文)
            </span>
            <span className="text-base font-mono font-bold text-emerald-300">
              MaxSim 累加得分: {totalMaxSimScore.toFixed(2)} (耗时 54ms)
            </span>
            <p className="text-[11px] text-emerald-200/80">
              每个查询词与 [MASK] 扩展词均在文档中锁定最佳拍档，兼顾极速与高分辨率！
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block">
              BERT Cross-Encoder (全交叉重排)
            </span>
            <span className="text-base font-mono font-bold text-amber-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>耗时 32,000 ms (慢 170+ 倍!)</span>
            </span>
            <p className="text-[11px] text-slate-500">
              每次查询必须将 1000 篇文档重新拼接跑完 12 层 BERT，算力开销高出 1400 倍。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
