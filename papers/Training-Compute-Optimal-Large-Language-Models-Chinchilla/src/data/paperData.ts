import { UniversalPaperData } from "../../../../src/shared/types/universalPaper.js";

export const CHINCHILLA_2022_DATA: UniversalPaperData = {
  "id": "chinchilla-2022",
  "title": "Training Compute-Optimal Large Language Models (Chinchilla)",
  "chineseTitle": "Chinchilla 算力最优扩展定律：颠覆大模型参数与训练数据配比法则",
  "subtitle": "Jordan Hoffmann, Sebastian Borgeaud, Arthur Mensch, Laurent Sifre et al. • DeepMind • NeurIPS 2022",
  "tags": [
    "Chinchilla Scaling Laws",
    "算力最优 C≈6ND",
    "D ≈ 20N 黄金配比",
    "参数规模 vs 数据量",
    "推翻 Kaplan 定律"
  ],
  "arxivId": "2203.15556",
  "pdfUrl": "https://arxiv.org/pdf/2203.15556.pdf",
  "abstractUrl": "https://arxiv.org/abs/2203.15556",
  "summary": "彻底改写全球大模型研发路线图、买卡与买数据预算分配的里程碑论文！此前 OpenAI 的 Kaplan 扩展定律（2020）认为算力增加 10 倍应将模型参数放大 5.5 倍而数据仅增加 1.8 倍，导致业界盲目追求巨型参数（如 175B GPT-3、280B Gopher 却只训了 300B Tokens）。DeepMind 训练了超过 400 个不同尺寸模型后严格证明：模型参数量 N 与训练 Token 数 D 应当【等比例同步放大】（每个参数约匹配 20 个训练 Token）！据此训练的 70B Chinchilla（1.4T Tokens）在消耗完全相同训练算力下全面碾压 4 倍规模的 280B Gopher，同时将推理成本直降 75%！",
  "keyContributions": [
    "修正了 OpenAI Kaplan 定律因固定学习率余弦周期导致的系统性偏差，确立 N_opt ∝ C^{0.5}、D_opt ∝ C^{0.5} 的等比例扩展法则",
    "提出参数化损失预测方程 L(N, D) = E + A/N^α + B/D^β，精准量化模型容量瓶颈、数据不足瓶颈与自然语言固有熵",
    "确立大模型工程黄金经验法则：算力最优训练要求 D ≈ 20N（每 1B 参数至少喂入 20B 高质量 Tokens）",
    "实证训练出 70B 参数 Chinchilla（配 1.4T Tokens），在与 280B Gopher（300B Tokens）相同 FLOPs 下实现 MMLU 67.5% (+7.6% 跃升)"
  ],
  "coreProblem": "2020-2022 年间，各大实验室遵循 Kaplan 定律将算力预算几乎全砸向扩充参数量（175B GPT-3、280B Gopher、530B MT-NLG），而训练数据量全部停滞在 300B Tokens 左右，导致这些巨无霸模型处于严重的「欠训练（Under-trained）」状态，不仅未发挥算力潜力，还造成推理部署成本奇高。",
  "coreIdea": "在给定总训练算力预算 C ≈ 6ND (FLOPs) 的约束下求解最小化交叉熵损失 L(N, D)。当余弦学习率衰减周期精确匹配真实训练总步数时，算力每增加 10 倍，模型参数量 N 与训练数据 Token 数 D 必须各自放大 √10 ≈ 3.16 倍。",
  "simulatorTitle": "Chinchilla 算力最优配比 (N vs D) 与过训练权衡模拟器",
  "simulatorDesc": "输入算力预算 C (FLOPs) 或目标参数规模 N，对比 Kaplan 旧定律、Chinchilla 算力最优与 LLaMA 推理最优配比。",
  "architectureSteps": [
    {
      "id": "chin-step-1",
      "title": "1. 训练算力硬约束建模 C ≈ 6ND",
      "subtitle": "IsoFLOP Compute Constraint",
      "description": "Transformer 每个参数在每个 Token 上的前向传播约需 2 FLOPs，反向传播约需 4 FLOPs，总训练算力 C = 6 · N · D。",
      "highlightColor": "emerald"
    },
    {
      "id": "chin-step-2",
      "title": "2. 固定算力切片实验 (IsoFLOP Profiles)",
      "subtitle": "400+ Model IsoFLOP Sweeps",
      "description": "在 9 个固定 FLOPs 档位下，变动模型尺寸 N（70M 至 16B）与对应 Token 数 D = C/(6N)，拟合每个算力档位的 U 型损失曲线最低点。",
      "highlightColor": "cyan"
    },
    {
      "id": "chin-step-3",
      "title": "3. 双幂律损失曲面拟合 L(N, D)",
      "subtitle": "Parametric Loss Surface Fitting",
      "description": "利用 L-BFGS 拟合 L(N,D) = E + A/N^α + B/D^β，得出 α ≈ 0.34, β ≈ 0.28，证明参数与数据对降低 Loss 的边际贡献几乎相等。",
      "highlightColor": "amber"
    },
    {
      "id": "chin-step-4",
      "title": "4. 算力最优与推理最优演进",
      "subtitle": "Compute-Optimal vs Inference-Optimal (LLaMA)",
      "description": "按 D ≈ 20N 训练 70B Chinchilla 超越 280B Gopher；并启发后续 LLaMA 将数据拉高至 200N~1000N，用训练算力换取极致小模型推理性能。",
      "highlightColor": "purple"
    }
  ],
  "formulas": [
    {
      "id": "chin-f1",
      "name": "Chinchilla 双变量幂律损失方程",
      "category": "扩展定律建模",
      "formula": "L(N, D) = E + \\frac{A}{N^\\alpha} + \\frac{B}{D^\\beta} \\quad (E=1.69,\\; A=406.4,\\; B=410.7,\\; \\alpha=0.34,\\; \\beta=0.28)",
      "explanation": "任何有限规模与有限数据的语言模型损失都由三部分相加：自然语言不可约熵 E、有限参数近似误差 A/N^α 与有限样本估计误差 B/D^β。",
      "variables": [
        {
          "symbol": "N",
          "desc": "模型参数量（Parameters）"
        },
        {
          "symbol": "D",
          "desc": "训练数据总词元数（Training Tokens）"
        },
        {
          "symbol": "E",
          "desc": "无限大模型在无限数据上的自然语言理论下界熵 (1.69 nats)"
        }
      ]
    },
    {
      "id": "chin-f2",
      "name": "算力约束下的拉格朗日最优分配解",
      "category": "最优资源分配",
      "formula": "\\min_{N, D} L(N, D) \\;\\text{ s.t. }\\; 6ND = C \\implies N_{\\text{opt}}(C) \\propto C^{\\frac{\\beta}{\\alpha+\\beta}} \\approx C^{0.50}, \\quad D_{\\text{opt}}(C) \\propto C^{\\frac{\\alpha}{\\alpha+\\beta}} \\approx C^{0.50}",
      "explanation": "推导出最优配比系数 D_opt ≈ 20 × N_opt，即每 10 亿参数应匹配约 200 亿训练 Token。",
      "variables": [
        {
          "symbol": "C",
          "desc": "总训练浮点预算（FLOPs），满足 C ≈ 6ND"
        },
        {
          "symbol": "D_{\\text{opt}} / N_{\\text{opt}}",
          "desc": "黄金 Token/Parameter 比值 ≈ 20:1"
        }
      ]
    }
  ],
  "metricCards": [
    {
      "label": "黄金 Token/参数配比",
      "value": "D ≈ 20 × N",
      "desc": "每 1B 参数至少需要 20B 训练 Tokens 才能达到算力最优",
      "color": "emerald"
    },
    {
      "label": "Chinchilla (70B) MMLU",
      "value": "67.5% (+7.6%)",
      "desc": "以 1/4 参数量大幅超越同算力的 280B Gopher (59.9%)",
      "color": "cyan"
    },
    {
      "label": "在线推理显存与成本",
      "value": "直降 75% (4倍加速)",
      "desc": "70B 模型仅需 1/4 显卡即可部署，吞吐量提升 4 倍",
      "color": "amber"
    },
    {
      "label": "拟合实验模型总数",
      "value": "400+ 组预训练模型",
      "desc": "横跨 70M 到 16B 参数、9 个算力数量级的严密实证",
      "color": "purple"
    }
  ],
  "experimentSections": [
    {
      "title": "同等训练算力 (C ≈ 5.76 × 10²³ FLOPs) 下各大旗舰模型配比与性能对比",
      "description": "证明在相同算力预算下，削减虚胖参数并补充 4.6 倍训练数据能同时赢得更高智能与更低推理成本。",
      "headers": [
        "模型名称",
        "参数规模 N",
        "训练数据量 D (Tokens)",
        "MMLU 5-shot 准确率 (↑)"
      ],
      "rows": [
        [
          "GPT-3 (OpenAI, Kaplan配比)",
          "175B (严重欠训练)",
          "300B (仅 1.7 Tokens/Param)",
          "43.9%"
        ],
        [
          "Gopher (DeepMind, 旧配比)",
          "280B (严重欠训练)",
          "300B (仅 1.1 Tokens/Param)",
          "60.0%"
        ],
        [
          "MT-NLG (Megatron-Turing)",
          "530B (极度欠训练)",
          "270B (仅 0.5 Tokens/Param)",
          "56.5%"
        ],
        [
          "Chinchilla (本文算力最优配比)",
          "70B (参数缩减75%)",
          "1,400B (20 Tokens/Param)",
          "67.5% (全线超越!)"
        ]
      ]
    }
  ],
  "insights": [
    {
      "title": "为什么 Kaplan (2020) 当年算错了缩放指数？",
      "content": "Kaplan 实验对所有训练步数都使用了固定的长周期余弦学习率衰减，导致短步数小数据实验在训练结束时学习率未能充分衰减到 0，人为高估了大参数在少数据下的优势。Hoffmann 等人确保每次实验的余弦周期 T 严格等于总训练 Token 数 D，一举纠正了这一历史偏差。"
    },
    {
      "title": "从 Chinchilla 训练最优到 LLaMA-3 推理最优（Over-training）",
      "content": "Chinchilla 优化的是「训练算力 C_train 最小」，但在工业服务中模型训一次却要被亿万用户推理调用。因此 LLaMA-3 8B 甚至喂了 15T Tokens（D ≈ 1875N），用超额训练算力把 8B 小模型压榨到极致，以节省长期推理电费。"
    }
  ],
  "takeaways": [
    {
      "icon": "Scale",
      "title": "买卡与买数据按这篇算",
      "desc": "算力翻 10 倍，参数 N 和数据 D 必须各翻 3.16 倍，单堆参数只会造出昂贵的欠训练模型。"
    },
    {
      "icon": "TrendingUp",
      "title": "70B 击败 280B 的奇迹",
      "desc": "给 70B 喂饱 1.4T 数据，不仅智商全面超越 280B，推理显存还立省 3/4。"
    },
    {
      "icon": "Database",
      "title": "引爆高质量数据争夺战",
      "desc": "Chinchilla 之后，全球大模型竞争重心从「谁能堆出万亿稠密参数」全面转向「谁能洗出十万亿高质量 Token」。"
    },
    {
      "icon": "Cpu",
      "title": "开启小而精的开源纪元",
      "desc": "直接启发了 LLaMA、Mistral 与 Qwen 系列用海量 Token 精炼 7B~70B 黄金尺寸模型。"
    }
  ]
};

export const PAPER_DATA: UniversalPaperData = CHINCHILLA_2022_DATA;
export default PAPER_DATA;
