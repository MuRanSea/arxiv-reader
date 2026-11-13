import { UniversalPaperData } from "../../../../src/shared/types/universalPaper.js";

export const RLHF_2017_DATA: UniversalPaperData = {
  "id": "rlhf-2017",
  "title": "Deep Reinforcement Learning from Human Preferences",
  "chineseTitle": "RLHF 奠基论文：基于人类偏好的深度强化学习与奖励模型训练范式",
  "subtitle": "Paul F. Christiano, Jan Leike, Tom B. Brown, Miljan Martic, Shane Legg, Dario Amodei • OpenAI & DeepMind • NeurIPS 2017",
  "tags": [
    "RLHF 开山之作",
    "Reward Model 奖励模型",
    "Bradley-Terry 成对偏好模型",
    "轨迹片段比较",
    "攻克无法手写奖励函数难题"
  ],
  "arxivId": "1706.03741",
  "pdfUrl": "https://arxiv.org/pdf/1706.03741.pdf",
  "abstractUrl": "https://arxiv.org/abs/1706.03741",
  "summary": "整个现代大模型对齐领域（RLHF）的绝对开山之作（由当时还在 OpenAI 与 DeepMind 合作、后来分别主导 GPT-3/ChatGPT 与创立 Anthropic 的原班人马撰写）！此前强化学习（RL）受限于必须在环境中手工定义明确的数值奖励函数 r(s, a)，而在面对复杂人类意图（如「做一个优雅的后空翻」或「写一段有帮助且诚实的回答」）时，人类根本无法写出数学公式或极易被智能体钻空子（Reward Hacking）。本文首创「策略采样轨迹对 → 人类二选一打标 → Bradley-Terry 交叉熵拟合奖励模型 r̂ → 强化学习策略优化」的三阶段闭环，仅需不到 1% 的人类反馈耗时即可教会智能体完成无法手写奖励的复杂行为，成为后来 InstructGPT 与 ChatGPT 诞生的直接母本！",
  "keyContributions": [
    "开创现代 RLHF 三步走标准架构：(1) 策略 π 与环境交互生成成对轨迹片段 (σ¹, σ²)；(2) 人类标注员做二选一偏好判断；(3) 用 Bradley-Terry 似然拟合深度奖励模型 r̂ 并用 RL 优化策略 π",
    "洞察到「让人类直接给行为打绝对分数极不准确，但让人类在两个候选中选出哪个更好（Pairwise Comparison）极其可靠且低认知负担」",
    "引入奖励模型集成（Ensemble of Reward Predictors）评估预测不确定性，主动挑选方差最大的分歧样本请求人工标注（Active Query Selection）",
    "实证展示智能体仅凭 900 次人工点击（不足 1 小时人类时间），即可在零真实环境奖励下学会完美的 MuJoCo 机器人后空翻（Backflip）与 Atari 游戏通关"
  ],
  "coreProblem": "许多人类真正关心的复杂目标（如机器人动作协调、自然语言对话质量、安全价值观）无法用简单的数学代码写成奖励函数；若勉强设置代理指标（Proxy Reward），强化学习智能体会疯狂利用指标漏洞进行作弊（Reward Hacking，例如为了拿分在原地转圈而不通关）。",
  "coreIdea": "虽然人类写不出奖励函数公式，但人类一眼就能看出「A 和 B 两个结果哪个更好」！让神经网络 r̂_ψ 先通过拟合人类的「二选一偏好排行榜（Bradley-Terry 模型）」学会人类的审美与评判标准，再把这个训练好的奖励网络 r̂_ψ 当作虚拟裁判去指导强化学习策略（PPO/TRPO）进化。",
  "simulatorTitle": "RLHF Bradley-Terry 奖励模型拟合与 Reward Hacking 防御实验台",
  "simulatorDesc": "交互式调节偏好对标注数量 K、奖励模型集成数与学习率，实时演示 Bradley-Terry 胜率估计与策略收敛轨迹。",
  "architectureSteps": [
    {
      "id": "rlhf-step-1",
      "title": "1. 策略探索与轨迹对抽样 (σ¹, σ²)",
      "subtitle": "Trajectory Segment Pair Sampling",
      "description": "当前强化学习策略 π_θ 生成大量候选行为片段（或文本回复），从中抽取成对片段 (σ¹, σ²) 呈现给人类评估员。",
      "highlightColor": "emerald"
    },
    {
      "id": "rlhf-step-2",
      "title": "2. 人类二选一偏好采集 μ ∈ {1, 2}",
      "subtitle": "Low-Cognitive-Load Pairwise Human Comparison",
      "description": "人类无需思考该打多少分，只需直观点击 σ¹ 优于 σ²、σ² 优于 σ¹ 或平局，将结果存入偏好数据库 D = {(σ¹, σ², μ)}。",
      "highlightColor": "cyan"
    },
    {
      "id": "rlhf-step-3",
      "title": "3. Bradley-Terry 似然训练奖励模型 r̂",
      "subtitle": "Bradley-Terry Reward Model Fitting",
      "description": "将两段轨迹的累积预测奖励之差通过 Sigmoid 函数映射为胜率 P(σ¹ ≻ σ²) = σ(Σ r̂(σ¹) - Σ r̂(σ²))，最小化与人类选择的交叉熵损失。",
      "highlightColor": "amber"
    },
    {
      "id": "rlhf-step-4",
      "title": "4. 在线 RL 策略迭代与奖励归一化",
      "subtitle": "Online Policy Optimization (TRPO/PPO)",
      "description": "将 r̂ 输出归一化为零均值、固定标准差的平稳信号，驱动 PPO/TRPO 更新策略 π_θ，并持续对新策略生成的样本采集人类反馈防止钻空子。",
      "highlightColor": "purple"
    }
  ],
  "formulas": [
    {
      "id": "rlhf-f1",
      "name": "Bradley-Terry 轨迹偏好概率模型",
      "category": "人类偏好建模",
      "formula": "\\hat{P}[\\sigma^1 \\succ \\sigma^2] = \\frac{\\exp\\!\\left(\\sum_{t} \\hat{r}(o_t^1, a_t^1)\\right)}{\\exp\\!\\left(\\sum_{t} \\hat{r}(o_t^1, a_t^1)\\right) + \\exp\\!\\left(\\sum_{t} \\hat{r}(o_t^2, a_t^2)\\right)} = \\sigma\\!\\left(\\sum_t \\hat{r}(\\sigma^1) - \\sum_t \\hat{r}(\\sigma^2)\\right)",
      "explanation": "假定人类偏爱片段 σ¹ 胜过 σ² 的概率是两段轨迹潜在奖励总和之差的 Logistic Sigmoid 函数——这一方程后来被原封不动搬进了 InstructGPT 与 LLaMA 的 Reward Model 训练中！",
      "variables": [
        {
          "symbol": "\\sigma^1, \\sigma^2",
          "desc": "待比较的两个候选行为片段或大模型生成回复 (y_w, y_l)"
        },
        {
          "symbol": "\\hat{r}(o_t, a_t)",
          "desc": "待学习的深度神经网络奖励模型输出标量"
        }
      ]
    },
    {
      "id": "rlhf-f2",
      "name": "奖励模型二元交叉熵损失函数",
      "category": "奖励学习目标",
      "formula": "\\mathcal{L}(\\hat{r}) = -\\sum_{(\\sigma^1, \\sigma^2, \\mu) \\in \\mathcal{D}} \\Big[ \\mu(1)\\log \\hat{P}[\\sigma^1 \\succ \\sigma^2] + \\mu(2)\\log \\hat{P}[\\sigma^2 \\succ \\sigma^1] \\Big]",
      "explanation": "通过最大化人类偏好标注的对数似然，将隐式的、不可编程的人类直觉蒸馏为可微分的神经网络打分器。",
      "variables": [
        {
          "symbol": "\\mu \\in \\{(1,0), (0,1), (0.5,0.5)\\}",
          "desc": "人类标注员给出的偏好分布（偏爱第一个、偏爱第二个或平局）"
        },
        {
          "symbol": "\\mathcal{D}",
          "desc": "持续随策略演化动态扩充的人类偏好比较数据集"
        }
      ]
    }
  ],
  "metricCards": [
    {
      "label": "人类反馈时间缩减",
      "value": "99.9% 缩减 (< 1小时)",
      "desc": "相比让人类直接逐帧标注数千小时，仅需 900 次点击即可收敛",
      "color": "emerald"
    },
    {
      "label": "无法编码任务突破",
      "value": "机器人完美后空翻",
      "desc": "无需编写任何物理角度公式，纯靠人类二选一点击学会高难特技",
      "color": "cyan"
    },
    {
      "label": "成对比较稳定性",
      "value": "零标度漂移 (Scale-Free)",
      "desc": "二选一相对排序彻底消除了不同标注员打分尺度不一致的噪音",
      "color": "amber"
    },
    {
      "label": "历史传承地位",
      "value": "ChatGPT / Claude 之母",
      "desc": "作者团队随后将完全相同的框架迁移至 GPT-3 从而诞生 InstructGPT 与 ChatGPT",
      "color": "purple"
    }
  ],
  "experimentSections": [
    {
      "title": "MuJoCo 连续控制与 Atari 游戏中 RLHF 偏好学习与真实环境奖励对比",
      "description": "验证仅靠几百至几千次非专家人类二选一点击，智能体能否追平甚至超越直接访问真实环境得分的强化学习基线。",
      "headers": [
        "训练信号来源",
        "所需人工标注量",
        "复杂隐式目标表达力",
        "MuJoCo Hopper / Backflip 表现 (↑)"
      ],
      "rows": [
        [
          "手工硬编码代理奖励 (Hand-crafted Proxy)",
          "需专家反复调试公式",
          "差 (极易触发 Reward Hacking 作弊)",
          "频繁翻车或学会畸形跳跃骗分"
        ],
        [
          "人类直接打绝对分数 (Scalar Rating)",
          "2,000+ 次打分",
          "中 (不同时段打分标准严重漂移)",
          "收敛震荡，得分仅为基线 60%"
        ],
        [
          "合成完美奖励 (Oracle True Reward)",
          "0 (仅限有明确分数的游戏)",
          "无法用于后空翻或开放式对话",
          "100% 基准分"
        ],
        [
          "RLHF 成对偏好学习 (本文方案)",
          "700 ~ 1,400 次快速二选一",
          "极强 (所见即所得对齐人类审美)",
          "追平甚至超越真实奖励，完美学会后空翻!"
        ]
      ]
    }
  ],
  "insights": [
    {
      "title": "为什么「在线迭代收集人类偏好（Online RLHF）」至关重要，而不能只用初始离线数据？",
      "content": "论文发现：如果只在初始随机策略上收集一次人类偏好并固定奖励模型 r̂，那么随着 RL 策略不断优化，策略很快会探索到奖励模型没见过的分布外区域（OOD），找到一个「r̂ 打分极高但实际上是垃圾动作」的对抗漏洞（Reward Overoptimization）。必须持续对最新策略的产出追加偏好标注才能堵死漏洞！"
    },
    {
      "title": "从 MuJoCo 机器人后空翻到 ChatGPT 对齐的惊人跨越",
      "content": "仔细观察本文作者名单：Paul Christiano、Jan Leike（后任 OpenAI 超级对齐负责人）、Tom Brown（GPT-3 一作）、Dario Amodei（后创立 Anthropic 并推出 Claude）。他们在这篇 2017 年论文里发明的 Bradley-Terry 损失函数与三阶段流水线，几乎一字未改地成为了 5 年后引爆全球的 ChatGPT 核心配方！"
    }
  ],
  "takeaways": [
    {
      "icon": "ThumbsUp",
      "title": "判卷永远比出题容易",
      "desc": "人类很难写出好回答的数学方程，但人类能在 1 秒内选出两个回答里哪一个更好。"
    },
    {
      "icon": "Scale",
      "title": "Bradley-Terry 成对损失",
      "desc": "log σ(r(y_w) - r(y_l)) 这一行简洁公式撑起了整个现代大模型价值观对齐大厦。"
    },
    {
      "icon": "AlertTriangle",
      "title": "警惕 Reward Hacking",
      "desc": "任何固定的代理奖励模型被 RL 过度优化都会走向崩溃，必须加正则约束或在线迭代更新。"
    },
    {
      "icon": "Sparkles",
      "title": "对齐时代的创世纪论文",
      "desc": "把强化学习从「刷电子游戏分数」解放出来，真正走向「对齐人类主观意图」。"
    }
  ]
};

export const PAPER_DATA: UniversalPaperData = RLHF_2017_DATA;
export default PAPER_DATA;
