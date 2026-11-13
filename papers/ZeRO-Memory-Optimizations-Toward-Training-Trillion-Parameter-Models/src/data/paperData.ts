import { UniversalPaperData } from "../../../../src/shared/types/universalPaper.js";

export const ZERO_2019_DATA: UniversalPaperData = {
  "id": "zero-2019",
  "title": "ZeRO: Memory Optimizations Toward Training Trillion Parameter Models",
  "chineseTitle": "ZeRO 零冗余优化器与分布式并行：突破万亿参数大模型训练显存墙 (DeepSpeed & Megatron-LM)",
  "subtitle": "Samyam Rajbhandari, Jeff Rasley, Olatunji Ruwase, Yuxiong He • Microsoft DeepSpeed Team & NVIDIA Megatron-LM • SC 2020",
  "tags": [
    "ZeRO 零冗余优化器",
    "DeepSpeed",
    "Stage 1/2/3 状态分片",
    "混合精度 16Ψ 显存账本",
    "Megatron 张量并行"
  ],
  "arxivId": "1910.02054",
  "pdfUrl": "https://arxiv.org/pdf/1910.02054.pdf",
  "abstractUrl": "https://arxiv.org/abs/1910.02054",
  "summary": "现代多卡集群分布式训练大模型的核心引擎（DeepSpeed ZeRO 与 PyTorch FSDP 的共同基石）！论文首先算清了混合精度训练的显存总账：一个参数量为 Ψ 的模型需要 16Ψ 字节状态显存（2Ψ FP16参数 + 2Ψ FP16梯度 + 12Ψ FP32备份与Adam状态），传统数据并行（DP）在每张 GPU 上完整复制这 16Ψ 状态造成极度冗余。ZeRO 提出将优化器状态（Stage 1）、梯度（Stage 2）与模型参数（Stage 3）分片（Shard）到 N_d 张数据并行卡上，以仅 1.5x 的集合通信开销实现 N_d 倍线性显存削减，配合 Megatron-LM（1909.08053）张量并行让单集群训练千亿至万亿参数模型成为现实！",
  "keyContributions": [
    "精准剖析混合精度训练显存分布：优化器状态（FP32 Master Weights + m_t + v_t = 12Ψ）独占 75% 模型状态显存",
    "提出 ZeRO-1/2/3 三级渐进式分片架构，分别实现 4x、8x 与 N_d 倍（随 GPU 数量线性扩展）的模型状态显存压缩",
    "证明 ZeRO-1 与 ZeRO-2 的通信量与标准数据并行 All-Reduce 完全相同（2Ψ），无任何额外通信惩罚",
    "与 NVIDIA Megatron-LM（1909.08053 层内列并行+行并行切分）共同构成现代 3D 并行（DP/ZeRO + TP + PP）工业训练标准"
  ],
  "coreProblem": "训练 GPT-3 规模（175B 参数）模型时，仅保存 FP16 参数（350GB）、FP16 梯度（350GB）和 Adam FP32 状态（2100GB）就需要高达 2.8TB 的模型状态显存，远超任何单张 80GB H100/A100 显卡容量；而传统数据并行在每张卡上重复存储相同副本，造成 98% 以上的显存浪费。",
  "coreIdea": "既然数据并行中有 N_d 张卡，为什么每张卡都要存全套状态？将优化器状态、梯度和参数切分成 N_d 份，每张 GPU 只持久保存并更新属于自己的 1/N_d 分片！在前向和反向计算需要完整某层权重时，通过高速 All-Gather 临时拼齐，算完立刻释放（用完即焚）。",
  "simulatorTitle": "ZeRO-1/2/3 显存分片与 3D 分布式并行账本计算器",
  "simulatorDesc": "调节模型参数规模 Ψ (7B~1000B)、数据并行卡数 N_d 与 ZeRO 阶段，实时计算单卡显存占用与集合通信开销。",
  "architectureSteps": [
    {
      "id": "zero-step-1",
      "title": "1. 混合精度 16Ψ 显存解剖",
      "subtitle": "Mixed-Precision 16Ψ Memory Breakdown",
      "description": "对每个参数 Ψ：FP16 权重占 2B，FP16 梯度占 2B，而 Adam 优化器需维护 FP32 主权重 (4B)、一阶动量 m_t (4B) 与二阶方差 v_t (4B)，合计 (2+2+12)Ψ = 16Ψ 字节。",
      "highlightColor": "emerald"
    },
    {
      "id": "zero-step-2",
      "title": "2. ZeRO-Stage 1 (Pos): 优化器状态分片",
      "subtitle": "Optimizer State Partitioning (4x Reduction)",
      "description": "将 12Ψ 的 Adam FP32 状态均分到 N_d 张卡上，每卡仅存 12Ψ/N_d。单卡显存从 16Ψ 骤降至 4Ψ + 12Ψ/N_d（立省 4 倍），且通信量零增加！",
      "highlightColor": "cyan"
    },
    {
      "id": "zero-step-3",
      "title": "3. ZeRO-Stage 2 (Pos+g): 梯度与优化器分片",
      "subtitle": "Gradient + Optimizer Partitioning (8x Reduction)",
      "description": "反向传播算出某层梯度后，通过 Reduce-Scatter 仅将对应分片聚合到责任卡上，非责任分片当场释放。单卡显存降至 2Ψ + 14Ψ/N_d（节省 8 倍）。",
      "highlightColor": "amber"
    },
    {
      "id": "zero-step-4",
      "title": "4. ZeRO-Stage 3 / FSDP: 全参数分片",
      "subtitle": "Full Parameter Sharding (Linear N_d Scaling)",
      "description": "连 2Ψ 的模型权重也分片存储！前向/反向逐层执行 All-Gather 广播权重，计算完毕立即丢弃，单卡状态显存降至 16Ψ/N_d。",
      "highlightColor": "purple"
    }
  ],
  "formulas": [
    {
      "id": "zero-f1",
      "name": "混合精度训练单卡模型状态显存方程",
      "category": "显存账本建模",
      "formula": "M_{\\text{DP}} = \\underbrace{2\\Psi}_{\\text{FP16 } W} + \\underbrace{2\\Psi}_{\\text{FP16 } G} + \\underbrace{(4\\Psi + 4\\Psi + 4\\Psi)}_{\\text{FP32 Master } W, m_t, v_t} = 16\\Psi \\text{ Bytes}",
      "explanation": "揭示了为什么 7B 模型微调/预训练在单卡上仅模型状态就需要 7 × 16 = 112 GB 显存。",
      "variables": [
        {
          "symbol": "\\Psi",
          "desc": "模型总参数量（如 7B = 7×10^9）"
        },
        {
          "symbol": "12\\Psi",
          "desc": "Adam FP32 优化器状态开销，占总状态显存的 75%"
        }
      ]
    },
    {
      "id": "zero-f2",
      "name": "ZeRO 三阶段单卡显存与通信开销定律",
      "category": "分布式分片定律",
      "formula": "M_{\\text{ZeRO-1}} = 4\\Psi + \\frac{12\\Psi}{N_d}, \\quad M_{\\text{ZeRO-2}} = 2\\Psi + \\frac{14\\Psi}{N_d}, \\quad M_{\\text{ZeRO-3}} = \\frac{16\\Psi}{N_d}",
      "explanation": "随数据并行度 N_d 增加，ZeRO-3 将单卡显存需求降低 N_d 倍，通信量仅从 2Ψ 温和增至 3Ψ。",
      "variables": [
        {
          "symbol": "N_d",
          "desc": "数据并行 GPU 数量"
        },
        {
          "symbol": "3\\Psi",
          "desc": "ZeRO-3 每步总通信量（前向 All-Gather + 反向 All-Gather + 梯度 Reduce-Scatter）"
        }
      ]
    }
  ],
  "metricCards": [
    {
      "label": "最大可训练模型规模",
      "value": "1 Trillion+ (万亿参数)",
      "desc": "在 400 张 GPU 上即可容纳超万亿参数模型状态",
      "color": "emerald"
    },
    {
      "label": "ZeRO-1/2/3 显存缩减比",
      "value": "4x / 8x / N_d 倍",
      "desc": "彻底消除数据并行中的冗余状态副本",
      "color": "cyan"
    },
    {
      "label": "ZeRO-1/2 额外通信代价",
      "value": "0% (与标准DP相同)",
      "desc": "用 Reduce-Scatter + All-Gather 完美平替 All-Reduce",
      "color": "amber"
    },
    {
      "label": "集群吞吐扩展效率",
      "value": "15 PetaFLOPS (超线性)",
      "desc": "省下的显存允许更大 Batch Size，大幅提升 GPU 计算利用率",
      "color": "purple"
    }
  ],
  "experimentSections": [
    {
      "title": "不同并行策略下 100B 模型在 64 张 GPU 上的单卡状态显存对比",
      "description": "对比标准 PyTorch DDP 与 ZeRO-1/2/3 在 1000 亿参数模型（总状态 1600 GB）下的单卡显存占用与通信量。",
      "headers": [
        "分布式方案",
        "单卡状态显存 (100B, N_d=64)",
        "每步通信总量",
        "32GB/80GB 显卡可训练性"
      ],
      "rows": [
        [
          "标准数据并行 (DDP)",
          "1600.0 GB (OOM!)",
          "2Ψ (All-Reduce)",
          "完全爆显存无法启动"
        ],
        [
          "ZeRO-Stage 1 (分片优化器)",
          "418.8 GB",
          "2Ψ (零额外通信)",
          "需配合张量并行 TP=8"
        ],
        [
          "ZeRO-Stage 2 (分片优化器+梯度)",
          "221.9 GB",
          "2Ψ (零额外通信)",
          "需配合张量并行 TP=4"
        ],
        [
          "ZeRO-Stage 3 / FSDP (本文全分片)",
          "25.0 GB (缩减 64 倍!)",
          "3Ψ (+1.5x 通信)",
          "单卡 80GB 轻松容纳并留出充裕激活空间"
        ]
      ]
    }
  ],
  "insights": [
    {
      "title": "ZeRO 与 Megatron-LM 张量并行（TP）是如何分工协作的？",
      "content": "Megatron-LM (1909.08053) 在节点内（NVLink 高带宽）把单层大矩阵按列和行切分（Tensor Parallelism），解决单层计算与激活显存过大的问题；而 ZeRO 在节点间（InfiniBand）跨数据并行组切分状态，两者结合加上流水线并行（PP）构成了今日所有大模型训练的 3D Parallelism 标准。"
    },
    {
      "title": "为什么 All-Reduce 在数学上等价于 Reduce-Scatter + All-Gather？",
      "content": "传统 DDP 用 All-Reduce 让每张卡都拿到完整梯度并各自更新完整权重；ZeRO-2 洞察到只需先做前半段 Reduce-Scatter 让每张卡更新自己那 1/N_d 的权重，再做后半段 All-Gather 同步最新权重——总通信字节完全不变（2Ψ），却白赚了 8 倍显存节省！"
    }
  ],
  "takeaways": [
    {
      "icon": "Database",
      "title": "16Ψ 显存铁律",
      "desc": "记住混合精度训练公式：2Ψ(W) + 2Ψ(G) + 12Ψ(Adam) = 16Ψ 字节，这是切分集群算力的第一性原理。"
    },
    {
      "icon": "Layers",
      "title": "消除冗余而非妥协精度",
      "desc": "ZeRO 在数学上与单机全量训练 100% 等价，不损失任何数值精度。"
    },
    {
      "icon": "Share2",
      "title": "PyTorch FSDP 的原型",
      "desc": "PyTorch 官方内置的 FullyShardedDataParallel (FSDP) 正是直接采纳了 ZeRO-Stage 3 的架构设计。"
    },
    {
      "icon": "Cpu",
      "title": "与 Megatron-LM 珠联璧合",
      "desc": "节点内跑 Megatron 张量并行，节点间跑 DeepSpeed ZeRO，是万卡集群的标准拓扑。"
    }
  ]
};

export const PAPER_DATA: UniversalPaperData = ZERO_2019_DATA;
export default PAPER_DATA;
