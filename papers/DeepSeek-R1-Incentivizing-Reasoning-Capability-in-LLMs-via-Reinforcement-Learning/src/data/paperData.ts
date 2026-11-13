import { UniversalPaperData } from "../../../../src/shared/types/universalPaper.js";

export const DEEPSEEK_R1_2025_DATA: UniversalPaperData = {
  "id": "deepseek-r1-2025",
  "title": "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning",
  "chineseTitle": "DeepSeek-R1 强化学习推理大模型：纯组相对策略优化 (GRPO) 激发长思维链顿悟涌现",
  "subtitle": "DeepSeek-AI (深度求索) • arXiv 2025 (同步涵盖核心算法基石 DeepSeekMath GRPO 2402.03300)",
  "tags": [
    "DeepSeek-R1 & R1-Zero",
    "GRPO 组相对策略优化",
    "无 Critic 价值网络",
    "纯规则可验证奖励 Rule-based RL",
    "Aha Moment 顿悟与自我反思涌现"
  ],
  "arxivId": "2501.12948",
  "pdfUrl": "https://arxiv.org/pdf/2501.12948.pdf",
  "abstractUrl": "https://arxiv.org/abs/2501.12948",
  "summary": "震动全球科技界、首次以完全开源之姿追平 OpenAI o1 正式版并揭秘「推理大模型（Reasoning Models / Test-Time Compute Scaling）」核心配方的史诗级论文！长期以来学界认为要让大模型学会复杂推理，必须先喂入海量人类专家手写的分步解题过程（SFT）或训练昂贵的逐步骤过程奖励模型（PRM）。DeepSeek-R1-Zero 做出了一个颠覆认知的创举：完全跳过任何监督微调（Zero SFT），直接从基础模型（DeepSeek-V3-Base）出发，利用 DeepSeekMath (2402.03300) 首创的 「组相对策略优化（GRPO —— 彻底砍掉与主模型等大的 Critic 价值网络，改用同题 G 个采样回答的组内归一化均方差作为优势基线）」 与纯粹的 「基于规则的准确性+格式奖励（Rule-based Verifiable Rewards）」 进行大规模强化学习！随着 RL 步数推进，模型竟无师自通地自发涌现出数千词的长思维链、自我验证、回溯纠错乃至震撼的 「顿悟时刻（Aha Moment）」，AIME 2024 数学竞赛准确率从 15.6% 一路狂飙至 71.0%（多数投票达 86.7%，R1 正式版达 79.8%）！",
  "keyContributions": [
    "提出 DeepSeek-R1-Zero 纯强化学习范式：首次证明无需任何人工标注的思维链 SFT 数据，仅靠大规模规则强化学习（RL）即可从零激发大模型的长链推理、自我反思与回溯验证能力",
    "采用并规模化验证 GRPO（Group Relative Policy Optimization，源自 2402.03300）：对每个问题采样一组 G 个输出 {o_1, ..., o_G}，直接以组内奖励均值与标准差计算优势 A_i = (r_i - mean(r))/std(r)，彻底砍掉占一半显存与算力的 Critic 价值模型",
    "摒弃极易被钻空子（Reward Hacking）的神经网络过程奖励模型（Neural PRM），仅采用百分之百客观的「规则验证奖励（数学答案匹配 + 代码编译通过 + `<think>` 标签格式奖励）」驱动稳定长程进化",
    "构建完整的四阶段 DeepSeek-R1 工业流水线（数千条冷启动长 CoT SFT → 面向推理的 GRPO → 拒绝采样合成 + 通用数据混合 SFT → 全场景对齐 RL），并将长链推理能力成功蒸馏至 1.5B~70B 小模型（刷新全部同尺寸世界纪录）"
  ],
  "coreProblem": "传统 PPO 强化学习需要维护一个与主模型（如 671B）完全同尺寸的 Critic（Value）价值模型来估计每个位置的基线收益，在长思维链（动辄上万 Token）场景下显存爆炸且价值估计极不准确；同时若用神经网络奖励模型给推理过程打分，模型在大规模 RL 中必然学会套路化作弊（Reward Hacking）导致崩溃。",
  "coreIdea": "第一，扔掉 Critic 价值网络，改用 GRPO「同行衬托法」：对同一道数学或代码题，让模型一口气生成 G=16 个候选解答，直接算这 16 个解答的平均分和标准差——比平均分高的就是正优势（鼓励），比平均分低的就是负优势（抑制）！第二，只看客观结果（答案对不对/代码通不通），绝不教模型「该怎么想」：把思考过程关进 `<think>...</think>` 沙盒里让模型自己在强化学习压力下自由进化，模型为了算对难题会自动学会「多想几千个词、算错了推倒重来」！",
  "simulatorTitle": "DeepSeek-R1 GRPO 组内相对优势与测试时思维链涌现实验台",
  "simulatorDesc": "交互式调节 GRPO 组采样大小 G (4~64)、RL 训练步数与冷启动开关，实时推演组内相对优势 A_i、自然涌现思维链长度与 AIME 2024 竞赛得分。",
  "architectureSteps": [
    {
      "id": "r1-step-1",
      "title": "1. GRPO 组采样与无 Critic 相对优势计算",
      "subtitle": "Group Relative Policy Optimization (No Critic)",
      "description": "针对每个问题 q，从旧策略 π_{θ_old} 并行采样 G 个完整回复 {o_1, ..., o_G}；计算组内均值 μ_r 与标准差 σ_r，令第 i 个回复的优势 A_i = (r_i - μ_r) / σ_r，立省 50% RL 显存！",
      "highlightColor": "emerald"
    },
    {
      "id": "r1-step-2",
      "title": "2. 纯规则可验证奖励驱动 (Rule-Based Rewards)",
      "subtitle": "Hack-Proof Accuracy & Format Verifiers",
      "description": "彻底不用神经网络奖励模型给数学/代码打分，仅由精确规则裁判给分：r = r_accuracy (答案精确匹配或通过单元测试) + r_format (严格将思考放入 <think> 标签内)。",
      "highlightColor": "cyan"
    },
    {
      "id": "r1-step-3",
      "title": "3. R1-Zero 自发顿悟涌现 (Aha Moment & Test-Time Scaling)",
      "subtitle": "Emergent Self-Reflection & Verification",
      "description": "随着 RL 训练推进，模型在没有任何长度奖励的情况下，自发将思考长度从百余词扩展到数千词，并在中期涌现出「Wait, let me re-evaluate...（等等，我重新检查一下）」的顿悟时刻！",
      "highlightColor": "amber"
    },
    {
      "id": "r1-step-4",
      "title": "4. R1 四阶段精炼与小模型推理蒸馏",
      "subtitle": "4-Stage R1 Pipeline & Reasoning Distillation",
      "description": "加入数千条可读冷启动数据消除语言混杂 → 二轮推理 GRPO → 80万条推理+通用拒绝采样 SFT → 全场景 RL，产出比肩 o1 的 DeepSeek-R1 并赋能 1.5B~70B 蒸馏全家桶。",
      "highlightColor": "purple"
    }
  ],
  "formulas": [
    {
      "id": "r1-f1",
      "name": "GRPO（组相对策略优化）目标函数与组内归一化优势 (2402.03300)",
      "category": "GRPO 核心算法",
      "formula": "\\mathcal{J}_{\\text{GRPO}}(\\theta) = \\mathbb{E}_{q,\\, \\{o_i\\}_{i=1}^G \\sim \\pi_{\\theta_{\\text{old}}}} \\left[ \\frac{1}{G} \\sum_{i=1}^G \\left( \\min\\!\\left( \\rho_i A_i,\\; \\text{clip}(\\rho_i, 1-\\epsilon, 1+\\epsilon) A_i \\right) - \\beta \\,\\mathbb{D}_{\\text{KL}}(\\pi_\\theta \\| \\pi_{\\text{ref}}) \\right) \\right], \\quad A_i = \\frac{r_i - \\text{mean}(\\{r_1,\\dots,r_G\\})}{\\text{std}(\\{r_1,\\dots,r_G\\})}",
      "explanation": "用同题 G 个采样回复的经验均值和标准差直接替代了 PPO 中昂贵且难以训练的 Critic 价值函数 V_ψ(s)，并采用恒正的无偏逐 Token KL 散度估计器。",
      "variables": [
        {
          "symbol": "G",
          "desc": "每个提示词并行采样的候选回复组大小（如 G = 16 或 64）"
        },
        {
          "symbol": "A_i",
          "desc": "第 i 条回复相对于同组其他回复的标准化相对优势得分"
        },
        {
          "symbol": "\\mathbb{D}_{\\text{KL}} = \\frac{\\pi_{\\text{ref}}}{\\pi_\\theta} - \\log\\frac{\\pi_{\\text{ref}}}{\\pi_\\theta} - 1",
          "desc": "Schulman 无偏且恒非负的直接 KL 散度正则项"
        }
      ]
    },
    {
      "id": "r1-f2",
      "name": "可验证规则奖励（Rule-Based Verifiable Reward）合成方程",
      "category": "抗作弊奖励设计",
      "formula": "r_i = r_{\\text{acc}}(q, o_i) + r_{\\text{format}}(o_i) = \\mathbb{I}\\big[\\text{Verify}(\\text{ Ans}(o_i),\\, y^* )\\big] + \\lambda_{\\text{fmt}}\\,\\mathbb{I}\\big[ o_i \\text{ matches } \\texttt{<think>...</think><answer>...</answer>} \\big]",
      "explanation": "编译器和数学符号判分器是永远无法被花言巧语欺骗的铁面裁判——这保证了模型在上万步高强度 RL 下只能靠「真正把题算对」来拿分，彻底杜绝 Reward Hacking。",
      "variables": [
        {
          "symbol": "r_{\\text{acc}} \\in \\{0, 1\\}",
          "desc": "答案正确性或代码测试用例通过率的确定性规则奖励"
        },
        {
          "symbol": "r_{\\text{format}}",
          "desc": "结构化思考与答案分离的格式合规奖励"
        }
      ]
    }
  ],
  "metricCards": [
    {
      "label": "AIME 2024 奥数竞赛得分",
      "value": "15.6% ➔ 79.8% (超o1)",
      "desc": "R1-Zero 纯 RL 狂飙至 71.0% (cons@64 达 86.7%)，R1 正式版达 79.8%",
      "color": "emerald"
    },
    {
      "label": "MATH-500 数学基准准确率",
      "value": "97.3% (全球顶级)",
      "desc": "正面追平并略超 OpenAI o1-1217 正式版 (96.4%)",
      "color": "cyan"
    },
    {
      "label": "RL 价值网络 (Critic) 显存",
      "value": "100% 砍除 (0 GB)",
      "desc": "GRPO 用组内均值基线彻底淘汰与主模型等大的 Critic 网络",
      "color": "amber"
    },
    {
      "label": "小模型蒸馏越级突破",
      "value": "32B 超越 o1-mini",
      "desc": "R1-Distill-Qwen-32B 在 AIME 斩获 72.6%，远超小模型自己跑 RL",
      "color": "purple"
    }
  ],
  "experimentSections": [
    {
      "title": "DeepSeek-R1 系列与 OpenAI o1 系列在数学、代码与科学推理基准上的硬核对比",
      "description": "验证纯强化学习 R1-Zero、多阶段对齐 R1 以及蒸馏小模型在权威硬核推理榜单上的统治力。",
      "headers": [
        "模型名称与训练范式",
        "核心推理训练机制",
        "AIME 2024 Pass@1 (↑)",
        "MATH-500 (↑) / Codeforces 百分位 (↑)"
      ],
      "rows": [
        [
          "DeepSeek-V3-Base / Chat (无长CoT RL)",
          "常规预训练 + SFT/DPO",
          "15.6% → 39.2%",
          "90.2% / 58.7% Percentile"
        ],
        [
          "OpenAI o1-mini (闭源轻量推理模型)",
          "闭源强化学习推理",
          "63.6%",
          "90.0% / 93.4% Percentile"
        ],
        [
          "DeepSeek-R1-Zero (本文纯RL零SFT)",
          "Base 直上 GRPO + 规则奖励",
          "71.0% (cons@64 达 86.7%!)",
          "95.9% / 自发涌现长思维链与顿悟时刻"
        ],
        [
          "DeepSeek-R1 (本文四阶段完整版)",
          "冷启动 + GRPO + 拒绝采样 + 全场景RL",
          "79.8% (超越 o1-1217 的 79.2%!)",
          "97.3% / 96.3% Percentile (开源巅峰)"
        ]
      ]
    }
  ],
  "insights": [
    {
      "title": "为什么在 DeepSeek-R1 中，传统的蒙特卡洛树搜索（MCTS）和神经网络过程奖励模型（PRM）双双宣告失败？",
      "content": "论文在 Section 4 坦诚分享了极具价值的「失败经验」：(1) 不同于围棋动作空间极小，语言生成的词表搜索空间呈指数爆炸，MCTS 极易陷入局部死胡同且价值网络极难训练；(2) 用神经网络做逐步骤打分（Neural PRM）在大规模 RL 中必定引发严重的 Reward Hacking，还要额外重训 PRM。反而是大道至简的「GRPO + 纯结果规则校验」一力降十会！"
    },
    {
      "title": "强化学习（RL）与蒸馏（Distillation）在赋予模型推理能力时的分工定律",
      "content": "论文通过对比「在 Qwen-32B-Base 上直接跑一万步零起点 RL（仅得 47% AIME）」与「用 R1 (671B) 探索出的长思维链直接蒸馏 Qwen-32B（高达 72.6% AIME）」得出核心科学结论：突破人类与现有模型认知上限的新推理模式必须靠巨型旗舰底座跑大规模 RL 去探索涌现；而一旦旗舰探索出了高级推理范式，小模型通过直接蒸馏学习要比自己从头盲目探索高效十倍！"
    }
  ],
  "takeaways": [
    {
      "icon": "Zap",
      "title": "GRPO 终结 Critic 显存包袱",
      "desc": "组内同行比高低（(r_i - mean)/std），一行公式省掉几百 GB 的价值网络。"
    },
    {
      "icon": "CheckSquare",
      "title": "规则可验证奖励不可战胜",
      "desc": "凡是有客观对错标准（数学、代码、逻辑、工具验证）的领域，Rule-based RL 就是最纯粹的进化引擎。"
    },
    {
      "icon": "Sparkles",
      "title": "强化学习自发涌现顿悟时刻",
      "desc": "不教模型怎么想，只奖励它算对题，模型自己就会发明出自我反思、检查与反证法。"
    },
    {
      "icon": "Share2",
      "title": "大模型 RL 探索，小模型蒸馏收割",
      "desc": "确立了旗舰模型通过 RL 拓宽认知边界、再通过轨迹蒸馏普惠端侧小模型的工业范式。"
    }
  ]
};

export const PAPER_DATA: UniversalPaperData = DEEPSEEK_R1_2025_DATA;
export default PAPER_DATA;
