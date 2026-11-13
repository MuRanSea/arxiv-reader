import { UniversalPaperData } from "../../../../src/shared/types/universalPaper.js";

export const SAM_2023_DATA: UniversalPaperData = {
  "id": "sam-2023",
  "title": "Segment Anything (SAM)",
  "chineseTitle": "SAM 分割一切：以可提示分割、数据引擎闭环与 11 亿掩码开启计算机视觉基础模型时代",
  "subtitle": "Alexander Kirillov, Eric Mintun, Nikhila Ravi, Hanzi Mao, Chloe Rolland, Ross Girshick, Kaiming He (何恺明) et al. • Meta AI Research (FAIR) • ICCV 2023 Best Paper Honorable Mention",
  "tags": [
    "Segment Anything (SAM)",
    "Promptable Segmentation 可提示分割",
    "SA-1B (11亿掩码数据引擎)",
    "多掩码消歧 Ambiguity-Aware",
    "50ms 实时交互解码器"
  ],
  "arxivId": "2304.02643",
  "pdfUrl": "https://arxiv.org/pdf/2304.02643.pdf",
  "abstractUrl": "https://arxiv.org/abs/2304.02643",
  "summary": "将大语言模型的「Prompt（提示驱动）+ 数据飞轮」范式成功引入计算机视觉底层像素任务的划时代巨著！不同于自然语言在互联网上有取之不尽的现成文本，互联网上根本不存在十亿级别的精细像素分割掩码（Masks）。何恺明与 Ross Girshick 领衔的 Meta FAIR 团队围绕三个核心问题破局：(1) 什么任务能支持零样本泛化？ 提出「可提示分割（Promptable Segmentation）」—— 给定任意空间或语义提示（前景/背景点击点、粗略框、涂鸦或文本），返回有效分割掩码；(2) 什么架构能支撑交互？ 解耦为重型一次性图像编码器（MAE ViT-H）+ 极轻量的提示编码器与 50ms 浏览器内实时运行的双向掩码解码器，且原生每次输出 3 个嵌套掩码（局部/部件/整体）完美解决单点点击的语义歧义；(3) 没有数据怎么办？ 打造「人工辅助 → 半自动 → 全自动」三阶段 数据引擎（Data Engine），累计在 1100 万张高清图上标注出史无前例的 11 亿个高质量掩码（SA-1B，比此前最大数据集大 400 倍），实现真正意义上的「分割万物」！",
  "keyContributions": [
    "定义视觉基础模型的新原语任务「可提示分割（Promptable Segmentation）」：将点、框、粗掩码等交互指令统一抽象为空间/语义 Prompt，使模型可通过提示工程零样本迁移至边缘检测、实例分割、物体提议等 23+ 下游任务",
    "首创「歧义感知（Ambiguity-Aware）多掩码输出机制」：当用户在衬衫纽扣上只点 1 个点时，目标可能是「纽扣、衬衫或整个人」；SAM 同时预测 k=3 个嵌套掩码及各自的预期 IoU 置信度，并以最小损失回传梯度",
    "构建重图像编码器 + 50ms 轻量解码器的解耦架构：每张图只需跑一次 ViT-H 提取图像嵌入，随后在浏览器 CPU/WebGPU 上即可零延迟响应鼠标点击与拉框交互",
    "打造三阶段自举数据引擎（Data Engine）并开源 SA-1B 数据集：1100 万张授权高清图片、11 亿（1.1 Billion）个精细分割掩码，掩码数量超越人类历史上所有旧分割数据集总和的 400 倍"
  ],
  "coreProblem": "传统图像分割模型（如 Mask R-CNN）既受限于预定义的几十个固定类别，又无法根据用户的交互点击实时分割任意未见过的局部或整体；更致命的是，精细像素级掩码的人工勾勒极其昂贵（一张图需数十分钟），全球公开分割掩码仅几百万个，根本不足以训练视觉基础模型。",
  "coreIdea": "第一，用「模型喂数据、数据再喂模型」的三级数据引擎自己造出 11 亿掩码（先让模型帮人类点几下快速修图 → 再让模型自动抓大物体、人类补小物体 → 最后用 32×32 网格点全自动扫出全图所有掩码）！第二，正视「一指多义」：鼠标点一下永远可能有三种理解（整体、部件、子部件），直接让解码器一次吐出 3 个不同尺度的掩码，谁最贴合真实标注就只算谁的梯度！",
  "simulatorTitle": "SAM 可提示分割、三层级消歧与 SA-1B 数据引擎实验台",
  "simulatorDesc": "交互式选择提示模式 (单点/多点/边界框)、歧义层级 (整体/部件/子部件) 与数据引擎阶段，实时计算掩码 IoU、解码延迟与数据产能提升。",
  "architectureSteps": [
    {
      "id": "sam-step-1",
      "title": "1. 重型图像编码器一次性提取特征",
      "subtitle": "Heavyweight MAE ViT-H Image Encoder (Run Once)",
      "description": "对 1024×1024 高分辨率输入图像，使用预训练 MAE ViT-H/16 运行一次前向传播，输出 64×64×256 的紧凑图像嵌入（Image Embedding）供后续无限次交互复用。",
      "highlightColor": "emerald"
    },
    {
      "id": "sam-step-2",
      "title": "2. 稀疏与稠密多模态提示编码器",
      "subtitle": "Sparse (Points/Boxes/Text) & Dense (Masks) Prompt Encoder",
      "description": "将空间点击点、边界框通过位置编码与可学习类型嵌入转化为稀疏 Token；将粗略掩码通过卷积叠加到图像嵌入上，实现零延迟多模态提示注入。",
      "highlightColor": "cyan"
    },
    {
      "id": "sam-step-3",
      "title": "3. 50ms 双向交互轻量解码器与 3 掩码消歧",
      "subtitle": "50ms Two-Way Transformer Decoder & 3-Mask Disambiguation",
      "description": "仅含 2 层双向交叉注意力（Prompt↔Image）的极轻解码器同时输出 3 个多尺度掩码（Whole/Part/Subpart）与各自的 IoU 预测分，可在普通浏览器中 50ms 实时运行。",
      "highlightColor": "amber"
    },
    {
      "id": "sam-step-4",
      "title": "4. 三阶段数据引擎飞轮产出 11 亿掩码 (SA-1B)",
      "subtitle": "3-Stage Data Engine Flywheel (Assisted → Semi → Auto)",
      "description": "从辅助人工标注（提速6.5倍）进化到 32×32 网格点全自动生成、IoU 过滤、NMS 去重与稳定性校验，最终构建 11 亿掩码的 SA-1B 巨型底座。",
      "highlightColor": "purple"
    }
  ],
  "formulas": [
    {
      "id": "sam-f1",
      "name": "歧义感知最小赢家回传损失（Ambiguity-Aware Minimum Loss）",
      "category": "多尺度消歧训练",
      "formula": "\\mathcal{L}_{\\text{SAM}}(G, \\{\\hat{M}_k, \\hat{c}_k\\}_{k=1}^{3}) = \\min_{k \\in \\{1,2,3\\}} \\Big( \\lambda_{\\text{focal}}\\,\\mathcal{L}_{\\text{focal}}(G, \\hat{M}_k) + \\lambda_{\\text{dice}}\\,\\mathcal{L}_{\\text{dice}}(G, \\hat{M}_k) \\Big) + \\sum_{k=1}^{3} \\big( \\hat{c}_k - \\text{IoU}(G, \\hat{M}_k) \\big)^2",
      "explanation": "如果对单点提示强行只预测 1 个掩码，模型会把「纽扣」和「整件衣服」取平均糊成一团灰影；改为预测 K=3 个候选掩码，每次只对最接近当前真实标注 G 的那个掩码回传分割梯度（Winner-Takes-All），从而逼迫 3 个输出头自然分化为「整体、部件、子部件」！",
      "variables": [
        {
          "symbol": "\\hat{M}_1, \\hat{M}_2, \\hat{M}_3",
          "desc": "解码器针对同一提示同时预测的整体（Whole）、部件（Part）、子部件（Sub-part）三个候选掩码"
        },
        {
          "symbol": "G",
          "desc": "当前训练样本中的真实分割标注掩码（Ground-Truth Mask）"
        },
        {
          "symbol": "\\hat{c}_k",
          "desc": "模型同步预测的第 k 个候选掩码与真实目标的预测交并比（IoU Confidence）"
        }
      ]
    },
    {
      "id": "sam-f2",
      "name": "解耦交互摊销延迟公式（Amortized Interactive Latency）",
      "category": "实时交互架构",
      "formula": "T_{\\text{total}}(P) = T_{\\text{ImgEnc}}(\\mathbf{I}) + \\sum_{p=1}^{P} T_{\\text{MaskDec}}(\\mathbf{E}_{\\text{img}}, \\text{Prompt}_p) \\approx 150\\,\\text{ms (GPU 1次)} + P \\times 50\\,\\text{ms (Browser CPU)}",
      "explanation": "将占 98% 计算量的 ViT-H 图像编码与占 2% 计算量的提示解码彻底解耦，使每次鼠标移动或点击的响应延迟恒定在 50ms 以内，达到 20 FPS 丝滑实时交互。",
      "variables": [
        {
          "symbol": "\\mathbf{E}_{\\text{img}} = \\text{ImgEnc}(\\mathbf{I})",
          "desc": "预计算并缓存在前端的图像特征嵌入"
        },
        {
          "symbol": "P",
          "desc": "用户在同一张图像上连续点击或拉框交互的次数"
        }
      ]
    }
  ],
  "metricCards": [
    {
      "label": "SA-1B 数据集掩码总数",
      "value": "1.1 Billion (11亿掩码)",
      "desc": "比此前全球最大分割数据集 OpenImages 多出整整 400 倍",
      "color": "emerald"
    },
    {
      "label": "浏览器内单次提示解码延迟",
      "value": "~50 ms (实时交互)",
      "desc": "重编码器与轻解码器解耦，支持前端 WebAssembly 丝滑点选",
      "color": "cyan"
    },
    {
      "label": "单点提示零样本人类盲测",
      "value": "超越全监督 RITM (+2.3分)",
      "desc": "在 23 个跨领域分布外数据集（水下/显微/遥感/医疗）全线夺冠",
      "color": "amber"
    },
    {
      "label": "人工辅助标注提速比",
      "value": "6.5x 倍效率跃升",
      "desc": "单掩码人工勾勒耗时从 84 秒骤降至 14 秒以内",
      "color": "purple"
    }
  ],
  "experimentSections": [
    {
      "title": "23 大跨领域数据集上零样本 SAM 与最强交互式分割基线 (RITM / SimpleClick) 单点与多掩码性能对比",
      "description": "验证多掩码消歧设计（3-Mask Output）与 11 亿 SA-1B 数据飞轮在零样本单点提示下的压倒性优势。",
      "headers": [
        "分割模型与配置",
        "训练掩码规模",
        "单点提示输出机制",
        "23 数据集平均单点 mIoU (↑) & 人类评分 (1-10 ↑)"
      ],
      "rows": [
        [
          "RITM (此前交互式分割工业基线)",
          "约 1.2M 掩码",
          "单掩码输出 (遇到歧义糊成一团)",
          "52.4 mIoU • 人类质量评分 5.3"
        ],
        [
          "SimpleClick / FocalClick (ViT 交互基线)",
          "约 1.5M 掩码",
          "单掩码输出",
          "56.8 mIoU • 人类质量评分 6.1"
        ],
        [
          "SAM Single-Mask (消融：去掉3掩码消歧)",
          "1.1B (SA-1B)",
          "强制单掩码输出",
          "61.2 mIoU • 模糊边界明显增加"
        ],
        [
          "SAM 3-Mask Ambiguity-Aware (本文完整版)",
          "1.1B (11亿全自动飞轮)",
          "整体/部件/子部件 3掩码 + IoU自评",
          "74.9 mIoU (+18.1!) • 人类评分 7.8 (全线夺冠)"
        ]
      ]
    }
  ],
  "insights": [
    {
      "title": "为什么仅靠全自动生成的 11 亿伪标签掩码训练出的 SAM，效果竟然与混合人工精标训练出来的几乎完全一样？",
      "content": "这是论文中最令人振奋的实证发现：作者对比了「用全部阶段（含人工精修）训练的 SAM」与「只用第 3 阶段全自动生成的 SA-1B 掩码训练的 SAM」，发现在 23 个下游基准上两者的差距不到 0.5 mIoU！这证明一旦数据引擎的过滤条件（IoU预测>0.88、掩码面积阈值变化下的稳定性>0.95）足够严苛，11 亿规模的合成伪标签就能产生超越人工精标的质变！"
    },
    {
      "title": "从 SAM-1（图像）到 SAM-2（视频流记忆分割）与医疗 MedSAM 的百花齐放",
      "content": "SAM 确立的「Promptable Segmentation + Data Engine」范式不仅在 2024 年进化为带流式记忆库的视频万物分割 SAM-2，更在医学影像（MedSAM）、遥感测绘、自动驾驶自动标注和 Photoshop AI 选区工具中掀起了生产力革命。"
    }
  ],
  "takeaways": [
    {
      "icon": "MousePointer",
      "title": "把 Prompt 范式带入像素世界",
      "desc": "点、框、涂鸦皆是 Prompt，用提示工程一举终结视觉分割「一个任务训一个模型」的碎片时代。"
    },
    {
      "icon": "Layers",
      "title": "一指三掩码化解空间歧义",
      "desc": "用 Winner-Takes-All 最小损失同时训出整体、部件、子部件三个头，彻底消灭单点点击的均值模糊。"
    },
    {
      "icon": "RefreshCw",
      "title": "没数据就建数据引擎飞轮",
      "desc": "人类与模型协同自举三阶段，把全球分割掩码储量从几百万暴增 400 倍推上 11 亿大关。"
    },
    {
      "icon": "Zap",
      "title": "重编码一次，轻解码百次",
      "desc": "图像特征算一遍缓存起来，50ms 极轻解码器让前沿大模型直接在普通网页前端丝滑跟手。"
    }
  ]
};

export const PAPER_DATA: UniversalPaperData = SAM_2023_DATA;
export default PAPER_DATA;
