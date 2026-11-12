import React, { useState, useMemo } from 'react';
import { Minimize2, Sparkles, Sliders, Eye, Cpu } from 'lucide-react';

interface FactorOption {
  f: number;
  label: string;
  latentShape: string;
  dimCount: number;
  speedup: string;
  vramGb: string;
  fidScore: string;
  verdict: string;
}

const FACTOR_OPTIONS: FactorOption[] = [
  {
    f: 1,
    label: 'LDM-1 (f=1 像素空间)',
    latentShape: '512 × 512 × 3',
    dimCount: 786432,
    speedup: '1.0x (基准)',
    vramGb: '42.0 GB (OOM)',
    fidScore: '38.4 (收敛极慢)',
    verdict: '退化为传统像素级 DDPM，90% 算力耗费在人眼不可见的像素高频噪声上，消费级显卡直接显存溢出。',
  },
  {
    f: 4,
    label: 'LDM-4 (f=4 高保真甜点)',
    latentShape: '128 × 128 × 3',
    dimCount: 49152,
    speedup: '8.5x 提速',
    vramGb: '11.4 GB',
    fidScore: '10.3 (极佳)',
    verdict: '空间面积缩小 16 倍，自编码器重构几乎零损失，适合追求极致纹理细节的学术基准。',
  },
  {
    f: 8,
    label: 'LDM-8 (f=8 SD 黄金标准)',
    latentShape: '64 × 64 × 4',
    dimCount: 16384,
    speedup: '14.2x 提速',
    vramGb: '6.2 GB',
    fidScore: '11.1 (黄金平衡)',
    verdict: 'Stable Diffusion v1.5 / v2 / SDXL 官方采用配置！张量体积压缩 48 倍，6GB 显存即可流畅生成 512×512 高清图。',
  },
  {
    f: 32,
    label: 'LDM-32 (f=32 过度压缩)',
    latentShape: '16 × 16 × 16',
    dimCount: 4096,
    speedup: '21.0x 提速',
    vramGb: '3.1 GB',
    fidScore: '24.8 (细节崩坏)',
    verdict: '第一阶段感知压缩过猛，大量空间结构信息在进入扩散模型前已丢失，解码后画面出现模糊伪影。',
  },
];

interface PromptToken {
  id: string;
  word: string;
  role: string;
  heatmap: number[][]; // 4x4 spatial attention grid
}

const PROMPT_TOKENS: PromptToken[] = [
  {
    id: 'astronaut',
    word: '"astronaut" (宇航员)',
    role: '前景核心主体定位',
    heatmap: [
      [0.12, 0.45, 0.42, 0.10],
      [0.18, 0.95, 0.92, 0.15],
      [0.15, 0.88, 0.85, 0.14],
      [0.08, 0.32, 0.30, 0.08],
    ],
  },
  {
    id: 'horse',
    word: '"riding a horse" (骑着白马)',
    role: '中下层姿态与生物结构',
    heatmap: [
      [0.05, 0.10, 0.08, 0.05],
      [0.12, 0.42, 0.48, 0.18],
      [0.35, 0.96, 0.94, 0.45],
      [0.28, 0.85, 0.88, 0.32],
    ],
  },
  {
    id: 'mars',
    word: '"on Mars" (火星红土背景)',
    role: '底部地表与远景地貌环境',
    heatmap: [
      [0.25, 0.15, 0.18, 0.28],
      [0.35, 0.12, 0.15, 0.40],
      [0.68, 0.35, 0.38, 0.72],
      [0.95, 0.92, 0.94, 0.96],
    ],
  },
  {
    id: 'galaxy',
    word: '"starry nebula" (璀璨星云)',
    role: '顶部天空氛围与全局光影',
    heatmap: [
      [0.96, 0.92, 0.94, 0.98],
      [0.82, 0.30, 0.32, 0.85],
      [0.20, 0.08, 0.10, 0.22],
      [0.05, 0.04, 0.04, 0.06],
    ],
  },
];

export const LatentDiffusionSimulator: React.FC = () => {
  const [selectedF, setSelectedF] = useState<number>(8);
  const [denoiseProgress, setDenoiseProgress] = useState<number>(85); // 0 = pure noise z_T, 100 = clean z_0
  const [selectedTokenId, setSelectedTokenId] = useState<string>('astronaut');

  const activeFactor = useMemo(
    () => FACTOR_OPTIONS.find((o) => o.f === selectedF) || FACTOR_OPTIONS[2],
    [selectedF]
  );

  const activeToken = useMemo(
    () => PROMPT_TOKENS.find((t) => t.id === selectedTokenId) || PROMPT_TOKENS[0],
    [selectedTokenId]
  );

  const currentTimestepT = Math.round(1000 * (1 - denoiseProgress / 100));
  const snrDb = ((denoiseProgress - 50) * 0.45).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Experiment 1: Downsampling Factor f Trade-off Explorer */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Minimize2 className="w-4 h-4 text-emerald-400" />
              实验一：感知压缩下采样因子 f = H/h 权衡模拟器（512×512 高清图生成）
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              切换空间下采样倍率 <span className="font-mono text-emerald-400">f ∈ &#123;1, 4, 8, 32&#125;</span>，观察潜空间张量维度、显存消耗与生成质量（FID）的黄金甜点
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {FACTOR_OPTIONS.map((opt) => (
              <button
                key={opt.f}
                type="button"
                onClick={() => setSelectedF(opt.f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  selectedF === opt.f
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3.5">
            <div className="text-xs text-slate-400">潜张量尺寸 z = E(x)</div>
            <div className="text-base font-mono font-bold text-emerald-400 mt-1">{activeFactor.latentShape}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              共 {activeFactor.dimCount.toLocaleString()} 维
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3.5">
            <div className="text-xs text-slate-400">训练/采样加速比</div>
            <div className="text-base font-mono font-bold text-blue-400 mt-1">{activeFactor.speedup}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">单步 UNet 前向吞吐提升</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3.5">
            <div className="text-xs text-slate-400">训练显存占用估算</div>
            <div className="text-base font-mono font-bold text-purple-400 mt-1">{activeFactor.vramGb}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">512×512 分辨率单卡开销</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3.5">
            <div className="text-xs text-slate-400">2M 步收敛 FID (↓越低越好)</div>
            <div className="text-base font-mono font-bold text-amber-400 mt-1">{activeFactor.fidScore}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">ImageNet 基准实测对比</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3.5 text-xs text-slate-300 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong className="text-white">架构诊断：</strong>
            {activeFactor.verdict}
          </span>
        </div>
      </div>

      {/* Experiment 2: Latent Reverse Denoising & Cross-Attention Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Reverse Denoising Progression z_T -> z_0 */}
        <div className="lg:col-span-6 bg-slate-950/70 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-400" />
                实验二：潜空间逆向去噪演化 (z_T → z_t → z_0)
              </h4>
              <span className="font-mono text-xs text-blue-400 font-bold">
                t = {currentTimestepT} / 1000 (去噪进度 {denoiseProgress}%)
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={denoiseProgress}
              onChange={(e) => setDenoiseProgress(parseInt(e.target.value, 10))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>t=1000 (纯高斯噪声 z_T)</span>
              <span>t=500 (语义轮廓浮现)</span>
              <span>t=0 (干净潜表征 z_0)</span>
            </div>
          </div>

          {/* 4x4 Latent Feature Grid Visualization */}
          <div className="grid grid-cols-4 gap-2 bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
            {activeToken.heatmap.flatMap((row, rIdx) =>
              row.map((val, cIdx) => {
                const signalRatio = denoiseProgress / 100;
                // Deterministic pseudo-noise based on cell index
                const pseudoNoise = ((rIdx * 7 + cIdx * 13) % 10) / 10;
                const blendedIntensity = signalRatio * val + (1 - signalRatio) * pseudoNoise;
                const isStrong = blendedIntensity >= 0.55;
                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={`h-11 rounded-lg border flex flex-col items-center justify-center font-mono text-[10px] transition-all ${
                      isStrong
                        ? 'bg-emerald-500/25 border-emerald-500/60 text-emerald-200'
                        : 'bg-emerald-950/40 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="font-bold text-white">z[{rIdx},{cIdx}]</span>
                    <span className="text-emerald-300 font-semibold">{blendedIntensity.toFixed(2)}</span>
                  </div>
                );
              })
            )}
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 flex items-center justify-between">
            <span>
              当前潜空间信噪比 (SNR): <strong className="font-mono text-emerald-400">{snrDb} dB</strong>
            </span>
            <span className="text-slate-400">
              {denoiseProgress < 35
                ? '早期阶段：决定全局低频构图与色块布局'
                : denoiseProgress < 80
                ? '中期阶段：Cross-Attention 塑造主体与语义结构'
                : '后期阶段：收敛至清晰潜变量 z_0，送入解码器 D(z_0) 出图'}
            </span>
          </div>
        </div>

        {/* Cross-Attention Conditioning Inspector */}
        <div className="lg:col-span-6 bg-slate-950/70 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              实验三：UNet 交叉注意力（Cross-Attention）文生图空间对齐
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              点击下方提示词 Token <span className="font-mono text-purple-400">τ_θ(y)</span>，观察注意力矩阵 <span className="font-mono text-emerald-400">softmax(QK^T/√d)</span> 激活的 64×64 潜空间区域
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {PROMPT_TOKENS.map((tok) => (
              <button
                key={tok.id}
                type="button"
                onClick={() => setSelectedTokenId(tok.id)}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  selectedTokenId === tok.id
                    ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-mono font-bold">{tok.word}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{tok.role}</div>
              </button>
            ))}
          </div>

          {/* Spatial Attention Heatmap Preview */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-purple-400" />
                词元 {activeToken.word} 对二维潜空间的 Cross-Attention 权重分布：
              </span>
              <span className="font-mono text-[11px] text-purple-400">Q=φ_i(z_t), K=τ_θ(y)</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {activeToken.heatmap.flatMap((row, rIdx) =>
                row.map((weight, cIdx) => {
                  const isHigh = weight >= 0.6;
                  const isMed = weight >= 0.25 && weight < 0.6;
                  return (
                    <div
                      key={`attn-${rIdx}-${cIdx}`}
                      className={`h-9 rounded border flex items-center justify-center font-mono text-xs font-bold transition-all ${
                        isHigh
                          ? 'bg-purple-500/30 border-purple-500 text-purple-200 ring-1 ring-purple-500/30'
                          : isMed
                          ? 'bg-purple-500/15 border-purple-500/40 text-purple-300'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span>{Math.round(weight * 100)}%</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
