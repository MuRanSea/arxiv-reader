import React, { useState, useMemo } from 'react';
import { Cpu, Eye, ShieldAlert, Sparkles, Sliders, Layers } from 'lucide-react';

interface AttentionSentence {
  id: string;
  title: string;
  tokens: string[];
  heads: {
    id: string;
    name: string;
    desc: string;
    rawLogits: number[][];
  }[];
}

const SENTENCES: AttentionSentence[] = [
  {
    id: 'anaphora',
    title: '案例1：论文经典指代消解 — "The animal didn\'t cross ... because it was tired"',
    tokens: ['The', 'animal', 'didn\'t', 'cross', 'street', 'because', 'it', 'was', 'tired'],
    heads: [
      {
        id: 'head-coref',
        name: 'Head #1：跨距离指代追踪头 (Coreference Head)',
        desc: '专门负责寻找代词 "it" 在前文指代的真实实体 "animal"（跨越 5 个词元直接建立高权重连接）。',
        rawLogits: [
          [4.2, 2.8, 0.4, 0.2, 0.3, 0.1, 0.2, 0.1, 0.1],
          [2.5, 5.1, 0.8, 1.2, 0.6, 0.3, 1.8, 0.4, 1.5],
          [0.4, 2.1, 4.0, 2.9, 0.5, 0.3, 0.4, 0.2, 0.3],
          [0.3, 2.4, 2.2, 4.5, 3.2, 0.4, 0.5, 0.2, 0.2],
          [0.5, 0.6, 0.4, 2.8, 4.8, 0.3, 0.6, 0.2, 0.1],
          [0.2, 1.2, 0.9, 1.1, 0.5, 4.1, 2.2, 0.8, 1.4],
          [2.9, 6.4, 0.5, 0.6, 1.1, 0.8, 3.2, 1.2, 1.9], // 'it' strongly attends to 'animal' (6.4)
          [0.3, 1.8, 0.4, 0.3, 0.3, 0.5, 3.8, 4.2, 2.9],
          [0.4, 3.5, 0.3, 0.2, 0.2, 0.9, 4.1, 2.5, 4.9]
        ]
      },
      {
        id: 'head-syntax',
        name: 'Head #2：谓语与状态修饰头 (Predicate-Attribute Head)',
        desc: '专门关注动作与表语形容词的修饰关系，将 "it" 与其状态属性 "was tired" 紧密绑定。',
        rawLogits: [
          [4.5, 3.1, 0.2, 0.1, 0.2, 0.1, 0.1, 0.1, 0.1],
          [2.1, 4.6, 2.4, 3.1, 0.4, 0.2, 0.8, 0.3, 2.9],
          [0.3, 1.9, 4.2, 3.6, 0.5, 0.2, 0.3, 0.2, 0.2],
          [0.2, 2.0, 2.5, 4.7, 3.8, 0.3, 0.2, 0.1, 0.2],
          [0.4, 0.4, 0.3, 3.1, 4.9, 0.2, 0.3, 0.1, 0.1],
          [0.2, 0.8, 1.4, 1.8, 0.4, 4.3, 1.9, 1.5, 2.4],
          [0.5, 1.8, 0.4, 0.5, 0.4, 1.1, 3.4, 4.8, 6.2], // 'it' attends to 'tired' (6.2) & 'was' (4.8)
          [0.2, 0.9, 0.3, 0.2, 0.2, 0.6, 3.5, 4.4, 4.6],
          [0.3, 1.5, 0.2, 0.2, 0.2, 0.8, 4.5, 3.9, 5.2]
        ]
      }
    ]
  }
];

export const TransformerAttentionSimulator: React.FC = () => {
  const [selectedHeadIdx, setSelectedHeadIdx] = useState<number>(0);
  const [useSqrtScale, setUseSqrtScale] = useState<boolean>(true);
  const [useCausalMask, setUseCausalMask] = useState<boolean>(false);
  const [selectedQueryIdx, setSelectedQueryIdx] = useState<number>(6); // Default to token "it"

  const sentence = SENTENCES[0];
  const activeHead = sentence.heads[selectedHeadIdx];
  const dk = 64;
  const scaleFactor = useSqrtScale ? Math.sqrt(dk) : 1; // 8 vs 1

  // Compute scaled & masked softmax attention matrix
  const attentionMatrix = useMemo(() => {
    return activeHead.rawLogits.map((row, qIdx) => {
      const scaledRow = row.map((val, kIdx) => {
        if (useCausalMask && kIdx > qIdx) {
          return -Infinity;
        }
        // When not scaled by sqrt(d_k), raw dot products in 64-d have ~8x larger std dev
        const effectiveDot = useSqrtScale ? val : val * 4.5;
        return effectiveDot;
      });

      const maxVal = Math.max(...scaledRow.filter(v => v !== -Infinity));
      const exps = scaledRow.map(v => (v === -Infinity ? 0 : Math.exp(v - maxVal)));
      const sumExp = exps.reduce((a, b) => a + b, 0) || 1;
      return exps.map(e => e / sumExp);
    });
  }, [activeHead, useSqrtScale, useCausalMask]);

  const activeQueryWeights = attentionMatrix[selectedQueryIdx] || [];
  const maxWeightInRow = Math.max(...activeQueryWeights);

  // Measure entropy / saturation warning when √d_k scaling is disabled
  const isSaturated = !useSqrtScale && maxWeightInRow > 0.96;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Control Panel */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Transformer 缩放点积与多头自注意力实验台</span>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/15 text-emerald-300 rounded border border-emerald-500/30">
                  NeurIPS 2017 核心算子
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                实时切换多头注意力子空间（Head #1 vs Head #2）、开关 √d_k 缩放因子与解码器因果掩码（Causal Mask），观察 Softmax 权重矩阵的变化。
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => setUseSqrtScale(!useSqrtScale)}
              className={`px-3 py-1.5 rounded-xl font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                useSqrtScale
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-sm'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>÷ √d_k 缩放: {useSqrtScale ? '已开启 (÷8)' : '已关闭 (梯度饱和警告!)'}</span>
            </button>

            <button
              onClick={() => setUseCausalMask(!useCausalMask)}
              className={`px-3 py-1.5 rounded-xl font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                useCausalMask
                  ? 'bg-teal-500 text-slate-950 border-teal-400 font-bold shadow-sm'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{useCausalMask ? 'Decoder 因果掩码 (Masked)' : 'Encoder 双向全可见'}</span>
            </button>
          </div>
        </div>

        {/* Multi-Head Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>选择注意力头 (Multi-Head Subspace):</span>
            </span>
            {sentence.heads.map((h, idx) => (
              <button
                key={h.id}
                onClick={() => setSelectedHeadIdx(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  selectedHeadIdx === idx
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {h.name}
              </button>
            ))}
          </div>

          <div className="text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
            公式: softmax(Q·Kᵀ / {scaleFactor}{useCausalMask ? ' + M_mask' : ''}) · V
          </div>
        </div>

        {/* Saturation Warning Banner */}
        {isSaturated && (
          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-300 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong>梯度饱和警告（未除以 √d_k）：</strong>
              当关闭 <code>÷ √d_k</code> 缩放时，64 维点积方差扩大 64 倍，导致最大权重飙升至{' '}
              <strong>{(maxWeightInRow * 100).toFixed(2)}%</strong>，其余词权重几乎坍缩为 0%，Softmax 导数{' '}
              <code>s(1-s) ≈ 0</code>，引发严重的梯度消失！
            </div>
          </div>
        )}
      </div>

      {/* Main Attention Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Query Token Selector & Attention Distribution */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white">
              1. 点击任意词元作为 Query (qᵢ) 查看其注意力分布
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{activeHead.desc}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap gap-2">
            {sentence.tokens.map((tok, idx) => {
              const isSelected = selectedQueryIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedQueryIdx(idx)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-md'
                      : 'bg-slate-900 text-slate-200 border-slate-700 hover:border-emerald-500/50'
                  }`}
                >
                  {tok}
                </button>
              );
            })}
          </div>

          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">
                当前 Query 词元：<code className="text-emerald-400 font-bold">"{sentence.tokens[selectedQueryIdx]}"</code> (位置 i={selectedQueryIdx})
              </span>
              <span className="text-slate-400 font-mono text-[11px]">权重总和 = 100%</span>
            </div>

            {sentence.tokens.map((keyTok, kIdx) => {
              const weight = activeQueryWeights[kIdx] || 0;
              const isMasked = useCausalMask && kIdx > selectedQueryIdx;
              const isPeak = weight === maxWeightInRow && weight > 0;

              return (
                <div key={kIdx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className={isPeak ? 'text-emerald-300 font-bold' : 'text-slate-300'}>
                      Key [{kIdx}] "{keyTok}" {isPeak && '★ 最强关注'}
                    </span>
                    <span className={isMasked ? 'text-red-400' : isPeak ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                      {isMasked ? '-∞ (已掩码 0.0%)' : `${(weight * 100).toFixed(1)}%`}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isMasked
                          ? 'bg-red-500/30'
                          : isPeak
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : 'bg-slate-600'
                      }`}
                      style={{ width: `${Math.max(isMasked ? 0 : 2, weight * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Full N x N Attention Heatmap Matrix */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">
                2. 全序列自注意力权重矩阵 A = softmax(QKᵀ / √d_k)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                行表示 Query (qᵢ)，列表示 Key (kⱼ)。任意两词直接交互，路径长度恒为 O(1)！
              </p>
            </div>
            <span className="text-[11px] font-mono text-emerald-400">
              {useCausalMask ? '下三角自回归矩阵' : '全连接双向矩阵'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[11px] font-mono border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80">
                  <th className="py-2 px-2 text-left text-slate-400">Q \ K</th>
                  {sentence.tokens.map((t, idx) => (
                    <th key={idx} className="py-2 px-1.5 text-center text-slate-200 font-bold">
                      {t}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {attentionMatrix.map((row, qIdx) => {
                  const isActiveRow = qIdx === selectedQueryIdx;
                  const rowMax = Math.max(...row);
                  return (
                    <tr
                      key={qIdx}
                      onClick={() => setSelectedQueryIdx(qIdx)}
                      className={`cursor-pointer transition-colors ${
                        isActiveRow ? 'bg-emerald-950/30' : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-2 px-2 font-bold text-slate-200 whitespace-nowrap">
                        {sentence.tokens[qIdx]}
                      </td>
                      {row.map((w, kIdx) => {
                        const isMasked = useCausalMask && kIdx > qIdx;
                        const isMax = w === rowMax && w > 0;
                        return (
                          <td key={kIdx} className="p-1 text-center">
                            <div
                              className={`py-1.5 px-1 rounded transition-all ${
                                isMasked
                                  ? 'bg-slate-950 text-slate-600 line-through'
                                  : isMax
                                  ? 'bg-emerald-500 text-slate-950 font-extrabold'
                                  : w >= 0.15
                                  ? 'bg-emerald-950/40 text-emerald-300 font-semibold'
                                  : 'text-slate-500'
                              }`}
                            >
                              {isMasked ? '0.00' : w.toFixed(2)}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 leading-relaxed">
            <Sparkles className="w-3.5 h-3.5 inline mr-1.5 text-emerald-400" />
            <strong>实验洞察：</strong>
            当选中第 7 个词 <code>"it"</code> 时，切换顶部的 <strong>Head #1</strong> 与 <strong>Head #2</strong> 可以清楚看到：Head #1 将最高权重分配给 <code>"animal"</code>（解决主语指代），而 Head #2 将最高权重分配给 <code>"tired"</code>（绑定状态原因）；当开启 <strong>Decoder 因果掩码</strong> 时，<code>"it"</code> 无法再看到它右侧的 <code>"was"</code> 和 <code>"tired"</code>（右上角全部归零）！
          </div>
        </div>
      </div>
    </div>
  );
};
