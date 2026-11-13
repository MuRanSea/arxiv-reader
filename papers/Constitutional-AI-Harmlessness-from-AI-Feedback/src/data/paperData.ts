import { UniversalPaperData } from "../../../../src/shared/types/universalPaper.js";

export const CONSTITUTIONAL_AI_2022_DATA: UniversalPaperData = {
  "id": "constitutional-ai-2022",
  "title": "Constitutional AI: Harmlessness from AI Feedback (CAI & RLAIF)",
  "chineseTitle": "Constitutional AI 宪法 AI：基于自然语言原则章程与 AI 反馈的自我批判对齐范式",
  "subtitle": "Yuntao Bai (白运涛), Saurav Kadavath, Sandipan Kundu, Amanda Askell, Jared Kaplan, Dario Amodei et al. • Anthropic • arXiv 2022",
  "tags": [
    "Constitutional AI (CAI)",
    "RLAIF (AI反馈强化学习)",
    "Critique-and-Revision 自我批评与改写",
    "告别拒绝服务式消极逃避",
    "显式自然语言宪法章程"
  ],
  "arxivId": "2212.08073",
  "pdfUrl": "https://arxiv.org/pdf/2212.08073.pdf",
  "abstractUrl": "https://arxiv.org/abs/2212.08073",
  "summary": "Anthropic 打造旗舰大模型 Claude 的灵魂基石，首次将大模型价值观与安全对齐推向规模化自动化的里程碑之作！传统 RLHF 在处理安全性（Harmlessness）时面临两大死结：(1) 需要雇佣海量人类标注员阅读并对比数万条极其有毒、暴力的红队诱导文本，不仅成本高昂且造成严重心理创伤；(2) 经人工打标训练出的安全模型极易变成「动辄拒绝回答一切敏感词的胆小鬼（Evasive Model）」，导致有用性（Helpfulness）与无害性（Harmlessness）剧烈冲突。Constitutional AI (CAI) 提出：人类无需亲自标注任何一条无害性样本，只需编写几十条自然语言「宪法原则（Constitution）」，先通过「自我批评与自我改写（Critique → Revision）」生成高质量合成 SFT 数据，再利用模型按宪法原则加思维链（CoT）自动给候选回复打分完成「基于 AI 反馈的强化学习（RLAIF）」，在零人工无害性标注下同时实现更高安全性与零推诿拒答！",
  "keyContributions": [
    "提出第一阶段监督自改进（SL-CAI）：面对红队攻击 Prompt，让模型先自由生成初始回复，再随机抽取一条「宪法原则」令其自我批评（Critique）并据此自我改写（Revision），多轮迭代后微调自身",
    "开创第二阶段「基于 AI 反馈的强化学习（RLAIF）」：由大模型对照宪法原则通过思维链推理输出对两个回复的偏好概率分布，替代昂贵的人类安全标注员来训练偏好模型（PM）",
    "攻克「有用性 vs 无害性跷跷板悖论（Helpfulness-Harmlessness Tradeoff）」：传统 HH-RLHF 为求安全动辄输出「作为一个AI我不能回答」，而 CAI 引导模型礼貌解释风险并提供建设性无害解答（Non-evasive Harmlessness）",
    "实现对齐规则的彻底透明化与可审计化：将隐匿在数万名外包标注员主观偏见中的潜规则，浓缩为一份公开、可随时修改的自然语言《AI 宪法章程》"
  ],
  "coreProblem": "依靠人工标注做安全对齐既无法随模型规模线性扩展（人类阅读海量恶意红队攻击成本极高），又会导致模型为了规避惩罚采取「消极推诿策略（凡遇到稍敏感话题一律回答无法提供帮助）」，严重损害用户体验。",
  "coreIdea": "用一份只有十几条自然语言原则的「宪法（Constitution）」替代数万名人工审核员！第一阶段让 AI 自己扮演「写作者 + 宪法审查官 + 改写员」，把原本危险或敷衍的回答改写成既安全又有信息量的示范；第二阶段让 AI 扮演「宪法陪审团」，结合思维链给成对候选打分并驱动 RL 训练（RLAIF）！",
  "simulatorTitle": "Constitutional AI 自我批评改写循环与 RLAIF 帕累托前沿实验台",
  "simulatorDesc": "交互式调节自我批评改写轮数 (0~4轮)、思维链 RLAIF 开关与宪法原则权重，观察有用性 Elo 与无害性 Elo 的帕累托双赢曲线。",
  "architectureSteps": [
    {
      "id": "cai-step-1",
      "title": "1. 红队诱导生成与宪法抽样",
      "subtitle": "Red-Teaming Generation & Principle Sampling",
      "description": "向仅经过有用性微调的初始模型输入高危红队提示（Red-teaming Prompts）产生包含潜在风险的初始回复，并从 16 条自然语言宪法章程中随机抽取一条准则。",
      "highlightColor": "emerald"
    },
    {
      "id": "cai-step-2",
      "title": "2. 迭代式自我批评与自我改写 (SL-CAI)",
      "subtitle": "Multi-Turn Self-Critique & Self-Revision",
      "description": "提示模型对照所抽宪法准则指出初始回复中的有害或说教之处（Critique），随后要求其重写一份既消除危害又不推诿敷衍的新回复（Revision），循环数轮后做 SFT。",
      "highlightColor": "cyan"
    },
    {
      "id": "cai-step-3",
      "title": "3. 思维链宪法评判生成 AI 偏好 (CoT Feedback)",
      "subtitle": "Chain-of-Thought AI Preference Labeling",
      "description": "对成对候选回复 (y_A, y_B)，令反馈模型基于宪法先输出一段逐步推理分析（CoT），再提取其对选项 [A] 与 [B] 的归一化对数概率作为软偏好标签（Soft Labels）。",
      "highlightColor": "amber"
    },
    {
      "id": "cai-step-4",
      "title": "4. 混合 RLAIF 偏好建模与强化学习",
      "subtitle": "Hybrid RLAIF Preference Model & RL Training",
      "description": "将人类有用性偏好与 AI 生成的无害性软偏好合并训练统一奖励模型（PM），通过 RL 训练出兼具高有用性、高安全性且绝不敷衍拒答的 RL-CAI 模型。",
      "highlightColor": "purple"
    }
  ],
  "formulas": [
    {
      "id": "cai-f1",
      "name": "SL-CAI 多轮自我批评与自我改写马尔可夫链",
      "category": "监督自改进 (SL-CAI)",
      "formula": "y^{(0)} \\sim \\pi_0(\\cdot | x), \\quad c^{(k)} \\sim \\pi_0(\\cdot | x, y^{(k-1)}, \\mathcal{P}_{\\text{crit}}^{(k)}), \\quad y^{(k)} \\sim \\pi_0(\\cdot | x, y^{(k-1)}, c^{(k)}, \\mathcal{P}_{\\text{rev}}^{(k)})",
      "explanation": "每一轮迭代 k 随机采样不同的宪法条款 P^{(k)}，通过「生成批评 c^{(k)} → 生成修正版 y^{(k)}」将有害率随轮数 k 单调指数级压降，最终用 (x, y^{(K)}) 微调模型。",
      "variables": [
        {
          "symbol": "y^{(0)}, y^{(K)}",
          "desc": "面对红队诱导时的原始有害回复与经过 K 轮宪法改写后的安全高质回复"
        },
        {
          "symbol": "c^{(k)}, \\mathcal{P}^{(k)}",
          "desc": "第 k 轮根据宪法原则 P^{(k)} 产生的自我审视批评文本"
        }
      ]
    },
    {
      "id": "cai-f2",
      "name": "RLAIF 软概率偏好交叉熵损失函数",
      "category": "AI反馈强化学习 (RLAIF)",
      "formula": "p_{\\text{AI}}(y_1 \\succ y_2 | x, \\mathcal{C}, \\text{CoT}) = \\frac{\\pi_{\\text{FB}}(\\text{[A]} | x, y_1, y_2, \\mathcal{C}, \\text{CoT})}{\\pi_{\\text{FB}}(\\text{[A]}|\\dots) + \\pi_{\\text{FB}}(\\text{[B]}|\\dots)}, \\quad \\mathcal{L}_{\\text{RLAIF}} = -\\mathbb{E}\\Big[ p_{\\text{AI}} \\log \\sigma(r_1 - r_2) + (1 - p_{\\text{AI}}) \\log \\sigma(r_2 - r_1) \\Big]",
      "explanation": "不同于人类只能给出 0 或 1 的硬点击，AI 评审官在完成 CoT 分析后可直接读取选项 Token 的归一化概率 p_AI ∈ [0,1]，提供校准度极高的连续软目标！",
      "variables": [
        {
          "symbol": "\\mathcal{C}, \\text{CoT}",
          "desc": "自然语言宪法原则集合与 AI 评审员生成的显式思维链推理过程"
        },
        {
          "symbol": "p_{\\text{AI}}",
          "desc": "由反馈大模型输出的经过良好校准（Well-calibrated）的偏好概率软标签"
        }
      ]
    }
  ],
  "metricCards": [
    {
      "label": "人工无害性标注需求",
      "value": "0 条 (100% AI自标注)",
      "desc": "彻底解放人类标注员免受数万条有毒红队文本精神折磨",
      "color": "emerald"
    },
    {
      "label": "无害性 Elo 评分提升",
      "value": "超越人工 RLHF (+85 Elo)",
      "desc": "在同等级有用性下，RL-CAI 的安全性显著优于全人工 HH-RLHF",
      "color": "cyan"
    },
    {
      "label": "敷衍推诿拒答率",
      "value": "接近 0% (Non-evasive)",
      "desc": "不再回答生硬的「我无法回答」，而是耐心客观解释为何某请求存在风险",
      "color": "amber"
    },
    {
      "label": "核心治理规则体量",
      "value": "仅 16 条自然语言原则",
      "desc": "用极简可读的明文章程掌控百亿参数模型的行为边界",
      "color": "purple"
    }
  ],
  "experimentSections": [
    {
      "title": "Anthropic 52B 模型在不同对齐范式下的有用性 (Helpfulness Elo) 与无害性 (Harmlessness Elo) 对比",
      "description": "展示从纯有用性 RLHF、全人工双目标 HH-RLHF、SL-CAI（不同改写轮数）到完整 RL-CAI (RLAIF) 的帕累托前沿推进。",
      "headers": [
        "对齐模型与训练方法",
        "无害性人工标注量",
        "有用性 Helpfulness Elo (↑)",
        "无害性 Harmlessness Elo (↑) & 拒答风格"
      ],
      "rows": [
        [
          "Helpful-Only RLHF (仅优化有用性)",
          "0 条",
          "+165 (极度配合但会教人造炸弹)",
          "-145 (毫无安全底线)"
        ],
        [
          "Human HH-RLHF (全人工有用+无害标注)",
          "42,000+ 条人工标注",
          "+92 (因频繁拒答导致有用性下滑)",
          "+110 (安全但动辄消极拒绝回答)"
        ],
        [
          "SL-CAI (4轮宪法批评改写监督微调)",
          "0 条 (16条宪法自改写)",
          "+128",
          "+75 (单靠监督改写已大幅净化输出)"
        ],
        [
          "RL-CAI + CoT RLAIF (本文完整方案)",
          "0 条人工安全标注!",
          "+135 (保持高有用性)",
          "+162 (帕累托双赢 SOTA，礼貌且不推诿!)"
        ]
      ]
    }
  ],
  "insights": [
    {
      "title": "为什么让模型「先写一段批评（Critique）再改写（Revision）」，比直接让模型「一步改写成安全回答」效果好得多？",
      "content": "论文消融实验表明：尤其在中大型模型上，先用自然语言显式指出原回答哪里违反了哪条原则（Critique），相当于在改写前做了一次靶向定位的思维链推理（Chain-of-Thought），能精准剔除有害细节同时完整保留原本有用的正常知识，而直接一步改写往往会把整段内容粗暴删空。"
    },
    {
      "title": "Constitutional AI 如何开启了「合成数据自对齐（Synthetic Data Self-Alignment）」时代？",
      "content": "本文证明了当基础模型达到一定能力阈值后，模型「评判和修改回答的能力」远高于它「第一遍直接生成完美回答的能力」（Verification/Critique is easier than Generation）。这一洞察直接衍生出后来 seluruh 业界的 RLAIF、Self-Rewarding LLM 以及合成指令清洗流水线！"
    }
  ],
  "takeaways": [
    {
      "icon": "BookOpen",
      "title": "用明文宪法取代黑盒潜规则",
      "desc": "把对齐价值观从几万名外包人员的不透明点击，变成人人可读、可审计的十几条自然语言原则。"
    },
    {
      "icon": "Edit3",
      "title": "自我批评 → 自我改写闭环",
      "desc": "先找茬再重写（Critique-then-Revise）是榨取大模型自我进化潜能并清洗高质量合成数据的神器。"
    },
    {
      "icon": "Cpu",
      "title": "RLAIF 开启规模化对齐",
      "desc": "用带思维链的 AI 裁判输出校准后的软概率标签，成本仅为人工标注的百分之一且表现更稳。"
    },
    {
      "icon": "Smile",
      "title": "不敷衍、不说教的真正安全",
      "desc": "证明安全不等于「一言不合就拒答」，解释风险并给出积极解答才能实现有用与无害的帕累托共赢。"
    }
  ]
};

export const PAPER_DATA: UniversalPaperData = CONSTITUTIONAL_AI_2022_DATA;
export default PAPER_DATA;
