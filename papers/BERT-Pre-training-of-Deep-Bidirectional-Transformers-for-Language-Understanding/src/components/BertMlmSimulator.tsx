import React, { useState } from 'react';
import { Eye, Shuffle, Layers, ArrowLeftRight, Lock } from 'lucide-react';

interface SentenceCase {
  id: string;
  label: string;
  tokens: string[];
  targetIdx: number;
  rightCueIdx: number;
  bertPred: { word: string; prob: number; sense: string }[];
  gptPred: { word: string; prob: number; sense: string }[];
  explanation: string;
}

const CASES: SentenceCase[] = [
  {
    id: 'river-bank',
    label: '语境 A：河岸 (River Bank)',
    tokens: ['[CLS]', 'He', 'sat', 'on', 'the', '[MASK]', 'of', 'the', 'river', 'watching', 'fish', '[SEP]'],
    targetIdx: 5,
    rightCueIdx: 8,
    bertPred: [
      { word: 'bank (河岸)', prob: 86, sense: '结合右侧 "river" 与 "fish" 精准锁定自然地理含义' },
      { word: 'shore (岸边)', prob: 11, sense: '同义自然景观词' },
      { word: 'edge (边缘)', prob: 3, sense: '泛化空间名词' },
    ],
    gptPred: [
      { word: 'floor (地板)', prob: 41, sense: '仅看到左侧 "He sat on the"，盲猜常见室内名词' },
      { word: 'chair (椅子)', prob: 35, sense: '无法偷看右侧 "of the river"，完全丢失水域线索' },
      { word: 'edge (边缘)', prob: 24, sense: '通用位置词' },
    ],
    explanation:
      '目标位置在第 5 个词，而决定它是「河岸」的关键线索词 "river" 和 "fish" 出现在第 8、10 个位置（右侧）！单向 GPT 因因果掩码阻断完全看不见右侧线索，只有双向 BERT 才能一击命中。',
  },
  {
    id: 'money-bank',
    label: '语境 B：银行 (Financial Bank)',
    tokens: ['[CLS]', 'He', 'went', 'to', 'the', '[MASK]', 'to', 'deposit', 'his', 'salary', 'cash', '[SEP]'],
    targetIdx: 5,
    rightCueIdx: 7,
    bertPred: [
      { word: 'bank (银行)', prob: 91, sense: '双向自注意力直接捕获右侧 "deposit" 与 "salary"' },
      { word: 'branch (分行)', prob: 6, sense: '金融机构下位词' },
      { word: 'counter (柜台)', prob: 3, sense: '交易场所相关词' },
    ],
    gptPred: [
      { word: 'store (商店)', prob: 48, sense: '仅凭左侧 "He went to the"，无法得知后续动作是存钱' },
      { word: 'office (办公室)', prob: 31, sense: '高频去往地点' },
      { word: 'park (公园)', prob: 21, sense: '缺乏右侧动词约束的盲目预测' },
    ],
    explanation:
      '左侧前缀 "He went to the" 具有极高不确定性，决定场所性质的动作 "deposit his salary cash" 全部位于右侧上下文中。',
  },
];

const EMBEDDING_DEMO = [
  { pos: 0, tok: '[CLS]', seg: 'E_A (句子 A)', posEmb: 'E_0', role: '聚合全句/句对分类语义 (向量 C)' },
  { pos: 1, tok: '检索', seg: 'E_A (句子 A)', posEmb: 'E_1', role: '句子 A 词元' },
  { pos: 2, tok: '增强', seg: 'E_A (句子 A)', posEmb: 'E_2', role: '句子 A 词元' },
  { pos: 3, tok: '[SEP]', seg: 'E_A (句子 A)', posEmb: 'E_3', role: '句子 A 结束分隔符' },
  { pos: 4, tok: '生成', seg: 'E_B (句子 B)', posEmb: 'E_4', role: '句子 B 词元 (切换为 E_B 段落向量)' },
  { pos: 5, tok: '答案', seg: 'E_B (句子 B)', posEmb: 'E_5', role: '句子 B 词元' },
  { pos: 6, tok: '[SEP]', seg: 'E_B (句子 B)', posEmb: 'E_6', role: '句子 B 结束分隔符' },
];

export const BertMlmSimulator: React.FC = () => {
  const [caseIdx, setCaseIdx] = useState<number>(0);
  const [archMode, setArchMode] = useState<'bert' | 'gpt'>('bert');
  const [maskMode, setMaskMode] = useState<'80-mask' | '10-random' | '10-keep'>('80-mask');

  const activeCase = CASES[caseIdx];
  const predictions = archMode === 'bert' ? activeCase.bertPred : activeCase.gptPred;

  const getCorruptedToken = (orig: string) => {
    if (maskMode === '80-mask') return '[MASK]';
    if (maskMode === '10-random') return 'apple (随机词)';
    return `${orig} (原词保留)`;
  };

  return (
    <div className="space-y-6">
      {/* Experiment 1: Bidirectional BERT vs Unidirectional GPT Context Disambiguation */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              实验一：深度双向注意力（BERT）vs. 单向从左到右注意力（GPT）语义消歧对比
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              切换语境与模型架构，观察第 5 个位置是否能突破方向封锁、捕获右侧关键线索词
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {CASES.map((c, i) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCaseIdx(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  caseIdx === i
                    ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}
            <div className="h-4 w-px bg-slate-800 mx-1" />
            <button
              type="button"
              onClick={() => setArchMode('bert')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-all ${
                archMode === 'bert'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              BERT 双向编码器
            </button>
            <button
              type="button"
              onClick={() => setArchMode('gpt')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-all ${
                archMode === 'gpt'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              GPT 单向从左到右
            </button>
          </div>
        </div>

        {/* Token Ribbon with Attention Reach Visualization */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 mb-4">
          <div className="text-xs text-slate-400 mb-2.5 flex items-center justify-between">
            <span>
              当前序列注意力视野（目标位置索引 <strong className="text-emerald-400">#{activeCase.targetIdx}</strong>，右侧核心线索词索引{' '}
              <strong className="text-purple-400">#{activeCase.rightCueIdx}</strong>）：
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              {archMode === 'bert' ? '双向全通：可同时关注左侧 + 右侧所有 Token' : '因果掩码：右侧 Token 全部被遮蔽 (Masked Out)'}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {activeCase.tokens.map((tok, idx) => {
              const isTarget = idx === activeCase.targetIdx;
              const isRightCue = idx === activeCase.rightCueIdx;
              const isBlockedByCausal = archMode === 'gpt' && idx > activeCase.targetIdx;
              const displayTok = isTarget ? getCorruptedToken('bank') : tok;

              return (
                <div
                  key={idx}
                  className={`px-2.5 py-2 rounded-lg border text-xs font-mono transition-all ${
                    isTarget
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold ring-2 ring-emerald-500/30'
                      : isBlockedByCausal
                      ? 'bg-slate-950/60 border-slate-800/70 text-slate-600 line-through opacity-55'
                      : isRightCue
                      ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="text-[10px] text-slate-500 mb-0.5">pos {idx}</div>
                  <div>{displayTok}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Prediction Comparison & 80-10-10 Selector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-7 space-y-2.5">
            <div className="text-xs font-bold text-slate-200">
              {archMode === 'bert' ? 'BERT 掩码语言模型 (MLM) Top-3 预测分布：' : '单向从左到右模型 Top-3 预测分布：'}
            </div>
            {predictions.map((p) => (
              <div key={p.word} className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-slate-200 font-mono">{p.word}</span>
                  <span className="font-mono font-bold text-emerald-400">{p.prob}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1.5">
                  <div
                    className={`h-full rounded-full ${archMode === 'bert' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${p.prob}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-400">{p.sense}</div>
              </div>
            ))}
          </div>

          {/* 80-10-10 Strategy Interactive Box */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <Shuffle className="w-4 h-4 text-blue-400" />
              实验二：15% MLM 的「80-10-10」替换策略模拟
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMaskMode('80-mask')}
                className={`p-2 rounded-lg border text-center transition-all ${
                  maskMode === '80-mask'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="text-sm font-mono font-bold">80%</div>
                <div className="text-[10px] mt-0.5">替换为 [MASK]</div>
              </button>
              <button
                type="button"
                onClick={() => setMaskMode('10-random')}
                className={`p-2 rounded-lg border text-center transition-all ${
                  maskMode === '10-random'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="text-sm font-mono font-bold">10%</div>
                <div className="text-[10px] mt-0.5">替换为随机词</div>
              </button>
              <button
                type="button"
                onClick={() => setMaskMode('10-keep')}
                className={`p-2 rounded-lg border text-center transition-all ${
                  maskMode === '10-keep'
                    ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="text-sm font-mono font-bold">10%</div>
                <div className="text-[10px] mt-0.5">保留真实原词</div>
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {maskMode === '80-mask' &&
                '80% 概率用特殊标记 [MASK] 遮盖原词，迫使模型完全依靠左右双向上下文完成完形填空。'}
              {maskMode === '10-random' &&
                '10% 概率替换为词表随机噪声词（如 "apple"），倒逼模型随时用上下文校验每个普通词是否合理，不能盲目照抄输入！'}
              {maskMode === '10-keep' &&
                '10% 概率保持真实原词不变，使模型表征偏向于真实观测到的单词，彻底弥合预训练与微调（无 [MASK]）的分布差距！'}
            </p>
          </div>
        </div>
      </div>

      {/* Experiment 3: Tri-Embedding Inspector */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
        <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-purple-400" />
          实验三：BERT 三合一输入表示合成器（E_input = E_token + E_segment + E_position）
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2 px-3">层次 / 位置</th>
                {EMBEDDING_DEMO.map((item) => (
                  <th key={item.pos} className="py-2 px-3 font-mono text-center">
                    Pos #{item.pos}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 font-mono">
              <tr>
                <td className="py-2.5 px-3 font-sans font-bold text-emerald-400">1. Token Embeddings</td>
                {EMBEDDING_DEMO.map((item) => (
                  <td key={item.pos} className="py-2.5 px-3 text-center text-slate-200 font-bold">
                    {item.tok}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans font-bold text-blue-400">2. Segment Embeddings</td>
                {EMBEDDING_DEMO.map((item) => (
                  <td
                    key={item.pos}
                    className={`py-2.5 px-3 text-center ${
                      item.seg.includes('E_A') ? 'text-blue-300' : 'text-purple-300'
                    }`}
                  >
                    {item.seg}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans font-bold text-amber-400">3. Position Embeddings</td>
                {EMBEDDING_DEMO.map((item) => (
                  <td key={item.pos} className="py-2.5 px-3 text-center text-amber-300">
                    {item.posEmb}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
