import { UniversalPaperData } from "../../../../src/shared/types/universalPaper.js";

export const RESNET_2015_DATA: UniversalPaperData = {
  "id": "resnet-2015",
  "title": "Deep Residual Learning for Image Recognition",
  "chineseTitle": "ResNet 深度残差学习：让千层深度神经网络得以训练的残差连接基石",
  "subtitle": "Kaiming He (何恺明), Xiangyu Zhang, Shaoqing Ren, Jian Sun (孙剑) • Microsoft Research Asia (MSRA) • CVPR 2016 Best Paper",
  "tags": [
    "ResNet 残差网络",
    "Skip Connection 恒等捷径",
    "退化问题 Degradation",
    "残差映射 F(x)+x",
    "梯度高速公路"
  ],
  "arxivId": "1512.03385",
  "pdfUrl": "https://arxiv.org/pdf/1512.03385.pdf",
  "abstractUrl": "https://arxiv.org/abs/1512.03385",
  "summary": "整个人工智能历史上被引用次数最高的传奇论文！何恺明团队发现深层网络难以训练的根本原因并非过拟合，而是深层非线性层难以拟合恒等变换导致的「退化问题（Degradation）」。通过引入一行极其简洁的恒等捷径连接 y = F(x, {W_i}) + x，将拟合目标转化为学习残差 F(x) = H(x) - x，让反向传播拥有无损的「梯度高速公路」，不仅将网络深度从 19 层一举推向 152 层乃至 1000 层，更成为今日所有 Transformer（x + Attention(x)）不可动摇的骨架！",
  "keyContributions": [
    "揭示并定义了深度网络的「退化现象（Degradation）」：56 层普通网络的训练集误差反而显著高于 20 层网络",
    "提出残差学习块 H(x) = F(x) + x，将学习恒等映射转化为将残差权重推向 0 的简单优化问题",
    "证明恒等捷径连接（Identity Shortcut）既不增加任何额外参数，也不增加乘法计算量，同时保证反向梯度 ∂L/∂x_l = ∂L/∂x_L · (1 + ∂/∂x_l Σ F) 永不消失",
    "设计 1×1 → 3×3 → 1×1 瓶颈结构（Bottleneck），以低于 VGG-19 的计算量实现 152 层超深网络并横扫 ImageNet 与 COCO 全部冠军"
  ],
  "coreProblem": "即使使用了 Batch Normalization 消除了梯度消失/爆炸，当直接堆叠的普通网络（Plain Network）深度超过 20 层时，训练误差和测试误差同时飙升。这是因为用多层非线性激活层去精确拟合一个恒等映射 H(x) = x 在优化上极其困难。",
  "coreIdea": "与其强迫堆叠的非线性层直接拟合底层期望映射 H(x)，不如通过跨层跳跃连接（Skip Connection）把输入 x 直接加到输出端，让网络层只负责拟合残差 F(x) = H(x) - x。如果某层是最优恒等变换，优化器只需把残差分支权重逼近 0 即可！",
  "simulatorTitle": "ResNet 残差恒等捷径与深层梯度流实验台",
  "simulatorDesc": "对比 Plain Network 与 ResNet 在 18 层至 1000 层下的反向传播梯度范数保持率与训练误差退化曲线。",
  "architectureSteps": [
    {
      "id": "res-step-1",
      "title": "1. 输入特征分流",
      "subtitle": "Input Feature Forking",
      "description": "输入张量 x 同时进入两条路径：主干非线性残差路径 F(x) 与零参数恒等捷径路径（Identity Shortcut）。",
      "highlightColor": "emerald"
    },
    {
      "id": "res-step-2",
      "title": "2. 瓶颈残差变换 F(x)",
      "subtitle": "Bottleneck Residual Mapping",
      "description": "在 ResNet-50/101/152 中采用 1×1 降维卷积 → 3×3 空间卷积 → 1×1 升维卷积，大幅缩减参数量并提取高阶残差特征。",
      "highlightColor": "cyan"
    },
    {
      "id": "res-step-3",
      "title": "3. 逐元素残差相加 y = F(x) + x",
      "subtitle": "Element-wise Residual Addition",
      "description": "将残差分支输出 F(x) 与原始输入 x 逐元素相加（维度变化时使用 1×1 投影 W_s x），把优化基准锚定在恒等映射附近。",
      "highlightColor": "amber"
    },
    {
      "id": "res-step-4",
      "title": "4. 反向传播无损梯度直通",
      "subtitle": "Unimpeded Backward Gradient Highway",
      "description": "根据链式法则，高层梯度 ∂L/∂x_L 可直接通过加号算子中的常数项「1」无损传回任意浅层 ∂L/∂x_l，彻底打破连乘衰减魔咒。",
      "highlightColor": "purple"
    }
  ],
  "formulas": [
    {
      "id": "res-f1",
      "name": "残差构建块前向方程",
      "category": "残差前向传播",
      "formula": "\\mathbf{y} = \\mathcal{F}(\\mathbf{x}, \\{W_i\\}) + \\mathbf{x} \\quad (\\text{或投影捷径 } \\mathbf{y} = \\mathcal{F}(\\mathbf{x}, \\{W_i\\}) + W_s\\mathbf{x})",
      "explanation": "网络层仅需学习残差函数 F(x) = H(x) - x，当恒等映射最优时只需令 W_i → 0。",
      "variables": [
        {
          "symbol": "\\mathbf{x}, \\mathbf{y}",
          "desc": "第 l 个残差块的输入与输出激活向量"
        },
        {
          "symbol": "\\mathcal{F}(\\mathbf{x}, \\{W_i\\})",
          "desc": "待学习的残差映射（如两层或三层卷积）"
        }
      ]
    },
    {
      "id": "res-f2",
      "name": "跨任意深度的递归展开与梯度恒等直通律",
      "category": "反向梯度传播",
      "formula": "\\mathbf{x}_L = \\mathbf{x}_l + \\sum_{i=l}^{L-1} \\mathcal{F}(\\mathbf{x}_i, \\mathcal{W}_i) \\implies \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{x}_l} = \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{x}_L} \\left( \\mathbf{I} + \\frac{\\partial}{\\partial \\mathbf{x}_l} \\sum_{i=l}^{L-1} \\mathcal{F}(\\mathbf{x}_i, \\mathcal{W}_i) \\right)",
      "explanation": "括号内的单位矩阵 I 保证了无论网络叠到 152 层还是 1000 层，误差梯度都能不经任何矩阵连乘衰减直达最底层。",
      "variables": [
        {
          "symbol": "\\mathbf{x}_l, \\mathbf{x}_L",
          "desc": "浅层 l 与深层 L 的特征表示"
        },
        {
          "symbol": "\\mathbf{I}",
          "desc": "由恒等捷径产生的单位雅可比项，保障梯度永不消失"
        }
      ]
    }
  ],
  "metricCards": [
    {
      "label": "ImageNet Top-5 错误率",
      "value": "3.57% (超越人类)",
      "desc": "斩获 ILSVRC 2015 分类、检测、定位及 COCO 全部第一名",
      "color": "emerald"
    },
    {
      "label": "最大成功训练深度",
      "value": "152 层 ~ 1202 层",
      "desc": "突破此前 VGG 19 层极限，首次实现超百层深度网络稳定收敛",
      "color": "cyan"
    },
    {
      "label": "计算复杂度 (vs VGG-19)",
      "value": "11.3B vs 19.6B FLOPs",
      "desc": "152 层 ResNet 的浮点计算量反而比 19 层 VGG 少 42%",
      "color": "amber"
    },
    {
      "label": "现代架构渗透率",
      "value": "100% 深度模型标配",
      "desc": "Transformer 每个子层 x + SubLayer(LN(x)) 的核心支撑",
      "color": "purple"
    }
  ],
  "experimentSections": [
    {
      "title": "Plain 普通网络 vs ResNet 残差网络深度消融对比 (ImageNet)",
      "description": "普通网络从 18 层增至 34 层时错误率反而恶化（退化现象），而 ResNet 随深度增加单调提升精度。",
      "headers": [
        "模型架构与深度",
        "参数量 / FLOPs",
        "ImageNet Top-1 错误率 (↓)",
        "深层收敛特性"
      ],
      "rows": [
        [
          "Plain-18 (无残差连接)",
          "11.7M / 1.8B",
          "27.94%",
          "正常收敛"
        ],
        [
          "Plain-34 (无残差连接)",
          "21.8M / 3.6B",
          "28.54% (反升0.6%!)",
          "严重退化，训练误差高于18层"
        ],
        [
          "ResNet-34 (恒等捷径)",
          "21.8M / 3.6B",
          "25.03% (降3.51%)",
          "消除退化，深层显著获益"
        ],
        [
          "ResNet-152 (Bottleneck 本文旗舰)",
          "60.2M / 11.3B",
          "19.38% (SOTA)",
          "152层极速收敛，精度碾压VGG"
        ]
      ]
    }
  ],
  "insights": [
    {
      "title": "为什么现代大模型全部采用 Pre-LN 残差结构 (x + SubLayer(LN(x)))？",
      "content": "在何恺明随后的续作《Identity Mappings in Deep Residual Networks》(ECCV 2016) 中证明：只有当捷径路径上没有任何激活函数或归一化算子（Clean Identity Path）时，梯度才能从第 L 层无阻尼直达第 1 层。这正是 GPT-2/3 与 LLaMA 全面改用 Pre-Norm 的直接理论来源！"
    },
    {
      "title": "残差网络本质上是浅层网络的指数级集成（Ensemble）",
      "content": "将 L 个残差块展开后共有 2^L 条不同长度的隐式路径连接输入与输出，使深层网络在训练初期优先通过短路径快速收敛，随后逐步激活深层非线性精细表征。"
    }
  ],
  "takeaways": [
    {
      "icon": "GitMerge",
      "title": "一行加法改变AI史",
      "desc": "把输入 x 加回输出端，彻底攻克深度神经网络层数叠不起来的世纪难题。"
    },
    {
      "icon": "Activity",
      "title": "加法替代乘法传梯度",
      "desc": "链式法则中的单位矩阵 +I 让反向传播从连乘衰减变为无损加法汇总。"
    },
    {
      "icon": "Layers",
      "title": "Transformer 的隐形脊梁",
      "desc": "没有残差连接，96 层的 GPT-3 或 126 层的 LLaMA-3 根本无法完成哪怕一步有效训练。"
    },
    {
      "icon": "Award",
      "title": "AI 历史引用之王",
      "desc": "单篇引用超 22 万次，位列二十一世纪全科学领域最高被引论文前列。"
    }
  ]
};

export const PAPER_DATA: UniversalPaperData = RESNET_2015_DATA;
export default PAPER_DATA;
