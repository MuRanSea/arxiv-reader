import React, { useState, useMemo } from 'react';
import { Grid, Cpu, Sparkles, Sliders, Eye, TrendingUp } from 'lucide-react';

type DatasetScale = 'imagenet-1k' | 'imagenet-21k' | 'jft-300m';

interface ScaleComparison {
  id: DatasetScale;
  nameZh: string;
  imagesCount: string;
  vitBaseAcc: number;
  vitLargeAcc: number;
  vitHugeAcc: number;
  resnetBitAcc: number;
  insight: string;
}

const SCALE_DATA: ScaleComparison[] = [
  {
    id: 'imagenet-1k',
    nameZh: '1. ImageNet-1k (130万张图 · 中小规模)',
    imagesCount: '1.3 Million',
    vitBaseAcc: 79.9,
    vitLargeAcc: 76.5,
    vitHugeAcc: 75.2,
    resnetBitAcc: 82.5,
    insight:
      '在小规模数据上，缺乏“局部性+平移等变性”归纳偏置的 ViT 容易过拟合（甚至 ViT-Large 比 ViT-Base 还要差），此时内置卷积先验的 ResNet (82.5%) 明显占优！'
  },
  {
    id: 'imagenet-21k',
    nameZh: '2. ImageNet-21k (1400万张图 · 规模交叉点)',
    imagesCount: '14 Million',
    vitBaseAcc: 84.0,
    vitLargeAcc: 85.3,
    vitHugeAcc: 85.8,
    resnetBitAcc: 85.1,
    insight:
      '当预训练图像扩大 10 倍达到 1400 万张时，ViT 从数据中自主学会了二维空间拓扑，成功追平并反超了同规模的 BiT ResNet (85.3% vs 85.1%)！'
  },
  {
    id: 'jft-300m',
    nameZh: '3. 🌟 JFT-300M (3亿张图 · 大规模统治区)',
    imagesCount: '300 Million',
    vitBaseAcc: 84.2,
    vitLargeAcc: 87.76,
    vitHugeAcc: 88.55,
    resnetBitAcc: 87.54,
    insight:
      '在 3 亿张图像上，CNN 的局部窗口先验反而限制了全局建模上限；无先验束缚的 ViT-L/16 与 ViT-H/14 彻底释放潜能，以 88.55% 和仅 1/4 算力全面统治视觉榜单！'
  }
];

export const VitPatchSimulator: React.FC = () => {
  const [imageRes, setImageRes] = useState<number>(224); // 224 vs 384
  const [patchSizeP, setPatchSizeP] = useState<number>(16); // 16 vs 32
  const [selectedScale, setSelectedScale] = useState<DatasetScale>('jft-300m');
  const [selectedPatchCoord, setSelectedPatchCoord] = useState<[number, number]>([2, 3]); // 6x6 interactive mini grid

  const stats = useMemo(() => {
    const gridSide = Math.floor(imageRes / patchSizeP);
    const numPatches = gridSide * gridSide;
    const seqLenWithCls = numPatches + 1;
    const rawPatchDim = patchSizeP * patchSizeP * 3;
    const pixelCount = imageRes * imageRes;
    const pixelAttentionPairs = pixelCount * pixelCount;
    const patchAttentionPairs = seqLenWithCls * seqLenWithCls;
    const computeReduction = Math.round(pixelAttentionPairs / patchAttentionPairs);

    return {
      gridSide,
      numPatches,
      seqLenWithCls,
      rawPatchDim,
      pixelCount,
      patchAttentionPairs,
      computeReduction
    };
  }, [imageRes, patchSizeP]);

  const activeScaleData = SCALE_DATA.find(s => s.id === selectedScale) || SCALE_DATA[2];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Control Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <Grid className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>ViT 图像切块序列化与位置编码拓扑实验台</span>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/15 text-emerald-300 rounded border border-emerald-500/30">
                  ICLR 2021 视觉机制可视化
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                动态调节图像分辨率（H×W）、切块尺寸（P×P）与预训练数据集规模，探索 2D 位置编码余弦相似度与归纳偏置逆转定律。
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl p-1">
              <span className="text-slate-400 px-2">图像分辨率:</span>
              {[224, 384].map(res => (
                <button
                  key={res}
                  onClick={() => setImageRes(res)}
                  className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all cursor-pointer ${
                    imageRes === res
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {res}×{res}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl p-1">
              <span className="text-slate-400 px-2">块尺寸 P:</span>
              {[16, 32].map(p => (
                <button
                  key={p}
                  onClick={() => setPatchSizeP(p)}
                  className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all cursor-pointer ${
                    patchSizeP === p
                      ? 'bg-teal-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {p}×{p} (/{p})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tokenization Quantitative Pipeline */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block">1. 图像块网格 (H/P × W/P)</span>
            <span className="text-lg font-mono font-extrabold text-white block">
              {stats.gridSide} × {stats.gridSide} = {stats.numPatches} 块
            </span>
            <span className="text-[10px] text-slate-500">
              原始像素数: {stats.pixelCount.toLocaleString()} px
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block">2. 单块展平维度 (P²·C)</span>
            <span className="text-lg font-mono font-extrabold text-teal-400 block">
              {patchSizeP}² × 3 = {stats.rawPatchDim} 维
            </span>
            <span className="text-[10px] text-slate-500">经矩阵 E 投影至 D=768 维</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block">3. Transformer 序列总长</span>
            <span className="text-lg font-mono font-extrabold text-emerald-400 block">
              1 [CLS] + {stats.numPatches} = {stats.seqLenWithCls}
            </span>
            <span className="text-[10px] text-slate-500">与一段 200 词英文短文完全同构</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block">4. 自注意力计算量压缩比</span>
            <span className="text-lg font-mono font-extrabold text-emerald-400 block">
              省 {stats.computeReduction.toLocaleString()} 倍!
            </span>
            <span className="text-[10px] text-slate-500">
              仅 {stats.patchAttentionPairs.toLocaleString()} 次两两交互
            </span>
          </div>
        </div>
      </div>

      {/* Interactive 2D Position Embedding & Data Scale Crossover */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive 2D Position Embedding Similarity Explorer (Paper Figure 7 Middle) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>论文 Figure 7 复现：1D 位置编码自发涌现 2D 行列拓扑</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              点击下方任意一个图像块位置 <code>(row, col)</code>，查看其 1D 位置编码向量与其他所有图像块的余弦相似度分布：
            </p>
          </div>

          <div className="grid grid-cols-6 gap-2 p-4 rounded-xl bg-slate-950 border border-slate-800 max-w-sm mx-auto">
            {Array.from({ length: 6 }).map((_, rIdx) =>
              Array.from({ length: 6 }).map((__, cIdx) => {
                const [selR, selC] = selectedPatchCoord;
                const isSelected = rIdx === selR && cIdx === selC;
                const isSameRowOrCol = rIdx === selR || cIdx === selC;
                const dist = Math.hypot(rIdx - selR, cIdx - selC);
                const cosSim = isSelected
                  ? 1.0
                  : isSameRowOrCol
                  ? Math.max(0.45, +(0.88 - dist * 0.08).toFixed(2))
                  : Math.max(0.05, +(0.45 - dist * 0.09).toFixed(2));

                const seqIndex = rIdx * 6 + cIdx + 1;

                return (
                  <button
                    key={`${rIdx}-${cIdx}`}
                    onClick={() => setSelectedPatchCoord([rIdx, cIdx])}
                    className={`p-2 rounded-lg font-mono text-center transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 font-extrabold border-emerald-300 ring-2 ring-emerald-400'
                        : isSameRowOrCol
                        ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40 font-bold'
                        : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-[10px]">#{seqIndex}</div>
                    <div className="text-xs">{cosSim.toFixed(2)}</div>
                  </button>
                );
              })
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 leading-relaxed">
            <Sparkles className="w-3.5 h-3.5 inline mr-1.5 text-emerald-400" />
            <strong>位置拓扑解析：</strong>
            当前选中图像块 <code>(行 {selectedPatchCoord[0] + 1}, 列 {selectedPatchCoord[1] + 1})</code>。虽然输入给 ViT 的只是从 <code>#1</code> 到 <code>#N</code> 编号的一维位置编码，但训练后同一行与同一列的余弦相似度显著高亮（十字交叉星芒），证明 ViT 无需人工设计 2D 坐标即可自主学会二维网格几何！
          </div>
        </div>

        {/* Right: Data Scale vs. Inductive Bias Crossover (Paper Figure 3) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>论文 Figure 3 复现：预训练数据规模 vs. 归纳偏置交叉实验</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              切换预训练数据集规模（130万 ➔ 1400万 ➔ 3亿张图像），观察 ViT 如何实现从落后 ResNet 到全面反超的逆转：
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {SCALE_DATA.map(sc => (
              <button
                key={sc.id}
                onClick={() => setSelectedScale(sc.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium border text-left transition-all cursor-pointer flex items-center justify-between ${
                  selectedScale === sc.id
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/50 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <span>{sc.nameZh}</span>
                <span className="font-mono text-[11px]">{sc.imagesCount}</span>
              </button>
            ))}
          </div>

          <div className="space-y-3 pt-2">
            {[
              { label: 'BiT ResNet (强卷积归纳偏置基线)', val: activeScaleData.resnetBitAcc, isVit: false },
              { label: 'ViT-Base/16 (86M 参数)', val: activeScaleData.vitBaseAcc, isVit: true },
              { label: 'ViT-Large/16 (307M 参数)', val: activeScaleData.vitLargeAcc, isVit: true },
              { label: '🌟 ViT-Huge/14 (632M 旗舰)', val: activeScaleData.vitHugeAcc, isVit: true }
            ].map(item => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className={item.isVit ? 'text-slate-200 font-semibold' : 'text-amber-300 font-semibold'}>
                    {item.label}
                  </span>
                  <span className="font-mono font-bold text-emerald-400">{item.val}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.isVit ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-amber-500'
                    }`}
                    style={{ width: `${((item.val - 65) / 26) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            💡 <strong>阶段结论：</strong>
            {activeScaleData.insight}
          </div>
        </div>
      </div>
    </div>
  );
};
