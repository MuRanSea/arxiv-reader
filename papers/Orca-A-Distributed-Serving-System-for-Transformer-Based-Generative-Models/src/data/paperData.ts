import { UniversalPaperData } from "../../../../src/shared/types/universalPaper.js";

export const ORCA_2022_DATA: UniversalPaperData = {
  "id": "orca-2022",
  "title": "Orca: A Distributed Serving System for Transformer-Based Generative Models",
  "chineseTitle": "Orca 连续批处理：开创按迭代调度的现代大模型高吞吐推理引擎范式",
  "subtitle": "Gyeong-In Yu, Joo Seong Jeong, Geon-Woo Kim, Soojeong Kim, Byung-Gon Chun • Seoul National University & FriendliAI • OSDI 2022",
  "tags": [
    "Orca",
    "Iteration-Level Scheduling 按迭代调度",
    "Continuous Batching 连续批处理",
    "Selective Batching 选择性批处理",
    "36.9x 吞吐飞跃"
  ],
  "arxivId": "OSDI 2022 (ATC/OSDI)",
  "pdfUrl": "https://www.usenix.org/system/files/osdi22-yu.pdf",
  "abstractUrl": "https://www.usenix.org/conference/osdi22/presentation/yu",
  "summary": "现代所有大模型推理服务框架（vLLM、TensorRT-LLM、TGI、SGLang）调度器的开山鼻祖！传统深度学习服务系统（如 NVIDIA Triton + FasterTransformer）采用「按整段请求调度（Request-Level Static Batching）」：同一 Batch 内的所有请求必须同时开始，且哪怕某条短回复早已生成出 [EOS] 结束符，也必须原地空转陪跑（Padding），直到 Batch 内最长的那条请求生成完毕才能释放 GPU 并接入新请求。Orca 首创「按迭代调度（Iteration-Level Scheduling / Continuous Batching）」与「选择性批处理（Selective Batching）」，在每次单步自回归迭代（生成 1 个 Token）后立即剔除已完成请求并无缝插入新请求，在 GPT-3 175B 上于相同延迟约束下实现了高达 36.9 倍的惊人吞吐量飞跃！",
  "keyContributions": [
    "揭示静态请求级批处理（Static Batching）在自回归生成中的三大浪费：早退请求空转陪跑、新到请求排队饥饿、Prefill 与 Decode 长度异构无法合批",
    "首创「按迭代调度（Iteration-Level Scheduling / 工业界通称 Continuous Batching）」，将调度粒度从「整次请求」细化到「每一次前向单步迭代」",
    "提出「选择性批处理（Selective Batching）」：对与序列长度无关的 Linear/FFN 层将所有请求拍扁为 [Σ N_i, d] 矩阵统一批处理，仅对 Attention 层按各自 KV Cache 独立执行",
    "在 175B GPT-3 模型分布式服务评测中，于相同尾延迟（Latency）下取得 FasterTransformer 36.9 倍的吞吐量提升"
  ],
  "coreProblem": "自回归大模型的输出长度事先未知且差异悬殊（有的请求回复 10 个词，有的回复 1000 个词）。在静态批处理下，短请求完成后 GPU 算力全部浪费在无效填充符（Padding）上，而队列外的新请求却必须苦苦等待整个 Batch 最慢的那条请求跑完，导致 GPU 利用率不足 10%。",
  "coreIdea": "打破「同进同出」的静态批次枷锁！调度器在模型每跑完【一步前向迭代（生成 1 个 Token）】后就介入检查：凡是刚刚吐出 [EOS] 的请求立刻移出运行池并向用户返回结果；空出来的槽位当场从等待队列拉取新请求（执行 Prefill）顶替上来，让 GPU 在每一个时钟周期都处于满载有效计算状态！",
  "simulatorTitle": "Orca 连续批处理 (Continuous Batching) vs 静态批处理调度实验台",
  "simulatorDesc": "调节并发请求长度方差、Batch 大小与到达率，实时对比 Static Batching 与 Orca Iteration-Level Scheduling 的气泡浪费率与吞吐加速比。",
  "architectureSteps": [
    {
      "id": "orca-step-1",
      "title": "1. 单步迭代粒度调度循环",
      "subtitle": "Iteration-Level Scheduling Loop",
      "description": "引擎每次仅下发「执行 1 步 Transformer 前向迭代」的指令；每步结束后检查各请求输出 Token，遇到 [EOS] 立即归还槽位，新请求零等待动态插入。",
      "highlightColor": "emerald"
    },
    {
      "id": "orca-step-2",
      "title": "2. 消除异构序列拼接障碍",
      "subtitle": "Decoupling Prefill & Decode Lengths",
      "description": "动态加入的新请求处于 Prefill 阶段（含数百个输入 Token），而老请求处于 Decode 阶段（仅 1 个新 Token），两者张量形状不同，传统 Batch 乘法无法合并。",
      "highlightColor": "cyan"
    },
    {
      "id": "orca-step-3",
      "title": "3. 选择性批处理 (Selective Batching)",
      "subtitle": "Token-Level Flattening for Linear/MLP",
      "description": "对占算力 80% 以上的 QKV 投影与 FFN 线性层，忽略请求边界，把所有请求的活跃 Token 拼接成二维矩阵 [Σ L_i, d_model] 一次性喂入 Tensor Core 满载运算！",
      "highlightColor": "amber"
    },
    {
      "id": "orca-step-4",
      "title": "4. 注意力层按请求独立分发与重汇合",
      "subtitle": "Split Attention & Re-merge Pipeline",
      "description": "仅在进入 Attention 算子时按请求拆分，各自读取专属的历史 KV Cache 计算上下文注意力，算完后立即重新拼回统一 Token 矩阵进入后续层。",
      "highlightColor": "purple"
    }
  ],
  "formulas": [
    {
      "id": "orca-f1",
      "name": "静态批处理有效算力利用率与填充气泡率公式",
      "category": "调度效率建模",
      "formula": "\\eta_{\\text{Static}} = \\frac{\\sum_{i=1}^{B} T_i}{B \\cdot \\max_{1 \\le i \\le B} T_i}, \\qquad \\text{Bubble Waste} = 1 - \\eta_{\\text{Static}}",
      "explanation": "当一个 Batch 中最长生成长度 max(T_i) 远大于平均生成长度 E[T_i] 时，静态批处理高达 60%~85% 的算力都被浪费在等待与空白填充上。",
      "variables": [
        {
          "symbol": "T_i",
          "desc": "Batch 内第 i 条请求的实际生成 Token 长度"
        },
        {
          "symbol": "\\max T_i",
          "desc": "决定整个静态批次何时能释放的木桶最慢短板长度"
        }
      ]
    },
    {
      "id": "orca-f2",
      "name": "选择性批处理（Selective Batching）二维词元拼接算子",
      "category": "算子融合方程",
      "formula": "\\mathbf{X}_{\\text{flat}} = \\text{Concat}(\\mathbf{X}_1, \\mathbf{X}_2, \\dots, \\mathbf{X}_B) \\in \\mathbb{R}^{(\\sum_{i=1}^B L_i) \\times d}, \\quad \\mathbf{Y}_{\\text{flat}} = \\mathbf{X}_{\\text{flat}} \\mathbf{W}_{\\text{Linear}}",
      "explanation": "无论是处理 512 词的 Prefill 请求还是 1 词的 Decode 请求，在线性层全部展平为统一 Token 流共享同一次权重读取，彻底跑满显存带宽。",
      "variables": [
        {
          "symbol": "L_i",
          "desc": "第 i 条请求在当前迭代步参与计算的活跃 Token 数（Prefill 为 prompt 长度，Decode 为 1）"
        },
        {
          "symbol": "\\mathbf{W}_{\\text{Linear}}",
          "desc": "全批次共享读取一次的模型线性层/MLP 权重矩阵"
        }
      ]
    }
  ],
  "metricCards": [
    {
      "label": "GPT-3 175B 吞吐量提升",
      "value": "36.9x 倍 (同延迟下)",
      "desc": "相比 NVIDIA FasterTransformer 静态批处理实现数量级飞跃",
      "color": "emerald"
    },
    {
      "label": "调度时间粒度",
      "value": "1 个 Token 迭代步",
      "desc": "完成即走、随到随插，彻底消灭 [EOS] 后的陪跑气泡",
      "color": "cyan"
    },
    {
      "label": "线性层权重读取复用率",
      "value": "100% 跨请求合并",
      "desc": "Selective Batching 让 Prefill 与 Decode 共享同一次权重加载",
      "color": "amber"
    },
    {
      "label": "工业界生态地位",
      "value": "所有推理引擎标配",
      "desc": "vLLM、TensorRT-LLM、SGLang 的 Continuous Batching 源头",
      "color": "purple"
    }
  ],
  "experimentSections": [
    {
      "title": "GPT-3 175B 在线合成工作负载吞吐量与中位延迟对比",
      "description": "在真实对话长短不一的请求分布下，对比 FasterTransformer 不同静态最大批大小与 Orca 的吞吐率（Req/s）与延迟。",
      "headers": [
        "推理服务系统配置",
        "调度机制",
        "达到 190ms 延迟时的吞吐量 (↑)",
        "GPU 计算有效利用率"
      ],
      "rows": [
        [
          "FasterTransformer (MaxBatch = 8)",
          "Request-Level 静态批处理",
          "0.18 req/s (基准 1.0x)",
          "14.2% (大量长尾排队)"
        ],
        [
          "FasterTransformer (MaxBatch = 32)",
          "Request-Level 静态批处理",
          "延迟飙升至 >1,200ms (违反SLA)",
          "28.5% (严重 Padding 气泡)"
        ],
        [
          "Orca 仅按迭代调度 (无选择性合批)",
          "Iteration-Level 动态替换",
          "1.95 req/s (10.8x 提升)",
          "58.4%"
        ],
        [
          "Orca 完整版 (Iteration + Selective Batching)",
          "按迭代调度 + Token级展平合批",
          "6.64 req/s (36.9x 惊人提速!)",
          "89.7% (SOTA)"
        ]
      ]
    }
  ],
  "insights": [
    {
      "title": "为什么 LLM 的 Decode 阶段必须尽可能扩大并发 Batch Size？",
      "content": "在自回归生成（Decode）阶段，每条请求每步只处理 1 个 Token，但 GPU 却必须把整套百亿参数权重从 HBM 读进核心一次（典型的 Memory-bound）。如果 Batch=1，读 350GB 权重只做一次向量内积；而 Orca 通过 Continuous Batching 把数十上百条请求攒在一起共享这同一次权重读取，等于「白嫖」了 GPU 的空闲算力！"
    },
    {
      "title": "Orca 留下了什么未解之谜，从而直接催生了第二年的 vLLM (PagedAttention)？",
      "content": "Orca 解决了计算层的动态合批，但在显存分配上仍然为每条请求预先划拨一块连续的最大长度（如 2048）KV Cache 空间。这种连续预分配导致显存很快被碎片耗尽，限制了并发 Batch Size 的进一步扩大——这正是随后 PagedAttention 登场的历史契机！"
    }
  ],
  "takeaways": [
    {
      "icon": "RefreshCw",
      "title": "按迭代调度取代按请求调度",
      "desc": "生成完 [EOS] 立刻下车，新乘客下一毫秒立刻上车，绝不空跑一个 Token。"
    },
    {
      "icon": "Layers",
      "title": "Selective Batching 拆合自如",
      "desc": "Linear 层按 Token 展平合批吃满算力，Attention 层按请求独立寻址保持语义隔离。"
    },
    {
      "icon": "Zap",
      "title": "36.9 倍吞吐量的商业奇迹",
      "desc": "正是 Orca 将大模型 API 的单 Token 推理成本拉低了一个数量级，使商业化售卖成为可能。"
    },
    {
      "icon": "Cpu",
      "title": "现代推理栈的第一块基石",
      "desc": "今日你在 vLLM 或 TGI 中看到的 Continuous Batching，其学术本名正是 Orca 的 Iteration-Level Scheduling。"
    }
  ]
};

export const PAPER_DATA: UniversalPaperData = ORCA_2022_DATA;
export default PAPER_DATA;
