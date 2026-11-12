import { UniversalPaperData } from '../../../../src/shared/types/universalPaper.js';

export const PEFT_2019_DATA: UniversalPaperData = {
  id: 'peft-2019',
  folderName: 'Parameter-Efficient-Transfer-Learning-for-NLP',
  systemTitleZh: 'PEFT 参数高效微调奠基论文精读与四大范式实验系统',
  venueBadge: 'ICML 2019 & ICLR 2022 (PEFT奠基)',
  arxivId: 'arXiv:1902.00751',
  absUrl: 'https://arxiv.org/abs/1902.00751',
  pdfUrl: 'https://arxiv.org/pdf/1902.00751',
  titleZh: '面向自然语言处理的参数高效迁移学习：瓶颈 Adapter 与 PEFT 统一框架',
  titleEn: 'Parameter-Efficient Transfer Learning for NLP (Adapter & Unified PEFT Framework)',
  publishDate: '2019年2月 (ICML 2019)',
  authors: [
    'Neil Houlsby',
    'Andrei Giurgiu',
    'Stanisław Jastrzębski',
    'Bruna Morrone',
    'Quentin de Laroussilhe',
    'Andrea Gesmundo',
    'Mona Attariyan',
    'Sylvain Gelly',
    'Junxian He (何俊贤, Unified View)'
  ],
  affiliations: ['Google Research (谷歌研究院)', 'Carnegie Mellon University (CMU)'],
  simulatorTabLabel: 'PEFT 架构对比实验台',
  tldrZh:
    '正式开创自然语言处理「参数高效微调（PEFT）」领域的奠基之作！针对全量微调（Full Fine-Tuning）每个任务都需复制一份完整大模型权重的痛点，Google 提出在冻结的 Transformer 层内插入具有跳跃连接的瓶颈型「Adapter（适配器）」模块，并配合近似恒等映射初始化（Near-Identity Initialization）。在 GLUE 9 项权威任务上，仅训练 3.6% 的参数即可达到全量微调 99.6% 的精度（80.0 vs 80.4），彻底开启了 Adapter、Prefix-Tuning、Prompt-Tuning 与 MAM 并行适配器百花齐放的 PEFT 时代！',
  abstractZh:
    '预训练模型的迁移学习在许多自然语言处理（NLP）问题上取得了卓越的性能。然而，微调（Fine-Tuning）参数效率极低：每个下游任务都需要一个全新的模型，并修改所有原始参数。作为替代方案，我们提出了基于适配器模块（Adapter Modules）的迁移机制。适配器模块能够产生紧凑且可扩展的模型：它们为每个新任务仅添加极少量的可训练参数，并且可以在完全不破坏先前任务性能的情况下添加新任务，而无需重新访问先前的任何数据。原始预训练模型的参数保持固定，实现了高度的参数共享。为了展示适配器的有效性，我们将最新提出的 BERT Transformer 模型迁移到涵盖 26 个多样化文本分类任务（包括 GLUE 基准）上进行评估。适配器在仅向每个任务添加极小比例参数的情况下，获得了接近最先进水平的性能。在 GLUE 上，我们在每个任务仅添加 3.6% 参数的情况下，达到了全量微调性能的 0.4% 误差范围内，而传统全量微调则需要为每个任务训练 100% 的参数。',
  abstractEn:
    'Fine-tuning pre-trained models is an effective transfer mechanism in NLP. However, in the presence of many downstream tasks, fine-tuning is parameter inefficient: an entire new model is required for every task. As an alternative, we propose transfer with adapter modules. Adapter modules yield a compact and extensible model; they add only a few trainable parameters per task, and new tasks can be added without revisiting previous ones. The parameters of the original network remain fixed, yielding a high degree of parameter sharing. To demonstrate adapter\'s effectiveness, we transfer the recently proposed BERT Transformer model to 26 diverse text classification tasks, including the GLUE benchmark. Adapters attain near state-of-the-art performance, whilst adding only a small number of parameters per task. On GLUE, we attain within 0.4% of the performance of full fine-tuning, adding only 3.6% parameters per task.',
  bibtex: `@inproceedings{houlsby2019parameter,
  title={Parameter-efficient transfer learning for {NLP}},
  author={Houlsby, Neil and Giurgiu, Andrei and Jastrzebski, Stanislaw and Morrone, Bruna and De Laroussilhe, Quentin and Gesmundo, Andrea and Attariyan, Mona and Gelly, Sylvain},
  booktitle={International Conference on Machine Learning (ICML)},
  pages={2790--2799},
  year={2019}
}`,
  coreInnovations: [
    {
      title: '瓶颈型适配器结构 (Bottleneck Adapter: d → m → d)',
      desc: '通过向下投影 W_down 将 d 维特征压缩至极小的瓶颈维 m (m ≪ d)，经非线性激活后再由 W_up 还原，将参数量控制在 2md。'
    },
    {
      title: '近似恒等初始化 (Near-Identity Initialization)',
      desc: '结合内部跳跃连接 h + f(hW_down)W_up 并将 W_down/W_up 初始化为接近 0，使训练初始时 Adapter 等价于恒等函数 y = h。'
    },
    {
      title: '伴随 LayerNorm 协同解冻机制',
      desc: '除 Adapter 瓶颈参数外，同时解冻每层原本仅含极少参数的 LayerNorm 缩放与偏移向量，实现极低成本的分布校准。'
    },
    {
      title: 'PEFT 统一视角与并行 MAM 架构演进',
      desc: '揭示 Adapter、Prefix-Tuning、Prompt-Tuning 与 LoRA 均为对隐状态 h 的增量修正，催生出更高精度的 Parallel Adapter 与 MAM。'
    }
  ],
  beginnerSteps: [
    {
      badge: '第一步：为什么只微调最后几层行不通？',
      title: '全量微调太贵 vs. 冻结微调太蠢：两难困境的破局',
      subtitle: 'Full Fine-Tuning vs. Top-Layer Tuning vs. Adapters',
      contentParagraphs: [
        '在 Adapter 提出前，如果不想更新全部 100% 的参数，大家最自然的想法是：“我把 BERT 前面 20 层冻住，只微调最后 2 层（Top-Layer Tuning）不行吗？”',
        '作者在论文 Figure 1 中做了严酷的对比实验：如果只微调顶层 3.6% 的参数，GLUE 平均准确率会从 80.4% 暴跌到 71.0%（掉了整整 9.4 个百分点）！为什么？因为不同下游任务不仅需要改顶层分类器，还需要从底层就开始微调词法和句法特征的提取方式。',
        '于是作者灵机一动：与其把 3.6% 的参数全堆在最后一层，不如做成 48 个微型“插头（Adapter）”，均匀地插进 Transformer 的每一层里！这样每一层都能根据新任务做微调，总参数还是只有 3.6%，准确率却瞬间飙回 80.0%！'
      ],
      takeawayCallout: '“层层设点、每层只放一个微型漏斗”，比“只改最后一层”聪明十倍！'
    },
    {
      badge: '第二步：拆解瓶颈 Adapter 的内部构造',
      title: '沙漏型瓶颈（d → m → d）+ 救命的跳跃连接',
      subtitle: 'Bottleneck Projection & Skip-Connection',
      contentParagraphs: [
        '一个 Adapter 模块长得就像一个沙漏（漏斗）：假设 BERT 的隐藏层宽度是 d = 1024，Adapter 先用一个矩阵 W_down (1024 × 64) 把它捏扁成 m = 64 维；过一个非线性激活函数 f(·)；再用一个矩阵 W_up (64 × 1024) 把它吹回 1024 维。',
        '但如果在训练刚开始时，把随机初始化的沙漏直接串进 BERT 的每一层里，原本训练好的特征传过 24 层沙漏后早就面目全非了！',
        '因此，作者设计了两条铁律：① 在沙漏外面加一条**跳跃连接（Skip-Connection）**：输出 = 输入 h + 沙漏(h)；② 把 W_down 和 W_up 的初始权重设得接近 0（方差 10⁻⁴）。这样在训练第 0 步时，沙漏(h) ≈ 0，输出 ≈ 输入 h，整个 Adapter 就跟透明空气一样（近似恒等映射 Near-Identity），丝毫不干扰原模型！'
      ],
      highlightBox: {
        title: 'Houlsby Adapter 在每层 Transformer 中的插入位置',
        points: [
          '位置 1：多头自注意力（Multi-Head Attention）投影之后、残差连接与 LayerNorm 之前。',
          '位置 2：前馈网络（Feed-Forward Network）两层变换之后、残差连接与 LayerNorm 之前。',
          '额外解冻项：每层的 LayerNorm 缩放与偏置参数（仅占极少参数）同步参与训练。'
        ]
      },
      takeawayCallout: '凡是在预训练模型内部加插件，必须保证“初始状态下插件等价于直通电线（Identity）”！'
    },
    {
      badge: '第三步：PEFT 家族四大门派全景演进',
      title: '从 Adapter 到 Prefix-Tuning、Prompt-Tuning 与 LoRA',
      subtitle: 'The Four Pillars of Parameter-Efficient Fine-Tuning',
      contentParagraphs: [
        'Houlsby (2019) 打开了 PEFT 的大门后，短短两年内涌现出了四大核心流派：',
        '① **Adapter（适配器，2019）**：在 MHA 和 FFN 后串行或并行插入降维-非线性-升维的瓶颈模块；',
        '② **Prefix-Tuning（前缀微调，Li & Liang 2021）**：不改网络权重，而是在每一层 Attention 的 Key 和 Value 矩阵前面拼接 l 个可学习的“虚拟前缀向量（Virtual Prefix Tokens）”；',
        '③ **Prompt-Tuning（软提示微调，Lester et al. 2021）**：极简版 Prefix，只在最底层的输入 Embedding 层前面拼接几十个可学习的连续软提示词向量（Soft Prompts），当模型达到百亿规模时效果逼近全量微调；',
        '④ **LoRA（低秩适配，Hu et al. 2021）**：在线性权重矩阵旁并联无非线性的低秩分解矩阵 BA，可合并进主权重实现零延迟。'
      ],
      takeawayCallout: '四大门派殊途同归：都是冻住 99% 的预训练主干，只用 <1% 的可学习参数去引导每一层的表征走向！'
    },
    {
      badge: '第四步：统一数学公式与 MAM 终极合体',
      title: 'ICLR 2022 统一视角：原来 Prefix-Tuning 也是一种并行 Adapter！',
      subtitle: 'Towards a Unified View of PETL (He et al., ICLR 2022)',
      contentParagraphs: [
        'CMU 何俊贤团队（ICLR 2022）推导出了惊人的数学结论：Prefix-Tuning 在 Attention 的 Key/Value 前拼接前缀 P_k, P_v，经展开后等价于：h ← (1 - λ(x))·Attn(x) + λ(x)·softmax(xW_q P_kᵀ)P_v —— 这在数学结构上竟然就是一个**带 Softmax 激活函数的并行瓶颈 Adapter**！',
        '顺着这个统一公式，他们把原本“串行”插在 FFN 后面的 Adapter 改造成了与 FFN **并行（Parallel Adapter）**计算，并结合注意力层的 Prefix-Tuning，打造出了集大成的 **MAM Adapter（Mix-and-Match Adapter）**，一举在各大基准上超越了所有单一 PEFT 方法！'
      ],
      takeawayCallout: '掌握了 Δh 的统一视角，你就能像搭积木一样自由组合任何 PEFT 方法！'
    }
  ],
  beginnerQuiz: [
    {
      id: 1,
      question: '在 Houlsby Adapter 模块中，如果把内部的跳跃连接（Skip-Connection）去掉，或者把初始权重设得很大（如标准差 0.1），会发生什么？',
      options: [
        '训练速度会加快一倍',
        '模型在训练初期输出严重偏离预训练表征，导致验证集准确率大幅暴跌甚至训练崩溃',
        '不会有任何影响，因为有 LayerNorm',
        '参数量会增加 10 倍'
      ],
      correctIndex: 1,
      explanation:
        '正确！论文消融实验明确指出：若初始权重标准差过大（>0.01）或移除跳跃连接，Adapter 在初始步会破坏 24 层 BERT 的预训练特征传递，导致准确率严重退化。近似恒等初始化（Near-Identity Initialization）是 Adapter 成功的关键。'
    },
    {
      id: 2,
      question: '在相同可训练参数比例（例如 3.6%）下，为什么“在每一层插入瓶颈 Adapter”远胜于“仅解冻微调 BERT 最后 2 层（Top-Layer Fine-Tuning）”？',
      options: [
        '因为最后 2 层没有注意力机制',
        '因为下游任务不仅需要调整顶层分类边界，还需要从底层到高层逐层微调特征提取方式；Adapter 分布在整个网络深度上，能够逐层重塑表征',
        '因为 Adapter 使用了更大的学习率',
        '因为 Adapter 修改了词表大小'
      ],
      correctIndex: 1,
      explanation:
        '完全正确！论文 Figure 1 和消融实验表明，移除低层 Adapter 只保留高层 Adapter 会导致性能显著下降，说明跨全层深度的微小特征调节远比单层大参数调节有效。'
    },
    {
      id: 3,
      question: '根据 ICLR 2022 统一框架论文（He et al.），将传统的“串行 Adapter（插入在 FFN 之后）”改为“并行 Adapter（与 FFN 并联接收同一输入 x）”有什么核心优势？',
      options: [
        '并行 Adapter 直接读取未经过 FFN 变换的原始子层输入 x，且可与主干 FFN 矩阵乘法合并并行计算，不仅硬件吞吐更高，准确率也显著优于串行 Adapter',
        '并行 Adapter 不需要任何激活函数',
        '并行 Adapter 只能用于卷积网络',
        '并行 Adapter 会把参数量减少到 0'
      ],
      correctIndex: 0,
      explanation:
        '正确！Parallel Adapter 与主干子层并联（h = FFN(x) + Adapter(x)），既提升了 GPU 并行度，又在 XSum、MT 和 GLUE 上显著优于传统串行 Adapter。'
    }
  ],
  chapters: [
    {
      id: 'sec-1',
      chapterNumber: '1',
      titleZh: '引言：多任务与持续学习下的参数效率危机',
      titleEn: 'Introduction: Parameter Efficiency in Multi-Task & Continual Learning',
      summaryZh:
        '阐述云端服务在面对成百上千个不同下游任务时，传统全量微调导致的存储爆炸与灾难性遗忘难题，引出紧凑可扩展的 Adapter 迁移范式。',
      beginnerTakeaways: [
        {
          question: '为什么说 Adapter 天然解决了“持续学习（Continual Learning）”中的灾难性遗忘问题？',
          answerZh:
            '传统微调在学第 2 个任务时会修改原模型权重，导致模型忘掉第 1 个任务（灾难性遗忘）。而使用 Adapter 时，原模型权重 100% 冻结不动，每个新任务只需要单独训练并保存一个几 MB 的专属 Adapter 插件，以前所有任务的插件分毫未损，随时调用都保持 100% 原始精度！',
          analogyZh:
            '就像游戏机主机固件永远不改（冻结 BERT），每玩一个新游戏只需插上一张几 MB 的专属记忆卡（Adapter），绝不会覆盖旧游戏的存档。'
        }
      ],
      contentZh: [
        '从预训练模型进行迁移学习已在众多 NLP 任务上取得了极佳效果。然而，当我们需要服务于大量下游任务、并且这些任务随时间流式到达（Continual Learning）时，传统的全量微调（Full Fine-Tuning）暴露出严重缺陷：每来一个新任务，都必须复制并修改全部 100% 的预训练权重（例如 BERT-Large 每任务 3.3 亿参数）。',
        '理想的参数高效迁移学习方案应当具备三大特性：① **高参数共享度**：冻结原始网络权重，每个任务仅新增极少量可训练参数；② **接近全量微调的精度**：不能像仅训练顶层分类头那样损失大量准确率；③ **无遗忘可扩展性**：新增任务无需重访旧任务数据，也不会破坏任何历史任务的表现。',
        '为此，我们提出了面向 Transformer 的**瓶颈型适配器模块（Bottleneck Adapter Modules）**。通过在每一层的自注意力与前馈子层中植入微型瓶颈结构，我们在 26 个文本分类任务上仅用 **3% 左右的新增参数**，便取得了与 100% 全量微调几乎难分伯仲的性能。'
      ],
      contentEn: [
        'Transfer with adapter modules yields a compact and extensible model; they add only a few trainable parameters per task, and new tasks can be added without revisiting previous ones. The parameters of the original network remain fixed, yielding a high degree of parameter sharing.',
        'Our aim is to design an effective adapter tuning strategy that is both compact (few trainable parameters per task) and extensible (new tasks can be added sequentially without forgetting).'
      ],
      keyInsights: [
        '全量微调的参数复杂度为 O(T · N_model)，而 Adapter 将其降低为 O(N_model + T · N_adapter)，其中 N_adapter ≪ N_model。',
        '冻结主干 + 任务独立插件的设计彻底消除了多任务持续学习中的灾难性遗忘（Catastrophic Forgetting）。'
      ]
    },
    {
      id: 'sec-2',
      chapterNumber: '2',
      titleZh: '瓶颈 Adapter 架构设计：位置、跳跃连接与恒等初始化',
      titleEn: 'Adapter Architecture for Transformers: Bottleneck & Near-Identity Init',
      summaryZh:
        '详解 Adapter 在 Transformer 子层中的精确插入位置、d → m → d 降维升维方程、近零恒等初始化，以及 LayerNorm 协同训练机制。',
      beginnerTakeaways: [
        {
          question: '为什么不同任务可以选择不同的瓶颈维度 m（例如简单任务用 m=8，复杂任务用 m=64）？',
          answerZh:
            '因为瓶颈维度 m 直接控制了 Adapter 的参数容量（每层参数量为 2md + d + m）！对于数据量小或简单的任务，只需设 m=8（仅占 0.5% 参数）即可达标；对于像 MNLI 这样的大规模复杂任务，可以设 m=64（约占 3.6% 参数），实现了极其灵活的“参数-精度”按需调节。',
          analogyZh:
            '就像装修房间，简单的储物间装一个小巧的 8 寸换气扇，大客厅装一个 64 寸的新风系统，完全按需定制。'
        }
      ],
      contentZh: [
        '【插入位置】我们将 Adapter 模块应用于 Transformer 架构。标准 Transformer 的每一层包含两个核心子层：一个多头注意力层（Multi-Head Attention）和一个两层前馈网络（FFN）。每个子层之后都紧跟一个线性投影、一条残差连接（Residual Connection）和一个层归一化（LayerNorm）。我们在每一层中插入 **两个串行 Adapter 模块**：分别位于多头注意力投影之后（残差相加之前），以及前馈网络两层变换之后（残差相加之前）。',
        '【瓶颈结构与跳跃连接】为了限制参数数量，我们提出了瓶颈架构（Bottleneck Architecture）。Adapter 首先将原始 $d$ 维特征通过向下投影矩阵 $W_{\\text{down}} \\in \\mathbb{R}^{d \\times m}$ 映射到较小的维度 $m$（其中 $m \\ll d$），应用非线性激活函数 $f(\\cdot)$，然后再通过向上投影矩阵 $W_{\\text{up}} \\in \\mathbb{R}^{m \\times d}$ 映射回 $d$ 维。每个单层 Adapter（忽略偏置）的参数量为 $2md$。さらに，Adapter 内部本身包含一条**跳跃连接（Skip-Connection）**，即完整输出为 $h \\leftarrow h + f(h W_{\\text{down}}) W_{\\text{up}}$。',
        '【近似恒等初始化与 LayerNorm 解冻】依靠内部跳跃连接，如果我们将投影矩阵 $W_{\\text{down}}$ 和 $W_{\\text{up}}$ 的参数初始化为接近零（零均值、标准差 $10^{-2}$ 的截断高斯分布），则 Adapter 在训练初始阶段就被初始化为一个**近似恒等函数（Near-Identity Function）**，从而确保深层预训练网络在训练起步时保持稳定。此外，我们还为每个任务解冻并重新学习每层的 LayerNorm 缩放与偏移参数（每层仅 $2d$ 个参数），与 Adapter 协同优化。'
      ],
      contentEn: [
        'We insert two serial adapters per Transformer layer: one after the multi-head attention projection and one after the two feed-forward layers. The adapter is applied directly to the output of the sub-layer, after the projection back to the input size, but before adding the skip connection.',
        'To limit the number of parameters, we propose a bottleneck architecture. The adapters first project the original d-dimensional features into a smaller dimension, m, apply a nonlinearity, then project back to d dimensions.',
        'With the skip-connection, if the parameters of the projection layers are initialized to near-zero, the module is initialized to an approximate identity function.'
      ],
      formulas: [
        {
          latex: '\\text{Adapter}(h) = h + f\\left(h W_{\\text{down}}\\right) W_{\\text{up}}, \\quad W_{\\text{down}} \\in \\mathbb{R}^{d \\times m}, \\; W_{\\text{up}} \\in \\mathbb{R}^{m \\times d}, \\; m \\ll d',
          explanationZh: 'Houlsby 瓶颈 Adapter 核心方程：利用 m ≪ d 瓶颈层压缩参数量，并借助内部跳跃连接与近零初始化实现恒等起步。'
        }
      ],
      keyInsights: [
        '每个 Adapter 模块包含 2md + d + m 个参数；当 m=64, d=1024 时，单层参数量远小于原 FFN 层的 2×1024×4096 参数。',
        'Pfeiffer 等人（2020，AdapterFusion）后续研究进一步表明：仅在每层的 FFN 之后插入 1 个 Adapter（省略 MHA 后的 Adapter），即可在不掉点的情况下再省一半参数与延迟。'
      ]
    },
    {
      id: 'sec-3',
      chapterNumber: '3',
      titleZh: '实验验证与消融研究：3.6% 参数媲美 100% 全量微调',
      titleEn: 'Experiments & Ablation Studies on GLUE and 26 Tasks',
      summaryZh:
        '在 GLUE 基准、17 项公开文本分类任务与 SQuAD 问答上对比全量微调、可变层数微调（Variable Fine-Tuning），并剖析各层 Adapter 的重要性分布。',
      beginnerTakeaways: [
        {
          question: '在 24 层 BERT-Large 里，到底是底层的 Adapter 更重要，还是顶层的 Adapter 更重要？',
          answerZh:
            '作者通过消融实验（Figure 5，逐块移除特定层的 Adapter）发现：移除底层（第 1~4 层）的 Adapter 几乎不影响性能（因为底层提取的是通用词法特征）；而移除高层（如第 20~24 层）的 Adapter 会导致准确率明显下降！但最厉害的是，全层都保留 Adapter 的综合效果明显好于只留最后几层。',
          analogyZh:
            '就像装修精装房，水电地基（底层）基本不用大改，软装家具（高层）改动最大，但如果全屋每个房间都能微调灯光开关，整体居住体验才是最完美的。'
        }
      ],
      contentZh: [
        '【GLUE 基准全面评测】我们在 GLUE 基准的 9 个数据集上基于 BERT-Large（3.3亿参数）评估了瓶颈维度 $m \\in \\{8, 64, 256\\}$ 的 Adapter。结果（Table 1）表明：全量微调需要为每个任务更新 100%（330M）参数，取得 **80.4** 的平均分；而 Adapter 仅需为每个任务添加 **3.6%（约 12M）参数**，即可取得 **80.0** 的平均分（相差仅 0.4 分）！作为对比，如果采用“仅微调顶层 $k$ 层（Variable Fine-Tuning）”策略，在同样训练 3.6% 参数时平均分暴跌至 **71.0**；即便解冻 30% 的顶层参数，也依然落后于 3.6% 参数的 Adapter。',
        '【另外 17 个分类任务与 SQuAD 问答】为了验证泛化性，我们在另外 17 个多样化公开分类任务以及 SQuAD v1.1 阅读理解任务上进行了测试。在 SQuAD 上，仅含 **2% 参数**（$m=64$）的 Adapter 取得了 **90.4% F1**，与全量微调的 **90.7% F1** 几乎完全一致；即使将瓶颈维度压缩到极致的 **$m=2$（仅占原模型 0.1% 参数！）**，依然能在 SQuAD 上取得 **89.9% F1** 的惊人成绩！',
        '【消融实验：初始化尺度与层间敏感度】消融实验揭示：① 当初始化标准差在 $10^{-4} \\sim 10^{-2}$ 之间时，Adapter 表现极其稳健；一旦标准差达到 $10^{-1}$ 或 $1.0$，准确率立即断崖式崩塌；② 单独只训练 LayerNorm 参数（完全不加 Adapter，仅 0.01% 参数）会导致 MNLI 下降约 4%、CoLA 下降 15%，证明瓶颈投影层是不可或缺的主力；③ 通过逐层消融热力图（Figure 5）发现，高层 Adapter 比底层 Adapter 对最终精度的影响更大。'
      ],
      contentEn: [
        'On GLUE, adapters attain an average score of 80.0 with 3.6% parameters per task, compared to 80.4 for full fine-tuning (100% parameters). In contrast, fine-tuning only the top layers with a comparable number of parameters drops performance to 71.0.',
        'On SQuAD v1.1, adapters with m=64 (2% parameters) achieve 90.4% F1 compared to 90.7% for full fine-tuning. Even with a tiny bottleneck size of m=2 (0.1% parameters), adapters still achieve 89.9% F1.',
        'Removing adapters from the lower layers (e.g., layers 0-4) has a small impact, whereas removing them from the higher layers causes a much larger drop in accuracy.'
      ],
      keyInsights: [
        '在 GLUE 9 项任务总计存储开销上，全量微调需要 9.0× 倍模型体积，而 Adapter 仅需 1.3× 倍模型体积（共享 1 份底座 + 9 个微型 Adapter）。',
        '在 SQuAD 上，哪怕瓶颈维度缩减至 m=2（仅 0.1% 参数），F1 得分依然高达 89.9%，展现了极强的参数抗压缩能力。'
      ]
    },
    {
      id: 'sec-4',
      chapterNumber: '4',
      titleZh: 'PEFT 统一数学框架：连接 Adapter、Prefix-Tuning 与 LoRA',
      titleEn: 'Unified View of Parameter-Efficient Transfer Learning (He et al., ICLR 2022)',
      summaryZh:
        '深入解读 ICLR 2022 统一框架论文，从数学上证明 Prefix-Tuning 等价于带门控的并行 Adapter，并提出 Parallel Adapter 与 MAM Adapter。',
      beginnerTakeaways: [
        {
          question: '为什么说 Prefix-Tuning（在注意力层拼前缀）和 Adapter（加瓶颈层）在数学上是一家人？',
          answerZh:
            '因为在注意力层里，把输入键 K 和值 V 前面拼上前缀 P_k, P_v 后，算出来的注意力输出其实就是“原来的注意力输出”与“查询 x 对前缀 P_k 做内积再乘以 P_v”的加权组合！如果你把 P_k 看作降维矩阵 W_down，把 P_v 看作升维矩阵 W_up，它跟一个并联在注意力层旁边的 Adapter 公式几乎一模一样！',
          analogyZh:
            '一个是从正门塞进几份参考资料（Prefix-Tuning），一个是在走廊旁开个小房间处理信息（Adapter），打开图纸一看，两者的电路图完全同构！'
        }
      ],
      contentZh: [
        '随着 Adapter (2019)、Prefix-Tuning (2021)、Prompt-Tuning (2021) 与 LoRA (2021) 相继提出，参数高效微调领域呈现出碎片化局面。He 等人（ICLR 2022, *Towards a Unified View of Parameter-Efficient Transfer Learning*）首次从数学上证明：所有主流 PEFT 方法本质上都是在预训练模型特定子层的隐藏状态 $h$ 上施加一个基于输入 $x$ 的增量修正 $\\Delta h$！',
        '【Prefix-Tuning 的等价性推导】在 Prefix-Tuning 中，我们将 $l$ 个可学习的前缀向量 $P_k, P_v \\in \\mathbb{R}^{l \\times d}$ 拼接到注意力头的键 $K$ 和值 $V$ 前面。经过代数恒等变形，Prefix-Tuning 后的注意力输出可严格写为：$$h \\leftarrow (1 - \\lambda(x)) h + \\lambda(x) \\text{softmax}(x W_q P_k^\\top) P_v$$ 其中 $\\lambda(x)$ 是由前缀注意力权重之和决定的标量门控系数。请注意观察右侧项 $\\text{softmax}(x W_q P_k^\\top) P_v$：若令 $W_{\\text{down}} = W_q P_k^\\top$、$W_{\\text{up}} = P_v$、激活函数 $f = \\text{softmax}$，**Prefix-Tuning 在数学上完全等价于一个并联在注意力层旁边、带有门控系数 $\\lambda(x)$ 的并行瓶颈 Adapter（维度 $m = l$）**！',
        '【从串行到并行：Parallel Adapter 与 MAM Adapter】基于上述统一框架（从“功能函数形式”、“插入位置”、“串并联方式”三个维度解耦），作者发现传统 Houlsby Adapter 采用的“串行插入（$h \\leftarrow h + f(h W_{\\text{down}})W_{\\text{up}}$）”并非最优；如果将其改为与 FFN 或 Attention 子层**并行连接（Parallel Adapter：$\\text{Output} = \\text{FFN}(x) + s \\cdot f(x W_{\\text{down}})W_{\\text{up}}$）**，不仅计算可与主干矩阵并行，准确率也大幅跃升！最终，结合了“注意力层小规模 Prefix-Tuning + FFN 层缩放并行 Adapter”的 **MAM Adapter（Mix-and-Match Adapter）** 在翻译、摘要与 GLUE 上全面刷新了 PEFT 纪录。'
      ],
      contentEn: [
        'We cast the nascent field of parameter-efficient transfer learning into a unified view, showing that Prefix Tuning, Adapters, and LoRA can all be viewed as learning a modification vector Delta h applied to hidden representations.',
        'Specifically, Prefix Tuning can be rewritten as h <- (1 - lambda(x)) h + lambda(x) softmax(x W_q P_k^T) P_v, which is mathematically equivalent to a gated parallel adapter with softmax activation applied at the attention layer.',
        'By transferring design elements across approaches, we propose Parallel Adapter and Mix-and-Match (MAM) Adapter, which consistently outperform prior individual PETL methods.'
      ],
      formulas: [
        {
          latex: 'h_{\\text{Prefix}} = \\big(1 - \\lambda(x)\\big) \\underbrace{\\text{Attn}(x W_q, K, V)}_{h} + \\lambda(x) \\underbrace{\\text{softmax}\\big(x (W_q P_k^\\top)\\big) P_v}_{\\Delta h \\text{ (等价于并行 Adapter)}}',
          explanationZh: 'ICLR 2022 核心推导：证明 Prefix-Tuning 本质上是对原始注意力输出 h 与前缀伪 Adapter 输出 Δh 的门控凸组合。'
        },
        {
          latex: 'h_{\\text{Parallel-Adapter}} = \\text{SubLayer}(x) + s \\cdot f(x W_{\\text{down}}) W_{\\text{up}}',
          explanationZh: '并行适配器（Parallel Adapter）方程：直接以子层输入 x（而非子层输出 h）作为旁路输入，并引入缩放因子 s。'
        }
      ],
      keyInsights: [
        '四大 PEFT 范式可通过四个维度完全统一：修改位置（Attn / FFN）、函数形式（MLP / 线性 / Softmax）、连接拓扑（串行 / 并行）、合成方式（直接相加 / 门控插值）。',
        '在 FFN 层施加修改通常比在 Attention 层更能利用大容量参数，而并行拓扑（Parallel）普遍优于串行拓扑（Serial）。'
      ]
    }
  ],
  benchmarks: [
    {
      id: 'glue-benchmark',
      nameZh: 'GLUE 九大任务平均测试集得分对比 (BERT-Large)',
      nameEn: 'GLUE Benchmark Average Test Score (BERT-Large)',
      metricLabel: 'GLUE 平均得分',
      unit: '分',
      higherIsBetter: true,
      summaryConclusion:
        'Houlsby Adapter 仅为每个任务增加 3.6% 的参数，即取得 80.0 的 GLUE 平均分（距离 100% 全量微调的 80.4 仅差 0.4 分），而同样训练 3.6% 参数的“仅微调顶层”策略则暴跌至 71.0 分！',
      items: [
        { modelName: '仅微调顶层分类头 Top-Layer Only (3.6% 参数)', value: 71.0, maxScale: 85 },
        { modelName: '微调最后若干层 Variable FT (10% 参数)', value: 76.2, maxScale: 85 },
        { modelName: '仅解冻 LayerNorm 参数 (0.01% 参数)', value: 74.8, maxScale: 85 },
        { modelName: '全量微调 Full Fine-Tuning (100% 参数, 9倍存储)', value: 80.4, maxScale: 85 },
        {
          modelName: '🌟 Houlsby Adapter (仅 3.6% 参数, 1.3倍总存储)',
          value: 80.0,
          maxScale: 85,
          isOurModel: true,
          badge: '省96.4%参数 / 99.5%精度'
        }
      ]
    },
    {
      id: 'xsum-unified-peft',
      nameZh: 'XSum 极端摘要生成基准 PEFT 四大范式对决 (ROUGE-2)',
      nameEn: 'XSum Abstractive Summarization (BART-Large, ROUGE-2)',
      metricLabel: 'ROUGE-2 得分',
      unit: ' R-2',
      higherIsBetter: true,
      summaryConclusion:
        '在 ICLR 2022 统一框架评测中，将串行 Adapter 改为并行（Parallel Adapter）并融合注意力前缀的 MAM Adapter（仅 6.7% 参数）取得 21.95 ROUGE-2，不仅击败所有单一 PEFT 方法，更接近甚至超越全量微调！',
      items: [
        { modelName: 'BitFit (仅微调偏置项, 0.1% 参数)', value: 17.32, maxScale: 24 },
        { modelName: 'Prefix-Tuning (前缀微调, 3.6% 参数)', value: 20.46, maxScale: 24 },
        { modelName: 'Serial Adapter (传统串行 Adapter, 6.7% 参数)', value: 21.15, maxScale: 24 },
        { modelName: 'LoRA (低秩适配, 6.7% 参数)', value: 21.48, maxScale: 24 },
        {
          modelName: '🌟 Parallel Adapter (并行 Adapter, 6.7% 参数)',
          value: 21.72,
          maxScale: 24,
          isOurModel: true
        },
        {
          modelName: '🌟 MAM Adapter (统一框架混合适配器, 6.7% 参数)',
          value: 21.95,
          maxScale: 24,
          isOurModel: true,
          badge: 'PEFT 全场冠军'
        }
      ]
    }
  ],
  comparisonTable: [
    {
      paradigmNameZh: '🌟 串行瓶颈适配器 (Houlsby Adapter, 本文)',
      paradigmNameEn: 'Serial Bottleneck Adapter',
      mechanismZh: '在 MHA 和 FFN 输出后串行插入 f(h W_down)W_up + h',
      interactionMode: '子层输出 h (Serial 串行)',
      indexType: '0.5% ~ 3.6% 参数 / 任务',
      queryLatency: '增加串行层深 (+20% 延迟)',
      accuracyRank: 'GLUE 80.0 (近100%全量微调)',
      isOurModel: true
    },
    {
      paradigmNameZh: '软提示微调 (Prompt-Tuning)',
      paradigmNameEn: 'Prompt-Tuning (Lester et al.)',
      mechanismZh: '仅在输入 Embedding 层前拼接连续可学习软提示词向量',
      interactionMode: '仅输入层 Embedding',
      indexType: '< 0.01% 参数 (极小)',
      queryLatency: '增加输入序列长度 l',
      accuracyRank: '中小模型较弱，百亿模型强'
    },
    {
      paradigmNameZh: '前缀微调 (Prefix-Tuning)',
      paradigmNameEn: 'Prefix-Tuning (Li & Liang)',
      mechanismZh: '在每一层 Attention 的 K, V 前拼接可学习前缀 P_k, P_v',
      interactionMode: '每层 Attention K, V (等价于门控并行)',
      indexType: '0.1% ~ 3.6% 参数',
      queryLatency: '挤占有效上下文窗口',
      accuracyRank: '生成任务优秀 (XSum 20.46)'
    },
    {
      paradigmNameZh: '🌟 并行混合适配器 (MAM Adapter, 统一框架)',
      paradigmNameEn: 'Mix-and-Match (MAM) Adapter',
      mechanismZh: 'Attention 层轻量 Prefix + FFN 层缩放并行 Adapter',
      interactionMode: '子层输入 x (Parallel 并行)',
      indexType: '0.5% ~ 6.7% 参数',
      queryLatency: '与主干并行计算，吞吐高',
      accuracyRank: 'XSum 21.95 (全面超越串行)',
      isOurModel: true
    }
  ],
  caseStudies: [
    {
      title: '论文 Figure 1 & 2 经典对比：在 26 个分类任务上“微调顶层 k 层” vs “全层瓶颈 Adapter”',
      query: '当每个下游任务只允许增加 1% ~ 3.6% 的可训练参数时，应该如何设计参数分布？',
      cards: [
        {
          methodName: '基线 1：仅微调顶层 (Fine-tune Top Layers, 3.6% 参数)',
          status: 'GLUE 71.0 分 (-9.4 分暴跌)',
          isSuccess: false,
          reason:
            '将全部可训练参数预算集中在 BERT 最后 1~2 层。由于底层和中层特征完全僵化，无法适配下游任务的句法与领域差异，导致性能惨重损失。'
        },
        {
          methodName: '基线 2：仅微调全网 LayerNorm (0.01% 参数)',
          status: 'CoLA 暴跌 -15% / MNLI -4%',
          isSuccess: false,
           isWarning: true,
          reason:
            '虽然贯穿了全部 24 层，但每层只有对角缩放与平移，缺乏跨通道混合投影能力，表达容量不足以支撑复杂语义迁移。'
        },
        {
          methodName: '🌟 本文方案：全层植入瓶颈 Adapter (m=64, 3.6% 参数)',
          status: 'GLUE 80.0 分 (媲美 100% 全量微调!)',
          isSuccess: true,
          reason:
            '在全部 24 层的 MHA 和 FFN 处均匀植入 d→64→d 瓶颈适配器并配合近零恒等初始化，让每一层都具备跨通道非线性微调能力，用 3.6% 参数复现 99.6% 全量精度！'
        }
      ]
    }
  ],
  glossaryCategories: ['Adapter 核心架构', 'PEFT 四大门派', '统一数学框架'],
  glossaryItems: [
    {
      id: 'bottleneck-adapter',
      termZh: '瓶颈型适配器',
      termEn: 'Bottleneck Adapter Module',
      category: 'Adapter 核心架构',
      summary: '在冻结的预训练层之间插入“降维投影 → 非线性激活 → 升维投影 + 跳跃连接”的轻量级微调模块。',
      analogy:
        '就像在主水管每一段安装一个带旁通阀的小型精密净水滤芯：主水管不动，每个城市只需换上适合当地水质的几块钱滤芯即可。',
      technicalDetail:
        '给定 d 维隐状态 h，通过 W_down (d×m) 降维至 m ≪ d，经非线性函数 f 后由 W_up (m×d) 还原，并与输入 h 相加：h + f(hW_down)W_up。',
      paperApplication: '在 BERT 每一层的自注意力与 FFN 之后各插入一个，实现 3.6% 参数达到全量微调精度。',
      formula: '\\text{Adapter}(h) = h + f(h W_{\\text{down}}) W_{\\text{up}}'
    },
    {
      id: 'near-identity-init',
      termZh: '近似恒等初始化',
      termEn: 'Near-Identity Initialization',
      category: 'Adapter 核心架构',
      summary: '将 Adapter 的投影矩阵初始化为接近于 0 的微小随机值，使模块在训练开始时表现为恒等映射 y ≈ x。',
      analogy: '刚装上辅助轮时先把辅助轮调到刚好不改变自行车原平衡的位置，随着骑行再慢慢受力微调。',
      technicalDetail:
        '当 W_down, W_up ~ N(0, 10⁻⁴) 时，f(hW_down)W_up ≈ 0，因此 Adapter(h) = h + 0 = h，保证 24 层深层预训练信号在第 0 步无损通过。',
      paperApplication: '防止新插入的 48 个随机模块破坏预训练 BERT 内部表征的核心稳定手段。'
    },
    {
      id: 'prefix-tuning',
      termZh: '前缀微调',
      termEn: 'Prefix-Tuning',
      category: 'PEFT 四大门派',
      summary: '在 Transformer 每一层注意力的 Key 和 Value 矩阵前拼接 l 个可学习的连续虚拟词元向量。',
      analogy: '每次开会前，在会议纪要最前面固定贴上几条“本部门专属指导原则”，所有人在发言（算 Attention）时都要参考这几条原则。',
      technicalDetail:
        '由 Li & Liang (ACL 2021) 提出，通过重参数化 MLP 生成每层的 P_k, P_v，在数学上等价于在注意力层施加带 Softmax 门控的并行瓶颈变换。',
      paperApplication: '在自然语言生成任务上表现出色，并与 Parallel Adapter 结合构成 MAM Adapter。'
    },
    {
      id: 'prompt-tuning',
      termZh: '软提示微调',
      termEn: 'Prompt-Tuning (Soft Prompts)',
      category: 'PEFT 四大门派',
      summary: '仅在模型最底层的输入词嵌入序列前拼接少量可学习的连续向量（Soft Prompts），其余全网完全冻结。',
      analogy: '不动机器内部的任何齿轮，只在投料口最前面放几个特制的引导模具。',
      technicalDetail:
        '由 Lester et al. (EMNLP 2021) 提出，参数量极小（仅几万个参数），当模型参数量超过 100 亿（T5-XXL）时性能可追平全量微调。',
      paperApplication: 'PEFT 家族中参数量最小、部署最简单的输入层微调方案。'
    },
    {
      id: 'parallel-adapter',
      termZh: '并行适配器',
      termEn: 'Parallel Adapter',
      category: '统一数学框架',
      summary: '将原本串联在子层输出之后的 Adapter 改为与子层（如 FFN）并联，共同接收子层输入 x 并相加输出。',
      analogy: '把原本设在主干道出口的串行检查站，改成与主干道并排通行的快速辅路，两边同时通车最后汇合。',
      technicalDetail:
        '公式为 y = FFN(x) + s · f(x W_down)W_up，直接利用未压缩的子层输入 x，在精度与 GPU 并行效率上均显著优于串行 Adapter。',
      paperApplication: 'ICLR 2022 统一框架论文提出的核心改进架构。',
      formula: 'h \\leftarrow \\text{SubLayer}(x) + s \\cdot f(x W_{\\text{down}}) W_{\\text{up}}'
    },
    {
      id: 'mam-adapter',
      termZh: '混合匹配适配器 (MAM)',
      termEn: 'Mix-and-Match (MAM) Adapter',
      category: '统一数学框架',
      summary: '在自注意力层使用轻量级 Prefix-Tuning（l=30），在前馈网络层使用缩放并行 Adapter（r=512）的组合架构。',
      analogy: '取众家之长：在信息检索阶段用“前缀提示”，在深度思考阶段用“并行旁路”，强强联合。',
      technicalDetail:
        '结合了 Prefix-Tuning 在注意力层的灵活性与 Parallel Adapter 在 FFN 层的大容量特征变换能力。',
      paperApplication: '在相同参数预算下全面超越单独使用 Adapter、Prefix-Tuning 或 LoRA。'
    }
  ]
};
