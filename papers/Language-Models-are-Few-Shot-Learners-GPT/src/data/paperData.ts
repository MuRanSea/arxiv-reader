import { UniversalPaperData } from '../../../../src/shared/types/universalPaper.js';

export const GPT_2020_DATA: UniversalPaperData = {
  id: 'gpt-2020',
  title: 'Language Models are Few-Shot Learners (GPT-1 to GPT-3)',
  chineseTitle: '生成式预训练 Transformer 与上下文少样本学习（GPT 系列奠基巨著）',
  subtitle: 'Tom B. Brown, Alec Radford, Dario Amodei, Ilya Sutskever et al. • OpenAI • NeurIPS 2020 最佳论文',
  tags: ['NeurIPS 2020 最佳论文', 'GPT 生成式预训练', 'In-Context Learning 上下文学习', '175B 参数规模化', 'Decoder-Only 自回归'],
  arxivId: '2005.14165',
  pdfUrl: 'https://arxiv.org/pdf/2005.14165.pdf',
  abstractUrl: 'https://arxiv.org/abs/2005.14165',
  summary:
    '正式拉开大语言模型（LLM）时代帷幕的史诗级巨著！从 GPT-1 (117M) 开创「生成式预训练」、GPT-2 (1.5B) 探索「零样本多任务」，到 GPT-3 (175B) 证明仅靠自回归「预测下一个词（Next-Token Prediction）」与 1750 亿参数规模化，无需任何梯度微调，仅凭提示词中的几个示例（Zero/One/Few-Shot In-Context Learning）即可媲美乃至超越监督微调模型！',

  keyContributions: [
    '确立 Decoder-Only 自回归生成式预训练路线：从 GPT-1（Radford et al., 2018）提出因果掩码 Transformer 解码器预训练，到 GPT-3 将同一目标扩展至 96 层、12288 维隐藏层、1750 亿参数与 300B 训练 Token。',
    '提出并系统定义「上下文学习（In-Context Learning, ICL）」三大范式：Few-Shot（给定 K=10~100 个输入输出示例）、One-Shot（仅给 1 个示例）与 Zero-Shot（仅给自然语言指令），全过程权重零更新（No Gradient Updates）。',
    '揭示模型规模与上下文学习能力的幂律关系（Figure 1.2）：训练了从 125M 到 175B 共 8 个尺寸的模型，证明越大规模的模型从上下文示例中提取元知识（Meta-learning）的斜率越陡峭，拉大了 Few-Shot 与 Zero-Shot 的收益差距。',
    '在翻译、闭卷问答（TriviaQA 71.2%）、阅读理解（CoQA 85.0 F1）、SuperGLUE 以及即兴造词、三位数算术等任务上展现出惊人的少样本泛化与涌现能力。',
  ],

  coreProblem:
    '以 BERT/RoBERTa 为代表的「预训练 + 微调（Fine-tuning）」范式虽然强大，但存在三大根本缺陷：(1) 每个新任务都必须收集数千至数万条人工标注数据；(2) 微调极易利用标注数据的虚假捷径（Spurious Correlations），导致分布外泛化能力脆弱；(3) 人类学习新任务时从不需要重刷几万道题来更新大脑突触，往往只需看一句指令或一两个例子就能立刻上手。语言模型能否在完全不更新权重的前提下即插即用？',

  coreIdea:
    '当自回归语言模型在大规模多样化互联网语料上优化「预测下一个词 P(x_t | x_<t)」时，由于语料内部天然包含大量问答、翻译、推理与列表模式，模型被迫在权重更新的「外循环（Outer Loop）」中学会了如何在单次前向传播的「内循环（Inner Loop / 激活状态）」里根据上文模式动态调整预测策略——这就是 In-Context Learning（上下文元学习）！',

  simulatorTitle: 'GPT 上下文学习（Zero / One / Few-Shot）与 125M → 175B 规模涌现模拟器',
  simulatorDesc:
    '交互式切换推理任务与上下文示例数量 K（Zero-Shot / One-Shot / Few-Shot），实时预览构造的自回归 Prompt 上下文窗口，并对比 125M、1.3B、13B 与 175B 四种参数量级的准确率跃升曲线。',

  architectureSteps: [
    {
      id: 'bpe-context-window',
      title: '1. BPE 子词编码与长上下文窗口 (n_ctx = 2048)',
      subtitle: 'Task Description + K Demonstrations + Query',
      description:
        '将任务说明与 K 个 (输入, 输出) 示例拼接为一段连续文本序列，通过 Byte-Pair Encoding (BPE) 转化为整数 Token ID，无需任何任务专用特殊分隔符或新增分类头。',
      highlightColor: 'emerald',
    },
    {
      id: 'causal-decoder-stack',
      title: '2. 96 层因果掩码 Transformer Decoder',
      subtitle: 'Alternating Dense & Locally Banded Sparse Attention',
      description:
        'GPT-3 175B 由 96 层 Decoder 堆叠而成（d_model=12288, n_heads=96, d_head=128），交替使用标准稠密因果自注意力与局部带状稀疏自注意力（仿照 Sparse Transformer）。',
      highlightColor: 'blue',
    },
    {
      id: 'in-context-forward',
      title: '3. 零梯度更新的上下文前向元推理',
      subtitle: 'Inner-Loop Meta-Recognition in Activations',
      description:
        '推理过程中模型参数 Θ 100% 冻结（不执行任何反向传播）。前 K 个示例在多层自注意力的 Key-Value 缓存中构建任务归纳偏置，引导测试 Query 位置的隐藏表征对齐目标输出空间。',
      highlightColor: 'purple',
    },
    {
      id: 'autoregressive-decoding',
      title: '4. 自回归逐词生成与对数似然打分',
      subtitle: 'P(x_t | x_<t; Θ) Generation / Rank Scoring',
      description:
        '对于开放生成任务（问答、算术、翻译），直接按自回归分布逐 Token 采样输出；对于多项选择题，计算各候选答案接在上下文后的条件对数似然并归一化选优。',
      highlightColor: 'amber',
    },
  ],

  formulas: [
    {
      id: 'autoregressive-lm-objective',
      name: '1. 自回归生成式预训练目标（GPT-1 / GPT-2 / GPT-3 统一基石）',
      category: '预训练目标',
      formula:
        '\\mathcal{L}_{\\text{LM}}(\\mathcal{U}; \\Theta) = \\sum_{i=1}^{N} \\log P\\big(u_i \\,\\big|\\, u_{i-k}, \\dots, u_{i-1};\\, \\Theta\\big)',
      explanation:
        '形式极其简洁却蕴含无限潜力：给定无标注文本语料序列 U = {u_1, ..., u_N}，根据因果滑动窗口内的前序词元最大化下一个词元的条件对数似然。伊利亚·苏茨克维（Ilya Sutskever）曾精辟指出：「预测下一个词得足够好，就等价于理解了生成该文本的世界模型」。',
      variables: [
        { symbol: '\\mathcal{U} = \\{u_1, \\dots, u_N\\}', desc: '大规模无监督自然语言词元序列' },
        { symbol: 'k', desc: '上下文窗口大小（GPT-1 为 512，GPT-2 为 1024，GPT-3 为 2048）' },
        { symbol: '\\Theta', desc: 'Transformer Decoder 的全部神经网络参数（GPT-3 达 1750 亿）' },
      ],
    },
    {
      id: 'decoder-block-forward',
      name: '2. 因果 Transformer Decoder 层状态转移方程',
      category: '模型架构',
      formula:
        'h_0 = U W_e + W_p, \\quad h_l = \\text{transformer\\_block}(h_{l-1}) \\quad \\forall l \\in [1, L], \\quad P(u) = \\text{softmax}(h_L W_e^\\top)',
      explanation:
        '输入序列经词嵌入矩阵 W_e 与位置嵌入矩阵 W_p 映射为初始状态 h_0，依次穿过 L 层包含掩码多头自注意力（Masked MHA）与前馈网络（FFN）的解码块，最后复用转置词嵌入矩阵 W_e^T 输出全词表概率分布。',
      variables: [
        { symbol: 'W_e', desc: 'BPE 词表嵌入矩阵（与顶层 LM Head 共享权重）' },
        { symbol: 'W_p', desc: '可学习的绝对位置编码矩阵' },
        { symbol: 'L', desc: 'Transformer 解码器层数（GPT-1 为 12 层，GPT-2 XL 为 48 层，GPT-3 为 96 层）' },
      ],
    },
    {
      id: 'in-context-conditioning',
      name: '3. 上下文学习（In-Context Learning）条件生成公式',
      category: '推理范式革命',
      formula:
        '\\hat{y} = \\arg\\max_{y} P_\\Theta\\Big(y \\;\\Big|\\; \\mathcal{I},\\, (x_1, y_1),\\, (x_2, y_2),\\, \\dots,\\, (x_K, y_K),\\, x_{\\text{query}}\\Big)',
      explanation:
        '将微调时代的「更新参数 θ ← θ - η∇L」彻底改写为「扩展条件上下文」：当 K=0 时为 Zero-Shot（仅含任务指令 I 与问题 x_query）；当 K=1 时为 One-Shot；当 1 < K ≤ 100 时为 Few-Shot。全程参数 Θ 保持恒定不变！',
      variables: [
        { symbol: '\\mathcal{I}', desc: '自然语言任务描述指令（Task Instruction）' },
        { symbol: '(x_k, y_k)', desc: '放入提示词上下文中的第 k 个演示样本对（Demonstration）' },
        { symbol: 'K', desc: '上下文示例个数（通常取 10 ~ 64，受限于上下文窗口长度）' },
      ],
    },
    {
      id: 'compute-scaling-law',
      name: '4. 预训练算力预算与参数规模关系（Scaling Law）',
      category: '规模化定律',
      formula:
        'C \\approx 6 \\cdot N_{\\text{params}} \\cdot D_{\\text{tokens}} \\approx 3.14 \\times 10^{23} \\text{ FLOPs} \\;\\; (\\text{GPT-3 175B})',
      explanation:
        '每个参数在每个训练 Token 上约执行 2 次前向乘加与 4 次反向传播乘加（共 6 FLOPs）。GPT-3 175B 在 300B Token 上训练，总算力消耗达 3.64×10^3 PF-days（约 3.14×10^23 FLOPs），验证了交叉熵损失随算力呈严格幂律下降。',
      variables: [
        { symbol: 'N_{\\text{params}}', desc: '非嵌入层模型参数总数（1.75 × 10^11）' },
        { symbol: 'D_{\\text{tokens}}', desc: '预训练语料总词元数（3.0 × 10^11 tokens）' },
      ],
    },
  ],

  metricCards: [
    {
      label: 'GPT-3 旗舰参数量',
      value: '175B (1750亿)',
      desc: '96 层、12288 维隐藏状态、96 个注意力头，比前代 GPT-2 (1.5B) 扩大超过 116 倍',
      color: 'emerald',
    },
    {
      label: '微调梯度更新次数',
      value: '0 次 (零微调)',
      desc: 'Zero-Shot / One-Shot / Few-Shot 全程冻结权重，仅靠 2048 窗口内的上下文示例适应新任务',
      color: 'blue',
    },
    {
      label: 'TriviaQA 闭卷问答',
      value: '71.2% 准确率',
      desc: 'Few-Shot 模式下无需任何外部检索器，直接超越 Fine-tuned T5-11B 闭卷系统 (+3.2%)',
      color: 'purple',
    },
    {
      label: '人类真假新闻鉴别率',
      value: '52% (近随机)',
      desc: '人类评估者区分 GPT-3 175B 生成新闻与真实新闻的准确率仅为 52%，与抛硬币无异',
      color: 'amber',
    },
  ],

  experimentSections: [
    {
      title: 'GPT-1 → GPT-2 → GPT-3 三代架构与预训练规模跨越式演进',
      description:
        'OpenAI 在 2018 至 2020 年间以惊人的战略定力，在同一套 Decoder-only 自回归架构上连续推进了三个数量级的规模扩张，完成了从「预训练+微调」到「少样本上下文学习」的范式跃迁。',
      headers: ['模型代际与年份', '参数规模 (Parameters)', '层数 L / 维度 d / 头数 H', '上下文窗口', '预训练数据规模', '核心范式突破'],
      rows: [
        [
          'GPT-1 (2018.06)',
          '117M (1.17 亿)',
          'L=12, d=768, H=12',
          '512 tokens',
          'BooksCorpus (~5GB)',
          '开创「自回归生成式预训练 + 判别式微调」，在 9/12 任务上超越专项模型',
        ],
        [
          'GPT-2 (2019.02)',
          '1.5B (15 亿)',
          'L=48, d=1600, H=25',
          '1024 tokens',
          'WebText (40GB, 800万文档)',
          '提出「Language Models are Unsupervised Multitask Learners」，验证零样本迁移',
        ],
        [
          'GPT-3 (2020.05 本文)',
          '175B (1750 亿)',
          'L=96, d=12288, H=96',
          '2048 tokens',
          '300B tokens (过滤版 CommonCrawl + Books + Wiki)',
          '确立 In-Context Few-Shot Learning，催生 Prompt Engineering 与现代 LLM 浪潮',
        ],
      ],
    },
    {
      title: '规模效应实证：8 种模型尺寸在 Zero / One / Few-Shot 下的表现对比（论文核心实验）',
      description:
        '当模型参数量从 125M 扩展到 175B 时，不仅基础零样本能力提升，更重要的是「从上下文 K 个示例中学习的能力（Few-Shot 相对 Zero-Shot 的增益）」发生了质的飞跃！',
      headers: ['模型尺寸变体', '层数 / 隐藏维度', 'TriviaQA (Zero / One / Few)', '三位数加法算术 (Few-Shot)', 'SuperGLUE 平均分 (Few-Shot)'],
      rows: [
        ['GPT-3 Small (125M)', 'L=12, d=768', '14.2% / 15.6% / 19.8%', '0.8% (完全不会)', '45.2'],
        ['GPT-3 XL (1.3B)', 'L=24, d=2048', '32.1% / 37.4% / 44.6%', '4.2% (偶发猜中)', '54.8'],
        ['GPT-3 13B', 'L=40, d=5140', '49.5% / 55.1% / 61.3%', '18.5% (初步涌现)', '64.9'],
        ['GPT-3 175B (旗舰)', 'L=96, d=12288', '64.3% / 68.0% / 71.2% (超微调 SOTA)', '80.4% (规模涌现爆发!)', '71.8 (逼近微调 BERT-Large)'],
      ],
    },
  ],

  insights: [
    {
      title: '为什么 Few-Shot In-Context Learning 能够在完全不更新权重的情况下「学会」新任务？',
      content:
        '后续研究（如谢尚轩等人的梯度下降隐式等价理论与 Induction Heads 归纳头研究）揭示：多层自注意力机制在读取前缀中的 `(x_1, y_1), ..., (x_K, y_K)` 时，Attention 矩阵的计算在数学形式上等价于在当前层隐藏状态上执行了一次隐式的「单步梯度下降（Implicit Finetuning）」或核回归！换句话说，GPT-3 在预训练的权重更新（外循环）中，把一个「通用学习算法」编译进了前向传播的激活动力学（内循环）里。',
    },
    {
      title: '为什么最终 Decoder-only (GPT) 路线在大模型时代战胜了 Encoder-only (BERT) 与 Encoder-Decoder (T5)？',
      content:
        '1) **训练效率最高**：在自回归因果掩码下，序列中的每一个 Token（100% 位置）都同时充当上下文输入和预测监督信号，而 BERT 的 MLM 每个 Batch 只预测 15% 的被掩码位置，有效梯度利用率相差近 7 倍；2) **零样本/少样本统一性**：自然语言生成、代码编写、多轮对话与推理链（Chain-of-Thought）天然契合「从左向右续写」的自回归过程；3) **KV Cache 推理友好**：因果掩码保证了历史 Token 的键值状态严格不变，支持高效增量缓存解码。',
    },
    {
      title: '从 GPT-3 基座模型到 InstructGPT / ChatGPT 的最后一公里',
      content:
        '尽管 GPT-3 175B 具备惊人的知识储备与少样本学习能力，但它本质上仍是一个「文档续写器」——当你问它一个问题时，它可能会续写出十个新的问题，而不是直接回答你。2022 年 OpenAI 在 GPT-3 基础上引入 **SFT（监督指令微调）+ RLHF（基于人类反馈的强化学习，Ouyang et al., 2022）**，对齐了人类意图，最终引爆了 ChatGPT 革命。',
    },
  ],

  takeaways: [
    {
      icon: 'Sparkles',
      title: '上下文学习 (ICL)',
      desc: '零梯度更新！仅凭提示词中的 K 个自然语言示例，即可在单次前向传播中即时适配新任务。',
    },
    {
      icon: 'TrendingUp',
      title: '1750 亿规模涌现',
      desc: '验证 Scaling Law 幂律，模型越大，从 Few-Shot 示例中吸收规律的元学习能力越强。',
    },
    {
      icon: 'Layers',
      title: '纯自回归大道至简',
      desc: '仅凭「预测下一个词」与因果 Transformer Decoder，将所有 NLP 任务大一统为文本续写。',
    },
    {
      icon: 'Cpu',
      title: '现代 LLM 时代起点',
      desc: '直接开启了 Prompt 工程、思维链（CoT）、RLHF 指令对齐与通用人工智能探索浪潮。',
    },
  ],
};
