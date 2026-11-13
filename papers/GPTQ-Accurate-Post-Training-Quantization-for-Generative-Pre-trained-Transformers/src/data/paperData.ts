import { UniversalPaperData } from "../../../../src/shared/types/universalPaper.js";

export const GPTQ_2022_DATA: UniversalPaperData = {
  "id": "gptq-2022",
  "title": "GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers",
  "chineseTitle": "GPTQ 与 AWQ 后训练量化：利用二阶海森补偿将百亿大模型无损塞进单张显卡",
  "subtitle": "Elias Frantar, Saleh Ashkboos, Torsten Hoefler, Dan Alistarh • IST Austria & ETH Zurich • ICLR 2023 (同栈演进: AWQ 2306.00978)",
  "tags": [
    "GPTQ 4-bit 量化",
    "OBQ 二阶海森逆补偿",
    "Cholesky 块延迟更新",
    "AWQ 激活感知显著权重",
    "单卡部署 175B"
  ],
  "arxivId": "2210.17323",
  "pdfUrl": "https://arxiv.org/pdf/2210.17323.pdf",
  "abstractUrl": "https://arxiv.org/abs/2210.17323",
  "summary": "让千亿参数大模型得以压缩为 4-bit / 3-bit 在单张消费级或服务器显卡上高速推理的工业界量化标准（与紧随其后的 AWQ 2306.00978 共同统治开源模型发布格式）！此前基于舍入到最近值（RTN）的 4-bit 量化在百亿模型上会导致困惑度（PPL）雪崩，而经典的二阶海森矩阵逐权重最优脑量化（OBQ）复杂度高达 O(d_row · d_col³)，量化一个百亿模型需要数周。GPTQ 洞察到按固定列顺序同步量化所有行可共享同一个海森矩阵 H = 2XX^T，并通过「延迟块更新（Lazy Batch Updates）+ Cholesky 三角分解」将 175B 模型的量化时间压缩至 4 GPU 小时内，首次实现在单张 80GB A100 上无损运行 175B 模型并获得 3.25x~4.5x 推理加速！",
  "keyContributions": [
    "打破 OBQ 贪心逐权重选择导致的 O(d_row · d_col³) 算力死锁：证明按固定列顺序同步量化整列权重对最终精度几乎无影响，从而使所有行共享同一海森逆矩阵 H^{-1}",
    "提出「延迟块更新（Lazy Batch-Updates, B=128）」：将逐列秩-1 更新聚合成矩阵块乘法，将 GPU 显存带宽瓶颈转化为高吞吐 Tensor Core 计算，提速超 10 倍",
    "引入基于 Cholesky 分解的预先求逆重构，彻底解决了千亿模型海森矩阵病态近似引发的数值不稳定崩溃",
    "与后续 AWQ（2306.00978：发现保护激活值最大的 1% 显著权重通道并做等价缩放 s 即可免优化器无损量化）共同构成现代 INT4/FP4 权重压缩工业底座"
  ],
  "coreProblem": "将 175B 模型从 FP16（350GB，至少需 5 张 80GB A100）直接四舍五入量化（RTN）到 4-bit 或 3-bit 时，由于未补偿权重截断对层输出 WX 的累积误差，模型困惑度直接崩溃；而传统二阶补偿算法 OBQ 在百亿规模下需要数百个小时且数值极易发散。",
  "coreIdea": "最小化层输出的二阶重构误差 ||WX - ŴX||₂²！当把第 q 列的权重 w_q 四舍五入量化为 quant(w_q) 时，会产生一个微小量化误差 δ_q。GPTQ 利用海森逆矩阵 H^{-1} = (2XX^T + λI)^{-1} 的相关性信息，当场调整【尚未量化的右侧剩余列权重】来精确抵消这笔误差，并每 128 列打包执行一次高速矩阵块更新！",
  "simulatorTitle": "GPTQ 二阶海森补偿与 AWQ 显著通道缩放量化实验台",
  "simulatorDesc": "交互式调节目标比特数 (8/4/3/2-bit)、分块大小 B 与 AWQ 显著通道保护比例，对比 RTN、GPTQ 与 AWQ 的困惑度保持率与单卡推理加速。",
  "architectureSteps": [
    {
      "id": "gptq-step-1",
      "title": "1. 校准集统计海森矩阵与 Cholesky 分解",
      "subtitle": "Calibration Hessian & Cholesky Factor",
      "description": "仅需喂入 128 条无标签校准文本，统计每层输入的协方差海森矩阵 H = 2XX^T，加上阻尼项 λI 后一次性计算逆矩阵的上三角 Cholesky 因子 L = chol(H^{-1})^T。",
      "highlightColor": "emerald"
    },
    {
      "id": "gptq-step-2",
      "title": "2. 块内 (B=128) 逐列量化与误差累积",
      "subtitle": "Intra-Block Column Quantization & Error Compensation",
      "description": "在大小为 B=128 的列块内部，依次将第 j 列量化 Q_j = quant(W_j)，计算归一化误差 E_j = (W_j - Q_j) / [H^{-1}]_{jj}，并仅更新当前块内右侧未量化列。",
      "highlightColor": "cyan"
    },
    {
      "id": "gptq-step-3",
      "title": "3. 跨块延迟矩阵更新 (Lazy Batch Update)",
      "subtitle": "Compute-Bound Lazy Block Matrix Update",
      "description": "每处理完 128 列，使用一次高算术强度的矩阵乘法 W_{:, i+B:} ← W_{:, i+B:} - E · H^{-1}_{i:i+B, i+B:} 一次性补偿右侧所有剩余列，速度飙升 10 倍！",
      "highlightColor": "amber"
    },
    {
      "id": "gptq-step-4",
      "title": "4. AWQ 激活感知显著通道等价缩放 (协同演进)",
      "subtitle": "AWQ Salient Channel Scaling (s · W) · (s^{-1} · X)",
      "description": "林佳俊等 (AWQ) 进一步发现：根据输入激活幅值 |X| 挑出最关键的 1% 权重通道乘以放大因子 s > 1（输入端除以 s），无需反向梯度且具备极强跨领域泛化！",
      "highlightColor": "purple"
    }
  ],
  "formulas": [
    {
      "id": "gptq-f1",
      "name": "GPTQ 二阶海森最优权重误差补偿更新律",
      "category": "二阶最优脑量化",
      "formula": "\\mathbf{E}_{:, j} = \\frac{\\mathbf{W}_{:, j} - \\text{quant}(\\mathbf{W}_{:, j})}{\\left[\\mathbf{H}^{-1}\\right]_{jj}}, \\qquad \\mathbf{W}_{:, j:(i+B)} \\leftarrow \\mathbf{W}_{:, j:(i+B)} - \\mathbf{E}_{:, j} \\cdot \\left[\\mathbf{H}^{-1}\\right]_{j, j:(i+B)}",
      "explanation": "当前列量化产生的误差 E_{:,j}，由右侧尚未量化的权重根据海森逆矩阵协方差自动反向微调予以抵消，使层输出 WX 保持不变。",
      "variables": [
        {
          "symbol": "\\mathbf{H} = 2\\mathbf{X}\\mathbf{X}^T",
          "desc": "层输出重构损失 ||WX - ŴX||₂² 关于权重的二阶海森矩阵"
        },
        {
          "symbol": "\\mathbf{E}_{:, j}",
          "desc": "第 j 列权重的归一化量化误差向量"
        },
        {
          "symbol": "B = 128",
          "desc": "延迟块更新的列块宽度，将访存受限转化为计算受限"
        }
      ]
    },
    {
      "id": "gptq-f2",
      "name": "AWQ 激活感知通道等价变换缩放公式 (2306.00978)",
      "category": "激活感知量化",
      "formula": "\\mathbf{Y} = \\mathbf{W}\\mathbf{X} = (\\mathbf{W} \\cdot \\text{diag}(\\mathbf{s})) \\cdot (\\text{diag}(\\mathbf{s})^{-1} \\mathbf{X}), \\qquad \\mathbf{s}^* = \\left( \\text{mean}(|\\mathbf{X}|) \\right)^\\alpha",
      "explanation": "对对应激活幅值 |X| 最大的显著权重通道放大 s 倍后再做整数舍入，使其相对量化误差缩小 1/s，同时将 s^{-1} 融合进上一层算子实现零额外开销。",
      "variables": [
        {
          "symbol": "\\mathbf{s}",
          "desc": "逐输入通道计算的等价缩放向量，由激活绝对均值决定"
        },
        {
          "symbol": "\\alpha \\in [0, 1]",
          "desc": "平衡显著通道与普通通道量化误差的网格搜索指数（通常 α ≈ 0.5）"
        }
      ]
    }
  ],
  "metricCards": [
    {
      "label": "175B 模型单卡部署突破",
      "value": "5×A100 ➔ 1×A100",
      "desc": "350GB 权重压缩至约 88GB (4-bit) / 66GB (3-bit)，单卡跑通千亿模型",
      "color": "emerald"
    },
    {
      "label": "端到端 Token 推理提速",
      "value": "3.25x ~ 4.53x 加速",
      "desc": "4-bit 权重读取字节减少 4 倍，直接突破 Decode 阶段显存带宽墙",
      "color": "cyan"
    },
    {
      "label": "175B 全模型量化耗时",
      "value": "仅需 4 GPU 小时",
      "desc": "相比 OBQ 提速超百倍，且完全无需反向传播或重训练",
      "color": "amber"
    },
    {
      "label": "4-bit 困惑度精度损失",
      "value": "< 0.03 PPL (近乎无损)",
      "desc": "在 WikiText2 上 OPT-175B 4-bit 困惑度 8.37 vs FP16 8.34",
      "color": "purple"
    }
  ],
  "experimentSections": [
    {
      "title": "OPT-175B 与 BLOOM-176B 在不同比特后训练量化下的 WikiText2 困惑度 (PPL ↓) 对比",
      "description": "验证在 4-bit 与极限 3-bit 下，普通四舍五入 RTN 发生严重退化，而 GPTQ 与 AWQ 几乎完美保持 FP16 原始精度。",
      "headers": [
        "量化算法与位宽",
        "175B 模型权重显存",
        "OPT-175B WikiText2 PPL (↓)",
        "单步生成加速比 (↑)"
      ],
      "rows": [
        [
          "FP16 Baseline (16-bit 原始精度)",
          "350.0 GB (需 5×80GB GPU)",
          "8.34 (基准精度)",
          "1.00x"
        ],
        [
          "RTN 4-bit / 3-bit (直接四舍五入)",
          "87.5 GB / 65.6 GB",
          "10.54 (4-bit) / 7360.0 (3-bit 彻底崩溃!)",
          "3.20x (但无法使用)"
        ],
        [
          "GPTQ 3-bit (本文二阶海森补偿)",
          "65.6 GB (单张 80GB 卡轻松装下!)",
          "8.68 (比 RTN 4-bit 还要精准!)",
          "3.90x"
        ],
        [
          "GPTQ / AWQ 4-bit (g128 工业标准)",
          "88.5 GB",
          "8.37 / 8.35 (与 FP16 仅差 0.01~0.03!)",
          "3.25x ~ 4.50x (SOTA)"
        ]
      ]
    }
  ],
  "insights": [
    {
      "title": "为什么在 Batch=1 或小并发推理时，4-bit 权重但 16-bit 计算（W4A16）反而比 FP16 快 3~4 倍？",
      "content": "很多初学者误以为「既然计算时还要反量化回 FP16 乘激活，算力没省怎么会变快？」。原因在于 Decode 阶段是极度访存受限（Memory-bound）的：90% 的时间花在把权重从 HBM 搬到寄存器上！W4A16 让需要从 HBM 搬运的权重体积缩小了整整 4 倍，而片上反量化只需几个寄存器指令，因此端到端速度直接飙升 3.25~4.5 倍！"
    },
    {
      "title": "GPTQ 与 AWQ 在工程选型上各有什么长处？",
      "content": "GPTQ 利用二阶海森逆主动修改剩余权重来拟合校准集，在极低比特（如 3-bit / 2-bit）下重构能力极强；而 AWQ 不修改非显著权重的相对关系、仅做通道缩放，因此完全不会过拟合校准集，在多模态（VLM）、数学与代码跨领域任务上泛化极为稳健。"
    }
  ],
  "takeaways": [
    {
      "icon": "Minimize2",
      "title": "W4A16 破局访存带宽墙",
      "desc": "权重压成 4-bit 搬运，进片上再反量化为 FP16 乘激活，既省 4 倍显存又提速 3~4 倍。"
    },
    {
      "icon": "Sliders",
      "title": "前人犯错，后列买单",
      "desc": "GPTQ 的精髓是用海森逆矩阵让后面未量化的列主动微调，把前面列四舍五入欠下的债补平。"
    },
    {
      "icon": "Sparkles",
      "title": "AWQ 1% 显著权重定律",
      "desc": "权重并非生而平等，决定模型智商的是对应激活值最大的那 1% 显著通道。"
    },
    {
      "icon": "Package",
      "title": "HuggingFace 开源发布标配",
      "desc": "如今任何新开源大模型发布当天，社区都会第一时间产出 -GPTQ 与 -AWQ 两大标准量化包。"
    }
  ]
};

export const PAPER_DATA: UniversalPaperData = GPTQ_2022_DATA;
export default PAPER_DATA;
