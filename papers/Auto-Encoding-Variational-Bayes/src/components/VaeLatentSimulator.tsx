import React, { useState, useMemo } from 'react';
import { Shuffle, Sparkles, AlertTriangle, CheckCircle2, Sliders, Compass } from 'lucide-react';

interface LatentCluster {
  id: string;
  digit: string;
  color: string;
  baseMuX: number;
  baseMuY: number;
  baseSigma: number;
  desc: string;
}

const CLUSTERS: LatentCluster[] = [
  { id: 'c0', digit: '数字 0 (圆环流形)', color: '#10b981', baseMuX: -1.4, baseMuY: 1.1, baseSigma: 0.45, desc: '闭合环形笔画，控制圆扁度与粗细' },
  { id: 'c1', digit: '数字 1 (竖直笔画)', color: '#3b82f6', baseMuX: 1.5, baseMuY: 1.2, baseSigma: 0.35, desc: '单竖线拓扑，控制左右倾角 (−15° ~ +15°)' },
  { id: 'c7', digit: '数字 7 (折角结构)', color: '#a855f7', baseMuX: 1.1, baseMuY: -1.2, baseSigma: 0.42, desc: '横折笔画，可向数字 1 或 9 平滑过渡' },
  { id: 'c8', digit: '数字 8 (双环结构)', color: '#f59e0b', baseMuX: -1.2, baseMuY: -1.1, baseSigma: 0.48, desc: '上下双环，位于 0 与 3 的流形交界区' },
];

export const VaeLatentSimulator: React.FC = () => {
  const [useReparam, setUseReparam] = useState<boolean>(true);
  const [betaKl, setBetaKl] = useState<number>(1.0);
  const [probeZ1, setProbeZ1] = useState<number>(0.2);
  const [probeZ2, setProbeZ2] = useState<number>(0.3);
  const [epsSample, setEpsSample] = useState<{ e1: number; e2: number }>({ e1: 0.42, e2: -0.31 });

  const resampleEpsilon = () => {
    // Box-Muller transform for standard normal sample
    const u1 = Math.max(0.001, Math.random());
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
    setEpsSample({
      e1: Number(Math.max(-2.2, Math.min(2.2, z0)).toFixed(2)),
      e2: Number(Math.max(-2.2, Math.min(2.2, z1)).toFixed(2)),
    });
  };

  // Compute ELBO metrics as a function of beta
  const metrics = useMemo(() => {
    // When beta=0 (Deterministic AE): sharp reconstruction, huge KL, holes in latent space
    // When beta=1 (Standard VAE): balanced reconstruction & smooth manifold
    // When beta=4 (High beta / Posterior Collapse): blurry reconstruction, KL -> 0
    const reconNats = -78 - Math.pow(betaKl, 1.45) * 14.5;
    const klNats = Math.max(0.4, 34.0 / (1 + betaKl * 1.15));
    const elbo = reconNats - klNats;
    const manifoldSmoothness = betaKl < 0.15 ? 22 : betaKl <= 1.8 ? 94 : 76;
    return {
      reconNats: reconNats.toFixed(1),
      klNats: klNats.toFixed(1),
      elbo: elbo.toFixed(1),
      manifoldSmoothness,
      regime:
        betaKl < 0.15
          ? '退化为传统 AE（无 KL 约束，流形存在大量破洞，随机采样失效）'
          : betaKl <= 1.6
          ? '黄金 ELBO 平衡（高斯云紧致衔接，支持连续流形插值）'
          : '过强先验约束（趋向后验坍缩 Posterior Collapse，重构变模糊）',
    };
  }, [betaKl]);

  // Compute active cluster weights at probe (z1, z2)
  const decodedBlend = useMemo(() => {
    const shrink = 1 / (1 + 0.35 * betaKl);
    const items = CLUSTERS.map((c) => {
      const mx = c.baseMuX * shrink;
      const my = c.baseMuY * shrink;
      const distSq = Math.pow(probeZ1 - mx, 2) + Math.pow(probeZ2 - my, 2);
      const sigma = Math.max(0.08, c.baseSigma * Math.min(1.6, 0.25 + 0.75 * Math.sqrt(betaKl + 0.05)));
      const density = Math.exp(-distSq / (2 * sigma * sigma));
      return { ...c, mx, my, sigma, density };
    });
    const totalDensity = items.reduce((acc, it) => acc + it.density, 0) + 1e-6;
    return items.map((it) => ({
      ...it,
      weight: Math.round((it.density / totalDensity) * 100),
    }));
  }, [probeZ1, probeZ2, betaKl]);

  const sampleMu = { x: 0.65, y: -0.45 };
  const sampleSigma = { x: Number((0.35 * Math.sqrt(Math.max(0.05, betaKl))).toFixed(2)), y: Number((0.40 * Math.sqrt(Math.max(0.05, betaKl))).toFixed(2)) };
  const computedZ = {
    x: Number((sampleMu.x + sampleSigma.x * epsSample.e1).toFixed(2)),
    y: Number((sampleMu.y + sampleSigma.y * epsSample.e2).toFixed(2)),
  };

  return (
    <div className="space-y-6">
      {/* Top Panel: Reparameterization Trick Interactive Inspector */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Shuffle className="w-4 h-4 text-emerald-400" />
              实验一：重参数化技巧（Reparameterization Trick）与反向传播梯度流
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              切换采样方式，观察为什么把随机性抽离为外部标准正态噪声 <span className="font-mono text-emerald-400">ε ~ N(0, I)</span> 是打通神经网络变分推断的关键
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setUseReparam(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                !useReparam
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              直接随机采样 z ~ N(μ, σ²)
            </button>
            <button
              type="button"
              onClick={() => setUseReparam(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                useReparam
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              重参数化 z = μ + σ ⊙ ε
            </button>
            <button
              type="button"
              onClick={resampleEpsilon}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600/20 border border-blue-500/40 text-blue-300 hover:bg-blue-600/30 transition-all"
            >
              重采样噪声 ε
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3.5">
            <div className="text-xs text-slate-400 mb-1">1. 编码器输出参数 (可微节点)</div>
            <div className="font-mono text-xs text-emerald-400">
              μ_φ(x) = [{sampleMu.x}, {sampleMu.y}]
            </div>
            <div className="font-mono text-xs text-blue-400 mt-1">
              σ_φ(x) = [{sampleSigma.x}, {sampleSigma.y}]
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3.5">
            <div className="text-xs text-slate-400 mb-1">2. 外部独立高斯噪声 (无参数)</div>
            <div className="font-mono text-xs text-amber-400">
              ε ~ N(0, I) = [{epsSample.e1}, {epsSample.e2}]
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {useReparam ? '作为常数输入注入确定性加法/乘法节点' : '隐藏在黑盒随机采样算子内部'}
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3.5">
            <div className="text-xs text-slate-400 mb-1">3. 采样潜变量 z 传入解码器</div>
            <div className="font-mono text-xs text-purple-400 font-bold">
              z = [{computedZ.x}, {computedZ.y}]
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {useReparam ? 'z = μ + σ ⊙ ε (确定性可导函数)' : 'z ~ q_φ(z|x) (随机采样阻断导数)'}
            </div>
          </div>

          <div
            className={`rounded-lg p-3.5 border ${
              useReparam ? 'bg-emerald-950/30 border-emerald-500/40' : 'bg-rose-950/30 border-rose-500/40'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
              {useReparam ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">梯度反向传播畅通</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span className="text-rose-300">随机节点阻断梯度链</span>
                </>
              )}
            </div>
            <div className="font-mono text-[11px] text-slate-300">
              {useReparam
                ? `∂z/∂μ = 1.0, ∂z/∂σ = ε = [${epsSample.e1}, ${epsSample.e2}]`
                : '∂z/∂φ 不存在！只能退回高方差 REINFORCE 估计'}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Panel: ELBO Beta Trade-off & 2D Latent Manifold Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Controls & ELBO Breakdown */}
        <div className="lg:col-span-5 bg-slate-950/70 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-blue-400" />
                KL 散度正则权重 β (调节潜空间紧致度)
              </span>
              <span className="font-mono text-sm font-bold text-emerald-400">β = {betaKl.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={3}
              step={0.05}
              value={betaKl}
              onChange={(e) => setBetaKl(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>β=0 (传统确定性 AE)</span>
              <span>β=1.0 (标准 VAE)</span>
              <span>β=3.0 (强先验解耦)</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
              <div className="text-[11px] text-slate-400">重构对数似然</div>
              <div className="text-base font-mono font-bold text-blue-400 mt-0.5">{metrics.reconNats}</div>
              <div className="text-[10px] text-slate-500">E_q[log p(x|z)]</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
              <div className="text-[11px] text-slate-400">解析 KL 散度</div>
              <div className="text-base font-mono font-bold text-amber-400 mt-0.5">{metrics.klNats}</div>
              <div className="text-[10px] text-slate-500">D_KL(q(z|x)||N(0,I))</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
              <div className="text-[11px] text-slate-400">流形连续平滑度</div>
              <div className="text-base font-mono font-bold text-emerald-400 mt-0.5">{metrics.manifoldSmoothness}%</div>
              <div className="text-[10px] text-slate-500">插值无空洞指数</div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3.5">
            <div className="text-xs font-bold text-slate-200 mb-1">当前状态诊断：</div>
            <p className="text-xs text-slate-300 leading-relaxed">{metrics.regime}</p>
          </div>

          {/* Probe Sliders */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-purple-400" />
              2D 潜空间解码探针坐标 z = (z₁, z₂)
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>水平潜维度 z₁</span>
                  <span className="font-mono text-purple-400">{probeZ1.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min={-2.2}
                  max={2.2}
                  step={0.1}
                  value={probeZ1}
                  onChange={(e) => setProbeZ1(parseFloat(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>垂直潜维度 z₂</span>
                  <span className="font-mono text-purple-400">{probeZ2.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min={-2.2}
                  max={2.2}
                  step={0.1}
                  value={probeZ2}
                  onChange={(e) => setProbeZ2(parseFloat(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right 2D Gaussian Manifold Map & Decoded Interpolation */}
        <div className="lg:col-span-7 bg-slate-950/70 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              实验二：二维隐空间高斯云流形与解码器连续插值 (p_θ(x|z))
            </h4>
            <span className="text-xs font-mono text-slate-400">先验等高线 N(0, I)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* SVG 2D Latent Manifold */}
            <div className="md:col-span-7 flex justify-center">
              <svg
                viewBox="-2.6 -2.6 5.2 5.2"
                className="w-full max-w-[270px] aspect-square bg-slate-900/90 border border-slate-800 rounded-xl"
              >
                {/* Prior N(0, I) concentric circles */}
                <circle cx="0" cy="0" r="2.0" fill="none" stroke="var(--app-grid-line)" strokeWidth="0.03" strokeDasharray="0.1 0.1" />
                <circle cx="0" cy="0" r="1.0" fill="none" stroke="var(--app-border-strong)" strokeWidth="0.03" strokeDasharray="0.08 0.08" />
                <line x1="-2.5" y1="0" x2="2.5" y2="0" stroke="var(--app-grid-line)" strokeWidth="0.025" />
                <line x1="0" y1="-2.5" x2="0" y2="2.5" stroke="var(--app-grid-line)" strokeWidth="0.025" />

                {/* Gaussian Clouds q_phi(z|x) */}
                {decodedBlend.map((c) => (
                  <g key={c.id}>
                    <circle
                      cx={c.mx}
                      cy={-c.my}
                      r={c.sigma * 1.9}
                      fill={c.color}
                      fillOpacity={0.22}
                      stroke={c.color}
                      strokeWidth="0.04"
                    />
                    <circle cx={c.mx} cy={-c.my} r={0.09} fill={c.color} />
                  </g>
                ))}

                {/* Interactive Probe Point z */}
                <line x1="0" y1="0" x2={probeZ1} y2={-probeZ2} stroke="#c084fc" strokeWidth="0.035" strokeDasharray="0.08 0.06" />
                <circle cx={probeZ1} cy={-probeZ2} r="0.14" fill="#c084fc" stroke="#ffffff" strokeWidth="0.05" />
              </svg>
            </div>

            {/* Decoded Manifold Semantic Composition */}
            <div className="md:col-span-5 space-y-2.5">
              <div className="text-xs font-bold text-slate-300 mb-1">
                当前探针位置 <span className="font-mono text-purple-400">({probeZ1.toFixed(1)}, {probeZ2.toFixed(1)})</span> 解码形态权重：
              </div>
              {decodedBlend.map((c) => (
                <div key={c.id} className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-200">{c.digit}</span>
                    <span className="font-mono font-bold text-emerald-400">{c.weight}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-200"
                      style={{ width: `${c.weight}%`, backgroundColor: c.color }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
