import { UniversalPaperData } from "../../../../src/shared/types/universalPaper.js";

export const SPECULATIVE_DECODING_2022_DATA: UniversalPaperData = {
  "id": "speculative-decoding-2022",
  "title": "Fast Inference from Transformers via Speculative Decoding",
  "chineseTitle": "Speculative Decoding 投机采样：以小模型草稿与大模型并行校验实现无损推理加速",
  "subtitle": "Yaniv Leviathan, Matan Kalman, Yossi Matias • Google Research (同期独立发表: Charlie Chen et al. DeepMind) • ICML 2023",
  "tags": [
    "Speculative Decoding 投机采样",
    "Draft-then-Verify 草稿加并行验证",
    "修正拒绝采样 Modified Rejection Sampling",
    "100% 分布无损",
    "突破访存带宽墙"
  ],
  "arxivId": "2211.17192",
  "pdfUrl": "https://arxiv.org/pdf/2211.17192.pdf",
  "abstractUrl": "https://arxiv.org/abs/2211.17192",
  "summary": "打破自回归大模型「一次前向传播只能吐出 1 个 Token」串行铁律的传奇算法！作者洞察到两个核心事实：(1) 自然语言中大量词元（如冠词、标点、固定搭配、代码缩进）极其简单，根本不需要动用百亿大模型；(2) 大模型单步推理受限于显存带宽（Memory-bound），并行验证 γ+1 个 Token 的耗时与只生成 1 个 Token 几乎完全相同！投机采样（Speculative Decoding）让一个极快的轻量草稿模型（Draft Model M_q）先连续猜出 γ 个候选词，再交给目标大模型（Target Model M_p）在【单次前向传播】中并行算出所有位置的概率分布，最后通过精妙的「修正拒绝采样（Modified Rejection Sampling）」一次性接受前缀并采样修正词。不仅实现 2x~3x 延迟降低，更在数学上严格证明输出分布与目标大模型单独采样【100% 恒等无损】！",
  "keyContributions": [
    "洞察自回归解码的硬件带宽闲置悖论：单次前向传播并行校验 γ=5 个 Token 的耗时几乎等于生成 1 个 Token 的耗时",
    "构建「小模型串行打草稿（Draft γ steps）+ 大模型单步并行打分（Parallel Verify in 1 step）」的协同推理流水线",
    "发明「修正拒绝采样（Modified Rejection Sampling）」：以 min(1, p(x)/q(x)) 概率接受草稿，一旦拒绝则从残差分布 norm(max(0, p - q)) 中重采样，保证每轮至少推进 1 个且最多推进 γ+1 个 Token",
    "给出严密的数学定理证明：无论草稿模型多差、无论温度 T 如何设置，最终生成的 Token 序列概率分布与纯目标大模型 M_p 完全恒等（Exact Distribution Preservation）"
  ],
  "coreProblem": "自回归大模型生成 K 个 Token 必须串行执行 K 次完整的前向传播，每次都要把数百 GB 的模型权重从 HBM 读进计算核心一次，算术强度极低（Arithmetic Intensity ≈ 1），90% 的算力在空等显存带宽，导致单用户流式输出速度缓慢。",
  "coreIdea": "借鉴 CPU 硬件的「分支预测（Branch Prediction）」！先派一个体积小 10~20 倍的小模型（或 Medusa/MTP 预测头）快速往前连猜 γ 个词作为草稿；然后把这 γ 个词拼在一起喂给大模型做【一次】前向传播，同时拿到大模型在这 γ+1 个位置上的真实概率分布。凡是小模型猜对的直接批量放行，猜错的第一个位置用大模型分布当场纠正（白赚一个修正词）！",
  "simulatorTitle": "Speculative Decoding 投机采样加速比与接受率 α 推演实验台",
  "simulatorDesc": "交互式调节草稿步长 γ (1~10)、草稿接受率 α (0.4~0.95) 与小/大模型耗时比 c，实时计算期望每步生成词数与真实墙钟加速比。",
  "architectureSteps": [
    {
      "id": "spec-step-1",
      "title": "1. 轻量模型快速自回归打草稿",
      "subtitle": "Fast Autoregressive Drafting (γ Tokens)",
      "description": "利用参数量仅为主模型 1/10~1/20 的草稿模型 M_q，从当前上下文出发快速连续采样 γ 个候选 Token x̃_1, ..., x̃_γ 及其条件概率 q_1(x), ..., q_γ(x)。",
      "highlightColor": "emerald"
    },
    {
      "id": "spec-step-2",
      "title": "2. 目标大模型单次前向并行评估",
      "subtitle": "Single-Pass Target Parallel Scoring",
      "description": "将原始前缀与 γ 个草稿词拼接后一次性输入目标大模型 M_p，利用因果掩码在单次前向传播中同时算出全部 γ+1 个位置的真实分布 p_1(x), ..., p_{γ+1}(x)。",
      "highlightColor": "cyan"
    },
    {
      "id": "spec-step-3",
      "title": "3. 顺序拒绝采样校验 min(1, p/q)",
      "subtitle": "Sequential Rejection Sampling Check",
      "description": "从 i=1 到 γ 依次生成均匀随机数 r_i ~ U(0,1)：若 r_i < p_i(x̃_i)/q_i(x̃_i) 则接受草稿词 x̃_i；一旦在某位置 k 拒绝，立即丢弃后续草稿并跳至修正步。",
      "highlightColor": "amber"
    },
    {
      "id": "spec-step-4",
      "title": "4. 残差分布重采样或奖励第 γ+1 词",
      "subtitle": "Residual Resampling or Bonus Token",
      "description": "若在位置 k 被拒，从修正残差分布 p'(x) = norm(max(0, p_k(x) - q_k(x))) 采样一个正确词替补；若 γ 个草稿全部通过，则直接从 p_{γ+1}(x) 额外免费采样第 γ+1 个奖励词！",
      "highlightColor": "purple"
    }
  ],
  "formulas": [
    {
      "id": "spec-f1",
      "name": "修正拒绝采样接受准则与残差重采样分布",
      "category": "无损分布校验",
      "formula": "P(\\text{Accept } \\tilde{x}_i) = \\min\\!\\left(1, \\frac{p_i(\\tilde{x}_i)}{q_i(\\tilde{x}_i)}\\right), \\qquad p'_i(x) = \\frac{\\max(0,\\; p_i(x) - q_i(x))}{\\sum_{x'} \\max(0,\\; p_i(x') - q_i(x'))}",
      "explanation": "因为 P(输出=x) = q(x)·min(1, p(x)/q(x)) + (1-α)·p'(x) = min(p(x), q(x)) + max(0, p(x)-q(x)) = p(x)，严格证明最终采样分布恒等于目标大模型 p(x)！",
      "variables": [
        {
          "symbol": "p_i(x), q_i(x)",
          "desc": "目标大模型与草稿小模型在第 i 步输出的概率分布"
        },
        {
          "symbol": "p'_i(x)",
          "desc": "草稿被拒绝时用于补偿概率差额的修正残差分布"
        }
      ]
    },
    {
      "id": "spec-f2",
      "name": "单轮投机期望生成 Token 数与端到端加速比定理",
      "category": "期望加速比公式",
      "formula": "\\mathbb{E}[\\text{Tokens / step}] = \\frac{1 - \\alpha^{\\gamma+1}}{1 - \\alpha}, \\qquad \\text{Speedup}(\\gamma, \\alpha, c) = \\frac{1 - \\alpha^{\\gamma+1}}{(1 - \\alpha)(\\gamma c + 1)}",
      "explanation": "当草稿接受率 α = 0.8、步长 γ = 5、草稿耗时比 c = 0.05 时，单次大模型前向平均可产出 3.69 个 Token，实现近 3 倍真实加速！",
      "variables": [
        {
          "symbol": "\\alpha",
          "desc": "草稿 Token 的平均期望接受率 E[min(1, p/q)] = 1 - D_TV(p, q)"
        },
        {
          "symbol": "\\gamma",
          "desc": "每轮草稿模型超前猜测的步数（通常取 4 ~ 7）"
        },
        {
          "symbol": "c",
          "desc": "草稿模型单步耗时与目标大模型单步耗时的比值 (T_draft / T_target)"
        }
      ]
    }
  ],
  "metricCards": [
    {
      "label": "端到端生成速度提升",
      "value": "2.0x ~ 3.4x 倍加速",
      "desc": "T5-XXL (11B) 与 Chinchilla (70B) 实测降低 50%~70% 生成延迟",
      "color": "emerald"
    },
    {
      "label": "输出概率分布保真度",
      "value": "100.0% 数学恒等无损",
      "desc": "非近似算法！无论是贪婪解码还是温度采样均与原模型完全一致",
      "color": "cyan"
    },
    {
      "label": "目标大模型权重重训需求",
      "value": "0 (即插即用)",
      "desc": "无需修改或重训主模型，任意共享词表的小模型均可充当草稿器",
      "color": "amber"
    },
    {
      "label": "单轮最大推进 Token 数",
      "value": "γ + 1 个 Tokens",
      "desc": "全中时额外奉送第 γ+1 个 Bonus Token，保底至少产出 1 个 Token",
      "color": "purple"
    }
  ],
  "experimentSections": [
    {
      "title": "T5-XXL (11B) 与 Chinchilla (70B) 在翻译、摘要与代码生成上的投机采样加速实测",
      "description": "使用 T5-Small (60M) 作为 T5-XXL (11B) 的草稿模型（c ≈ 0.04），测试不同任务与采样温度下的接受率 α 与墙钟加速比。",
      "headers": [
        "任务与解码设置",
        "草稿模型配置 (γ=5)",
        "平均草稿接受率 α",
        "端到端墙钟加速比 (↑)"
      ],
      "rows": [
        [
          "标准自回归解码 (Baseline)",
          "无草稿 (每次 1 Token)",
          "—",
          "1.00x (基准延迟)"
        ],
        [
          "WMT 英德翻译 (Temp = 1.0 随机采样)",
          "T5-Small (60M, γ=5)",
          "α = 0.75 (每轮 3.1 词)",
          "2.60x 提速"
        ],
        [
          "WMT 英德翻译 (Temp = 0.0 贪婪解码)",
          "T5-Small (60M, γ=5)",
          "α = 0.82 (每轮 3.5 词)",
          "3.10x 提速"
        ],
        [
          "HumanEval 代码生成 (Chinchilla 70B + 4B 草稿)",
          "4B Draft (γ=7)",
          "α = 0.86 (代码结构高度可预测)",
          "3.40x 提速 (SOTA)"
        ]
      ]
    }
  ],
  "insights": [
    {
      "title": "为什么在随机温度采样（Temp > 0）下，投机采样依然能保持 100% 分布无损？",
      "content": "如果是贪婪解码（Temp=0），只需检查 argmax(p) == argmax(q) 即可；但对于随机采样，直接接受小模型采样会偏向 q(x)。论文设计的 min(1, p/q) 削峰填谷机制刚好把 q(x) > p(x) 的多出部分按比例拒绝，再通过残差分布 max(0, p-q) 精准补齐 p(x) > q(x) 的缺口，两项相加严丝合缝等于 p(x)！"
    },
    {
      "title": "从独立小模型草稿到 Medusa / EAGLE / DeepSeek-V3 MTP（多 Token 预测）",
      "content": "部署两个独立模型有时工程较重，因此工业界迅速基于本文演化出「自投机（Self-Speculative）」流派：如 Medusa、EAGLE 以及 DeepSeek-V3 在预训练时直接内置的 Multi-Token Prediction (MTP) 头，用主模型自己的最后一层特征直接预测未来 2~4 个草稿词！"
    }
  ],
  "takeaways": [
    {
      "icon": "FastForward",
      "title": "用过剩算力换取稀缺带宽",
      "desc": "大模型推理不缺算力缺带宽，一次加载权重顺带并行验 5 个词几乎零额外耗时。"
    },
    {
      "icon": "CheckCircle2",
      "title": "零精度妥协的免费午餐",
      "desc": "不同于量化或剪枝会略微掉点，投机采样在数学上与原模型输出分布 100% 恒等。"
    },
    {
      "icon": "Code",
      "title": "代码与结构化输出加速神器",
      "desc": "在代码补全、JSON 生成与 RAG 引用等高确定性场景下，接受率 α 常超 85%，提速超 3 倍。"
    },
    {
      "icon": "Layers",
      "title": "启发 MTP 多词预测预训练",
      "desc": "直接推动了 DeepSeek-V3 等新一代旗舰模型将多 Token 预测头内置为原生架构。"
    }
  ]
};

export const PAPER_DATA: UniversalPaperData = SPECULATIVE_DECODING_2022_DATA;
export default PAPER_DATA;
