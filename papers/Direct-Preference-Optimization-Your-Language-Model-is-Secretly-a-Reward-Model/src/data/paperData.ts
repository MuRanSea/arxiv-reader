import { UniversalPaperData } from "../../../../src/shared/types/universalPaper.js";

export const DPO_2023_DATA: UniversalPaperData = {
  "id": "dpo-2023",
  "title": "Direct Preference Optimization: Your Language Model is Secretly a Reward Model (DPO)",
  "chineseTitle": "DPO 直接偏好优化：你的语言模型本身就暗藏着一个奖励模型（免 RL 对齐革命）",
  "subtitle": "Rafael Rafailov, Archit Sharma, Eric Mitchell, Stefano Ermon, Christopher D. Manning, Chelsea Finn • Stanford University • NeurIPS 2023",
  "tags": [
    "DPO 直接偏好优化",
    "无需显式奖励模型 RM",
    "无需强化学习 PPO",
    "解析最优策略变量代换",
    "开源后训练默认标配"
  ],
  "arxivId": "2305.18290",
  "pdfUrl": "https://arxiv.org/pdf/2305.18290.pdf",
  "abstractUrl": "https://arxiv.org/abs/2305.18290",
  "summary": "彻底颠覆大模型后训练工程复杂度、成为 LLaMA-3、 Zephyr、Qwen 等全球开源社区默认偏好对齐算法的神作！传统 RLHF (PPO) 极其笨重且脆弱：不仅要在显存中同时常驻 4 个大模型（Actor 策略、Reference 参考模型、Reward 奖励模型、Critic 价值模型），还要在训练循环中不断做慢速自回归采样并调校数十个极其敏感的强化学习超参数。斯坦福团队通过惊艳的数学推导证明：带 KL 约束的强化学习奖励最大化问题其实存在【解析闭式解（Closed-form Solution）】，从而可以通过一行简单的代数移项，直接用最优策略与参考策略的对数概率比 β·log(π_θ(y|x)/π_ref(y|x)) 精确表达隐式奖励 r(x,y)！将复杂的两阶段 RLHF 瞬间化简为一个纯粹的【单阶段二元交叉熵分类损失】，无需训练独立奖励模型、无需强化学习采样，在数学上与 RLHF 等价却稳如磐石！",
  "keyContributions": [
    "严格推导带 KL 散度约束的奖励最大化目标的闭式最优策略 π_r(y|x) = (1/Z(x)) π_ref(y|x) exp(r(x,y)/β)，并反向解出奖励关于策略的解析表达式 r(x,y) = β log(π_r(y|x)/π_ref(y|x)) + β log Z(x)",
    "将上述解析奖励代入 Bradley-Terry 成对偏好模型：极其棘手的配分函数 β log Z(x) 在作差 r(x, y_w) - r(x, y_l) 时【完美代数相消】！",
    "将两阶段「先训 RM + 再跑 PPO (需同时加载4个模型+在线采样)」彻底压缩为「直接在偏好对 (x, y_w, y_l) 上优化策略 π_θ 的简单二元交叉熵损失」",
    "通过梯度解析证明 DPO 具有天然的自适应权重机制：对隐式奖励排序错误的样本自动赋予更大的梯度更新权重，彻底消除了无权重似然比发散问题"
  ],
  "coreProblem": "传统 RLHF 中的 PPO 阶段是出了名的「炼丹噩梦」：需要同时把 4 个百亿模型塞进显存，训练中每一步都要执行极慢的自回归文本生成（Rollout），且 Actor 与 Critic 极易失衡崩溃，导致除顶级巨头外，绝大多数团队根本训不好 RLHF。",
  "coreIdea": "既然已知任何奖励函数 r(x,y) 唯一对应一个最优语言模型策略 π*(y|x)，那么反过来，任何一个语言模型 π_θ(y|x) 除以参考模型 π_ref(y|x) 的对数比值，本身就已经唯一定义了一个隐式奖励函数！把这个对数比值直接塞进 Bradley-Terry 胜率公式里做监督学习，一步到位直接训出最优策略，彻底扔掉奖励模型和强化学习！",
  "simulatorTitle": "DPO 隐式奖励对数比与自适应梯度权重解析实验台",
  "simulatorDesc": "交互式调节温度系数 β (0.05~0.5)、胜出回复概率比 log(π_θ/π_ref)_w 与落败回复概率比，实时计算隐式奖励差、样本权重与 PPO 显存对比。",
  "architectureSteps": [
    {
      "id": "dpo-step-1",
      "title": "1. 求解 KL 约束 RL 的闭式最优策略",
      "subtitle": "Closed-Form Optimal Policy Derivation",
      "description": "对标准 RLHF 目标 max_π E[r(x,y)] - β D_KL(π || π_ref) 利用吉布斯不等式求得唯一全局最优解：π*(y|x) = π_ref(y|x)·exp(r(x,y)/β) / Z(x)。",
      "highlightColor": "emerald"
    },
    {
      "id": "dpo-step-2",
      "title": "2. 变量代换反解隐式奖励 r(x,y)",
      "subtitle": "Reparameterizing Reward via Policy Ratio",
      "description": "对上式两边取对数移项，将任意奖励函数写为策略对数比：r(x,y) = β log[π*(y|x) / π_ref(y|x)] + β log Z(x)，其中 Z(x) 仅与提示词 x 有关。",
      "highlightColor": "cyan"
    },
    {
      "id": "dpo-step-3",
      "title": "3. 代入 Bradley-Terry 完美抵消配分函数 Z(x)",
      "subtitle": "Partition Function Z(x) Cancellation",
      "description": "由于 Bradley-Terry 胜率只取决于同一个 x 下两个回复的奖励之差 r(x, y_w) - r(x, y_l)，原本无法计算的求和项 β log Z(x) 一正一负完美抵消归零！",
      "highlightColor": "amber"
    },
    {
      "id": "dpo-step-4",
      "title": "4. 单阶段交叉熵优化与自适应边界梯度",
      "subtitle": "Single-Stage Cross-Entropy with Margin Weighting",
      "description": "直接在偏好数据集 (x, y_w, y_l) 上执行标准前向传播（无需在线生成采样）， simultaneously 拉高胜出回复 y_w 的相对概率、压低落败回复 y_l 的相对概率。",
      "highlightColor": "purple"
    }
  ],
  "formulas": [
    {
      "id": "dpo-f1",
      "name": "奖励-策略重参数化恒等式与 DPO 核心损失函数",
      "category": "DPO 核心方程",
      "formula": "r_\\theta(x, y) = \\beta \\log \\frac{\\pi_\\theta(y|x)}{\\pi_{\\text{ref}}(y|x)} + \\beta \\log Z(x) \\implies \\mathcal{L}_{\\text{DPO}}(\\pi_\\theta; \\pi_{\\text{ref}}) = -\\mathbb{E}_{(x, y_w, y_l) \\sim \\mathcal{D}} \\left[ \\log \\sigma \\left( \\beta \\log \\frac{\\pi_\\theta(y_w|x)}{\\pi_{\\text{ref}}(y_w|x)} - \\beta \\log \\frac{\\pi_\\theta(y_l|x)}{\\pi_{\\text{ref}}(y_l|x)} \\right) \\right]",
      "explanation": "整篇论文最惊艳的一步推导：用策略模型相对于 SFT 参考模型的对数概率增量直接充当隐式奖励，让强化学习对齐退化为像训练分类器一样简单的监督学习！",
      "variables": [
        {
          "symbol": "\\pi_\\theta, \\pi_{\\text{ref}}",
          "desc": "当前正在训练的策略语言模型与冻结的初始 SFT 参考模型"
        },
        {
          "symbol": "y_w, y_l",
          "desc": "人类偏好对中胜出的回复（Preferred）与落败的回复（Dispreferred）"
        },
        {
          "symbol": "\\beta",
          "desc": "控制偏离参考模型 π_ref 程度的距离惩罚温度参数（通常取 0.1 ~ 0.5）"
        }
      ]
    },
    {
      "id": "dpo-f2",
      "name": "DPO 梯度解析式（内置隐式奖励纠错加权）",
      "category": "梯度动力学",
      "formula": "\\nabla_\\theta \\mathcal{L}_{\\text{DPO}} = -\\beta \\,\\mathbb{E}_{(x, y_w, y_l)} \\Big[ \\underbrace{\\sigma(\\hat{r}_\\theta(x, y_l) - \\hat{r}_\\theta(x, y_w))}_{\\text{排序错误程度自适应权重}} \\Big( \\nabla_\\theta \\log \\pi_\\theta(y_w|x) - \\nabla_\\theta \\log \\pi_\\theta(y_l|x) \\Big) \\Big]",
      "explanation": "括号前的 Sigmoid 项极为关键：当模型已经能正确给 y_w 更高隐式分时权重趋近于 0；反之当模型给错败方 y_l 更高分时，权重自动放大，精准纠偏而绝不崩溃。",
      "variables": [
        {
          "symbol": "\\hat{r}_\\theta(x, y) = \\beta \\log \\frac{\\pi_\\theta(y|x)}{\\pi_{\\text{ref}}(y|x)}",
          "desc": "无配分函数的语言模型隐式奖励估计值"
        },
        {
          "symbol": "\\sigma(\\hat{r}_l - \\hat{r}_w)",
          "desc": "根据当前模型对正负样本错判幅度自动缩放梯度的动态系数"
        }
      ]
    }
  ],
  "metricCards": [
    {
      "label": "训练常驻模型数量",
      "value": "4 个 ➔ 2 个 (仅需1份梯度)",
      "desc": "彻底砍掉 Reward Model 与 Critic Model，且 π_ref 可预计算对数概率离线缓存",
      "color": "emerald"
    },
    {
      "label": "训练期在线采样开销",
      "value": "100% 消除 (零 Rollout)",
      "desc": "告别 PPO 极慢的自回归生成等待，训练速度与普通 SFT 一样快",
      "color": "cyan"
    },
    {
      "label": "奖励-KL 帕累托前沿",
      "value": "全面超越 PPO 与 Best-of-N",
      "desc": "在每一档 KL 散度预算下均比 PPO 取得更高的真实人类偏好胜率",
      "color": "amber"
    },
    {
      "label": "开源对齐采用率",
      "value": "LLaMA-3 等首选方案",
      "desc": "Meta LLaMA-3 官方技术报告采用 DPO 完成旗舰模型人类偏好对齐",
      "color": "purple"
    }
  ],
  "experimentSections": [
    {
      "title": "Anthropic-HH 对话与 TL;DR 摘要基准上 DPO 与 PPO / Best-of-N 对齐效果及工程代价对比",
      "description": "对比 SFT、Unlikelihood、PPO、Best-of-128 以及 DPO 在 GPT-4/人类评测胜率、显存消耗与训练稳定性上的表现。",
      "headers": [
        "对齐算法方案",
        "常驻模型数 & 在线采样",
        "超参数调优难度",
        "TL;DR 摘要 / Anthropic-HH 人类胜率 (↑)"
      ],
      "rows": [
        [
          "SFT (仅监督微调基线)",
          "1 个模型 • 无在线采样",
          "极低",
          "38.2% / 46.5%"
        ],
        [
          "Unlikelihood (无权重直接正负对数加减)",
          "1 个模型 • 无在线采样",
          "低 (但极易引发语言退化崩溃)",
          "31.4% (缺乏自适应权重导致崩坏)"
        ],
        [
          "PPO (传统 RLHF 四模型强化学习)",
          "4 个模型 • 需慢速自回归采样",
          "极高 (对学习率/KL/Clip极敏感)",
          "57.1% / 58.0%"
        ],
        [
          "DPO 直接偏好优化 (本文方案)",
          "仅 1 个训练模型 (π_ref 可预计算)",
          "极低 (仅 1 个 β 超参，极度稳定)",
          "61.5% / 64.2% (速度翻倍且胜率夺冠!)"
        ]
      ]
    }
  ],
  "insights": [
    {
      "title": "为什么以前有人试过直接「拉高 y_w 概率、压低 y_l 概率（log π(y_w) - log π(y_l)）」却总是训练崩溃，而 DPO 却能成功？",
      "content": "论文在梯度公式中给出了精辟解答：如果单纯优化 log π(y_w) - log π(y_l)，无论 y_l 的概率已经多低，梯度永远拼命把 y_l 往负无穷推，并无限拉偏离 π_ref，几百步后模型就会输出乱码！而 DPO 从 KL 约束闭式解推导出的 log σ(β log(π/π_ref)_w - β log(π/π_ref)_l) 天然包含：(1) 除以 π_ref 的相对锚定，以及 (2) 前置的 σ(r̂_l - r̂_w) 饱和制动器——一旦拉开了差距，梯度自动衰减归零！"
    },
    {
      "title": "工程技巧：训练 DPO 甚至连第 2 个参考模型 π_ref 都不需要留在显存里！",
      "content": "因为数据集中的 (x, y_w, y_l) 是固定的，而参考模型 π_ref 又是完全冻结不更新的，所以在正式训练开始前，只需用初始模型跑一遍数据集，把每条样本的 log π_ref(y_w|x) 和 log π_ref(y_l|x) 两个浮点数算出来存进硬盘，训练时显存里就只需要放 1 个 模型，显存开销与普通 SFT 100% 相同！"
    }
  ],
  "takeaways": [
    {
      "icon": "Zap",
      "title": "数学推导替代复杂工程的典范",
      "desc": "三行优雅的代数反解与配分函数相消，直接干掉了整个 PPO 强化学习训练栈。"
    },
    {
      "icon": "Cpu",
      "title": "把对齐门槛降到与 SFT 齐平",
      "desc": "预计算参考对数概率后，单机跑通 LoRA/QLoRA 的地方就能直接跑通 DPO 对齐。"
    },
    {
      "icon": "Sliders",
      "title": "内置自适应错题加权器",
      "desc": "梯度前面的 σ(r̂_l - r̂_w) 让模型只对还没区分开的正负对发力，已经学会的自动收手。"
    },
    {
      "icon": "TrendingUp",
      "title": "引爆 XPO (SimPO/IPO/KTO) 家族",
      "desc": "开创了隐式奖励直接优化流派，并与在线采样结合衍生出 Iterative Online DPO。"
    }
  ]
};

export const PAPER_DATA: UniversalPaperData = DPO_2023_DATA;
export default PAPER_DATA;
