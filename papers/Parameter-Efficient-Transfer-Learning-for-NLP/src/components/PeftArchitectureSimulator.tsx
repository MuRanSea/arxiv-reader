import React, { useState, useMemo } from 'react';
import { Cpu, Layers, Sliders, Sparkles, GitBranch, CheckCircle2 } from 'lucide-react';

type PeftMethodId = 'serial-adapter' | 'parallel-adapter' | 'prefix-tuning' | 'prompt-tuning' | 'mam-adapter';

interface PeftMethodSpec {
  id: PeftMethodId;
  nameZh: string;
  nameEn: string;
  formula: string;
  functionalForm: string;
  modifiedRep: string;
  connectionMode: string;
  compositionFunc: string;
  glueScoreAt3Pct: number;
  xsumRouge2: number;
  latencyOverhead: string;
  desc: string;
}

const PEFT_METHODS: PeftMethodSpec[] = [
  {
    id: 'serial-adapter',
    nameZh: '1. Houlsby 串行瓶颈 Adapter (ICML 2019 开山)',
    nameEn: 'Serial Bottleneck Adapter',
    formula: 'h ← h + f(h · W_down) · W_up',
    functionalForm: '非线性瓶颈 MLP: f(·W_down)W_up (ReLU/GELU)',
    modifiedRep: 'MHA 与 FFN 子层输出 h',
    connectionMode: '串行连接 (Sequential / Serial)',
    compositionFunc: '直接残差相加: h + Δh',
    glueScoreAt3Pct: 80.0,
    xsumRouge2: 21.15,
    latencyOverhead: '+20% ~ +30% (增加层深)',
    desc: '在每个 Transformer 层的自注意力和 FFN 之后串行插入降维(d→m)与升维(m→d)模块，配合跳跃连接与近零恒等初始化。'
  },
  {
    id: 'parallel-adapter',
    nameZh: '2. 并行瓶颈 Adapter (Parallel Adapter, ICLR 2022)',
    nameEn: 'Scaled Parallel Adapter',
    formula: 'h ← FFN(x) + s · f(x · W_down) · W_up',
    functionalForm: '非线性瓶颈 MLP + 缩放因子 s',
    modifiedRep: 'FFN 子层输出 (读取子层输入 x)',
    connectionMode: '并行连接 (Parallel)',
    compositionFunc: '缩放相加: h + s · Δh',
    glueScoreAt3Pct: 80.5,
    xsumRouge2: 21.72,
    latencyOverhead: '+5% (可与主干矩阵并行)',
    desc: '将瓶颈模块从 FFN 之后移到与 FFN 并联的位置，直接接收子层输入 x，不仅减少了串行等待，还在生成与理解任务上显著超越串行 Adapter！'
  },
  {
    id: 'prefix-tuning',
    nameZh: '3. 前缀微调 (Prefix-Tuning, ACL 2021)',
    nameEn: 'Prefix-Tuning (Attention Key/Value Prefix)',
    formula: 'h ← (1 - λ(x))·Attn(Q,K,V) + λ(x)·softmax(x W_q P_kᵀ) P_v',
    functionalForm: 'Softmax 注意力瓶颈: softmax(x W_q P_kᵀ) P_v',
    modifiedRep: '每一层 Multi-Head Attention 的 Key / Value',
    connectionMode: '并行连接 (Parallel with Attention)',
    compositionFunc: '门控插值组合: (1-λ)h + λΔh',
    glueScoreAt3Pct: 79.4,
    xsumRouge2: 20.46,
    latencyOverhead: '挤占 l 个上下文窗口长度',
    desc: '在每一层注意力的 K 和 V 前拼接 l 个可学习前缀向量。ICLR 2022 证明其在数学上等价于带 Softmax 激活与门控系数的并行 Adapter！'
  },
  {
    id: 'prompt-tuning',
    nameZh: '4. 软提示微调 (Prompt-Tuning, EMNLP 2021)',
    nameEn: 'Prompt-Tuning (Input Embedding Soft Prompts)',
    formula: 'X_0 ← [P_emb ; X_embed] ∈ ℝ^((l+n) × d)',
    functionalForm: '输入层连续可学习词嵌入矩阵 P_emb',
    modifiedRep: '仅第 0 层输入词嵌入序列 X_0',
    connectionMode: '输入端前置拼接 (Prepend)',
    compositionFunc: '序列维度拼接',
    glueScoreAt3Pct: 75.8,
    xsumRouge2: 17.85,
    latencyOverhead: '极低 (仅增加输入 token 数)',
    desc: '只在最底层输入 Embedding 前拼接几十个连续软提示向量，参数量不到 0.01%。在百亿参数大模型上效果优异，但在中小型模型上弱于全层 Adapter。'
  },
  {
    id: 'mam-adapter',
    nameZh: '5. 🌟 MAM 混合匹配适配器 (Mix-and-Match, ICLR 2022 冠军)',
    nameEn: 'MAM Adapter (Prefix @ Attn + Parallel Adapter @ FFN)',
    formula: 'Attn: Prefix(l=30)  +  FFN: FFN(x) + s · f(x W_down) W_up',
    functionalForm: '注意力层 Softmax 前缀 + FFN 层非线性并行瓶颈',
    modifiedRep: '同时修饰 Attention Head 与 FFN 输出',
    connectionMode: '全并行混合拓扑 (Hybrid Parallel)',
    compositionFunc: '门控插值 (Attn) + 缩放相加 (FFN)',
    glueScoreAt3Pct: 80.8,
    xsumRouge2: 21.95,
    latencyOverhead: '+6% (高度并行)',
    desc: '基于统一数学框架的集大成之作：在注意力层使用小规模 Prefix-Tuning (l=30)，在 FFN 层使用大自然容量的缩放并行 Adapter，全面夺得各项基准第一！'
  }
];

export const PeftArchitectureSimulator: React.FC = () => {
  const [selectedMethodId, setSelectedMethodId] = useState<PeftMethodId>('serial-adapter');
  const [bottleneckDimM, setBottleneckDimM] = useState<number>(64);
  const [initScaleLog, setInitScaleLog] = useState<number>(-2); // 10^-2 (Near-identity) vs 10^0 (Broken)

  const activeMethod = PEFT_METHODS.find(m => m.id === selectedMethodId) || PEFT_METHODS[0];

  // BERT-Large: 24 layers, d=1024, 330M params
  const stats = useMemo(() => {
    const d = 1024;
    const layers = 24;
    const adaptersPerLayer = selectedMethodId === 'serial-adapter' ? 2 : 1;
    const paramsPerAdapter = 2 * d * bottleneckDimM + d + bottleneckDimM;
    const layerNormParams = layers * 4 * d;
    const totalAddedParams =
      selectedMethodId === 'prompt-tuning'
        ? bottleneckDimM * d
        : layers * adaptersPerLayer * paramsPerAdapter + layerNormParams;

    const pctOfBert = (totalAddedParams / 335_000_000) * 100;

    // Simulate accuracy impact of bottleneck dimension m & initialization scale
    const initPenalty = initScaleLog >= -1 ? (initScaleLog === 0 ? 28.5 : 8.2) : 0;
    const dimBonus =
      bottleneckDimM === 8 ? -0.6 : bottleneckDimM === 64 ? 0 : bottleneckDimM === 256 ? 0.2 : -1.2;

    const effectiveGlue = Math.max(
      50.0,
      +(activeMethod.glueScoreAt3Pct + dimBonus - initPenalty).toFixed(1)
    );

    return {
      totalAddedParamsM: (totalAddedParams / 1e6).toFixed(2),
      pctOfBert: pctOfBert.toFixed(2),
      effectiveGlue,
      isInitBroken: initScaleLog >= -1
    };
  }, [selectedMethodId, bottleneckDimM, initScaleLog, activeMethod]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header & Method Selector */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>PEFT 参数高效微调四大范式与瓶颈 Adapter 实验台</span>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/15 text-emerald-300 rounded border border-emerald-500/30">
                  ICML 2019 & ICLR 2022 统一视图
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                切换 5 种核心 PEFT 架构（串行 Adapter、并行 Adapter、Prefix、Prompt、MAM），调节瓶颈维度 m 与恒等初始化尺度，观察 Δh 统一公式与精度变化。
              </p>
            </div>
          </div>
        </div>

        {/* 5 PEFT Paradigms Selector */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400 block">
            选择 PEFT 微调范式（基于 He et al., ICLR 2022 统一数学框架）：
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            {PEFT_METHODS.map(m => {
              const isSelected = m.id === selectedMethodId;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMethodId(m.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-300 shadow-md ring-1 ring-emerald-500/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold text-white leading-snug mb-1">{m.nameZh}</div>
                  <div className="text-[10px] font-mono text-emerald-400">{m.connectionMode}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottleneck Dim m & Initialization Scale Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                <span>瓶颈维度 / 前缀长度 m (Bottleneck Dim):</span>
              </span>
              <span className="font-mono font-bold text-emerald-400">
                m = {bottleneckDimM} (压缩 {(1024 / bottleneckDimM).toFixed(0)} 倍)
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[2, 8, 64, 256].map(val => (
                <button
                  key={val}
                  onClick={() => setBottleneckDimM(val)}
                  className={`py-1.5 rounded-lg font-mono text-xs font-bold border transition-all cursor-pointer ${
                    bottleneckDimM === val
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  m={val}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold">
                权重初始化标准差 σ (Near-Identity Init 消融):
              </span>
              <span
                className={`font-mono font-bold ${
                  stats.isInitBroken ? 'text-red-400' : 'text-teal-400'
                }`}
              >
                σ = 10^{initScaleLog}{' '}
                {stats.isInitBroken ? '(破坏恒等映射!)' : '(近似恒等起步 ✓)'}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[-4, -2, -1, 0].map(exp => (
                <button
                  key={exp}
                  onClick={() => setInitScaleLog(exp)}
                  className={`py-1.5 rounded-lg font-mono text-xs font-bold border transition-all cursor-pointer ${
                    initScaleLog === exp
                      ? exp >= -1
                        ? 'bg-red-500 text-slate-950 border-red-400'
                        : 'bg-teal-500 text-slate-950 border-teal-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  10^{exp} {exp === -2 && '(推荐)'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Unified Framework Inspector & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Unified Design Dimensions Breakdown */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>统一数学视图剖析：{activeMethod.nameZh}</span>
            </h3>
            <span className="text-xs font-mono text-emerald-400">{activeMethod.nameEn}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1.5">
            <span className="text-[11px] text-slate-400 block">核心表征增量修正方程 (Δh Unified Formula):</span>
            <div className="text-sm sm:text-base font-mono font-bold text-teal-300 overflow-x-auto py-1">
              {activeMethod.formula}
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">{activeMethod.desc}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 block">1. 函数形式 (Functional Form)</span>
              <span className="font-mono font-bold text-emerald-300">{activeMethod.functionalForm}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 block">2. 作用位置 (Modified Representation)</span>
              <span className="font-mono font-bold text-slate-200">{activeMethod.modifiedRep}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 block">3. 连接拓扑 (Connection Topology)</span>
              <span className="font-mono font-bold text-teal-300">{activeMethod.connectionMode}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 block">4. 合成方式 (Composition Function)</span>
              <span className="font-mono font-bold text-slate-200">{activeMethod.compositionFunc}</span>
            </div>
          </div>
        </div>

        {/* Right: Performance vs. Parameter Budget Dashboard */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              BERT-Large (335M) 迁移效率实时测算
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 block">每任务新增参数量</span>
              <span className="text-lg font-mono font-extrabold text-emerald-400 block">
                {stats.totalAddedParamsM} M ({stats.pctOfBert}%)
              </span>
              <span className="text-[10px] text-slate-500">全量微调需 335.0 M (100%)</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 block">GLUE 平均得分 (全量=80.4)</span>
              <span
                className={`text-lg font-mono font-extrabold block ${
                  stats.isInitBroken ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                {stats.effectiveGlue} 分
              </span>
              <span className="text-[10px] text-slate-500">
                仅微调顶层 (3.6%) 仅 71.0 分
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 block">XSum 摘要 ROUGE-2</span>
              <span className="text-lg font-mono font-extrabold text-teal-400 block">
                {activeMethod.xsumRouge2}
              </span>
              <span className="text-[10px] text-slate-500">BART-Large 生成任务基准</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 block">在线推理开销特性</span>
              <span className="text-xs font-mono font-bold text-slate-200 block mt-1">
                {activeMethod.latencyOverhead}
              </span>
            </div>
          </div>

          <div
            className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
              stats.isInitBroken
                ? 'bg-red-950/30 border-red-500/40 text-red-300'
                : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 inline mr-1.5" />
            {stats.isInitBroken ? (
              <span>
                <strong>初始化过大警告（论文 Figure 4 消融复现）：</strong>
                当初始化标准差达到 <code>10^{initScaleLog}</code> 时，Adapter 在第 0 步偏离了恒等映射 <code>y ≈ h</code>，24 层累积噪声破坏了预训练 BERT 的原始表征，导致 GLUE 分数暴跌至 <strong>{stats.effectiveGlue}</strong>！请切回 <code>10^-2</code> 或 <code>10^-4</code>。
              </span>
            ) : (
              <span>
                <strong>最佳工程实践：</strong>
                在 <code>σ = 10^{initScaleLog}</code> 近似恒等初始化下，模块初始等价于直通残差线；配合瓶颈维 <code>m={bottleneckDimM}</code>，仅用 <strong>{stats.pctOfBert}%</strong> 的参数即可在 26 个任务上复现全量微调精度！
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
