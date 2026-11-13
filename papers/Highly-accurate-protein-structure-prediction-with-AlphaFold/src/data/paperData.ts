import { UniversalPaperData } from "../../../../src/shared/types/universalPaper.js";

export const ALPHAFOLD2_2021_DATA: UniversalPaperData = {
  "id": "alphafold2-2021",
  "title": "Highly accurate protein structure prediction with AlphaFold (AlphaFold2)",
  "chineseTitle": "AlphaFold2 蛋白质三维结构预测：破解五十年生物学世纪难题的诺贝尔化学奖里程碑",
  "subtitle": "John Jumper, Richard Evans, Alexander Pritzel, Tim Green, Michael Figurnov, Olaf Ronneberger, Demis Hassabis et al. • DeepMind • Nature 2021 (2024 诺贝尔化学奖)",
  "tags": [
    "AlphaFold2 (2024诺贝尔化学奖)",
    "Evoformer 序列与成对协同演化",
    "Triangle Attention 三角形不等式几何偏置",
    "IPA 不变点注意力 (SE(3)等变)",
    "0.96 Å 原子级精度"
  ],
  "arxivId": "Nature 596, 583–589 (2021)",
  "pdfUrl": "https://www.nature.com/articles/s41586-021-03819-2.pdf",
  "abstractUrl": "https://doi.org/10.1038/s41586-021-03819-2",
  "summary": "AI for Science 史上最伟大的丰碑，荣膺 2024 年诺贝尔化学奖！自 1972 年安芬森法则提出「蛋白质的一维氨基酸序列唯一决定其三维空间折叠构象」以来，如何从序列直接预测三维原子坐标困扰了全球生物学界整整 50 年（原本测定一个蛋白质晶体结构需耗资数万美金、历时数月乃至数年）。DeepMind 团队摒弃了传统的二次图卷积与昂贵的分子动力学能量最小化，针对三维几何物理规律定制了三大传奇模块：(1) Evoformer 双轨交换主干：让多序列比对表征（MSA Representation，捕捉跨物种协同突变进化线索）与残基成对距离表征（Pair Representation，捕捉二维空间关系）在 48 层内双向持续通信；(2) 三角形乘法更新与三角形自注意力（Triangle Attention）：将三维欧氏空间距离必须满足的「三角形两边之和大于第三边（Triangle Inequality）」作为归纳偏置直接熔铸进注意力机制；(3) 三维等变结构模块（Structure Module + Invariant Point Attention, IPA）：将每个氨基酸残基视为三维空间中的刚体坐标系（Backbone Gas / Frames (R_i, t_i)），在 SE(3) 旋转平移不变性下一步直出全部重原子三维坐标！在 CASP14 国际盲测竞赛中将中位骨架误差从历史最佳的 2.8 Å 暴力压降至 0.96 Å（小于单个碳原子半径 1.4 Å），并随后开源预测了地球上已知的 2 亿+ 种蛋白质结构！",
  "keyContributions": [
    "提出 48 层 Evoformer 双塔交互编码器：打通「进化序列信息（MSA N_seq × N_res）」与「三维空间几何关系（Pair N_res × N_res）」，通过外积均值（Outer Product Mean）与偏置行注意力实现进化协同突变与空间距离约束的双向闭环强化",
    "发明遵循三维几何约束的「三角形乘法更新（Triangular Multiplicative Update）」与「三角形自注意力（Triangular Self-Attention）」：在成对表征图上围绕每条边 (i, j) 聚合所有第三顶点 k 构成的三角形边 (i, k) 与 (k, j)，隐式强制执行三维欧氏空间三角形不等式",
    "首创 SE(3) 等变三维结构模块与不变点注意力（Invariant Point Attention, IPA）：将每个残基建模为自由漂浮的局部刚体参考系 T_i = (R_i, t_i)（\"Residue Gas\"），在局部坐标系下计算 3D 查询/键点距离，天然对全局旋转与平移保持严格几何不变性",
    "引入迭代循环微调（Iterative Recycling，将前一次预测的三维距离与特征重新输回网络迭代 3 次）与无标签序列自蒸馏（Self-Distillation），在 CASP14 斩获 92.4 GDT_TS、中位骨架偏差仅 0.96 Å，达到实验冷冻电镜与 X 射线晶体衍射的原子级精度"
  ],
  "coreProblem": "一条包含数百个氨基酸的蛋白质长链在理论上拥有 10^{300} 种可能的空间折叠构象（Levinthal 悖论）。传统的二维卷积或普通一维 Transformer 既无法保证预测出的成对距离矩阵能够在真实三维物理空间中无矛盾地拼装起来（违反几何三角形不等式），又无法直接处理三维刚体坐标在全局旋转平移下的对称不变性。",
  "coreIdea": "把生物进化的「协同突变密码」和三维空间的「几何刚体物理定律」写进 Transformer 的骨血里！第一，如果在漫长进化中第 i 号氨基酸一旦突变、第 j 号氨基酸也总是跟着突变（MSA 协同进化），说明 i 和 j 在三维空间里一定紧紧挨在一起！第二，在维护 i 和 j 的距离表征 z_{ij} 时，时刻拉上所有第三个氨基酸 k，按三角形 (i, j, k) 三条边做注意力更新（因为若 i 挨着 k 且 k 挨着 j，那 i 和 j 绝对不可能隔得很远）！第三，最后把每个氨基酸当成一架拥有自己机头方向和坐标的小飞机 T_i = (R_i, t_i)，用几何不变点注意力（IPA）直接飞到三维目标位置！",
  "simulatorTitle": "AlphaFold2 Evoformer 三角形注意力与 IPA 刚体折叠实验台",
  "simulatorDesc": "交互式调节同源多序列比对深度 (MSA N_seq)、三角形注意力开关与 Recycling 循环次数 (0~4次)，实时推演碳原子骨架 RMSD (Å)、GDT_TS 与 pLDDT 置信度。",
  "architectureSteps": [
    {
      "id": "af2-step-1",
      "title": "1. 基因库同源检索构造 MSA 与成对初始表征",
      "subtitle": "Genetic Database Search (MSA & Template Initialization)",
      "description": "从数十亿基因组数据库中检索跨物种同源序列构造多序列比对张量 MSA (N_seq × N_res × c_m)，同时初始化残基成对关系张量 Pair (N_res × N_res × c_z)。",
      "highlightColor": "emerald"
    },
    {
      "id": "af2-step-2",
      "title": "2. Evoformer 行列交叉注意力与外积双向通信",
      "subtitle": "48-Block Evoformer Dual-Track Information Exchange",
      "description": "MSA 轨道交替执行「行注意力（挂载 Pair 偏置）」与「列注意力（跨物种进化对比）」，随后通过 Outer Product Mean 将协同突变信号注入 Pair 轨道。",
      "highlightColor": "cyan"
    },
    {
      "id": "af2-step-3",
      "title": "3. 三角形乘法更新与三角形自注意力 (几何闭包)",
      "subtitle": "Triangular Multiplicative Update & Triangle Attention",
      "description": "在 Pair 轨道内部，把每个残基对 z_{ij} 视为图上的一条有向边，遍历所有第三节点 k 聚合入边与出边三角形 (i,k)-(k,j)，确保二维距离图严格满足三维欧氏空间可嵌入性。",
      "highlightColor": "amber"
    },
    {
      "id": "af2-step-4",
      "title": "4. IPA 不变点注意力与刚体帧全原子坐标生成",
      "subtitle": "Invariant Point Attention (IPA) & Frame Aligned Point Error (FAPE)",
      "description": "结构模块将 N_res 个残基初始化在原点，利用 8 层共享权重的 SE(3) 等变 IPA 预测每个残基刚体帧的旋转与平移更新 T_i ← T_i ∘ ΔT_i 及侧链扭转角，并以 FAPE 损失对齐真实三维原子坐标！",
      "highlightColor": "purple"
    }
  ],
  "formulas": [
    {
      "id": "af2-f1",
      "name": "Evoformer 三角形乘法更新与三角形自注意力偏置方程",
      "category": "三维几何归纳偏置",
      "formula": "\\Delta \\mathbf{z}_{ij}^{\\text{tri-mult}} = \\sigma(\\mathbf{g}_{ij}) \\odot \\text{LayerNorm}\\!\\left( \\sum_{k=1}^{N_{\\text{res}}} \\mathbf{a}_{ik} \\odot \\mathbf{b}_{kj} \\right), \\qquad \\alpha_{ijk}^{\\text{tri-att}} = \\text{Softmax}_k\\!\\left( \\frac{1}{\\sqrt{c}} \\mathbf{q}_{ij}^T \\mathbf{k}_{ik} + \\mathbf{b}_{jk} \\right)",
      "explanation": "通过显式枚举所有中间残基 k 构成的三角形 (i, j, k)，将节点 k 到 j 的信息 b_{jk} 作为强几何偏置注入边 (i,j) 与 (i,k) 的注意力中，强制成对表征满足三维空间三角形不等式 d(i,j) ≤ d(i,k) + d(k,j)。",
      "variables": [
        {
          "symbol": "\\mathbf{z}_{ij} \\in \\mathbb{R}^{c_z}",
          "desc": "第 i 号与第 j 号氨基酸残基之间的成对几何关系表征向量"
        },
        {
          "symbol": "i, j, k",
          "desc": "构成空间三角形三个顶点的氨基酸残基索引"
        },
        {
          "symbol": "\\mathbf{b}_{jk}",
          "desc": "由第三条边 z_{jk} 线性投影产生的三角形几何闭合偏置项"
        }
      ]
    },
    {
      "id": "af2-f2",
      "name": "不变点注意力（IPA）与刚体帧对齐点误差（FAPE Loss）",
      "category": "SE(3) 几何等变建模",
      "formula": "a_{ij}^{\\text{IPA}} = \\text{Softmax}_j \\!\\left( \\frac{1}{\\sqrt{c}}\\mathbf{q}_i^T \\mathbf{k}_j + b_{ij} - \\frac{\\gamma_h w_C}{2} \\sum_{p=1}^{N_{\\text{pts}}} \\big\\| T_i \\circ \\mathbf{q}_i^p - T_j \\circ \\mathbf{k}_j^p \\big\\|^2 \\right), \\qquad \\mathcal{L}_{\\text{FAPE}} = \\frac{1}{N_{\\text{frames}} N_{\\text{atoms}}} \\sum_{i, j} \\min\\!\\left( d_{\\text{clamp}},\\; \\big\\| T_i^{-1} \\circ \\mathbf{x}_j - (T_i^{\\text{true}})^{-1} \\circ \\mathbf{x}_j^{\\text{true}} \\big\\| \\right)",
      "explanation": "因为对整条蛋白质施加任意全局刚体变换 T_global 时，|| (T_global ∘ T_i) ∘ q - (T_global ∘ T_j) ∘ k || = || T_i ∘ q - T_j ∘ k ||，所以 IPA 的注意力权重对全局旋转和平移 100% 严格不变！而 FAPE 损失在每个残基自己的局部坐标系 T_i^{-1} 下对齐所有原子坐标，连手性镜像（Chirality）都能完美区分！",
      "variables": [
        {
          "symbol": "T_i = (\\mathbf{R}_i, \\mathbf{t}_i) \\in SE(3)",
          "desc": "第 i 个氨基酸残基主链（N - Cα - C）定义的局部三维欧氏刚体变换帧"
        },
        {
          "symbol": "\\mathbf{q}_i^p, \\mathbf{k}_j^p \\in \\mathbb{R}^3",
          "desc": "在残基局部坐标系下生成的三维几何查询点与键点坐标"
        },
        {
          "symbol": "T_i^{-1} \\circ \\mathbf{x}_j",
          "desc": "将第 j 个原子的全局三维坐标转换到第 i 个残基的局部参考系中观测"
        }
      ]
    }
  ],
  "metricCards": [
    {
      "label": "CASP14 碳骨架中位误差",
      "value": "0.96 Å (达原子级精度)",
      "desc": "95% Cα RMSD 仅 0.96 埃（小于碳原子半径），次优方法高达 2.83 埃",
      "color": "emerald"
    },
    {
      "label": "CASP14 自由建模 GDT_TS",
      "value": "92.4 / 100 分",
      "desc": "突破 90 分实验晶体学黄金分界线，宣告五十年蛋白质折叠问题基本解决",
      "color": "cyan"
    },
    {
      "label": "全原子侧链误差",
      "value": "1.5 Å (含全部重原子)",
      "desc": "不仅预测主链骨架，更以极高精度同时恢复全部侧链旋转异构体构象",
      "color": "amber"
    },
    {
      "label": "科学影响与最高荣誉",
      "value": "2024 诺贝尔化学奖",
      "desc": "开源 AlphaFold DB 覆盖超 2 亿个物种蛋白质，彻底重塑全球生命科学",
      "color": "purple"
    }
  ],
  "experimentSections": [
    {
      "title": "CASP14 国际盲测竞赛与关键架构模块（Evoformer 三角形更新 / IPA / Recycling）消融实验",
      "description": "验证 AlphaFold2 相比人类历史上所有传统物理与深度学习方法断层式的领先幅度，以及各核心几何归纳偏置的贡献。",
      "headers": [
        "预测方法或消融配置",
        "核心几何与进化机制",
        "CASP14 中位主链误差 RMSD₉₅ (↓ 越低越准)",
        "CASP14 自由建模 GDT_TS 得分 (↑)"
      ],
      "rows": [
        [
          "CASP14 第二名最佳参赛团队 (Baker Lab 等)",
          "传统能量场 + 二维残差卷积距离图优化",
          "2.83 Å (约为 AF2 误差的 3 倍)",
          "62.5 GDT_TS"
        ],
        [
          "AlphaFold2 去掉三角形注意力与乘法更新 (消融)",
          "仅保留普通行列注意力，无三角形几何闭合",
          "1.65 Å (几何一致性显著下降)",
          "83.1 GDT_TS (-9.3分)"
        ],
        [
          "AlphaFold2 去掉 Iterative Recycling (N_cycle=0)",
          "单趟前向，无三维坐标距离反馈重注入",
          "1.38 Å (长程结构微调不足)",
          "86.8 GDT_TS (-5.6分)"
        ],
        [
          "AlphaFold2 完整架构 (Evoformer + IPA + Recycling)",
          "MSA/Pair 双轨 + 三角形注意力 + SE(3) IPA + 自蒸馏",
          "0.96 Å (小于单个原子宽度!)",
          "92.4 GDT_TS (诺贝尔奖级突破!)"
        ]
      ]
    }
  ],
  "insights": [
    {
      "title": "为什么在输出端，AlphaFold2 大胆切断了残基与残基之间的共价键连接，把它们当成一团互不相连的「自由漂浮气体（Residue Gas）」？",
      "content": "这是结构模块最反直觉却最聪明的设计：如果严格按照多肽链从第 1 个氨基酸到第 N 个氨基酸用扭转角串行连接，那么第 10 号氨基酸的一个微小角度误差（0.1°）就会像挥鞭子一样把第 100 到第 500 号氨基酸甩飞几十埃（杠杆效应导致梯度极其病态）！AlphaFold2 直接允许每个残基的刚体帧 T_i = (R_i, t_i) 在三维空间里独立自由移动，先把每个局部结构直接放到正确的空间位置上，最后仅用一个轻量的键长/键角违规惩罚（Violation Loss）把相邻残基拉拢焊死，优化曲面瞬间变得无比平滑！"
    },
    {
      "title": "为什么「把领域物理几何规律转化为注意力归纳偏置（Domain Inductive Bias in Attention）」是 AI for Science 的制胜法宝？",
      "content": "蛋白质三维结构数据库 PDB 里只有大约 17 万个已知结构，数据量远不如文本大模型里的万亿 Token。在有限的科学数据面前，如果只用通用的普通 Transformer 根本学不会三维欧氏几何与旋转对称性；正是因为 Jumper 和 Hassabis 团队把「三角形不等式（Triangle Attention）」和「SE(3) 局部坐标系不变性（IPA + FAPE）」硬编码进了注意力层，才用 17 万条数据炼出了超越人类五十年实验积累的科学奇迹！"
    }
  ],
  "takeaways": [
    {
      "icon": "Award",
      "title": "AI 斩获诺贝尔化学奖的巅峰之作",
      "desc": "0.96 埃原子级精度攻克五十年蛋白质折叠圣杯，将人类已知蛋白质结构版图扩充百万倍。"
    },
    {
      "icon": "Triangle",
      "title": "用三角形注意力锁死三维几何",
      "desc": "在二维成对表征图上围绕 (i, j, k) 三角形更新注意力，让预测距离天然符合三维欧氏空间法则。"
    },
    {
      "icon": "Compass",
      "title": "IPA 与 FAPE 征服三维旋转对称",
      "desc": "在每个氨基酸自己的局部刚体坐标系里算点距离和误差，任凭全局怎么旋转平移都岿然不动。"
    },
    {
      "icon": "RefreshCw",
      "title": "Recycling 开启模型隐式思考步",
      "desc": "把第一遍预测出的三维粗结构折返回输入端再跑 3 遍，相当于在三维空间里做迭代式思维链精修。"
    }
  ]
};

export const PAPER_DATA: UniversalPaperData = ALPHAFOLD2_2021_DATA;
export default PAPER_DATA;
