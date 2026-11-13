import { UniversalPaperData } from "../../../../src/shared/types/universalPaper.js";

export const ROPE_2021_DATA: UniversalPaperData = {
  "id": "rope-2021",
  "title": "RoFormer: Enhanced Transformer with Rotary Position Embedding (RoPE)",
  "chineseTitle": "RoPE 旋转位置编码：以复数平面旋转统一绝对与相对位置的大模型默认标准",
  "subtitle": "Jianlin Su (苏剑林), Yu Lu, Shengfeng Pan, Ahmed Murtadha, Bo Wen, Yunfeng Liu • Zhuiyi Technology (追一科技) • arXiv 2021",
  "tags": [
    "RoPE 旋转位置编码",
    "用绝对旋转实现相对位置",
    "复数内积 Re[q·k*·e^{i(m-n)θ}]",
    "远程衰减特性",
    "NTK/YaRN 长上下文外推"
  ],
  "arxivId": "2104.09864",
  "pdfUrl": "https://arxiv.org/pdf/2104.09864.pdf",
  "abstractUrl": "https://arxiv.org/abs/2104.09864",
  "summary": "2021 年之后几乎所有开源与商业大语言模型（LLaMA 1/2/3、Mistral、Qwen、DeepSeek、PaLM、Gemma）统一采用的默认位置编码标准！苏剑林团队从数学第一性原理出发，求解「什么样的位置编码操作 f(q, m) 与 f(k, n) 能使其内积 ⟨f(q, m), f(k, n)⟩ 仅依赖于词向量本身与相对距离 (m - n)」这一函数方程，推导出极其优雅的二维复平面旋转变换 e^{imθ}。RoPE 以绝对位置旋转的形式直接在 Q 和 K 上原位计算，却在点积注意力中精确等价于相对位置编码，完美兼容 FlashAttention 与 KV Cache，并天然具备随距离增加的远程衰减特性！",
  "keyContributions": [
    "从内积相对位置不变性公理 ⟨f_q(x_m, m), f_k(x_n, n)⟩ = g(x_m, x_n, m-n) 严格推导出复数指数旋转解 f(x, m) = Wx · e^{imθ}",
    "将 d 维特征空间切分为 d/2 个二维正交子空间，以几何级数频率 θ_i = 10000^{-2(i-1)/d} 执行块对角二维旋转",
    "利用正交旋转矩阵性质 R_m^T R_n = R_{n-m}，无需显式构造 O(N²) 相对位置偏置矩阵，完美兼容线性注意力与 KV 缓存",
    "通过阿贝尔变换严格证明 RoPE 具有随相对距离 |m-n| 增大的自然远程注意力衰减包络，并奠定了后续 NTK-Aware / YaRN 百万长文本外推基础"
  ],
  "coreProblem": "原始 Transformer 的正余弦绝对位置编码（直接加在词嵌入上 x_m + p_m）无法在自注意力点积中纯粹表达相对距离 m-n，且长度外推能力极差；而经典的相对位置编码（如 Shaw et al. 或 T5 Bias）需要在注意力矩阵上显式维护 O(N²) 的相对距离张量，破坏了 KV Cache 复用效率。",
  "coreIdea": "不要把位置向量「加」在词向量上，而是把词向量的每两个相邻维度看作二维平面（或复平面）上的一个向量，根据它所处的绝对位置 m 将其逆时针旋转 m·θ 弧度！当位置 m 的 Query（旋转了 mθ）与位置 n 的 Key（旋转了 nθ）做内积时，两个向量的夹角恰好只取决于它们的旋转角之差 (m - n)θ！",
  "simulatorTitle": "RoPE 二维复平面旋转与 NTK 长上下文缩放实验台",
  "simulatorDesc": "交互式调节 Token 位置 m 与 n、旋转基频 b (10k~1M) 及 NTK 缩放系数，实时可视化旋转夹角 (m-n)θ 与远程衰减曲线。",
  "architectureSteps": [
    {
      "id": "rope-step-1",
      "title": "1. 维度两两分组构造复数平面",
      "subtitle": "2D Subspace Pairing",
      "description": "将 d 维的 Query 或 Key 向量拆分为 d/2 对二维坐标 [(q_0, q_1), (q_2, q_3), ..., (q_{d-2}, q_{d-1})]，每一对对应一个二维平面向量。",
      "highlightColor": "emerald"
    },
    {
      "id": "rope-step-2",
      "title": "2. 多尺度几何级数旋转角分配",
      "subtitle": "Multi-Frequency Geometric Angles",
      "description": "为第 i 个二维子空间分配旋转角速度 θ_i = b^{-2(i-1)/d}（默认基频 b=10000）：低维高频捕捉局部短距离语法，高维低频捕捉长程全局语义。",
      "highlightColor": "cyan"
    },
    {
      "id": "rope-step-3",
      "title": "3. 绝对位置正交旋转注入",
      "subtitle": "Orthogonal Rotation Injection",
      "description": "在位置 m 处利用稀疏乘法 (q ⊙ cos mθ + q_⊥ ⊙ sin mθ) 仅对 Q 和 K 执行原位旋转（不改变向量模长 ||R_m q|| = ||q||，且不对 V 旋转）。",
      "highlightColor": "amber"
    },
    {
      "id": "rope-step-4",
      "title": "4. 点积自动坍缩为相对距离 (n-m)θ",
      "subtitle": "Relative Distance Collapse in Dot-Product",
      "description": "计算注意力得分 (R_m q)^T (R_n k) = q^T R_m^T R_n k = q^T R_{n-m} k，绝对位置 m 和 n 自动抵消为相对位移 n - m！",
      "highlightColor": "purple"
    }
  ],
  "formulas": [
    {
      "id": "rope-f1",
      "name": "二维复平面旋转算子与内积相对不变性恒等式",
      "category": "核心旋转方程",
      "formula": "f_{\\{q,k\\}}(\\mathbf{x}_m, m) = R^d_{\\Theta, m} W_{\\{q,k\\}}\\mathbf{x}_m, \\quad \\langle R^d_{\\Theta, m}\\mathbf{q},\\; R^d_{\\Theta, n}\\mathbf{k} \\rangle = \\mathbf{q}^T R^d_{\\Theta, n-m} \\mathbf{k}",
      "explanation": "正交旋转矩阵的转置乘积等于角度相减后的旋转矩阵，从而用 O(N) 的绝对位置操作精确实现了 O(N²) 的相对位置注意力。",
      "variables": [
        {
          "symbol": "R^d_{\\Theta, m}",
          "desc": "由 d/2 个 2×2 旋转块组成的块对角正交矩阵"
        },
        {
          "symbol": "n - m",
          "desc": "Key 与 Query 之间的相对 Token 距离"
        }
      ]
    },
    {
      "id": "rope-f2",
      "name": "高效稀疏实现与多频段角速度公式",
      "category": "工程实现公式",
      "formula": "R^d_{\\Theta, m}\\mathbf{x} = \\mathbf{x} \\odot \\cos(m\\Theta) + \\tilde{\\mathbf{x}} \\odot \\sin(m\\Theta), \\quad \\theta_i = b^{-2(i-1)/d} \\; (b = 10000 \\to 500000)",
      "explanation": "实际代码中无需构造大矩阵，仅需两次逐元素乘法即可完成旋转；调大基频 b（如 LLaMA-3 设为 500,000）即可扩展上下文窗口。",
      "variables": [
        {
          "symbol": "\\tilde{\\mathbf{x}}",
          "desc": "将相邻两维交换并取反 [-x_1, x_0, -x_3, x_2, ...] 的正交伴随向量"
        },
        {
          "symbol": "b",
          "desc": "旋转基频 Base（标准为 10000，长文本 NTK 扩窗常调至 500k~1M）"
        }
      ]
    }
  ],
  "metricCards": [
    {
      "label": "现代开源大模型采用率",
      "value": "> 95% (绝对标准)",
      "desc": "LLaMA 1/2/3、Qwen、DeepSeek、Mistral、Gemma 全系标配",
      "color": "emerald"
    },
    {
      "label": "KV Cache 兼容性",
      "value": "100% 零重算缓存",
      "desc": "历史 Token 的旋转后 Key 可直接存入缓存，无需随新位置重算",
      "color": "cyan"
    },
    {
      "label": "位置编码额外参数量",
      "value": "0 参数 (纯解析三角函数)",
      "desc": "不占用任何可学习参数，且严格保持 Query/Key 向量 L2 范数不变",
      "color": "amber"
    },
    {
      "label": "长文本外推扩展潜力",
      "value": "4K ➔ 128K ~ 2M",
      "desc": "配合 Position Interpolation / NTK-Aware / YaRN 轻松实现百倍扩窗",
      "color": "purple"
    }
  ],
  "experimentSections": [
    {
      "title": "主流位置编码范式机制与长文本检索表现对比",
      "description": "对比 Sinusoidal 绝对编码、T5 相对偏置、ALiBi 与 RoPE 在相对距离建模、KV Cache 兼容度及长文档任务上的综合表现。",
      "headers": [
        "位置编码方案",
        "相对距离表达能力",
        "KV Cache 与 FlashAttention 兼容",
        "长文档 CAIL 准确率 (↑)"
      ],
      "rows": [
        [
          "Sinusoidal 绝对编码 (Vaswani 2017)",
          "弱 (耦合交叉项)",
          "完全兼容 O(N)",
          "64.2%"
        ],
        [
          "Learnable 绝对编码 (BERT/GPT-2)",
          "无 (无法超出训练长度)",
          "完全兼容 O(N)",
          "63.8% (超长截断)"
        ],
        [
          "T5 Relative Bias (显式偏置矩阵)",
          "强 (分桶偏置)",
          "差 (需额外 O(N²) 偏置读取)",
          "67.9%"
        ],
        [
          "RoPE 旋转位置编码 (本文方案)",
          "精确内积相对依赖 + 远程衰减",
          "100% 原生兼容 (零开销)",
          "71.4% (SOTA)"
        ]
      ]
    }
  ],
  "insights": [
    {
      "title": "为什么 RoPE 对 KV Cache 如此友好？",
      "content": "如果采用传统相对位置编码，每当生成第 t+1 个新词时，之前所有历史词相对于当前词的距离都变了，必须重新计算位置编码；而 RoPE 将绝对位置 m 直接旋转进 Key_m 中存入缓存，新词 Query_n 只需自己旋转 nθ 再与缓存做点积，就能自动算出 (n-m)θ！"
    },
    {
      "title": "为什么把 RoPE 基频 b 从 10,000 调大到 500,000 (NTK Scaling) 就能扩充上下文？",
      "content": "当序列长度超过预训练窗口时，低频维度的旋转角度 mθ_i 超出了模型见过的值域（Out-of-Distribution）。增大基频 b 相当于减慢所有低频指针的旋转角速度，将更长的序列压缩回模型熟悉的相位区间内，同时保留高频维度的局部辨识度。"
    }
  ],
  "takeaways": [
    {
      "icon": "Compass",
      "title": "绝对形式，相对灵魂",
      "desc": "用 O(N) 的绝对位置旋转操作，精确实现了 O(N²) 的内积相对位置编码。"
    },
    {
      "icon": "Shield",
      "title": "范数守恒的正交变换",
      "desc": "只改变向量相位角而不改变向量模长，彻底避免了加性位置编码污染词义特征。"
    },
    {
      "icon": "TrendingDown",
      "title": "天然远程注意力衰减",
      "desc": "多频余弦波叠加产生的相消干涉，让距离越远的 Token 默认相关性上限自然衰减。"
    },
    {
      "icon": "Sparkles",
      "title": "大模型长上下文基石",
      "desc": "今日几乎所有 128K~1M 上下文窗口技术（YaRN、LongRoPE）都是在调校 RoPE 的频率谱。"
    }
  ]
};

export const PAPER_DATA: UniversalPaperData = ROPE_2021_DATA;
export default PAPER_DATA;
