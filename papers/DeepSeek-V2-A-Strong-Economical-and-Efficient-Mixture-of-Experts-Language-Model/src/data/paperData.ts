import { UniversalPaperData } from "../../../../src/shared/types/universalPaper.js";

export const DEEPSEEK_V2_2024_DATA: UniversalPaperData = {
  "id": "deepseek-v2-2024",
  "title": "DeepSeek-V2: A Strong, Economical, and Efficient Mixture-of-Experts Language Model",
  "chineseTitle": "DeepSeek-V2：多头潜在注意力 (MLA) 与细粒度共享专家 (DeepSeekMoE) 的经济高效大模型革命",
  "subtitle": "DeepSeek-AI (深度求索) • arXiv 2024 (奠定 DeepSeek-V3 / R1 核心架构底座)",
  "tags": [
    "DeepSeek-V2",
    "MLA 多头潜在注意力",
    "KV Cache 压缩 93.3%",
    "解耦旋转编码 Decoupled RoPE",
    "DeepSeekMoE 细粒度+共享专家"
  ],
  "arxivId": "2405.04434",
  "pdfUrl": "https://arxiv.org/pdf/2405.0434.pdf",
  "abstractUrl": "https://arxiv.org/abs/2405.04434",
  "summary": "掀翻全球大模型 API 定价桌子、直接奠定后续 DeepSeek-V3 与 DeepSeek-R1 架构基座的现象级巨著！面对标准 Transformer 在长上下文推理时庞大的 KV Cache 显存瓶颈，以及传统 GQA/MQA 牺牲模型精度的无奈妥协，DeepSeek-V2 提出了革命性的「多头潜在注意力（Multi-head Latent Attention, MLA）」：通过将 Key 和 Value 联合低秩压缩为一个极小的潜在向量 c_t^{KV}（512维），并在推理时将上投影矩阵吸收进 W_Q 与 W_O 中，使 KV Cache 惊人地暴降 93.3%，同时性能反而超越标准多头注意力（MHA）！配合「细粒度专家切分 + 独立共享专家」的 DeepSeekMoE 架构（总参数 236B，每 Token 仅激活 21B），实现了训练成本降低 42.5%、最大生成吞吐量飙升 5.76 倍的工程奇迹！",
  "keyContributions": [
    "首创多头潜在注意力（MLA）：利用低秩键值联合压缩 c_t^{KV} = W^{DKV} h_t 将每个 Token 需缓存的 KV 元素从 2·n_h·d_h 压降至 d_c + d_R，KV Cache 削减高达 93.3%",
    "发现并攻克「RoPE 与低秩矩阵吸收冲突」难题：若直接对压缩后的 K 加 RoPE，中间出现位置依赖矩阵 R_{t-i} 导致无法将 W^{UK} 吸收进 W^Q；首创「解耦 RoPE（Decoupled RoPE）」单独用小维度 k_t^R 承载旋转位置信息",
    "设计 DeepSeekMoE 稀疏混合专家层：每层包含 2 个固定激活的「共享专家（捕获通用共性知识）」与 160 个路由专家中动态选 6 个的「细粒度专家（组合自由度高出千倍）」",
    "以 236B 总参数、21B 激活参数击败 70B~72B 稠密旗舰，训练成本较 DeepSeek 67B 降低 42.5%，单节点 8×H800 推理吞吐突破 50,000+ Tokens/s（提速 5.76 倍）"
  ],
  "coreProblem": "在长上下文与高并发推理中，传统 MHA 的 KV Cache 占用海量显存；虽然 GQA（分组查询注意力）和 MQA（多查询注意力）通过强行让多个头共享同一套 K/V 来砍显存，但这严重阉割了注意力的特征表达子空间，导致模型智商明显退化。如何才能「既要把 KV Cache 砍掉 90% 以上，又要让模型表达力比标准 MHA 更强」？",
  "coreIdea": "不要粗暴删减注意力头，而是对所有头的 Key 和 Value 做「低秩潜在空间联合压缩（MLA）」！在缓存时只存一个 512 维的紧致潜向量 c_t^{KV}（相当于仅 2.25 个头的开销）；更绝妙的是，在推理阶段根本不需要把 c_t^{KV} 展开回高维 K 和 V，而是利用矩阵乘法结合律，把展开矩阵 W^{UK} 直接左乘吸收进 Query 投影矩阵里，把 W^{UV} 吸收进输出投影矩阵里！",
  "simulatorTitle": "DeepSeek-V2 MLA 潜在向量吸收与 DeepSeekMoE 成本实验台",
  "simulatorDesc": "交互式调节注意力头数 n_h、潜在压缩维度 d_c (256~1024)、解耦 RoPE 维度 d_R 与激活专家数，实时对比 MHA / GQA / MLA 的 KV Cache 压缩率与吞吐加速。",
  "architectureSteps": [
    {
      "id": "ds2-step-1",
      "title": "1. 键值低秩潜在联合压缩 c_t^{KV}",
      "subtitle": "Low-Rank Key-Value Joint Compression",
      "description": "将隐藏状态 h_t (d=5120) 通过下投影矩阵 W^{DKV} 压缩为 d_c=512 维的潜在向量 c_t^{KV}，训练时由 W^{UK}, W^{UV} 恢复出 128 个头的完整 K 和 V。",
      "highlightColor": "emerald"
    },
    {
      "id": "ds2-step-2",
      "title": "2. 矩阵吸收律实现免展开推理",
      "subtitle": "Weight Absorption Trick (W^{UK} into W^Q)",
      "description": "推理计算 q_t^T k_i = (W^Q h_t)^T (W^{UK} c_i^{KV}) = (h_t^T W^Q W^{UK}) c_i^{KV}，提前将 W^{UK} 吸收进 W^Q、W^{UV} 吸收进 W^O，避免在推理时实例化高维 K/V！",
      "highlightColor": "cyan"
    },
    {
      "id": "ds2-step-3",
      "title": "3. 解耦旋转位置编码 (Decoupled RoPE)",
      "subtitle": "Decoupling Position-Sensitive RoPE Head",
      "description": "由于 RoPE 旋转矩阵 R_m 夹在 W^Q 与 W^{UK} 中间会阻断矩阵吸收，MLA 将每个头拆出 d_R=64 维专门施加 RoPE（所有头共享一个 k_t^R），其余 d_h=128 维不加 RoPE 实现完美吸收！",
      "highlightColor": "amber"
    },
    {
      "id": "ds2-step-4",
      "title": "4. DeepSeekMoE 细粒度与共享专家协同",
      "subtitle": "Fine-Grained Experts + Shared Expert Isolation",
      "description": "每层固定激活 2 个共享专家处理高频通用知识（避免路由专家重复学习冗余特征），并从 160 个细粒度路由专家中经设备受限路由（Device-Limited Routing）选出 Top-6 专精专家。",
      "highlightColor": "purple"
    }
  ],
  "formulas": [
    {
      "id": "ds2-f1",
      "name": "MLA 低秩压缩、解耦 RoPE 与矩阵吸收恒等式",
      "category": "多头潜在注意力 (MLA)",
      "formula": "\\mathbf{c}_t^{KV} = W^{DKV}\\mathbf{h}_t \\in \\mathbb{R}^{d_c}, \\quad \\mathbf{k}_t^R = \\text{RoPE}(W^{KR}\\mathbf{h}_t) \\in \\mathbb{R}^{d_h^R}, \\quad \\mathbf{q}_{t,i}^T \\mathbf{k}_{j,i} = \\underbrace{(\\mathbf{c}_t^Q W_{:,i}^{UQ\\,T} W_{:,i}^{UK})}_{\\text{吸收合并投影}} \\mathbf{c}_j^{KV} + (\\mathbf{q}_{t,i}^R)^T \\mathbf{k}_j^R",
      "explanation": "整层只需在 KV Cache 中存储 [c_t^{KV}; k_t^R] 共 512 + 64 = 576 个浮点数，相比标准 MHA 的 2 × 128 × 128 = 32,768 个元素暴减 93.3%（若与 d_h=128, n_h=128 的标准配置对比仅相当于 2.25 个 GQA 组）！",
      "variables": [
        {
          "symbol": "\\mathbf{c}_t^{KV}",
          "desc": "压缩后的键值共享潜在向量（d_c = 512）"
        },
        {
          "symbol": "\\mathbf{k}_t^R",
          "desc": "所有注意力头共享的解耦旋转位置 Key 向量（d_h^R = 64）"
        },
        {
          "symbol": "W^{UK}, W^{UV}",
          "desc": "推理时被分别吸收进 Query 投影与 Output 投影的键值上投影矩阵"
        }
      ]
    },
    {
      "id": "ds2-f2",
      "name": "DeepSeekMoE 共享专家与细粒度路由前向方程",
      "category": "混合专家架构 (MoE)",
      "formula": "\\mathbf{h}'_t = \\mathbf{u}_t + \\sum_{i=1}^{N_s} \\text{FFN}_i^{(s)}(\\mathbf{u}_t) + \\sum_{i=1}^{N_r} g_{i,t}\\,\\text{FFN}_i^{(r)}(\\mathbf{u}_t), \\qquad g_{i,t} = \\begin{cases} s_{i,t}, & s_{i,t} \\in \\text{Topk}(\\{s_{j,t}\\}, K_r) \\\\ 0, & \\text{otherwise} \\end{cases}",
      "explanation": "通过剥离 N_s=2 个常驻共享专家，让其余 N_r=160 个细粒度路由专家专注于正交的专业领域知识，激活参数仅 21B 却具备 236B 的知识容量。",
      "variables": [
        {
          "symbol": "N_s=2, N_r=160, K_r=6",
          "desc": "2个共享专家 + 160个路由专家中每 Token 激活 Top-6（总计激活 8 个细粒度专家）"
        },
        {
          "symbol": "s_{i,t} = \\text{Softmax}_i(\\mathbf{u}_t^T \\mathbf{e}_i)",
          "desc": "Token 对第 i 个路由专家的亲和度门控得分"
        }
      ]
    }
  ],
  "metricCards": [
    {
      "label": "KV Cache 显存削减率",
      "value": "-93.3% (压缩近15倍)",
      "desc": "每 Token 每层仅存 576 个元素，仅相当于 GQA 2.25 组的开销",
      "color": "emerald"
    },
    {
      "label": "最大生成吞吐量加速",
      "value": "5.76x 倍 (vs 67B)",
      "desc": "单台 8×H800 节点实测实际生成吞吐超过 50,000 Tokens/s",
      "color": "cyan"
    },
    {
      "label": "总参数 vs 激活参数",
      "value": "236B 总 / 21B 激活",
      "desc": "每 Token 仅激活 8.9% 参数，训练算力成本节省 42.5%",
      "color": "amber"
    },
    {
      "label": "MMLU 与中文基准表现",
      "value": "78.5% / 84.0%",
      "desc": "以 21B 激活算力全面超越 LLaMA-3 70B 与 Mixtral 8x22B",
      "color": "purple"
    }
  ],
  "experimentSections": [
    {
      "title": "注意力机制消融实验 (MHA vs GQA vs MLA) 与旗舰模型综合性价比对比",
      "description": "论文严密消融证明：GQA 和 MQA 省了 KV 缓存却显著伤及模型精度，而 MLA 在缓存比 GQA 更小的同时，精度反而超越全尺寸 MHA！",
      "headers": [
        "模型与注意力架构",
        "每 Token 每层 KV 缓存大小 (↓)",
        "激活参数 / 总参数",
        "MMLU 准确率 (↑) & 生成吞吐"
      ],
      "rows": [
        [
          "Standard MHA (标准多头注意力)",
          "2 × n_h × d_h (100% 基准开销)",
          "67B / 67B (稠密)",
          "71.3% • 1.00x 吞吐"
        ],
        [
          "GQA (8 Groups 分组查询注意力)",
          "16 × d_h (压缩至 12.5%)",
          "70B / 70B (稠密)",
          "精度较同尺寸 MHA 下降约 1.8%"
        ],
        [
          "MQA (单键值多查询注意力)",
          "2 × d_h (极端压缩，多头退化)",
          "稠密基线",
          "精度严重下降 3.4% (表达力受损)"
        ],
        [
          "DeepSeek-V2 (MLA + DeepSeekMoE 本文)",
          "4.5 × d_h (压缩 93.3%!)",
          "21B / 236B (稀疏MoE)",
          "78.5% (超MHA!) • 5.76x 吞吐飞跃"
        ]
      ]
    }
  ],
  "insights": [
    {
      "title": "为什么直接对压缩后的潜向量加 RoPE 会让 MLA 的显存优势瞬间归零？",
      "content": "这是 MLA 最精彩的技术细节：如果不拆分解耦 RoPE，那么 k_i = R_i W^{UK} c_i^{KV}。此时在计算 q_t^T k_i = (h_t^T W^Q) R_{i-t} (W^{UK} c_i^{KV}) 时，中间横亘着一个随每个历史位置 i 变化的旋转矩阵 R_{i-t}，导致 W^Q 和 W^{UK} 根本无法提前静态相乘合并！如果不合并，推理时就必须把所有历史 c_i^{KV} 重新乘以 W^{UK} 展开成巨大的 K，算力直接爆炸。因此「解耦出一个小小的 64 维专门挂 RoPE」是救活整个 MLA 的点睛之笔！"
    },
    {
      "title": "从 DeepSeek-V2 到 DeepSeek-V3 / R1 的一脉相承",
      "content": "DeepSeek-V2 确立的「MLA + DeepSeekMoE」双核架构被原封不动地继承到了随后的 671B DeepSeek-V3 与 DeepSeek-R1 中（仅将路由负载均衡升级为无辅助损失的无偏动态偏置调整），成为国产大模型改写全球 AI 格局的架构基石。"
    }
  ],
  "takeaways": [
    {
      "icon": "Minimize",
      "title": "比 GQA 更省，比 MHA 更强",
      "desc": "MLA 用低秩潜空间压缩 + 矩阵乘法结合律吸收，打破了 KV 缓存与模型精度的零和博弈。"
    },
    {
      "icon": "Compass",
      "title": "解耦 RoPE 巧破非交换律",
      "desc": "把对位置敏感的旋转编码剥离到 64 维共享小头上，保住了主干权重的静态吸收能力。"
    },
    {
      "icon": "GitBranch",
      "title": "共享专家 + 细粒度专家",
      "desc": "常驻共享专家兜底通用知识，160 选 6 细粒度专家提供指数级专业知识组合。"
    },
    {
      "icon": "DollarSign",
      "title": "把百万 Token 价格打入一元的元勋",
      "desc": "93.3% 的 KV 缓存缩减与 21B 激活量，正是 DeepSeek 极具统治力推理成本的物理根源。"
    }
  ]
};

export const PAPER_DATA: UniversalPaperData = DEEPSEEK_V2_2024_DATA;
export default PAPER_DATA;
