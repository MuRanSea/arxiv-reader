import { UniversalPaperData } from "../../../../src/shared/types/universalPaper.js";

export const FLASHATTENTION_2022_DATA: UniversalPaperData = {
  "id": "flashattention-2022",
  "title": "FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness",
  "chineseTitle": "FlashAttention：兼顾硬件 IO 感知的高速省显存精确注意力算法",
  "subtitle": "Tri Dao, Daniel Y. Fu, Stefano Ermon, Atri Rudra, Christopher Ré • Stanford University • NeurIPS 2022",
  "tags": [
    "FlashAttention",
    "IO-Awareness 硬件感知",
    "SRAM 分块 Tiling",
    "Online Softmax 在线归一化",
    "O(N) 线性激活显存"
  ],
  "arxivId": "2205.14135",
  "pdfUrl": "https://arxiv.org/pdf/2205.14135.pdf",
  "abstractUrl": "https://arxiv.org/abs/2205.14135",
  "summary": "现代所有大模型长上下文训练与推理加速的绝对底座！此前学界提出了数十种「近似稀疏注意力」试图把 FLOPs 从 O(N²) 降为 O(N)，但在真实 GPU 上反而更慢。Tri Dao 一针见血地指出：标准自注意力的真正瓶颈根本不是浮点算力（Compute-bound），而是 GPU 高带宽显存（HBM）与片上高速缓存（SRAM）之间对巨型 N×N 注意力矩阵的反复读写（Memory-bound）！FlashAttention 通过「分块（Tiling）+ 在线 Softmax 重缩放（Online Softmax）+ 反向传播重计算（Recomputation）」，全程不向 HBM 落盘任何 N×N 中间矩阵，在保证输出结果与标准注意力【逐比特精确一致】的前提下，将显存复杂度从 O(N²) 彻底降为 O(N)，速度飙升 3~7.6 倍！",
  "keyContributions": [
    "建立 GPU 存储层级 IO 复杂度模型：A100 的片上 SRAM 带宽高达 19 TB/s（仅 20MB），而主显存 HBM 带宽仅 1.5 TB/s，算子融合减少 HBM 读写才是提速关键",
    "利用 Online Softmax 递推恒等式，在无法一次看全整行 K 的分块循环中，动态更新局部最大值 m(x) 与指数和 l(x)，单趟扫描完成精确归一化",
    "全程不实例化 N×N 的 S = QK^T 与 P = softmax(S) 矩阵，将注意力激活显存从 O(N²) 压缩至 O(N)，让 64K~1M 超长上下文成为可能",
    "反向传播中不保存 O(N²) 注意力矩阵，仅存 O(N) 的行统计量 (m, l) 并在 SRAM 内极速重算，因省去了海量 HBM 读取，总反向耗时反而比标准实现更快！"
  ],
  "coreProblem": "在标准 PyTorch 注意力实现中，计算 S = QK^T、P = softmax(S)、O = PV 需要在主显存 HBM 上连续创建、写入并重新读取三个 N×N 的巨型矩阵。当序列长度 N = 32K 时，仅单层单头的 N×N 矩阵就高达数十 GB，且 80% 以上的 GPU 时间都在空等慢速 HBM 内存搬运。",
  "coreIdea": "把 Q、K、V 切成能塞进 GPU 超高速片上缓存（SRAM）的小块（Tiles）。外层循环把 K_j, V_j 块加载进 SRAM，内层循环流式扫过 Q_i 块：在 SRAM 内部算完小块点积后，借助「在线 Softmax 修正因子 e^{m_old - m_new}」直接在片上累加更新输出块 O_i，直到整个循环结束才把最终结果 O 写回 HBM 一次！",
  "simulatorTitle": "FlashAttention SRAM 分块与 HBM IO 带宽分析实验台",
  "simulatorDesc": "交互式调节序列长度 N (1K~64K) 与 SRAM 分块大小 B_c，对比标准注意力与 FlashAttention 的 HBM 读写字节数与显存占用。",
  "architectureSteps": [
    {
      "id": "fa-step-1",
      "title": "1. GPU 存储金字塔分块 (SRAM Tiling)",
      "subtitle": "SRAM vs HBM Hierarchy Partitioning",
      "description": "根据片上 SRAM 容量 M（如每个 SM 192KB），将 Q, K, V 切分为大小为 B_r × d 与 B_c × d 的子块，确保单次子块运算完全驻留在 19TB/s 的 SRAM 内。",
      "highlightColor": "emerald"
    },
    {
      "id": "fa-step-2",
      "title": "2. 在线 Softmax 统计量递推更新",
      "subtitle": "Online Softmax Rescaling Trick",
      "description": "当扫到新的 Key 子块 K_j 时，计算新最大值 m_new = max(m_old, rowmax(S_ij))，并用缩放因子 e^{m_old - m_new} 即时修正此前累积的分子与分母！",
      "highlightColor": "cyan"
    },
    {
      "id": "fa-step-3",
      "title": "3. 算子内核全融合 (Kernel Fusion)",
      "subtitle": "Zero N×N HBM Materialization",
      "description": "将 MatMul(QK^T) → Scale → Mask → Dropout → Softmax → MatMul(PV) 全部融合进同一个 CUDA Kernel，HBM 上永远不会出现 N×N 矩阵。",
      "highlightColor": "amber"
    },
    {
      "id": "fa-step-4",
      "title": "4. 反向传播以重算换 IO 加速",
      "subtitle": "Fast Backward Recomputation",
      "description": "反向传播不再从 HBM 读取沉重的 P 矩阵，而是利用前向保存的 O(N) 统计量 (m, l) 在高速 SRAM 中即时重算局部注意力块，虽然 FLOPs 略增但总耗时大幅缩短！",
      "highlightColor": "purple"
    }
  ],
  "formulas": [
    {
      "id": "fa-f1",
      "name": "分块在线 Softmax 精确递推更新公式",
      "category": "在线归一化恒等式",
      "formula": "m^{(new)} = \\max(m^{(old)}, \\tilde{m}_{ij}), \\quad \\ell^{(new)} = e^{m^{(old)}-m^{(new)}}\\ell^{(old)} + e^{\\tilde{m}_{ij}-m^{(new)}}\\tilde{\\ell}_{ij}, \\quad \\mathbf{O}_i^{(new)} = \\text{diag}(\\ell^{(new)})^{-1}\\!\\left(\\text{diag}(\\ell^{(old)})e^{m^{(old)}-m^{(new)}}\\mathbf{O}_i^{(old)} + e^{\\tilde{m}_{ij}-m^{(new)}}\\tilde{\\mathbf{P}}_{ij}\\mathbf{V}_j\\right)",
      "explanation": "保证了即便每次只看见局部一块 K_j，最终流式累加出的输出 O_i 与看完全局再做 Softmax 的结果在数学上 100% 精确相等。",
      "variables": [
        {
          "symbol": "m, \\ell",
          "desc": "逐行维护的运行期最大值向量与指数分母累加和向量（仅占 O(N) 空间）"
        },
        {
          "symbol": "e^{m^{(old)}-m^{(new)}}",
          "desc": "当遇到更大得分时，对历史累加值执行的精确指数重缩放因子"
        }
      ]
    },
    {
      "id": "fa-f2",
      "name": "HBM 内存访问复杂度对比定理 (Theorem 2)",
      "category": "硬件 IO 复杂度",
      "formula": "\\text{HBM}_{\\text{Standard}} = \\Theta(Nd + N^2), \\qquad \\text{HBM}_{\\text{FlashAttention}} = \\Theta\\!\\left(\\frac{N^2 d^2}{M}\\right)",
      "explanation": "由于片上 SRAM 大小 M 远大于 d²（通常 d²/M ≪ 1/10），FlashAttention 将 HBM 读写次数减少了最高 9 倍以上，且证明该下界对所有精确注意力已达理论最优。",
      "variables": [
        {
          "symbol": "N, d",
          "desc": "序列长度 N 与注意力头维度 d (如 d=64 或 128)"
        },
        {
          "symbol": "M",
          "desc": "GPU 片上高速缓存 SRAM 容量"
        }
      ]
    }
  ],
  "metricCards": [
    {
      "label": "注意力激活显存复杂度",
      "value": "O(N²) ➔ O(N) 线性",
      "desc": "彻底消灭 N×N 显存墙，显存节省高達 10x ~ 20x",
      "color": "emerald"
    },
    {
      "label": "端到端训练与推理加速",
      "value": "3.0x ~ 7.6x 提速",
      "desc": "GPT-2 训练提速 3.5 倍，长序列块稀疏版提速 7.6 倍",
      "color": "cyan"
    },
    {
      "label": "数值计算精确度",
      "value": "100% Exact (非近似)",
      "desc": "与标准注意力数学完全等价，无任何稀疏或低秩精度损失",
      "color": "amber"
    },
    {
      "label": "HBM 显存读写字节削减",
      "value": "最高减少 9.1x",
      "desc": "越过带宽墙，将注意力从 Memory-bound 转化为高效计算",
      "color": "purple"
    }
  ],
  "experimentSections": [
    {
      "title": "不同序列长度下标准 PyTorch Attention 与 FlashAttention 显存与延迟对比 (A100-80GB)",
      "description": "随序列长度 N 从 1K 增至 64K，标准实现迅速 OOM 崩溃，而 FlashAttention 保持线性显存增长与数倍加速。",
      "headers": [
        "序列长度 N",
        "标准 Attention 显存 / 耗时",
        "FlashAttention 显存 / 耗时",
        "显存节省与加速比"
      ],
      "rows": [
        [
          "N = 1,024 (1K)",
          "0.32 GB / 2.8 ms",
          "0.06 GB / 0.8 ms",
          "省 5.3x 显存 • 3.5x 加速"
        ],
        [
          "N = 4,096 (4K)",
          "4.80 GB / 41.2 ms",
          "0.24 GB / 7.9 ms",
          "省 20.0x 显存 • 5.2x 加速"
        ],
        [
          "N = 16,384 (16K)",
          "76.8 GB (濒临OOM) / 645 ms",
          "0.96 GB / 108 ms",
          "省 80.0x 显存 • 6.0x 加速"
        ],
        [
          "N = 65,536 (64K 超长文本)",
          "OOM 崩溃 (需 1,228 GB!)",
          "3.84 GB / 1,680 ms (稳定运行!)",
          "解锁百万级长上下文能力"
        ]
      ]
    }
  ],
  "insights": [
    {
      "title": "为什么「多算一遍 FLOPs（重计算）」反而让反向传播跑得更快？",
      "content": "这颠覆了传统算法教科书的直觉：在现代 GPU（如 A100/H100）上，浮点矩阵乘法的速度比从 HBM 显存读取数据的速度快出几十倍！FlashAttention 反向传播故意不存 N×N 的 P 矩阵，省掉了从 HBM 读取海量矩阵的漫长等待，在 SRAM 里顺手重算一遍 QK^T 反而使总墙钟时间（Wall-clock Time）大幅下降！"
    },
    {
      "title": "从 FlashAttention-1 到 FlashAttention-2 / 3 的进化主线",
      "content": "FA-2 调整了内外层循环顺序（将 Q 放外层、K/V 放内层以减少输出累加的原子写）并实现序列维度并行；FA-3 更进一步利用 H100 Hopper 架构的异步 TMA（张量内存加速器）与 FP8 Tensor Core，将 GPU 利用率推高至 75% 以上。"
    }
  ],
  "takeaways": [
    {
      "icon": "Zap",
      "title": "算得快不如搬得少",
      "desc": "现代 AI 系统优化的第一铁律：瓶颈往往不在 FLOPs，而在 HBM 显存读写字节数（IO-Awareness）。"
    },
    {
      "icon": "Layers",
      "title": "Online Softmax 的神来之笔",
      "desc": "用指数重缩放因子打破了 Softmax 必须先扫完全局才能归一化的串行枷锁。"
    },
    {
      "icon": "Maximize2",
      "title": "长上下文时代的真正推手",
      "desc": "没有 FlashAttention 把 O(N²) 显存拍扁成 O(N)，今日的 128K/1M 长文本大模型根本无法训练。"
    },
    {
      "icon": "CheckCircle",
      "title": "PyTorch 2.0+ 官方内置",
      "desc": "已作为 torch.nn.functional.scaled_dot_product_attention 的底层默认内核。"
    }
  ]
};

export const PAPER_DATA: UniversalPaperData = FLASHATTENTION_2022_DATA;
export default PAPER_DATA;
