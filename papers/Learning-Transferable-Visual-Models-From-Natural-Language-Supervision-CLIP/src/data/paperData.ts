import { UniversalPaperData } from "../../../../src/shared/types/universalPaper.js";

export const CLIP_2021_DATA: UniversalPaperData = {
  "id": "clip-2021",
  "title": "Learning Transferable Visual Models From Natural Language Supervision (CLIP)",
  "chineseTitle": "CLIP 对比语言-图像预训练：打通视觉与自然语言共享语义空间的零样本多模态基石",
  "subtitle": "Alec Radford, Jong Wook Kim, Chris Hallacy, Aditya Ramesh, Gabriel Goh, Sandhini Agarwal, Ilya Sutskever et al. • OpenAI • ICML 2021",
  "tags": [
    "CLIP 双塔对比学习",
    "4亿图文对 WIT",
    "InfoNCE 对称交叉熵损失",
    "Zero-Shot 开放词表视觉分类",
    "Stable Diffusion 与 LLaVA 的眼睛"
  ],
  "arxivId": "2103.00020",
  "pdfUrl": "https://arxiv.org/pdf/2103.00020.pdf",
  "abstractUrl": "https://arxiv.org/abs/2103.00020",
  "summary": "现代整个多模态人工智能（文生图 Stable Diffusion / DALL·E、多模态大模型 LLaVA / GPT-4V、跨模态图文检索）不可撼动的共同地基！此前计算机视觉被困在「ImageNet 1000 类封闭独热标签（One-hot Labels）」的牢笼里：训练好的模型除了这 1000 个编号外什么都不认识，且换个数据分布（如素描、卡通、对抗样本）准确率立刻暴跌。OpenAI 洞察到互联网上存在着天然的海量「图像-文本描述对」，但逐词预测图注（Captioning）太难太慢；改用「对比学习（Contrastive Learning）—— 在 N×N 的大批次矩阵中，只预测哪段文本与哪张图是原配一对」，训练效率瞬间暴涨 4 倍以上！在 4 亿图文对（WIT）上训练出的 CLIP，无需见过任何一张 ImageNet 训练图片，仅凭一句提示词 `\"A photo of a {object}.\"` 即可在零样本（Zero-Shot）下直接追平全监督 ResNet-50，并永久打通了视觉与语言的巴别塔！",
  "keyContributions": [
    "证实「对比目标远比生成目标高效」：在图文预训练中，从逐词自回归预测图注改为 Batch 内图文余弦相似度对比分类（InfoNCE），获取同等零样本能力的训练效率提升 4 倍以上",
    "构建 4 亿规模互联网图文数据集 WIT (WebImageText)，利用双编码器（Image Encoder: ViT/ResNet + Text Encoder: Transformer）将图像与文本映射至同一单位超球面嵌入空间",
    "开创「视觉提示工程（Prompt Engineering for Vision）」：将传统封闭分类层的权重向量替换为自然语言类别描述 `\"A photo of a {label}.\"` 的文本编码向量，实现任意开放词表（Open-Vocabulary）零样本识别",
    "展现惊人的分布外鲁棒性（Distribution Shift Robustness）：在 ImageNet-R/Sketch/Adversarial 等 7 大自然分布偏移基准上，零样本 CLIP 将有效鲁棒性提升高达 15%~40%，彻底摆脱对虚假背景捷径的过拟合"
  ],
  "coreProblem": "传统监督视觉模型将类别简化为毫无语义的整数 ID（0 到 999），既割裂了类别间的丰富语言关联，又导致模型只能识别训练时预设的固定死类别；而尝试让视觉模型逐字生成文本描述（VirTex）在大规模噪声网页数据上收敛极慢。",
  "coreIdea": "不要求模型看图默写出每一个字，只要求它做「连连看」！在一个包含 N=32,768 对图文的大 Batch 里，分别用图像编码器和文本编码器提取向量并两两算余弦相似度（构成 32768 × 32768 矩阵）：逼迫主对角线上的 N 个真实原配图文得分最高，非对角线上的 N² - N 个错误配对得分最低！训练好后，分类任何新物体只需算图片向量和 `\"一张{物体}的照片\"` 文本向量谁更近！",
  "simulatorTitle": "CLIP N×N 对称对比矩阵与零样本视觉提示工程实验台",
  "simulatorDesc": "交互式调节 Batch 大小 N、可学习温度参数 τ 与提示词模板集成策略，实时可视化 N×N 对角线对比损失与自然分布偏移鲁棒性。",
  "architectureSteps": [
    {
      "id": "clip-step-1",
      "title": "1. 图像与文本双塔并行编码",
      "subtitle": "Dual-Stream Vision & Text Encoders",
      "description": "图像通过 ViT（或 ResNet）编码并经线性投影与 L2 归一化得到单位向量 I_e；配对文本通过 Transformer 编码并归一化得到同维度的单位向量 T_e。",
      "highlightColor": "emerald"
    },
    {
      "id": "clip-step-2",
      "title": "2. N×N 全批次余弦相似度矩阵构造",
      "subtitle": "N×N All-Pairs Cosine Similarity Logits",
      "description": "在一个高达 N=32,768 的大 Batch 内，计算所有图像与所有文本的两两内积矩阵 L = (I_e · T_e^T) · exp(τ)，其中 τ 为直接参与反向传播的可学习对数温度参数。",
      "highlightColor": "cyan"
    },
    {
      "id": "clip-step-3",
      "title": "3. 对称交叉熵对比优化 (Symmetric InfoNCE)",
      "subtitle": "Row-wise & Column-wise Cross-Entropy",
      "description": "对矩阵按行（以图搜文）和按列（以文搜图）同时执行 N 分类交叉熵损失，正确标签即为对角线索引 [0, 1, ..., N-1]，将正样本拉近、32767 个批内负样本推远。",
      "highlightColor": "amber"
    },
    {
      "id": "clip-step-4",
      "title": "4. 零样本自然语言提示分类器合成",
      "subtitle": "Zero-Shot Classifier via Text Prompts",
      "description": "推理时无需任何分类头权重：将任意待测类别名填入 80 个上下文模板（如 `\"A photo of a {c}, a type of pet.\"`）编码求均值，直接作为零样本线性分类器权重与图像求内积！",
      "highlightColor": "purple"
    }
  ],
  "formulas": [
    {
      "id": "clip-f1",
      "name": "CLIP 对称多分类 InfoNCE 对比损失函数",
      "category": "跨模态对比学习",
      "formula": "\\mathcal{L}_{\\text{CLIP}} = \\frac{1}{2N} \\sum_{i=1}^{N} \\left( -\\log \\frac{\\exp(\\langle \\mathbf{I}_i, \\mathbf{T}_i \\rangle / \\tau)}{\\sum_{j=1}^{N} \\exp(\\langle \\mathbf{I}_i, \\mathbf{T}_j \\rangle / \\tau)} - \\log \\frac{\\exp(\\langle \\mathbf{I}_i, \\mathbf{T}_i \\rangle / \\tau)}{\\sum_{k=1}^{N} \\exp(\\langle \\mathbf{I}_k, \\mathbf{T}_i \\rangle / \\tau)} \\right)",
      "explanation": "前半项是「给定第 i 张图，从 N 段文本中找出原配文本」的交叉熵；后半项是「给定第 i 段文本，从 N 张图中找出原配图片」的交叉熵，两者取平均构成完全对称的跨模态对齐目标。",
      "variables": [
        {
          "symbol": "\\mathbf{I}_i, \\mathbf{T}_i",
          "desc": "L2 归一化后的第 i 对图像嵌入向量与文本嵌入向量（||I_i|| = ||T_i|| = 1）"
        },
        {
          "symbol": "N = 32,768",
          "desc": "超大对比批次大小（每条正样本同时对抗 32,767 个批内负样本）"
        },
        {
          "symbol": "\\tau",
          "desc": "可学习的 Softmax 温度缩放参数（上限截断于 100 以防训练不稳定）"
        }
      ]
    },
    {
      "id": "clip-f2",
      "name": "零样本开放词表分类与多模板嵌入集成方程",
      "category": "零样本迁移推理",
      "formula": "\\mathbf{w}_c = \\text{Normalize}\\!\\left( \\sum_{m=1}^{M} f_{\\text{text}}\\big(\\text{Prompt}_m(\\text{Class } c)\\big) \\right), \\qquad P(y = c \\mid \\mathbf{x}) = \\frac{\\exp(\\langle f_{\\text{img}}(\\mathbf{x}),\\, \\mathbf{w}_c \\rangle / \\tau)}{\\sum_{c'=1}^{C} \\exp(\\langle f_{\\text{img}}(\\mathbf{x}),\\, \\mathbf{w}_{c'} \\rangle / \\tau)}",
      "explanation": "先在单位球面上对 M=80 个提示词模板的文本向量求平均并重新归一化（不增加任何图片推理开销），直接把文本编码器变成了可即时生成任意分类头的「超网络（Hypernetwork）」！",
      "variables": [
        {
          "symbol": "\\text{Prompt}_m(c)",
          "desc": "第 m 个上下文提示模板（如 \"a bad photo of a {c}\", \"a origami {c}\" 等）"
        },
        {
          "symbol": "\\mathbf{w}_c",
          "desc": "动态合成的第 c 类零样本视觉分类权重向量"
        }
      ]
    }
  ],
  "metricCards": [
    {
      "label": "零样本 ImageNet Top-1",
      "value": "76.2% (0张训练图!)",
      "desc": "在不看任何一张 ImageNet 训练集图片下追平全监督 ResNet-50",
      "color": "emerald"
    },
    {
      "label": "对比目标 vs 生成目标效率",
      "value": "4.0x+ 训练加速",
      "desc": "从逐词预测改为批内对比匹配，算力转化效率暴涨 4 倍以上",
      "color": "cyan"
    },
    {
      "label": "分布外鲁棒性 (ImageNet-R/A)",
      "value": "77.1% vs 2.7% (ResNet)",
      "desc": "在 ImageNet-Adversarial 上将 ResNet-50 的 2.7% 狂拉至 77.1%",
      "color": "amber"
    },
    {
      "label": "现代多模态生态统治力",
      "value": "SD + LLaVA 共同底座",
      "desc": "几乎所有文生图文本编码器与多模态大模型视觉编码器均采用 CLIP",
      "color": "purple"
    }
  ],
  "experimentSections": [
    {
      "title": "监督学习 ResNet-50 vs 零样本 CLIP 在标准 ImageNet 及 5 大自然分布偏移基准上的鲁棒性对比",
      "description": "揭示监督分类模型严重依赖 ImageNet 特定纹理捷径（换个画风即崩盘），而 CLIP 学到了真正泛化的跨模态高级语义概念。",
      "headers": [
        "评测基准数据集",
        "监督训练 ResNet-50 (128万张训练图)",
        "Zero-Shot CLIP ViT-L/14 (0张训练图)",
        "零样本相对增益与泛化表现"
      ],
      "rows": [
        [
          "ImageNet-1K (原始验证集)",
          "76.1%",
          "76.2%",
          "+0.1% (零样本直接追平全监督!)"
        ],
        [
          "ImageNet-V2 (新采集同分布测试集)",
          "63.3% (-12.8%)",
          "70.1%",
          "+6.8% (泛化衰退显著更小)"
        ],
        [
          "ImageNet-R (艺术/卡通/素描/刺绣渲染)",
          "36.1% (严重崩盘)",
          "88.9%",
          "+52.8% (真正理解物体抽象概念!)"
        ],
        [
          "ImageNet-Sketch / ImageNet-A (黑白简笔画 / 自然对抗样本)",
          "24.1% / 2.7% (彻底失效)",
          "60.2% / 77.1%",
          "+36.1% / +74.4% (史诗级鲁棒性突破)"
        ]
      ]
    }
  ],
  "insights": [
    {
      "title": "为什么 CLIP 要用 `\"A photo of a {label}.\"` 而不是直接输一个单词 `\"{label}\"`？",
      "content": "原因有二：(1) 消除多义词歧义（Polysemy），例如 ImageNet 里的 `\"crane\"` 既可以指仙鹤也可以指起重机，加上 `\"a photo of a {label}, a type of pet/bird\"` 能瞬间锁定语义；(2) 互联网上的图文对很少只有一个孤零零的名词，往往是一个完整短句，加上 `\"A photo of a...\"` 能填平预训练分布与测试分布之间的鸿沟，单这一招加上 80 模板集成就能在零样本上白赚近 5 个点的 ImageNet 准确率！"
    },
    {
      "title": "CLIP 是如何凭一己之力撑起「文生图」与「多模态大模型」两条万亿产业链的？",
      "content": "一方面，Stable Diffusion、DALL·E 2 和 Midjourney 之所以能听懂人类提示词画画，正是直接拿 CLIP 的 Text Encoder 把文字变成引导扩散去噪的条件向量；另一方面，LLaVA、Qwen-VL 和 InternVL 等视觉大语言模型之所以能看懂图片，正是直接拿 CLIP 的 Vision Encoder (ViT-L/14) 当作大语言模型的「现成眼睛」！"
    }
  ],
  "takeaways": [
    {
      "icon": "Link",
      "title": "推倒视觉与语言的巴别塔",
      "desc": "把图像和文字投影到同一个超球面上，让余弦内积成为衡量万物语义距离的统一标尺。"
    },
    {
      "icon": "Zap",
      "title": "对比学习效率碾压逐词生成",
      "desc": "不纠结图像描述里的标点和虚词，只抓图文整体配对判别，用 1/4 算力炼出顶级表征。"
    },
    {
      "icon": "Shield",
      "title": "告别封闭标签与纹理捷径",
      "desc": "不再死记硬背训练集像素统计规律，面对素描、漫画与对抗样本展现出接近人类的概念泛化力。"
    },
    {
      "icon": "Eye",
      "title": "一切多模态模型的默认眼睛",
      "desc": "无论你是做多模态理解（LLaVA）还是多模态生成（Stable Diffusion），CLIP 都是绕不开的第一站。"
    }
  ]
};

export const PAPER_DATA: UniversalPaperData = CLIP_2021_DATA;
export default PAPER_DATA;
