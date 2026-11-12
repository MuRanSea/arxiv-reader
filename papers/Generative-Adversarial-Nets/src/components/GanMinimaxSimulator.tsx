import React, { useState, useMemo } from 'react';
import { Swords, TrendingUp, CheckCircle2, Sparkles } from 'lucide-react';

interface StageConfig {
  id: string;
  label: string;
  title: string;
  muG: number;
  sigmaG: number;
  dSmooth: boolean;
  jsd: string;
  vVal: string;
  description: string;
}

const STAGES: StageConfig[] = [
  {
    id: 'a',
    label: '阶段 (a): 初始对决',
    title: 'Figure 1(a) — 初始状态：p_g 与 p_data 偏离，判别器 D 波动剧烈',
    muG: 1.15,
    sigmaG: 0.72,
    dSmooth: false,
    jsd: '0.412 nats',
    vVal: '-0.562 nats',
    description:
      '训练刚开始时，生成器分布 p_g（绿线）与真实数据分布 p_data（黑虚线）相距较远，判别器 D（蓝虚线）是个粗略且带有局部抖动的分类器。',
  },
  {
    id: 'b',
    label: '阶段 (b): D 步优化收敛',
    title: 'Figure 1(b) — 固定 G 更新 k 步 D：判别器收敛至解析最优 D*_G(x)',
    muG: 1.15,
    sigmaG: 0.72,
    dSmooth: true,
    jsd: '0.412 nats',
    vVal: '-0.562 nats',
    description:
      '经过内循环更新，判别器收敛到平滑的理论最优曲线 D*(x) = p_data(x) / (p_data(x) + p_g(x))。注意蓝线在左侧真数据区接近 1，右侧假数据区接近 0，斜率指向左方！',
  },
  {
    id: 'c',
    label: '阶段 (c): G 沿梯度迁移',
    title: 'Figure 1(c) — 更新 1 步 G：判别器梯度牵引生成分布 p_g 向真实分布靠拢',
    muG: -0.15,
    sigmaG: 0.62,
    dSmooth: true,
    jsd: '0.095 nats',
    vVal: '-1.196 nats',
    description:
      '判别器 D 的斜率导数通过反向传播传递给 G(z)，引导生成器将 z 映射到使 D(G(z)) 更高的左侧区域，p_g（绿线）显著向 p_data（黑虚线）逼近。',
  },
  {
    id: 'd',
    label: '阶段 (d): 纳什均衡',
    title: 'Figure 1(d) — 全局最优纳什均衡：p_g = p_data 且最优判别器恒为 D*(x) = 1/2',
    muG: -0.8,
    sigmaG: 0.55,
    dSmooth: true,
    jsd: '0.000 nats',
    vVal: '-1.386 (-log 4)',
    description:
      '多轮交替迭代后，生成分布完美重合于真实分布（p_g = p_data）。此时无论输入什么样本，判别器都完全无法区分真假，处处输出 D*(x) = 0.5！',
  },
];

export const GanMinimaxSimulator: React.FC = () => {
  const [stageIdx, setStageIdx] = useState<number>(1);
  const [probeD, setProbeD] = useState<number>(0.08);

  const currentStage = STAGES[stageIdx];

  // Generate SVG path data for p_data, p_g, and D(x) across x in [-3, 3]
  const chartPaths = useMemo(() => {
    const muData = -0.8;
    const sigmaData = 0.55;
    const { muG, sigmaG, dSmooth } = currentStage;

    const gaussian = (x: number, mu: number, s: number) =>
      (1 / (Math.sqrt(2 * Math.PI) * s)) * Math.exp(-Math.pow(x - mu, 2) / (2 * s * s));

    const ptsData: string[] = [];
    const ptsG: string[] = [];
    const ptsD: string[] = [];

    for (let i = 0; i <= 120; i++) {
      const x = -3.0 + (i / 120) * 6.0;
      const svgX = ((x + 3.0) / 6.0) * 520 + 40;

      const pData = gaussian(x, muData, sigmaData);
      const pG = gaussian(x, muG, sigmaG);

      // Optimal D*(x) = p_data / (p_data + p_g)
      let dVal = pData / (pData + pG + 1e-8);
      if (!dSmooth) {
        // Add illustrative early-training jitter as in Figure 1(a)
        dVal = Math.max(0.03, Math.min(0.97, dVal + 0.08 * Math.sin(x * 5.2)));
      }

      // Map density [0, 0.85] -> SVG Y [190, 25]
      const yData = 190 - (pData / 0.85) * 160;
      const yG = 190 - (pG / 0.85) * 160;
      // Map probability [0, 1] -> SVG Y [190, 25]
      const yD = 190 - dVal * 160;

      ptsData.push(`${i === 0 ? 'M' : 'L'} ${svgX.toFixed(1)} ${yData.toFixed(1)}`);
      ptsG.push(`${i === 0 ? 'M' : 'L'} ${svgX.toFixed(1)} ${yG.toFixed(1)}`);
      ptsD.push(`${i === 0 ? 'M' : 'L'} ${svgX.toFixed(1)} ${yD.toFixed(1)}`);
    }

    return {
      pathData: ptsData.join(' '),
      pathG: ptsG.join(' '),
      pathD: ptsD.join(' '),
    };
  }, [currentStage]);

  // Gradient comparison at D(G(z)) = probeD
  const gradStats = useMemo(() => {
    // Minimax saturating loss: L = log(1 - D), |dL/dD| = 1 / (1 - D)
    const satGrad = 1 / Math.max(0.01, 1 - probeD);
    // Non-saturating heuristic: L = -log(D), |dL/dD| = 1 / D
    const nonSatGrad = 1 / Math.max(0.01, probeD);
    const ratio = nonSatGrad / satGrad;
    return {
      satGrad: satGrad.toFixed(2),
      nonSatGrad: nonSatGrad.toFixed(2),
      ratio: ratio.toFixed(1),
    };
  }, [probeD]);

  return (
    <div className="space-y-6">
      {/* Experiment 1: Figure 1 Minimax Game Evolution */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Swords className="w-4 h-4 text-emerald-400" />
              实验一：极小极大博弈四阶段动态演化（复现原论文经典 Figure 1）
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              切换博弈演化阶段，观察判别器曲线 <span className="text-blue-400 font-mono">D(x)</span> 如何牵引生成分布 <span className="text-emerald-400 font-mono">p_g(x)</span> 一步步重合并收敛至 <span className="text-amber-400 font-mono">D*(x) = 1/2</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {STAGES.map((st, idx) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setStageIdx(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  stageIdx === idx
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* SVG Distribution & Discriminator Plot */}
          <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-2">
              <span className="font-bold text-slate-200">{currentStage.title}</span>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-3 h-0.5 bg-slate-200 inline-block" /> 真实分布 p_data(x)
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-3 h-0.5 bg-emerald-400 inline-block" /> 生成分布 p_g(x)
                </span>
                <span className="flex items-center gap-1.5 text-blue-400">
                  <span className="w-3 h-0.5 bg-blue-400 inline-block" /> 判别器 D(x)
                </span>
              </div>
            </div>

            <svg viewBox="0 0 600 220" className="w-full h-auto">
              {/* Horizontal reference lines */}
              <line x1="40" y1="190" x2="560" y2="190" stroke="var(--app-grid-line)" strokeWidth="1.5" />
              {/* D(x) = 0.5 Equilibrium Line */}
              <line x1="40" y1="110" x2="560" y2="110" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 4" opacity="0.75" />
              <text x="565" y="113" fill="var(--color-amber-400)" fontSize="10" fontFamily="monospace">
                D=0.5
              </text>
              <text x="565" y="32" fill="var(--app-text-muted)" fontSize="10" fontFamily="monospace">
                D=1.0
              </text>
              <text x="565" y="192" fill="var(--app-text-muted)" fontSize="10" fontFamily="monospace">
                D=0.0
              </text>

              {/* True distribution p_data(x) (Semantic Curve Primary) */}
              <path d={chartPaths.pathData} fill="none" stroke="var(--app-curve-primary)" strokeWidth="2.5" strokeDasharray="5 4" />

              {/* Generator distribution p_g(x) (Solid Emerald) */}
              <path d={chartPaths.pathG} fill="none" stroke="#10b981" strokeWidth="2.8" />

              {/* Discriminator D(x) (Dashed Blue) */}
              <path d={chartPaths.pathD} fill="none" stroke="#2563eb" strokeWidth="2.4" strokeDasharray="3 3" />
            </svg>
          </div>

          {/* Stage Telemetry & Mathematical Insight */}
          <div className="lg:col-span-4 space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                <div className="text-[11px] text-slate-400">JS 散度 JSD(p_data || p_g)</div>
                <div className="text-sm font-mono font-bold text-emerald-400 mt-1">{currentStage.jsd}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                <div className="text-[11px] text-slate-400">博弈价值 V(D*, G)</div>
                <div className="text-sm font-mono font-bold text-blue-400 mt-1">{currentStage.vVal}</div>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3.5">
              <div className="text-xs font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                阶段博弈机理剖析：
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{currentStage.description}</p>
            </div>

            {stageIdx === 3 && (
              <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-lg p-3 flex items-center gap-2 text-xs text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>已达成全局纳什均衡：p_g(x) = p_data(x)，判别器恒等于 0.5！</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Experiment 2: Saturating vs Non-Saturating Generator Loss */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              实验二：为什么早期训练必须用「非饱和损失 max log D(G(z))」替代「原始损失 min log(1 - D(G(z)))」？
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              拖动滑块改变当前假样本被判别器认作真样本的概率 <span className="font-mono text-purple-400">D(G(z))</span>，对比两种损失函数回传给生成器的梯度幅值
            </p>
          </div>
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2">
            <span className="text-xs text-slate-300">假样本得分 D(G(z)):</span>
            <input
              type="range"
              min={0.02}
              max={0.95}
              step={0.01}
              value={probeD}
              onChange={(e) => setProbeD(parseFloat(e.target.value))}
              className="w-36 accent-purple-500 cursor-pointer"
            />
            <span className="font-mono text-sm font-bold text-purple-400 w-12">{probeD.toFixed(2)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4">
            <div className="text-xs text-slate-400 mb-1">原始极小极大目标 min log(1 - D(G(z)))</div>
            <div className="text-lg font-mono font-bold text-rose-400">
              |∂L / ∂D| = {gradStats.satGrad}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              当训练初期假样本很容易被识破（D(G(z)) ≈ 0）时，梯度仅接近 1.0，生成器几乎学不到有效修正方向（梯度饱和）。
            </p>
          </div>

          <div className="bg-slate-900/90 border border-emerald-500/30 rounded-lg p-4">
            <div className="text-xs text-slate-400 mb-1">非饱和启发式目标 max log D(G(z))</div>
            <div className="text-lg font-mono font-bold text-emerald-400">
              |∂L / ∂D| = {gradStats.nonSatGrad}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              当 D(G(z)) 越接近 0 时，导数 1/D(G(z)) 反而急剧放大，在生成器最弱的初期提供最强劲的追赶梯度！
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 flex flex-col justify-center">
            <div className="text-xs text-slate-400 mb-1">当前非饱和梯度增益倍数</div>
            <div className="text-2xl font-mono font-extrabold text-amber-400">
              {gradStats.ratio}x 倍驱动力
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {probeD < 0.25
                ? '处于训练早期（D 压制 G）：非饱和目标提供十倍以上的强梯度拯救生成器！'
                : '处于中后期（G 已具备竞争力）：两者共享同一个不动点 D*(x) = 0.5。'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
