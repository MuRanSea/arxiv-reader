import { UniversalPaperData } from "../../../../src/shared/types/universalPaper.js";

export const INSTRUCTGPT_2022_DATA: UniversalPaperData = {
  "id": "instructgpt-2022",
  "title": "Training language models to follow instructions with human feedback (InstructGPT)",
  "chineseTitle": "InstructGPT：将大语言模型从「续写机器」蜕变为「听懂指令助手」的 ChatGPT 直接蓝本",
  "subtitle": "Long Ouyang (欧阳龙), Jeff Wu, Xu Jiang, Diogo Almeida, Carroll L. Wainwright, Paul Christiano, Jan Leike, Ryan Lowe • OpenAI • NeurIPS 2022",
  "tags": [
    "InstructGPT (ChatGPT原型)",
    "SFT + RM + PPO 三步法",
    "K=4 ~ 9 成对排序加速",
    "KL 散度惩罚 + 预训练混合 PTX",
    "1.3B 击败 175B GPT-3"
  ],
  "arxivId": "2203.02155",
  "pdfUrl": "https://arxiv.org/pdf/2203.02155.pdf",
  "abstractUrl": "https://arxiv.org/abs/2203.02155",
  "summary": "直接催生 ChatGPT、将大语言模型真正变成亿万普通人日常生产力工具的历史性巨著！原始的 175B GPT-3 只是一个在互联网网页上训练的「下一个词预测器」：当你问它「解释一下登月」，它会接着续写「解释一下重力、解释一下相对论……」而不是回答问题！OpenAI 提出经典的「后训练三部曲（SFT 监督微调 → RM 奖励模型训练 → PPO 强化学习近端策略优化 + KL 惩罚与预训练梯度混合 PPO-ptx）」。令人震撼的是：经过该对齐流水线训练的仅 1.3B（13亿参数） InstructGPT，在人类真实盲测偏好中竟然击败了体积大 130多倍的 175B 原始 GPT-3，同时显著降低了幻觉（造假率减半）与有害输出，彻底宣告「对齐（Alignment）与模型规模同样重要」！",
  "keyContributions": [
    "确立统治整个大模型工业界的后训练（Post-Training）标准三部曲：Step 1 监督微调 (SFT, 1.3万条示范) → Step 2 奖励模型 (RM, 3.3万条排序) → Step 3 PPO 强化学习 (3.1万条无标签 Prompt)",
    "设计 K-way 全排列对比采样技巧：对每个 Prompt 采样 K (K=4~9) 个回复让标注员一次性排序，单次阅读即可产生 C(K, 2) = 6~36 对训练比较并置于同一 Batch 内，标注效率飙升且防止过拟合",
    "提出 PPO-ptx（混合预训练梯度的近端策略优化）：在 RL 目标中同时加入对 SFT 模型的逐词 KL 散度惩罚 -β·log(π_PPO / π_SFT) 与原始预训练语料对数似然 γ·E[log π(x)]，彻底消除「对齐税（Alignment Tax）」",
    "实证证明 1.3B InstructGPT 的人类胜率超过 175B 原始 GPT-3，175B InstructGPT 对原始 GPT-3 的胜率高达 85% ± 3%，TruthfulQA 真实性翻倍"
  ],
  "coreProblem": "预训练大模型的优化目标（预测互联网网页上的下一个 Token）与用户的真实需求（安全、诚实、有用地遵循人类指令回答问题）存在根本性的「目标错位（Objective Mismatch）」。单纯把模型从 10B 扩到 175B 并不能让它自动听懂指令，反而可能生成更具迷惑性的胡编乱造（Hallucination）与有害内容。",
  "coreIdea": "用三步把「互联网通才但不会聊天」的预训练底座变成「听话、靠谱的 AI 助手」：第一步用少量高质量人类专家手写问答做 SFT，教会模型「对话的基本格式」；第二步让人类对模型生成的多个回答从好到坏排个名次，训练出懂人类喜好的裁判模型（RM）；第三步用 PPO 强化学习让模型在裁判指导下自我进化，同时用一根「KL 散度狗绳」拴住它不准跑偏胡说八道，并掺入预训练梯度防止遗忘基础学科知识！",
  "simulatorTitle": "InstructGPT 三阶段对齐 (SFT → RM → PPO-ptx) 与 KL 惩罚实验台",
  "simulatorDesc": "交互式调节单题候选排序数 K (2~9)、KL 惩罚系数 β 与预训练混合权重 γ，观察人类胜率、奖励过优化拐点与对齐税消除效果。",
  "architectureSteps": [
    {
      "id": "inst-step-1",
      "title": "Step 1: 监督微调 (SFT - 示范学习)",
      "subtitle": "Supervised Fine-Tuning on 13k Demonstrations",
      "description": "雇佣 40 名严格筛选的标注员，针对真实 API 用户提交的 Prompt 撰写约 13,000 条高质量理想回答，对 GPT-3 进行常规交叉熵微调得到初始助手 π^{SFT}。",
      "highlightColor": "emerald"
    },
    {
      "id": "inst-step-2",
      "title": "Step 2: 奖励模型训练 (RM - K选排序)",
      "subtitle": "Reward Modeling with C(K,2) Pairwise Ranking",
      "description": "对每个 Prompt 让模型生成 K=4~9 个不同回复，标注员按综合质量排定名次，一次性展开为 C(K,2) 个成对比较放入同一 Batch 训练 6B 标量奖励模型 r_θ(x, y)。",
      "highlightColor": "cyan"
    },
    {
      "id": "inst-step-3",
      "title": "Step 3a: 带 KL 惩罚的 PPO 强化学习",
      "subtitle": "PPO with Per-Token KL Penalty against SFT",
      "description": "以 π^{SFT} 初始化策略 π_φ^{RL}，最大化奖励 r_θ(x, y) - β·D_KL(π_φ^{RL} || π^{SFT})，防止策略通过生成畸形套话欺骗奖励模型（Reward Hacking）。",
      "highlightColor": "amber"
    },
    {
      "id": "inst-step-4",
      "title": "Step 3b: 预训练梯度混入消除对齐税 (PPO-ptx)",
      "subtitle": "Mixing Pretraining Gradients to Fix Alignment Tax",
      "description": "在 PPO 更新中混入权重为 γ 的原始预训练语言建模梯度 γ·E_{x~D_pretrain}[log π_φ(x)]，确保模型在变得极其听话的同时，不损失任何阅读理解、代码与少样本推理智商！",
      "highlightColor": "purple"
    }
  ],
  "formulas": [
    {
      "id": "inst-f1",
      "name": "InstructGPT K-way 组内成对排序奖励模型损失函数",
      "category": "奖励模型 (RM)",
      "formula": "\\mathcal{L}_{\\text{RM}}(\\theta) = -\\frac{1}{\\binom{K}{2}} \\mathbb{E}_{(x, y_1, \\dots, y_K) \\sim \\mathcal{D}} \\left[ \\sum_{y_w \\succ y_l} \\log \\sigma\\!\\left( r_\\theta(x, y_w) - r_\\theta(x, y_l) \\right) \\right]",
      "explanation": "将同一个 Prompt 下的全部 C(K,2) 对比较放在单次前向传播中计算，不仅省去了 K-1 倍重复编码计算，而且彻底避免了按固定对分批导致的严重过拟合（验证集准确率提升且不掉点）。",
      "variables": [
        {
          "symbol": "K \\in [4, 9]",
          "desc": "每个 Prompt 呈现给标注员同时排序的候选回复数量（产生 6 至 36 个训练对）"
        },
        {
          "symbol": "r_\\theta(x, y_w), r_\\theta(x, y_l)",
          "desc": "奖励模型（去掉最后一层词表投影头改为单标量输出）对胜出回复与落败回复的打分"
        }
      ]
    },
    {
      "id": "inst-f2",
      "name": "PPO-ptx 联合对齐与预训练目标方程",
      "category": "强化学习对齐 (PPO-ptx)",
      "formula": "\\text{objective}(\\phi) = \\mathbb{E}_{(x,y) \\sim D_{\\pi_\\phi^{\\text{RL}}}} \\left[ r_\\theta(x, y) - \\beta \\log \\left( \\frac{\\pi_\\phi^{\\text{RL}}(y|x)}{\\pi^{\\text{SFT}}(y|x)} \\right) \\right] + \\gamma \\, \\mathbb{E}_{x \\sim D_{\\text{pretrain}}} \\big[ \\log \\pi_\\phi^{\\text{RL}}(x) \\big]",
      "explanation": "第一项最大化人类偏好奖励；第二项以 KL 散度约束模型不偏离 SFT 语言分布太远；第三项混入预训练数据防止标准 NLP 基准性能退化（即消除对齐税）。",
      "variables": [
        {
          "symbol": "\\beta",
          "desc": "KL 散度惩罚系数（通常取 0.01 ~ 0.02），控制探索幅度与防作弊强度"
        },
        {
          "symbol": "\\gamma",
          "desc": "预训练语料对数似然混合系数（PPO-ptx 核心超参），防止公开学术基准掉分"
        }
      ]
    }
  ],
  "metricCards": [
    {
      "label": "跨量级以小胜大奇迹",
      "value": "1.3B 击败 175B GPT-3",
      "desc": "13 亿参数对齐模型的人类偏好胜率超越大 134 倍的原始 GPT-3",
      "color": "emerald"
    },
    {
      "label": "175B 对齐前后人类胜率",
      "value": "85% ± 3% 压倒性胜出",
      "desc": "即使给原始 GPT-3 提供精心编写的 Few-Shot 提示也取得 >70% 胜率",
      "color": "cyan"
    },
    {
      "label": "闭域幻觉（胡编乱造）率",
      "value": "41% ➔ 21% (减半)",
      "desc": "在摘要与问答中捏造不存在事实的比例直接下降约 50%",
      "color": "amber"
    },
    {
      "label": "Helpful, Honest, Harmless",
      "value": "确立 3H 对齐准则",
      "desc": "距离 2022年11月30日 ChatGPT 震撼发布仅一步之遥的技术底座",
      "color": "purple"
    }
  ],
  "experimentSections": [
    {
      "title": "不同训练阶段与模型尺寸在真实人类盲测偏好胜率及 TruthfulQA 上的对比",
      "description": "验证从原始 GPT-3 → SFT → PPO → PPO-ptx 每一步对指令遵循胜率、真实性以及通用学术基准保持率的贡献。",
      "headers": [
        "模型架构与训练阶段",
        "参数规模",
        "相比 175B SFT 的人类偏好胜率 (↑)",
        "TruthfulQA 真实且信息丰富率 (↑) & 对齐税"
      ],
      "rows": [
        [
          "GPT-3 Raw Pretrained (原始预训练底座)",
          "175B",
          "15.2% (经常答非所问或续写问题)",
          "28.5% • 无对齐税但无法直接交互"
        ],
        [
          "GPT-3 SFT (仅监督微调 1.3万条示范)",
          "175B",
          "50.0% (基准对照线)",
          "43.1% • 格式规范但深度与安全性有限"
        ],
        [
          "InstructGPT-1.3B (PPO-ptx 小模型)",
          "1.3B (缩小 134倍!)",
          "54.2% (大幅超越 175B 原始 GPT-3!)",
          "49.8% • 证明对齐效率远超盲目堆参数"
        ],
        [
          "InstructGPT-175B (PPO-ptx 完整版)",
          "175B",
          "71.4% (对原始 GPT-3 胜率达 85%!)",
          "58.4% (幻觉减半且零对齐税 SOTA)"
        ]
      ]
    }
  ],
  "insights": [
    {
      "title": "为什么在训练奖励模型（RM）时，不能把 C(K,2) 个成对比较拆散随机洗牌，而必须捆绑在同一个 Batch 里？",
      "content": "这是论文揭示的一个极关键工程陷阱：如果对同一个 Prompt 的 K=4 个回答拆出 6 个 (x, y_w, y_l) 对随机打散训练，那么每个回复会在不同梯度步里被奖励模型重复前向编码多次。由于奖励模型容量很大，仅仅训练 1 个 Epoch 就会把该 Prompt 死记硬背下来导致严重过拟合！而把整组 K 个回复在同一次前向传播里算完并一次性求 6 对交叉熵均值，既提速数倍又使验证集精度大幅提升。"
    },
    {
      "title": "为什么主要靠英语标注训练的 InstructGPT，竟然自动学会了用流利的中文、法语和写代码来遵循指令？",
      "content": "虽然 SFT 和 RM 数据中 96% 以上都是英文，但因为【所有的知识和多语言能力其实早在预训练阶段就已经存储在基础模型内部了】！RLHF 并没有教给模型新知识，而是相当于用极少量的成本「解锁（Unlock）」并激活了预训练内部原本就具备的跨语言遵循意图能力。"
    }
  ],
  "takeaways": [
    {
      "icon": "Award",
      "title": "ChatGPT 诞生的直接说明书",
      "desc": "2022 年初的 InstructGPT 与年底引爆全球的 ChatGPT 采用了完全相同的三阶段技术栈。"
    },
    {
      "icon": "Sliders",
      "title": "预训练注入知识，后训练解锁灵魂",
      "desc": "1.3B 击败 175B 证明：没有经过 SFT+RLHF 对齐的巨型模型就像空有学富五车却听不懂人话的书呆子。"
    },
    {
      "icon": "Lock",
      "title": "KL 散度是防止模型发疯的安全绳",
      "desc": "没有 -β·KL 惩罚项，PPO 策略会在几百步内演化出满篇重复感叹号或奉承套话来骗取高分。"
    },
    {
      "icon": "Layers",
      "title": "K-way 组内成对排序范式",
      "desc": "让标注员一次排 4~9 个回复产生 C(K,2) 对样本，至今仍是全球数据标注工厂的标准作业流程。"
    }
  ]
};

export const PAPER_DATA: UniversalPaperData = INSTRUCTGPT_2022_DATA;
export default PAPER_DATA;
