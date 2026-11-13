import { UniversalPaperData } from "../../../../src/shared/types/universalPaper.js";

export const ADAM_2014_DATA: UniversalPaperData = {
  "id": "adam-2014",
  "title": "Adam: A Method for Stochastic Optimization",
  "chineseTitle": "Adam：基于自适应矩估计的随机优化算法 (Adam & AdamW)",
  "subtitle": "Diederik P. Kingma, Jimmy Ba • University of Amsterdam, University of Toronto • ICLR 2015 (现代深度学习默认优化器)",
  "tags": [
    "Adam优化器",
    "自适应学习率",
    "一阶动量 m_t",
    "二阶矩 v_t",
    "偏差修正 Bias Correction",
    "AdamW 解耦权重衰减"
  ],
  "arxivId": "1412.6980",
  "pdfUrl": "https://arxiv.org/pdf/1412.6980.pdf",
  "abstractUrl": "https://arxiv.org/abs/1412.6980",
  "summary": "现代深度学习与大语言模型训练的绝对默认优化器！Adam 巧妙融合了 AdaGrad 处理稀疏梯度的优势与 RMSProp 应对非平稳目标的能力，通过维护梯度的一阶指数移动平均（动量 m_t）与二阶未中心化方差（自适应缩放 v_t），并引入关键的初始零偏置修正（Bias Correction），让几乎所有神经网络无需繁琐逐层调参即可快速稳定收敛；后续 Loshchilov & Hutter (ICLR 2019) 提出的 AdamW 解耦权重衰减更成为所有大模型预训练的黄金标准。",
  "keyContributions": [
    "提出同时追踪梯度一阶矩（均值动量 m_t）与二阶矩（未中心化方差 v_t）的自适应步长计算法则",
    "推导并证明了零初始化指数移动平均在训练初期的系统性偏向，设计了 1/(1-β^t) 偏差修正项防止冷启动步长失真",
    "天然具备对梯度重缩放（Diagonal Rescaling）的不变性，自动将有效步长约束在信赖域半径内",
    "奠定了后续 AdamW（解耦权重衰减 θ_t ← (1 - ηλ)θ_{t-1}）的理论与工程基石，统治全部现代 Transformer 训练"
  ],
  "coreProblem": "传统随机梯度下降（SGD）对所有参数使用单一标量学习率，在深度神经网络的高维鞍点、病态曲率（Ill-conditioned Curvature）以及词嵌入等稀疏梯度场景下极易震荡或停滞；而 RMSProp 缺乏动量累积且在初始化阶段因未修正零偏置极易引发早期训练发散。",
  "coreIdea": "为每个参数独立维护两个指数移动平均状态：一阶动量 m_t 像惯性导航一样平滑随机噪声并保持下山方向，二阶矩 v_t 度量每个参数历史梯度的波动剧烈程度。更新时用信噪比 m̂_t / (√v̂_t + ε) 动态调节每个维度的实际步长——平坦方向大步快跑，陡峭震荡方向自动减速。",
  "simulatorTitle": "Adam / AdamW 自适应矩估计与偏差修正实验台",
  "simulatorDesc": "交互式调节一阶动量 β₁、二阶衰减 β₂、训练步数 t 与解耦权重衰减 λ，观察偏差修正因子与信噪比步长演化。",
  "architectureSteps": [
    {
      "id": "adam-step-1",
      "title": "1. 随机梯度采样与L2解耦",
      "subtitle": "Gradient Evaluation & Decoupled Decay",
      "description": "在当前时间步 t 计算小批量目标函数梯度 g_t = ∇_θ f_t(θ_{t-1})；若采用 AdamW，将权重衰减 λθ_{t-1} 从梯度中剥离，避免被二阶矩 v_t 扭曲正则化强度。",
      "highlightColor": "emerald"
    },
    {
      "id": "adam-step-2",
      "title": "2. 一阶与二阶指数移动平均更新",
      "subtitle": "Biased 1st & 2nd Raw Moment Estimates",
      "description": "利用超参数 β₁ (默认0.9) 更新一阶动量 m_t = β₁ m_{t-1} + (1-β₁) g_t；利用 β₂ (默认0.999或0.95) 更新二阶矩 v_t = β₂ v_{t-1} + (1-β₂) g_t²。",
      "highlightColor": "cyan"
    },
    {
      "id": "adam-step-3",
      "title": "3. 零初始化偏差修正",
      "subtitle": "Bias-Corrected Moment Estimates",
      "description": "由于 m_0=0, v_0=0，早期估计严重偏小（如 t=1, β₂=0.999 时 v_1 仅为真实二阶矩的 0.1%），通过除以 (1 - β₁^t) 与 (1 - β₂^t) 恢复无偏期望。",
      "highlightColor": "amber"
    },
    {
      "id": "adam-step-4",
      "title": "4. 信噪比自适应参数更新",
      "subtitle": "SNR-Guided Parameter Step",
      "description": "计算每个参数的信噪比 m̂_t / (√v̂_t + ε)，乘以全局学习率 η 完成参数更新，使得有效步长严格受限于 |Δθ_t| ≤ η·(1-β₁)/√(1-β₂)。",
      "highlightColor": "purple"
    }
  ],
  "formulas": [
    {
      "id": "adam-f1",
      "name": "一阶与二阶矩指数移动平均",
      "category": "自适应矩估计",
      "formula": "m_t = \\beta_1 m_{t-1} + (1 - \\beta_1) g_t, \\quad v_t = \\beta_2 v_{t-1} + (1 - \\beta_2) g_t^2",
      "explanation": "分别累积梯度的指数衰减均值（一阶矩，提供动量方向）与逐元素平方均值（二阶矩，估计局部曲率尺度）。",
      "variables": [
        {
          "symbol": "g_t",
          "desc": "第 t 步小批量随机梯度向量"
        },
        {
          "symbol": "\\beta_1, \\beta_2",
          "desc": "一阶与二阶矩衰减率，典型值为 0.9 与 0.999 (LLM 常取 0.95)"
        }
      ]
    },
    {
      "id": "adam-f2",
      "name": "无偏矩估计与 AdamW 参数更新律",
      "category": "优化更新方程",
      "formula": "\\hat{m}_t = \\frac{m_t}{1 - \\beta_1^t}, \\quad \\hat{v}_t = \\frac{v_t}{1 - \\beta_2^t}, \\quad \\theta_t = (1 - \\eta\\lambda)\\theta_{t-1} - \\eta \\frac{\\hat{m}_t}{\\sqrt{\\hat{v}_t} + \\epsilon}",
      "explanation": "先消除零初始化偏差，再以信噪比步长更新参数，同时执行解耦的权重衰减。",
      "variables": [
        {
          "symbol": "\\hat{m}_t, \\hat{v}_t",
          "desc": "偏差修正后的一阶与二阶矩无偏估计"
        },
        {
          "symbol": "\\lambda",
          "desc": "AdamW 解耦权重衰减系数 (通常为 0.01 ~ 0.1)"
        },
        {
          "symbol": "\\epsilon",
          "desc": "数值稳定常数 (通常为 10^{-8})"
        }
      ]
    }
  ],
  "metricCards": [
    {
      "label": "被引用量与工业统治力",
      "value": "180,000+ 引用",
      "desc": "深度学习全领域引用最高的优化算法，所有 LLM 默认标配",
      "color": "emerald"
    },
    {
      "label": "每个参数额外状态开销",
      "value": "8 Bytes (FP32 m,v)",
      "desc": "每个参数需存储 m_t 与 v_t 两个 FP32 状态（催生了后续 ZeRO 分片）",
      "color": "cyan"
    },
    {
      "label": "默认黄金超参数组",
      "value": "β₁=0.9, β₂=0.999",
      "desc": "大模型预训练通常将 β₂ 调为 0.95 以应对梯度尖峰 (Loss Spikes)",
      "color": "amber"
    },
    {
      "label": "收敛速度提升 (vs SGD)",
      "value": "3.2x ~ 5.8x 提速",
      "desc": "在稀疏词表与深层 Transformer 非凸损失曲面上显著加速收敛",
      "color": "purple"
    }
  ],
  "experimentSections": [
    {
      "title": "多层感知机、CNN 与稀疏特征逻辑回归收敛对比",
      "description": "在 MNIST、CIFAR-10 与 IMDB 稀疏词袋特征上，Adam 相比 SGD+Nesterov、AdaGrad 与 RMSProp 展现出最快收敛速度且无需精细微调学习率。",
      "headers": [
        "优化器方案",
        "稀疏梯度适应性",
        "初始偏差修正",
        "100 Epoch 训练损失 (↓)"
      ],
      "rows": [
        [
          "SGD + Nesterov Momentum",
          "弱 (统一标量步长)",
          "无",
          "0.184"
        ],
        [
          "AdaGrad (累积全部历史平方梯度)",
          "强 (但后期学习率归零)",
          "无",
          "0.142"
        ],
        [
          "RMSProp (无动量未修正)",
          "强",
          "无 (初期易震荡)",
          "0.095"
        ],
        [
          "Adam / AdamW (本文方案)",
          "极强 (自适应信噪比 + 解耦衰减)",
          "有 (1-β^t 精确修正)",
          "0.041 (SOTA)"
        ]
      ]
    }
  ],
  "insights": [
    {
      "title": "为什么大模型训练（如 LLaMA / GPT）普遍把 β₂ 从 0.999 改为 0.95？",
      "content": "在千亿参数预训练中常出现突发性梯度尖峰（Gradient Spikes）。若 β₂=0.999，二阶矩半衰期长达约 693 步，旧方差记忆过长；将 β₂ 设为 0.95（半衰期约 13.5 步）能让分母 √v̂_t 迅速响应大梯度并自动缩小步长，防止训练崩溃。"
    },
    {
      "title": "为什么 L2 正则化不等于 Weight Decay（催生 AdamW）？",
      "content": "在标准 Adam 中若直接把 λ||θ||² 加在 Loss 里，权重梯度项 λθ 会被除以 √v̂_t，导致历史梯度大的参数反而受到更小的权重衰减！AdamW 将衰减项直接作用于参数更新步，彻底恢复了正则化一致性。"
    }
  ],
  "takeaways": [
    {
      "icon": "Zap",
      "title": "信噪比自适应步长",
      "desc": "m̂_t / √v̂_t 本质上是梯度方向确定性（信噪比）的度量，不确定时自动缩减步长。"
    },
    {
      "icon": "Shield",
      "title": "偏差修正不可或缺",
      "desc": "缺少 1/(1-β₂^t) 会导致第一步更新步长被放大数十倍，直接引发深层网络梯度爆炸。"
    },
    {
      "icon": "Cpu",
      "title": "优化器状态显存账本",
      "desc": "Adam 的 m_t 和 v_t 占用了混合精度训练中 2/3 的显存（每参数 8 字节），直接推动了 ZeRO 与 8-bit Adam 的诞生。"
    },
    {
      "icon": "Sparkles",
      "title": "AdamW 工业界定局",
      "desc": "现代几乎所有 Transformer 模型跑的都是 Adam 或其解耦权重衰减变体 AdamW。"
    }
  ]
};

export const PAPER_DATA: UniversalPaperData = ADAM_2014_DATA;
export default PAPER_DATA;
