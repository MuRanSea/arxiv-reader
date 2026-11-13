import React, { useState, useMemo } from 'react';
import {
  Cpu,
  Sliders,
  Zap,
  BarChart3,
  CheckCircle2,
  Sparkles,
  Layers,
  Activity,
  RotateCcw
} from 'lucide-react';

export interface SimParameterSpec {
  id: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  desc: string;
}

export interface SimComputedMetric {
  label: string;
  value: string;
  subtext: string;
  highlight?: boolean;
}

export interface SimComparisonBar {
  name: string;
  baselineLabel: string;
  baselineVal: number;
  ourLabel: string;
  ourVal: number;
  unit: string;
  lowerIsBetter?: boolean;
}

export interface IndustrialSimulatorConfig {
  paperId: string;
  titleZh: string;
  badgeZh: string;
  descriptionZh: string;
  formulaLatex: string;
  formulaDescZh: string;
  params: SimParameterSpec[];
  compute: (vals: Record<string, number>) => {
    metrics: SimComputedMetric[];
    bars: SimComparisonBar[];
    liveVerdictZh: string;
    stepTrace: { stepTitle: string; detail: string; status: string }[];
  };
}

const SIMULATOR_CONFIGS: Record<string, IndustrialSimulatorConfig> = {
  'adam-2014': {
    paperId: 'adam-2014',
    titleZh: 'Adam 一阶动量与二阶自适应矩估计交互实验台',
    badgeZh: 'ICLR 2015 · 自适应优化器基石',
    descriptionZh:
      '调节一阶动量衰减率 β₁、二阶方差衰减率 β₂、训练步数 t 与梯度稀疏度，实时观测偏差修正项 (1 - β^t) 与自适应有效步长 α·m̂_t / (√v̂_t + ε) 如何抑制峡谷震荡并加速收敛。',
    formulaLatex:
      'm_t = \\beta_1 m_{t-1} + (1-\\beta_1)g_t, \\quad v_t = \\beta_2 v_{t-1} + (1-\\beta_2)g_t^2, \\quad \\theta_t = \\theta_{t-1} - \\alpha \\frac{\\hat{m}_t}{\\sqrt{\\hat{v}_t} + \\epsilon}',
    formulaDescZh:
      '利用梯度一阶矩（均值方向）与二阶未中心化矩（曲率方差）的指数移动平均，并通过 (1-β^t) 消除冷启动零偏置。',
    params: [
      { id: 'beta1', label: '一阶动量系数 β₁', unit: '', min: 0.5, max: 0.99, step: 0.01, defaultValue: 0.9, desc: '平滑历史梯度方向' },
      { id: 'beta2', label: '二阶矩系数 β₂', unit: '', min: 0.9, max: 0.999, step: 0.001, defaultValue: 0.999, desc: '平滑历史梯度平方' },
      { id: 'stepT', label: '当前迭代步数 t', unit: '步', min: 1, max: 100, step: 1, defaultValue: 10, desc: '观察初期偏差修正效应' },
      { id: 'gradScale', label: '局部梯度幅值 |g_t|', unit: '', min: 0.05, max: 5.0, step: 0.05, defaultValue: 1.2, desc: '测试步长对梯度缩放的不变性' }
    ],
    compute: (v) => {
      const bias1 = 1 - Math.pow(v.beta1, v.stepT);
      const bias2 = 1 - Math.pow(v.beta2, v.stepT);
      const rawM = bias1 * v.gradScale;
      const rawV = bias2 * v.gradScale * v.gradScale;
      const mHat = rawM / bias1;
      const vHat = rawV / bias2;
      const effectiveStep = mHat / (Math.sqrt(vHat) + 1e-8);
      const uncalibratedStep = rawM / (Math.sqrt(rawV) + 1e-8);
      return {
        metrics: [
          { label: '一阶偏差修正因子 1/(1-β₁^t)', value: `${(1 / bias1).toFixed(2)}x`, subtext: `未修正 m_t=${rawM.toFixed(3)}`, highlight: true },
          { label: '二阶偏差修正因子 1/(1-β₂^t)', value: `${(1 / bias2).toFixed(1)}x`, subtext: `消除初期步长爆炸`, highlight: true },
          { label: '归一化自适应更新比 |Δθ/α|', value: effectiveStep.toFixed(3), subtext: '天然受限于 ±1 信赖域上界' },
          { label: '未做偏差修正时异常倍率', value: `${(uncalibratedStep / effectiveStep).toFixed(2)}x`, subtext: '步数越小无修正越危险' }
        ],
        bars: [
          { name: '冷启动第 t 步步长稳定性 (%)', baselineLabel: '无偏差修正 RMSProp', baselineVal: Math.min(100, Math.round((effectiveStep / uncalibratedStep) * 100)), ourLabel: 'Adam 偏差修正后', ourVal: 99, unit: '%' },
          { name: '稀疏特征参数收敛速度 (相对倍率)', baselineLabel: 'SGD + Nesterov', baselineVal: 32, ourLabel: 'Adam 自适应矩', ourVal: 95, unit: '分' }
        ],
        liveVerdictZh: `在第 t=${v.stepT} 步时，二阶矩原始值仅恢复至真实期望的 ${(bias2 * 100).toFixed(2)}%；若无 Adam 的 (1-β₂^t) 偏差修正，有效步长将暴涨 ${(uncalibratedStep / effectiveStep).toFixed(2)} 倍导致训练发散！而修正后 |m̂_t / √v̂_t| 严格稳定在 ${effectiveStep.toFixed(2)}。`,
        stepTrace: [
          { stepTitle: '1. 累积一阶动量 m_t', detail: `m_t = ${v.beta1}·m_{t-1} + ${(1 - v.beta1).toFixed(2)}·g_t`, status: `m̂_t = ${mHat.toFixed(3)}` },
          { stepTitle: '2. 累积二阶方差 v_t', detail: `v_t = ${v.beta2}·v_{t-1} + ${(1 - v.beta2).toFixed(3)}·g_t²`, status: `v̂_t = ${vHat.toFixed(3)}` },
          { stepTitle: '3. 信噪比自适应更新', detail: `Δθ = -α · m̂_t / (√v̂_t + ε)，自动抵消梯度尺度放缩`, status: `|Δθ/α| = ${effectiveStep.toFixed(2)}` }
        ]
      };
    }
  },

  'resnet-2015': {
    paperId: 'resnet-2015',
    titleZh: 'ResNet 残差恒等映射与深度网络梯度高速公路实验台',
    badgeZh: 'CVPR 2016 最佳论文 · 深度网络总基石',
    descriptionZh:
      '调节网络堆叠层数 L 与单层权重雅可比谱半径 λ，直观对比普通平铺网络（Plain Net）的梯度连乘衰减/退化与 ResNet 恒等快捷连接 y = F(x) + x 的无损梯度回传。',
    formulaLatex:
      '\\mathbf{x}_L = \\mathbf{x}_l + \\sum_{i=l}^{L-1} \\mathcal{F}(\\mathbf{x}_i, \\mathcal{W}_i), \\quad \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{x}_l} = \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{x}_L}\\left(\\mathbf{I} + \\frac{\\partial}{\\partial \\mathbf{x}_l}\\sum_{i=l}^{L-1}\\mathcal{F}_i\\right)',
    formulaDescZh:
      '加法恒等项 I 保证深层误差信号 ∂L/∂x_L 可以跳过任意中间权重层直接无损传回浅层，彻底根除深度退化（Degradation）。',
    params: [
      { id: 'layers', label: '网络总深度 L', unit: '层', min: 18, max: 152, step: 2, defaultValue: 56, desc: '对比 20 层 vs 56 层 vs 152 层' },
      { id: 'layerGain', label: '单层梯度传递系数 γ', unit: '', min: 0.7, max: 0.98, step: 0.01, defaultValue: 0.88, desc: '平铺网络每层连乘损耗' },
      { id: 'bottleneck', label: '启用 1×1-3×3-1×1 瓶颈结构', unit: '档', min: 0, max: 1, step: 1, defaultValue: 1, desc: '50层以上降低计算量' }
    ],
    compute: (v) => {
      const plainGrad = Math.pow(v.layerGain, v.layers);
      const resGrad = 1.0 + 0.15 * Math.sqrt(v.layers / 50);
      const plainTop1Err = Math.min(35, 7.2 + Math.max(0, (v.layers - 20) * 0.14));
      const resTop1Err = Math.max(4.4, 7.8 - Math.log2(v.layers / 18) * 1.45);
      return {
        metrics: [
          { label: '平铺网络首层梯度保留率', value: `${(plainGrad * 100).toExponential(2)}%`, subtext: `${v.layers} 层连乘后趋近于 0`, highlight: true },
          { label: 'ResNet 首层梯度主干项', value: `≥ 100% (含恒等项 I)`, subtext: `有效梯度幅值 ${resGrad.toFixed(2)}x`, highlight: true },
          { label: '平铺网络训练误差 (退化)', value: `${plainTop1Err.toFixed(2)}%`, subtext: '层数越深训练误差反而越高' },
          { label: 'ResNet Top-5 错误率', value: `${resTop1Err.toFixed(2)}%`, subtext: '随深度增加单调下降' }
        ],
        bars: [
          { name: '分类准确率 (100 - 错误率 %)', baselineLabel: `${v.layers}层 Plain 平铺网络`, baselineVal: Math.round(100 - plainTop1Err), ourLabel: `${v.layers}层 ResNet 残差网络`, ourVal: Math.round(100 - resTop1Err), unit: '%' },
          { name: '浅层有效反向传播梯度强度', baselineLabel: '连乘路径 ∏ W_i', baselineVal: Math.max(2, Math.round(plainGrad * 100)), ourLabel: '恒等快捷路径 I + ∂ΣF', ourVal: 98, unit: '%' }
        ],
        liveVerdictZh: `当网络堆叠至 ${v.layers} 层时，普通平铺网络的首层梯度因连乘效应衰减至 ${(plainGrad * 100).toExponential(2)}%，引发严重的「深度退化」；而 ResNet 依靠 ∂x_L/∂x_l = I + ... 中的常数矩阵 I，令任意深度的梯度都能以 100% 基础强度直达首层！`,
        stepTrace: [
          { stepTitle: '1. 残差映射重参数化', detail: `令网络拟合残差 F(x) = H(x) - x，而非直接拟合恒等映射 H(x)`, status: '零初始化即恒等' },
          { stepTitle: '2. 前向逐层累加', detail: `x_L = x_0 + Σ F(x_i, W_i)，特征在恒等高速路上增量修正`, status: `${v.layers} 层畅通` },
          { stepTitle: '3. 反向梯度直通', detail: `加法算子将顶层梯度原样分发至所有残差块入口`, status: `消除退化` }
        ]
      };
    }
  },

  'zero-2019': {
    paperId: 'zero-2019',
    titleZh: 'ZeRO 零冗余优化器显存分片计算器 (ZeRO-1 / ZeRO-2 / ZeRO-3)',
    badgeZh: 'SC 2020 · DeepSpeed 分布式训练核心',
    descriptionZh:
      '调节大模型参数量 Ψ（十亿/B）、数据并行 GPU 卡数 N_d 与 ZeRO 分片阶段（Stage 1/2/3），实时计算混合精度 Adam 训练下每张显卡的模型状态显存占用（16Ψ → 16Ψ/N_d）。',
    formulaLatex:
      'M_{\\text{DP}} = (2 + 2 + 12)\\Psi = 16\\Psi \\;\\text{Bytes} \\;\\xrightarrow{\\text{ZeRO-3}}\\; M_{\\text{ZeRO-3}} = \\frac{16\\Psi}{N_d} \\;\\text{Bytes}',
    formulaDescZh:
      '混合精度训练中，FP16 参数(2Ψ) + FP16 梯度(2Ψ) + FP32 主参数与 Adam 一二阶动量(4+4+4=12Ψ) 共占 16Ψ 字节；ZeRO 按阶段将其无冗余切分至 N_d 张卡。',
    params: [
      { id: 'paramsB', label: '模型参数规模 Ψ', unit: 'B (十亿)', min: 7, max: 175, step: 7, defaultValue: 70, desc: '如 7B / 70B / 175B' },
      { id: 'numGpus', label: '数据并行 GPU 数量 N_d', unit: '卡', min: 8, max: 128, step: 8, defaultValue: 64, desc: '集群并行规模' },
      { id: 'zeroStage', label: 'ZeRO 分片阶段 (Stage)', unit: '阶', min: 1, max: 3, step: 1, defaultValue: 3, desc: '1:分优化器 2:+分梯度 3:+分参数' }
    ],
    compute: (v) => {
      const fullMemGB = 16 * v.paramsB;
      const optMem = 12 * v.paramsB;
      const gradMem = 2 * v.paramsB;
      const paramMem = 2 * v.paramsB;

      let stageMemGB = fullMemGB;
      if (v.zeroStage === 1) stageMemGB = paramMem + gradMem + optMem / v.numGpus;
      else if (v.zeroStage === 2) stageMemGB = paramMem + (gradMem + optMem) / v.numGpus;
      else stageMemGB = fullMemGB / v.numGpus;

      const reductionFactor = fullMemGB / stageMemGB;
      return {
        metrics: [
          { label: '传统 DP 单卡显存需求 (16Ψ)', value: `${fullMemGB.toFixed(0)} GB`, subtext: `远超单张 80GB A100/H100`, highlight: false },
          { label: `ZeRO-${v.zeroStage} 单卡模型状态显存`, value: `${stageMemGB.toFixed(1)} GB`, subtext: `${stageMemGB <= 80 ? '✅ 单卡 80GB 轻松容纳' : '需增加卡数或升至 Stage 3'}`, highlight: true },
          { label: '单卡显存压缩倍率', value: `${reductionFactor.toFixed(1)}x 缩减`, subtext: `理论极限 ${v.numGpus}x (Stage 3)`, highlight: true },
          { label: '跨卡集合通信量开销', value: v.zeroStage < 3 ? '1.0x (与标准DP持平)' : '1.5x (仅增50% All-Gather)', subtext: '换取线性显存扩展' }
        ],
        bars: [
          { name: '单 GPU 模型状态显存占用 (GB, 越低越好)', baselineLabel: '标准数据并行 DDP', baselineVal: Math.min(100, Math.round(fullMemGB / 15)), ourLabel: `DeepSpeed ZeRO-${v.zeroStage}`, ourVal: Math.max(3, Math.round(stageMemGB / 15)), unit: 'GB比例', lowerIsBetter: true },
          { name: '80GB 显卡集群可训练最大模型规模', baselineLabel: '标准 DDP (上限 ~4B)', baselineVal: 12, ourLabel: `ZeRO-${v.zeroStage} (${v.numGpus}卡)`, ourVal: 96, unit: '分' }
        ],
        liveVerdictZh: `训练 ${v.paramsB}B 模型时，传统 DDP 每张卡都冗余拷贝完整的 16Ψ=${fullMemGB}GB 状态（其中 75% 即 ${optMem}GB 全是 FP32 Adam 状态！）。启用 ZeRO-${v.zeroStage} 在 ${v.numGpus} 张 GPU 上分片后，单卡显存骤降至 ${stageMemGB.toFixed(1)}GB（压缩 ${reductionFactor.toFixed(1)} 倍）！`,
        stepTrace: [
          { stepTitle: 'Stage 1 (P_os): 优化器状态分片', detail: `12Ψ (${optMem}GB) 的 FP32 权重与 m_t, v_t 均分至 ${v.numGpus} 卡`, status: `省去 75% 冗余` },
          { stepTitle: 'Stage 2 (P_os+g): 梯度连同分片', detail: `2Ψ (${gradMem}GB) FP16 梯度用 Reduce-Scatter 替代 All-Reduce`, status: `省去 87.5% 冗余` },
          { stepTitle: 'Stage 3 (P_os+g+p): 参数按需广播', detail: `2Ψ (${paramMem}GB) 参数前向/反向时 All-Gather，用完即释放`, status: `${reductionFactor.toFixed(1)}x 压缩` }
        ]
      };
    }
  },

  'chinchilla-2022': {
    paperId: 'chinchilla-2022',
    titleZh: 'Chinchilla 算力最优缩放定律 (Compute-Optimal Scaling Law) 规划器',
    badgeZh: 'NeurIPS 2022 · 买卡与买数据黄金配比',
    descriptionZh:
      '给定总预训练算力预算 C（FLOPs ≈ 6ND），对比 Kaplan (GPT-3 路线：偏重扩参数) 与 Chinchilla 定律（参数 N 与训练词元 D 等比例同步扩展，D ≈ 20N）的最终预训练损失 L(N, D)。',
    formulaLatex:
      'C \\approx 6ND, \\quad L(N, D) = E + \\frac{A}{N^\\alpha} + \\frac{B}{D^\\beta}, \\quad N_{\\text{opt}} \\propto C^{0.50}, \\; D_{\\text{opt}} \\propto C^{0.50} \\; (D_{\\text{opt}} \\approx 20 N_{\\text{opt}})',
    formulaDescZh:
      '每将模型参数量翻倍，训练数据 Token 数也必须同步翻倍（约每个参数对应 20 个训练 Token），否则大参数模型将处于严重的欠训练状态。',
    params: [
      { id: 'computeExp', label: '训练算力预算 log₁₀(C)', unit: '10^x FLOPs', min: 21, max: 25, step: 0.2, defaultValue: 23.76, desc: '23.76 对应 Gopher 280B / Chinchilla 70B 算力' },
      { id: 'tokensPerParam', label: '当前选择的 D/N 配比', unit: 'Tokens/参数', min: 1.5, max: 60, step: 0.5, defaultValue: 20, desc: 'GPT-3 约为 1.7，Chinchilla 最优为 20' }
    ],
    compute: (v) => {
      const C = Math.pow(10, v.computeExp);
      const optN_B = Math.sqrt(C / (6 * 20)) / 1e9;
      const optD_T = (20 * optN_B) / 1000;
      const userN_B = Math.sqrt(C / (6 * v.tokensPerParam)) / 1e9;
      const userD_T = (userN_B * v.tokensPerParam) / 1000;

      const calcLoss = (nB: number, dT: number) =>
        1.69 + 406.4 / Math.pow(nB * 1e9, 0.34) + 410.7 / Math.pow(dT * 1e12, 0.28);

      const optLoss = calcLoss(optN_B, optD_T);
      const userLoss = calcLoss(userN_B, userD_T);
      const gpt3StyleLoss = calcLoss(Math.sqrt(C / (6 * 1.7)) / 1e9, (Math.sqrt(C / (6 * 1.7)) * 1.7) / 1e12);

      return {
        metrics: [
          { label: 'Chinchilla 算力最优模型规模 N_opt', value: `${optN_B.toFixed(1)} B`, subtext: `配比最优数据量 ${optD_T.toFixed(2)} T Tokens`, highlight: true },
          { label: '当前配比下的模型与数据', value: `${userN_B.toFixed(1)}B / ${userD_T.toFixed(2)}T`, subtext: `当前比率 ${v.tokensPerParam} Tokens/Param`, highlight: false },
          { label: '算力最优交叉熵损失 L_opt', value: optLoss.toFixed(3), subtext: `旧式偏大参数路线 L=${gpt3StyleLoss.toFixed(3)}`, highlight: true },
          { label: '推理部署成本节省 (vs 4倍大欠训练模型)', value: '75% 显存与延迟降低', subtext: '70B 全面击败 Gopher 280B' }
        ],
        bars: [
          { name: 'MMLU 下游综合准确率 (%)', baselineLabel: 'Gopher 280B (仅300B Tokens)', baselineVal: 60, ourLabel: 'Chinchilla 70B (1.4T Tokens)', ourVal: 68, unit: '%' },
          { name: '单次在线推理吞吐效率 (相对值)', baselineLabel: '280B 肥胖欠训练模型', baselineVal: 25, ourLabel: '70B 算力最优模型', ourVal: 100, unit: '%' }
        ],
        liveVerdictZh: `在 C=10^${v.computeExp.toFixed(2)} FLOPs 预算下，算力最优解应训练 ${optN_B.toFixed(1)}B 参数模型并喂满 ${optD_T.toFixed(2)} 万亿 Tokens（Loss=${optLoss.toFixed(3)}）。你当前设定的 ${v.tokensPerParam} Tokens/参数配比给出 ${userN_B.toFixed(1)}B 模型（Loss=${userLoss.toFixed(3)}）。`,
        stepTrace: [
          { stepTitle: '1. 锁定等算力前沿 C = 6ND', detail: `算力预算 고정时，参数 N 扩大 4 倍则数据 D 必缩水 4 倍`, status: `C=10^${v.computeExp}` },
          { stepTitle: '2. 求解幂律包络极值', detail: `α ≈ 0.50, β ≈ 0.50，证明参数与数据必须 1:1 等速扩张`, status: `D ≈ 20N` },
          { stepTitle: '3. 推理侧双重红利', detail: `更小的模型不仅预训练 Loss 更低，上线推理显存与延迟还直降 75%`, status: `70B > 280B` }
        ]
      };
    }
  },

  'rope-2021': {
    paperId: 'rope-2021',
    titleZh: 'RoPE 旋转位置编码复平面内积与相对距离衰减实验台',
    badgeZh: 'Llama / Qwen / DeepSeek 默认位置编码',
    descriptionZh:
      '调节查询词元位置 m、键词元位置 n 与频率基数 θ_base（如 10000 或 NTK 扩展 500000），实时观察二维复平面旋转变换 R_m 后，内积 ⟨R_m q, R_n k⟩ 如何严格只取决于相对距离 Δ = m - n。',
    formulaLatex:
      '\\langle \\mathbf{R}_{\\Theta, m}^d \\mathbf{q}, \\, \\mathbf{R}_{\\Theta, n}^d \\mathbf{k} \\rangle = \\text{Re}\\left[\\sum_{i=0}^{d/2-1} q_{[2i:2i+1]} k_{[2i:2i+1]}^* e^{i(m-n)\\theta_i}\\right], \\quad \\theta_i = \\theta_{\\text{base}}^{-2i/d}',
    formulaDescZh:
      '通过将绝对位置 m 转化为复平面旋转角 mθ_i，点积后的正交矩阵满足 R_m^T R_n = R_{n-m}，从而以绝对位置实现严格的相对位置注意力，并自带长程衰减特性。',
    params: [
      { id: 'posM', label: 'Query 绝对位置索引 m', unit: '', min: 10, max: 4096, step: 10, defaultValue: 520, desc: '当前生成的 Token 位置' },
      { id: 'posN', label: 'Key 绝对位置索引 n', unit: '', min: 0, max: 4000, step: 10, defaultValue: 500, desc: '历史上下文 Token 位置' },
      { id: 'baseFreq', label: '旋转基频 log₁₀(θ_base)', unit: '10^x', min: 4, max: 6, step: 0.5, defaultValue: 4, desc: '标准为 10^4 (10000)，长文本可扩至 10^6' }
    ],
    compute: (v) => {
      const delta = Math.abs(v.posM - v.posN);
      const base = Math.pow(10, v.baseFreq);
      let avgCos = 0;
      const numPairs = 32;
      for (let i = 0; i < numPairs; i++) {
        const thetaI = Math.pow(base, (-2 * i) / 64);
        avgCos += Math.cos(delta * thetaI);
      }
      avgCos = avgCos / numPairs;
      const decayEnvelope = Math.max(0.08, Math.min(1, (avgCos + 1) / 2));

      return {
        metrics: [
          { label: '有效相对距离 |m - n|', value: `${delta} Tokens`, subtext: `平移 m+${100}, n+${100} 内积完全不变`, highlight: true },
          { label: '第一高频通道旋转角 Δ·θ₀', value: `${((delta * 1.0 * 180) / Math.PI % 360).toFixed(1)}°`, subtext: '捕捉局部精细词序' },
          { label: '最低频通道旋转角 Δ·θ_{d/2}', value: `${((delta * Math.pow(base, -62 / 64) * 180) / Math.PI).toFixed(3)}°`, subtext: '承载长距离全局语义' },
          { label: '远程注意力上界包络系数', value: `${(decayEnvelope * 100).toFixed(1)}%`, subtext: '距离越远自然平滑衰减', highlight: true }
        ],
        bars: [
          { name: 'KV Cache 历史平移复用兼容性 (%)', baselineLabel: '传统 T5 相对位置偏置 (需重算)', baselineVal: 35, ourLabel: 'RoPE 绝对旋转实现相对位置', ourVal: 100, unit: '%' },
          { name: '长上下文外推与线性注意力兼容度', baselineLabel: 'Sinusoidal 加法编码', baselineVal: 48, ourLabel: 'RoPE 乘法正交旋转 (+NTK/YaRN)', ourVal: 96, unit: '%' }
        ],
        liveVerdictZh: `无论 m=${v.posM}, n=${v.posN} 处于序列何处，旋转矩阵正交性 R_m^T R_n = R_{n-m} 保证注意力得分严格只依赖相对距离 Δ=${delta}！当前多频分量叠加后的远程注意力包络强度为 ${(decayEnvelope * 100).toFixed(1)}%。`,
        stepTrace: [
          { stepTitle: '1. 特征维度两两分组', detail: `将 d 维向量视为 d/2 个二维复数平面子空间 (q_{2i}, q_{2i+1})`, status: 'd/2 复平面' },
          { stepTitle: '2. 乘以位置旋转矩阵 R_m', detail: `每个子空间按频率 θ_i = ${base.toFixed(0)}^(-2i/d) 旋转 m·θ_i 弧度`, status: '保模长正交变换' },
          { stepTitle: '3. 内积自动抵消绝对偏移', detail: `(R_m q)^T (R_n k) = q^T R_{n-m} k，完美兼容 KV Cache 与 FlashAttention`, status: `Δ = ${delta}` }
        ]
      };
    }
  },

  'qlora-2023': {
    paperId: 'qlora-2023',
    titleZh: 'QLoRA 4-bit 正态浮点 (NF4) + 双重量化显存预算实验台',
    badgeZh: 'NeurIPS 2023 · 单张 48GB 卡微调 65B',
    descriptionZh:
      '调节基座大模型参数量（7B ~ 70B）、量化精度（FP16 vs Int8 vs NF4 + 双重量化）与 LoRA 秩 r，实时计算冻结主干显存、双重量化常数节省量与总微调显存占用。',
    formulaLatex:
      '\\mathbf{Y}^{\\text{BF16}} = \\mathbf{X}^{\\text{BF16}} \\cdot \\text{doubleDequant}(c_1^{\\text{FP32}}, c_2^{\\text{FP8}}, \\mathbf{W}^{\\text{NF4}}) + \\mathbf{X}^{\\text{BF16}} \\mathbf{L}_1^{\\text{BF16}} \\mathbf{L}_2^{\\text{BF16}}',
    formulaDescZh:
      '利用信息论最优分位量化（NF4）冻结预训练权重，对分块量化常数再做一次 FP8 二次量化（每参数从 0.5 bit 压至 0.127 bit），仅在 BF16 下反量化计算梯度回传至 LoRA 旁路。',
    params: [
      { id: 'modelSizeB', label: '基座大模型参数量', unit: 'B', min: 7, max: 70, step: 1, defaultValue: 65, desc: '如 LLaMA-65B 或 Llama-3-70B' },
      { id: 'doubleQuant', label: '启用双重量化 (Double Quant)', unit: '开关', min: 0, max: 1, step: 1, defaultValue: 1, desc: '将量化常数从 FP32 压至 FP8' },
      { id: 'blockSize', label: 'NF4 分块大小 B_size', unit: '参数/块', min: 32, max: 128, step: 32, defaultValue: 64, desc: '默认每 64 个权重共享一个缩放常数' }
    ],
    compute: (v) => {
      const fp16FullFtGB = v.modelSizeB * 16;
      const fp16LoraGB = v.modelSizeB * 2.0 + v.modelSizeB * 0.12;
      const quantOverheadBits = v.doubleQuant === 1 ? 8 / v.blockSize + 32 / (v.blockSize * 256) : 32 / v.blockSize;
      const effectiveBitsPerParam = 4.0 + quantOverheadBits;
      const qloraWeightsGB = (v.modelSizeB * effectiveBitsPerParam) / 8;
      const savedByDoubleQuantGB = (v.modelSizeB * (32 / v.blockSize - quantOverheadBits)) / 8;
      const totalQloraVramGB = qloraWeightsGB + v.modelSizeB * 0.14;

      return {
        metrics: [
          { label: '有效每参数平均位数', value: `${effectiveBitsPerParam.toFixed(3)} bits`, subtext: `NF4(4b) + 量化常数(${quantOverheadBits.toFixed(3)}b)`, highlight: true },
          { label: '双重量化额外省下显存', value: `${savedByDoubleQuantGB.toFixed(2)} GB`, subtext: `65B 模型立省 ~3GB 显存`, highlight: true },
          { label: 'QLoRA 微调总显存峰值', value: `${totalQloraVramGB.toFixed(1)} GB`, subtext: `${totalQloraVramGB <= 48 ? '✅ 单张 48GB GPU 可跑' : '✅ 单张 80GB GPU 可跑'}`, highlight: true },
          { label: '相比 16-bit 全量微调显存缩减', value: `${(fp16FullFtGB / totalQloraVramGB).toFixed(1)}x 降低`, subtext: `全量微调需 ${fp16FullFtGB.toFixed(0)} GB` }
        ],
        bars: [
          { name: `${v.modelSizeB}B 模型微调所需总显存 (GB, 越低越好)`, baselineLabel: '16-bit LoRA (需多卡)', baselineVal: Math.min(100, Math.round(fp16LoraGB / 1.6)), ourLabel: '4-bit QLoRA (NF4+双重量化)', ourVal: Math.max(5, Math.round(totalQloraVramGB / 1.6)), unit: 'GB比例', lowerIsBetter: true },
          { name: 'MMLU 16-bit 精度保持率 (%)', baselineLabel: '普通 Int4 均匀量化', baselineVal: 89, ourLabel: 'QLoRA NF4 分位量化', ourVal: 100, unit: '%' }
        ],
        liveVerdictZh: `微调 ${v.modelSizeB}B 大模型时，16-bit 全量微调需 ${fp16FullFtGB}GB 显存，普通 16-bit LoRA 仍需 ${fp16LoraGB.toFixed(1)}GB；而 QLoRA 通过 NF4 + 双重量化将每参数压至 ${effectiveBitsPerParam.toFixed(3)} bits，总显存仅需 ${totalQloraVramGB.toFixed(1)}GB，且 100% 追平 16-bit 全量微调精度！`,
        stepTrace: [
          { stepTitle: '1. NF4 正态分位映射', detail: `利用预训练权重严格服从零均值正态分布 N(0,σ²)，按等概率密度划分 16 个分位点`, status: '信息论最优 4-bit' },
          { stepTitle: '2. 双重量化压缩常数 c₂', detail: `对第一层分块常数 c₁ 再做一次 256 块长的 FP8 量化，每参数常数开销从 0.5b 降至 0.127b`, status: `省 ${savedByDoubleQuantGB.toFixed(1)}GB` },
          { stepTitle: '3. 分页优化器防 OOM', detail: `利用统一虚拟内存将瞬时长序列梯度峰值自动换页至 CPU 内存`, status: '零显存溢出' }
        ]
      };
    }
  },

  'flashattention-2022': {
    paperId: 'flashattention-2022',
    titleZh: 'FlashAttention IO 感知 SRAM 分块平铺与在线 Softmax 模拟器',
    badgeZh: 'NeurIPS 2022 · 长上下文训练与推理标配',
    descriptionZh:
      '调节上下文序列长度 N、注意力头维度 d 与片上 SRAM 分块大小 B_c，对比标准注意力（需将 N×N 矩阵反复写回慢速 HBM 显存）与 FlashAttention（片上 SRAM 融合计算、零中间矩阵落盘）的 HBM 访存字节数与加速比。',
    formulaLatex:
      'm(x) = \\max(m^{(1)}, m^{(2)}), \\quad \\ell(x) = e^{m^{(1)}-m(x)}\\ell^{(1)} + e^{m^{(2)}-m(x)}\\ell^{(2)}, \\quad \\text{HBM Access}: \\Theta(N^2) \\longrightarrow \\Theta\\left(\\frac{N^2 d^2}{M}\\right)',
    formulaDescZh:
      '通过动态维护分块最大值 m(x) 与指数和 ℓ(x) 的在线重缩放（Online Softmax），单遍扫描即可在片上高速 SRAM 内算出 100% 精确的注意力输出，彻底省去 N×N 矩阵读写 HBM。',
    params: [
      { id: 'seqLen', label: '上下文序列长度 N', unit: 'Tokens', min: 1024, max: 32768, step: 1024, defaultValue: 8192, desc: '测试长文本下的平方级显存墙' },
      { id: 'headDim', label: '注意力头维度 d', unit: '', min: 64, max: 128, step: 64, defaultValue: 128, desc: '通常为 64 或 128' },
      { id: 'sramKB', label: 'GPU 片上 SRAM 容量 M', unit: 'KB', min: 96, max: 256, step: 32, defaultValue: 192, desc: 'A100 为 192KB/SM (带宽 19TB/s)' }
    ],
    compute: (v) => {
      const stdHbmMB = (4 * v.seqLen * v.seqLen * 2) / (1024 * 1024); // S, P read/write in FP16
      const flashHbmMB = (v.seqLen * v.headDim * 2 * 6) / (1024 * 1024);
      const ioReduction = stdHbmMB / Math.max(0.1, flashHbmMB);
      const speedup = Math.min(7.6, 2.2 + Math.log2(v.seqLen / 512) * 0.85);
      return {
        metrics: [
          { label: '标准 Attention 单头 HBM 读写', value: `${stdHbmMB.toFixed(1)} MB`, subtext: `必须落盘 N×N (${v.seqLen}×${v.seqLen}) 矩阵`, highlight: false },
          { label: 'FlashAttention HBM 读写量', value: `${flashHbmMB.toFixed(2)} MB`, subtext: `O(N) 线性显存占用，零 N×N 落盘`, highlight: true },
          { label: 'HBM 显存带宽读写缩减比', value: `${ioReduction.toFixed(1)}x 减少`, subtext: '打破 Memory-Bound 访存墙', highlight: true },
          { label: '端到端算子实测加速比', value: `${speedup.toFixed(1)}x 提速`, subtext: '数学输出与标准注意力 100% 一致' }
        ],
        bars: [
          { name: '算子执行速度 (相对吞吐, 越高越好)', baselineLabel: 'PyTorch 标准 Attention', baselineVal: Math.round(100 / speedup), ourLabel: 'FlashAttention 融合算子', ourVal: 100, unit: '%' },
          { name: '峰值注意力中间显存占用 (越低越好)', baselineLabel: 'O(N²) 显式矩阵', baselineVal: 95, ourLabel: 'O(N) 片上流式归约', ourVal: Math.max(4, Math.round(95 / ioReduction)), unit: '%', lowerIsBetter: true }
        ],
        liveVerdictZh: `在序列长度 N=${v.seqLen} 时，标准注意力单头需在慢速 HBM（1.5TB/s）上反复读写 ${stdHbmMB.toFixed(1)}MB 的 N×N 矩阵；FlashAttention 利用 ${v.sramKB}KB 高速片上 SRAM（19TB/s）分块平铺，将 HBM 访存骤降至 ${flashHbmMB.toFixed(2)}MB（减少 ${ioReduction.toFixed(1)} 倍），实现 ${speedup.toFixed(1)} 倍无损加速！`,
        stepTrace: [
          { stepTitle: '1. Q/K/V 分块载入片上 SRAM', detail: `按容量 M=${v.sramKB}KB 切分为小块，避免中间矩阵 S=QK^T 写回 HBM`, status: 'SRAM 19TB/s' },
          { stepTitle: '2. 在线 Softmax 递推修正', detail: `遇到新分块时用 e^(m_old - m_new) 动态缩放历史累加输出 O`, status: '零精度损失' },
          { stepTitle: '3. 反向传播重计算优化', detail: `仅保存每行统计量 (m, ℓ)，反向传播时在 SRAM 内极速重算注意力矩阵`, status: `${ioReduction.toFixed(0)}x 省显存` }
        ]
      };
    }
  },

  'orca-2022': {
    paperId: 'orca-2022',
    titleZh: 'Orca 迭代级持续批处理 (Continuous Batching) 调度模拟器',
    badgeZh: 'OSDI 2022 · 现代推理引擎调度基石',
    descriptionZh:
      '调节并发请求批大小 B、请求输出长度方差（短句与长句混杂度）以及选择性批处理开关，对比传统请求级静态批处理（Request-Level Static Batching）与 Orca 迭代级调度（Iteration-Level Scheduling）的 GPU 有效槽位利用率与吞吐提升。',
    formulaLatex:
      '\\text{Throughput}_{\\text{Orca}} = \\frac{\\sum_{i=1}^B L_i}{T_{\\text{step}} \\cdot \\bar{L}} \\gg \\text{Throughput}_{\\text{Static}} = \\frac{\\sum_{i=1}^B L_i}{T_{\\text{step}} \\cdot \\max_i L_i}',
    formulaDescZh:
      '静态批处理必须等批内最长的序列生成完 [EOS] 才能释放整批槽位；Orca 在每一次单步前向迭代（Iteration）后立即剔除已完成请求并插入新请求，消除气泡空闲。',
    params: [
      { id: 'batchSize', label: '并发批处理槽位数 B', unit: '个请求', min: 8, max: 64, step: 8, defaultValue: 32, desc: '同时在 GPU 上运行的槽位' },
      { id: 'maxLenRatio', label: '最长句 / 平均句长比 (L_max / L_avg)', unit: '倍', min: 1.5, max: 8.0, step: 0.5, defaultValue: 4.5, desc: '真实线上长短句混杂比例' },
      { id: 'selectiveAttn', label: '启用 Selective Batching', unit: '开关', min: 0, max: 1, step: 1, defaultValue: 1, desc: '仅对 Attention 按请求拆分，Linear/FFN 合并矩阵乘' }
    ],
    compute: (v) => {
      const staticUtilPct = Math.round((1 / v.maxLenRatio) * 100);
      const bubbleWastePct = 100 - staticUtilPct;
      const orcaUtilPct = v.selectiveAttn === 1 ? 96 : 78;
      const throughputGain = Number(((orcaUtilPct / staticUtilPct) * (v.selectiveAttn ? 8.2 : 3.5)).toFixed(1));
      return {
        metrics: [
          { label: '静态批处理 GPU 槽位有效率', value: `${staticUtilPct}%`, subtext: `${bubbleWastePct}% 算力浪费在等待最长句 Padding`, highlight: false },
          { label: 'Orca 迭代级调度槽位利用率', value: `${orcaUtilPct}%`, subtext: '单步生成的 [EOS] 下一毫秒即换入新请求', highlight: true },
          { label: '同延迟约束下吞吐提升倍率', value: `${throughputGain}x 提升`, subtext: '论文 GPT-3 175B 最高达 36.9x', highlight: true },
          { label: '新请求平均排队首字延迟', value: '降低 82%', subtext: '无需等待上一整批慢请求结束' }
        ],
        bars: [
          { name: 'GPU 有效 Token 生成槽位占用率 (%)', baselineLabel: 'FasterTransformer 静态批处理', baselineVal: staticUtilPct, ourLabel: 'Orca Continuous Batching', ourVal: orcaUtilPct, unit: '%' },
          { name: '单位时间服务请求吞吐量 (相对得分)', baselineLabel: 'Request-Level 调度', baselineVal: 12, ourLabel: 'Iteration-Level + Selective Batching', ourVal: 98, unit: '分' }
        ],
        liveVerdictZh: `当批内最长输出是平均长度的 ${v.maxLenRatio} 倍时，传统静态批处理有 ${bubbleWastePct}% 的 GPU 槽位在空转等待；Orca 将调度粒度从「整条请求」细化至「单次前向迭代」，配合 Selective Batching 将有效利用率拉满至 ${orcaUtilPct}%，吞吐暴涨 ${throughputGain} 倍！`,
        stepTrace: [
          { stepTitle: '1. 迭代级动态换入/换出', detail: `每生成 1 个 Token 后检查 [EOS]，完成的请求立即归还槽位并注入排队池新请求`, status: '消除气泡等待' },
          { stepTitle: '2. Selective Batching 解耦', detail: `不同序列长度的请求在 Linear/FFN/LayerNorm 层拼成二维张量 [ΣN_i, d] 统一加速`, status: '高密矩阵乘' },
          { stepTitle: '3. Attention 算子独立路由', detail: `仅在跟位置长度绑定的 Attention 算子处按请求各自的 KV Cache 分支执行`, status: `${throughputGain}x 吞吐` }
        ]
      };
    }
  },

  'pagedattention-2023': {
    paperId: 'pagedattention-2023',
    titleZh: 'PagedAttention (vLLM) 虚拟内存分页 KV Cache 分配实验台',
    badgeZh: 'SOSP 2023 · vLLM 核心内存引擎',
    descriptionZh:
      '调节最大上下文预留长度 L_max、实际平均生成长度 L_actual、物理块大小 B_block（Tokens/块）与 Beam Search / Parallel Sampling 共享前缀比例，实时对比传统连续显存分配与 vLLM 分页块表（Block Table）的显存浪费率与并发 Batch 扩容倍数。',
    formulaLatex:
      '\\text{Waste}_{\\text{Contiguous}} = \\frac{L_{\\max} - L_{\\text{actual}}}{L_{\\max}} \\approx 60\\%\\sim 80\\%, \\quad \\text{Waste}_{\\text{Paged}} < \\frac{B_{\\text{block}} - 1}{L_{\\text{actual}}} < 4\\%',
    formulaDescZh:
      '借鉴操作系统虚拟内存分页机制，将 KV Cache 切分为固定大小的非连续物理块（如每块 16 Tokens），按需动态分配并支持写时复制（Copy-on-Write）前缀共享。',
    params: [
      { id: 'maxReserved', label: '系统最大上下文上限 L_max', unit: 'Tokens', min: 2048, max: 8192, step: 512, defaultValue: 4096, desc: '传统引擎必须事先连续预留的长度' },
      { id: 'actualAvg', label: '请求实际平均长度 L_actual', unit: 'Tokens', min: 256, max: 2048, step: 128, defaultValue: 768, desc: '实际对话往往远短于上限' },
      { id: 'blockSize', label: '物理页块大小 B_block', unit: 'Tokens/页', min: 8, max: 64, step: 8, defaultValue: 16, desc: 'vLLM 默认 16 Tokens 一页' }
    ],
    compute: (v) => {
      const contiguousWastePct = Math.max(15, ((v.maxReserved - v.actualAvg) / v.maxReserved) * 100 + 8);
      const pagedWastePct = ((v.blockSize / 2) / v.actualAvg) * 100;
      const batchMultiplier = (100 - pagedWastePct) / Math.max(10, 100 - contiguousWastePct);
      return {
        metrics: [
          { label: '传统连续分配 KV 显存浪费率', value: `${contiguousWastePct.toFixed(1)}%`, subtext: '预留内部碎片 + 外部连续碎片', highlight: false },
          { label: 'PagedAttention 显存浪费率', value: `${pagedWastePct.toFixed(2)}%`, subtext: `仅最后一个未满 ${v.blockSize}-Token 页有微小余量`, highlight: true },
          { label: '同卡并发请求 Batch 扩容倍数', value: `${batchMultiplier.toFixed(1)}x 并发量`, subtext: '省下的显存全部转化为并发槽位', highlight: true },
          { label: '写时复制 (CoW) 共享前缀节省', value: '最高省 55% KV 显存', subtext: '多候选采样与 System Prompt 零拷贝共享' }
        ],
        bars: [
          { name: 'KV Cache 显存有效利用率 (%, 越高越好)', baselineLabel: '传统连续显存预分配', baselineVal: Math.round(100 - contiguousWastePct), ourLabel: 'vLLM PagedAttention', ourVal: Math.round(100 - pagedWastePct), unit: '%' },
          { name: '高并发在线服务吞吐量 (相对倍率)', baselineLabel: 'FasterTransformer / Orca(连续KV)', baselineVal: Math.round(100 / batchMultiplier), ourLabel: 'vLLM 分页引擎', ourVal: 100, unit: '%' }
        ],
        liveVerdictZh: `当预留上限为 ${v.maxReserved} 而实际平均长度为 ${v.actualAvg} Tokens 时，传统连续 KV 分配白白浪费了 ${contiguousWastePct.toFixed(1)}% 的宝贵显存；PagedAttention 以 ${v.blockSize} Tokens 为一页按需映射非连续物理块，将碎片率压至极致的 ${pagedWastePct.toFixed(2)}%，使单卡并发吞吐直接提升 ${batchMultiplier.toFixed(1)} 倍！`,
        stepTrace: [
          { stepTitle: '1. 逻辑块 → 物理块页表映射', detail: `每个请求维护轻量 Block Table，生成的每个新 Token 填入当前页，满 ${v.blockSize} 个才申请新物理页`, status: '零外部碎片' },
          { stepTitle: '2. 分页注意力内核融合读取', detail: `CUDA Kernel 根据页表指针直接从非连续物理地址收集 K/V 块计算注意力`, status: `浪费仅 ${pagedWastePct.toFixed(1)}%` },
          { stepTitle: '3. 引用计数与 Copy-on-Write', detail: `Beam Search 或共享 System Prompt 指向同一物理页，仅在分支分叉修改时复制单页`, status: `${batchMultiplier.toFixed(1)}x 吞吐` }
        ]
      };
    }
  },

  'speculative-decoding-2022': {
    paperId: 'speculative-decoding-2022',
    titleZh: '投机解码 (Speculative Decoding) 猜验并行与无损拒绝采样实验台',
    badgeZh: 'ICML 2023 · 2~3倍无损自回归加速',
    descriptionZh:
      '调节草稿小模型单次连猜步数 γ（Lookahead）、小模型与大模型的单步分布接受率 α，以及大小模型耗时比 c，实时计算单次大模型前向传播期望生成的有效 Token 数 E[#Tokens] 与端到端无损加速比。',
    formulaLatex:
      '\\mathbb{E}[\\text{Tokens per Step}] = \\frac{1 - \\alpha^{\\gamma + 1}}{1 - \\alpha}, \\quad p_{\\text{accept}}(x) = \\min\\left(1, \\frac{p_{\\text{target}}(x)}{q_{\\text{draft}}(x)}\\right), \\quad p\'(x) = \\text{norm}(\\max(0, p(x) - q(x)))',
    formulaDescZh:
      '小模型快速自回归串行猜出 γ 个草稿 Token，大模型在单次前向传播中并行算出全部 γ+1 个位置的精确分布，通过修正拒绝采样保证最终输出分布与纯大模型逐字解码 100% 严格等价。',
    params: [
      { id: 'gamma', label: '草稿前瞻连猜步数 γ', unit: 'Tokens', min: 2, max: 10, step: 1, defaultValue: 5, desc: '小模型每次连续猜测的词元数' },
      { id: 'alpha', label: '草稿 Token 平均接受率 α', unit: '', min: 0.4, max: 0.95, step: 0.05, defaultValue: 0.8, desc: 'q(x) 与 p(x) 的分布重合度' },
      { id: 'costRatio', label: '草稿/目标模型单步耗时比 c', unit: '', min: 0.01, max: 0.15, step: 0.01, defaultValue: 0.04, desc: '如 1B 草稿 vs 70B 目标模型 c≈0.03' }
    ],
    compute: (v) => {
      const expectedTokens = (1 - Math.pow(v.alpha, v.gamma + 1)) / (1 - v.alpha);
      const stepTimeRatio = 1 + v.gamma * v.costRatio;
      const speedup = expectedTokens / stepTimeRatio;
      return {
        metrics: [
          { label: '单轮大模型验证期望产出', value: `${expectedTokens.toFixed(2)} Tokens`, subtext: `保底 1 个，最高可一次出 ${v.gamma + 1} 个`, highlight: true },
          { label: '端到端真实挂钟加速比', value: `${speedup.toFixed(2)}x 提速`, subtext: `扣除草稿耗时 ${Math.round(v.gamma * v.costRatio * 100)}% 后净加速`, highlight: true },
          { label: '输出概率分布保真度', value: '100% 严格无损', subtext: '数学证明与纯大模型逐字采样完全同分布' },
          { label: 'GPU 算术强度提升', value: `${(v.gamma + 1)}x 批并行验证`, subtext: '充分利用解码阶段闲置的算力单元' }
        ],
        bars: [
          { name: '每秒生成 Token 速度 (Tokens/s, 越高越好)', baselineLabel: '标准自回归逐字解码 (1 Token/Pass)', baselineVal: Math.round(100 / speedup), ourLabel: `投机解码 (γ=${v.gamma}, α=${v.alpha})`, ourVal: 100, unit: '%' },
          { name: '算术单元 Tensor Core 有效利用率', baselineLabel: '单 Token 访存受限解码', baselineVal: 18, ourLabel: `${v.gamma + 1} Tokens 并行前向校验`, ourVal: 86, unit: '%' }
        ],
        liveVerdictZh: `当草稿接受率 α=${v.alpha}、连猜步数 γ=${v.gamma} 时，大模型仅需执行 1 次前向传播即可平均产出 ${expectedTokens.toFixed(2)} 个精确 Token；扣除草稿小模型 ${Math.round(v.gamma * v.costRatio * 100)}% 的极小开销后，实现 ${speedup.toFixed(2)} 倍无损加速！`,
        stepTrace: [
          { stepTitle: '1. 草稿模型轻量快猜 γ 步', detail: `小模型连续生成 x₁, ..., x_γ 并记录草稿概率 q(x_i)`, status: `耗时仅 ${(v.gamma * v.costRatio).toFixed(2)}T` },
          { stepTitle: '2. 目标大模型单次并行校验', detail: `将 γ 个草稿拼接一次性送入大模型，1 次前向同时算出 γ+1 个位置的 p(x)`, status: '1 次 HBM 权重读取' },
          { stepTitle: '3. 修正拒绝采样兜底', detail: `以 min(1, p/q) 接受前缀；首个被拒处从 norm(max(0, p-q)) 重采样 1 个新词`, status: '分布 100% 等价' }
        ]
      };
    }
  },

  'gptq-2022': {
    paperId: 'gptq-2022',
    titleZh: 'GPTQ 二阶海森逆矩阵误差补偿量化与 AWQ 通道保护实验台',
    badgeZh: 'ICLR 2023 · 单机 4-bit 大模型部署基石',
    descriptionZh:
      '调节目标量化位宽（8-bit / 4-bit / 3-bit）、Cholesky 分块大小 B_block 与激活显著通道保护比例（AWQ 联动视角），对比朴素四舍五入量化（RTN）与 GPTQ 二阶 Hessian 逆矩阵逐列误差补偿的困惑度（PPL）损失与显存加速比。',
    formulaLatex:
      '\\delta_q = -\\frac{w_q - \\text{quant}(w_q)}{[\\mathbf{H}_F^{-1}]_{qq}} \\cdot (\\mathbf{H}_F^{-1})_{:, q}, \\quad \\mathbf{H} = 2\\mathbf{X}_F \\mathbf{X}_F^T',
    formulaDescZh:
      '量化第 q 列权重产生截断误差时，利用校准集输入协方差海森逆矩阵 H⁻¹ 的相关性，立即将误差精确分摊补偿至尚未量化的后续列权重上。',
    params: [
      { id: 'bits', label: '目标权重量化位宽', unit: 'bits', min: 3, max: 8, step: 1, defaultValue: 4, desc: '工业界主流为 4-bit (INT4) 或 3-bit' },
      { id: 'lazyBlock', label: 'Lazy Batch 更新块大小 B', unit: '列', min: 32, max: 256, step: 32, defaultValue: 128, desc: '聚合 128 列矩阵更新以提升 GPU 算术强度' },
      { id: 'salientProtect', label: 'AWQ 显著激活通道缩放保护', unit: '%', min: 0, max: 2, step: 0.5, defaultValue: 1.0, desc: '保护 1% 对应大幅值激活的权重通道' }
    ],
    compute: (v) => {
      const compressionRatio = 16 / v.bits;
      const model175BMemGB = (175 * v.bits * 1.05) / 8;
      const rtnPplDelta = v.bits === 4 ? 4.8 : v.bits === 3 ? 42.0 : 0.2;
      const gptqPplDelta = v.bits === 4 ? 0.12 : v.bits === 3 ? 0.65 : 0.02;
      const finalPplDelta = Math.max(0.01, gptqPplDelta * (1 - v.salientProtect * 0.25));
      return {
        metrics: [
          { label: '175B 模型量化后权重体积', value: `${model175BMemGB.toFixed(1)} GB`, subtext: `FP16 原始需 350GB (压缩 ${compressionRatio.toFixed(1)}x)`, highlight: true },
          { label: '朴素四舍五入 (RTN) PPL 暴涨', value: `+${rtnPplDelta.toFixed(2)} PPL`, subtext: v.bits <= 4 ? '精度严重崩塌无法上线' : '轻微损失', highlight: false },
          { label: 'GPTQ 二阶补偿后 PPL 变化', value: `+${finalPplDelta.toFixed(2)} PPL`, subtext: '几乎无损保持 FP16 原始推理质量', highlight: true },
          { label: '单 Token 访存带宽加速比', value: `${(compressionRatio * 0.82).toFixed(2)}x 提速`, subtext: '消除权重读取 Memory-Bound 瓶颈' }
        ],
        bars: [
          { name: `${v.bits}-bit 量化后语言模型精度保持率 (%)`, baselineLabel: 'RTN 朴素最近邻取整', baselineVal: Math.max(15, Math.round(100 - rtnPplDelta * 2)), ourLabel: 'GPTQ 二阶海森补偿 (+AWQ)', ourVal: Math.round(100 - finalPplDelta * 4), unit: '%' },
          { name: '175B 模型推理所需 80GB GPU 卡数 (越少越好)', baselineLabel: 'FP16 需 5~8 张 80GB 卡', baselineVal: 80, ourLabel: `GPTQ ${v.bits}-bit 仅需 1~2 张卡`, ourVal: Math.round(80 / compressionRatio), unit: '%', lowerIsBetter: true }
        ],
        liveVerdictZh: `将 175B 模型压至 ${v.bits}-bit 时，朴素取整（RTN）会导致困惑度恶化 +${rtnPplDelta.toFixed(2)}；而 GPTQ 利用 H⁻¹= (2XX^T)⁻¹ 将每列量化误差实时补偿给未量化列，将 PPL 损失压至仅 +${finalPplDelta.toFixed(2)}，显存从 350GB 骤降至 ${model175BMemGB.toFixed(1)}GB！`,
        stepTrace: [
          { stepTitle: '1. 计算二阶海森逆矩阵 H⁻¹', detail: `利用 128 条校准文本计算输入协方差 H = 2XX^T，并执行 Cholesky 稳定分解`, status: '防数值奇异' },
          { stepTitle: '2. 逐列量化与 Lazy-Batch 补偿', detail: `每 ${v.lazyBlock} 列打包在 GPU L2 缓存内更新，把已量化列的误差分摊到右侧未量化权重`, status: '单次 4 GPU时完成' },
          { stepTitle: '3. 1% 显著激活通道协同保护 (AWQ)', detail: `按输入激活幅值 |X| 对最重要的 ${v.salientProtect}% 通道施加等价缩放保护`, status: `PPL +${finalPplDelta.toFixed(2)}` }
        ]
      };
    }
  },

  'deepseek-v2-2024': {
    paperId: 'deepseek-v2-2024',
    titleZh: 'DeepSeek-V2 多头潜在注意力 (MLA) 低秩 KV 压缩与 MoE 路由实验台',
    badgeZh: 'arXiv:2405.04434 · 开源大模型架构分水岭',
    descriptionZh:
      '调节注意力头数 n_h、每头维度 d_h、MLA 潜在压缩维度 d_c 以及 DeepSeekMoE 激活专家比例，实时计算 MLA 相比标准 MHA / GQA 的 KV Cache 显存削减率（93.3%）与矩阵吸收（Matrix Absorption）零解压开销原理。',
    formulaLatex:
      '\\mathbf{c}_t^{KV} = W^{DKV}\\mathbf{h}_t \\in \\mathbb{R}^{d_c}, \\quad \\mathbf{q}_t^C k_i^{C, T} = (\\mathbf{q}_t^C W^{UK}) \\mathbf{c}_i^{KV, T} \\quad (d_c \\ll n_h d_h)',
    formulaDescZh:
      '不缓存庞大的多头 K 和 V，只缓存极低维的联合潜在向量 c_t^{KV}（512维）与解耦旋转位置向量 k_t^R（64维）；推理时将上投影矩阵 W^{UK} 直接吸收进 W^Q，无需显式解压 KV！',
    params: [
      { id: 'numHeads', label: '注意力头数 n_h', unit: '头', min: 32, max: 128, step: 32, defaultValue: 128, desc: 'DeepSeek-V2 标准为 128 头' },
      { id: 'latentDim', label: 'KV 潜在压缩维度 d_c', unit: '维', min: 256, max: 1024, step: 128, defaultValue: 512, desc: 'DeepSeek-V2 设定 d_c = 512' },
      { id: 'ropeDim', label: '解耦 RoPE 维度 d_h^R', unit: '维', min: 32, max: 128, step: 32, defaultValue: 64, desc: '单头共享的旋转位置向量维度' }
    ],
    compute: (v) => {
      const mhaElementsPerToken = 2 * v.numHeads * 128; // K and V
      const mlaElementsPerToken = v.latentDim + v.ropeDim;
      const kvReductionPct = (1 - mlaElementsPerToken / mhaElementsPerToken) * 100;
      const eqGqaGroups = (mlaElementsPerToken / (2 * 128)).toFixed(2);
      return {
        metrics: [
          { label: '标准 MHA 每 Token 缓存元素', value: `${mhaElementsPerToken} 维`, subtext: `2 × ${v.numHeads}头 × 128维`, highlight: false },
          { label: 'MLA 每 Token 仅需缓存', value: `${mlaElementsPerToken} 维`, subtext: `c_t^{KV}(${v.latentDim}) + k_t^R(${v.ropeDim})`, highlight: true },
          { label: 'KV Cache 显存压缩率', value: `削减 ${kvReductionPct.toFixed(1)}%`, subtext: `等效于仅 ${eqGqaGroups} 组的 GQA，但精度反超 MHA！`, highlight: true },
          { label: 'MoE 稀疏激活比 (236B 总参)', value: '仅激活 21B / Token', subtext: '训练成本降 42.5%，生成吞吐提升 5.76 倍' }
        ],
        bars: [
          { name: '单 Token KV Cache 显存占用 (越低越好)', baselineLabel: '标准多头注意力 MHA (100%)', baselineVal: 100, ourLabel: `DeepSeek-V2 MLA (${(100 - kvReductionPct).toFixed(1)}%)`, ourVal: Math.max(4, Math.round(100 - kvReductionPct)), unit: '%', lowerIsBetter: true },
          { name: '长上下文极限并发生成吞吐 (相对得分)', baselineLabel: 'DeepSeek 67B Dense (MHA)', baselineVal: 17, ourLabel: 'DeepSeek-V2 236B (MLA + MoE)', ourVal: 100, unit: '%' }
        ],
        liveVerdictZh: `在 ${v.numHeads} 头注意力下，标准 MHA 每个 Token 需缓存 ${mhaElementsPerToken} 个浮点数，而 MLA 仅需缓存 ${v.latentDim} 维潜在向量 + ${v.ropeDim} 维解耦 RoPE 向量（共 ${mlaElementsPerToken} 维），KV Cache 暴降 ${kvReductionPct.toFixed(1)}%，同时由于矩阵结合律吸收了上投影矩阵，推理时完全不需要把 KV 解压回高维！`,
        stepTrace: [
          { stepTitle: '1. 联合低秩压缩 c_t^{KV}', detail: `将隐状态 h_t 线性下投影为 ${v.latentDim} 维紧凑潜向量存入 KV Cache`, status: `省 ${kvReductionPct.toFixed(1)}% 显存` },
          { stepTitle: '2. 解耦 RoPE 破解矩阵吸收冲突', detail: `若对压缩后的 K 直接加 RoPE 会阻断 W^{UK} 与 W^Q 合并；故单独分出 ${v.ropeDim} 维共享位置向量 k_t^R`, status: '支持算子吸收' },
          { stepTitle: '3. 细粒度共享专家 + 路由专家 MoE', detail: `2 个常驻共享专家捕获通用知识 + 从 160 个细粒度专家中路由 Top-6 专攻细分语义`, status: '激活 21B/236B' }
        ]
      };
    }
  },

  'rlhf-2017': {
    paperId: 'rlhf-2017',
    titleZh: 'RLHF 奠基：人类成对偏好 Bradley-Terry 奖励建模实验台',
    badgeZh: 'NeurIPS 2017 · 人类反馈强化学习起点',
    descriptionZh:
      '调节轨迹片段 A 与片段 B 的潜在奖励估计值 r̂(σ¹)、r̂(σ²)、人类标注员一致性系数与集成模型方差，实时计算 Bradley-Terry 成对胜率 P(σ¹ ≻ σ²) 与偏好交叉熵损失。',
    formulaLatex:
      '\\hat{P}[\\sigma^1 \\succ \\sigma^2] = \\frac{\\exp\\left(\\sum_t \\hat{r}(o_t^1, a_t^1)\\right)}{\\exp\\left(\\sum_t \\hat{r}(o_t^1, a_t^1)\\right) + \\exp\\left(\\sum_t \\hat{r}(o_t^2, a_t^2)\\right)} = \\sigma(\\hat{R}_1 - \\hat{R}_2)',
    formulaDescZh:
      '人类很难给复杂行为打出绝对标量分数，但极易判断“A 和 B 哪个更好”；通过 Bradley-Terry 模型将成对偏好看作二分类问题，即可从几百次人类比较中倒推出连续奖励函数 r̂。',
    params: [
      { id: 'rewardA', label: '轨迹 A 累计预测奖励 R̂(σ¹)', unit: '', min: -3.0, max: 5.0, step: 0.2, defaultValue: 2.4, desc: '人类更偏好的优质行为轨迹' },
      { id: 'rewardB', label: '轨迹 B 累计预测奖励 R̂(σ²)', unit: '', min: -3.0, max: 5.0, step: 0.2, defaultValue: -0.6, desc: '次优或投机取巧的行为轨迹' },
      { id: 'noiseRate', label: '人类标注随机误判率 ε', unit: '%', min: 0, max: 20, step: 2, defaultValue: 10, desc: '容忍人类标注员 10% 的偶发手滑' }
    ],
    compute: (v) => {
      const diff = v.rewardA - v.rewardB;
      const rawProb = 1 / (1 + Math.exp(-diff));
      const robustProb = (1 - v.noiseRate / 100) * rawProb + (v.noiseRate / 100) * 0.5;
      const loss = -Math.log(Math.max(1e-6, robustProb));
      return {
        metrics: [
          { label: '奖励差值边际 ΔR̂ = R̂₁ - R̂₂', value: `${diff >= 0 ? '+' : ''}${diff.toFixed(2)}`, subtext: '决定 Sigmoid 偏好陡峭度', highlight: true },
          { label: 'Bradley-Terry 预测胜率 P(σ¹≻σ²)', value: `${(rawProb * 100).toFixed(1)}%`, subtext: `含 ${v.noiseRate}% 噪声鲁棒修正后 ${(robustProb * 100).toFixed(1)}%`, highlight: true },
          { label: '当前偏好对交叉熵损失 L(r̂)', value: `${loss.toFixed(3)} nats`, subtext: '驱动奖励网络拉开正负样本分差' },
          { label: '所需人类反馈标注量', value: '< 1% 环境交互步数', subtext: '仅需 ~900 次比较即可学会后空翻' }
        ],
        bars: [
          { name: '防止强化学习“奖励黑客 (Reward Hacking)”能力', baselineLabel: '手写标量奖励函数 (极易钻空子)', baselineVal: 28, ourLabel: '人类成对偏好在线纠偏 (RLHF)', ourVal: 95, unit: '分' },
          { name: '复杂无规则任务（如体操后空翻/对话）对齐度', baselineLabel: '传统示范模仿学习', baselineVal: 45, ourLabel: '成对比较奖励建模 + RL', ourVal: 94, unit: '%' }
        ],
        liveVerdictZh: `当优质轨迹 σ¹ 与劣质轨迹 σ² 的累计奖励差为 ΔR̂=${diff.toFixed(2)} 时，Bradley-Terry 胜率达到 ${(rawProb * 100).toFixed(1)}%，交叉熵损失为 ${loss.toFixed(3)}。这套将「人类二选一比较」转化为「可微奖励函数」的数学框架，成为了后来 InstructGPT 与 ChatGPT 的直接基石！`,
        stepTrace: [
          { stepTitle: '1. 不确定性驱动主动采样', detail: `集成多个奖励网络，优先挑选预测分歧最大的轨迹对 (σ¹, σ²) 请人类做二选一`, status: '高信息增益' },
          { stepTitle: '2. Bradley-Terry 拟合奖励模型', detail: `最小化人类标签 μ 与预测胜率 σ(R̂₁ - R̂₂) 的交叉熵损失`, status: `Loss=${loss.toFixed(2)}` },
          { stepTitle: '3. 策略梯度闭环迭代', detail: `用实时更新的 r̂ 训练策略 π，持续拦截模型新出现的投机取巧行为`, status: '对齐人类意图' }
        ]
      };
    }
  },

  'instructgpt-2022': {
    paperId: 'instructgpt-2022',
    titleZh: 'InstructGPT 三阶段对齐 (SFT → RM → PPO-ptx) 目标函数实验台',
    badgeZh: 'NeurIPS 2022 · ChatGPT 诞生原论文',
    descriptionZh:
      '调节奖励模型打分 r_θ(x,y)、策略偏离 SFT 参考模型的 KL 散度、KL 惩罚系数 β 与预训练梯度混合系数 γ（PPO-ptx），实时观测 InstructGPT 如何在最大化人类偏好的同时防止模型坍缩与“对齐税（Alignment Tax）”。',
    formulaLatex:
      '\\text{objective}(\\phi) = \\mathbb{E}_{(x,y)\\sim D_{\\pi_\\phi}}\\left[r_\\theta(x,y) - \\beta \\log\\frac{\\pi_\\phi^{\\text{RL}}(y|x)}{\\pi^{\\text{SFT}}(y|x)}\\right] + \\gamma \\mathbb{E}_{x\\sim D_{\\text{pretrain}}}[\\log \\pi_\\phi^{\\text{RL}}(x)]',
    formulaDescZh:
      '通过三步法（监督微调 SFT → 单次前向 K=9 成对排序奖励模型 RM → 带 KL 散度约束与预训练损失混合的 PPO-ptx），让 1.3B 模型的真实人类偏好胜率击败 175B 原始 GPT-3！',
    params: [
      { id: 'rmScore', label: '奖励模型原始打分 r_θ(x,y)', unit: '', min: -2.0, max: 5.0, step: 0.2, defaultValue: 3.2, desc: 'RM 对当前回复质量的评价' },
      { id: 'klDiv', label: '当前策略与 SFT 的 KL 散度', unit: 'nats', min: 0.5, max: 25.0, step: 0.5, defaultValue: 6.0, desc: '偏离度过大说明在钻 RM 空子' },
      { id: 'beta', label: 'KL 惩罚系数 β', unit: '', min: 0.0, max: 0.2, step: 0.01, defaultValue: 0.02, desc: '論文标准 β = 0.02' },
      { id: 'gammaPtx', label: '预训练混合系数 γ (PPO-ptx)', unit: '', min: 0, max: 30, step: 2, defaultValue: 27, desc: '抵消公用 NLP 基准性能退化(对齐税)' }
    ],
    compute: (v) => {
      const klPenalty = v.beta * v.klDiv;
      const effectiveReward = v.rmScore - klPenalty;
      const alignmentTaxRetention = Math.min(100, 82 + (v.gammaPtx / 30) * 18);
      const rewardHackingRisk = v.beta < 0.005 && v.klDiv > 12 ? '⚠️ 极高 (过度优化 RM)' : '✅ 安全受控';
      return {
        metrics: [
          { label: 'KL 正则化惩罚项 -β·D_KL', value: `-${klPenalty.toFixed(3)}`, subtext: `状态：${rewardHackingRisk}`, highlight: false },
          { label: 'PPO 净优化目标信号 R_total', value: `${effectiveReward.toFixed(3)}`, subtext: `r_θ(${v.rmScore}) - β·KL(${klPenalty.toFixed(2)})`, highlight: true },
          { label: '通用能力保持率 (抗对齐税)', value: `${alignmentTaxRetention.toFixed(1)}%`, subtext: `依靠 γ=${v.gammaPtx} 预训练梯度回注`, highlight: true },
          { label: '1.3B InstructGPT vs 175B GPT-3 胜率', value: '85% 人类更偏好 1.3B', subtext: '参数缩小 100 倍，体验反超' }
        ],
        bars: [
          { name: '人类评估员综合偏好胜率 (%)', baselineLabel: '原始 GPT-3 175B (无对齐)', baselineVal: 15, ourLabel: 'InstructGPT (SFT+RM+PPO-ptx)', ourVal: 85, unit: '%' },
          { name: 'TruthfulQA 真实性与抗幻觉率 (%)', baselineLabel: 'GPT-3 175B 基座', baselineVal: 29, ourLabel: 'InstructGPT 175B', ourVal: 62, unit: '%' }
        ],
        liveVerdictZh: `当前回复获得 RM 打分 ${v.rmScore.toFixed(1)}，扣除 β·KL 惩罚（-${klPenalty.toFixed(2)}）后净奖励为 ${effectiveReward.toFixed(2)}；同时混合系数 γ=${v.gammaPtx} 将通用知识保持率稳定在 ${alignmentTaxRetention.toFixed(1)}%，完美消除“对齐税”！`,
        stepTrace: [
          { stepTitle: 'Stage 1: 监督微调 (SFT)', detail: `采集 1.3 万条高质量人工示范指令，微调 GPT-3 初步学会对话格式`, status: '行为克隆初始化' },
          { stepTitle: 'Stage 2: K=9 同批排序奖励模型 (RM)', detail: `每个 Prompt 一次生成 K=9 个回复由人类排序，单次前向计算 C(9,2)=36 对偏好损失`, status: '防过拟合提速' },
          { stepTitle: 'Stage 3: PPO-ptx 强化微调', detail: `最大化 r_θ - β·KL 并混入预训练对数似然 γ·E[log π(x)]`, status: `净收益 ${effectiveReward.toFixed(2)}` }
        ]
      };
    }
  },

  'dpo-2023': {
    paperId: 'dpo-2023',
    titleZh: 'DPO 直接偏好优化：隐式奖励边际与梯度权重实验台',
    badgeZh: 'NeurIPS 2023 · 免奖励模型与免 PPO 标准',
    descriptionZh:
      '调节正样本（Chosen y_w）与负样本（Rejected y_l）相对于参考策略的对数概率比，以及温度系数 β，实时计算 DPO 隐式奖励 r(x,y) = β log(π_θ / π_ref)、偏好边际与动态梯度权重 σ(r̂_l - r̂_w)。',
    formulaLatex:
      '\\mathcal{L}_{\\text{DPO}}(\\pi_\\theta; \\pi_{\\text{ref}}) = -\\mathbb{E}_{(x, y_w, y_l)}\\left[\\log \\sigma\\left(\\beta \\log \\frac{\\pi_\\theta(y_w|x)}{\\pi_{\\text{ref}}(y_w|x)} - \\beta \\log \\frac{\\pi_\\theta(y_l|x)}{\\pi_{\\text{ref}}(y_l|x)}\\right)\\right]',
    formulaDescZh:
      '利用 KL 约束奖励最大化的解析解 π*(y|x) ∝ π_ref(y|x)exp(r/β)，做变量代换将奖励函数直接表示为策略概率比的对数，从而用一行二元交叉熵完全取代奖励模型训练与 PPO 强化学习！',
    params: [
      { id: 'logRatioW', label: '胜出回复对数比 log(π_θ(y_w)/π_ref)', unit: '', min: -2.0, max: 3.0, step: 0.1, defaultValue: 1.2, desc: '当前模型对好回答的相对提权幅度' },
      { id: 'logRatioL', label: '落败回复对数比 log(π_θ(y_l)/π_ref)', unit: '', min: -3.0, max: 2.0, step: 0.1, defaultValue: -1.4, desc: '当前模型对坏回答的相对压制幅度' },
      { id: 'beta', label: 'KL 温度系数 β', unit: '', min: 0.05, max: 0.5, step: 0.05, defaultValue: 0.1, desc: '通常设为 0.1 ~ 0.5' }
    ],
    compute: (v) => {
      const rW = v.beta * v.logRatioW;
      const rL = v.beta * v.logRatioL;
      const margin = rW - rL;
      const winProb = 1 / (1 + Math.exp(-margin));
      const gradWeight = 1 / (1 + Math.exp(margin)); // sigma(r_l - r_w)
      const loss = -Math.log(Math.max(1e-6, winProb));
      return {
        metrics: [
          { label: '正样本隐式奖励 r̂(x, y_w)', value: `${rW >= 0 ? '+' : ''}${rW.toFixed(3)}`, subtext: `负样本隐式奖励 r̂(x, y_l) = ${rL.toFixed(3)}`, highlight: true },
          { label: '隐式奖励边际 Δr̂ = r̂_w - r̂_l', value: `${margin >= 0 ? '+' : ''}${margin.toFixed(3)}`, subtext: `偏好正确率 σ(Δr̂) = ${(winProb * 100).toFixed(1)}%`, highlight: true },
          { label: '自适应错例梯度权重 σ(r̂_l - r̂_w)', value: `${(gradWeight * 100).toFixed(1)}%`, subtext: '模型排错越离谱，梯度修正力越强！', highlight: true },
          { label: '同时驻留显存模型个数', value: '仅 2 个 (Policy+Ref)', subtext: 'PPO 需同时驻留 4 个大模型 (Actor/Critic/RM/Ref)' }
        ],
        bars: [
          { name: '偏好对齐与 KL 散度前沿控制质量 (得分)', baselineLabel: 'PPO 强化学习 (调参极不稳定)', baselineVal: 74, ourLabel: 'DPO 直接偏好解析优化', ourVal: 96, unit: '分' },
          { name: '后训练 GPU 显存与算力开销 (越低越好)', baselineLabel: 'PPO 四模型在线采样训练', baselineVal: 100, ourLabel: 'DPO 离线分类损失微调', ourVal: 38, unit: '%', lowerIsBetter: true }
        ],
        liveVerdictZh: `你的语言模型本身就是一个秘密的奖励模型！当前正负样本隐式奖励差 Δr̂=${margin.toFixed(3)}，DPO 自动赋予该样本 ${(gradWeight * 100).toFixed(1)}% 的动态梯度权重（论文核心定理：若省去该权重，语言模型会迅速退化坍缩），无需训练独立 RM 也无需在线采样即可求得与 RLHF 完全一致的最优策略！`,
        stepTrace: [
          { stepTitle: '1. 解析反解奖励函数 r(x,y)', detail: `由最优策略公式反解出 r(x,y) = β log(π_θ/π_ref) + β log Z(x)`, status: '消去配分函数 Z(x)' },
          { stepTitle: '2. 代入 Bradley-Terry 偏好目标', detail: `配分函数 Z(x) 在 r(x,y_w) - r(x,y_l) 相减时完美抵消！`, status: `Δr̂ = ${margin.toFixed(3)}` },
          { stepTitle: '3. 隐式错例加权梯度更新', detail: `梯度自动乘以 σ(r̂_l - r̂_w)=${gradWeight.toFixed(2)}，优先拉高被错误低估的正样本`, status: `Loss=${loss.toFixed(3)}` }
        ]
      };
    }
  },

  'constitutional-ai-2022': {
    paperId: 'constitutional-ai-2022',
    titleZh: 'Constitutional AI (CAI) 宪法自我批判修正与 RLAIF 实验台',
    badgeZh: 'Anthropic 2022 · 零人工无害化标注范式',
    descriptionZh:
      '调节宪法原则（Constitution）迭代修正轮数 k、思维链（CoT）推理开关与 RLAIF 软标签温度，实时观测模型如何在不依赖任何人工有害标签的情况下，摆脱“万事拒答（规避型无害）”并实现既有用又无害（Helpful & Harmless）的帕累托跃升。',
    formulaLatex:
      'y^{(0)} \\xrightarrow{\\text{Critique}(c_1)} \\xrightarrow{\\text{Revise}} y^{(1)} \\cdots \\xrightarrow{\\text{Revise}} y^{(k)} \\;(\\text{SL-CAI}) \\;\\longrightarrow\\; p_{\\text{AI}}(y_1 \\succ y_2 \\mid x, C_{\\text{const}}) \\;(\\text{RLAIF})',
    formulaDescZh:
      '第一阶段（SL-CAI）：模型根据自然语言宪法条目自我批评并改写有害初稿；第二阶段（RLAIF）：由 AI 根据宪法对比打分训练偏好模型，彻底取代昂贵且有心理创伤的人工红队标注。',
    params: [
      { id: 'reviseSteps', label: 'SL-CAI 自我批判改写轮数 k', unit: '轮', min: 1, max: 4, step: 1, defaultValue: 2, desc: '每多一轮自我批评，有害率进一步下降' },
      { id: 'useCot', label: '启用 RLAIF 思维链判别 (CoT)', unit: '开关', min: 0, max: 1, step: 1, defaultValue: 1, desc: '先写出宪法分析理由再输出偏好概率' },
      { id: 'numPrinciples', label: '激活宪法原则条目数', unit: '条', min: 4, max: 16, step: 4, defaultValue: 16, desc: '涵盖反歧视、防欺诈、不盲目拒答等原则' }
    ],
    compute: (v) => {
      const harmlessScore = Math.min(96, 62 + v.reviseSteps * 8 + (v.useCot ? 10 : 0) + v.numPrinciples * 0.5);
      const helpfulScore = Math.min(94, 78 + (v.numPrinciples >= 12 ? 12 : 4));
      const evasivenessRate = Math.max(4, 38 - v.numPrinciples * 1.8 - (v.useCot ? 5 : 0));
      return {
        metrics: [
          { label: '无害性 ELO 综合评分', value: `${harmlessScore.toFixed(0)} 分`, subtext: `经 ${v.reviseSteps} 轮自我批判修正 + RLAIF`, highlight: true },
          { label: '有用性 ELO 综合评分', value: `${helpfulScore.toFixed(0)} 分`, subtext: '克服传统 RLHF 动辄拒绝回答的毛病', highlight: true },
          { label: '过度敏感拒答率 (Evasiveness)', value: `仅 ${evasivenessRate.toFixed(1)}%`, subtext: '传统人工 HH RLHF 拒答率高达 35%+' },
          { label: '所需人工标注无害样本数', value: '0 条 (100% RLAIF)', subtext: '仅靠 16 条自然语言宪法原则驱动' }
        ],
        bars: [
          { name: '无害性 vs 不盲目拒答综合表征得分 (%)', baselineLabel: '传统人工标注 RLHF (易变呆板拒答)', baselineVal: 68, ourLabel: 'Constitutional AI (RLAIF)', ourVal: Math.round((harmlessScore + helpfulScore) / 2), unit: '%' },
          { name: '安全对齐规则更新迭代速度 (相对得分)', baselineLabel: '重新雇人标注数万条样本 (数周)', baselineVal: 15, ourLabel: '直接修改几行自然语言宪法 (即改即生效)', ourVal: 98, unit: '分' }
        ],
        liveVerdictZh: `通过 ${v.numPrinciples} 条自然语言宪法原则与 ${v.reviseSteps} 轮「自我批评 → 自我改写」，配合${v.useCot ? '开启 CoT 思维链校准的 ' : ''}RLAIF 阶段，模型在实现 ${harmlessScore.toFixed(0)} 分高安全性的同时，将过度拒答率压低至 ${evasivenessRate.toFixed(1)}%，真正做到解释清楚风险而非生硬回绝！`,
        stepTrace: [
          { stepTitle: '1. 红队诱导与自我批判 (Critique)', detail: `先让模型暴露有害初稿 y⁽⁰⁾，再抽取一条宪法原则让模型自己指出 y⁽⁰⁾ 错在哪里`, status: '自我诊断' },
          { stepTitle: '2. 多轮迭代修正 (Revision → SL-CAI)', detail: `经过 k=${v.reviseSteps} 轮改写生成礼貌、客观且不敷衍的修订回复 y⁽ᵏ⁾ 并用于监督微调`, status: `拒答率 ${evasivenessRate.toFixed(0)}%` },
          { stepTitle: '3. RLAIF 软概率偏好训练', detail: `由反馈模型输出 [A]/[B] 归一化概率作为软标签训练奖励模型，主导后续 RL 对齐`, status: '0 人工无害标签' }
        ]
      };
    }
  },

  'react-2022': {
    paperId: 'react-2022',
    titleZh: 'ReAct (Reasoning + Acting) 思考-行动-观察交织智能体实验台',
    badgeZh: 'ICLR 2023 · 现代 AI Agent 循环标准范式',
    descriptionZh:
      '调节外部知识工具检索步数上限、推理思考（Thought）密度以及回退自愈策略，对比纯思维链（CoT：闭门造车易产生事实幻觉）与纯行动智能体（Act-Only：盲目试错缺乏规划）在多跳问答（HotpotQA）与交互环境（ALFWorld）中的任务成功率与幻觉率。',
    formulaLatex:
      'c_{t} = (o_1, a_1, \\dots, o_{t-1}, a_{t-1}, o_t), \\quad \\pi(a_t \\mid c_t) \\;\\xrightarrow{\\text{ReAct}}\\ && \\text{Thought } \\hat{a}_t \\in \\mathcal{L} \\;\\longrightarrow\\; \\text{Action } a_t \\in \\mathcal{A} \\;\\longrightarrow\\; \\text{Observation } o_{t+1}',
    formulaDescZh:
      '将离散外部动作空间 A 扩展为包含自然语言推理轨迹 L 的联合空间 Â = A ∪ L；内部 Thought 负责拆解目标与制定计划，外部 Action 负责获取真实环境反馈 O 以锚定事实。',
    params: [
      { id: 'maxSteps', label: '交织循环最大步数 T', unit: '步', min: 2, max: 8, step: 1, defaultValue: 5, desc: 'Thought → Action → Observation 循环次数' },
      { id: 'thoughtRatio', label: '每步动作前启用显式 Thought', unit: '开关', min: 0, max: 1, step: 1, defaultValue: 1, desc: '0 为 Act-Only，1 为完整 ReAct' },
      { id: 'envFeedback', label: '启用外部环境/维基 Observation', unit: '开关', min: 0, max: 1, step: 1, defaultValue: 1, desc: '0 为纯内部 CoT，1 为完整 ReAct' }
    ],
    compute: (v) => {
      let hallucinationRate = 14;
      let alfworldSuccess = 34;
      let modeLabel = '完整 ReAct (推理+行动协同)';
      if (v.thoughtRatio === 1 && v.envFeedback === 0) {
        hallucinationRate = 56;
        alfworldSuccess = 28;
        modeLabel = '仅 CoT (无外部 Observation 锚定)';
      } else if (v.thoughtRatio === 0 && v.envFeedback === 1) {
        hallucinationRate = 18;
        alfworldSuccess = 45;
        modeLabel = '仅 Act-Only (无内部 Thought 规划)';
      } else if (v.thoughtRatio === 1 && v.envFeedback === 1) {
        hallucinationRate = Math.max(6, 16 - v.maxSteps * 1.5);
        alfworldSuccess = Math.min(78.4, 58 + v.maxSteps * 3.5);
      } else {
        hallucinationRate = 68;
        alfworldSuccess = 12;
        modeLabel = '无推理且无工具 (Direct Prompt)';
      }

      return {
        metrics: [
          { label: '当前智能体运行模式', value: modeLabel.split(' ')[0] + ' ' + (modeLabel.split(' ')[1] || ''), subtext: modeLabel, highlight: true },
          { label: 'HotpotQA 推理链路事实幻觉率', value: `${hallucinationRate.toFixed(1)}%`, subtext: '纯 CoT 幻觉率高达 56.0%', highlight: true },
          { label: 'ALFWorld 具身交互成功率', value: `${alfworldSuccess.toFixed(1)}%`, subtext: '超越 Act-Only 基线 +34% 绝对提升', highlight: true },
          { label: '决策过程人类可解释性与可控性', value: v.thoughtRatio === 1 ? '100% 透明可干预' : '黑盒动作难排障', subtext: '可直接编辑 Thought 实时修正 Agent 行为' }
        ],
        bars: [
          { name: 'ALFWorld 交互决策任务成功率 (%)', baselineLabel: 'Act-Only 纯动作智能体 (45%)', baselineVal: 45, ourLabel: `当前配置 (${alfworldSuccess.toFixed(1)}%)`, ourVal: Math.round(alfworldSuccess), unit: '%' },
          { name: '事实真实性 (100 - 幻觉率 %)', baselineLabel: '纯 CoT 闭卷思维链 (44%)', baselineVal: 44, ourLabel: `当前配置 (${(100 - hallucinationRate).toFixed(0)}%)`, ourVal: Math.round(100 - hallucinationRate), unit: '%' }
        ],
        liveVerdictZh: `当前处于「${modeLabel}」：纯 CoT 虽会逻辑推演但因缺乏外部世界反馈，56% 的失败源于凭空编造事实；纯 Act 虽能调用工具但不会拆解子目标。ReAct 将 Thought 与 Action/Observation 紧密交织，把幻觉率压至 ${hallucinationRate.toFixed(1)}%，并将交互任务成功率拉升至 ${alfworldSuccess.toFixed(1)}%！`,
        stepTrace: [
          { stepTitle: 'Step 1 [Thought 思考规划]', detail: `分析问题缺口：“我需要先查出 Apple Remote 最初是为哪款软件设计的，再查它还能用什么控制”`, status: '任务拆解' },
          { stepTitle: 'Step 2 [Action 外部调用]', detail: `调用 Search["Apple Remote"] → 获取真实维基片段 Observation：“最初用于控制 Front Row 媒体程序...”`, status: '消除幻觉' },
          { stepTitle: 'Step 3 [Thought 动态重规划]', detail: `根据返回的 Observation 更新内部状态，并发起下一跳 Search["Front Row"] 锁定最终答案`, status: `成功率 ${alfworldSuccess.toFixed(1)}%` }
        ]
      };
    }
  },

  'deepseek-r1-2025': {
    paperId: 'deepseek-r1-2025',
    titleZh: 'DeepSeek-R1 组内相对策略优化 (GRPO) 与推理涌现实验台',
    badgeZh: 'arXiv:2501.12948 · 免 Critic 纯强化学习推理涌现',
    descriptionZh:
      '调节每个问题采样的组内回复数量 G、组内各采样轨迹的可验证规则得分 r_i 与思考长度，实时计算 GRPO 的组内归一化相对优势 A_i = (r_i - mean(r)) / std(r)，观察为何无需庞大的 Critic 价值网络即可涌现自我验证与反思（Aha Moment）。',
    formulaLatex:
      'A_i = \\frac{r_i - \\text{mean}(\\{r_1, r_2, \\dots, r_G\\})}{\\text{std}(\\{r_1, r_2, \\dots, r_G\\})}, \\quad \\mathcal{J}_{\\text{GRPO}}(\\theta) = \\frac{1}{G}\\sum_{i=1}^G \\min(\\rho_i A_i, \\text{clip}(\\rho_i)A_i) - \\beta \\mathbb{D}_{KL}',
    formulaDescZh:
      '彻底砍掉与策略模型同等大小的价值网络（Value/Critic Model），对同一题目采样 G 条推理链，直接用组内平均分作为基线算出相对优势 A_i，并仅凭“数学答案对错 + 格式标签”双规则奖励驱动强化学习。',
    params: [
      { id: 'groupSize', label: 'GRPO 组内并发采样数 G', unit: '条/题', min: 4, max: 64, step: 4, defaultValue: 16, desc: '同一道数学题并行生成的推理轨迹数' },
      { id: 'passRatio', label: '组内做对答案轨迹比例', unit: '%', min: 10, max: 90, step: 5, defaultValue: 25, desc: '验算器判定正确的样本占比' },
      { id: 'rlSteps', label: 'RL 强化训练推进进度', unit: '%', min: 10, max: 100, step: 10, defaultValue: 85, desc: '观察随训练步数增长的思维链自然伸长与 Aha 涌现' }
    ],
    compute: (v) => {
      const p = v.passRatio / 100;
      const meanR = p * 1.0 + (1 - p) * 0.0;
      const stdR = Math.sqrt(p * (1 - p)) + 1e-5;
      const posAdvantage = (1.0 - meanR) / stdR;
      const negAdvantage = (0.0 - meanR) / stdR;
      const aimeScore = 15.6 + (v.rlSteps / 100) * (79.8 - 15.6);
      const avgCotTokens = Math.round(450 + (v.rlSteps / 100) * 3800);

      return {
        metrics: [
          { label: '正确轨迹组内相对优势 A_pos', value: `+${posAdvantage.toFixed(2)} σ`, subtext: `错误轨迹惩罚优势 A_neg = ${negAdvantage.toFixed(2)} σ`, highlight: true },
          { label: 'Critic 价值网络显存开销', value: '0 GB (节省 50% RL 显存)', subtext: `由 G=${v.groupSize} 组内均值/标准差完全替代`, highlight: true },
          { label: 'AIME 2024 数学竞赛 Pass@1', value: `${aimeScore.toFixed(1)}%`, subtext: '从初态 15.6% 纯 RL 飙升至 79.8% (超 o1-0912)', highlight: true },
          { label: '自发演化平均思维链长度', value: `${avgCotTokens} Tokens`, subtext: '无需人工规定，模型自发学会回溯验算 (Aha Moment)' }
        ],
        bars: [
          { name: 'AIME 2024 权威数学推理准确率 (%)', baselineLabel: 'DeepSeek-V3 基座 (无RL, 39.2%)', baselineVal: 39, ourLabel: `DeepSeek-R1 (${aimeScore.toFixed(1)}%)`, ourVal: Math.round(aimeScore), unit: '%' },
          { name: '强化学习训练显存与工程精简度', baselineLabel: '传统 PPO + PRM 过程奖励模型', baselineVal: 45, ourLabel: 'GRPO + 纯可验证规则奖励', ourVal: 96, unit: '分' }
        ],
        liveVerdictZh: `在组大小 G=${v.groupSize}、正确率 ${v.passRatio}% 时，GRPO 无需训练任何 Critic 网络即可为正确推理链赋予 +${posAdvantage.toFixed(2)}σ 的强烈正向优势，为错误链赋予 ${negAdvantage.toFixed(2)}σ 负向抑制！随着 RL 推进至 ${v.rlSteps}%，模型自发涌现出“Wait, let me re-evaluate...”自我纠错行为，AIME 2024 准确率跃升至 ${aimeScore.toFixed(1)}%！`,
        stepTrace: [
          { stepTitle: '1. 摒弃 PRM 与 Critic 网络', detail: `仅使用确定性规则验算（数学答案匹配 + <think> 标签格式），彻底杜绝奖励黑客`, status: '零神经奖励欺骗' },
          { stepTitle: '2. GRPO 组内标准化优势计算', detail: `对 G=${v.groupSize} 条输出计算均值 ${meanR.toFixed(2)} 与标准差 ${stdR.toFixed(2)}，正样本优势 +${posAdvantage.toFixed(2)}`, status: '省去 Critic 显存' },
          { stepTitle: '3. 涌现自我反思与蒸馏赋能', detail: `长思维链能力涌现后，还可直接蒸馏赋予 7B/14B/32B 小模型超越同级 RL 的推理力`, status: `AIME ${aimeScore.toFixed(1)}%` }
        ]
      };
    }
  },

  'clip-2021': {
    paperId: 'clip-2021',
    titleZh: 'CLIP 4亿图文对对称对比学习 (InfoNCE) 与零样本分类实验台',
    badgeZh: 'ICML 2021 · 多模态视觉-语言对齐总基石',
    descriptionZh:
      '调节对比学习批大小 N（Batch Size）、可学习温度系数 τ 与提示词模板工程（Prompt Engineering Ensemble），实时计算 N×N 图文余弦相似度矩阵中正样本对 (I_i, T_i) 与 N²-N 个批内负样本对的 InfoNCE 对比约束强度及 ImageNet 零样本准确率。',
    formulaLatex:
      '\\mathcal{L}_{\\text{CLIP}} = -\\frac{1}{2N}\\sum_{i=1}^N \\left(\\log \\frac{\\exp(\\text{sim}(I_i, T_i)/\\tau)}{\\sum_{j=1}^N \\exp(\\text{sim}(I_i, T_j)/\\tau)} + \\log \\frac{\\exp(\\text{sim}(T_i, I_i)/\\tau)}{\\sum_{j=1}^N \\exp(\\text{sim}(T_i, I_j)/\\tau)}\\right)',
    formulaDescZh:
      '放弃预测固定 1000 类标签或逐字生成图注，改为在 32768 超大 Batch 内判断“哪段文本与哪张图配对”，一次性构造超 10 亿个负样本对，让视觉编码器直接习得开放世界自然语言概念！',
    params: [
      { id: 'batchN', label: '对比学习全局 Batch Size (N)', unit: '图文对', min: 1024, max: 32768, step: 1024, defaultValue: 32768, desc: 'CLIP 标准 N=32,768' },
      { id: 'tempInv', label: '可学习逆温度 1/τ (Logit Scale)', unit: '', min: 10, max: 100, step: 5, defaultValue: 65, desc: '放大余弦相似度差异，上限截断为 100' },
      { id: 'promptTemplates', label: '零样本提示词模板集成数', unit: '个模板', min: 1, max: 80, step: 1, defaultValue: 80, desc: '如 "A photo of a {label}" 等 80 种语境集成' }
    ],
    compute: (v) => {
      const negativePairs = v.batchN * v.batchN - v.batchN;
      const promptGain = v.promptTemplates === 1 ? 0 : Math.min(4.8, Math.log2(v.promptTemplates) * 0.76);
      const zeroShotAcc = Math.min(76.2, 68.5 + (v.batchN / 32768) * 2.9 + promptGain);
      return {
        metrics: [
          { label: '单步矩阵批内负样本对总数', value: `${(negativePairs / 1e6).toFixed(1)}M 对`, subtext: `N² - N (${v.batchN}×${v.batchN} 矩阵非对角元)`, highlight: true },
          { label: '提示词工程与集成增益', value: `+${promptGain.toFixed(1)}% Top-1`, subtext: '消除单单词多义性与预训练语境偏差', highlight: true },
          { label: 'ImageNet 零样本 Top-1 准确率', value: `${zeroShotAcc.toFixed(1)}%`, subtext: '0 张训练图追平全监督 ResNet-50 (76.2%)！', highlight: true },
          { label: '自然分布偏移 (ImageNet-R/A) 优势', value: '+25% ~ +55% 领先', subtext: '不死记硬背特定数据集纹理偏差' }
        ],
        bars: [
          { name: 'ImageNet-R (艺术/素描分布偏移) 泛化准确率 (%)', baselineLabel: '全监督 ResNet-50 (仅 36.1%)', baselineVal: 36, ourLabel: 'CLIP Zero-Shot (88.9%)', ourVal: 89, unit: '%' },
          { name: '从自然语言监督学习视觉表征的样本效率', baselineLabel: 'VirTex 逐词自回归生成图注', baselineVal: 25, ourLabel: 'CLIP 图像-文本对比学习 (4x~12x提速)', ourVal: 96, unit: '分' }
        ],
        liveVerdictZh: `在 Batch Size N=${v.batchN} 下，每次前向传播都在 ${v.batchN}×${v.batchN} 余弦矩阵中同时对 ${(negativePairs / 1e6).toFixed(1)} 百万个负样本对施加排斥力！配合 ${v.promptTemplates} 个零样本提示词模板集成，CLIP 在从未见过任何一张 ImageNet 训练图的情况下取得 ${zeroShotAcc.toFixed(1)}% 准确率！`,
        stepTrace: [
          { stepTitle: '1. 双塔编码与 L2 归一化投影', detail: `ViT 图像编码器与 Transformer 文本编码器分别输出单位向量 I_i, T_i`, status: '共享多模态球面' },
          { stepTitle: '2. N×N 对称对比损失优化', detail: `乘以可学习尺度 1/τ=${v.tempInv}，沿行（图找文）和沿列（文找图）双向最大化对角线概率`, status: `${(negativePairs / 1e6).toFixed(0)}M 负样本` },
          { stepTitle: '3. 零样本分类器动态合成', detail: `将类别词填入 "${'A photo of a {object}'}" 编码为文本权重矩阵，一次点积完成任意分类`, status: `Zero-Shot ${zeroShotAcc.toFixed(1)}%` }
        ]
      };
    }
  },

  'whisper-2022': {
    paperId: 'whisper-2022',
    titleZh: 'Whisper 68万小时弱监督语音识别与多任务特殊控制符实验台',
    badgeZh: 'ICML 2023 · 现代语音转文字默认底座',
    descriptionZh:
      '调节弱监督音频预训练规模（小时数）、解码器多任务前缀控制符配置（语种检测、时间戳预测、转录 vs 翻译）与背景信噪比，实时观察 Whisper 如何仅靠一套标准 Encoder-Decoder Transformer 统一语音检测、识别、翻译与词级对齐。',
    formulaLatex:
      '\\text{Decoder Prefix}: \\; \\texttt{<|startoftranscript|>} \\to \\texttt{<|zh|>} \\to \\texttt{<|transcribe|>} \\to \\texttt{<|0.00|>}\\; \\text{语音内容}\\; \\texttt{<|2.40|>}',
    formulaDescZh:
      '将 VAD、语种识别、语音转录（ASR）、跨语种语音翻译（S2TT）与时间戳对齐全部编码为自回归解码器的特殊前缀与内联 Token，彻底淘汰传统级联流水线！',
    params: [
      { id: 'hoursK', label: '多语种弱监督训练时长', unit: '万小时', min: 4, max: 68, step: 4, defaultValue: 68, desc: 'Whisper 规模为 68 万小时（含 11.7 万小时多语种）' },
      { id: 'noiseLevel', label: '真实跨领域噪声环境强度', unit: 'dB挑战', min: 1, max: 10, step: 1, defaultValue: 7, desc: '测试跨领域零样本抗噪鲁棒性' },
      { id: 'taskMode', label: '多任务前缀控制模式', unit: '模式', min: 1, max: 2, step: 1, defaultValue: 1, desc: '1: <|transcribe|> 原语转录, 2: <|translate|> 直译英文' }
    ],
    compute: (v) => {
      const scaleFactor = Math.log10(v.hoursK * 10) / Math.log10(680);
      const whisperWer = Math.max(4.2, 11.5 - scaleFactor * 6.8 + v.noiseLevel * 0.25);
      const supWav2vecWer = 6.5 + v.noiseLevel * 2.4;
      const errReductionPct = ((supWav2vecWer - whisperWer) / supWav2vecWer) * 100;
      const prefixStr =
        v.taskMode === 1
          ? '<|startoftranscript|> <|zh|> <|transcribe|> <|0.00|>'
          : '<|startoftranscript|> <|zh|> <|translate|> <|0.00|>';
      return {
        metrics: [
          { label: '当前激活解码器控制前缀', value: v.taskMode === 1 ? '转录 + 时间戳' : '跨语种直译英文', subtext: prefixStr, highlight: true },
          { label: '跨领域零样本词错误率 (WER)', value: `${whisperWer.toFixed(1)}%`, subtext: `单域精调 wav2vec 2.0 恶化至 ${supWav2vecWer.toFixed(1)}%`, highlight: true },
          { label: '相比精调模型跨领域错误率下降', value: `降低 ${errReductionPct.toFixed(1)}%`, subtext: '打破单数据集过拟合陷阱', highlight: true },
          { label: '输入声学特征窗口', value: '30s Log-Mel (80通道)', subtext: '2×Conv1D 下采样 + 编码器-解码器交叉注意力' }
        ],
        bars: [
          { name: '跨领域真实场景语音识别准确率 (100 - WER %)', baselineLabel: 'LibriSpeech 窄域精调模型', baselineVal: Math.round(100 - supWav2vecWer), ourLabel: `Whisper (${v.hoursK}万小时弱监督)`, ourVal: Math.round(100 - whisperWer), unit: '%' },
          { name: '99种语言 + 时间戳 + 语音翻译多任务一体化度', baselineLabel: '传统声学+发音词典+外部语言模型级联', baselineVal: 30, ourLabel: 'Whisper 单一自回归序列框架', ourVal: 98, unit: '分' }
        ],
        liveVerdictZh: `在 ${v.hoursK} 万小时多样化弱监督音频训练下，尽管模型从未在特定评测集上微调，但在噪声强度 ${v.noiseLevel} 下的零样本词错误率（WER）仅为 ${whisperWer.toFixed(1)}%，相比在单一干净数据集上刷榜的精调模型（WER=${supWav2vecWer.toFixed(1)}%）将错误率大幅削减了 ${errReductionPct.toFixed(1)}%！`,
        stepTrace: [
          { stepTitle: '1. 过滤机器生成脏字幕', detail: `设计自动启发式规则剔除互联网上其他 ASR 生成的全大写/无标点伪标签，保留人类自然标点格式`, status: '免后处理逆文本归一化' },
          { stepTitle: '2. 30秒音频切片 + 特殊时间戳 Token', detail: `每隔 20ms 量化为一个专用时间戳词元 <|t|> 与文本词元交错自回归生成`, status: '内置对齐' },
          { stepTitle: '3. 统一前缀指令路由', detail: `仅通过切换 ${prefixStr} 即可在同一次推理中完成静音跳过、语种识别与转录/翻译`, status: `WER ${whisperWer.toFixed(1)}%` }
        ]
      };
    }
  },

  'sam-2023': {
    paperId: 'sam-2023',
    titleZh: 'Segment Anything (SAM) 可提示分割与多掩码消歧实验台',
    badgeZh: 'ICCV 2023 · 视觉基础模型与 SA-1B 11亿掩码',
    descriptionZh:
      '调节前景点击提示点数（Points）、边界框提示（Box）与层级粒度偏好（局部部件 vs 整体物体 vs 全局），实时体验 SAM 如何将重型图像编码（ViT-H）与极轻量提示掩码解码器（50ms 浏览器级实时交互）解耦，并输出 3 个多粒度掩码与 IoU 置信度解决点击歧义。',
    formulaLatex:
      '\\mathbf{F}_{\\text{img}} = \\mathcal{E}_{\\text{ViT-H}}(I) \\;(\\text{1次离线}), \\quad \\{(M_k, s_k)\\}_{k=1}^3 = \\mathcal{D}_{\\text{Mask}}(\\mathbf{F}_{\\text{img}}, \\mathcal{E}_{\\text{Prompt}}(\\text{points, box, mask})) \\;(<50\\text{ms})',
    formulaDescZh:
      '当用户在衬衫扣子上点一下时，意图可能是“扣子”、“整件衬衫”或“整个人”；SAM 同时预测 3 个嵌套粒度的掩码及对应 IoU 预测分，取最小损失反向传播（WTA Loss）完美消解单点歧义。',
    params: [
      { id: 'numPoints', label: '交互点击提示点数 (Points)', unit: '个点', min: 1, max: 5, step: 1, defaultValue: 1, desc: '1 个点存在层级歧义，多点迅速收敛' },
      { id: 'granularity', label: '目标语义粒度选择', unit: '层级', min: 1, max: 3, step: 1, defaultValue: 2, desc: '1:子部件(Sub-part), 2:完整局部(Part), 3:整体对象(Whole)' },
      { id: 'cachedEmb', label: '复用预计算图像特征 F_img', unit: '开关', min: 0, max: 1, step: 1, defaultValue: 1, desc: '编码器跑 1 次，后续每次点击仅跑轻量 Decoder' }
    ],
    compute: (v) => {
      const latencyMs = v.cachedEmb === 1 ? 14 + v.numPoints * 2 : 185 + v.numPoints * 2;
      const iouSubpart = v.numPoints === 1 ? 82.4 : 89.2;
      const iouPart = v.numPoints === 1 ? 88.6 : 93.4;
      const iouWhole = v.numPoints === 1 ? 86.1 : 94.8;
      const selectedIou = v.granularity === 1 ? iouSubpart : v.granularity === 2 ? iouPart : iouWhole;
      return {
        metrics: [
          { label: '单次交互掩码解码延迟', value: `${latencyMs} ms`, subtext: v.cachedEmb === 1 ? '✅ 浏览器 WebAssembly 60FPS 实时响应' : '含重型 ViT-H 图像编码耗时', highlight: true },
          { label: '3 路消歧输出最高 IoU', value: `${selectedIou.toFixed(1)}%`, subtext: `局部:${iouSubpart.toFixed(0)}% | 部件:${iouPart.toFixed(0)}% | 整体:${iouWhole.toFixed(0)}%`, highlight: true },
          { label: 'SA-1B 数据引擎自动构建规模', value: '11 亿高精掩码', subtext: '比历史所有分割数据集总和大 400 倍', highlight: true },
          { label: '单点提示人类盲测胜率', value: '超越 RITM +18.5%', subtext: '主要归功于 3-Mask 消歧分支设计' }
        ],
        bars: [
          { name: '单点提示零样本边缘分割 IoU (%)', baselineLabel: 'RITM 单掩码预测器 (遇歧义取平均模糊化)', baselineVal: 71, ourLabel: `SAM 3-Mask 多粒度消歧 (${selectedIou.toFixed(1)}%)`, ourVal: Math.round(selectedIou), unit: '%' },
          { name: '交互式标注流水线人效提升倍率', baselineLabel: '人工多边形描边标注 (20秒/物体)', baselineVal: 12, ourLabel: 'SAM 单点实时分割 (<50ms)', ourVal: 98, unit: '分' }
        ],
        liveVerdictZh: `在提供 ${v.numPoints} 个提示点时，传统单输出分割模型会把“部件”与“整体”平均成一团模糊阴影；SAM 的轻量双层双向 Transformer 解码器在 ${latencyMs}ms 内同时输出 3 个嵌套层级掩码，并在你选定的第 ${v.granularity} 级粒度上达到 ${selectedIou.toFixed(1)}% IoU！`,
        stepTrace: [
          { stepTitle: '1. 重编码器单次提取 F_img', detail: `MAE 预训练 ViT-H 将 1024×1024 高清图编码为 64×64×256 特征图，全程只需算 1 次`, status: '特征常驻复用' },
          { stepTitle: '2. 提示词位置编码 + 双向交叉注意力', detail: `将点/框坐标编码为 Prompt Tokens，在 2 层双向 Transformer 中与图像特征互更新`, status: `耗时仅 ${latencyMs}ms` },
          { stepTitle: '3. Winner-Takes-All 三分支消歧', detail: `同时输出子部件/部件/整体 3 张掩码与 IoU 预测头，训练时仅对最小损失分支回传梯度`, status: `IoU ${selectedIou.toFixed(1)}%` }
        ]
      };
    }
  },

  'llava-2023': {
    paperId: 'llava-2023',
    titleZh: 'LLaVA 视觉指令微调 (Visual Instruction Tuning) 跨模态对齐实验台',
    badgeZh: 'NeurIPS 2023 Oral · 开源多模态大模型标准配方',
    descriptionZh:
      '调节视觉特征网格分辨率（224 vs 336）、连接器投影结构（线性层 W vs 双层 MLP）以及两阶段训练开关（阶段1：冻结对齐；阶段2：端到端多模态指令微调），实时观察如何用极低成本把冻结的 CLIP 视觉编码器与 Vicuna/LLaMA 语言模型拼接成“能看图的 GPT-4V”。',
    formulaLatex:
      '\\mathbf{Z}_v = g_{\\text{CLIP}}(\\mathbf{X}_v), \\quad \\mathbf{H}_v = \\mathbf{W}\\cdot \\mathbf{Z}_v \\in \\mathbb{R}^{N_v \\times d_{\\text{LLM}}}, \\quad p(\\mathbf{X}_a \\mid \\mathbf{X}_v, \\mathbf{X}_{\\text{instruct}}) = \\prod_{i=1}^L p_\\theta(x_i \\mid \\mathbf{H}_v, \\mathbf{H}_{\\text{instruct}}, x_{<i})',
    formulaDescZh:
      '第一阶段仅训练轻量投影矩阵 W 将 CLIP 图像块特征对齐至 LLM 词嵌入空间；第二阶段用 GPT-4 基于符号化框/图注合成的 15.8 万条多模态对话、细节描述与复杂推理数据进行指令微调。',
    params: [
      { id: 'imgRes', label: 'CLIP 输入图像分辨率', unit: 'px', min: 224, max: 336, step: 112, defaultValue: 336, desc: '224px 产出 256 个视觉 Token，336px 产出 576 个视觉 Token' },
      { id: 'stage2Mode', label: '启用第二阶段端到端指令微调', unit: '开关', min: 0, max: 1, step: 1, defaultValue: 1, desc: '0: 仅跑阶段1特征对齐; 1: 完整两阶段视觉指令微调' },
      { id: 'dataMix', label: '三类合成视觉指令数据配比完整度', unit: '类', min: 1, max: 3, step: 1, defaultValue: 3, desc: '涵盖 1:多轮对话 + 2:细节描述 + 3:复杂推理' }
    ],
    compute: (v) => {
      const visualTokens = v.imgRes === 336 ? 576 : 256;
      const baseScore = v.stage2Mode === 0 ? 29.5 : 58.0 + v.dataMix * 9.2 + (v.imgRes === 336 ? 4.5 : 0);
      const scienceQaAcc = v.stage2Mode === 0 ? 64.2 : Math.min(92.53, 84.5 + v.dataMix * 2.68);
      return {
        metrics: [
          { label: '注入 LLM 的视觉 Token 数量 N_v', value: `${visualTokens} Tokens`, subtext: `(${v.imgRes}/14)² 个 Patch 经投影层直通 LLM`, highlight: true },
          { label: 'LLaVA-Bench 相对 GPT-4 综合得分', value: `${baseScore.toFixed(1)}%`, subtext: v.stage2Mode === 1 ? '具备复杂图文推理与 OCR 能力' : '无阶段2指令微调退化严重(-61%)', highlight: true },
          { label: 'ScienceQA 多模态科学问答 SOTA', value: `${scienceQaAcc.toFixed(2)}%`, subtext: '与 GPT-4 投票集成后高达 92.53%', highlight: true },
          { label: '第一阶段特征对齐训练耗时', value: '仅 ~4 小时 (8×A100)', subtext: '极简轻量投影层，无需昂贵 Q-Former 预训练' }
        ],
        bars: [
          { name: 'LLaVA-Bench 多模态综合评分 (相对 GPT-4 %)', baselineLabel: '仅跑 Stage 1 或单类对话微调', baselineVal: 38, ourLabel: `当前配置 (${baseScore.toFixed(1)}%)`, ourVal: Math.round(baseScore), unit: '%' },
          { name: '架构简洁度与开源复现友好度', baselineLabel: 'Flamingo / BLIP-2 (复杂门控交叉注意力/Q-Former)', baselineVal: 52, ourLabel: 'LLaVA (CLIP + 线性/MLP投影 + LLM)', ourVal: 98, unit: '分' }
        ],
        liveVerdictZh: `在 ${v.imgRes}×${v.imgRes} 分辨率下，CLIP 提取的 ${visualTokens} 个视觉块特征经投影矩阵直接拼入 LLM 提示词前缀；实验证明，唯有开启第二阶段端到端视觉指令微调并配齐「多轮对话 + 细节描述 + 复杂推理」三类 GPT-4 合成数据，模型综合评分才能跃升至 ${baseScore.toFixed(1)}%（ScienceQA 达 ${scienceQaAcc.toFixed(2)}%）！`,
        stepTrace: [
          { stepTitle: '1. 符号化场景驱动数据合成', detail: `将 COCO 图像的 Caption 与 Bounding Box 编码为文本喂给纯文本 GPT-4，低成本合成 15.8 万高质量视觉指令集`, status: '突破数据荒' },
          { stepTitle: '2. Stage 1: 冻结双端预训练投影层 W', detail: `冻结 CLIP 与 LLM，仅用 59.5 万图文对训练线性投影层 W，把图像特征翻译成“外语词向量”`, status: `${visualTokens} 视觉词元` },
          { stepTitle: '3. Stage 2: 联合解冻 LLM 指令微调', detail: `解冻 LLM 与投影层 W 在 15.8 万三元组指令集上微调，激活看图推理与幽默理解`, status: `得分 ${baseScore.toFixed(1)}%` }
        ]
      };
    }
  },

  'ddpm-2020': {
    paperId: 'ddpm-2020',
    titleZh: 'DDPM 去噪扩散概率模型：前向闭合加噪与反向噪声预测实验台',
    badgeZh: 'NeurIPS 2020 · 现代扩散生成产业理论母体',
    descriptionZh:
      '调节扩散时间步 t（1 ~ 1000）与线性噪声调度上限 β_T，实时计算前向扩散重参数化闭合系数 √ᾱ_t（原图信号保留率）与 √(1-ᾱ_t)（高斯噪声注入比例），以及 Ho et al. 发现的“预测噪声 ε_θ + 去权重简化损失 L_simple”带来的 FID 质变飞跃。',
    formulaLatex:
      'q(\\mathbf{x}_t \\mid \\mathbf{x}_0) = \\mathcal{N}\\left(\\mathbf{x}_t; \\sqrt{\\bar{\\alpha}_t}\\mathbf{x}_0, (1-\\bar{\\alpha}_t)\\mathbf{I}\\right), \\quad \\mathcal{L}_{\\text{simple}}(\\theta) = \\mathbb{E}_{t, \\mathbf{x}_0, \\boldsymbol{\\epsilon}}\\left[\\|\\boldsymbol{\\epsilon} - \\boldsymbol{\\epsilon}_\\theta(\\sqrt{\\bar{\\alpha}_t}\\mathbf{x}_0 + \\sqrt{1-\\bar{\\alpha}_t}\\boldsymbol{\\epsilon}, t)\\|^2\\right]',
    formulaDescZh:
      '前向任意第 t 步无需逐步递归，可直接一步采样 x_t = √ᾱ_t x_0 + √(1-ᾱ_t) ε；反向训练时舍弃变分下界中偏重微小噪声步的理论权重系数，直接用等权均方误差预测注入的噪声 ε，使生成质量一举超越 GAN！',
    params: [
      { id: 'timeStepT', label: '当前扩散时间步 t (共 T=1000)', unit: '步', min: 1, max: 1000, step: 10, defaultValue: 400, desc: 't=0 为清晰原图，t=1000 为纯各向同性高斯噪声' },
      { id: 'lossType', label: '训练目标参数化方式', unit: '模式', min: 1, max: 3, step: 1, defaultValue: 3, desc: '1: 预测均值 μ̃_t(ELBO), 2: 预测噪声 ε(标准ELBO权重), 3: 预测噪声 ε + L_simple 去权重(本文最优)' }
    ],
    compute: (v) => {
      // Approximate linear beta schedule from 1e-4 to 0.02 over 1000 steps
      const ratio = v.timeStepT / 1000;
      const logAlphaBar = -0.5 * (0.0001 * v.timeStepT + 0.0199 * ratio * v.timeStepT * 0.5);
      const alphaBar = Math.exp(logAlphaBar);
      const signalScale = Math.sqrt(alphaBar);
      const noiseScale = Math.sqrt(1 - alphaBar);
      const snr = alphaBar / Math.max(1e-5, 1 - alphaBar);

      const fidScore = v.lossType === 1 ? 13.51 : v.lossType === 2 ? 8.05 : 3.17;
      return {
        metrics: [
          { label: '原图信号保留系数 √ᾱ_t', value: signalScale.toFixed(4), subtext: `能量占比 ᾱ_t = ${(alphaBar * 100).toFixed(1)}%`, highlight: true },
          { label: '高斯噪声注入系数 √(1-ᾱ_t)', value: noiseScale.toFixed(4), subtext: `噪声方差占比 ${(100 - alphaBar * 100).toFixed(1)}%`, highlight: true },
          { label: '当前步信噪比 SNR(t)', value: snr.toFixed(3), subtext: v.timeStepT < 250 ? '高频细节修复阶段' : v.timeStepT < 700 ? '中层语义结构塑形阶段' : '全局布局从纯噪涌现阶段' },
          { label: 'CIFAR-10 生成图像 FID (越低越好)', value: `${fidScore.toFixed(2)} FID`, subtext: v.lossType === 3 ? '🏆 L_simple 创下历史新 SOTA (3.17)' : '包含理论变分权重导致重小轻大', highlight: true }
        ],
        bars: [
          { name: 'CIFAR-10 图像合成质量 (100 - FID×4, 越高越好)', baselineLabel: '预测均值 μ̃_t + 原始变分权重 (FID 13.51)', baselineVal: 46, ourLabel: `当前选择 (FID ${fidScore.toFixed(2)})`, ourVal: Math.round(100 - fidScore * 4), unit: '分' },
          { name: '训练稳定性与抗模式崩溃 (Mode Coverage)', baselineLabel: 'GAN 对抗博弈 (易模式崩溃)', baselineVal: 58, ourLabel: 'DDPM 等权噪声回归 L_simple', ourVal: 98, unit: '%' }
        ],
        liveVerdictZh: `在时间步 t=${v.timeStepT} 时，前向闭合公式直接给出 x_t = ${signalScale.toFixed(3)}·x_0 + ${noiseScale.toFixed(3)}·ε（无需串行跑 ${v.timeStepT} 步！）。更重要的是，采用「预测噪声 ε + L_simple 去权重损失」会自动压低极小 t 的简单去噪权重，迫使 UNet 集中精力攻克中大 t 的全局语义结构，将 FID 从 13.51 断崖式降至 3.17！`,
        stepTrace: [
          { stepTitle: '1. 一步重参数化前向加噪', detail: `利用高斯可加性 ᾱ_t = ∏(1-β_s)，任意步 x_t 直接由原图 x_0 与标准高斯 ε 线性组合得到`, status: `ᾱ_t=${alphaBar.toFixed(3)}` },
          { stepTitle: '2. 桥接朗之万动力学与得分匹配', detail: `发现预测后验均值 μ_θ 等价于预测噪声 ε_θ ≈ -√(1-ᾱ_t)∇_x log p(x_t)`, status: '统一扩散与Score' },
          { stepTitle: '3. 舍弃变分权重系数得 L_simple', detail: `去掉在 t→0 时数值巨大的理论系数，聚焦困难时间步重构`, status: `FID = ${fidScore.toFixed(2)}` }
        ]
      };
    }
  },

  'alphafold2-2021': {
    paperId: 'alphafold2-2021',
    titleZh: 'AlphaFold2 Evoformer 三角注意力与 SE(3) 结构模块实验台',
    badgeZh: 'Nature 2021 (诺贝尔化学奖成果) · 原子级蛋白质结构预测',
    descriptionZh:
      '调节多序列比对（MSA）同源序列深度、Evoformer 块数（默认 48 块）与迭代循环（Recycling）次数，实时观察 MSA 与残基对表征（Pair Representation）如何通过三角乘法更新（Triangle Multiplicative Update）强制满足三维欧氏空间三角不等式，并在结构模块（IPA）中直接回归原子三维坐标。',
    formulaLatex:
      'z_{ij} \\xleftarrow{\\text{Triangle Update}} \\sum_k g_{ij} \\odot (\\mathbf{a}_{ik} \\odot \\mathbf{b}_{kj}), \\quad \\mathbf{T}_i = (\\mathbf{R}_i, \\vec{t}_i) \\in SE(3), \\quad \\mathcal{L}_{\\text{FAPE}} = \\frac{1}{Z}\\sum_{i,j} \\|\\mathbf{T}_i^{-1}\\vec{x}_j - (\\mathbf{T}_i^{\\text{true}})^{-1}\\vec{x}_j^{\\text{true}}\\|',
    formulaDescZh:
      '将残基对 (i,j) 视为图中的边，利用第三残基 k 构成三角形 (i,j,k) 同步更新几何约束；再通过不变点注意力（IPA）与局部刚体帧对齐点误差（FAPE）直接预测主链与侧链三维原子坐标。',
    params: [
      { id: 'msaDepth', label: 'MSA 多序列比对有效深度 N_eff', unit: '条序列', min: 16, max: 512, step: 16, defaultValue: 256, desc: '进化共变信号源（大于 30 条即进入高精平台区）' },
      { id: 'recycles', label: '全网络闭环回收迭代次数 (Recycling)', unit: '次', min: 0, max: 3, step: 1, defaultValue: 3, desc: '将预测出的 3D 距离回注至 Evoformer 重新精炼' },
      { id: 'triangleAttn', label: '启用残基对三角不等式注意力', unit: '开关', min: 0, max: 1, step: 1, defaultValue: 1, desc: '确保 3D 距离矩阵满足 d(i,j) ≤ d(i,k) + d(k,j)' }
    ],
    compute: (v) => {
      const msaFactor = v.msaDepth >= 32 ? 1.0 : 0.72 + (v.msaDepth / 32) * 0.28;
      const recycleBonus = v.recycles * 2.1;
      const triBonus = v.triangleAttn === 1 ? 6.5 : 0;
      const gdtTs = Math.min(92.4, (79.5 + recycleBonus + triBonus) * msaFactor);
      const rmsdAngstrom = Math.max(0.96, 3.8 - (gdtTs - 70) * 0.125);
      return {
        metrics: [
          { label: 'CASP14 全局结构中位 GDT_TS', value: `${gdtTs.toFixed(1)} / 100`, subtext: '超过 90 分即达到冷冻电镜/X射线实验解析精度', highlight: true },
          { label: '主链碳原子均方根偏差 (Cα RMSD95)', value: `${rmsdAngstrom.toFixed(2)} Å (埃)`, subtext: `约等于 1 个碳原子直径 (第二名仅 2.80 Å)`, highlight: true },
          { label: '单节点预测置信度自评指标', value: `pLDDT = ${(gdtTs - 1.5).toFixed(1)}`, subtext: '网络精准自知哪些区域折叠可靠、哪些是无序区' },
          { label: '三维旋转平移等变性保证', value: 'SE(3) 局部帧不变 (IPA)', subtext: '全局刚体旋转不影响内部几何推理与 FAPE 损失' }
        ],
        bars: [
          { name: 'CASP14 盲测蛋白质结构精度 GDT_TS (满分100)', baselineLabel: 'CASP14 全球第二名团队 (GDT 62.0)', baselineVal: 62, ourLabel: `AlphaFold2 当前配置 (GDT ${gdtTs.toFixed(1)})`, ourVal: Math.round(gdtTs), unit: '分' },
          { name: '三维几何无冲突物理合理性 (%)', baselineLabel: '传统二维距离图 + 外部梯度下降折纸', baselineVal: 64, ourLabel: 'Evoformer 三角更新 + 端到端 IPA 刚体帧', ourVal: 98, unit: '%' }
        ],
        liveVerdictZh: `在 MSA 深度 ${v.msaDepth}、开启三角更新与 ${v.recycles} 次 Recycling 闭环精炼下，AlphaFold2 的中位 GDT_TS 达到 ${gdtTs.toFixed(1)}，主链误差压缩至惊人的 ${rmsdAngstrom.toFixed(2)} Å（仅相当于一个碳原子的宽度，比全球第二名 2.8Å 缩小近 3 倍），彻底解决了困扰人类 50 年的蛋白质折叠难题！`,
        stepTrace: [
          { stepTitle: '1. Evoformer 双轨信息互换 (48块)', detail: `MSA 表征提取进化共变突变，并通过外积均值持续写入 Pair 残基对表征`, status: '双向协同演化' },
          { stepTitle: '2. 三角乘法更新与三角自注意力', detail: `在残基三元组 (i,j,k) 上传递边约束，确保隐空间距离满足三维欧氏几何公理`, status: '几何自洽' },
          { stepTitle: '3. IPA 不变点注意力与 FAPE 局部帧损失', detail: `将每个氨基酸视为刚体三角形 (R_i, t_i)，经 ${v.recycles} 轮 Recycling 直接输出全原子 3D 坐标`, status: `误差 ${rmsdAngstrom.toFixed(2)} Å` }
        ]
      };
    }
  }
};

export const IndustrialPaperSimulator: React.FC<{ paperId: string }> = ({ paperId }) => {
  const config = SIMULATOR_CONFIGS[paperId] || SIMULATOR_CONFIGS['adam-2014'];

  const initialParamValues = useMemo(() => {
    const init: Record<string, number> = {};
    config.params.forEach((p) => {
      init[p.id] = p.defaultValue;
    });
    return init;
  }, [config]);

  const [paramValues, setParamValues] = useState<Record<string, number>>(initialParamValues);

  const handleParamChange = (id: string, val: number) => {
    setParamValues((prev) => ({ ...prev, [id]: val }));
  };

  const handleReset = () => {
    setParamValues(initialParamValues);
  };

  const result = useMemo(() => {
    const merged = { ...initialParamValues, ...paramValues };
    return config.compute(merged);
  }, [config, initialParamValues, paramValues]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-white">{config.titleZh}</h2>
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-300 rounded-full border border-emerald-500/30">
                  {config.badgeZh}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{config.descriptionZh}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors cursor-pointer self-start md:self-center flex-shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
            <span>恢复论文标准超参数</span>
          </button>
        </div>

        {/* Core Formula Display */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>核心数学机理方程 (Interactive Governing Equation):</span>
          </div>
          <div className="font-mono text-xs sm:text-sm text-teal-300 overflow-x-auto py-1 text-center">
            {config.formulaLatex}
          </div>
          <p className="text-[11px] text-slate-400 text-center">{config.formulaDescZh}</p>
        </div>

        {/* Interactive Parameter Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {config.params.map((p) => {
            const currentVal = paramValues[p.id] ?? p.defaultValue;
            return (
              <div
                key={p.id}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{p.label}</span>
                  </span>
                  <span className="font-mono font-bold text-emerald-400">
                    {currentVal} {p.unit}
                  </span>
                </div>

                <input
                  type="range"
                  min={p.min}
                  max={p.max}
                  step={p.step}
                  value={currentVal}
                  onChange={(e) => handleParamChange(p.id, Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />

                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>
                    范围: {p.min} ~ {p.max} {p.unit}
                  </span>
                  <span>{p.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Computed Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {result.metrics.map((m, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border space-y-1.5 ${
              m.highlight
                ? 'bg-slate-900 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                : 'bg-slate-900/80 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">{m.label}</span>
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div
              className={`text-xl font-mono font-bold ${
                m.highlight ? 'text-emerald-400' : 'text-white'
              }`}
            >
              {m.value}
            </div>
            <div className="text-[11px] text-slate-400 leading-normal">{m.subtext}</div>
          </div>
        ))}
      </div>

      {/* Side-by-Side Comparison Bars + Step-by-Step Pipeline Execution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Comparison Bars */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              传统基线 vs 本文方案实时量化对比
            </h3>
          </div>

          <div className="space-y-5">
            {result.bars.map((bar, bIdx) => (
              <div key={bIdx} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                  <span>{bar.name}</span>
                  <span className="text-[11px] font-mono text-emerald-400">
                    {bar.lowerIsBetter ? '数值越低越优' : '数值越高越优'}
                  </span>
                </div>

                {/* Baseline */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>{bar.baselineLabel}</span>
                    <span className="font-mono">
                      {bar.baselineVal}
                      {bar.unit}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                    <div
                      className="h-full rounded-full bg-slate-600 transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(6, bar.baselineVal))}%` }}
                    />
                  </div>
                </div>

                {/* Our Method */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-emerald-300 font-semibold">
                    <span>{bar.ourLabel}</span>
                    <span className="font-mono font-bold">
                      {bar.ourVal}
                      {bar.unit}
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-emerald-500/30">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(6, bar.ourVal))}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/25 border border-emerald-500/30 text-xs text-slate-200 leading-relaxed">
            <strong className="text-emerald-400 flex items-center gap-1.5 mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>实时参数推演结论：</span>
            </strong>
            {result.liveVerdictZh}
          </div>
        </div>

        {/* 3-Step Execution Trace */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">核心算法三阶段机制追踪</h3>
            </div>

            <div className="space-y-3">
              {result.stepTrace.map((st, sIdx) => (
                <div
                  key={sIdx}
                  className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{st.stepTitle}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex-shrink-0">
                      {st.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-5">{st.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            拖动上方滑块可实时重算各阶段中间量、显存/算力开销与评测指标。
          </div>
        </div>
      </div>
    </div>
  );
};
