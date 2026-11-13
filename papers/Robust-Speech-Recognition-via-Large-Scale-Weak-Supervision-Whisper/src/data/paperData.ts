import { UniversalPaperData } from "../../../../src/shared/types/universalPaper.js";

export const WHISPER_2022_DATA: UniversalPaperData = {
  "id": "whisper-2022",
  "title": "Robust Speech Recognition via Large-Scale Weak Supervision (Whisper)",
  "chineseTitle": "Whisper 语音识别基石：以 68 万小时大规模弱监督实现零样本抗噪与多语言语音转录",
  "subtitle": "Alec Radford, Jong Wook Kim, Tao Xu, Greg Brockman, Christine McLeavey, Ilya Sutskever • OpenAI • ICML 2023",
  "tags": [
    "Whisper 语音底座",
    "680,000 小时弱监督",
    "标准 Encoder-Decoder Transformer",
    "多任务特殊控制 Token",
    "零样本跨领域人类级抗噪"
  ],
  "arxivId": "2212.04356",
  "pdfUrl": "https://arxiv.org/pdf/2212.04356.pdf",
  "abstractUrl": "https://arxiv.org/abs/2212.04356",
  "summary": "终结传统语音识别（ASR）碎片化管线、成为全球语音转文字与语音交互事实标准的开源巨著！此前语音界主流路线（如 wav2vec 2.0）依赖「在大规模无标签音频上做自监督预训练 + 在小规模纯净数据集（如 LibriSpeech 960小时）上微调」：虽然在原数据集测试集上刷出极低词错率（WER），但一旦拿到真实世界的嘈杂会议、方言口音或专业领域音频中，词错率立刻翻倍崩盘！OpenAI 反其道而行之：彻底抛弃无标签自监督预训练，直接从互联网收集并清洗出史无前例的 680,000 小时（约合 77 年连续音频，涵盖 96 种语言与 12.5 万小时 X→En 翻译）带字幕弱监督音频，采用最朴素的 标准 Encoder-Decoder Transformer 与统一的 多任务控制 Token 序列 进行端到端训练。训练出的 Whisper 在【完全零样本（Zero-Shot）】下，在 12 个真实分布外基准上将词错率比全监督模型砍半（相对降低 55.2%），首次在零样本下追平专业人类速记员水平！",
  "keyContributions": [
    "打破语音界「无监督自监督预训练 + 窄域精标微调」的范式迷思：证明将弱监督有标签音频规模扩展两个数量级至 680,000 小时，能直接涌现出免微调的跨领域零样本鲁棒性",
    "设计智能数据反清洗过滤器：自动检测并剔除互联网上由现有 ASR 系统生成的机器转录字幕（启发式规则：全大写/全小写、无标点符号），防止模型学到旧系统的「机器口音」与错误偏见",
    "采用极简大一统多任务序列格式 `<|startoftranscript|> <|lang|> <|task|> <|notimings|> ...`：用一个单一解码器同时包办语音活动检测（VAD）、语种识别、带时间戳转录、多语言识别与任意语言译英（X→En）",
    "摒弃复杂的外部语言模型（LM Fusion）与文本反归一化后处理模块，让单个端到端 Transformer 直接输出带完整标点、大小写与格式的自然文本"
  ],
  "coreProblem": "在 LibriSpeech 等小规模高纯度学术语音库上微调的模型属于「考场应试专家」：它们过度拟合了特定录音棚的信噪比与朗读腔调，不仅在真实嘈杂环境中错误百出，还需要针对每个新场景重新收集标注数据做微调，且输出全是没有标点符号的纯大写音素词串。",
  "coreIdea": "就像 CLIP 用 4 亿真实网页图文对打败精标小数据集一样，直接用互联网上 68 万小时形形色色、带背景音乐、带各国口音、带真实标点的弱监督音频+字幕对，把一个最标准的编码器-解码器 Transformer 喂饱！并用几个特殊的开头控制 Token 把「识别语种、打时间戳、转录原文、翻译成英文」统一成同一个自回归续写任务！",
  "simulatorTitle": "Whisper 68万小时弱监督规模扩展与多任务控制 Token 实验台",
  "simulatorDesc": "交互式调节弱监督音频规模 (1k~680k 小时)、环境信噪比 SNR 与多任务控制 Token 开关，实时对比窄域监督模型与零样本 Whisper 的词错率 (WER)。",
  "architectureSteps": [
    {
      "id": "whis-step-1",
      "title": "1. 80通道对数梅尔频谱与卷积下采样",
      "subtitle": "80-Channel Log-Mel Spectrogram & Conv Stem",
      "description": "将输入音频统一重采样至 16kHz，以 25ms 窗长、10ms 步长提取 30 秒片段的 80 通道 Log-Mel 频谱图，经两层步长为 2 的 GELU 卷积将时间序列下采样至 1500 帧送入 Transformer Encoder。",
      "highlightColor": "emerald"
    },
    {
      "id": "whis-step-2",
      "title": "2. 剔除机器生成字幕的高质量弱监督清洗",
      "subtitle": "De-duplication & Anti-ASR Data Filtering",
      "description": "利用语种分类器校验音频与字幕语种一致性，并剔除所有全大写、无逗号句号等疑似由旧 ASR 机器自动生成的劣质字幕，保留人类真实书写习惯。",
      "highlightColor": "cyan"
    },
    {
      "id": "whis-step-3",
      "title": "3. 多任务前缀控制 Token 统一建模",
      "subtitle": "Unified Multitask Control Token Prefix",
      "description": "解码器通过读取前缀序列 `<|SOT|> → <|zh/en/...|> → <|transcribe/translate|> → <|0.00|>` 统一调度语种判别、同语种转录、跨语言直译与 20ms 精度时间戳预测。",
      "highlightColor": "amber"
    },
    {
      "id": "whis-step-4",
      "title": "4. 时间戳引导的 30 秒滑动窗口长音频拼接",
      "subtitle": "Timestamp-Guided Buffered Long-Form Decoding",
      "description": "利用模型自身预测的起止时间戳 Token（如 `<|28.40|>`），自动将长达数小时的播客或会议音频按最后一个完整句子的结束时间点无缝滑动切片转录。",
      "highlightColor": "purple"
    }
  ],
  "formulas": [
    {
      "id": "whis-f1",
      "name": "Whisper 多任务条件自回归序列生成目标",
      "category": "多任务序列建模",
      "formula": "\\mathcal{L}_{\\text{Whisper}} = -\\sum_{t=1}^{T} \\log P_\\theta\\!\\left( y_t \\;\\middle|\\; y_{<t},\\; \\underbrace{\\langle\\text{SOT}\\rangle, \\langle\\text{lang}\\rangle, \\langle\\text{task}\\rangle, \\langle\\text{ts}\\rangle}_{\\text{多任务控制前缀 } g},\\; \\text{Enc}\\big(\\text{LogMel}(\\mathbf{x})\\big) \\right)",
      "explanation": "通过改变控制前缀 g 中的单个特殊 Token，同一个解码器即可无缝在 96 种语言转录、语音翻译（X→En）以及带/不带时间戳模式之间自由切换，且以 50% 概率混入历史上下文文本提升长语音连贯性。",
      "variables": [
        {
          "symbol": "\\text{LogMel}(\\mathbf{x}) \\in \\mathbb{R}^{80 \\times 3000}",
          "desc": "30 秒音频提取的 80 维对数梅尔频谱特征张量"
        },
        {
          "symbol": "\\langle\\text{lang}\\rangle, \\langle\\text{task}\\rangle",
          "desc": "从 99 种语种 Token 与 {<|transcribe|>, <|translate|>} 中选择的控制符"
        }
      ]
    },
    {
      "id": "whis-f2",
      "name": "跨数据集零样本有效鲁棒性（Effective Robustness）定律",
      "category": "跨分布抗噪定律",
      "formula": "\\text{WER}_{\\text{Out-of-Domain}}(\\text{Whisper Zero-Shot}) \\approx 0.448 \\times \\text{WER}_{\\text{Out-of-Domain}}(\\text{wav2vec 2.0 Supervised})",
      "explanation": "虽然 wav2vec 2.0 在分布内 LibriSpeech-Clean 上比零样本 Whisper 低 0.8% WER，但在全部 12 个未见过的真实场景测试集上，零样本 Whisper 的平均词错率比它低 55.2%！",
      "variables": [
        {
          "symbol": "\\text{WER} = \\frac{S + D + I}{N}",
          "desc": "词错率（替换 + 删除 + 插入词数 / 标准参考总词数，越低越好）"
        }
      ]
    }
  ],
  "metricCards": [
    {
      "label": "弱监督训练音频总时长",
      "value": "680,000 小时 (77年)",
      "desc": "包含 11.7 万小时 96 种非英语音频与 12.5 万小时语音翻译数据",
      "color": "emerald"
    },
    {
      "label": "跨领域零样本 WER 降低",
      "value": "-55.2% (错误率砍半)",
      "desc": "在 12 个真实测试集上零样本表现远超 LibriSpeech 微调模型",
      "color": "cyan"
    },
    {
      "label": "与专业人类速记员对比",
      "value": "追平人类专家准确率",
      "desc": "在 Kincaid46 评测中词错率与付费专业人工转录相差无几",
      "color": "amber"
    },
    {
      "label": "端到端免后处理输出",
      "value": "原生标点 + 大小写 + 时间戳",
      "desc": "无需外挂语言模型或逆文本归一化（ITN）即可直出出版级文稿",
      "color": "purple"
    }
  ],
  "experimentSections": [
    {
      "title": "LibriSpeech 微调模型 (wav2vec 2.0) vs 零样本 Whisper 在分布内与真实嘈杂场景下的词错率 (WER ↓) 对比",
      "description": "验证窄域精标微调导致的「高分低能」现象，以及 68 万小时多样化弱监督带来的全方位真实世界抗噪统治力。",
      "headers": [
        "评测语音基准场景",
        "wav2vec 2.0 Large (LibriSpeech 监督微调)",
        "Whisper Large (Zero-Shot 零样本)",
        "零样本相对错误率缩减"
      ],
      "rows": [
        [
          "LibriSpeech Test-Clean (分布内纯净朗读)",
          "1.9% WER (分布内应试高分)",
          "2.7% WER (未用训练集微调)",
          "两者均处人类极限水平"
        ],
        [
          "TED-LIUM 3 (真实演讲现场录音)",
          "10.5% WER",
          "4.0% WER",
          "-61.9% 错误率暴降!"
        ],
        [
          "AMI / CHiME-6 (多人会议远场嘈杂麦克风)",
          "37.0% / 51.3% WER (严重崩盘)",
          "16.5% / 25.5% WER",
          "-55.4% / -50.3% 错误率砍半!"
        ],
        [
          "12 大分布外真实语音基准几何平均",
          "19.6% 平均 WER",
          "8.8% 平均 WER (追平人类速记员!)",
          "-55.2% 全方位跨场景统治 (SOTA)"
        ]
      ]
    }
  ],
  "insights": [
    {
      "title": "为什么训练 Whisper 时一定要把互联网上那些「疑似由其他语音识别模型自动生成的字幕」过滤掉？",
      "content": "作者发现如果不加过滤，模型虽然数据量更大，但会迅速染上「旧 ASR 系统的坏毛病」：比如从来不打逗号和句号、全部输出大写字母、或者在遇到生僻词时复刻旧模型常犯的谐音错别字！通过简单的格式特征（如全大写无标点检测）清洗掉机器转录垃圾，是让 Whisper 原生输出优美人类书面标点的关键。"
    },
    {
      "title": "为什么在 68 万小时数据上，多语言和多任务联合训练非但没有互相干扰，反而出现了「正迁移（Positive Transfer）」？",
      "content": "在小模型上，同时塞入 96 种语言和翻译任务会导致容量拥挤（负迁移）；但当数据量扩展到 68 万小时且模型扩展到 Large (1.55B) 时，不同语言的声学底层特征与跨语言语义互为补充，多任务模型反而超越了单英语专门训练的模型！"
    }
  ],
  "takeaways": [
    {
      "icon": "Mic",
      "title": "多样化弱监督胜过温室精标",
      "desc": "68 万小时来自真实世界的形形色色音频，赋予了模型任何实验室数据集都教不出的抗噪鲁棒性。"
    },
    {
      "icon": "Sliders",
      "title": "特殊 Token 调度多任务",
      "desc": "用几个开头控制符就把语种识别、打时间戳、转录和翻译收归到一个最标准的 Transformer 解码器里。"
    },
    {
      "icon": "Filter",
      "title": "绝不拿机器产物喂新模型",
      "desc": "过滤掉旧 ASR 生成的无标点字幕，守住了人类自然语言标点与排版的纯净度。"
    },
    {
      "icon": "Globe",
      "title": "开源语音生态的绝对基座",
      "desc": "从会议纪要、视频自动字幕到端到端语音大模型前端，Whisper 已成为全球语音处理的代名词。"
    }
  ]
};

export const PAPER_DATA: UniversalPaperData = WHISPER_2022_DATA;
export default PAPER_DATA;
