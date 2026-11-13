import { UniversalPaperData } from "../../../../src/shared/types/universalPaper.js";

export const QLORA_2023_DATA: UniversalPaperData = {
  "id": "qlora-2023",
  "title": "QLoRA: Efficient Finetuning of Quantized LLMs",
  "chineseTitle": "QLoRA 量化低秩微调：单张 48GB 显卡微调 65B 大模型的开源微调破局之作",
  "subtitle": "Tim Dettmers, Artidoro Pagnoni, Ari Holtzman, Luke Zettlemoyer • University of Washington • NeurIPS 2023",
  "tags": [
    "QLoRA",
    "4-bit NormalFloat (NF4)",
    "Double Quantization 双重量化",
    "Paged Optimizers 分页优化器",
    "单卡微调 65B"
  ],
  "arxivId": "2305.14314",
  "pdfUrl": "https://arxiv.org/pdf/2305.14314.pdf",
  "abstractUrl": "https://arxiv.org/abs/2305.14314",
  "summary": "彻底推动全球开源社区大模型微调平民化的里程碑论文！此前全量微调 65B 模型需要超过 780GB 显存（至少 10 张 80GB A100），即便普通 16-bit LoRA 也无法塞进单张消费级/工作站显卡。QLoRA 提出将预训练底座权重冻结并量化为信息论最优的「4-bit NormalFloat (NF4)」格式，配合对量化常数再次量化的「双重量化（Double Quantization）」以及利用统一内存防爆显存的「分页优化器（Paged Optimizers）」，反向传播梯度只流经 BF16 的 LoRA 低秩旁路。首次实现在单张 48GB 显卡上无损微调 65B 大模型（Guanaco-65B 达到 ChatGPT 99.3% 性能）！",
  "keyContributions": [
    "提出信息论最优的数据类型 4-bit NormalFloat (NF4)：利用预训练权重严格服从零均值正态分布的统计特性，按高斯分位数等概率切分 16 个量化桶",
    "发明双重量化（Double Quantization）：对第一级分块（Blocksize=64）产生的 FP32 缩放常数 c_2 再进行一次 8-bit 量化，每参数再省 0.373 bits",
    "引入基于 NVIDIA Unified Memory 的分页优化器（Paged Optimizers），在长序列梯度尖峰时自动将优化器状态换出至 CPU 内存，彻底消除 OOM",
    "存储用 4-bit NF4、计算时动态反量化为 16-bit BF16，证明 4-bit QLoRA 在学术与对话基准上 100% 追平 16-bit 全量微调"
  ],
  "coreProblem": "虽然 LoRA 省掉了主干权重的优化器状态，但 65B 模型的 FP16 冻结主干权重本身就要占用 130GB 显存，再加上长序列激活梯度峰值，普通开发者手头的 24GB RTX 3090/4090 或 48GB A6000 根本无法加载并微调 33B/65B 级别的大模型。",
  "coreIdea": "把「存储精度」与「计算精度」彻底解耦！冻结的百亿主干权重平时以信息熵最高的 4-bit NF4 压缩躺在显存里（65B 仅需约 33GB）；前向和反向计算经过某层时，在 CUDA 寄存器内即时反量化（Dequantize）为 BF16 与输入相乘，而所有梯度和更新只发生在仅占 1% 参数量的 BF16 LoRA 旁路上！",
  "simulatorTitle": "QLoRA NF4 分位数量化与单卡显存账本模拟器",
  "simulatorDesc": "交互式切换模型尺寸 (7B~70B) 与量化模式 (16-bit Full FT / 16-bit LoRA / 4-bit QLoRA)，实时计算单卡显存分布。",
  "architectureSteps": [
    {
      "id": "qlora-step-1",
      "title": "1. 高斯等概率分位数 NF4 编码",
      "subtitle": "Information-Theoretically Optimal NF4",
      "description": "根据标准正态分布 N(0,1) 的累积分布逆函数 Φ^{-1}，将 [-1, 1] 划分为概率面积严格相等的 16 个分位点（权重密集的 0 附近刻度极密，尾部刻度较疏）。",
      "highlightColor": "emerald"
    },
    {
      "id": "qlora-step-2",
      "title": "2. 分块双重量化压缩常数开销",
      "subtitle": "Block-wise Double Quantization",
      "description": "每 64 个权重共享一个 FP32 缩放因子 c^{(2)}（原本需 32/64 = 0.5 bits/param 额外开销）；将每 256 个 c^{(2)} 再量化为 FP8，将该开销压至 0.127 bits/param。",
      "highlightColor": "cyan"
    },
    {
      "id": "qlora-step-3",
      "title": "3. 即时 BF16 反量化与 LoRA 旁路梯度",
      "subtitle": "On-the-Fly BF16 Dequantization & LoRA Grad",
      "description": "计算 Y = X · doubleDequant(W^{NF4}) + X · L_1 L_2，反量化后的 BF16 权重用完即弃，反向梯度 ∂L/∂L_i 仅更新全精度 LoRA 矩阵。",
      "highlightColor": "amber"
    },
    {
      "id": "qlora-step-4",
      "title": "4. 分页优化器抗长序列显存峰值",
      "subtitle": "Paged Optimizers via CUDA Unified Memory",
      "description": "当遇到超长样本导致激活显存瞬时触顶时，自动将 Adam 状态页透明迁移至主机内存（CPU RAM），待前向/反向峰值过去后再迁回 GPU。",
      "highlightColor": "purple"
    }
  ],
  "formulas": [
    {
      "id": "qlora-f1",
      "name": "NF4 正态分布等概率分位数构造方程",
      "category": "信息论最优量化",
      "formula": "q_i = \\frac{1}{2} \\left( Q_X\\!\\left(\\frac{i}{2^k + 1}\\right) + Q_X\\!\\left(\\frac{i+1}{2^k + 1}\\right) \\right), \\quad X \\sim \\mathcal{N}(0, 1), \\; k=4",
      "explanation": "通过高斯分位数函数 Q_X 保证每个 4-bit 编码桶被分配到的权重数量期望值严格相等，达到信息论最小量化失真。",
      "variables": [
        {
          "symbol": "Q_X(p)",
          "desc": "标准正态分布的分位数函数（逆累积分布函数 Φ^{-1}）"
        },
        {
          "symbol": "q_i",
          "desc": "归一化到 [-1, 1] 并强制包含精确 0 点的 16 个 NF4 离散代表值"
        }
      ]
    },
    {
      "id": "qlora-f2",
      "name": "QLoRA 线性层双重量化反解与前向方程",
      "category": "前向与反量化",
      "formula": "\\mathbf{Y}^{\\text{BF16}} = \\mathbf{X}^{\\text{BF16}} \\cdot \\text{dequant}\\!\\left(\\text{dequant}(c_1^{\\text{FP32}}, c_2^{\\text{FP8}}),\\; \\mathbf{W}^{\\text{NF4}}\\right) + \\mathbf{X}^{\\text{BF16}} \\mathbf{L}_1^{\\text{BF16}} \\mathbf{L}_2^{\\text{BF16}}",
      "explanation": "主干权重存储于 4.127 bits/param，计算全程运行在 BF16 精度下，完全不损失微调表达力。",
      "variables": [
        {
          "symbol": "\\mathbf{W}^{\\text{NF4}}",
          "desc": "冻结的 4-bit NormalFloat 主干权重矩阵"
        },
        {
          "symbol": "c_1^{\\text{FP32}}, c_2^{\\text{FP8}}",
          "desc": "双重量化的两级缩放常数"
        },
        {
          "symbol": "\\mathbf{L}_1, \\mathbf{L}_2",
          "desc": "插入在全部线性层的 BF16 可训练 LoRA 适配器矩阵"
        }
      ]
    }
  ],
  "metricCards": [
    {
      "label": "65B 模型微调显存需求",
      "value": "780GB ➔ < 41GB",
      "desc": "显存缩减超 19 倍，单张 48GB A6000 即可跑通 65B 微调",
      "color": "emerald"
    },
    {
      "label": "双重量化每参数净省",
      "value": "0.373 bits/param",
      "desc": "65B 模型仅量化常数一项就额外节省约 3.1 GB 显存",
      "color": "cyan"
    },
    {
      "label": "16-bit 全量微调精度恢复",
      "value": "100.0% 无损追平",
      "desc": "4-bit NF4 QLoRA 在 MMLU 与 Vicuna 基准上完全追平 16-bit",
      "color": "amber"
    },
    {
      "label": "Guanaco-65B 对话胜率",
      "value": "ChatGPT 的 99.3%",
      "desc": "仅在单卡训练 24 小时即达到商用闭源旗舰对话水平",
      "color": "purple"
    }
  ],
  "experimentSections": [
    {
      "title": "不同精度与量化格式在 LLaMA 微调上的 MMLU 5-shot 精度与显存对比",
      "description": "证明普通 Int4 与 FP4 在低比特下会产生明显精度跌落，唯有结合 NF4 + 全线性层 LoRA 才能 100% 恢复 16-bit 性能。",
      "headers": [
        "微调方法与权重格式",
        "65B 模型显存峰值 (↓)",
        "平均每参数比特数",
        "LLaMA-7B/65B MMLU 准确率 (↑)"
      ],
      "rows": [
        [
          "16-bit Full Finetuning (全量微调)",
          "780.0 GB (需10×A100)",
          "16.00 bits (主干) + 128 bits (状态)",
          "35.1% / 58.3%"
        ],
        [
          "4-bit Int4 + LoRA (均匀整数分桶)",
          "41.2 GB",
          "4.50 bits",
          "31.9% / 54.8% (精度明显受损)"
        ],
        [
          "4-bit FP4 + LoRA (标准四位浮点)",
          "41.2 GB",
          "4.50 bits",
          "33.4% / 56.7%"
        ],
        [
          "4-bit NF4 + DQ (QLoRA 本文方案)",
          "38.1 GB (单卡48GB轻松跑)",
          "4.127 bits",
          "35.2% / 58.4% (100% 恢复全精度!)"
        ]
      ]
    }
  ],
  "insights": [
    {
      "title": "为什么在 QLoRA 中必须给「所有线性层」都加上 LoRA，而不能只加 Q 和 V？",
      "content": "原版 16-bit LoRA 往往只对 Attention 的 W_q 和 W_v 注入低秩矩阵；但论文通过严谨消融发现，当主干被压缩到 4-bit 后，必须在 Attention 和 FFN/MLP 的全部线性投影层（q, k, v, o, gate, up, down）都挂载 LoRA 旁路，才能完全补偿量化残差并追平全量微调！"
    },
    {
      "title": "为什么 QLoRA 比 16-bit LoRA 训练速度略慢约 25%~30%，业界依然全民采用？",
      "content": "因为前向和反向传播每次都需要执行 NF4 → BF16 的动态反量化计算，会带来约 25% 的时间开销；但换来的是原本根本跑不起来的 33B/70B 模型现在能在单张消费级显卡上微调——这是从「0 到 1」的质变！"
    }
  ],
  "takeaways": [
    {
      "icon": "Cpu",
      "title": "开源微调普及的最大功臣",
      "desc": "一张 RTX 3090/4090 微调 33B、一张 48GB 卡微调 65B/70B 成为全球开发者日常。"
    },
    {
      "icon": "BarChart2",
      "title": "NF4 契合高斯权重天性",
      "desc": "利用神经网络权重天然服从零均值正态分布的规律，榨干 4 个比特的每一分信息熵。"
    },
    {
      "icon": "Layers",
      "title": "存储 4-bit，计算 16-bit",
      "desc": "冻结权重用 NF4 省显存，激活与梯度用 BF16 保精度，鱼与熊掌兼得。"
    },
    {
      "icon": "Shield",
      "title": "全线性层挂载铁律",
      "desc": "实践 QLoRA 时切记设置 target_modules=\"all-linear\" 以获得媲美全量微调的效果。"
    }
  ]
};

export const PAPER_DATA: UniversalPaperData = QLORA_2023_DATA;
export default PAPER_DATA;
