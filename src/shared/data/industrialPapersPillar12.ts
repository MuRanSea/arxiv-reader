import { StructuredPaperData } from '../types/universalPaper.js';

export const INDUSTRIAL_PAPERS_PILLAR_1_2: Record<string, StructuredPaperData> = {
  'adam-2014': {
    id: 'adam-2014',
    title: 'Adam: A Method for Stochastic Optimization',
    chineseTitle: 'Adam：基于自适应矩估计的随机优化算法 (Adam & AdamW)',
    subtitle: 'Diederik P. Kingma, Jimmy Ba • University of Amsterdam, University of Toronto • ICLR 2015 (现代深度学习默认优化器)',
    tags: ['Adam优化器', '自适应学习率', '一阶动量 m_t', '二阶矩 v_t', '偏差修正 Bias Correction', 'AdamW 解耦权重衰减'],
    arxivId: '1412.6980',
    pdfUrl: 'https://arxiv.org/pdf/1412.6980.pdf',
    abstractUrl: 'https://arxiv.org/abs/1412.6980',
    summary:
      '现代深度学习与大语言模型训练的绝对默认优化器！Adam 巧妙融合了 AdaGrad 处理稀疏梯度的优势与 RMSProp 应对非平稳目标的能力，通过维护梯度的一阶指数移动平均（动量 m_t）与二阶未中心化方差（自适应缩放 v_t），并引入关键的初始零偏置修正（Bias Correction），让几乎所有神经网络无需繁琐逐层调参即可快速稳定收敛；后续 Loshchilov & Hutter (ICLR 2019) 提出的 AdamW 解耦权重衰减更成为所有大模型预训练的黄金标准。',
    keyContributions: [
      '提出同时追踪梯度一阶矩（均值动量 m_t）与二阶矩（未中心化方差 v_t）的自适应步长计算法则',
      '推导并证明了零初始化指数移动平均在训练初期的系统性偏向，设计了 1/(1-β^t) 偏差修正项防止冷启动步长失真',
      '天然具备对梯度重缩放（Diagonal Rescaling）的不变性，自动将有效步长约束在信赖域半径内',
      '奠定了后续 AdamW（解耦权重衰减 θ_t ← (1 - ηλ)θ_{t-1}）的理论与工程基石，统治全部现代 Transformer 训练'
    ],
    coreProblem:
      '传统随机梯度下降（SGD）对所有参数使用单一标量学习率，在深度神经网络的高维鞍点、病态曲率（Ill-conditioned Curvature）以及词嵌入等稀疏梯度场景下极易震荡或停滞；而 RMSProp 缺乏动量累积且在初始化阶段因未修正零偏置极易引发早期训练发散。',
    coreIdea:
      '为每个参数独立维护两个指数移动平均状态：一阶动量 m_t 像惯性导航一样平滑随机噪声并保持下山方向，二阶矩 v_t 度量每个参数历史梯度的波动剧烈程度。更新时用信噪比 m̂_t / (√v̂_t + ε) 动态调节每个维度的实际步长——平坦方向大步快跑，陡峭震荡方向自动减速。',
    simulatorTitle: 'Adam / AdamW 自适应矩估计与偏差修正实验台',
    simulatorDesc: '交互式调节一阶动量 β₁、二阶衰减 β₂、训练步数 t 与解耦权重衰减 λ，观察偏差修正因子与信噪比步长演化。',
    architectureSteps: [
      {
        id: 'adam-step-1',
        title: '1. 随机梯度采样与L2解耦',
        subtitle: 'Gradient Evaluation & Decoupled Decay',
        description: '在当前时间步 t 计算小批量目标函数梯度 g_t = ∇_θ f_t(θ_{t-1})；若采用 AdamW，将权重衰减 λθ_{t-1} 从梯度中剥离，避免被二阶矩 v_t 扭曲正则化强度。',
        highlightColor: 'emerald'
      },
      {
        id: 'adam-step-2',
        title: '2. 一阶与二阶指数移动平均更新',
        subtitle: 'Biased 1st & 2nd Raw Moment Estimates',
        description: '利用超参数 β₁ (默认0.9) 更新一阶动量 m_t = β₁ m_{t-1} + (1-β₁) g_t；利用 β₂ (默认0.999或0.95) 更新二阶矩 v_t = β₂ v_{t-1} + (1-β₂) g_t²。',
        highlightColor: 'cyan'
      },
      {
        id: 'adam-step-3',
        title: '3. 零初始化偏差修正',
        subtitle: 'Bias-Corrected Moment Estimates',
        description: '由于 m_0=0, v_0=0，早期估计严重偏小（如 t=1, β₂=0.999 时 v_1 仅为真实二阶矩的 0.1%），通过除以 (1 - β₁^t) 与 (1 - β₂^t) 恢复无偏期望。',
        highlightColor: 'amber'
      },
      {
        id: 'adam-step-4',
        title: '4. 信噪比自适应参数更新',
        subtitle: 'SNR-Guided Parameter Step',
        description: '计算每个参数的信噪比 m̂_t / (√v̂_t + ε)，乘以全局学习率 η 完成参数更新，使得有效步长严格受限于 |Δθ_t| ≤ η·(1-β₁)/√(1-β₂)。',
        highlightColor: 'purple'
      }
    ],
    formulas: [
      {
        id: 'adam-f1',
        name: '一阶与二阶矩指数移动平均',
        category: '自适应矩估计',
        formula: 'm_t = \\beta_1 m_{t-1} + (1 - \\beta_1) g_t, \\quad v_t = \\beta_2 v_{t-1} + (1 - \\beta_2) g_t^2',
        explanation: '分别累积梯度的指数衰减均值（一阶矩，提供动量方向）与逐元素平方均值（二阶矩，估计局部曲率尺度）。',
        variables: [
          { symbol: 'g_t', desc: '第 t 步小批量随机梯度向量' },
          { symbol: '\\beta_1, \\beta_2', desc: '一阶与二阶矩衰减率，典型值为 0.9 与 0.999 (LLM 常取 0.95)' }
        ]
      },
      {
        id: 'adam-f2',
        name: '无偏矩估计与 AdamW 参数更新律',
        category: '优化更新方程',
        formula: '\\hat{m}_t = \\frac{m_t}{1 - \\beta_1^t}, \\quad \\hat{v}_t = \\frac{v_t}{1 - \\beta_2^t}, \\quad \\theta_t = (1 - \\eta\\lambda)\\theta_{t-1} - \\eta \\frac{\\hat{m}_t}{\\sqrt{\\hat{v}_t} + \\epsilon}',
        explanation: '先消除零初始化偏差，再以信噪比步长更新参数，同时执行解耦的权重衰减。',
        variables: [
          { symbol: '\\hat{m}_t, \\hat{v}_t', desc: '偏差修正后的一阶与二阶矩无偏估计' },
          { symbol: '\\lambda', desc: 'AdamW 解耦权重衰减系数 (通常为 0.01 ~ 0.1)' },
          { symbol: '\\epsilon', desc: '数值稳定常数 (通常为 10^{-8})' }
        ]
      }
    ],
    metricCards: [
      { label: '被引用量与工业统治力', value: '180,000+ 引用', desc: '深度学习全领域引用最高的优化算法，所有 LLM 默认标配', color: 'emerald' },
      { label: '每个参数额外状态开销', value: '8 Bytes (FP32 m,v)', desc: '每个参数需存储 m_t 与 v_t 两个 FP32 状态（催生了后续 ZeRO 分片）', color: 'cyan' },
      { label: '默认黄金超参数组', value: 'β₁=0.9, β₂=0.999', desc: '大模型预训练通常将 β₂ 调为 0.95 以应对梯度尖峰 (Loss Spikes)', color: 'amber' },
      { label: '收敛速度提升 (vs SGD)', value: '3.2x ~ 5.8x 提速', desc: '在稀疏词表与深层 Transformer 非凸损失曲面上显著加速收敛', color: 'purple' }
    ],
    experimentSections: [
      {
        title: '多层感知机、CNN 与稀疏特征逻辑回归收敛对比',
        description: '在 MNIST、CIFAR-10 与 IMDB 稀疏词袋特征上，Adam 相比 SGD+Nesterov、AdaGrad 与 RMSProp 展现出最快收敛速度且无需精细微调学习率。',
        headers: ['优化器方案', '稀疏梯度适应性', '初始偏差修正', '100 Epoch 训练损失 (↓)'],
        rows: [
          ['SGD + Nesterov Momentum', '弱 (统一标量步长)', '无', '0.184'],
          ['AdaGrad (累积全部历史平方梯度)', '强 (但后期学习率归零)', '无', '0.142'],
          ['RMSProp (无动量未修正)', '强', '无 (初期易震荡)', '0.095'],
          ['Adam / AdamW (本文方案)', '极强 (自适应信噪比 + 解耦衰减)', '有 (1-β^t 精确修正)', '0.041 (SOTA)']
        ]
      }
    ],
    insights: [
      {
        title: '为什么大模型训练（如 LLaMA / GPT）普遍把 β₂ 从 0.999 改为 0.95？',
        content: '在千亿参数预训练中常出现突发性梯度尖峰（Gradient Spikes）。若 β₂=0.999，二阶矩半衰期长达约 693 步，旧方差记忆过长；将 β₂ 设为 0.95（半衰期约 13.5 步）能让分母 √v̂_t 迅速响应大梯度并自动缩小步长，防止训练崩溃。'
      },
      {
        title: '为什么 L2 正则化不等于 Weight Decay（催生 AdamW）？',
        content: '在标准 Adam 中若直接把 λ||θ||² 加在 Loss 里，权重梯度项 λθ 会被除以 √v̂_t，导致历史梯度大的参数反而受到更小的权重衰减！AdamW 将衰减项直接作用于参数更新步，彻底恢复了正则化一致性。'
      }
    ],
    takeaways: [
      { icon: 'Zap', title: '信噪比自适应步长', desc: 'm̂_t / √v̂_t 本质上是梯度方向确定性（信噪比）的度量，不确定时自动缩减步长。' },
      { icon: 'Shield', title: '偏差修正不可或缺', desc: '缺少 1/(1-β₂^t) 会导致第一步更新步长被放大数十倍，直接引发深层网络梯度爆炸。' },
      { icon: 'Cpu', title: '优化器状态显存账本', desc: 'Adam 的 m_t 和 v_t 占用了混合精度训练中 2/3 的显存（每参数 8 字节），直接推动了 ZeRO 与 8-bit Adam 的诞生。' },
      { icon: 'Sparkles', title: 'AdamW 工业界定局', desc: '现代几乎所有 Transformer 模型跑的都是 Adam 或其解耦权重衰减变体 AdamW。' }
    ]
  },

  'resnet-2015': {
    id: 'resnet-2015',
    title: 'Deep Residual Learning for Image Recognition',
    chineseTitle: 'ResNet 深度残差学习：让千层深度神经网络得以训练的残差连接基石',
    subtitle: 'Kaiming He (何恺明), Xiangyu Zhang, Shaoqing Ren, Jian Sun (孙剑) • Microsoft Research Asia (MSRA) • CVPR 2016 Best Paper',
    tags: ['ResNet 残差网络', 'Skip Connection 恒等捷径', '退化问题 Degradation', '残差映射 F(x)+x', '梯度高速公路'],
    arxivId: '1512.03385',
    pdfUrl: 'https://arxiv.org/pdf/1512.03385.pdf',
    abstractUrl: 'https://arxiv.org/abs/1512.03385',
    summary:
      '整个人工智能历史上被引用次数最高的传奇论文！何恺明团队发现深层网络难以训练的根本原因并非过拟合，而是深层非线性层难以拟合恒等变换导致的「退化问题（Degradation）」。通过引入一行极其简洁的恒等捷径连接 y = F(x, {W_i}) + x，将拟合目标转化为学习残差 F(x) = H(x) - x，让反向传播拥有无损的「梯度高速公路」，不仅将网络深度从 19 层一举推向 152 层乃至 1000 层，更成为今日所有 Transformer（x + Attention(x)）不可动摇的骨架！',
    keyContributions: [
      '揭示并定义了深度网络的「退化现象（Degradation）」：56 层普通网络的训练集误差反而显著高于 20 层网络',
      '提出残差学习块 H(x) = F(x) + x，将学习恒等映射转化为将残差权重推向 0 的简单优化问题',
      '证明恒等捷径连接（Identity Shortcut）既不增加任何额外参数，也不增加乘法计算量，同时保证反向梯度 ∂L/∂x_l = ∂L/∂x_L · (1 + ∂/∂x_l Σ F) 永不消失',
      '设计 1×1 → 3×3 → 1×1 瓶颈结构（Bottleneck），以低于 VGG-19 的计算量实现 152 层超深网络并横扫 ImageNet 与 COCO 全部冠军'
    ],
    coreProblem:
      '即使使用了 Batch Normalization 消除了梯度消失/爆炸，当直接堆叠的普通网络（Plain Network）深度超过 20 层时，训练误差和测试误差同时飙升。这是因为用多层非线性激活层去精确拟合一个恒等映射 H(x) = x 在优化上极其困难。',
    coreIdea:
      '与其强迫堆叠的非线性层直接拟合底层期望映射 H(x)，不如通过跨层跳跃连接（Skip Connection）把输入 x 直接加到输出端，让网络层只负责拟合残差 F(x) = H(x) - x。如果某层是最优恒等变换，优化器只需把残差分支权重逼近 0 即可！',
    simulatorTitle: 'ResNet 残差恒等捷径与深层梯度流实验台',
    simulatorDesc: '对比 Plain Network 与 ResNet 在 18 层至 1000 层下的反向传播梯度范数保持率与训练误差退化曲线。',
    architectureSteps: [
      {
        id: 'res-step-1',
        title: '1. 输入特征分流',
        subtitle: 'Input Feature Forking',
        description: '输入张量 x 同时进入两条路径：主干非线性残差路径 F(x) 与零参数恒等捷径路径（Identity Shortcut）。',
        highlightColor: 'emerald'
      },
      {
        id: 'res-step-2',
        title: '2. 瓶颈残差变换 F(x)',
        subtitle: 'Bottleneck Residual Mapping',
        description: '在 ResNet-50/101/152 中采用 1×1 降维卷积 → 3×3 空间卷积 → 1×1 升维卷积，大幅缩减参数量并提取高阶残差特征。',
        highlightColor: 'cyan'
      },
      {
        id: 'res-step-3',
        title: '3. 逐元素残差相加 y = F(x) + x',
        subtitle: 'Element-wise Residual Addition',
        description: '将残差分支输出 F(x) 与原始输入 x 逐元素相加（维度变化时使用 1×1 投影 W_s x），把优化基准锚定在恒等映射附近。',
        highlightColor: 'amber'
      },
      {
        id: 'res-step-4',
        title: '4. 反向传播无损梯度直通',
        subtitle: 'Unimpeded Backward Gradient Highway',
        description: '根据链式法则，高层梯度 ∂L/∂x_L 可直接通过加号算子中的常数项「1」无损传回任意浅层 ∂L/∂x_l，彻底打破连乘衰减魔咒。',
        highlightColor: 'purple'
      }
    ],
    formulas: [
      {
        id: 'res-f1',
        name: '残差构建块前向方程',
        category: '残差前向传播',
        formula: '\\mathbf{y} = \\mathcal{F}(\\mathbf{x}, \\{W_i\\}) + \\mathbf{x} \\quad (\\text{或投影捷径 } \\mathbf{y} = \\mathcal{F}(\\mathbf{x}, \\{W_i\\}) + W_s\\mathbf{x})',
        explanation: '网络层仅需学习残差函数 F(x) = H(x) - x，当恒等映射最优时只需令 W_i → 0。',
        variables: [
          { symbol: '\\mathbf{x}, \\mathbf{y}', desc: '第 l 个残差块的输入与输出激活向量' },
          { symbol: '\\mathcal{F}(\\mathbf{x}, \\{W_i\\})', desc: '待学习的残差映射（如两层或三层卷积）' }
        ]
      },
      {
        id: 'res-f2',
        name: '跨任意深度的递归展开与梯度恒等直通律',
        category: '反向梯度传播',
        formula: '\\mathbf{x}_L = \\mathbf{x}_l + \\sum_{i=l}^{L-1} \\mathcal{F}(\\mathbf{x}_i, \\mathcal{W}_i) \\implies \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{x}_l} = \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{x}_L} \\left( \\mathbf{I} + \\frac{\\partial}{\\partial \\mathbf{x}_l} \\sum_{i=l}^{L-1} \\mathcal{F}(\\mathbf{x}_i, \\mathcal{W}_i) \\right)',
        explanation: '括号内的单位矩阵 I 保证了无论网络叠到 152 层还是 1000 层，误差梯度都能不经任何矩阵连乘衰减直达最底层。',
        variables: [
          { symbol: '\\mathbf{x}_l, \\mathbf{x}_L', desc: '浅层 l 与深层 L 的特征表示' },
          { symbol: '\\mathbf{I}', desc: '由恒等捷径产生的单位雅可比项，保障梯度永不消失' }
        ]
      }
    ],
    metricCards: [
      { label: 'ImageNet Top-5 错误率', value: '3.57% (超越人类)', desc: '斩获 ILSVRC 2015 分类、检测、定位及 COCO 全部第一名', color: 'emerald' },
      { label: '最大成功训练深度', value: '152 层 ~ 1202 层', desc: '突破此前 VGG 19 层极限，首次实现超百层深度网络稳定收敛', color: 'cyan' },
      { label: '计算复杂度 (vs VGG-19)', value: '11.3B vs 19.6B FLOPs', desc: '152 层 ResNet 的浮点计算量反而比 19 层 VGG 少 42%', color: 'amber' },
      { label: '现代架构渗透率', value: '100% 深度模型标配', desc: 'Transformer 每个子层 x + SubLayer(LN(x)) 的核心支撑', color: 'purple' }
    ],
    experimentSections: [
      {
        title: 'Plain 普通网络 vs ResNet 残差网络深度消融对比 (ImageNet)',
        description: '普通网络从 18 层增至 34 层时错误率反而恶化（退化现象），而 ResNet 随深度增加单调提升精度。',
        headers: ['模型架构与深度', '参数量 / FLOPs', 'ImageNet Top-1 错误率 (↓)', '深层收敛特性'],
        rows: [
          ['Plain-18 (无残差连接)', '11.7M / 1.8B', '27.94%', '正常收敛'],
          ['Plain-34 (无残差连接)', '21.8M / 3.6B', '28.54% (反升0.6%!)', '严重退化，训练误差高于18层'],
          ['ResNet-34 (恒等捷径)', '21.8M / 3.6B', '25.03% (降3.51%)', '消除退化，深层显著获益'],
          ['ResNet-152 (Bottleneck 本文旗舰)', '60.2M / 11.3B', '19.38% (SOTA)', '152层极速收敛，精度碾压VGG']
        ]
      }
    ],
    insights: [
      {
        title: '为什么现代大模型全部采用 Pre-LN 残差结构 (x + SubLayer(LN(x)))？',
        content: '在何恺明随后的续作《Identity Mappings in Deep Residual Networks》(ECCV 2016) 中证明：只有当捷径路径上没有任何激活函数或归一化算子（Clean Identity Path）时，梯度才能从第 L 层无阻尼直达第 1 层。这正是 GPT-2/3 与 LLaMA 全面改用 Pre-Norm 的直接理论来源！'
      },
      {
        title: '残差网络本质上是浅层网络的指数级集成（Ensemble）',
        content: '将 L 个残差块展开后共有 2^L 条不同长度的隐式路径连接输入与输出，使深层网络在训练初期优先通过短路径快速收敛，随后逐步激活深层非线性精细表征。'
      }
    ],
    takeaways: [
      { icon: 'GitMerge', title: '一行加法改变AI史', desc: '把输入 x 加回输出端，彻底攻克深度神经网络层数叠不起来的世纪难题。' },
      { icon: 'Activity', title: '加法替代乘法传梯度', desc: '链式法则中的单位矩阵 +I 让反向传播从连乘衰减变为无损加法汇总。' },
      { icon: 'Layers', title: 'Transformer 的隐形脊梁', desc: '没有残差连接，96 层的 GPT-3 或 126 层的 LLaMA-3 根本无法完成哪怕一步有效训练。' },
      { icon: 'Award', title: 'AI 历史引用之王', desc: '单篇引用超 22 万次，位列二十一世纪全科学领域最高被引论文前列。' }
    ]
  },

  'zero-2019': {
    id: 'zero-2019',
    title: 'ZeRO: Memory Optimizations Toward Training Trillion Parameter Models',
    chineseTitle: 'ZeRO 零冗余优化器与分布式并行：突破万亿参数大模型训练显存墙 (DeepSpeed & Megatron-LM)',
    subtitle: 'Samyam Rajbhandari, Jeff Rasley, Olatunji Ruwase, Yuxiong He • Microsoft DeepSpeed Team & NVIDIA Megatron-LM • SC 2020',
    tags: ['ZeRO 零冗余优化器', 'DeepSpeed', 'Stage 1/2/3 状态分片', '混合精度 16Ψ 显存账本', 'Megatron 张量并行'],
    arxivId: '1910.02054',
    pdfUrl: 'https://arxiv.org/pdf/1910.02054.pdf',
    abstractUrl: 'https://arxiv.org/abs/1910.02054',
    summary:
      '现代多卡集群分布式训练大模型的核心引擎（DeepSpeed ZeRO 与 PyTorch FSDP 的共同基石）！论文首先算清了混合精度训练的显存总账：一个参数量为 Ψ 的模型需要 16Ψ 字节状态显存（2Ψ FP16参数 + 2Ψ FP16梯度 + 12Ψ FP32备份与Adam状态），传统数据并行（DP）在每张 GPU 上完整复制这 16Ψ 状态造成极度冗余。ZeRO 提出将优化器状态（Stage 1）、梯度（Stage 2）与模型参数（Stage 3）分片（Shard）到 N_d 张数据并行卡上，以仅 1.5x 的集合通信开销实现 N_d 倍线性显存削减，配合 Megatron-LM（1909.08053）张量并行让单集群训练千亿至万亿参数模型成为现实！',
    keyContributions: [
      '精准剖析混合精度训练显存分布：优化器状态（FP32 Master Weights + m_t + v_t = 12Ψ）独占 75% 模型状态显存',
      '提出 ZeRO-1/2/3 三级渐进式分片架构，分别实现 4x、8x 与 N_d 倍（随 GPU 数量线性扩展）的模型状态显存压缩',
      '证明 ZeRO-1 与 ZeRO-2 的通信量与标准数据并行 All-Reduce 完全相同（2Ψ），无任何额外通信惩罚',
      '与 NVIDIA Megatron-LM（1909.08053 层内列并行+行并行切分）共同构成现代 3D 并行（DP/ZeRO + TP + PP）工业训练标准'
    ],
    coreProblem:
      '训练 GPT-3 规模（175B 参数）模型时，仅保存 FP16 参数（350GB）、FP16 梯度（350GB）和 Adam FP32 状态（2100GB）就需要高达 2.8TB 的模型状态显存，远超任何单张 80GB H100/A100 显卡容量；而传统数据并行在每张卡上重复存储相同副本，造成 98% 以上的显存浪费。',
    coreIdea:
      '既然数据并行中有 N_d 张卡，为什么每张卡都要存全套状态？将优化器状态、梯度和参数切分成 N_d 份，每张 GPU 只持久保存并更新属于自己的 1/N_d 分片！在前向和反向计算需要完整某层权重时，通过高速 All-Gather 临时拼齐，算完立刻释放（用完即焚）。',
    simulatorTitle: 'ZeRO-1/2/3 显存分片与 3D 分布式并行账本计算器',
    simulatorDesc: '调节模型参数规模 Ψ (7B~1000B)、数据并行卡数 N_d 与 ZeRO 阶段，实时计算单卡显存占用与集合通信开销。',
    architectureSteps: [
      {
        id: 'zero-step-1',
        title: '1. 混合精度 16Ψ 显存解剖',
        subtitle: 'Mixed-Precision 16Ψ Memory Breakdown',
        description: '对每个参数 Ψ：FP16 权重占 2B，FP16 梯度占 2B，而 Adam 优化器需维护 FP32 主权重 (4B)、一阶动量 m_t (4B) 与二阶方差 v_t (4B)，合计 (2+2+12)Ψ = 16Ψ 字节。',
        highlightColor: 'emerald'
      },
      {
        id: 'zero-step-2',
        title: '2. ZeRO-Stage 1 (Pos): 优化器状态分片',
        subtitle: 'Optimizer State Partitioning (4x Reduction)',
        description: '将 12Ψ 的 Adam FP32 状态均分到 N_d 张卡上，每卡仅存 12Ψ/N_d。单卡显存从 16Ψ 骤降至 4Ψ + 12Ψ/N_d（立省 4 倍），且通信量零增加！',
        highlightColor: 'cyan'
      },
      {
        id: 'zero-step-3',
        title: '3. ZeRO-Stage 2 (Pos+g): 梯度与优化器分片',
        subtitle: 'Gradient + Optimizer Partitioning (8x Reduction)',
        description: '反向传播算出某层梯度后，通过 Reduce-Scatter 仅将对应分片聚合到责任卡上，非责任分片当场释放。单卡显存降至 2Ψ + 14Ψ/N_d（节省 8 倍）。',
        highlightColor: 'amber'
      },
      {
        id: 'zero-step-4',
        title: '4. ZeRO-Stage 3 / FSDP: 全参数分片',
        subtitle: 'Full Parameter Sharding (Linear N_d Scaling)',
        description: '连 2Ψ 的模型权重也分片存储！前向/反向逐层执行 All-Gather 广播权重，计算完毕立即丢弃，单卡状态显存降至 16Ψ/N_d。',
        highlightColor: 'purple'
      }
    ],
    formulas: [
      {
        id: 'zero-f1',
        name: '混合精度训练单卡模型状态显存方程',
        category: '显存账本建模',
        formula: 'M_{\\text{DP}} = \\underbrace{2\\Psi}_{\\text{FP16 } W} + \\underbrace{2\\Psi}_{\\text{FP16 } G} + \\underbrace{(4\\Psi + 4\\Psi + 4\\Psi)}_{\\text{FP32 Master } W, m_t, v_t} = 16\\Psi \\text{ Bytes}',
        explanation: '揭示了为什么 7B 模型微调/预训练在单卡上仅模型状态就需要 7 × 16 = 112 GB 显存。',
        variables: [
          { symbol: '\\Psi', desc: '模型总参数量（如 7B = 7×10^9）' },
          { symbol: '12\\Psi', desc: 'Adam FP32 优化器状态开销，占总状态显存的 75%' }
        ]
      },
      {
        id: 'zero-f2',
        name: 'ZeRO 三阶段单卡显存与通信开销定律',
        category: '分布式分片定律',
        formula: 'M_{\\text{ZeRO-1}} = 4\\Psi + \\frac{12\\Psi}{N_d}, \\quad M_{\\text{ZeRO-2}} = 2\\Psi + \\frac{14\\Psi}{N_d}, \\quad M_{\\text{ZeRO-3}} = \\frac{16\\Psi}{N_d}',
        explanation: '随数据并行度 N_d 增加，ZeRO-3 将单卡显存需求降低 N_d 倍，通信量仅从 2Ψ 温和增至 3Ψ。',
        variables: [
          { symbol: 'N_d', desc: '数据并行 GPU 数量' },
          { symbol: '3\\Psi', desc: 'ZeRO-3 每步总通信量（前向 All-Gather + 反向 All-Gather + 梯度 Reduce-Scatter）' }
        ]
      }
    ],
    metricCards: [
      { label: '最大可训练模型规模', value: '1 Trillion+ (万亿参数)', desc: '在 400 张 GPU 上即可容纳超万亿参数模型状态', color: 'emerald' },
      { label: 'ZeRO-1/2/3 显存缩减比', value: '4x / 8x / N_d 倍', desc: '彻底消除数据并行中的冗余状态副本', color: 'cyan' },
      { label: 'ZeRO-1/2 额外通信代价', value: '0% (与标准DP相同)', desc: '用 Reduce-Scatter + All-Gather 完美平替 All-Reduce', color: 'amber' },
      { label: '集群吞吐扩展效率', value: '15 PetaFLOPS (超线性)', desc: '省下的显存允许更大 Batch Size，大幅提升 GPU 计算利用率', color: 'purple' }
    ],
    experimentSections: [
      {
        title: '不同并行策略下 100B 模型在 64 张 GPU 上的单卡状态显存对比',
        description: '对比标准 PyTorch DDP 与 ZeRO-1/2/3 在 1000 亿参数模型（总状态 1600 GB）下的单卡显存占用与通信量。',
        headers: ['分布式方案', '单卡状态显存 (100B, N_d=64)', '每步通信总量', '32GB/80GB 显卡可训练性'],
        rows: [
          ['标准数据并行 (DDP)', '1600.0 GB (OOM!)', '2Ψ (All-Reduce)', '完全爆显存无法启动'],
          ['ZeRO-Stage 1 (分片优化器)', '418.8 GB', '2Ψ (零额外通信)', '需配合张量并行 TP=8'],
          ['ZeRO-Stage 2 (分片优化器+梯度)', '221.9 GB', '2Ψ (零额外通信)', '需配合张量并行 TP=4'],
          ['ZeRO-Stage 3 / FSDP (本文全分片)', '25.0 GB (缩减 64 倍!)', '3Ψ (+1.5x 通信)', '单卡 80GB 轻松容纳并留出充裕激活空间']
        ]
      }
    ],
    insights: [
      {
        title: 'ZeRO 与 Megatron-LM 张量并行（TP）是如何分工协作的？',
        content: 'Megatron-LM (1909.08053) 在节点内（NVLink 高带宽）把单层大矩阵按列和行切分（Tensor Parallelism），解决单层计算与激活显存过大的问题；而 ZeRO 在节点间（InfiniBand）跨数据并行组切分状态，两者结合加上流水线并行（PP）构成了今日所有大模型训练的 3D Parallelism 标准。'
      },
      {
        title: '为什么 All-Reduce 在数学上等价于 Reduce-Scatter + All-Gather？',
        content: '传统 DDP 用 All-Reduce 让每张卡都拿到完整梯度并各自更新完整权重；ZeRO-2 洞察到只需先做前半段 Reduce-Scatter 让每张卡更新自己那 1/N_d 的权重，再做后半段 All-Gather 同步最新权重——总通信字节完全不变（2Ψ），却白赚了 8 倍显存节省！'
      }
    ],
    takeaways: [
      { icon: 'Database', title: '16Ψ 显存铁律', desc: '记住混合精度训练公式：2Ψ(W) + 2Ψ(G) + 12Ψ(Adam) = 16Ψ 字节，这是切分集群算力的第一性原理。' },
      { icon: 'Layers', title: '消除冗余而非妥协精度', desc: 'ZeRO 在数学上与单机全量训练 100% 等价，不损失任何数值精度。' },
      { icon: 'Share2', title: 'PyTorch FSDP 的原型', desc: 'PyTorch 官方内置的 FullyShardedDataParallel (FSDP) 正是直接采纳了 ZeRO-Stage 3 的架构设计。' },
      { icon: 'Cpu', title: '与 Megatron-LM 珠联璧合', desc: '节点内跑 Megatron 张量并行，节点间跑 DeepSpeed ZeRO，是万卡集群的标准拓扑。' }
    ]
  },

  'chinchilla-2022': {
    id: 'chinchilla-2022',
    title: 'Training Compute-Optimal Large Language Models (Chinchilla)',
    chineseTitle: 'Chinchilla 算力最优扩展定律：颠覆大模型参数与训练数据配比法则',
    subtitle: 'Jordan Hoffmann, Sebastian Borgeaud, Arthur Mensch, Laurent Sifre et al. • DeepMind • NeurIPS 2022',
    tags: ['Chinchilla Scaling Laws', '算力最优 C≈6ND', 'D ≈ 20N 黄金配比', '参数规模 vs 数据量', '推翻 Kaplan 定律'],
    arxivId: '2203.15556',
    pdfUrl: 'https://arxiv.org/pdf/2203.15556.pdf',
    abstractUrl: 'https://arxiv.org/abs/2203.15556',
    summary:
      '彻底改写全球大模型研发路线图、买卡与买数据预算分配的里程碑论文！此前 OpenAI 的 Kaplan 扩展定律（2020）认为算力增加 10 倍应将模型参数放大 5.5 倍而数据仅增加 1.8 倍，导致业界盲目追求巨型参数（如 175B GPT-3、280B Gopher 却只训了 300B Tokens）。DeepMind 训练了超过 400 个不同尺寸模型后严格证明：模型参数量 N 与训练 Token 数 D 应当【等比例同步放大】（每个参数约匹配 20 个训练 Token）！据此训练的 70B Chinchilla（1.4T Tokens）在消耗完全相同训练算力下全面碾压 4 倍规模的 280B Gopher，同时将推理成本直降 75%！',
    keyContributions: [
      '修正了 OpenAI Kaplan 定律因固定学习率余弦周期导致的系统性偏差，确立 N_opt ∝ C^{0.5}、D_opt ∝ C^{0.5} 的等比例扩展法则',
      '提出参数化损失预测方程 L(N, D) = E + A/N^α + B/D^β，精准量化模型容量瓶颈、数据不足瓶颈与自然语言固有熵',
      '确立大模型工程黄金经验法则：算力最优训练要求 D ≈ 20N（每 1B 参数至少喂入 20B 高质量 Tokens）',
      '实证训练出 70B 参数 Chinchilla（配 1.4T Tokens），在与 280B Gopher（300B Tokens）相同 FLOPs 下实现 MMLU 67.5% (+7.6% 跃升)'
    ],
    coreProblem:
      '2020-2022 年间，各大实验室遵循 Kaplan 定律将算力预算几乎全砸向扩充参数量（175B GPT-3、280B Gopher、530B MT-NLG），而训练数据量全部停滞在 300B Tokens 左右，导致这些巨无霸模型处于严重的「欠训练（Under-trained）」状态，不仅未发挥算力潜力，还造成推理部署成本奇高。',
    coreIdea:
      '在给定总训练算力预算 C ≈ 6ND (FLOPs) 的约束下求解最小化交叉熵损失 L(N, D)。当余弦学习率衰减周期精确匹配真实训练总步数时，算力每增加 10 倍，模型参数量 N 与训练数据 Token 数 D 必须各自放大 √10 ≈ 3.16 倍。',
    simulatorTitle: 'Chinchilla 算力最优配比 (N vs D) 与过训练权衡模拟器',
    simulatorDesc: '输入算力预算 C (FLOPs) 或目标参数规模 N，对比 Kaplan 旧定律、Chinchilla 算力最优与 LLaMA 推理最优配比。',
    architectureSteps: [
      {
        id: 'chin-step-1',
        title: '1. 训练算力硬约束建模 C ≈ 6ND',
        subtitle: 'IsoFLOP Compute Constraint',
        description: 'Transformer 每个参数在每个 Token 上的前向传播约需 2 FLOPs，反向传播约需 4 FLOPs，总训练算力 C = 6 · N · D。',
        highlightColor: 'emerald'
      },
      {
        id: 'chin-step-2',
        title: '2. 固定算力切片实验 (IsoFLOP Profiles)',
        subtitle: '400+ Model IsoFLOP Sweeps',
        description: '在 9 个固定 FLOPs 档位下，变动模型尺寸 N（70M 至 16B）与对应 Token 数 D = C/(6N)，拟合每个算力档位的 U 型损失曲线最低点。',
        highlightColor: 'cyan'
      },
      {
        id: 'chin-step-3',
        title: '3. 双幂律损失曲面拟合 L(N, D)',
        subtitle: 'Parametric Loss Surface Fitting',
        description: '利用 L-BFGS 拟合 L(N,D) = E + A/N^α + B/D^β，得出 α ≈ 0.34, β ≈ 0.28，证明参数与数据对降低 Loss 的边际贡献几乎相等。',
        highlightColor: 'amber'
      },
      {
        id: 'chin-step-4',
        title: '4. 算力最优与推理最优演进',
        subtitle: 'Compute-Optimal vs Inference-Optimal (LLaMA)',
        description: '按 D ≈ 20N 训练 70B Chinchilla 超越 280B Gopher；并启发后续 LLaMA 将数据拉高至 200N~1000N，用训练算力换取极致小模型推理性能。',
        highlightColor: 'purple'
      }
    ],
    formulas: [
      {
        id: 'chin-f1',
        name: 'Chinchilla 双变量幂律损失方程',
        category: '扩展定律建模',
        formula: 'L(N, D) = E + \\frac{A}{N^\\alpha} + \\frac{B}{D^\\beta} \\quad (E=1.69,\\; A=406.4,\\; B=410.7,\\; \\alpha=0.34,\\; \\beta=0.28)',
        explanation: '任何有限规模与有限数据的语言模型损失都由三部分相加：自然语言不可约熵 E、有限参数近似误差 A/N^α 与有限样本估计误差 B/D^β。',
        variables: [
          { symbol: 'N', desc: '模型参数量（Parameters）' },
          { symbol: 'D', desc: '训练数据总词元数（Training Tokens）' },
          { symbol: 'E', desc: '无限大模型在无限数据上的自然语言理论下界熵 (1.69 nats)' }
        ]
      },
      {
        id: 'chin-f2',
        name: '算力约束下的拉格朗日最优分配解',
        category: '最优资源分配',
        formula: '\\min_{N, D} L(N, D) \\;\\text{ s.t. }\\; 6ND = C \\implies N_{\\text{opt}}(C) \\propto C^{\\frac{\\beta}{\\alpha+\\beta}} \\approx C^{0.50}, \\quad D_{\\text{opt}}(C) \\propto C^{\\frac{\\alpha}{\\alpha+\\beta}} \\approx C^{0.50}',
        explanation: '推导出最优配比系数 D_opt ≈ 20 × N_opt，即每 10 亿参数应匹配约 200 亿训练 Token。',
        variables: [
          { symbol: 'C', desc: '总训练浮点预算（FLOPs），满足 C ≈ 6ND' },
          { symbol: 'D_{\\text{opt}} / N_{\\text{opt}}', desc: '黄金 Token/Parameter 比值 ≈ 20:1' }
        ]
      }
    ],
    metricCards: [
      { label: '黄金 Token/参数配比', value: 'D ≈ 20 × N', desc: '每 1B 参数至少需要 20B 训练 Tokens 才能达到算力最优', color: 'emerald' },
      { label: 'Chinchilla (70B) MMLU', value: '67.5% (+7.6%)', desc: '以 1/4 参数量大幅超越同算力的 280B Gopher (59.9%)', color: 'cyan' },
      { label: '在线推理显存与成本', value: '直降 75% (4倍加速)', desc: '70B 模型仅需 1/4 显卡即可部署，吞吐量提升 4 倍', color: 'amber' },
      { label: '拟合实验模型总数', value: '400+ 组预训练模型', desc: '横跨 70M 到 16B 参数、9 个算力数量级的严密实证', color: 'purple' }
    ],
    experimentSections: [
      {
        title: '同等训练算力 (C ≈ 5.76 × 10²³ FLOPs) 下各大旗舰模型配比与性能对比',
        description: '证明在相同算力预算下，削减虚胖参数并补充 4.6 倍训练数据能同时赢得更高智能与更低推理成本。',
        headers: ['模型名称', '参数规模 N', '训练数据量 D (Tokens)', 'MMLU 5-shot 准确率 (↑)'],
        rows: [
          ['GPT-3 (OpenAI, Kaplan配比)', '175B (严重欠训练)', '300B (仅 1.7 Tokens/Param)', '43.9%'],
          ['Gopher (DeepMind, 旧配比)', '280B (严重欠训练)', '300B (仅 1.1 Tokens/Param)', '60.0%'],
          ['MT-NLG (Megatron-Turing)', '530B (极度欠训练)', '270B (仅 0.5 Tokens/Param)', '56.5%'],
          ['Chinchilla (本文算力最优配比)', '70B (参数缩减75%)', '1,400B (20 Tokens/Param)', '67.5% (全线超越!)']
        ]
      }
    ],
    insights: [
      {
        title: '为什么 Kaplan (2020) 当年算错了缩放指数？',
        content: 'Kaplan 实验对所有训练步数都使用了固定的长周期余弦学习率衰减，导致短步数小数据实验在训练结束时学习率未能充分衰减到 0，人为高估了大参数在少数据下的优势。Hoffmann 等人确保每次实验的余弦周期 T 严格等于总训练 Token 数 D，一举纠正了这一历史偏差。'
      },
      {
        title: '从 Chinchilla 训练最优到 LLaMA-3 推理最优（Over-training）',
        content: 'Chinchilla 优化的是「训练算力 C_train 最小」，但在工业服务中模型训一次却要被亿万用户推理调用。因此 LLaMA-3 8B 甚至喂了 15T Tokens（D ≈ 1875N），用超额训练算力把 8B 小模型压榨到极致，以节省长期推理电费。'
      }
    ],
    takeaways: [
      { icon: 'Scale', title: '买卡与买数据按这篇算', desc: '算力翻 10 倍，参数 N 和数据 D 必须各翻 3.16 倍，单堆参数只会造出昂贵的欠训练模型。' },
      { icon: 'TrendingUp', title: '70B 击败 280B 的奇迹', desc: '给 70B 喂饱 1.4T 数据，不仅智商全面超越 280B，推理显存还立省 3/4。' },
      { icon: 'Database', title: '引爆高质量数据争夺战', desc: 'Chinchilla 之后，全球大模型竞争重心从「谁能堆出万亿稠密参数」全面转向「谁能洗出十万亿高质量 Token」。' },
      { icon: 'Cpu', title: '开启小而精的开源纪元', desc: '直接启发了 LLaMA、Mistral 与 Qwen 系列用海量 Token 精炼 7B~70B 黄金尺寸模型。' }
    ]
  },

  'rope-2021': {
    id: 'rope-2021',
    title: 'RoFormer: Enhanced Transformer with Rotary Position Embedding (RoPE)',
    chineseTitle: 'RoPE 旋转位置编码：以复数平面旋转统一绝对与相对位置的大模型默认标准',
    subtitle: 'Jianlin Su (苏剑林), Yu Lu, Shengfeng Pan, Ahmed Murtadha, Bo Wen, Yunfeng Liu • Zhuiyi Technology (追一科技) • arXiv 2021',
    tags: ['RoPE 旋转位置编码', '用绝对旋转实现相对位置', '复数内积 Re[q·k*·e^{i(m-n)θ}]', '远程衰减特性', 'NTK/YaRN 长上下文外推'],
    arxivId: '2104.09864',
    pdfUrl: 'https://arxiv.org/pdf/2104.09864.pdf',
    abstractUrl: 'https://arxiv.org/abs/2104.09864',
    summary:
      '2021 年之后几乎所有开源与商业大语言模型（LLaMA 1/2/3、Mistral、Qwen、DeepSeek、PaLM、Gemma）统一采用的默认位置编码标准！苏剑林团队从数学第一性原理出发，求解「什么样的位置编码操作 f(q, m) 与 f(k, n) 能使其内积 ⟨f(q, m), f(k, n)⟩ 仅依赖于词向量本身与相对距离 (m - n)」这一函数方程，推导出极其优雅的二维复平面旋转变换 e^{imθ}。RoPE 以绝对位置旋转的形式直接在 Q 和 K 上原位计算，却在点积注意力中精确等价于相对位置编码，完美兼容 FlashAttention 与 KV Cache，并天然具备随距离增加的远程衰减特性！',
    keyContributions: [
      '从内积相对位置不变性公理 ⟨f_q(x_m, m), f_k(x_n, n)⟩ = g(x_m, x_n, m-n) 严格推导出复数指数旋转解 f(x, m) = Wx · e^{imθ}',
      '将 d 维特征空间切分为 d/2 个二维正交子空间，以几何级数频率 θ_i = 10000^{-2(i-1)/d} 执行块对角二维旋转',
      '利用正交旋转矩阵性质 R_m^T R_n = R_{n-m}，无需显式构造 O(N²) 相对位置偏置矩阵，完美兼容线性注意力与 KV 缓存',
      '通过阿贝尔变换严格证明 RoPE 具有随相对距离 |m-n| 增大的自然远程注意力衰减包络，并奠定了后续 NTK-Aware / YaRN 百万长文本外推基础'
    ],
    coreProblem:
      '原始 Transformer 的正余弦绝对位置编码（直接加在词嵌入上 x_m + p_m）无法在自注意力点积中纯粹表达相对距离 m-n，且长度外推能力极差；而经典的相对位置编码（如 Shaw et al. 或 T5 Bias）需要在注意力矩阵上显式维护 O(N²) 的相对距离张量，破坏了 KV Cache 复用效率。',
    coreIdea:
      '不要把位置向量「加」在词向量上，而是把词向量的每两个相邻维度看作二维平面（或复平面）上的一个向量，根据它所处的绝对位置 m 将其逆时针旋转 m·θ 弧度！当位置 m 的 Query（旋转了 mθ）与位置 n 的 Key（旋转了 nθ）做内积时，两个向量的夹角恰好只取决于它们的旋转角之差 (m - n)θ！',
    simulatorTitle: 'RoPE 二维复平面旋转与 NTK 长上下文缩放实验台',
    simulatorDesc: '交互式调节 Token 位置 m 与 n、旋转基频 b (10k~1M) 及 NTK 缩放系数，实时可视化旋转夹角 (m-n)θ 与远程衰减曲线。',
    architectureSteps: [
      {
        id: 'rope-step-1',
        title: '1. 维度两两分组构造复数平面',
        subtitle: '2D Subspace Pairing',
        description: '将 d 维的 Query 或 Key 向量拆分为 d/2 对二维坐标 [(q_0, q_1), (q_2, q_3), ..., (q_{d-2}, q_{d-1})]，每一对对应一个二维平面向量。',
        highlightColor: 'emerald'
      },
      {
        id: 'rope-step-2',
        title: '2. 多尺度几何级数旋转角分配',
        subtitle: 'Multi-Frequency Geometric Angles',
        description: '为第 i 个二维子空间分配旋转角速度 θ_i = b^{-2(i-1)/d}（默认基频 b=10000）：低维高频捕捉局部短距离语法，高维低频捕捉长程全局语义。',
        highlightColor: 'cyan'
      },
      {
        id: 'rope-step-3',
        title: '3. 绝对位置正交旋转注入',
        subtitle: 'Orthogonal Rotation Injection',
        description: '在位置 m 处利用稀疏乘法 (q ⊙ cos mθ + q_⊥ ⊙ sin mθ) 仅对 Q 和 K 执行原位旋转（不改变向量模长 ||R_m q|| = ||q||，且不对 V 旋转）。',
        highlightColor: 'amber'
      },
      {
        id: 'rope-step-4',
        title: '4. 点积自动坍缩为相对距离 (n-m)θ',
        subtitle: 'Relative Distance Collapse in Dot-Product',
        description: '计算注意力得分 (R_m q)^T (R_n k) = q^T R_m^T R_n k = q^T R_{n-m} k，绝对位置 m 和 n 自动抵消为相对位移 n - m！',
        highlightColor: 'purple'
      }
    ],
    formulas: [
      {
        id: 'rope-f1',
        name: '二维复平面旋转算子与内积相对不变性恒等式',
        category: '核心旋转方程',
        formula: 'f_{\\{q,k\\}}(\\mathbf{x}_m, m) = R^d_{\\Theta, m} W_{\\{q,k\\}}\\mathbf{x}_m, \\quad \\langle R^d_{\\Theta, m}\\mathbf{q},\\; R^d_{\\Theta, n}\\mathbf{k} \\rangle = \\mathbf{q}^T R^d_{\\Theta, n-m} \\mathbf{k}',
        explanation: '正交旋转矩阵的转置乘积等于角度相减后的旋转矩阵，从而用 O(N) 的绝对位置操作精确实现了 O(N²) 的相对位置注意力。',
        variables: [
          { symbol: 'R^d_{\\Theta, m}', desc: '由 d/2 个 2×2 旋转块组成的块对角正交矩阵' },
          { symbol: 'n - m', desc: 'Key 与 Query 之间的相对 Token 距离' }
        ]
      },
      {
        id: 'rope-f2',
        name: '高效稀疏实现与多频段角速度公式',
        category: '工程实现公式',
        formula: 'R^d_{\\Theta, m}\\mathbf{x} = \\mathbf{x} \\odot \\cos(m\\Theta) + \\tilde{\\mathbf{x}} \\odot \\sin(m\\Theta), \\quad \\theta_i = b^{-2(i-1)/d} \\; (b = 10000 \\to 500000)',
        explanation: '实际代码中无需构造大矩阵，仅需两次逐元素乘法即可完成旋转；调大基频 b（如 LLaMA-3 设为 500,000）即可扩展上下文窗口。',
        variables: [
          { symbol: '\\tilde{\\mathbf{x}}', desc: '将相邻两维交换并取反 [-x_1, x_0, -x_3, x_2, ...] 的正交伴随向量' },
          { symbol: 'b', desc: '旋转基频 Base（标准为 10000，长文本 NTK 扩窗常调至 500k~1M）' }
        ]
      }
    ],
    metricCards: [
      { label: '现代开源大模型采用率', value: '> 95% (绝对标准)', desc: 'LLaMA 1/2/3、Qwen、DeepSeek、Mistral、Gemma 全系标配', color: 'emerald' },
      { label: 'KV Cache 兼容性', value: '100% 零重算缓存', desc: '历史 Token 的旋转后 Key 可直接存入缓存，无需随新位置重算', color: 'cyan' },
      { label: '位置编码额外参数量', value: '0 参数 (纯解析三角函数)', desc: '不占用任何可学习参数，且严格保持 Query/Key 向量 L2 范数不变', color: 'amber' },
      { label: '长文本外推扩展潜力', value: '4K ➔ 128K ~ 2M', desc: '配合 Position Interpolation / NTK-Aware / YaRN 轻松实现百倍扩窗', color: 'purple' }
    ],
    experimentSections: [
      {
        title: '主流位置编码范式机制与长文本检索表现对比',
        description: '对比 Sinusoidal 绝对编码、T5 相对偏置、ALiBi 与 RoPE 在相对距离建模、KV Cache 兼容度及长文档任务上的综合表现。',
        headers: ['位置编码方案', '相对距离表达能力', 'KV Cache 与 FlashAttention 兼容', '长文档 CAIL 准确率 (↑)'],
        rows: [
          ['Sinusoidal 绝对编码 (Vaswani 2017)', '弱 (耦合交叉项)', '完全兼容 O(N)', '64.2%'],
          ['Learnable 绝对编码 (BERT/GPT-2)', '无 (无法超出训练长度)', '完全兼容 O(N)', '63.8% (超长截断)'],
          ['T5 Relative Bias (显式偏置矩阵)', '强 (分桶偏置)', '差 (需额外 O(N²) 偏置读取)', '67.9%'],
          ['RoPE 旋转位置编码 (本文方案)', '精确内积相对依赖 + 远程衰减', '100% 原生兼容 (零开销)', '71.4% (SOTA)']
        ]
      }
    ],
    insights: [
      {
        title: '为什么 RoPE 对 KV Cache 如此友好？',
        content: '如果采用传统相对位置编码，每当生成第 t+1 个新词时，之前所有历史词相对于当前词的距离都变了，必须重新计算位置编码；而 RoPE 将绝对位置 m 直接旋转进 Key_m 中存入缓存，新词 Query_n 只需自己旋转 nθ 再与缓存做点积，就能自动算出 (n-m)θ！'
      },
      {
        title: '为什么把 RoPE 基频 b 从 10,000 调大到 500,000 (NTK Scaling) 就能扩充上下文？',
        content: '当序列长度超过预训练窗口时，低频维度的旋转角度 mθ_i 超出了模型见过的值域（Out-of-Distribution）。增大基频 b 相当于减慢所有低频指针的旋转角速度，将更长的序列压缩回模型熟悉的相位区间内，同时保留高频维度的局部辨识度。'
      }
    ],
    takeaways: [
      { icon: 'Compass', title: '绝对形式，相对灵魂', desc: '用 O(N) 的绝对位置旋转操作，精确实现了 O(N²) 的内积相对位置编码。' },
      { icon: 'Shield', title: '范数守恒的正交变换', desc: '只改变向量相位角而不改变向量模长，彻底避免了加性位置编码污染词义特征。' },
      { icon: 'TrendingDown', title: '天然远程注意力衰减', desc: '多频余弦波叠加产生的相消干涉，让距离越远的 Token 默认相关性上限自然衰减。' },
      { icon: 'Sparkles', title: '大模型长上下文基石', desc: '今日几乎所有 128K~1M 上下文窗口技术（YaRN、LongRoPE）都是在调校 RoPE 的频率谱。' }
    ]
  },

  'qlora-2023': {
    id: 'qlora-2023',
    title: 'QLoRA: Efficient Finetuning of Quantized LLMs',
    chineseTitle: 'QLoRA 量化低秩微调：单张 48GB 显卡微调 65B 大模型的开源微调破局之作',
    subtitle: 'Tim Dettmers, Artidoro Pagnoni, Ari Holtzman, Luke Zettlemoyer • University of Washington • NeurIPS 2023',
    tags: ['QLoRA', '4-bit NormalFloat (NF4)', 'Double Quantization 双重量化', 'Paged Optimizers 分页优化器', '单卡微调 65B'],
    arxivId: '2305.14314',
    pdfUrl: 'https://arxiv.org/pdf/2305.14314.pdf',
    abstractUrl: 'https://arxiv.org/abs/2305.14314',
    summary:
      '彻底推动全球开源社区大模型微调平民化的里程碑论文！此前全量微调 65B 模型需要超过 780GB 显存（至少 10 张 80GB A100），即便普通 16-bit LoRA 也无法塞进单张消费级/工作站显卡。QLoRA 提出将预训练底座权重冻结并量化为信息论最优的「4-bit NormalFloat (NF4)」格式，配合对量化常数再次量化的「双重量化（Double Quantization）」以及利用统一内存防爆显存的「分页优化器（Paged Optimizers）」，反向传播梯度只流经 BF16 的 LoRA 低秩旁路。首次实现在单张 48GB 显卡上无损微调 65B 大模型（Guanaco-65B 达到 ChatGPT 99.3% 性能）！',
    keyContributions: [
      '提出信息论最优的数据类型 4-bit NormalFloat (NF4)：利用预训练权重严格服从零均值正态分布的统计特性，按高斯分位数等概率切分 16 个量化桶',
      '发明双重量化（Double Quantization）：对第一级分块（Blocksize=64）产生的 FP32 缩放常数 c_2 再进行一次 8-bit 量化，每参数再省 0.373 bits',
      '引入基于 NVIDIA Unified Memory 的分页优化器（Paged Optimizers），在长序列梯度尖峰时自动将优化器状态换出至 CPU 内存，彻底消除 OOM',
      '存储用 4-bit NF4、计算时动态反量化为 16-bit BF16，证明 4-bit QLoRA 在学术与对话基准上 100% 追平 16-bit 全量微调'
    ],
    coreProblem:
      '虽然 LoRA 省掉了主干权重的优化器状态，但 65B 模型的 FP16 冻结主干权重本身就要占用 130GB 显存，再加上长序列激活梯度峰值，普通开发者手头的 24GB RTX 3090/4090 或 48GB A6000 根本无法加载并微调 33B/65B 级别的大模型。',
    coreIdea:
      '把「存储精度」与「计算精度」彻底解耦！冻结的百亿主干权重平时以信息熵最高的 4-bit NF4 压缩躺在显存里（65B 仅需约 33GB）；前向和反向计算经过某层时，在 CUDA 寄存器内即时反量化（Dequantize）为 BF16 与输入相乘，而所有梯度和更新只发生在仅占 1% 参数量的 BF16 LoRA 旁路上！',
    simulatorTitle: 'QLoRA NF4 分位数量化与单卡显存账本模拟器',
    simulatorDesc: '交互式切换模型尺寸 (7B~70B) 与量化模式 (16-bit Full FT / 16-bit LoRA / 4-bit QLoRA)，实时计算单卡显存分布。',
    architectureSteps: [
      {
        id: 'qlora-step-1',
        title: '1. 高斯等概率分位数 NF4 编码',
        subtitle: 'Information-Theoretically Optimal NF4',
        description: '根据标准正态分布 N(0,1) 的累积分布逆函数 Φ^{-1}，将 [-1, 1] 划分为概率面积严格相等的 16 个分位点（权重密集的 0 附近刻度极密，尾部刻度较疏）。',
        highlightColor: 'emerald'
      },
      {
        id: 'qlora-step-2',
        title: '2. 分块双重量化压缩常数开销',
        subtitle: 'Block-wise Double Quantization',
        description: '每 64 个权重共享一个 FP32 缩放因子 c^{(2)}（原本需 32/64 = 0.5 bits/param 额外开销）；将每 256 个 c^{(2)} 再量化为 FP8，将该开销压至 0.127 bits/param。',
        highlightColor: 'cyan'
      },
      {
        id: 'qlora-step-3',
        title: '3. 即时 BF16 反量化与 LoRA 旁路梯度',
        subtitle: 'On-the-Fly BF16 Dequantization & LoRA Grad',
        description: '计算 Y = X · doubleDequant(W^{NF4}) + X · L_1 L_2，反量化后的 BF16 权重用完即弃，反向梯度 ∂L/∂L_i 仅更新全精度 LoRA 矩阵。',
        highlightColor: 'amber'
      },
      {
        id: 'qlora-step-4',
        title: '4. 分页优化器抗长序列显存峰值',
        subtitle: 'Paged Optimizers via CUDA Unified Memory',
        description: '当遇到超长样本导致激活显存瞬时触顶时，自动将 Adam 状态页透明迁移至主机内存（CPU RAM），待前向/反向峰值过去后再迁回 GPU。',
        highlightColor: 'purple'
      }
    ],
    formulas: [
      {
        id: 'qlora-f1',
        name: 'NF4 正态分布等概率分位数构造方程',
        category: '信息论最优量化',
        formula: 'q_i = \\frac{1}{2} \\left( Q_X\\!\\left(\\frac{i}{2^k + 1}\\right) + Q_X\\!\\left(\\frac{i+1}{2^k + 1}\\right) \\right), \\quad X \\sim \\mathcal{N}(0, 1), \\; k=4',
        explanation: '通过高斯分位数函数 Q_X 保证每个 4-bit 编码桶被分配到的权重数量期望值严格相等，达到信息论最小量化失真。',
        variables: [
          { symbol: 'Q_X(p)', desc: '标准正态分布的分位数函数（逆累积分布函数 Φ^{-1}）' },
          { symbol: 'q_i', desc: '归一化到 [-1, 1] 并强制包含精确 0 点的 16 个 NF4 离散代表值' }
        ]
      },
      {
        id: 'qlora-f2',
        name: 'QLoRA 线性层双重量化反解与前向方程',
        category: '前向与反量化',
        formula: '\\mathbf{Y}^{\\text{BF16}} = \\mathbf{X}^{\\text{BF16}} \\cdot \\text{dequant}\\!\\left(\\text{dequant}(c_1^{\\text{FP32}}, c_2^{\\text{FP8}}),\\; \\mathbf{W}^{\\text{NF4}}\\right) + \\mathbf{X}^{\\text{BF16}} \\mathbf{L}_1^{\\text{BF16}} \\mathbf{L}_2^{\\text{BF16}}',
        explanation: '主干权重存储于 4.127 bits/param，计算全程运行在 BF16 精度下，完全不损失微调表达力。',
        variables: [
          { symbol: '\\mathbf{W}^{\\text{NF4}}', desc: '冻结的 4-bit NormalFloat 主干权重矩阵' },
          { symbol: 'c_1^{\\text{FP32}}, c_2^{\\text{FP8}}', desc: '双重量化的两级缩放常数' },
          { symbol: '\\mathbf{L}_1, \\mathbf{L}_2', desc: '插入在全部线性层的 BF16 可训练 LoRA 适配器矩阵' }
        ]
      }
    ],
    metricCards: [
      { label: '65B 模型微调显存需求', value: '780GB ➔ < 41GB', desc: '显存缩减超 19 倍，单张 48GB A6000 即可跑通 65B 微调', color: 'emerald' },
      { label: '双重量化每参数净省', value: '0.373 bits/param', desc: '65B 模型仅量化常数一项就额外节省约 3.1 GB 显存', color: 'cyan' },
      { label: '16-bit 全量微调精度恢复', value: '100.0% 无损追平', desc: '4-bit NF4 QLoRA 在 MMLU 与 Vicuna 基准上完全追平 16-bit', color: 'amber' },
      { label: 'Guanaco-65B 对话胜率', value: 'ChatGPT 的 99.3%', desc: '仅在单卡训练 24 小时即达到商用闭源旗舰对话水平', color: 'purple' }
    ],
    experimentSections: [
      {
        title: '不同精度与量化格式在 LLaMA 微调上的 MMLU 5-shot 精度与显存对比',
        description: '证明普通 Int4 与 FP4 在低比特下会产生明显精度跌落，唯有结合 NF4 + 全线性层 LoRA 才能 100% 恢复 16-bit 性能。',
        headers: ['微调方法与权重格式', '65B 模型显存峰值 (↓)', '平均每参数比特数', 'LLaMA-7B/65B MMLU 准确率 (↑)'],
        rows: [
          ['16-bit Full Finetuning (全量微调)', '780.0 GB (需10×A100)', '16.00 bits (主干) + 128 bits (状态)', '35.1% / 58.3%'],
          ['4-bit Int4 + LoRA (均匀整数分桶)', '41.2 GB', '4.50 bits', '31.9% / 54.8% (精度明显受损)'],
          ['4-bit FP4 + LoRA (标准四位浮点)', '41.2 GB', '4.50 bits', '33.4% / 56.7%'],
          ['4-bit NF4 + DQ (QLoRA 本文方案)', '38.1 GB (单卡48GB轻松跑)', '4.127 bits', '35.2% / 58.4% (100% 恢复全精度!)']
        ]
      }
    ],
    insights: [
      {
        title: '为什么在 QLoRA 中必须给「所有线性层」都加上 LoRA，而不能只加 Q 和 V？',
        content: '原版 16-bit LoRA 往往只对 Attention 的 W_q 和 W_v 注入低秩矩阵；但论文通过严谨消融发现，当主干被压缩到 4-bit 后，必须在 Attention 和 FFN/MLP 的全部线性投影层（q, k, v, o, gate, up, down）都挂载 LoRA 旁路，才能完全补偿量化残差并追平全量微调！'
      },
      {
        title: '为什么 QLoRA 比 16-bit LoRA 训练速度略慢约 25%~30%，业界依然全民采用？',
        content: '因为前向和反向传播每次都需要执行 NF4 → BF16 的动态反量化计算，会带来约 25% 的时间开销；但换来的是原本根本跑不起来的 33B/70B 模型现在能在单张消费级显卡上微调——这是从「0 到 1」的质变！'
      }
    ],
    takeaways: [
      { icon: 'Cpu', title: '开源微调普及的最大功臣', desc: '一张 RTX 3090/4090 微调 33B、一张 48GB 卡微调 65B/70B 成为全球开发者日常。' },
      { icon: 'BarChart2', title: 'NF4 契合高斯权重天性', desc: '利用神经网络权重天然服从零均值正态分布的规律，榨干 4 个比特的每一分信息熵。' },
      { icon: 'Layers', title: '存储 4-bit，计算 16-bit', desc: '冻结权重用 NF4 省显存，激活与梯度用 BF16 保精度，鱼与熊掌兼得。' },
      { icon: 'Shield', title: '全线性层挂载铁律', desc: '实践 QLoRA 时切记设置 target_modules="all-linear" 以获得媲美全量微调的效果。' }
    ]
  },

  'flashattention-2022': {
    id: 'flashattention-2022',
    title: 'FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness',
    chineseTitle: 'FlashAttention：兼顾硬件 IO 感知的高速省显存精确注意力算法',
    subtitle: 'Tri Dao, Daniel Y. Fu, Stefano Ermon, Atri Rudra, Christopher Ré • Stanford University • NeurIPS 2022',
    tags: ['FlashAttention', 'IO-Awareness 硬件感知', 'SRAM 分块 Tiling', 'Online Softmax 在线归一化', 'O(N) 线性激活显存'],
    arxivId: '2205.14135',
    pdfUrl: 'https://arxiv.org/pdf/2205.14135.pdf',
    abstractUrl: 'https://arxiv.org/abs/2205.14135',
    summary:
      '现代所有大模型长上下文训练与推理加速的绝对底座！此前学界提出了数十种「近似稀疏注意力」试图把 FLOPs 从 O(N²) 降为 O(N)，但在真实 GPU 上反而更慢。Tri Dao 一针见血地指出：标准自注意力的真正瓶颈根本不是浮点算力（Compute-bound），而是 GPU 高带宽显存（HBM）与片上高速缓存（SRAM）之间对巨型 N×N 注意力矩阵的反复读写（Memory-bound）！FlashAttention 通过「分块（Tiling）+ 在线 Softmax 重缩放（Online Softmax）+ 反向传播重计算（Recomputation）」，全程不向 HBM 落盘任何 N×N 中间矩阵，在保证输出结果与标准注意力【逐比特精确一致】的前提下，将显存复杂度从 O(N²) 彻底降为 O(N)，速度飙升 3~7.6 倍！',
    keyContributions: [
      '建立 GPU 存储层级 IO 复杂度模型：A100 的片上 SRAM 带宽高达 19 TB/s（仅 20MB），而主显存 HBM 带宽仅 1.5 TB/s，算子融合减少 HBM 读写才是提速关键',
      '利用 Online Softmax 递推恒等式，在无法一次看全整行 K 的分块循环中，动态更新局部最大值 m(x) 与指数和 l(x)，单趟扫描完成精确归一化',
      '全程不实例化 N×N 的 S = QK^T 与 P = softmax(S) 矩阵，将注意力激活显存从 O(N²) 压缩至 O(N)，让 64K~1M 超长上下文成为可能',
      '反向传播中不保存 O(N²) 注意力矩阵，仅存 O(N) 的行统计量 (m, l) 并在 SRAM 内极速重算，因省去了海量 HBM 读取，总反向耗时反而比标准实现更快！'
    ],
    coreProblem:
      '在标准 PyTorch 注意力实现中，计算 S = QK^T、P = softmax(S)、O = PV 需要在主显存 HBM 上连续创建、写入并重新读取三个 N×N 的巨型矩阵。当序列长度 N = 32K 时，仅单层单头的 N×N 矩阵就高达数十 GB，且 80% 以上的 GPU 时间都在空等慢速 HBM 内存搬运。',
    coreIdea:
      '把 Q、K、V 切成能塞进 GPU 超高速片上缓存（SRAM）的小块（Tiles）。外层循环把 K_j, V_j 块加载进 SRAM，内层循环流式扫过 Q_i 块：在 SRAM 内部算完小块点积后，借助「在线 Softmax 修正因子 e^{m_old - m_new}」直接在片上累加更新输出块 O_i，直到整个循环结束才把最终结果 O 写回 HBM 一次！',
    simulatorTitle: 'FlashAttention SRAM 分块与 HBM IO 带宽分析实验台',
    simulatorDesc: '交互式调节序列长度 N (1K~64K) 与 SRAM 分块大小 B_c，对比标准注意力与 FlashAttention 的 HBM 读写字节数与显存占用。',
    architectureSteps: [
      {
        id: 'fa-step-1',
        title: '1. GPU 存储金字塔分块 (SRAM Tiling)',
        subtitle: 'SRAM vs HBM Hierarchy Partitioning',
        description: '根据片上 SRAM 容量 M（如每个 SM 192KB），将 Q, K, V 切分为大小为 B_r × d 与 B_c × d 的子块，确保单次子块运算完全驻留在 19TB/s 的 SRAM 内。',
        highlightColor: 'emerald'
      },
      {
        id: 'fa-step-2',
        title: '2. 在线 Softmax 统计量递推更新',
        subtitle: 'Online Softmax Rescaling Trick',
        description: '当扫到新的 Key 子块 K_j 时，计算新最大值 m_new = max(m_old, rowmax(S_ij))，并用缩放因子 e^{m_old - m_new} 即时修正此前累积的分子与分母！',
        highlightColor: 'cyan'
      },
      {
        id: 'fa-step-3',
        title: '3. 算子内核全融合 (Kernel Fusion)',
        subtitle: 'Zero N×N HBM Materialization',
        description: '将 MatMul(QK^T) → Scale → Mask → Dropout → Softmax → MatMul(PV) 全部融合进同一个 CUDA Kernel，HBM 上永远不会出现 N×N 矩阵。',
        highlightColor: 'amber'
      },
      {
        id: 'fa-step-4',
        title: '4. 反向传播以重算换 IO 加速',
        subtitle: 'Fast Backward Recomputation',
        description: '反向传播不再从 HBM 读取沉重的 P 矩阵，而是利用前向保存的 O(N) 统计量 (m, l) 在高速 SRAM 中即时重算局部注意力块，虽然 FLOPs 略增但总耗时大幅缩短！',
        highlightColor: 'purple'
      }
    ],
    formulas: [
      {
        id: 'fa-f1',
        name: '分块在线 Softmax 精确递推更新公式',
        category: '在线归一化恒等式',
        formula: 'm^{(new)} = \\max(m^{(old)}, \\tilde{m}_{ij}), \\quad \\ell^{(new)} = e^{m^{(old)}-m^{(new)}}\\ell^{(old)} + e^{\\tilde{m}_{ij}-m^{(new)}}\\tilde{\\ell}_{ij}, \\quad \\mathbf{O}_i^{(new)} = \\text{diag}(\\ell^{(new)})^{-1}\\!\\left(\\text{diag}(\\ell^{(old)})e^{m^{(old)}-m^{(new)}}\\mathbf{O}_i^{(old)} + e^{\\tilde{m}_{ij}-m^{(new)}}\\tilde{\\mathbf{P}}_{ij}\\mathbf{V}_j\\right)',
        explanation: '保证了即便每次只看见局部一块 K_j，最终流式累加出的输出 O_i 与看完全局再做 Softmax 的结果在数学上 100% 精确相等。',
        variables: [
          { symbol: 'm, \\ell', desc: '逐行维护的运行期最大值向量与指数分母累加和向量（仅占 O(N) 空间）' },
          { symbol: 'e^{m^{(old)}-m^{(new)}}', desc: '当遇到更大得分时，对历史累加值执行的精确指数重缩放因子' }
        ]
      },
      {
        id: 'fa-f2',
        name: 'HBM 内存访问复杂度对比定理 (Theorem 2)',
        category: '硬件 IO 复杂度',
        formula: '\\text{HBM}_{\\text{Standard}} = \\Theta(Nd + N^2), \\qquad \\text{HBM}_{\\text{FlashAttention}} = \\Theta\\!\\left(\\frac{N^2 d^2}{M}\\right)',
        explanation: '由于片上 SRAM 大小 M 远大于 d²（通常 d²/M ≪ 1/10），FlashAttention 将 HBM 读写次数减少了最高 9 倍以上，且证明该下界对所有精确注意力已达理论最优。',
        variables: [
          { symbol: 'N, d', desc: '序列长度 N 与注意力头维度 d (如 d=64 或 128)' },
          { symbol: 'M', desc: 'GPU 片上高速缓存 SRAM 容量' }
        ]
      }
    ],
    metricCards: [
      { label: '注意力激活显存复杂度', value: 'O(N²) ➔ O(N) 线性', desc: '彻底消灭 N×N 显存墙，显存节省高達 10x ~ 20x', color: 'emerald' },
      { label: '端到端训练与推理加速', value: '3.0x ~ 7.6x 提速', desc: 'GPT-2 训练提速 3.5 倍，长序列块稀疏版提速 7.6 倍', color: 'cyan' },
      { label: '数值计算精确度', value: '100% Exact (非近似)', desc: '与标准注意力数学完全等价，无任何稀疏或低秩精度损失', color: 'amber' },
      { label: 'HBM 显存读写字节削减', value: '最高减少 9.1x', desc: '越过带宽墙，将注意力从 Memory-bound 转化为高效计算', color: 'purple' }
    ],
    experimentSections: [
      {
        title: '不同序列长度下标准 PyTorch Attention 与 FlashAttention 显存与延迟对比 (A100-80GB)',
        description: '随序列长度 N 从 1K 增至 64K，标准实现迅速 OOM 崩溃，而 FlashAttention 保持线性显存增长与数倍加速。',
        headers: ['序列长度 N', '标准 Attention 显存 / 耗时', 'FlashAttention 显存 / 耗时', '显存节省与加速比'],
        rows: [
          ['N = 1,024 (1K)', '0.32 GB / 2.8 ms', '0.06 GB / 0.8 ms', '省 5.3x 显存 • 3.5x 加速'],
          ['N = 4,096 (4K)', '4.80 GB / 41.2 ms', '0.24 GB / 7.9 ms', '省 20.0x 显存 • 5.2x 加速'],
          ['N = 16,384 (16K)', '76.8 GB (濒临OOM) / 645 ms', '0.96 GB / 108 ms', '省 80.0x 显存 • 6.0x 加速'],
          ['N = 65,536 (64K 超长文本)', 'OOM 崩溃 (需 1,228 GB!)', '3.84 GB / 1,680 ms (稳定运行!)', '解锁百万级长上下文能力']
        ]
      }
    ],
    insights: [
      {
        title: '为什么「多算一遍 FLOPs（重计算）」反而让反向传播跑得更快？',
        content: '这颠覆了传统算法教科书的直觉：在现代 GPU（如 A100/H100）上，浮点矩阵乘法的速度比从 HBM 显存读取数据的速度快出几十倍！FlashAttention 反向传播故意不存 N×N 的 P 矩阵，省掉了从 HBM 读取海量矩阵的漫长等待，在 SRAM 里顺手重算一遍 QK^T 反而使总墙钟时间（Wall-clock Time）大幅下降！'
      },
      {
        title: '从 FlashAttention-1 到 FlashAttention-2 / 3 的进化主线',
        content: 'FA-2 调整了内外层循环顺序（将 Q 放外层、K/V 放内层以减少输出累加的原子写）并实现序列维度并行；FA-3 更进一步利用 H100 Hopper 架构的异步 TMA（张量内存加速器）与 FP8 Tensor Core，将 GPU 利用率推高至 75% 以上。'
      }
    ],
    takeaways: [
      { icon: 'Zap', title: '算得快不如搬得少', desc: '现代 AI 系统优化的第一铁律：瓶颈往往不在 FLOPs，而在 HBM 显存读写字节数（IO-Awareness）。' },
      { icon: 'Layers', title: 'Online Softmax 的神来之笔', desc: '用指数重缩放因子打破了 Softmax 必须先扫完全局才能归一化的串行枷锁。' },
      { icon: 'Maximize2', title: '长上下文时代的真正推手', desc: '没有 FlashAttention 把 O(N²) 显存拍扁成 O(N)，今日的 128K/1M 长文本大模型根本无法训练。' },
      { icon: 'CheckCircle', title: 'PyTorch 2.0+ 官方内置', desc: '已作为 torch.nn.functional.scaled_dot_product_attention 的底层默认内核。' }
    ]
  },

  'orca-2022': {
    id: 'orca-2022',
    title: 'Orca: A Distributed Serving System for Transformer-Based Generative Models',
    chineseTitle: 'Orca 连续批处理：开创按迭代调度的现代大模型高吞吐推理引擎范式',
    subtitle: 'Gyeong-In Yu, Joo Seong Jeong, Geon-Woo Kim, Soojeong Kim, Byung-Gon Chun • Seoul National University & FriendliAI • OSDI 2022',
    tags: ['Orca', 'Iteration-Level Scheduling 按迭代调度', 'Continuous Batching 连续批处理', 'Selective Batching 选择性批处理', '36.9x 吞吐飞跃'],
    arxivId: 'OSDI 2022 (ATC/OSDI)',
    pdfUrl: 'https://www.usenix.org/system/files/osdi22-yu.pdf',
    abstractUrl: 'https://www.usenix.org/conference/osdi22/presentation/yu',
    summary:
      '现代所有大模型推理服务框架（vLLM、TensorRT-LLM、TGI、SGLang）调度器的开山鼻祖！传统深度学习服务系统（如 NVIDIA Triton + FasterTransformer）采用「按整段请求调度（Request-Level Static Batching）」：同一 Batch 内的所有请求必须同时开始，且哪怕某条短回复早已生成出 [EOS] 结束符，也必须原地空转陪跑（Padding），直到 Batch 内最长的那条请求生成完毕才能释放 GPU 并接入新请求。Orca 首创「按迭代调度（Iteration-Level Scheduling / Continuous Batching）」与「选择性批处理（Selective Batching）」，在每次单步自回归迭代（生成 1 个 Token）后立即剔除已完成请求并无缝插入新请求，在 GPT-3 175B 上于相同延迟约束下实现了高达 36.9 倍的惊人吞吐量飞跃！',
    keyContributions: [
      '揭示静态请求级批处理（Static Batching）在自回归生成中的三大浪费：早退请求空转陪跑、新到请求排队饥饿、Prefill 与 Decode 长度异构无法合批',
      '首创「按迭代调度（Iteration-Level Scheduling / 工业界通称 Continuous Batching）」，将调度粒度从「整次请求」细化到「每一次前向单步迭代」',
      '提出「选择性批处理（Selective Batching）」：对与序列长度无关的 Linear/FFN 层将所有请求拍扁为 [Σ N_i, d] 矩阵统一批处理，仅对 Attention 层按各自 KV Cache 独立执行',
      '在 175B GPT-3 模型分布式服务评测中，于相同尾延迟（Latency）下取得 FasterTransformer 36.9 倍的吞吐量提升'
    ],
    coreProblem:
      '自回归大模型的输出长度事先未知且差异悬殊（有的请求回复 10 个词，有的回复 1000 个词）。在静态批处理下，短请求完成后 GPU 算力全部浪费在无效填充符（Padding）上，而队列外的新请求却必须苦苦等待整个 Batch 最慢的那条请求跑完，导致 GPU 利用率不足 10%。',
    coreIdea:
      '打破「同进同出」的静态批次枷锁！调度器在模型每跑完【一步前向迭代（生成 1 个 Token）】后就介入检查：凡是刚刚吐出 [EOS] 的请求立刻移出运行池并向用户返回结果；空出来的槽位当场从等待队列拉取新请求（执行 Prefill）顶替上来，让 GPU 在每一个时钟周期都处于满载有效计算状态！',
    simulatorTitle: 'Orca 连续批处理 (Continuous Batching) vs 静态批处理调度实验台',
    simulatorDesc: '调节并发请求长度方差、Batch 大小与到达率，实时对比 Static Batching 与 Orca Iteration-Level Scheduling 的气泡浪费率与吞吐加速比。',
    architectureSteps: [
      {
        id: 'orca-step-1',
        title: '1. 单步迭代粒度调度循环',
        subtitle: 'Iteration-Level Scheduling Loop',
        description: '引擎每次仅下发「执行 1 步 Transformer 前向迭代」的指令；每步结束后检查各请求输出 Token，遇到 [EOS] 立即归还槽位，新请求零等待动态插入。',
        highlightColor: 'emerald'
      },
      {
        id: 'orca-step-2',
        title: '2. 消除异构序列拼接障碍',
        subtitle: 'Decoupling Prefill & Decode Lengths',
        description: '动态加入的新请求处于 Prefill 阶段（含数百个输入 Token），而老请求处于 Decode 阶段（仅 1 个新 Token），两者张量形状不同，传统 Batch 乘法无法合并。',
        highlightColor: 'cyan'
      },
      {
        id: 'orca-step-3',
        title: '3. 选择性批处理 (Selective Batching)',
        subtitle: 'Token-Level Flattening for Linear/MLP',
        description: '对占算力 80% 以上的 QKV 投影与 FFN 线性层，忽略请求边界，把所有请求的活跃 Token 拼接成二维矩阵 [Σ L_i, d_model] 一次性喂入 Tensor Core 满载运算！',
        highlightColor: 'amber'
      },
      {
        id: 'orca-step-4',
        title: '4. 注意力层按请求独立分发与重汇合',
        subtitle: 'Split Attention & Re-merge Pipeline',
        description: '仅在进入 Attention 算子时按请求拆分，各自读取专属的历史 KV Cache 计算上下文注意力，算完后立即重新拼回统一 Token 矩阵进入后续层。',
        highlightColor: 'purple'
      }
    ],
    formulas: [
      {
        id: 'orca-f1',
        name: '静态批处理有效算力利用率与填充气泡率公式',
        category: '调度效率建模',
        formula: '\\eta_{\\text{Static}} = \\frac{\\sum_{i=1}^{B} T_i}{B \\cdot \\max_{1 \\le i \\le B} T_i}, \\qquad \\text{Bubble Waste} = 1 - \\eta_{\\text{Static}}',
        explanation: '当一个 Batch 中最长生成长度 max(T_i) 远大于平均生成长度 E[T_i] 时，静态批处理高达 60%~85% 的算力都被浪费在等待与空白填充上。',
        variables: [
          { symbol: 'T_i', desc: 'Batch 内第 i 条请求的实际生成 Token 长度' },
          { symbol: '\\max T_i', desc: '决定整个静态批次何时能释放的木桶最慢短板长度' }
        ]
      },
      {
        id: 'orca-f2',
        name: '选择性批处理（Selective Batching）二维词元拼接算子',
        category: '算子融合方程',
        formula: '\\mathbf{X}_{\\text{flat}} = \\text{Concat}(\\mathbf{X}_1, \\mathbf{X}_2, \\dots, \\mathbf{X}_B) \\in \\mathbb{R}^{(\\sum_{i=1}^B L_i) \\times d}, \\quad \\mathbf{Y}_{\\text{flat}} = \\mathbf{X}_{\\text{flat}} \\mathbf{W}_{\\text{Linear}}',
        explanation: '无论是处理 512 词的 Prefill 请求还是 1 词的 Decode 请求，在线性层全部展平为统一 Token 流共享同一次权重读取，彻底跑满显存带宽。',
        variables: [
          { symbol: 'L_i', desc: '第 i 条请求在当前迭代步参与计算的活跃 Token 数（Prefill 为 prompt 长度，Decode 为 1）' },
          { symbol: '\\mathbf{W}_{\\text{Linear}}', desc: '全批次共享读取一次的模型线性层/MLP 权重矩阵' }
        ]
      }
    ],
    metricCards: [
      { label: 'GPT-3 175B 吞吐量提升', value: '36.9x 倍 (同延迟下)', desc: '相比 NVIDIA FasterTransformer 静态批处理实现数量级飞跃', color: 'emerald' },
      { label: '调度时间粒度', value: '1 个 Token 迭代步', desc: '完成即走、随到随插，彻底消灭 [EOS] 后的陪跑气泡', color: 'cyan' },
      { label: '线性层权重读取复用率', value: '100% 跨请求合并', desc: 'Selective Batching 让 Prefill 与 Decode 共享同一次权重加载', color: 'amber' },
      { label: '工业界生态地位', value: '所有推理引擎标配', desc: 'vLLM、TensorRT-LLM、SGLang 的 Continuous Batching 源头', color: 'purple' }
    ],
    experimentSections: [
      {
        title: 'GPT-3 175B 在线合成工作负载吞吐量与中位延迟对比',
        description: '在真实对话长短不一的请求分布下，对比 FasterTransformer 不同静态最大批大小与 Orca 的吞吐率（Req/s）与延迟。',
        headers: ['推理服务系统配置', '调度机制', '达到 190ms 延迟时的吞吐量 (↑)', 'GPU 计算有效利用率'],
        rows: [
          ['FasterTransformer (MaxBatch = 8)', 'Request-Level 静态批处理', '0.18 req/s (基准 1.0x)', '14.2% (大量长尾排队)'],
          ['FasterTransformer (MaxBatch = 32)', 'Request-Level 静态批处理', '延迟飙升至 >1,200ms (违反SLA)', '28.5% (严重 Padding 气泡)'],
          ['Orca 仅按迭代调度 (无选择性合批)', 'Iteration-Level 动态替换', '1.95 req/s (10.8x 提升)', '58.4%'],
          ['Orca 完整版 (Iteration + Selective Batching)', '按迭代调度 + Token级展平合批', '6.64 req/s (36.9x 惊人提速!)', '89.7% (SOTA)']
        ]
      }
    ],
    insights: [
      {
        title: '为什么 LLM 的 Decode 阶段必须尽可能扩大并发 Batch Size？',
        content: '在自回归生成（Decode）阶段，每条请求每步只处理 1 个 Token，但 GPU 却必须把整套百亿参数权重从 HBM 读进核心一次（典型的 Memory-bound）。如果 Batch=1，读 350GB 权重只做一次向量内积；而 Orca 通过 Continuous Batching 把数十上百条请求攒在一起共享这同一次权重读取，等于「白嫖」了 GPU 的空闲算力！'
      },
      {
        title: 'Orca 留下了什么未解之谜，从而直接催生了第二年的 vLLM (PagedAttention)？',
        content: 'Orca 解决了计算层的动态合批，但在显存分配上仍然为每条请求预先划拨一块连续的最大长度（如 2048）KV Cache 空间。这种连续预分配导致显存很快被碎片耗尽，限制了并发 Batch Size 的进一步扩大——这正是随后 PagedAttention 登场的历史契机！'
      }
    ],
    takeaways: [
      { icon: 'RefreshCw', title: '按迭代调度取代按请求调度', desc: '生成完 [EOS] 立刻下车，新乘客下一毫秒立刻上车，绝不空跑一个 Token。' },
      { icon: 'Layers', title: 'Selective Batching 拆合自如', desc: 'Linear 层按 Token 展平合批吃满算力，Attention 层按请求独立寻址保持语义隔离。' },
      { icon: 'Zap', title: '36.9 倍吞吐量的商业奇迹', desc: '正是 Orca 将大模型 API 的单 Token 推理成本拉低了一个数量级，使商业化售卖成为可能。' },
      { icon: 'Cpu', title: '现代推理栈的第一块基石', desc: '今日你在 vLLM 或 TGI 中看到的 Continuous Batching，其学术本名正是 Orca 的 Iteration-Level Scheduling。' }
    ]
  },

  'pagedattention-2023': {
    id: 'pagedattention-2023',
    title: 'Efficient Memory Management for Large Language Model Serving with PagedAttention (vLLM)',
    chineseTitle: 'PagedAttention 与 vLLM：用操作系统虚拟内存分页彻底终结 KV Cache 显存浪费',
    subtitle: 'Woosuk Kwon, Zhuohan Li (李卓桓), Siyuan Zhuang, Ying Sheng, Lianmin Zheng, Ion Stoica et al. • UC Berkeley • SOSP 2023',
    tags: ['PagedAttention', 'vLLM 核心引擎', 'KV Cache 虚拟内存分页', '消除 60%~80% 显存碎片', 'Copy-on-Write 前缀共享'],
    arxivId: '2309.06180',
    pdfUrl: 'https://arxiv.org/pdf/2309.06180.pdf',
    abstractUrl: 'https://arxiv.org/abs/2309.06180',
    summary:
      '开源大模型推理引擎 vLLM 的奠基论文，彻底统治今日工业界 LLM 部署栈！UC Berkeley 团队发现：即使采用了 Orca 的连续批处理，现有系统仍因要求每条请求的动态 KV Cache 存储在【连续物理显存】中，不得不按最大可能长度（如 2048/4096）静态预留空间，导致高达 60% ~ 80% 的 GPU 显存被内部碎片、预留闲置与外部碎片白白浪费！论文借鉴操作系统经典的「虚拟内存与分页（Virtual Memory & Paging）」思想提出 PagedAttention，将 KV Cache 切分为固定大小（如每块 16 个 Token）的物理块（KV Blocks），通过页表（Block Table）按需非连续动态分配，将显存浪费压降至 4% 以下，使单卡并发 Batch Size 扩大 2~4 倍，吞吐量比 FasterTransformer 暴涨 24 倍、比 Orca 再翻 2.7~4 倍！',
    keyContributions: [
      '量化揭露传统连续 KV Cache 分配的惊人真相：真实只有 20.4% ~ 38.2% 的 KV 显存存了有效 Token，其余 60%~80% 全是三大碎片浪费',
      '发明 PagedAttention 注意力内核：支持在非连续物理显存块（Non-contiguous Physical Blocks）上直接分块读取 K 和 V 并计算注意力',
      '构建完整的操作系统级显存管理器 vLLM：通过逻辑块到物理块的页表映射，实现按需分配（On-demand Allocation）与零外部碎片',
      '天然支持块级写时复制（Copy-on-Write）与引用计数，让 Parallel Sampling、Beam Search 和系统提示词（Prefix Caching）共享高达 55% 的 KV 显存'
    ],
    coreProblem:
      '大模型自回归生成时，KV Cache 会随生成的每个 Token 动态增长且最终长度无法预知。传统深度学习框架要求张量必须在物理显存上连续存放，因此只能为每条请求预先分配一整块 max_seq_len 的连续显存，导致三分之二以上的珍贵显存被「占着茅坑不拉屎」的空闲预留位锁死，严重卡死了并发 Batch Size。',
    coreIdea:
      '像操作系统管理物理内存页一样管理 KV Cache！把 GPU 显存池划分为无数个固定大小（例如 B=16 个 Token）的「物理 KV 块」。请求生成时，用多少分配多少，逻辑上连续的 Token 序列可以通过「页表（Block Table）」映射到物理上完全不相邻的任意空闲块中；且多个请求相同的 Prompt 前缀可以直接指向同一批物理块！',
    simulatorTitle: 'PagedAttention 虚拟页表映射与 KV Cache 碎片消除模拟器',
    simulatorDesc: '交互式调节并发请求数、物理块大小 B (8/16/32 Tokens) 与共享前缀比例，实时对比连续分配与 PagedAttention 的显存利用率与最大并发吞吐。',
    architectureSteps: [
      {
        id: 'pa-step-1',
        title: '1. 剖析传统连续分配三大显存黑洞',
        subtitle: 'Internal, Reservation & External Fragmentation',
        description: '传统预分配产生：(1) 内部碎片（实际比 max_len 短而永不使用的空间）、(2) 预留浪费（后续步才用到但全程占用的空间）、(3) 外部碎片（不同长度块交替释放后的零碎空隙）。',
        highlightColor: 'emerald'
      },
      {
        id: 'pa-step-2',
        title: '2. 逻辑 KV 块与物理 KV 块解耦',
        subtitle: 'Logical-to-Physical Block Table Mapping',
        description: '将每条请求的 KV Cache 划分为每块固定包含 B=16 个 Token 的逻辑块，仅当上一个块填满时，才从全局物理块池中按需申请 1 个新物理块并记录进页表。',
        highlightColor: 'cyan'
      },
      {
        id: 'pa-step-3',
        title: '3. PagedAttention 非连续分块注意力内核',
        subtitle: 'Block-wise Non-Contiguous Attention Kernel',
        description: '定制 CUDA 内核在每次迭代中查询 Block Table，动态从分散的物理地址抓取块矩阵 K_j, V_j ∈ R^{B×d}，在 SRAM 内完成分块点积与在线 Softmax 聚合。',
        highlightColor: 'amber'
      },
      {
        id: 'pa-step-4',
        title: '4. 写时复制 (CoW) 与前缀零拷贝共享',
        subtitle: 'Copy-on-Write & Prefix Sharing',
        description: '对共享 System Prompt 或并行采样（n>1）的多个候选序列，直接将页表指向同一组物理块（引用计数 >1）；仅当某分支需要修改末尾块时才触发单块复制。',
        highlightColor: 'purple'
      }
    ],
    formulas: [
      {
        id: 'pa-f1',
        name: 'PagedAttention 分块注意力计算方程',
        category: '分块注意力内核',
        formula: '\\mathbf{A}_{i,j} = \\frac{\\exp(\\mathbf{q}_i^T \\mathbf{K}_j / \\sqrt{d})}{\\sum_{t=1}^{\\lceil i/B \\rceil} \\exp(\\mathbf{q}_i^T \\mathbf{K}_t / \\sqrt{d}) \\mathbf{1}}, \\qquad \\mathbf{o}_i = \\sum_{j=1}^{\\lceil i/B \\rceil} \\mathbf{V}_j \\mathbf{A}_{i,j}^T',
        explanation: '将原本逐个连续 Token 的点积转化为以固定物理块 K_j = (k_{(j-1)B+1}, ..., k_{jB}) 为单位的块矩阵运算，物理块之间无需地址相邻。',
        variables: [
          { symbol: 'B', desc: '每个物理 KV 块容纳的固定 Token 数量（vLLM 默认 B = 16）' },
          { symbol: '\\mathbf{K}_j, \\mathbf{V}_j', desc: '通过页表（Block Table）动态寻址的第 j 个物理键值块张量' }
        ]
      },
      {
        id: 'pa-f2',
        name: '分页机制下的理论最大内部碎片上界公式',
        category: '显存利用率定律',
        formula: '\\text{Waste}_{\\text{Paged}} \\le \\frac{B - 1}{L_{\\text{avg}}} \\approx 3.7\\% \\quad (\\text{vs. } \\text{Waste}_{\\text{Contiguous}} = 1 - \\frac{L_{\\text{avg}}}{L_{\\text{max}}} \\approx 62\\% \\sim 79.6\\%)',
        explanation: '在分页机制下，每条请求最多只在【最后一个未填满的物理块】上浪费不超过 B-1 个槽位，外部碎片与预留浪费严格为 0！',
        variables: [
          { symbol: 'L_{\\text{avg}}, L_{\\text{max}}', desc: '请求的平均实际长度与系统最大上下文长度上限' },
          { symbol: 'B - 1', desc: '单条请求在末尾物理块上可能产生的最大未填满 Token 槽位数（最多 15 个）' }
        ]
      }
    ],
    metricCards: [
      { label: 'KV Cache 显存浪费率', value: '60~80% ➔ < 4%', desc: '接近 100% 榨干每一字节显存，仅末尾块存在微小内部碎片', color: 'emerald' },
      { label: '服务吞吐量提升 (vs Orca)', value: '2.7x ~ 4.0x 倍', desc: '省下的显存允许将并发 Batch Size 扩大数倍，相比 FT 提速 24 倍', color: 'cyan' },
      { label: 'Beam Search / 并行采样省存', value: '最高节省 55% KV显存', desc: '通过块级引用计数与 Copy-on-Write 实现多分支零拷贝共享', color: 'amber' },
      { label: 'GitHub 开源影响力', value: 'vLLM (40,000+ Stars)', desc: '全球生产环境部署最广泛的开源大模型推理服务引擎', color: 'purple' }
    ],
    experimentSections: [
      {
        title: 'ShareGPT 与 Alpaca 真实对话负载下各推理系统 KV 显存利用率与最大吞吐对比 (LLaMA-13B)',
        description: '对比 FasterTransformer、Orca (不同预留策略) 与 vLLM (PagedAttention) 的显存浪费率及可持续请求率。',
        headers: ['推理服务引擎', 'KV Cache 显存有效利用率 (↑)', '平均并发 Batch 大小', '最大可持续吞吐量 (Req/s ↑)'],
        rows: [
          ['FasterTransformer (静态连续预分配)', '20.4% (浪费高达 79.6%!)', '8.2 条并发', '1.3 req/s (基准 1.0x)'],
          ['Orca-Max (按最大长度连续预分配)', '24.1% (浪费 75.9%)', '11.5 条并发', '8.2 req/s (6.3x)'],
          ['Orca-Oracle (假设预知长度的理论連続上限)', '68.2% (仍受外部碎片困扰)', '26.4 条并发', '14.5 req/s (11.2x)'],
          ['vLLM + PagedAttention (本文方案)', '96.3% (浪费仅 3.7%!)', '64.8 条并发', '31.2 req/s (24.0x 碾压夺冠!)']
        ]
      }
    ],
    insights: [
      {
        title: '为什么物理块大小 B = 16 是黄金甜点值？',
        content: '如果 B 太小（如 B=1，即逐 Token 链表），会导致最后一个块的内部碎片为 0，但 GPU 全局内存读取无法合并（Uncoalesced Memory Access），带宽利用率暴跌；如果 B 太大（如 B=256），末尾未填满块的内部碎片又会显著上升。B=16 或 32 完美兼顾了 GPU 缓存行对齐读取与 <4% 的极低碎片率。'
      },
      {
        title: '从 PagedAttention 到 Automatic Prefix Caching (APC)',
        content: '既然 KV Cache 已经被切成了固定长度为 16 的物理块，那么对任意请求的输入块计算哈希值（Hash(前块Hash, 当前16个Token)），就能把系统提示词、多轮对话历史甚至 RAG 文档块的物理块做成全局 LRU 缓存池，实现跨请求的首字延迟（TTFT）零重算秒回！'
      }
    ],
    takeaways: [
      { icon: 'HardDrive', title: '跨界移植操作系统智慧', desc: '把计算机体系结构成熟了五十年的「虚拟内存分页」原封不动搬进大模型 KV Cache 管理。' },
      { icon: 'Maximize2', title: '显存省下来就是吞吐翻倍', desc: '消灭 70% 的显存碎片气泡，意味着同一张显卡能同时服务 4 倍以上的并发用户。' },
      { icon: 'Copy', title: '写时复制赋能复杂解码', desc: '让原本高不可攀的 Beam Search、Best-of-N 采样与树搜索推理变得极其廉价。' },
      { icon: 'Rocket', title: 'vLLM 成就开源推理事实标准', desc: 'Orca 的连续批处理 + vLLM 的 PagedAttention 构成了今日一切现代推理引擎的双核基座。' }
    ]
  },

  'speculative-decoding-2022': {
    id: 'speculative-decoding-2022',
    title: 'Fast Inference from Transformers via Speculative Decoding',
    chineseTitle: 'Speculative Decoding 投机采样：以小模型草稿与大模型并行校验实现无损推理加速',
    subtitle: 'Yaniv Leviathan, Matan Kalman, Yossi Matias • Google Research (同期独立发表: Charlie Chen et al. DeepMind) • ICML 2023',
    tags: ['Speculative Decoding 投机采样', 'Draft-then-Verify 草稿加并行验证', '修正拒绝采样 Modified Rejection Sampling', '100% 分布无损', '突破访存带宽墙'],
    arxivId: '2211.17192',
    pdfUrl: 'https://arxiv.org/pdf/2211.17192.pdf',
    abstractUrl: 'https://arxiv.org/abs/2211.17192',
    summary:
      '打破自回归大模型「一次前向传播只能吐出 1 个 Token」串行铁律的传奇算法！作者洞察到两个核心事实：(1) 自然语言中大量词元（如冠词、标点、固定搭配、代码缩进）极其简单，根本不需要动用百亿大模型；(2) 大模型单步推理受限于显存带宽（Memory-bound），并行验证 γ+1 个 Token 的耗时与只生成 1 个 Token 几乎完全相同！投机采样（Speculative Decoding）让一个极快的轻量草稿模型（Draft Model M_q）先连续猜出 γ 个候选词，再交给目标大模型（Target Model M_p）在【单次前向传播】中并行算出所有位置的概率分布，最后通过精妙的「修正拒绝采样（Modified Rejection Sampling）」一次性接受前缀并采样修正词。不仅实现 2x~3x 延迟降低，更在数学上严格证明输出分布与目标大模型单独采样【100% 恒等无损】！',
    keyContributions: [
      '洞察自回归解码的硬件带宽闲置悖论：单次前向传播并行校验 γ=5 个 Token 的耗时几乎等于生成 1 个 Token 的耗时',
      '构建「小模型串行打草稿（Draft γ steps）+ 大模型单步并行打分（Parallel Verify in 1 step）」的协同推理流水线',
      '发明「修正拒绝采样（Modified Rejection Sampling）」：以 min(1, p(x)/q(x)) 概率接受草稿，一旦拒绝则从残差分布 norm(max(0, p - q)) 中重采样，保证每轮至少推进 1 个且最多推进 γ+1 个 Token',
      '给出严密的数学定理证明：无论草稿模型多差、无论温度 T 如何设置，最终生成的 Token 序列概率分布与纯目标大模型 M_p 完全恒等（Exact Distribution Preservation）'
    ],
    coreProblem:
      '自回归大模型生成 K 个 Token 必须串行执行 K 次完整的前向传播，每次都要把数百 GB 的模型权重从 HBM 读进计算核心一次，算术强度极低（Arithmetic Intensity ≈ 1），90% 的算力在空等显存带宽，导致单用户流式输出速度缓慢。',
    coreIdea:
      '借鉴 CPU 硬件的「分支预测（Branch Prediction）」！先派一个体积小 10~20 倍的小模型（或 Medusa/MTP 预测头）快速往前连猜 γ 个词作为草稿；然后把这 γ 个词拼在一起喂给大模型做【一次】前向传播，同时拿到大模型在这 γ+1 个位置上的真实概率分布。凡是小模型猜对的直接批量放行，猜错的第一个位置用大模型分布当场纠正（白赚一个修正词）！',
    simulatorTitle: 'Speculative Decoding 投机采样加速比与接受率 α 推演实验台',
    simulatorDesc: '交互式调节草稿步长 γ (1~10)、草稿接受率 α (0.4~0.95) 与小/大模型耗时比 c，实时计算期望每步生成词数与真实墙钟加速比。',
    architectureSteps: [
      {
        id: 'spec-step-1',
        title: '1. 轻量模型快速自回归打草稿',
        subtitle: 'Fast Autoregressive Drafting (γ Tokens)',
        description: '利用参数量仅为主模型 1/10~1/20 的草稿模型 M_q，从当前上下文出发快速连续采样 γ 个候选 Token x̃_1, ..., x̃_γ 及其条件概率 q_1(x), ..., q_γ(x)。',
        highlightColor: 'emerald'
      },
      {
        id: 'spec-step-2',
        title: '2. 目标大模型单次前向并行评估',
        subtitle: 'Single-Pass Target Parallel Scoring',
        description: '将原始前缀与 γ 个草稿词拼接后一次性输入目标大模型 M_p，利用因果掩码在单次前向传播中同时算出全部 γ+1 个位置的真实分布 p_1(x), ..., p_{γ+1}(x)。',
        highlightColor: 'cyan'
      },
      {
        id: 'spec-step-3',
        title: '3. 顺序拒绝采样校验 min(1, p/q)',
        subtitle: 'Sequential Rejection Sampling Check',
        description: '从 i=1 到 γ 依次生成均匀随机数 r_i ~ U(0,1)：若 r_i < p_i(x̃_i)/q_i(x̃_i) 则接受草稿词 x̃_i；一旦在某位置 k 拒绝，立即丢弃后续草稿并跳至修正步。',
        highlightColor: 'amber'
      },
      {
        id: 'spec-step-4',
        title: '4. 残差分布重采样或奖励第 γ+1 词',
        subtitle: 'Residual Resampling or Bonus Token',
        description: '若在位置 k 被拒，从修正残差分布 p\'(x) = norm(max(0, p_k(x) - q_k(x))) 采样一个正确词替补；若 γ 个草稿全部通过，则直接从 p_{γ+1}(x) 额外免费采样第 γ+1 个奖励词！',
        highlightColor: 'purple'
      }
    ],
    formulas: [
      {
        id: 'spec-f1',
        name: '修正拒绝采样接受准则与残差重采样分布',
        category: '无损分布校验',
        formula: 'P(\\text{Accept } \\tilde{x}_i) = \\min\\!\\left(1, \\frac{p_i(\\tilde{x}_i)}{q_i(\\tilde{x}_i)}\\right), \\qquad p\'_i(x) = \\frac{\\max(0,\\; p_i(x) - q_i(x))}{\\sum_{x\'} \\max(0,\\; p_i(x\') - q_i(x\'))}',
        explanation: '因为 P(输出=x) = q(x)·min(1, p(x)/q(x)) + (1-α)·p\'(x) = min(p(x), q(x)) + max(0, p(x)-q(x)) = p(x)，严格证明最终采样分布恒等于目标大模型 p(x)！',
        variables: [
          { symbol: 'p_i(x), q_i(x)', desc: '目标大模型与草稿小模型在第 i 步输出的概率分布' },
          { symbol: 'p\'_i(x)', desc: '草稿被拒绝时用于补偿概率差额的修正残差分布' }
        ]
      },
      {
        id: 'spec-f2',
        name: '单轮投机期望生成 Token 数与端到端加速比定理',
        category: '期望加速比公式',
        formula: '\\mathbb{E}[\\text{Tokens / step}] = \\frac{1 - \\alpha^{\\gamma+1}}{1 - \\alpha}, \\qquad \\text{Speedup}(\\gamma, \\alpha, c) = \\frac{1 - \\alpha^{\\gamma+1}}{(1 - \\alpha)(\\gamma c + 1)}',
        explanation: '当草稿接受率 α = 0.8、步长 γ = 5、草稿耗时比 c = 0.05 时，单次大模型前向平均可产出 3.69 个 Token，实现近 3 倍真实加速！',
        variables: [
          { symbol: '\\alpha', desc: '草稿 Token 的平均期望接受率 E[min(1, p/q)] = 1 - D_TV(p, q)' },
          { symbol: '\\gamma', desc: '每轮草稿模型超前猜测的步数（通常取 4 ~ 7）' },
          { symbol: 'c', desc: '草稿模型单步耗时与目标大模型单步耗时的比值 (T_draft / T_target)' }
        ]
      }
    ],
    metricCards: [
      { label: '端到端生成速度提升', value: '2.0x ~ 3.4x 倍加速', desc: 'T5-XXL (11B) 与 Chinchilla (70B) 实测降低 50%~70% 生成延迟', color: 'emerald' },
      { label: '输出概率分布保真度', value: '100.0% 数学恒等无损', desc: '非近似算法！无论是贪婪解码还是温度采样均与原模型完全一致', color: 'cyan' },
      { label: '目标大模型权重重训需求', value: '0 (即插即用)', desc: '无需修改或重训主模型，任意共享词表的小模型均可充当草稿器', color: 'amber' },
      { label: '单轮最大推进 Token 数', value: 'γ + 1 个 Tokens', desc: '全中时额外奉送第 γ+1 个 Bonus Token，保底至少产出 1 个 Token', color: 'purple' }
    ],
    experimentSections: [
      {
        title: 'T5-XXL (11B) 与 Chinchilla (70B) 在翻译、摘要与代码生成上的投机采样加速实测',
        description: '使用 T5-Small (60M) 作为 T5-XXL (11B) 的草稿模型（c ≈ 0.04），测试不同任务与采样温度下的接受率 α 与墙钟加速比。',
        headers: ['任务与解码设置', '草稿模型配置 (γ=5)', '平均草稿接受率 α', '端到端墙钟加速比 (↑)'],
        rows: [
          ['标准自回归解码 (Baseline)', '无草稿 (每次 1 Token)', '—', '1.00x (基准延迟)'],
          ['WMT 英德翻译 (Temp = 1.0 随机采样)', 'T5-Small (60M, γ=5)', 'α = 0.75 (每轮 3.1 词)', '2.60x 提速'],
          ['WMT 英德翻译 (Temp = 0.0 贪婪解码)', 'T5-Small (60M, γ=5)', 'α = 0.82 (每轮 3.5 词)', '3.10x 提速'],
          ['HumanEval 代码生成 (Chinchilla 70B + 4B 草稿)', '4B Draft (γ=7)', 'α = 0.86 (代码结构高度可预测)', '3.40x 提速 (SOTA)']
        ]
      }
    ],
    insights: [
      {
        title: '为什么在随机温度采样（Temp > 0）下，投机采样依然能保持 100% 分布无损？',
        content: '如果是贪婪解码（Temp=0），只需检查 argmax(p) == argmax(q) 即可；但对于随机采样，直接接受小模型采样会偏向 q(x)。论文设计的 min(1, p/q) 削峰填谷机制刚好把 q(x) > p(x) 的多出部分按比例拒绝，再通过残差分布 max(0, p-q) 精准补齐 p(x) > q(x) 的缺口，两项相加严丝合缝等于 p(x)！'
      },
      {
        title: '从独立小模型草稿到 Medusa / EAGLE / DeepSeek-V3 MTP（多 Token 预测）',
        content: '部署两个独立模型有时工程较重，因此工业界迅速基于本文演化出「自投机（Self-Speculative）」流派：如 Medusa、EAGLE 以及 DeepSeek-V3 在预训练时直接内置的 Multi-Token Prediction (MTP) 头，用主模型自己的最后一层特征直接预测未来 2~4 个草稿词！'
      }
    ],
    takeaways: [
      { icon: 'FastForward', title: '用过剩算力换取稀缺带宽', desc: '大模型推理不缺算力缺带宽，一次加载权重顺带并行验 5 个词几乎零额外耗时。' },
      { icon: 'CheckCircle2', title: '零精度妥协的免费午餐', desc: '不同于量化或剪枝会略微掉点，投机采样在数学上与原模型输出分布 100% 恒等。' },
      { icon: 'Code', title: '代码与结构化输出加速神器', desc: '在代码补全、JSON 生成与 RAG 引用等高确定性场景下，接受率 α 常超 85%，提速超 3 倍。' },
      { icon: 'Layers', title: '启发 MTP 多词预测预训练', desc: '直接推动了 DeepSeek-V3 等新一代旗舰模型将多 Token 预测头内置为原生架构。' }
    ]
  },

  'gptq-2022': {
    id: 'gptq-2022',
    title: 'GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers',
    chineseTitle: 'GPTQ 与 AWQ 后训练量化：利用二阶海森补偿将百亿大模型无损塞进单张显卡',
    subtitle: 'Elias Frantar, Saleh Ashkboos, Torsten Hoefler, Dan Alistarh • IST Austria & ETH Zurich • ICLR 2023 (同栈演进: AWQ 2306.00978)',
    tags: ['GPTQ 4-bit 量化', 'OBQ 二阶海森逆补偿', 'Cholesky 块延迟更新', 'AWQ 激活感知显著权重', '单卡部署 175B'],
    arxivId: '2210.17323',
    pdfUrl: 'https://arxiv.org/pdf/2210.17323.pdf',
    abstractUrl: 'https://arxiv.org/abs/2210.17323',
    summary:
      '让千亿参数大模型得以压缩为 4-bit / 3-bit 在单张消费级或服务器显卡上高速推理的工业界量化标准（与紧随其后的 AWQ 2306.00978 共同统治开源模型发布格式）！此前基于舍入到最近值（RTN）的 4-bit 量化在百亿模型上会导致困惑度（PPL）雪崩，而经典的二阶海森矩阵逐权重最优脑量化（OBQ）复杂度高达 O(d_row · d_col³)，量化一个百亿模型需要数周。GPTQ 洞察到按固定列顺序同步量化所有行可共享同一个海森矩阵 H = 2XX^T，并通过「延迟块更新（Lazy Batch Updates）+ Cholesky 三角分解」将 175B 模型的量化时间压缩至 4 GPU 小时内，首次实现在单张 80GB A100 上无损运行 175B 模型并获得 3.25x~4.5x 推理加速！',
    keyContributions: [
      '打破 OBQ 贪心逐权重选择导致的 O(d_row · d_col³) 算力死锁：证明按固定列顺序同步量化整列权重对最终精度几乎无影响，从而使所有行共享同一海森逆矩阵 H^{-1}',
      '提出「延迟块更新（Lazy Batch-Updates, B=128）」：将逐列秩-1 更新聚合成矩阵块乘法，将 GPU 显存带宽瓶颈转化为高吞吐 Tensor Core 计算，提速超 10 倍',
      '引入基于 Cholesky 分解的预先求逆重构，彻底解决了千亿模型海森矩阵病态近似引发的数值不稳定崩溃',
      '与后续 AWQ（2306.00978：发现保护激活值最大的 1% 显著权重通道并做等价缩放 s 即可免优化器无损量化）共同构成现代 INT4/FP4 权重压缩工业底座'
    ],
    coreProblem:
      '将 175B 模型从 FP16（350GB，至少需 5 张 80GB A100）直接四舍五入量化（RTN）到 4-bit 或 3-bit 时，由于未补偿权重截断对层输出 WX 的累积误差，模型困惑度直接崩溃；而传统二阶补偿算法 OBQ 在百亿规模下需要数百个小时且数值极易发散。',
    coreIdea:
      '最小化层输出的二阶重构误差 ||WX - ŴX||₂²！当把第 q 列的权重 w_q 四舍五入量化为 quant(w_q) 时，会产生一个微小量化误差 δ_q。GPTQ 利用海森逆矩阵 H^{-1} = (2XX^T + λI)^{-1} 的相关性信息，当场调整【尚未量化的右侧剩余列权重】来精确抵消这笔误差，并每 128 列打包执行一次高速矩阵块更新！',
    simulatorTitle: 'GPTQ 二阶海森补偿与 AWQ 显著通道缩放量化实验台',
    simulatorDesc: '交互式调节目标比特数 (8/4/3/2-bit)、分块大小 B 与 AWQ 显著通道保护比例，对比 RTN、GPTQ 与 AWQ 的困惑度保持率与单卡推理加速。',
    architectureSteps: [
      {
        id: 'gptq-step-1',
        title: '1. 校准集统计海森矩阵与 Cholesky 分解',
        subtitle: 'Calibration Hessian & Cholesky Factor',
        description: '仅需喂入 128 条无标签校准文本，统计每层输入的协方差海森矩阵 H = 2XX^T，加上阻尼项 λI 后一次性计算逆矩阵的上三角 Cholesky 因子 L = chol(H^{-1})^T。',
        highlightColor: 'emerald'
      },
      {
        id: 'gptq-step-2',
        title: '2. 块内 (B=128) 逐列量化与误差累积',
        subtitle: 'Intra-Block Column Quantization & Error Compensation',
        description: '在大小为 B=128 的列块内部，依次将第 j 列量化 Q_j = quant(W_j)，计算归一化误差 E_j = (W_j - Q_j) / [H^{-1}]_{jj}，并仅更新当前块内右侧未量化列。',
        highlightColor: 'cyan'
      },
      {
        id: 'gptq-step-3',
        title: '3. 跨块延迟矩阵更新 (Lazy Batch Update)',
        subtitle: 'Compute-Bound Lazy Block Matrix Update',
        description: '每处理完 128 列，使用一次高算术强度的矩阵乘法 W_{:, i+B:} ← W_{:, i+B:} - E · H^{-1}_{i:i+B, i+B:} 一次性补偿右侧所有剩余列，速度飙升 10 倍！',
        highlightColor: 'amber'
      },
      {
        id: 'gptq-step-4',
        title: '4. AWQ 激活感知显著通道等价缩放 (协同演进)',
        subtitle: 'AWQ Salient Channel Scaling (s · W) · (s^{-1} · X)',
        description: '林佳俊等 (AWQ) 进一步发现：根据输入激活幅值 |X| 挑出最关键的 1% 权重通道乘以放大因子 s > 1（输入端除以 s），无需反向梯度且具备极强跨领域泛化！',
        highlightColor: 'purple'
      }
    ],
    formulas: [
      {
        id: 'gptq-f1',
        name: 'GPTQ 二阶海森最优权重误差补偿更新律',
        category: '二阶最优脑量化',
        formula: '\\mathbf{E}_{:, j} = \\frac{\\mathbf{W}_{:, j} - \\text{quant}(\\mathbf{W}_{:, j})}{\\left[\\mathbf{H}^{-1}\\right]_{jj}}, \\qquad \\mathbf{W}_{:, j:(i+B)} \\leftarrow \\mathbf{W}_{:, j:(i+B)} - \\mathbf{E}_{:, j} \\cdot \\left[\\mathbf{H}^{-1}\\right]_{j, j:(i+B)}',
        explanation: '当前列量化产生的误差 E_{:,j}，由右侧尚未量化的权重根据海森逆矩阵协方差自动反向微调予以抵消，使层输出 WX 保持不变。',
        variables: [
          { symbol: '\\mathbf{H} = 2\\mathbf{X}\\mathbf{X}^T', desc: '层输出重构损失 ||WX - ŴX||₂² 关于权重的二阶海森矩阵' },
          { symbol: '\\mathbf{E}_{:, j}', desc: '第 j 列权重的归一化量化误差向量' },
          { symbol: 'B = 128', desc: '延迟块更新的列块宽度，将访存受限转化为计算受限' }
        ]
      },
      {
        id: 'gptq-f2',
        name: 'AWQ 激活感知通道等价变换缩放公式 (2306.00978)',
        category: '激活感知量化',
        formula: '\\mathbf{Y} = \\mathbf{W}\\mathbf{X} = (\\mathbf{W} \\cdot \\text{diag}(\\mathbf{s})) \\cdot (\\text{diag}(\\mathbf{s})^{-1} \\mathbf{X}), \\qquad \\mathbf{s}^* = \\left( \\text{mean}(|\\mathbf{X}|) \\right)^\\alpha',
        explanation: '对对应激活幅值 |X| 最大的显著权重通道放大 s 倍后再做整数舍入，使其相对量化误差缩小 1/s，同时将 s^{-1} 融合进上一层算子实现零额外开销。',
        variables: [
          { symbol: '\\mathbf{s}', desc: '逐输入通道计算的等价缩放向量，由激活绝对均值决定' },
          { symbol: '\\alpha \\in [0, 1]', desc: '平衡显著通道与普通通道量化误差的网格搜索指数（通常 α ≈ 0.5）' }
        ]
      }
    ],
    metricCards: [
      { label: '175B 模型单卡部署突破', value: '5×A100 ➔ 1×A100', desc: '350GB 权重压缩至约 88GB (4-bit) / 66GB (3-bit)，单卡跑通千亿模型', color: 'emerald' },
      { label: '端到端 Token 推理提速', value: '3.25x ~ 4.53x 加速', desc: '4-bit 权重读取字节减少 4 倍，直接突破 Decode 阶段显存带宽墙', color: 'cyan' },
      { label: '175B 全模型量化耗时', value: '仅需 4 GPU 小时', desc: '相比 OBQ 提速超百倍，且完全无需反向传播或重训练', color: 'amber' },
      { label: '4-bit 困惑度精度损失', value: '< 0.03 PPL (近乎无损)', desc: '在 WikiText2 上 OPT-175B 4-bit 困惑度 8.37 vs FP16 8.34', color: 'purple' }
    ],
    experimentSections: [
      {
        title: 'OPT-175B 与 BLOOM-176B 在不同比特后训练量化下的 WikiText2 困惑度 (PPL ↓) 对比',
        description: '验证在 4-bit 与极限 3-bit 下，普通四舍五入 RTN 发生严重退化，而 GPTQ 与 AWQ 几乎完美保持 FP16 原始精度。',
        headers: ['量化算法与位宽', '175B 模型权重显存', 'OPT-175B WikiText2 PPL (↓)', '单步生成加速比 (↑)'],
        rows: [
          ['FP16 Baseline (16-bit 原始精度)', '350.0 GB (需 5×80GB GPU)', '8.34 (基准精度)', '1.00x'],
          ['RTN 4-bit / 3-bit (直接四舍五入)', '87.5 GB / 65.6 GB', '10.54 (4-bit) / 7360.0 (3-bit 彻底崩溃!)', '3.20x (但无法使用)'],
          ['GPTQ 3-bit (本文二阶海森补偿)', '65.6 GB (单张 80GB 卡轻松装下!)', '8.68 (比 RTN 4-bit 还要精准!)', '3.90x'],
          ['GPTQ / AWQ 4-bit (g128 工业标准)', '88.5 GB', '8.37 / 8.35 (与 FP16 仅差 0.01~0.03!)', '3.25x ~ 4.50x (SOTA)']
        ]
      }
    ],
    insights: [
      {
        title: '为什么在 Batch=1 或小并发推理时，4-bit 权重但 16-bit 计算（W4A16）反而比 FP16 快 3~4 倍？',
        content: '很多初学者误以为「既然计算时还要反量化回 FP16 乘激活，算力没省怎么会变快？」。原因在于 Decode 阶段是极度访存受限（Memory-bound）的：90% 的时间花在把权重从 HBM 搬到寄存器上！W4A16 让需要从 HBM 搬运的权重体积缩小了整整 4 倍，而片上反量化只需几个寄存器指令，因此端到端速度直接飙升 3.25~4.5 倍！'
      },
      {
        title: 'GPTQ 与 AWQ 在工程选型上各有什么长处？',
        content: 'GPTQ 利用二阶海森逆主动修改剩余权重来拟合校准集，在极低比特（如 3-bit / 2-bit）下重构能力极强；而 AWQ 不修改非显著权重的相对关系、仅做通道缩放，因此完全不会过拟合校准集，在多模态（VLM）、数学与代码跨领域任务上泛化极为稳健。'
      }
    ],
    takeaways: [
      { icon: 'Minimize2', title: 'W4A16 破局访存带宽墙', desc: '权重压成 4-bit 搬运，进片上再反量化为 FP16 乘激活，既省 4 倍显存又提速 3~4 倍。' },
      { icon: 'Sliders', title: '前人犯错，后列买单', desc: 'GPTQ 的精髓是用海森逆矩阵让后面未量化的列主动微调，把前面列四舍五入欠下的债补平。' },
      { icon: 'Sparkles', title: 'AWQ 1% 显著权重定律', desc: '权重并非生而平等，决定模型智商的是对应激活值最大的那 1% 显著通道。' },
      { icon: 'Package', title: 'HuggingFace 开源发布标配', desc: '如今任何新开源大模型发布当天，社区都会第一时间产出 -GPTQ 与 -AWQ 两大标准量化包。' }
    ]
  },

  'deepseek-v2-2024': {
    id: 'deepseek-v2-2024',
    title: 'DeepSeek-V2: A Strong, Economical, and Efficient Mixture-of-Experts Language Model',
    chineseTitle: 'DeepSeek-V2：多头潜在注意力 (MLA) 与细粒度共享专家 (DeepSeekMoE) 的经济高效大模型革命',
    subtitle: 'DeepSeek-AI (深度求索) • arXiv 2024 (奠定 DeepSeek-V3 / R1 核心架构底座)',
    tags: ['DeepSeek-V2', 'MLA 多头潜在注意力', 'KV Cache 压缩 93.3%', '解耦旋转编码 Decoupled RoPE', 'DeepSeekMoE 细粒度+共享专家'],
    arxivId: '2405.04434',
    pdfUrl: 'https://arxiv.org/pdf/2405.0434.pdf',
    abstractUrl: 'https://arxiv.org/abs/2405.04434',
    summary:
      '掀翻全球大模型 API 定价桌子、直接奠定后续 DeepSeek-V3 与 DeepSeek-R1 架构基座的现象级巨著！面对标准 Transformer 在长上下文推理时庞大的 KV Cache 显存瓶颈，以及传统 GQA/MQA 牺牲模型精度的无奈妥协，DeepSeek-V2 提出了革命性的「多头潜在注意力（Multi-head Latent Attention, MLA）」：通过将 Key 和 Value 联合低秩压缩为一个极小的潜在向量 c_t^{KV}（512维），并在推理时将上投影矩阵吸收进 W_Q 与 W_O 中，使 KV Cache 惊人地暴降 93.3%，同时性能反而超越标准多头注意力（MHA）！配合「细粒度专家切分 + 独立共享专家」的 DeepSeekMoE 架构（总参数 236B，每 Token 仅激活 21B），实现了训练成本降低 42.5%、最大生成吞吐量飙升 5.76 倍的工程奇迹！',
    keyContributions: [
      '首创多头潜在注意力（MLA）：利用低秩键值联合压缩 c_t^{KV} = W^{DKV} h_t 将每个 Token 需缓存的 KV 元素从 2·n_h·d_h 压降至 d_c + d_R，KV Cache 削减高达 93.3%',
      '发现并攻克「RoPE 与低秩矩阵吸收冲突」难题：若直接对压缩后的 K 加 RoPE，中间出现位置依赖矩阵 R_{t-i} 导致无法将 W^{UK} 吸收进 W^Q；首创「解耦 RoPE（Decoupled RoPE）」单独用小维度 k_t^R 承载旋转位置信息',
      '设计 DeepSeekMoE 稀疏混合专家层：每层包含 2 个固定激活的「共享专家（捕获通用共性知识）」与 160 个路由专家中动态选 6 个的「细粒度专家（组合自由度高出千倍）」',
      '以 236B 总参数、21B 激活参数击败 70B~72B 稠密旗舰，训练成本较 DeepSeek 67B 降低 42.5%，单节点 8×H800 推理吞吐突破 50,000+ Tokens/s（提速 5.76 倍）'
    ],
    coreProblem:
      '在长上下文与高并发推理中，传统 MHA 的 KV Cache 占用海量显存；虽然 GQA（分组查询注意力）和 MQA（多查询注意力）通过强行让多个头共享同一套 K/V 来砍显存，但这严重阉割了注意力的特征表达子空间，导致模型智商明显退化。如何才能「既要把 KV Cache 砍掉 90% 以上，又要让模型表达力比标准 MHA 更强」？',
    coreIdea:
      '不要粗暴删减注意力头，而是对所有头的 Key 和 Value 做「低秩潜在空间联合压缩（MLA）」！在缓存时只存一个 512 维的紧致潜向量 c_t^{KV}（相当于仅 2.25 个头的开销）；更绝妙的是，在推理阶段根本不需要把 c_t^{KV} 展开回高维 K 和 V，而是利用矩阵乘法结合律，把展开矩阵 W^{UK} 直接左乘吸收进 Query 投影矩阵里，把 W^{UV} 吸收进输出投影矩阵里！',
    simulatorTitle: 'DeepSeek-V2 MLA 潜在向量吸收与 DeepSeekMoE 成本实验台',
    simulatorDesc: '交互式调节注意力头数 n_h、潜在压缩维度 d_c (256~1024)、解耦 RoPE 维度 d_R 与激活专家数，实时对比 MHA / GQA / MLA 的 KV Cache 压缩率与吞吐加速。',
    architectureSteps: [
      {
        id: 'ds2-step-1',
        title: '1. 键值低秩潜在联合压缩 c_t^{KV}',
        subtitle: 'Low-Rank Key-Value Joint Compression',
        description: '将隐藏状态 h_t (d=5120) 通过下投影矩阵 W^{DKV} 压缩为 d_c=512 维的潜在向量 c_t^{KV}，训练时由 W^{UK}, W^{UV} 恢复出 128 个头的完整 K 和 V。',
        highlightColor: 'emerald'
      },
      {
        id: 'ds2-step-2',
        title: '2. 矩阵吸收律实现免展开推理',
        subtitle: 'Weight Absorption Trick (W^{UK} into W^Q)',
        description: '推理计算 q_t^T k_i = (W^Q h_t)^T (W^{UK} c_i^{KV}) = (h_t^T W^Q W^{UK}) c_i^{KV}，提前将 W^{UK} 吸收进 W^Q、W^{UV} 吸收进 W^O，避免在推理时实例化高维 K/V！',
        highlightColor: 'cyan'
      },
      {
        id: 'ds2-step-3',
        title: '3. 解耦旋转位置编码 (Decoupled RoPE)',
        subtitle: 'Decoupling Position-Sensitive RoPE Head',
        description: '由于 RoPE 旋转矩阵 R_m 夹在 W^Q 与 W^{UK} 中间会阻断矩阵吸收，MLA 将每个头拆出 d_R=64 维专门施加 RoPE（所有头共享一个 k_t^R），其余 d_h=128 维不加 RoPE 实现完美吸收！',
        highlightColor: 'amber'
      },
      {
        id: 'ds2-step-4',
        title: '4. DeepSeekMoE 细粒度与共享专家协同',
        subtitle: 'Fine-Grained Experts + Shared Expert Isolation',
        description: '每层固定激活 2 个共享专家处理高频通用知识（避免路由专家重复学习冗余特征），并从 160 个细粒度路由专家中经设备受限路由（Device-Limited Routing）选出 Top-6 专精专家。',
        highlightColor: 'purple'
      }
    ],
    formulas: [
      {
        id: 'ds2-f1',
        name: 'MLA 低秩压缩、解耦 RoPE 与矩阵吸收恒等式',
        category: '多头潜在注意力 (MLA)',
        formula: '\\mathbf{c}_t^{KV} = W^{DKV}\\mathbf{h}_t \\in \\mathbb{R}^{d_c}, \\quad \\mathbf{k}_t^R = \\text{RoPE}(W^{KR}\\mathbf{h}_t) \\in \\mathbb{R}^{d_h^R}, \\quad \\mathbf{q}_{t,i}^T \\mathbf{k}_{j,i} = \\underbrace{(\\mathbf{c}_t^Q W_{:,i}^{UQ\\,T} W_{:,i}^{UK})}_{\\text{吸收合并投影}} \\mathbf{c}_j^{KV} + (\\mathbf{q}_{t,i}^R)^T \\mathbf{k}_j^R',
        explanation: '整层只需在 KV Cache 中存储 [c_t^{KV}; k_t^R] 共 512 + 64 = 576 个浮点数，相比标准 MHA 的 2 × 128 × 128 = 32,768 个元素暴减 93.3%（若与 d_h=128, n_h=128 的标准配置对比仅相当于 2.25 个 GQA 组）！',
        variables: [
          { symbol: '\\mathbf{c}_t^{KV}', desc: '压缩后的键值共享潜在向量（d_c = 512）' },
          { symbol: '\\mathbf{k}_t^R', desc: '所有注意力头共享的解耦旋转位置 Key 向量（d_h^R = 64）' },
          { symbol: 'W^{UK}, W^{UV}', desc: '推理时被分别吸收进 Query 投影与 Output 投影的键值上投影矩阵' }
        ]
      },
      {
        id: 'ds2-f2',
        name: 'DeepSeekMoE 共享专家与细粒度路由前向方程',
        category: '混合专家架构 (MoE)',
        formula: '\\mathbf{h}\'_t = \\mathbf{u}_t + \\sum_{i=1}^{N_s} \\text{FFN}_i^{(s)}(\\mathbf{u}_t) + \\sum_{i=1}^{N_r} g_{i,t}\\,\\text{FFN}_i^{(r)}(\\mathbf{u}_t), \\qquad g_{i,t} = \\begin{cases} s_{i,t}, & s_{i,t} \\in \\text{Topk}(\\{s_{j,t}\\}, K_r) \\\\ 0, & \\text{otherwise} \\end{cases}',
        explanation: '通过剥离 N_s=2 个常驻共享专家，让其余 N_r=160 个细粒度路由专家专注于正交的专业领域知识，激活参数仅 21B 却具备 236B 的知识容量。',
        variables: [
          { symbol: 'N_s=2, N_r=160, K_r=6', desc: '2个共享专家 + 160个路由专家中每 Token 激活 Top-6（总计激活 8 个细粒度专家）' },
          { symbol: 's_{i,t} = \\text{Softmax}_i(\\mathbf{u}_t^T \\mathbf{e}_i)', desc: 'Token 对第 i 个路由专家的亲和度门控得分' }
        ]
      }
    ],
    metricCards: [
      { label: 'KV Cache 显存削减率', value: '-93.3% (压缩近15倍)', desc: '每 Token 每层仅存 576 个元素，仅相当于 GQA 2.25 组的开销', color: 'emerald' },
      { label: '最大生成吞吐量加速', value: '5.76x 倍 (vs 67B)', desc: '单台 8×H800 节点实测实际生成吞吐超过 50,000 Tokens/s', color: 'cyan' },
      { label: '总参数 vs 激活参数', value: '236B 总 / 21B 激活', desc: '每 Token 仅激活 8.9% 参数，训练算力成本节省 42.5%', color: 'amber' },
      { label: 'MMLU 与中文基准表现', value: '78.5% / 84.0%', desc: '以 21B 激活算力全面超越 LLaMA-3 70B 与 Mixtral 8x22B', color: 'purple' }
    ],
    experimentSections: [
      {
        title: '注意力机制消融实验 (MHA vs GQA vs MLA) 与旗舰模型综合性价比对比',
        description: '论文严密消融证明：GQA 和 MQA 省了 KV 缓存却显著伤及模型精度，而 MLA 在缓存比 GQA 更小的同时，精度反而超越全尺寸 MHA！',
        headers: ['模型与注意力架构', '每 Token 每层 KV 缓存大小 (↓)', '激活参数 / 总参数', 'MMLU 准确率 (↑) & 生成吞吐'],
        rows: [
          ['Standard MHA (标准多头注意力)', '2 × n_h × d_h (100% 基准开销)', '67B / 67B (稠密)', '71.3% • 1.00x 吞吐'],
          ['GQA (8 Groups 分组查询注意力)', '16 × d_h (压缩至 12.5%)', '70B / 70B (稠密)', '精度较同尺寸 MHA 下降约 1.8%'],
          ['MQA (单键值多查询注意力)', '2 × d_h (极端压缩，多头退化)', '稠密基线', '精度严重下降 3.4% (表达力受损)'],
          ['DeepSeek-V2 (MLA + DeepSeekMoE 本文)', '4.5 × d_h (压缩 93.3%!)', '21B / 236B (稀疏MoE)', '78.5% (超MHA!) • 5.76x 吞吐飞跃']
        ]
      }
    ],
    insights: [
      {
        title: '为什么直接对压缩后的潜向量加 RoPE 会让 MLA 的显存优势瞬间归零？',
        content: '这是 MLA 最精彩的技术细节：如果不拆分解耦 RoPE，那么 k_i = R_i W^{UK} c_i^{KV}。此时在计算 q_t^T k_i = (h_t^T W^Q) R_{i-t} (W^{UK} c_i^{KV}) 时，中间横亘着一个随每个历史位置 i 变化的旋转矩阵 R_{i-t}，导致 W^Q 和 W^{UK} 根本无法提前静态相乘合并！如果不合并，推理时就必须把所有历史 c_i^{KV} 重新乘以 W^{UK} 展开成巨大的 K，算力直接爆炸。因此「解耦出一个小小的 64 维专门挂 RoPE」是救活整个 MLA 的点睛之笔！'
      },
      {
        title: '从 DeepSeek-V2 到 DeepSeek-V3 / R1 的一脉相承',
        content: 'DeepSeek-V2 确立的「MLA + DeepSeekMoE」双核架构被原封不动地继承到了随后的 671B DeepSeek-V3 与 DeepSeek-R1 中（仅将路由负载均衡升级为无辅助损失的无偏动态偏置调整），成为国产大模型改写全球 AI 格局的架构基石。'
      }
    ],
    takeaways: [
      { icon: 'Minimize', title: '比 GQA 更省，比 MHA 更强', desc: 'MLA 用低秩潜空间压缩 + 矩阵乘法结合律吸收，打破了 KV 缓存与模型精度的零和博弈。' },
      { icon: 'Compass', title: '解耦 RoPE 巧破非交换律', desc: '把对位置敏感的旋转编码剥离到 64 维共享小头上，保住了主干权重的静态吸收能力。' },
      { icon: 'GitBranch', title: '共享专家 + 细粒度专家', desc: '常驻共享专家兜底通用知识，160 选 6 细粒度专家提供指数级专业知识组合。' },
      { icon: 'DollarSign', title: '把百万 Token 价格打入一元的元勋', desc: '93.3% 的 KV 缓存缩减与 21B 激活量，正是 DeepSeek 极具统治力推理成本的物理根源。' }
    ]
  }
};
