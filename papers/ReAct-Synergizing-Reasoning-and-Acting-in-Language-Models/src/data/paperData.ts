import { UniversalPaperData } from "../../../../src/shared/types/universalPaper.js";

export const REACT_2022_DATA: UniversalPaperData = {
  "id": "react-2022",
  "title": "ReAct: Synergizing Reasoning and Acting in Language Models",
  "chineseTitle": "ReAct 智能体奠基论文：在大语言模型中协同交织「思维链推理」与「外部环境行动」",
  "subtitle": "Shunyu Yao (姚顺雨), Jeffrey Zhao, Dian Yu, Nan Du, Izhak Shafran, Karthik Narasimhan, Yuan Cao • Princeton University & Google Research • ICLR 2023",
  "tags": [
    "ReAct Agent 范式",
    "Thought-Action-Observation 循环",
    "消除 CoT 事实幻觉",
    "工具调用 Tool Use 基石",
    "LangChain / 现代智能体鼻祖"
  ],
  "arxivId": "2210.03629",
  "pdfUrl": "https://arxiv.org/pdf/2210.03629.pdf",
  "abstractUrl": "https://arxiv.org/abs/2210.03629",
  "summary": "现代所有大模型智能体（AI Agents）、工具调用（Function Calling / Tool Use）以及 LangChain/AutoGPT 框架的绝对开山鼻祖！此前学界分裂为两条互不相通的路线：一派是「纯推理（如 Chain-of-Thought 思维链）」，模型只在脑子里闭门造车，一旦某一步记忆模糊就会引发连锁事实幻觉（Hallucination）；另一派是「纯行动（如 WebGPT/SayCan 动作生成）」，模型机械输出动作指令却缺乏高层目标规划与异常恢复能力。姚顺雨等提出极其优雅的 ReAct (Reason + Act) 范式，将模型的动作空间扩充为 `Â = A ∪ L`（外部动作空间 + 内部自然语言思考空间），通过交织执行的 「Thought（思考规划） → Action（调用外部工具/API） → Observation（环境真实反馈） → Thought（修正计划）」 闭环，让推理指导行动、让行动验证并修正推理！",
  "keyContributions": [
    "洞察人类智能的本质是「内心独白（Inner Speech 推理规划）」与「外部实践（Acting 获取新知）」的紧密交织，首次在 LLM 中打通两者边界",
    "形式化定义扩充动作空间 Â = A ∪ L：当选择内部思考 c_t ∈ L 时不改变外部环境状态，仅将目标拆解、工作记忆与反思追加进上下文；当选择 a_t ∈ A 时触发外部 API 并接收真实 Observation o_t",
    "在知识密集型多跳问答（HotpotQA）与事实验证（FEVER）上，证明 ReAct 通过实时检索彻底消除了 CoT 高达 56% 的内部幻觉，且结合 CoT-SC 创下全新 SOTA",
    "在交互式决策环境（ALFWorld 家居具身任务与 WebShop 在线购物）中，仅凭 1~6 个上下文示例即比百倍样本训练的模仿学习/强化学习基线绝对成功率暴涨 34% 与 10%！"
  ],
  "coreProblem": "纯思维链（CoT）推理是一个与外部世界完全隔离的「开环静态黑盒」：它只能依赖预训练冻结的参数记忆，一旦遇到冷门事实或时效性信息就会一本正经地编造假事实，且一步算错步步错；而纯动作模型没有显式的中间子目标拆解，遇到搜索无结果时只能在原地死循环。",
  "coreIdea": "不要让大模型一口气在脑子里瞎猜到底，也不要让它盲目乱点工具！规定模型严格按照 `Thought -> Action -> Observation` 的节拍交替运行：先写一句 `Thought` 把大问题拆解成当前需要查证的小问题，再发出一道 `Action[Search/Lookup]` 去真实世界拿回 `Observation`，接着根据拿回的真实证据写下一句 `Thought` 决定下一步怎么走！",
  "simulatorTitle": "ReAct (Thought → Action → Observation) 智能体循环与幻觉抑制实验台",
  "simulatorDesc": "交互式切换 CoT (纯内部推理)、Act-Only (纯动作) 与 ReAct / ReAct+CoT-SC 模式，实时对比多跳工具调用轨迹、幻觉率与任务成功率。",
  "architectureSteps": [
    {
      "id": "react-step-1",
      "title": "1. 内部思考规划 (Thought t: 拆解与反思)",
      "subtitle": "Internal Reasoning Trace (c_t ∈ L)",
      "description": "面对复杂多跳任务，模型首先在语言空间 L 中生成显式 Thought：拆解子目标、提取已知线索、分析上一步失败原因并制定下一步工具调用计划。",
      "highlightColor": "emerald"
    },
    {
      "id": "react-step-2",
      "title": "2. 外部环境行动 (Action t: 工具与API调用)",
      "subtitle": "External Tool Execution (a_t ∈ A)",
      "description": "基于当前 Thought 决策，模型从外部动作集 A 中发射精确结构化指令（如 Search[实体]、Lookup[关键词]、Click[按钮] 或 Finish[答案]）。",
      "highlightColor": "cyan"
    },
    {
      "id": "react-step-3",
      "title": "3. 环境真实反馈注入 (Observation t)",
      "subtitle": "Grounding via Environment Observation (o_t)",
      "description": "外部搜索引擎、数据库、代码解释器或网页环境执行 Action 后，将真实客观返回结果 o_t 追加至上下文轨迹 c_{t+1} = (c_t, a_t, o_t)，用外部事实锚定认知。",
      "highlightColor": "amber"
    },
    {
      "id": "react-step-4",
      "title": "4. 闭环自适应纠偏与混合回退 (ReAct ↔ CoT-SC)",
      "subtitle": "Adaptive Plan Revision & Hybrid Fallback",
      "description": "若 Observation 返回空或与预期不符，下一轮 Thought 立即调整搜索词重试；若超出步数或内部常识已足够，则动态平滑切换至 CoT 自洽投票（ReAct + CoT-SC）。",
      "highlightColor": "purple"
    }
  ],
  "formulas": [
    {
      "id": "react-f1",
      "name": "ReAct 增广动作空间与上下文马尔可夫决策方程",
      "category": "智能体形式化建模",
      "formula": "\\hat{\\mathcal{A}} = \\mathcal{A} \\cup \\mathcal{L}, \\qquad \\pi(\\hat{a}_t \\mid c_t), \\qquad c_{t+1} = \\begin{cases} (c_t, \\hat{a}_t) & \\text{if } \\hat{a}_t \\in \\mathcal{L} \\;(\\text{Internal Thought}) \\\\ (c_t, \\hat{a}_t, o_t) & \\text{if } \\hat{a}_t \\in \\mathcal{A} \\;(\\text{External Action } \\to o_t) \\end{cases}",
      "explanation": "将无限维的自然语言思考空间 L 并入离散动作空间 A：思考动作不触发外部环境状态转移，但更新智能体的内部上下文信念状态 c_{t+1}，从而架起推理与行动的桥梁。",
      "variables": [
        {
          "symbol": "\\mathcal{A}, \\mathcal{L}",
          "desc": "外部环境可执行API动作空间与内部自由文本思考空间"
        },
        {
          "symbol": "c_t = (o_1, \\hat{a}_1, \\dots, o_t)",
          "desc": "截至时间步 t 包含全部历史思考、动作与观测的完整上下文轨迹"
        }
      ]
    },
    {
      "id": "react-f2",
      "name": "多跳推理链条抗幻觉成功概率对比模型",
      "category": "事实锚定与容错",
      "formula": "P_{\\text{Success}}^{\\text{CoT}}(H) = \\prod_{h=1}^{H} (1 - p_{\\text{halluc}, h}), \\qquad P_{\\text{Success}}^{\\text{ReAct}}(H) = \\prod_{h=1}^{H} \\Big( 1 - p_{\\text{retrieve\\_fail}, h}^{R} \\Big)",
      "explanation": "纯 CoT 在 H 跳推理中只要任意一跳发生内部记忆幻觉就会全盘皆输；而 ReAct 通过外部检索提供事实锚定，且允许在单跳检索未命中时根据 Observation 改写关键词重试 R 次！",
      "variables": [
        {
          "symbol": "H",
          "desc": "复杂问题所需的推理与查证跳数（Hops）"
        },
        {
          "symbol": "p_{\\text{halluc}}",
          "desc": "纯内部推理单步发生事实捏造的概率（论文实测 CoT 失败案例中 56% 源于幻觉）"
        },
        {
          "symbol": "R",
          "desc": "ReAct 根据 Observation 反馈动态修正查询的最大重试次数"
        }
      ]
    }
  ],
  "metricCards": [
    {
      "label": "ALFWorld 具身决策成功率",
      "value": "71.0% (+34% 绝对提升)",
      "desc": "远超 Act-Only (45%) 与 10³ 样本训练的强化学习 BUTLER (37%)",
      "color": "emerald"
    },
    {
      "label": "推理失败中的事实幻觉率",
      "value": "56% (CoT) ➔ 0% (ReAct)",
      "desc": "所有推理依据均严格锚定于外部 Observation 返回的真实文本",
      "color": "cyan"
    },
    {
      "label": "WebShop 真实网购成功率",
      "value": "40.0% (超人类专家 10% 差距内)",
      "desc": "比模仿学习 + 强化学习基线 (29.0%) 暴涨 11 个百分点",
      "color": "amber"
    },
    {
      "label": "人类可解释性与可控性",
      "value": "支持实时编辑 Thought 干预",
      "desc": "人类只需修改一行中间 Thought 文本即可瞬间扭转智能体行为轨迹",
      "color": "purple"
    }
  ],
  "experimentSections": [
    {
      "title": "知识密集推理 (HotpotQA / FEVER) 与交互式环境 (ALFWorld / WebShop) 全景对比 (PaLM-540B)",
      "description": "验证单靠内部推理 (CoT) 缺外部知识、单靠外部动作 (Act) 缺规划能力，唯有 ReAct 协同两者实现全面突破。",
      "headers": [
        "方法范式",
        "内部推理 / 外部交互",
        "HotpotQA EM / FEVER 准确率 (↑)",
        "ALFWorld / WebShop 任务成功率 (↑)"
      ],
      "rows": [
        [
          "Standard / Act-Only (纯动作无思考)",
          "无 Thought • 有 Action",
          "25.7% / 58.9% (盲目检索缺乏拆解)",
          "45.0% / 30.1% (极易陷入重复动作死循环)"
        ],
        [
          "Chain-of-Thought (CoT 纯内部推理)",
          "有 Thought • 无外部交互",
          "29.4% / 56.3% (56% 错误源于编造事实幻觉)",
          "无法在交互环境中执行动作 (0%)"
        ],
        [
          "ReAct 独立运行 (Thought+Act+Obs)",
          "推理与行动交织闭环",
          "27.4% / 60.9% (彻底消除内部捏造幻觉)",
          "71.0% (+26%) / 40.0% (+10% 大幅夺冠!)"
        ],
        [
          "ReAct ↔ CoT-SC 协同组合 (本文旗舰)",
          "内外知识动态互补互备",
          "35.1% / 64.6% (全面刷新 SOTA!)",
          "71.0% / 40.0% (开启现代 Agent 纪元)"
        ]
      ]
    }
  ],
  "insights": [
    {
      "title": "为什么在 HotpotQA 上把 ReAct 和 CoT-SC（自洽思维链）动态结合能取得最佳效果？",
      "content": "论文通过细粒度错题剖析发现了一个极其深刻的互补规律：CoT 擅长调动模型预训练内部庞大的常识与灵活句式，但容易在具体事实上产生 56% 的幻觉；而 ReAct 虽然事实 100% 准确（0% 幻觉），但有时会被呆板的维基百科搜索框卡住（23% 搜索无果）。因此「先让 ReAct 查证事实，若限定步数内未搜到则回退给 CoT-SC；或者当 CoT-SC 多路径投票分歧大时启动 ReAct 查证」完美结合了内部常识与外部真知！"
    },
    {
      "title": "从 ReAct Prompt 模板到原生 Function Calling 与 Agentic RL 的演进",
      "content": "2022 年底 ReAct 发表时，大家靠 Few-Shot Prompt 让模型输出 `Thought: ... Action: ...` 字符串再用正则解析；而由于这一范式实在太强大，OpenAI、Anthropic 与开源社区迅速将 ReAct 循环直接训练进大模型的原生 `tool_calls` 协议乃至 DeepSeek-R1 / OpenAI o3 的多步 Agentic 强化学习中！"
    }
  ],
  "takeaways": [
    {
      "icon": "RefreshCw",
      "title": "Thought → Action → Observation",
      "desc": "这三个单词组成的黄金节拍器，定义了迄今为止地球上几乎所有 AI Agent 框架的底层循环。"
    },
    {
      "icon": "Compass",
      "title": "推理指导行动，行动锚定推理",
      "desc": "没有推理的行动是无头苍蝇，没有外部行动检验的推理是空中楼阁。"
    },
    {
      "icon": "ShieldCheck",
      "title": "终结思维链闭门造车幻觉",
      "desc": "把每一步推导建立在外部环境返回的真实 Observation 之上，让多跳问答有据可查。"
    },
    {
      "icon": "Sliders",
      "title": "白盒可干预的决策黑匣子",
      "desc": "每一拍的内部思考全部显式打印出来，开发者随时能看懂甚至在半路修改智能体的想法。"
    }
  ]
};

export const PAPER_DATA: UniversalPaperData = REACT_2022_DATA;
export default PAPER_DATA;
