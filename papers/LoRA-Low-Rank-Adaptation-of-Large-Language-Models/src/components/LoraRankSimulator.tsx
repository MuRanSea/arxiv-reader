import React, { useState, useMemo } from 'react';
import { Cpu, Layers, Zap, Merge, RotateCcw, Sparkles, HardDrive } from 'lucide-react';

interface ModelPreset {
  id: string;
  name: string;
  layers: number;
  dModel: number;
  totalParamsB: number;
  fullFtVramGb: number;
  baseWeightGb: number;
}

const MODEL_PRESETS: ModelPreset[] = [
  {
    id: 'gpt3-175b',
    name: 'GPT-3 175B (论文旗舰: 96层, d=12288)',
    layers: 96,
    dModel: 12288,
    totalParamsB: 175.0,
    fullFtVramGb: 1200,
    baseWeightGb: 350
  },
  {
    id: 'llama-7b',
    name: 'LLaMA / Qwen 7B (32层, d=4096)',
    layers: 32,
    dModel: 4096,
    totalParamsB: 7.0,
    fullFtVramGb: 112,
    baseWeightGb: 14
  },
  {
    id: 'roberta-large',
    name: 'RoBERTa-Large 355M (24层, d=1024)',
    layers: 24,
    dModel: 1024,
    totalParamsB: 0.355,
    fullFtVramGb: 9.5,
    baseWeightGb: 0.71
  }
];

export const LoraRankSimulator: React.FC = () => {
  const [selectedModelId, setSelectedModelId] = useState<string>('gpt3-175b');
  const [rankR, setRankR] = useState<number>(4);
  const [alpha, setAlpha] = useState<number>(32);
  const [targetModules, setTargetModules] = useState<{ [k: string]: boolean }>({
    Wq: true,
    Wk: false,
    Wv: true,
    Wo: false
  });
  const [isMerged, setIsMerged] = useState<boolean>(false);

  const model = MODEL_PRESETS.find(m => m.id === selectedModelId) || MODEL_PRESETS[0];

  const activeModuleCount = Object.values(targetModules).filter(Boolean).length || 1;

  // Calculate exact parameter counts and savings
  const stats = useMemo(() => {
    const d = model.dModel;
    // Single dense matrix d x d params
    const singleMatrixParams = d * d;
    // Single LoRA B (d x r) + A (r x d) params = 2 * d * r
    const singleLoraParams = 2 * d * rankR;
    const totalLoraParams = model.layers * activeModuleCount * singleLoraParams;
    const totalLoraParamsM = totalLoraParams / 1e6;
    const totalBaseParamsM = model.totalParamsB * 1000;
    const reductionRatio = Math.round(totalBaseParamsM / Math.max(0.001, totalLoraParamsM));
    const checkpointMb = (totalLoraParams * 2) / (1024 * 1024); // FP16 2 bytes/param
    const loraTrainVramGb = +(model.baseWeightGb + (totalLoraParams * 16) / 1e9).toFixed(1);

    // Simulated accuracy based on paper Table 5 & 6 trends
    let wikiSqlAcc = 70.5;
    if (activeModuleCount >= 2) wikiSqlAcc += 2.9;
    if (activeModuleCount === 4) wikiSqlAcc += 0.3;
    if (rankR >= 2 && rankR <= 8) wikiSqlAcc += 0.3;
    return {
      singleMatrixParams,
      singleLoraParams,
      totalLoraParamsM,
      reductionRatio,
      checkpointMb,
      loraTrainVramGb,
      wikiSqlAcc: Math.min(74.0, wikiSqlAcc).toFixed(1)
    };
  }, [model, rankR, activeModuleCount]);

  const toggleModule = (key: string) => {
    setTargetModules(prev => {
      const next = { ...prev, [key]: !prev[key] };
      if (Object.values(next).every(v => !v)) return prev; // Keep at least 1 module active
      return next;
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Control Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>LoRA 低秩矩阵分解、显存压缩与零延迟合并实验台</span>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/15 text-emerald-300 rounded border border-emerald-500/30">
                  ICLR 2022 原版公式模拟
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                动态调节低秩维度 r、挂载目标矩阵（W_q, W_k, W_v, W_o）与模型规模，实时验证参数压缩比与推理权重合并。
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsMerged(!isMerged)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 ${
              isMerged
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800 text-emerald-300 border-emerald-500/40 hover:bg-slate-700'
            }`}
          >
            <Merge className="w-4 h-4" />
            <span>{isMerged ? '已合并权重 W = W₀ + (α/r)BA (推理 0 延迟!)' : '点击模拟推理前合并权重 (W ← W₀ + BA)'}</span>
          </button>
        </div>

        {/* Model Selector & Rank / Module Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. Model Scale */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-400 block">1. 选择预训练底座模型：</span>
            <div className="space-y-1.5">
              {MODEL_PRESETS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedModelId(m.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                    selectedModelId === m.id
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Rank r & Alpha Selector */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">2. 选择低秩维度 r (Rank):</span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                r = {rankR} (缩放 α/r = {(alpha / rankR).toFixed(1)})
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[1, 2, 4, 8, 64].map(rVal => (
                <button
                  key={rVal}
                  onClick={() => setRankR(rVal)}
                  className={`py-1.5 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer border ${
                    rankR === rVal
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  r={rVal}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              💡 论文 Table 6 证明：哪怕取 <code>r=1</code> 或 <code>r=4</code>，依然能捕捉全部核心奇异向量方向！
            </p>
          </div>

          {/* 3. Target Attention Matrices */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-slate-400 block">
              3. 挂载注意力权重矩阵 (Target Modules):
            </span>
            <div className="grid grid-cols-2 gap-2">
              {(['Wq', 'Wk', 'Wv', 'Wo'] as const).map(mod => {
                const active = targetModules[mod];
                return (
                  <button
                    key={mod}
                    onClick={() => toggleModule(mod)}
                    className={`py-1.5 px-2.5 rounded-lg font-mono text-xs font-bold border transition-all cursor-pointer flex items-center justify-between ${
                      active
                        ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                        : 'bg-slate-900 text-slate-500 border-slate-800'
                    }`}
                  >
                    <span>{mod.replace('W', 'W_')}</span>
                    <span>{active ? '✓ 已注入' : '冻结'}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              💡 论文推荐默认组合：同时注入 <code>W_q + W_v</code>（或全部4个矩阵）。
            </p>
          </div>
        </div>
      </div>

      {/* Main Visualization & Quantitative Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Forward Pass & Matrix Dimension Diagram */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>
                {isMerged
                  ? '推理阶段计算图：W_merged = W₀ + (α/r)B·A（单路零额外延迟）'
                  : '训练阶段双路计算图：h = W₀x + (α/r)B·A·x（冻结 W₀，仅训练 A 和 B）'}
              </span>
            </h3>
            <span className="text-xs font-mono text-emerald-400">
              d_model = {model.dModel}
            </span>
          </div>

          {!isMerged ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              {/* Frozen Pretrained Branch */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400">
                  ❄️ 冻结主干 (Frozen Pretrained Weight)
                </span>
                <div className="py-6 rounded-lg bg-slate-900 border border-slate-700 font-mono">
                  <div className="text-base font-bold text-slate-300">W₀ ∈ ℝ^({model.dModel}×{model.dModel})</div>
                  <div className="text-xs text-slate-500 mt-1">
                    单矩阵参数: {(stats.singleMatrixParams / 1e6).toFixed(2)} M
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">不计算梯度 · 零优化器状态显存</div>
                </div>
              </div>

              {/* Trainable Low-Rank Bypass Branch */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 text-center space-y-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 font-bold">
                  🔥 可训练低秩旁路 (Trainable LoRA Bypass)
                </span>
                <div className="space-y-2 py-2 font-mono">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-emerald-500/40">
                    <div className="text-xs font-bold text-emerald-300">
                      升维矩阵 B ∈ ℝ^({model.dModel} × {rankR})
                    </div>
                    <div className="text-[10px] text-slate-400">初始化 B = 0 (保证起步 ΔW = 0)</div>
                  </div>
                  <div className="text-xs text-emerald-400 font-bold">
                    ↑ 低秩瓶颈维 r = {rankR} (压缩 {(model.dModel / (2 * rankR)).toFixed(0)} 倍!)
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-teal-500/40">
                    <div className="text-xs font-bold text-teal-300">
                      降维矩阵 A ∈ ℝ^({rankR} × {model.dModel})
                    </div>
                    <div className="text-[10px] text-slate-400">高斯随机初始化 A ~ N(0, σ²)</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-emerald-950/20 border-2 border-emerald-500/50 text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs">
                <Zap className="w-3.5 h-3.5" />
                <span>已无损合并至主权重矩阵 (Zero Inference Latency)</span>
              </div>
              <div className="text-lg font-mono font-bold text-white">
                W_merged = W₀ + ({alpha}/{rankR}) · B · A ∈ ℝ^({model.dModel}×{model.dModel})
              </div>
              <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
                上线推理时，旁路矩阵乘积 <code>B·A</code> 已经直接加进原始矩阵 <code>W₀</code> 中。前向传播只需执行一次标准矩阵乘法 <code>h = W_merged · x</code>，推理延迟与未微调的原始模型 <strong>100% 相同</strong>！若需切换至另一个下游任务，只需执行 <code>W_merged - BA_old + BA_new</code> 即可毫秒级热切换。
              </p>
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center justify-between flex-wrap gap-2 font-mono">
            <span>单层单矩阵原参数: {(stats.singleMatrixParams / 1e6).toFixed(2)}M</span>
            <span className="text-emerald-400 font-bold">
              ➔ 单矩阵 LoRA 参数 (B+A): {(stats.singleLoraParams / 1e3).toFixed(1)}K
            </span>
          </div>
        </div>

        {/* Right: Real-Time VRAM & Parameter Savings Dashboard */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              全量微调 vs. LoRA 硬件资源与精度实时对比
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 block">可训练参数量 (Trainable)</span>
              <span className="text-lg font-mono font-extrabold text-emerald-400 block">
                {stats.totalLoraParamsM.toFixed(2)} M
              </span>
              <span className="text-[10px] text-slate-500">
                全量微调需 {(model.totalParamsB * 1000).toFixed(0)} M (省 {stats.reductionRatio} 倍!)
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 block">单任务权重体积 (FP16)</span>
              <span className="text-lg font-mono font-extrabold text-teal-400 block">
                {stats.checkpointMb.toFixed(1)} MB
              </span>
              <span className="text-[10px] text-slate-500">
                全量微调需 {model.baseWeightGb} GB 硬盘
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 block">训练总显存需求 (Adam)</span>
              <span className="text-lg font-mono font-extrabold text-white block">
                ~{stats.loraTrainVramGb} GB
              </span>
              <span className="text-[10px] text-emerald-400">
                全量微调需 {model.fullFtVramGb} GB 显存
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 block">WikiSQL 评测准确率</span>
              <span className="text-lg font-mono font-extrabold text-emerald-400 block">
                {stats.wikiSqlAcc}%
              </span>
              <span className="text-[10px] text-slate-500">
                在线推理额外延迟: 0.0 ms
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 leading-relaxed">
            <Sparkles className="w-3.5 h-3.5 inline mr-1.5 text-emerald-400" />
            <strong>实验总结：</strong>
            当前配置在 {model.layers} 层 Transformer 的{' '}
            <code>
              {Object.entries(targetModules)
                .filter(([, v]) => v)
                .map(([k]) => k)
                .join(' + ')}
            </code>{' '}
            矩阵上注入了秩 <code>r={rankR}</code> 的分解矩阵，将可训练参数压缩了{' '}
            <strong>{stats.reductionRatio.toLocaleString()} 倍</strong>，生成的 LoRA 权重插件仅占{' '}
            <strong>{stats.checkpointMb.toFixed(1)} MB</strong>！
          </div>
        </div>
      </div>
    </div>
  );
};
