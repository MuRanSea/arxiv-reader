import { UniversalPaperData } from "../../../../src/shared/types/universalPaper.js";

export const PAGEDATTENTION_2023_DATA: UniversalPaperData = {
  "id": "pagedattention-2023",
  "title": "Efficient Memory Management for Large Language Model Serving with PagedAttention (vLLM)",
  "chineseTitle": "PagedAttention 与 vLLM：用操作系统虚拟内存分页彻底终结 KV Cache 显存浪费",
  "subtitle": "Woosuk Kwon, Zhuohan Li (李卓桓), Siyuan Zhuang, Ying Sheng, Lianmin Zheng, Ion Stoica et al. • UC Berkeley • SOSP 2023",
  "tags": [
    "PagedAttention",
    "vLLM 核心引擎",
    "KV Cache 虚拟内存分页",
    "消除 60%~80% 显存碎片",
    "Copy-on-Write 前缀共享"
  ],
  "arxivId": "2309.06180",
  "pdfUrl": "https://arxiv.org/pdf/2309.06180.pdf",
  "abstractUrl": "https://arxiv.org/abs/2309.06180",
  "summary": "开源大模型推理引擎 vLLM 的奠基论文，彻底统治今日工业界 LLM 部署栈！UC Berkeley 团队发现：即使采用了 Orca 的连续批处理，现有系统仍因要求每条请求的动态 KV Cache 存储在【连续物理显存】中，不得不按最大可能长度（如 2048/4096）静态预留空间，导致高达 60% ~ 80% 的 GPU 显存被内部碎片、预留闲置与外部碎片白白浪费！论文借鉴操作系统经典的「虚拟内存与分页（Virtual Memory & Paging）」思想提出 PagedAttention，将 KV Cache 切分为固定大小（如每块 16 个 Token）的物理块（KV Blocks），通过页表（Block Table）按需非连续动态分配，将显存浪费压降至 4% 以下，使单卡并发 Batch Size 扩大 2~4 倍，吞吐量比 FasterTransformer 暴涨 24 倍、比 Orca 再翻 2.7~4 倍！",
  "keyContributions": [
    "量化揭露传统连续 KV Cache 分配的惊人真相：真实只有 20.4% ~ 38.2% 的 KV 显存存了有效 Token，其余 60%~80% 全是三大碎片浪费",
    "发明 PagedAttention 注意力内核：支持在非连续物理显存块（Non-contiguous Physical Blocks）上直接分块读取 K 和 V 并计算注意力",
    "构建完整的操作系统级显存管理器 vLLM：通过逻辑块到物理块的页表映射，实现按需分配（On-demand Allocation）与零外部碎片",
    "天然支持块级写时复制（Copy-on-Write）与引用计数，让 Parallel Sampling、Beam Search 和系统提示词（Prefix Caching）共享高达 55% 的 KV 显存"
  ],
  "coreProblem": "大模型自回归生成时，KV Cache 会随生成的每个 Token 动态增长且最终长度无法预知。传统深度学习框架要求张量必须在物理显存上连续存放，因此只能为每条请求预先分配一整块 max_seq_len 的连续显存，导致三分之二以上的珍贵显存被「占着茅坑不拉屎」的空闲预留位锁死，严重卡死了并发 Batch Size。",
  "coreIdea": "像操作系统管理物理内存页一样管理 KV Cache！把 GPU 显存池划分为无数个固定大小（例如 B=16 个 Token）的「物理 KV 块」。请求生成时，用多少分配多少，逻辑上连续的 Token 序列可以通过「页表（Block Table）」映射到物理上完全不相邻的任意空闲块中；且多个请求相同的 Prompt 前缀可以直接指向同一批物理块！",
  "simulatorTitle": "PagedAttention 虚拟页表映射与 KV Cache 碎片消除模拟器",
  "simulatorDesc": "交互式调节并发请求数、物理块大小 B (8/16/32 Tokens) 与共享前缀比例，实时对比连续分配与 PagedAttention 的显存利用率与最大并发吞吐。",
  "architectureSteps": [
    {
      "id": "pa-step-1",
      "title": "1. 剖析传统连续分配三大显存黑洞",
      "subtitle": "Internal, Reservation & External Fragmentation",
      "description": "传统预分配产生：(1) 内部碎片（实际比 max_len 短而永不使用的空间）、(2) 预留浪费（后续步才用到但全程占用的空间）、(3) 外部碎片（不同长度块交替释放后的零碎空隙）。",
      "highlightColor": "emerald"
    },
    {
      "id": "pa-step-2",
      "title": "2. 逻辑 KV 块与物理 KV 块解耦",
      "subtitle": "Logical-to-Physical Block Table Mapping",
      "description": "将每条请求的 KV Cache 划分为每块固定包含 B=16 个 Token 的逻辑块，仅当上一个块填满时，才从全局物理块池中按需申请 1 个新物理块并记录进页表。",
      "highlightColor": "cyan"
    },
    {
      "id": "pa-step-3",
      "title": "3. PagedAttention 非连续分块注意力内核",
      "subtitle": "Block-wise Non-Contiguous Attention Kernel",
      "description": "定制 CUDA 内核在每次迭代中查询 Block Table，动态从分散的物理地址抓取块矩阵 K_j, V_j ∈ R^{B×d}，在 SRAM 内完成分块点积与在线 Softmax 聚合。",
      "highlightColor": "amber"
    },
    {
      "id": "pa-step-4",
      "title": "4. 写时复制 (CoW) 与前缀零拷贝共享",
      "subtitle": "Copy-on-Write & Prefix Sharing",
      "description": "对共享 System Prompt 或并行采样（n>1）的多个候选序列，直接将页表指向同一组物理块（引用计数 >1）；仅当某分支需要修改末尾块时才触发单块复制。",
      "highlightColor": "purple"
    }
  ],
  "formulas": [
    {
      "id": "pa-f1",
      "name": "PagedAttention 分块注意力计算方程",
      "category": "分块注意力内核",
      "formula": "\\mathbf{A}_{i,j} = \\frac{\\exp(\\mathbf{q}_i^T \\mathbf{K}_j / \\sqrt{d})}{\\sum_{t=1}^{\\lceil i/B \\rceil} \\exp(\\mathbf{q}_i^T \\mathbf{K}_t / \\sqrt{d}) \\mathbf{1}}, \\qquad \\mathbf{o}_i = \\sum_{j=1}^{\\lceil i/B \\rceil} \\mathbf{V}_j \\mathbf{A}_{i,j}^T",
      "explanation": "将原本逐个连续 Token 的点积转化为以固定物理块 K_j = (k_{(j-1)B+1}, ..., k_{jB}) 为单位的块矩阵运算，物理块之间无需地址相邻。",
      "variables": [
        {
          "symbol": "B",
          "desc": "每个物理 KV 块容纳的固定 Token 数量（vLLM 默认 B = 16）"
        },
        {
          "symbol": "\\mathbf{K}_j, \\mathbf{V}_j",
          "desc": "通过页表（Block Table）动态寻址的第 j 个物理键值块张量"
        }
      ]
    },
    {
      "id": "pa-f2",
      "name": "分页机制下的理论最大内部碎片上界公式",
      "category": "显存利用率定律",
      "formula": "\\text{Waste}_{\\text{Paged}} \\le \\frac{B - 1}{L_{\\text{avg}}} \\approx 3.7\\% \\quad (\\text{vs. } \\text{Waste}_{\\text{Contiguous}} = 1 - \\frac{L_{\\text{avg}}}{L_{\\text{max}}} \\approx 62\\% \\sim 79.6\\%)",
      "explanation": "在分页机制下，每条请求最多只在【最后一个未填满的物理块】上浪费不超过 B-1 个槽位，外部碎片与预留浪费严格为 0！",
      "variables": [
        {
          "symbol": "L_{\\text{avg}}, L_{\\text{max}}",
          "desc": "请求的平均实际长度与系统最大上下文长度上限"
        },
        {
          "symbol": "B - 1",
          "desc": "单条请求在末尾物理块上可能产生的最大未填满 Token 槽位数（最多 15 个）"
        }
      ]
    }
  ],
  "metricCards": [
    {
      "label": "KV Cache 显存浪费率",
      "value": "60~80% ➔ < 4%",
      "desc": "接近 100% 榨干每一字节显存，仅末尾块存在微小内部碎片",
      "color": "emerald"
    },
    {
      "label": "服务吞吐量提升 (vs Orca)",
      "value": "2.7x ~ 4.0x 倍",
      "desc": "省下的显存允许将并发 Batch Size 扩大数倍，相比 FT 提速 24 倍",
      "color": "cyan"
    },
    {
      "label": "Beam Search / 并行采样省存",
      "value": "最高节省 55% KV显存",
      "desc": "通过块级引用计数与 Copy-on-Write 实现多分支零拷贝共享",
      "color": "amber"
    },
    {
      "label": "GitHub 开源影响力",
      "value": "vLLM (40,000+ Stars)",
      "desc": "全球生产环境部署最广泛的开源大模型推理服务引擎",
      "color": "purple"
    }
  ],
  "experimentSections": [
    {
      "title": "ShareGPT 与 Alpaca 真实对话负载下各推理系统 KV 显存利用率与最大吞吐对比 (LLaMA-13B)",
      "description": "对比 FasterTransformer、Orca (不同预留策略) 与 vLLM (PagedAttention) 的显存浪费率及可持续请求率。",
      "headers": [
        "推理服务引擎",
        "KV Cache 显存有效利用率 (↑)",
        "平均并发 Batch 大小",
        "最大可持续吞吐量 (Req/s ↑)"
      ],
      "rows": [
        [
          "FasterTransformer (静态连续预分配)",
          "20.4% (浪费高达 79.6%!)",
          "8.2 条并发",
          "1.3 req/s (基准 1.0x)"
        ],
        [
          "Orca-Max (按最大长度连续预分配)",
          "24.1% (浪费 75.9%)",
          "11.5 条并发",
          "8.2 req/s (6.3x)"
        ],
        [
          "Orca-Oracle (假设预知长度的理论連続上限)",
          "68.2% (仍受外部碎片困扰)",
          "26.4 条并发",
          "14.5 req/s (11.2x)"
        ],
        [
          "vLLM + PagedAttention (本文方案)",
          "96.3% (浪费仅 3.7%!)",
          "64.8 条并发",
          "31.2 req/s (24.0x 碾压夺冠!)"
        ]
      ]
    }
  ],
  "insights": [
    {
      "title": "为什么物理块大小 B = 16 是黄金甜点值？",
      "content": "如果 B 太小（如 B=1，即逐 Token 链表），会导致最后一个块的内部碎片为 0，但 GPU 全局内存读取无法合并（Uncoalesced Memory Access），带宽利用率暴跌；如果 B 太大（如 B=256），末尾未填满块的内部碎片又会显著上升。B=16 或 32 完美兼顾了 GPU 缓存行对齐读取与 <4% 的极低碎片率。"
    },
    {
      "title": "从 PagedAttention 到 Automatic Prefix Caching (APC)",
      "content": "既然 KV Cache 已经被切成了固定长度为 16 的物理块，那么对任意请求的输入块计算哈希值（Hash(前块Hash, 当前16个Token)），就能把系统提示词、多轮对话历史甚至 RAG 文档块的物理块做成全局 LRU 缓存池，实现跨请求的首字延迟（TTFT）零重算秒回！"
    }
  ],
  "takeaways": [
    {
      "icon": "HardDrive",
      "title": "跨界移植操作系统智慧",
      "desc": "把计算机体系结构成熟了五十年的「虚拟内存分页」原封不动搬进大模型 KV Cache 管理。"
    },
    {
      "icon": "Maximize2",
      "title": "显存省下来就是吞吐翻倍",
      "desc": "消灭 70% 的显存碎片气泡，意味着同一张显卡能同时服务 4 倍以上的并发用户。"
    },
    {
      "icon": "Copy",
      "title": "写时复制赋能复杂解码",
      "desc": "让原本高不可攀的 Beam Search、Best-of-N 采样与树搜索推理变得极其廉价。"
    },
    {
      "icon": "Rocket",
      "title": "vLLM 成就开源推理事实标准",
      "desc": "Orca 的连续批处理 + vLLM 的 PagedAttention 构成了今日一切现代推理引擎的双核基座。"
    }
  ]
};

export const PAPER_DATA: UniversalPaperData = PAGEDATTENTION_2023_DATA;
export default PAPER_DATA;
