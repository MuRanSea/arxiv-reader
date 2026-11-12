import { UniversalPaperData } from '../../../../src/shared/types/universalPaper.js';

export const BERT_2018_DATA: UniversalPaperData = {
  id: 'bert-2018',
  title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
  chineseTitle: 'BERT：面向语言理解的深度双向 Transformer 预训练模型',
  subtitle: 'Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova • Google AI Language • NAACL 2019 最佳论文',
  tags: ['NAACL 2019 最佳长文', 'BERT 双向编码器', 'Masked LM (MLM)', '80-10-10 掩码策略', '预训练+微调范式'],
  arxivId: '1810.04805',
  pdfUrl: 'https://arxiv.org/pdf/1810.04805.pdf',
  abstractUrl: 'https://arxiv.org/abs/1810.04805',
  summary:
    '彻底改写自然语言处理历史的里程碑巨著！针对单向语言模型（GPT）无法同时看清左右侧上下文、导致句子级与词元级理解任务受限的痛点，提出基于「完形填空（Cloze Task）」思想的掩码语言模型（MLM）与下一句预测（NSP），首次训练出深度双向 Transformer 编码器，一举刷新 11 项 NLP 权威基准记录，也是后续 DPR、ColBERT 等现代稠密检索系统的核心骨干！',

  keyContributions: [
    '揭示单向自回归预训练的架构瓶颈：无论是从左到右（GPT）还是浅层双向拼接（ELMo），都无法在 Transformer 每一层内部深度融合左右两侧上下文（对 SQuAD 阅读理解等词元级任务尤为致命）。',
    '提出掩码语言模型（MLM）与精妙的 80-10-10 替换规则：随机采样 15% Token 进行预测，其中 80% 替换为 [MASK]、10% 替换为随机词、10% 保持原词，巧妙弥合了预训练（有 [MASK]）与微调（无 [MASK]）之间的分布鸿沟。',
    '设计三合一输入嵌入与下一句预测（NSP）：将 Token Embeddings、Segment Embeddings（区分句子 A/B）与可学习 Position Embeddings 相加，配合 [CLS] 与 [SEP] 特殊符号，一套架构通吃单句分类、句对推理、序列标注与跨度抽取问答。',
    '横扫 11 项 NLP 基准测试：BERT-Large 将 GLUE 综合得分提升 7.7%（达 80.5%），SQuAD v1.1 F1 提升至 93.2（超越人类水平），SQuAD v2.0 F1 提升 5.1 点（达 83.1）。',
  ],

  coreProblem:
    '标准条件语言模型（Standard Conditional LM）只能从左向右（Left-to-Right）或从右向左单向训练。如果直接允许双向自注意力在多层网络中自由流动，每个词都能在第二层通过间接路径「偷看到自己（See itself）」，导致预测目标退化为平凡的恒等复制。如何在不发生信息泄漏的前提下，训练出每一层都能同时感知完整左右上下文的深度双向 Transformer？',

  coreIdea:
    '借鉴心理语言学经典的完形填空（Cloze）测试：在输入序列中随机遮盖（Mask）15% 的词元，仅训练模型根据未被遮盖的上下文去还原这些被遮盖位置的原始词元（MLM）。为了防止模型过度依赖只在预训练中出现的 `[MASK]` 标记，对选中的 15% 词元执行「80% 变 [MASK]、10% 变随机词、10% 保持不变」，迫使 Transformer 对每一个输入位置都维持高保真的双向上下文表征！',

  simulatorTitle: 'BERT 双向消歧注意力、80-10-10 掩码策略与三合一输入嵌入模拟器',
  simulatorDesc:
    '交互式对比 BERT 深度双向编码器（全通注意力）与 GPT 单向解码器（因果掩码）在一词多义（如 "bank"）上的消歧差异，动态模拟 80-10-10 掩码规则，并检视 Token + Segment + Position 三层输入嵌入合成。',

  architectureSteps: [
    {
      id: 'tri-embedding',
      title: '1. 三合一输入表征（Token + Segment + Position）',
      subtitle: '[CLS] + Sentence A + [SEP] + Sentence B + [SEP]',
      description:
        '任何单句或句对任务都被统一序列化：句首固定插入聚合标记 [CLS]，句间插入分隔符 [SEP]。每个位置的最终输入向量是 WordPiece 词元嵌入、句子片段嵌入（E_A 或 E_B）与位置嵌入（0~511）的逐元素加和。',
      highlightColor: 'emerald',
    },
    {
      id: 'mlm-80-10-10',
      title: '2. 掩码语言模型（MLM 15% 采样 & 80-10-10 规则）',
      subtitle: 'Cloze Pre-training Task #1',
      description:
        '随机选中序列中 15% 的词元用于计算交叉熵损失。为避免微调阶段见不到 [MASK] 导致表征坍塌，选中的词元按 80% 替换为 [MASK]、10% 替换为词表随机词、10% 保留原词。',
      highlightColor: 'blue',
    },
    {
      id: 'deep-bidirectional-encoder',
      title: '3. L 层深度双向 Transformer Encoder',
      subtitle: 'BERT-Base (L=12, H=768, A=12) / BERT-Large (L=24, H=1024, A=16)',
      description:
        '完全移除解码器因果下三角掩码（Causal Mask），每一个词元在全部 L 层自注意力中均可同时关注左侧与右侧的所有词元，实现真正的深度双向语境融合。',
      highlightColor: 'purple',
    },
    {
      id: 'nsp-and-finetuning',
      title: '4. 下一句预测（NSP）与极简微调适配',
      subtitle: '50% IsNext / 50% NotNext & Task-specific Output Layer',
      description:
        '利用 [CLS] 向量进行二分类预测句子 B 是否真实紧随句子 A。微调时无需修改骨干结构，仅需取 [CLS]（分类）或各 Token 顶层向量（问答跨度/NER）接单层线性映射即可端到端训练 2~4 个 Epoch。',
      highlightColor: 'amber',
    },
  ],

  formulas: [
    {
      id: 'input-representation',
      name: '1. 三合一输入嵌入合成公式',
      category: '输入表征',
      formula:
        '\\mathbf{E}_{\\text{input}}(i) = \\mathbf{E}_{\\text{token}}(w_i) + \\mathbf{E}_{\\text{segment}}(s_i) + \\mathbf{E}_{\\text{position}}(i) \\in \\mathbb{R}^{H}',
      explanation:
        'BERT 能够使用完全相同的编码器骨架处理单句和句对任务，核心在于将 30,000 词表的 WordPiece 嵌入、二元句子段落嵌入（s_i ∈ {A, B}）以及长度高达 512 的可学习绝对位置嵌入直接相加，再经 LayerNorm 送入第 1 层 Transformer。',
      variables: [
        { symbol: '\\mathbf{E}_{\\text{token}}(w_i)', desc: '30,000 词表的 WordPiece 子词向量' },
        { symbol: '\\mathbf{E}_{\\text{segment}}(s_i)', desc: '句子归属嵌入（区分句子 A 与句子 B）' },
        { symbol: '\\mathbf{E}_{\\text{position}}(i)', desc: '可学习的绝对位置编码向量（0 ≤ i < 512）' },
        { symbol: 'H', desc: '隐藏层维度（BERT-Base 为 768，BERT-Large 为 1024）' },
      ],
    },
    {
      id: 'mlm-objective',
      name: '2. 掩码语言模型（MLM）对数似然目标',
      category: '预训练目标',
      formula:
        '\\mathcal{L}_{\\text{MLM}}(\\theta) = - \\sum_{i \\in \\mathcal{M}} \\log P\\Big(w_i \\,\\Big|\\, \\tilde{\\mathbf{W}};\\, \\theta\\Big) = - \\sum_{i \\in \\mathcal{M}} \\log \\text{softmax}\\big(\\mathbf{W}_{\\text{vocab}} \\mathbf{T}_i + \\mathbf{b}\\big)_{w_i}',
      explanation:
        '与自回归语言模型对序列中所有位置求损失不同，MLM 仅对被随机选中的 15% 掩码位置集合 M 计算交叉熵损失。这虽然使每个 Batch 收敛所需的步数增加，但换来了不可替代的深度双向上下文感知能力。',
      variables: [
        { symbol: '\\mathcal{M}', desc: '被随机选中用于预测的 15% Token 索引集合' },
        { symbol: '\\tilde{\\mathbf{W}}', desc: '经过 80-10-10 规则腐蚀后的输入词元序列' },
        { symbol: '\\mathbf{T}_i \\in \\mathbb{R}^H', desc: '第 i 个位置经过 L 层双向 Transformer 后的顶层隐藏状态' },
      ],
    },
    {
      id: 'joint-pretraining-loss',
      name: '3. MLM + NSP 联合预训练损失函数',
      category: '预训练目标',
      formula:
        '\\mathcal{L}_{\\text{BERT}} = \\mathcal{L}_{\\text{MLM}} + \\mathcal{L}_{\\text{NSP}}, \\quad P(\\text{IsNext} \\,|\\, \\mathbf{C}) = \\text{softmax}(\\mathbf{W}_{\\text{nsp}} \\mathbf{C}^\\top)',
      explanation:
        '总预训练目标为词元级 MLM 损失与句子级 NSP 二分类损失之和。其中 C ∈ R^H 是首个特殊标记 [CLS] 对应的顶层隐藏向量，预训练语料拼接自 BooksCorpus（8亿词）与英文维基百科（25亿词）。',
      variables: [
        { symbol: '\\mathbf{C} \\in \\mathbb{R}^H', desc: '序列首个特殊符号 [CLS] 的最终隐藏向量，汇聚全句语义' },
        { symbol: '\\mathcal{L}_{\\text{NSP}}', desc: '判断句子 B 是否为句子 A 真实下文（50% 正样本，50% 随机负样本）的交叉熵损失' },
      ],
    },
    {
      id: 'squad-span-prediction',
      name: '4. 抽取式阅读理解（SQuAD）起止跨度概率公式',
      category: '微调适配范式',
      formula:
        'P_{\\text{start}}(i) = \\frac{e^{\\mathbf{S} \\cdot \\mathbf{T}_i}}{\\sum_j e^{\\mathbf{S} \\cdot \\mathbf{T}_j}}, \\quad \\text{Score}(i, j) = \\mathbf{S} \\cdot \\mathbf{T}_i + \\mathbf{E} \\cdot \\mathbf{T}_j \\;\\; (j \\ge i)',
      explanation:
        '展示了 BERT 微调的极致优雅：对于复杂的机器阅读理解任务，根本不需要设计专用循环层或交叉注意力网络，只需新增两个可学习向量——起始向量 S ∈ R^H 与结束向量 E ∈ R^H，与段落中每个 Token 的输出 T_i 做点积即可定位答案跨度！',
      variables: [
        { symbol: '\\mathbf{S}, \\mathbf{E} \\in \\mathbb{R}^H', desc: '微调阶段唯一新增的两个参数向量（答案起点指针与终点指针）' },
        { symbol: '\\text{Score}(i, j)', desc: '候选答案跨度从第 i 个词到第 j 个词的联合打分' },
      ],
    },
  ],

  metricCards: [
    {
      label: 'GLUE 基准平均分',
      value: '80.5%',
      desc: 'BERT-Large 相比此前最强 SOTA (OpenAI GPT 72.8%) 实现 +7.7% 绝对飞跃',
      color: 'emerald',
    },
    {
      label: 'SQuAD v1.1 阅读理解 F1',
      value: '93.2 F1',
      desc: '单模型达 91.8，集成达 93.2，首次在斯坦福问答基准上全面超越人类水平 (91.2)',
      color: 'blue',
    },
    {
      label: 'MLM 掩码采样比例',
      value: '15% (80/10/10)',
      desc: '80% [MASK]、10% 随机词、10% 原词，消除预训练与微调阶段的符号失配',
      color: 'purple',
    },
    {
      label: '参数量级 (Base / Large)',
      value: '110M / 340M',
      desc: '确立了 12 层 (768维) 与 24 层 (1024维) 的工业界编码器黄金标准尺寸',
      color: 'amber',
    },
  ],

  experimentSections: [
    {
      title: 'GLUE 自然语言理解基准与 SQuAD 问答系统全面统治（Table 1 & Table 2）',
      description:
        '为了公平对比，BERT-Base（110M 参数，L=12, H=768, A=12）被设计为与 OpenAI GPT-1 拥有完全相同的模型尺寸，唯一核心区别在于「深度双向注意力 vs. 单向从左到右注意力」。结果证明仅靠双向性就带来了压倒性优势。',
      headers: ['模型架构与参数量', '注意力方向机制', 'MNLI (自然语言推理)', 'QQP / QNLI', 'SQuAD v1.1 (F1)', 'GLUE 综合平均分'],
      rows: [
        ['BiLSTM + ELMo + Attn', '浅层双向 LSTM 拼接', '76.4%', '64.8% / 79.8%', '85.8', '70.0%'],
        ['OpenAI GPT (110M)', '单向从左到右 Transformer', '82.1%', '70.3% / 87.4%', '—', '72.8%'],
        ['BERT-Base (110M 本文)', '深度双向 Transformer (12层)', '84.6%', '71.2% / 90.5%', '88.5', '78.3% (+5.5%)'],
        ['BERT-Large (340M 本文)', '深度双向 Transformer (24层)', '86.7% (SOTA)', '72.1% / 92.7%', '90.9 (单模型)', '80.5% (+7.7%)'],
      ],
    },
    {
      title: '预训练任务消融实验：双向性（MLM vs. Left-to-Right）与 80-10-10 策略（Table 5 & Table 8）',
      description:
        '论文第 5 节通过严谨的消融实验回答了两个核心问题：(1) 去掉双向性（退化为 Left-to-Right No NSP）会损失多少性能？(2) 为什么不能把 15% 掩码词 100% 全部替换成 [MASK]？',
      headers: ['消融变体配置 (基于 BERT-Base)', 'MNLI-m (句对推理)', 'SQuAD v1.1 Dev (F1)', 'CoNLL-2003 NER (特征提取)', '关键结论剖析'],
      rows: [
        ['BERT-Base (MLM + NSP, 80-10-10)', '84.4%', '88.5', '96.4 (Fine-tune) / 96.1 (Feature)', '完整双向预训练 + 混合替换策略全面最优'],
        ['No NSP (仅 MLM，移除下一句预测)', '83.9% (-0.5%)', '87.9 (-0.6)', '—', '移除句子级任务会削弱自然语言推理与阅读理解表现'],
        ['Left-to-Right & No NSP (退化为单向 GPT)', '81.9% (-2.5%)', '77.8 (-10.7 暴跌!)', '—', '单向模型在词元级跨度定位任务（SQuAD）上遭遇毁灭性下降'],
        ['MLM 100% [MASK] (0% 随机, 0% 原词)', '—', '—', '94.9 (-1.2 下降)', '若 100% 用 [MASK]，模型在无 [MASK] 输入时表征退化，80-10-10 必不可少'],
      ],
    },
  ],

  insights: [
    {
      title: '为什么 80-10-10 掩码策略如此精妙？如果 100% 替换成 [MASK] 会发生什么？',
      content:
        '如果在预训练时将选中的 15% 词元 100% 替换为 `[MASK]`，模型很快就会学到一种偷懒捷径：「只有当输入是 `[MASK]` 时，我才需要费力聚合上下文语义；对于普通未遮盖的单词，我什么都不用干」。这会导致在微调和实际推理阶段（此时输入中一个 `[MASK]` 都没有！），所有普通单词的上下文表征质量严重退化。加入「10% 变成随机错误词」和「10% 保持原词」，让模型永远不知道当前看到的普通单词究竟是真的原词还是被掉包的噪声词，从而倒逼它对每一个位置的每一个词都时刻保持高度警惕并提取高质量双向上下文！',
    },
    {
      title: '后续演进：RoBERTa 对 BERT 做了哪些修正？',
      content:
        '2019 年刘知远/Meta 团队提出的 RoBERTa（Robustly Optimized BERT Approach）发现：1) BERT 原本在数据预处理时只做了一次「静态掩码（Static Masking）」，改为每次喂入模型时实时生成的「动态掩码（Dynamic Masking）」效果更好；2) 当输入序列塞满 512 长度的完整跨文档段落并大幅增加训练算力时，原本的 NSP（下一句预测）任务其实可以移除；3) 更大的 Batch Size（8K）与更大的 BPE 词表进一步释放了双向编码器的潜能。',
    },
    {
      title: '为什么在 ChatGPT/LLM 时代，BERT 架构依然不可替代？',
      content:
        '虽然生成式对话由 Decoder-only（GPT）架构主导，但在本平台收录的 **DPR（稠密双塔检索）**、**ColBERT（延迟交互检索）**、Cross-Encoder 重排序（Reranker）、BGE / E5 向量模型以及工业界高并发意图分类与实体识别中，BERT 及其变体（RoBERTa / DeBERTa）凭借「全双向注意力 + 极高单位参数语义密度 + 毫秒级并行编码」依然是 RAG 检索底座的绝对霸主！',
    },
  ],

  takeaways: [
    {
      icon: 'Eye',
      title: '深度双向上下文',
      desc: '移除因果掩码，通过完形填空式 MLM 让每一层 Transformer 同时看清左右两侧完整语境。',
    },
    {
      icon: 'Shuffle',
      title: '80-10-10 黄金法则',
      desc: '80% [MASK]、10% 随机词、10% 原词不变，彻底消除预训练与下游微调的分布失配。',
    },
    {
      icon: 'Layers',
      title: '三合一输入嵌入',
      desc: 'Token + Segment + Position 向量相加配合 [CLS]/[SEP]，一套骨干横扫 11 项理解与问答任务。',
    },
    {
      icon: 'Database',
      title: '现代 RAG 检索基石',
      desc: '直接孕育了 DPR、ColBERT、BGE 等语义向量编码器，撑起大模型时代的知识检索底座。',
    },
  ],
};
