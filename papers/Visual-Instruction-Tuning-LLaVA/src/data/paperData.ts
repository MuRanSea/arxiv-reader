import { UniversalPaperData } from "../../../../src/shared/types/universalPaper.js";

export const LLAVA_2023_DATA: UniversalPaperData = {
  "id": "llava-2023",
  "title": "Visual Instruction Tuning (LLaVA)",
  "chineseTitle": "LLaVA 视觉指令微调：用一层简单线性投影桥接 CLIP 与 LLM 的多模态大模型标准架构",
  "subtitle": "Haotian Liu (刘昊天), Chunyuan Li (李春元), Qingyang Wu, Yong Jae Lee • University of Wisconsin–Madison, Microsoft Research & Columbia University • NeurIPS 2023 Oral",
  "tags": [
    "LLaVA 多模态大模型",
    "Visual Instruction Tuning 视觉指令微调",
    "CLIP + Linear Projection + LLM",
    "GPT-4 符号化合成多模态数据",
    "两阶段对齐+微调"
  ],
  "arxivId": "2304.08485",
  "pdfUrl": "https://arxiv.org/pdf/2304.08485.pdf",
  "abstractUrl": "https://arxiv.org/abs/2304.08485",
  "summary": "开源多模态大语言模型（LMM / VLM）的奠基之作，彻底奠定了今日 Qwen-VL、InternVL、Pixtral 乃至主流商业视觉大模型「视觉编码器 + 投影连接器 + 大语言模型」的三段式黄金架构！在 LLaVA 之前，要让模型看图说话往往需要设计极其繁琐的门控交叉注意力层（如 Flamingo）或重量级 Q-Former（如 BLIP-2），且受限于传统图文对只有一句简短图注，模型根本无法遵循复杂的人类多轮视觉指令。刘昊天与李春元等做出了两个天才创举：(1) 数据破局：当时还没有多模态 GPT-4V，作者巧妙地把 COCO 图片原本自带的「多句人工图注 + 每一个物体的精确边界框坐标（Bounding Boxes）」作为纯文本喂给纯语言版 GPT-4，合成了 15.8 万条高质量多模态指令遵循数据（LLaVA-Instruct-150K，含多轮对话、详细描述与复杂逻辑推理）；(2) 架构破局：仅用一个极简的 可训练线性投影矩阵 W（LLaVA-1.5 升级为两层 MLP） 直接把 CLIP ViT 的图像块特征映射为大语言模型词嵌入空间里的「视觉 Token」拼在文本前！以极低成本训练出的 LLaVA 在多模态对话基准上达到 GPT-4 的 85.1%，并在 ScienceQA 科学多模态问答上创下 92.53% 历史新纪录！",
  "keyContributions": [
    "首次将「指令微调（Instruction Tuning）」从纯文本成功扩展至多模态视觉-语言领域，开创 Visual Instruction Tuning 研究方向",
    "首创「符号化表示驱动的 GPT-4 多模态指令数据合成管线」：利用现成数据集的 Captions + 物体 Bounding Boxes 坐标让纯文本 GPT-4“脑补”画面空间布局，生成涵盖对话、详述与复杂推理的 158K 多模态指令集",
    "确立极简三段式架构（CLIP ViT-L/14 + 线性/MLP 投影矩阵 W + LLaMA/Vicuna）：将视觉特征 Z_v 直接经 H_v = W·Z_v 转化为与文本词向量同维度的视觉软提示（Visual Tokens）",
    "确立标准「两阶段训练法则」：Stage 1 冻结视觉编码器与 LLM，仅用 595K 图文对训练投影矩阵 W 对齐特征空间；Stage 2 仅冻结视觉编码器，联合微调投影矩阵 W 与 LLM 权重学习复杂视觉指令遵循"
  ],
  "coreProblem": "一方面，互联网原始图文对（Image-Caption pairs）只是一句死板的图片说明，没有人类提问与多轮深度推理，直接拿来训练无法得到像 ChatGPT 那样能看图推理的助手；另一方面，当时主流的多模态融合模块（如 Flamingo Perceiver 或 BLIP-2 Q-Former）结构复杂、训练缓慢且会因强行压缩 Token 丢失细粒度空间信息。",
  "coreIdea": "第一，架构大道至简：既然 CLIP 已经把图像切成 256 个语义丰富的 Patch 向量 Z_v，何必搞复杂的交叉注意力？直接乘一个线性投影矩阵 H_v = W·Z_v，把这 256 个图像块翻译成大语言模型看得懂的「256 个视觉单词」，和用户的文字问题拼成一串直接喂进 LLM 就行了！第二，用纯文本 GPT-4 合成看图指令数据：把图里的「物体名称 + [x1, y1, x2, y2] 坐标框」写成文字告诉 GPT-4，让它假装亲眼看到了图片，一口气编出 15.8 万道高质量看图对话与深度推理题！",
  "simulatorTitle": "LLaVA 视觉 Token 投影桥接与两阶段指令微调实验台",
  "simulatorDesc": "交互式调节图像分辨率/切块数、连接器架构 (Linear / 2-Layer MLP) 与三类合成指令数据配比，实时评估多模态推理得分与视觉 Token 吞吐开销。",
  "architectureSteps": [
    {
      "id": "llava-step-1",
      "title": "1. 符号化坐标驱动 GPT-4 合成 158K 指令集",
      "subtitle": "Symbolic Captions + Boxes → GPT-4 Data Synthesis",
      "description": "将图像编码为「多句文字描述 + 全部物体类别与归一化坐标框 [x1,y1,x2,y2]」喂给 GPT-4，自动合成三类数据：58K 多轮视觉问答、23K 详尽视觉描述与 77K 复杂逻辑推理。",
      "highlightColor": "emerald"
    },
    {
      "id": "llava-step-2",
      "title": "2. CLIP 视觉编码与线性投影对齐 H_v = W·Z_v",
      "subtitle": "CLIP ViT Feature Extraction & Linear Projection",
      "description": "使用预训练 CLIP ViT-L/14 提取倒数第二层网格特征 Z_v，通过轻量投影矩阵 W（LLaVA-1.5 为两层 MLP）将其维度精确对齐至 LLM 词嵌入维度 d_model。",
      "highlightColor": "cyan"
    },
    {
      "id": "llava-step-3",
      "title": "3. 第一阶段：特征对齐预训练 (只训投影层 W)",
      "subtitle": "Stage 1: Pre-training for Feature Alignment",
      "description": "冻结 CLIP 视觉编码器与 Vicuna 大语言模型两端权重，仅在筛选后的 595K CC3M 图文对上训练线性层 W，相当于为冻结的 LLM 极速训练一个兼容的「视觉词嵌入层」。",
      "highlightColor": "amber"
    },
    {
      "id": "llava-step-4",
      "title": "4. 第二阶段：端到端多模态指令微调 (训 W + LLM)",
      "subtitle": "Stage 2: End-to-End Visual Instruction Tuning",
      "description": "保持 CLIP 冻结，解冻投影层 W 与 LLM 主干权重，在 158K 多轮交织指令序列上仅对助手回答 Token 计算自回归交叉熵损失，激活深度跨模态推理能力。",
      "highlightColor": "purple"
    }
  ],
  "formulas": [
    {
      "id": "llava-f1",
      "name": "视觉网格特征线性投影与多模态序列拼接方程",
      "category": "跨模态投影桥接",
      "formula": "\\mathbf{Z}_v = g(\\mathbf{X}_v) \\in \\mathbb{R}^{N_v \\times d_v}, \\qquad \\mathbf{H}_v = \\mathbf{W} \\cdot \\mathbf{Z}_v \\in \\mathbb{R}^{N_v \\times d_{\\text{llm}}}, \\qquad \\mathbf{X}_{\\text{seq}} = \\big[ \\mathbf{H}_v;\\; \\mathbf{H}_{\\text{instruct}}^{(1)};\\; \\mathbf{H}_a^{(1)};\\; \\dots;\\; \\mathbf{H}_{\\text{instruct}}^{(T)};\\; \\mathbf{H}_a^{(T)} \\big]",
      "explanation": "通过极简矩阵乘法将 N_v=256（或 576）个图像 Patch 向量无损映射为与文本词向量完全同构的视觉 Token 序列，无需修改大语言模型内部一行注意力代码。",
      "variables": [
        {
          "symbol": "\\mathbf{Z}_v",
          "desc": "CLIP ViT-L/14 最后一个 Transformer 层之前的二维网格视觉特征"
        },
        {
          "symbol": "\\mathbf{W} \\in \\mathbb{R}^{d_{\\text{llm}} \\times d_v}",
          "desc": "连接视觉空间与语言模型嵌入空间的轻量可训练投影矩阵（或 2 层 MLP）"
        },
        {
          "symbol": "\\mathbf{H}_v",
          "desc": "直接作为软提示喂入大语言模型自注意力的视觉词元（Visual Tokens）"
        }
      ]
    },
    {
      "id": "llava-f2",
      "name": "多轮视觉对话掩码自回归指令微调损失",
      "category": "多轮指令微调",
      "formula": "\\mathcal{L}_{\\text{LLaVA}}(\\theta) = -\\sum_{i=1}^{L} \\mathbb{I}\\big[x_i \\in \\mathbf{X}_a\\big] \\cdot \\log p_\\theta\\!\\left( x_i \\;\\middle|\\; \\mathbf{X}_v,\\; \\mathbf{X}_{\\text{instruct}, <i},\\; \\mathbf{X}_{a, <i} \\right)",
      "explanation": "将图像与多轮人类提问统一视为条件前缀，仅在绿色标记的助手回复 Token 集合 X_a 与结束符 </s> 上计算交叉熵损失并回传梯度。",
      "variables": [
        {
          "symbol": "\\mathbf{X}_a",
          "desc": "多轮对话中属于 AI 助手回答部分的全部目标词元集合"
        },
        {
          "symbol": "\\theta = \\{\\mathbf{W}, \\phi_{\\text{LLM}}\\}",
          "desc": "Stage 1 仅优化 W；Stage 2 联合优化投影器 W 与大语言模型参数 φ_LLM"
        }
      ]
    }
  ],
  "metricCards": [
    {
      "label": "多模态指令数据集",
      "value": "158K (LLaVA-Instruct)",
      "desc": "涵盖 58K 对话 + 23K 详述 + 77K 复杂推理，开源多模态数据标杆",
      "color": "emerald"
    },
    {
      "label": "跨模态连接器复杂度",
      "value": "仅 1 层 Linear / 2 层 MLP",
      "desc": "抛弃笨重 Q-Former，保留全部图像 Patch 空间细节且数小时训完",
      "color": "cyan"
    },
    {
      "label": "LLaVA-Bench 相对 GPT-4 得分",
      "value": "85.1% (复杂推理达 96.5%)",
      "desc": "在未见过的室外、梗图与名画深度推理上逼近多模态 GPT-4",
      "color": "amber"
    },
    {
      "label": "ScienceQA 多模态科学问答",
      "value": "92.53% (历史新 SOTA)",
      "desc": "与 GPT-4 协同判断超越此前最优模型 +1.37 个百分点",
      "color": "purple"
    }
  ],
  "experimentSections": [
    {
      "title": "三类合成视觉指令数据消融实验与主流多模态架构 (BLIP-2 / OpenFlamingo / LLaVA) 性能对比",
      "description": "验证同时混合「对话 + 详尽描述 + 复杂推理」三类数据以及解冻 LLM 进行第二阶段微调的决定性作用。",
      "headers": [
        "多模态模型与训练配置",
        "跨模态连接器与视觉Token数",
        "LLaVA-Bench 综合相对得分 (↑)",
        "ScienceQA 科学多模态准确率 (↑)"
      ],
      "rows": [
        [
          "OpenFlamingo (交叉注意力门控架构)",
          "Gated Cross-Attention + Perceiver",
          "49.2% (难以遵循复杂长指令)",
          "—"
        ],
        [
          "BLIP-2 (重量级 Q-Former 查询压缩)",
          "Q-Former (将 256 Patch 压缩为 32 Token)",
          "58.6% (回复过于简短像单句图注)",
          "89.50%"
        ],
        [
          "LLaVA 仅用复杂推理数据 (消融对话与详述)",
          "Linear Projection (保留全部 256 Token)",
          "66.8% (缺乏多轮交互与细节感知)",
          "90.12%"
        ],
        [
          "LLaVA 全量三合一数据 + 两阶段微调 (本文)",
          "Linear / MLP 投影 + 全量视觉 Token",
          "85.1% (比单类数据暴涨 +18.3%!)",
          "90.92% / 92.53% (SOTA)"
        ]
      ]
    }
  ],
  "insights": [
    {
      "title": "为什么 LLaVA 只用一层简单的线性层（或 LLaVA-1.5 的两层 MLP），效果反而全面碾压了结构精巧复杂的 BLIP-2 Q-Former？",
      "content": "因为 Q-Former 强行用 32 个查询向量把整张图的 256/576 个局部图像块压缩成 32 个 Token，这个瓶颈过程损失了大量细粒度的空间位置、小物体与文字细节，而且 Q-Former 本身需要上亿对图文预训练几十天才能收敛；而 LLaVA 直接用线性/MLP 投影把所有 256/576 个图像块一五一十地原样喂进强大的大语言模型自注意力层里，让百亿参数的 LLM 自己去 attend 每一个局部图像块，既保留了 100% 空间细节，又只需几个小时就能对齐！"
    },
    {
      "title": "为什么在提取 CLIP 图像特征时，LLaVA 选择「最后一个 Transformer 层之前（倒数第二层）」的特征，而不是最后一层？",
      "content": "论文指出：CLIP 的最后一层专门为了与整句简短图注做全局余弦内积对比，因此过度聚焦于整张图的全局语义概要而丢弃了局部物体的细微空间属性；而倒数第二层的网格特征保留了更为丰富的局部细节，对看图问答与细粒度推理明显更优！"
    }
  ],
  "takeaways": [
    {
      "icon": "Zap",
      "title": "大道至简的三段式黄金架构",
      "desc": "ViT 编码器 + MLP 投影层 + LLM 主干，成为今日全球 95% 以上多模态大模型的统一范式。"
    },
    {
      "icon": "Sparkles",
      "title": "用符号坐标让纯文本模型造多模态数据",
      "desc": "把图片拆成「文字图注 + 物体坐标框」喂给文本大模型，无中生有造出 15.8 万条视觉推理题。"
    },
    {
      "icon": "Layers",
      "title": "两阶段训练铁律",
      "desc": "第一阶段冻结两端只训连接器对齐词表，第二阶段放开 LLM 学习多模态推理，稳准快兼备。"
    },
    {
      "icon": "Maximize2",
      "title": "不要轻易瓶颈化压缩视觉 Token",
      "desc": "把原汁原味的图像块网格 Token 直接交给 LLM 的自注意力去消化，空间细粒度理解力最强。"
    }
  ]
};

export const PAPER_DATA: UniversalPaperData = LLAVA_2023_DATA;
export default PAPER_DATA;
