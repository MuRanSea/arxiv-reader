import { PaperRegistryItem } from '../src/shared/types/paper.js';
import DecisionRagApp from './Retriever-Free-Retrieval-Navigating-Documents-with-Decision-Models/src/App.js';
import Rag2020App from './Retrieval-Augmented-Generation-for-Knowledge-Intensive-NLP-Tasks/src/App.js';
import Dpr2020App from './Dense-Passage-Retrieval-for-Open-Domain-Question-Answering/src/App.js';
import Colbert2020App from './ColBERT-Efficient-and-Effective-Passage-Search-via-Contextualized-Late-Interaction-over-BERT/src/App.js';
import Transformer2017App from './Attention-Is-All-You-Need/src/App.js';
import Lora2021App from './LoRA-Low-Rank-Adaptation-of-Large-Language-Models/src/App.js';
import Peft2019App from './Parameter-Efficient-Transfer-Learning-for-NLP/src/App.js';
import Vit2020App from './An-Image-is-Worth-16x16-Words-Transformers-for-Image-Recognition-at-Scale/src/App.js';
import Vae2013App from './Auto-Encoding-Variational-Bayes/src/App.js';
import Gan2014App from './Generative-Adversarial-Nets/src/App.js';
import Bert2018App from './BERT-Pre-training-of-Deep-Bidirectional-Transformers-for-Language-Understanding/src/App.js';
import StableDiffusion2022App from './High-Resolution-Image-Synthesis-with-Latent-Diffusion-Models/src/App.js';
import Gpt2020App from './Language-Models-are-Few-Shot-Learners-GPT/src/App.js';

export type PaperItem = PaperRegistryItem;

export const REGISTERED_PAPERS: PaperRegistryItem[] = [
  {
    id: 'transformer-2017',
    folderName: 'Attention-Is-All-You-Need',
    titleZh: '注意力就是你所需的一切：开创现代大模型的 Transformer 架构',
    titleEn: 'Attention Is All You Need',
    arxivId: 'arXiv:1706.03762',
    doi: 'https://arxiv.org/abs/1706.03762',
    githubUrl: 'https://github.com/tensorflow/tensor2tensor',
    authors: [
      'Ashish Vaswani',
      'Noam Shazeer',
      'Niki Parmar',
      'Jakob Uszkoreit',
      'Llion Jones',
      'Aidan N. Gomez',
      'Łukasz Kaiser',
      'Illia Polosukhin'
    ],
    affiliations: ['Google Brain', 'Google Research', 'University of Toronto'],
    publishDate: 'NeurIPS 2017 (现代AI总基石)',
    category: '大模型架构',
    tags: ['Transformer', 'Self-Attention', 'Multi-Head Attention', '缩放点积 √d_k', '位置编码'],
    status: 'active',
    tldrZh:
      '现代人工智能总基石！彻底摒弃统治序列建模数十年的 RNN/LSTM 与 CNN，首次提出完全基于「自注意力机制（Self-Attention）」的 Transformer 架构。通过缩放点积注意力 QK^T/√d_k、8 头子空间并行注意力与正余弦位置编码，将序列任意位置交互路径缩短至 O(1) 并实现全序列并行训练！',
    keyMetrics: [
      { label: '最大依赖路径长度', value: 'O(1) 常数级 (RNN为O(n))', highlight: true },
      { label: 'WMT14 英德翻译', value: '28.4 BLEU (超集成SOTA)', highlight: true },
      { label: 'WMT14 英法翻译', value: '41.8 BLEU (仅3.5天训练)' },
      { label: '多头子空间配置', value: 'h=8, d_k=64, d_model=512' }
    ],
    features: [
      '5分钟通俗速通导览',
      '中英双语全文精读',
      'Q/K/V 缩放点积与因果掩码实验台',
      'RNN/CNN/Transformer 复杂度对比',
      '核心概念双解词典'
    ],
    component: Transformer2017App
  },
  {
    id: 'bert-2018',
    folderName: 'BERT-Pre-training-of-Deep-Bidirectional-Transformers-for-Language-Understanding',
    titleZh: 'BERT：面向语言理解的深度双向 Transformer 预训练模型',
    titleEn: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
    arxivId: 'arXiv:1810.04805',
    doi: 'https://arxiv.org/abs/1810.04805',
    githubUrl: 'https://github.com/google-research/bert',
    authors: ['Jacob Devlin', 'Ming-Wei Chang', 'Kenton Lee', 'Kristina Toutanova'],
    affiliations: ['Google AI Language'],
    publishDate: 'NAACL 2019 (最佳长论文)',
    category: '大模型架构',
    tags: ['BERT', '深度双向编码器', 'Masked LM (MLM)', '80-10-10 掩码策略', '预训练+微调'],
    status: 'active',
    tldrZh:
      '打破单向语言模型只能看单侧上下文的桎梏！借鉴完形填空提出「掩码语言模型（MLM）」与精妙的 80-10-10 替换规则（80% [MASK]、10% 随机词、10% 原词不变），首次训练出每一层都能融合左右完整语境的深度双向 Transformer 编码器，一举横扫 11 项 NLP 基准并成为现代稠密检索核心骨干！',
    keyMetrics: [
      { label: 'GLUE 综合基准得分', value: '80.5% (+7.7% 绝对飞跃)', highlight: true },
      { label: 'SQuAD v1.1 问答 F1', value: '93.2 (超越人类水平)', highlight: true },
      { label: 'MLM 黄金掩码策略', value: '15% 采样 (80/10/10)' },
      { label: '标准编码器尺寸', value: '110M (Base) / 340M (Large)' }
    ],
    features: [
      '5分钟通俗速通导览',
      '中英双语精读解析',
      '双向 vs 单向消歧与 80-10-10 掩码模拟器',
      'GLUE / SQuAD 消融基准对比',
      '核心概念双解词典'
    ],
    component: Bert2018App
  },
  {
    id: 'gpt-2020',
    folderName: 'Language-Models-are-Few-Shot-Learners-GPT',
    titleZh: 'GPT 生成式预训练与少样本上下文学习：从 GPT-1 到 GPT-3 (175B)',
    titleEn: 'Language Models are Few-Shot Learners (GPT-1 to GPT-3)',
    arxivId: 'arXiv:2005.14165',
    doi: 'https://arxiv.org/abs/2005.14165',
    githubUrl: 'https://github.com/openai/gpt-3',
    authors: [
      'Tom B. Brown',
      'Alec Radford',
      'Benjamin Mann',
      'Nick Ryder',
      'Jared Kaplan',
      'Dario Amodei',
      'Ilya Sutskever'
    ],
    affiliations: ['OpenAI'],
    publishDate: 'NeurIPS 2020 (最佳论文)',
    category: '大模型架构',
    tags: ['GPT-3 (175B)', 'In-Context Learning 上下文学习', 'Zero/One/Few-Shot', 'Decoder-Only 自回归', '规模涌现'],
    status: 'active',
    tldrZh:
      '正式拉开现代大语言模型（LLM）时代的史诗级巨著！证明将纯自回归 Decoder-Only 架构与「预测下一个词」扩展至 1750 亿参数后，完全无需任何梯度更新微调（∇Θ = 0），仅凭提示词窗口中的几个自然语言示例（Zero/One/Few-Shot In-Context Learning）即可即时学会新任务并触发规模涌现！',
    keyMetrics: [
      { label: '模型旗舰参数规模', value: '175B (1750亿参数)', highlight: true },
      { label: 'TriviaQA 闭卷问答', value: '71.2% (超微调T5-11B)', highlight: true },
      { label: '微调梯度更新次数', value: '0 次 (纯前向 ICL)' },
      { label: '上下文窗口与层数', value: 'L=96 层, n_ctx=2048' }
    ],
    features: [
      '5分钟通俗速通导览',
      'GPT-1/2/3 三代演进精读',
      'Zero/One/Few-Shot 与 125M→175B 涌现实验台',
      '多尺寸规模定律对比矩阵',
      '核心概念双解词典'
    ],
    component: Gpt2020App
  },
  {
    id: 'lora-2021',
    folderName: 'LoRA-Low-Rank-Adaptation-of-Large-Language-Models',
    titleZh: 'LoRA 低秩适配：大语言模型的低秩矩阵高效微调架构',
    titleEn: 'LoRA: Low-Rank Adaptation of Large Language Models',
    arxivId: 'arXiv:2106.09685',
    doi: 'https://arxiv.org/abs/2106.09685',
    githubUrl: 'https://github.com/microsoft/LoRA',
    authors: [
      'Edward J. Hu (胡杰)',
      'Yelong Shen (沈业龙)',
      'Phillip Wallis',
      'Zeyuan Allen-Zhu (朱泽园)',
      'Yuanzhi Li (李远志)',
      'Shean Wang',
      'Lu Wang',
      'Weizhu Chen (陈维柱)'
    ],
    affiliations: ['Microsoft Corporation (微软)', 'Carnegie Mellon University'],
    publishDate: 'ICLR 2022 (大模型微调工业标准)',
    category: '高效微调 (PEFT)',
    tags: ['LoRA', '低秩分解 ΔW=BA', '参数缩减 10000倍', '零推理延迟合并', '本征秩 Intrinsic Rank'],
    status: 'active',
    tldrZh:
      '大模型微调绝对工业界标准！洞察到预训练模型在适配下游任务时的权重增量 ΔW 具有极低的「本征秩（Intrinsic Rank）」，通过冻结原始权重 W_0 并注入低秩旁路 ΔW = B·A（r ≪ d），在 GPT-3 175B 上将可训练参数压缩 10,000 倍、显存降低 3 倍，且推理时可重参数化合并 W = W_0 + BA 实现零额外延迟！',
    keyMetrics: [
      { label: 'GPT-3 可训练参数压缩', value: '10,000x 缩减 (175B→18M)', highlight: true },
      { label: '训练 GPU 显存节省', value: '3x 降低 (1.2TB→350GB)', highlight: true },
      { label: '在线推理额外延迟', value: '0.0 ms (W = W_0 + BA)' },
      { label: '最佳有效秩 r 甜点', value: 'r = 1 ~ 8 即达最优' }
    ],
    features: [
      '5分钟通俗速通导览',
      '中英双语全文精读',
      'LoRA 低秩矩阵分解与零延迟合并计算器',
      'Full FT / Adapter / Prefix / LoRA 全面对比',
      '核心概念双解词典'
    ],
    component: Lora2021App
  },
  {
    id: 'peft-2019',
    folderName: 'Parameter-Efficient-Transfer-Learning-for-NLP',
    titleZh: 'PEFT 参数高效微调：从 Bottleneck Adapter 奠基到大一统框架',
    titleEn: 'Parameter-Efficient Transfer Learning for NLP & Unified PEFT View',
    arxivId: 'arXiv:1902.00751',
    doi: 'https://arxiv.org/abs/1902.00751',
    githubUrl: 'https://github.com/google-research/adapter-bert',
    authors: [
      'Neil Houlsby',
      'Andrei Giurgiu',
      'Stanislaw Jastrzebski',
      'Bruna Morrone',
      'Junxian He (何俊贤)',
      'Chunting Zhou (周春婷)',
      'Xuezhe Ma',
      'Graham Neubig'
    ],
    affiliations: ['Google Research', 'Carnegie Mellon University (CMU)'],
    publishDate: 'ICML 2019 & ICLR 2022 (PEFT 开山与统一)',
    category: '高效微调 (PEFT)',
    tags: ['PEFT 开山之作', 'Bottleneck Adapter', '近恒等初始化', 'Prefix/Prompt-Tuning', 'MAM 统一视图'],
    status: 'active',
    tldrZh:
      '开创「参数高效微调（PEFT）」领域的奠基之作与大一统理论！Houlsby 等人首次提出在冻结的 Transformer 层内插入带有「下投影 → 非线性 → 上投影 + 残差近恒等初始化」的瓶颈 Adapter，仅训练 3.6% 参数即可逼平全量微调；何俊贤等人进一步将 Adapter、Prefix-Tuning 与 LoRA 统一在同一数学方程下并诞生 MAM Adapter！',
    keyMetrics: [
      { label: 'GLUE 性能保持率', value: '99.6% (80.0 vs 80.4)', highlight: true },
      { label: '单任务新增训练参数', value: '仅 0.5% ~ 3.6%', highlight: true },
      { label: '50个任务总存储体积', value: '1.7x (全量微调需 50x)' },
      { label: '大一统组合最优解', value: 'MAM Adapter (6.7%参数超SOTA)' }
    ],
    features: [
      '5分钟通俗速通导览',
      'Adapter 奠基与统一视图精读',
      '五大 PEFT 架构与近恒等初始化实验台',
      'GLUE 瓶颈维度消融与范式对比',
      '核心概念双解词典'
    ],
    component: Peft2019App
  },
  {
    id: 'vit-2020',
    folderName: 'An-Image-is-Worth-16x16-Words-Transformers-for-Image-Recognition-at-Scale',
    titleZh: '一张图抵得上 16x16 的词：大规模图像识别中的视觉 Transformer (ViT)',
    titleEn: 'An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale',
    arxivId: 'arXiv:2010.11929',
    doi: 'https://arxiv.org/abs/2010.11929',
    githubUrl: 'https://github.com/google-research/vision_transformer',
    authors: [
      'Alexey Dosovitskiy',
      'Lucas Beyer',
      'Alexander Kolesnikov',
      'Dirk Weissenborn',
      'Xiaohua Zhai (翟晓华)',
      'Thomas Unterthiner',
      'Jakob Uszkoreit',
      'Neil Houlsby'
    ],
    affiliations: ['Google Research, Brain Team'],
    publishDate: 'ICLR 2021 (视觉Transformer奠基)',
    category: '视觉与生成模型',
    tags: ['ViT 视觉Transformer', '16x16 图像切块 Patch', '归纳偏置 vs 数据规模', '2D位置编码插值', '多模态视觉底座'],
    status: 'active',
    tldrZh:
      '终结 CNN 在计算机视觉领域十年统治、打通图文多模态大一统架构的里程碑！直接将 224×224 图像切分为 14×14=196 个 16×16 图像块（Patches），线性投影后作为词元序列喂入标准 Transformer 编码器。揭示了「大规模预训练（14M~300M）战胜卷积归纳偏置」的科学定律，以 1/4 算力取得 88.55% ImageNet Top-1 准确率！',
    keyMetrics: [
      { label: 'ImageNet Top-1 准确率', value: '88.55% (ViT-H/14 SOTA)', highlight: true },
      { label: '预训练 TPUv3 算力消耗', value: '仅 BiT-ResNet 的 25%', highlight: true },
      { label: '224×224 标准切块数', value: '196 Patches (16×16)' },
      { label: '反超 CNN 数据规模拐点', value: '≥ 14M ~ 300M 图像' }
    ],
    features: [
      '5分钟通俗速通导览',
      '中英双语全文精读',
      'ViT 图像切块序列化与数据规模反超实验台',
      'ViT vs ResNet/BiT 算力精度对比',
      '核心概念双解词典'
    ],
    component: Vit2020App
  },
  {
    id: 'vae-2013',
    folderName: 'Auto-Encoding-Variational-Bayes',
    titleZh: 'VAE 变分自编码器奠基论文：自动编码变分贝叶斯与重参数化技巧',
    titleEn: 'Auto-Encoding Variational Bayes (VAE)',
    arxivId: 'arXiv:1312.6114',
    doi: 'https://arxiv.org/abs/1312.6114',
    githubUrl: 'https://github.com/dpkingma/vae',
    authors: ['Diederik P. Kingma', 'Max Welling'],
    affiliations: ['University of Amsterdam (阿姆斯特丹大学)'],
    publishDate: 'ICLR 2014 (深度生成模型基石)',
    category: '视觉与生成模型',
    tags: ['VAE 变分自编码器', 'Reparameterization 重参数化', 'ELBO 证据下界', '解析 KL 散度', '连续流形潜空间'],
    status: 'active',
    tldrZh:
      '现代深度生成模型的开山巨著！针对连续隐变量后验分布 p(z|x) 难解且随机采样阻断梯度的根本困境，提出「重参数化技巧」z = μ + σ ⊙ ε（ε ~ N(0,I)）与高斯解析变分下界（ELBO），首次将变分贝叶斯推断与神经网络反向传播无缝融合，为后来的 Stable Diffusion 奠定了感知压缩潜空间底座！',
    keyMetrics: [
      { label: '重参数化梯度采样数', value: 'L = 1 次即可稳定收敛', highlight: true },
      { label: 'Frey Face 变分下界提升', value: '+175 nats (超Wake-Sleep)', highlight: true },
      { label: '后验推断复杂度', value: 'O(1) 摊销单步前向' },
      { label: '现代生成生态地位', value: 'Stable Diffusion / Sora 潜空间底座' }
    ],
    features: [
      '5分钟通俗速通导览',
      '变分推断与重参数化精读',
      'z = μ + σ ⊙ ε 梯度流与 2D 流形插值实验台',
      'AEVB vs Wake-Sleep / REINFORCE 对比',
      '核心概念双解词典'
    ],
    component: Vae2013App
  },
  {
    id: 'gan-2014',
    folderName: 'Generative-Adversarial-Nets',
    titleZh: 'GAN 生成对抗网络奠基论文：二人极小极大对抗博弈生成框架',
    titleEn: 'Generative Adversarial Nets (GAN)',
    arxivId: 'arXiv:1406.2661',
    doi: 'https://arxiv.org/abs/1406.2661',
    githubUrl: 'https://github.com/goodfeli/adversarial',
    authors: [
      'Ian J. Goodfellow',
      'Jean Pouget-Abadie',
      'Mehdi Mirza',
      'Bing Xu',
      'David Warde-Farley',
      'Sherjil Ozair',
      'Aaron Courville',
      'Yoshua Bengio'
    ],
    affiliations: ['Université de Montréal (蒙特利尔大学 / MILA)'],
    publishDate: 'NeurIPS 2014 (对抗生成开山之作)',
    category: '视觉与生成模型',
    tags: ['GAN 生成对抗网络', 'Minimax 二人零和博弈', '纳什均衡 D*(x)=1/2', 'JS 散度最小化', '非饱和损失'],
    status: 'active',
    tldrZh:
      '被誉为「过去十年机器学习最酷的想法」！通过构造生成器 G（造假者）与判别器 D（鉴伪者）的极小极大对抗博弈 min_G max_D V(D,G)，彻底摆脱马尔可夫链（MCMC）与显式似然积分。严格证明当 p_g = p_data 时最优判别器恒输出 D*(x) = 1/2，价值函数收敛至全局最小值 -log 4！',
    keyMetrics: [
      { label: '全局纳什均衡判别概率', value: 'D*(x) = 1/2 (p_g = p_data)', highlight: true },
      { label: '理论最优价值下界', value: '-log 4 ≈ -1.3863 nats', highlight: true },
      { label: 'MNIST Parzen 对数似然', value: '225 ± 2 (超DBN/CAE)' },
      { label: '采样所需 MCMC 步数', value: '0 步 (单次前向直出)' }
    ],
    features: [
      '5分钟通俗速通导览',
      '最优判别器与 JS 散度证明精读',
      'Figure 1 四阶段博弈演化与非饱和梯度模拟器',
      'GAN vs VAE vs RBM/DBM 全景对比',
      '核心概念双解词典'
    ],
    component: Gan2014App
  },
  {
    id: 'stable-diffusion-2022',
    folderName: 'High-Resolution-Image-Synthesis-with-Latent-Diffusion-Models',
    titleZh: 'Stable Diffusion 奠基论文：基于潜在扩散模型的高分辨率图像合成 (LDM)',
    titleEn: 'High-Resolution Image Synthesis with Latent Diffusion Models',
    arxivId: 'arXiv:2112.10752',
    doi: 'https://arxiv.org/abs/2112.10752',
    githubUrl: 'https://github.com/CompVis/latent-diffusion',
    authors: [
      'Robin Rombach',
      'Andreas Blattmann',
      'Dominik Lorenz',
      'Patrick Esser',
      'Björn Ommer'
    ],
    affiliations: ['LMU Munich (慕尼黑大学 CompVis)', 'Runway'],
    publishDate: 'CVPR 2022 Oral (Stable Diffusion 原论文)',
    category: '视觉与生成模型',
    tags: ['Stable Diffusion', 'Latent Diffusion (LDM)', '感知压缩 f=8', 'Cross-Attention 文生图', '二维潜空间 UNet'],
    status: 'active',
    tldrZh:
      '引爆全球 AIGC 文生图浪潮的 Stable Diffusion 原始论文！提出将图像生成解耦为「感知压缩（VAE 下采样 f=8 滤除高频像素冗余）」与「语义压缩（在 64×64×4 二维潜空间训练扩散 UNet）」两个阶段，并通过 Cross-Attention 注入文本条件，将训练算力与显存降低一个数量级，让消费级显卡跑起高清文生图！',
    keyMetrics: [
      { label: '潜空间张量压缩率 (f=8)', value: '48x 体积压缩 (面积缩64倍)', highlight: true },
      { label: '扩散训练与采样加速', value: '8.5x ~ 14.2x 提速', highlight: true },
      { label: 'CelebA-HQ 合成质量', value: '5.11 FID (新 SOTA)' },
      { label: '黄金下采样甜点因子', value: 'f = 4 或 f = 8 (SD标准)' }
    ],
    features: [
      '5分钟通俗速通导览',
      '两阶段感知/语义压缩全文精读',
      '下采样率 f、潜空间去噪与 Cross-Attention 实验台',
      'LDM-1~32 消融实验与 FID 对比',
      '核心概念双解词典'
    ],
    component: StableDiffusion2022App
  },
  {
    id: 'decisionrag',
    folderName: 'Retriever-Free-Retrieval-Navigating-Documents-with-Decision-Models',
    titleZh: '免检索器的检索架构：利用决策模型在文档层级树中智能导航 (DecisionRAG)',
    titleEn: 'Retriever-Free Retrieval: Navigating Documents with Decision Models',
    arxivId: 'arXiv:2610.35868',
    doi: 'https://doi.org/10.48550/arXiv.2610.35868',
    githubUrl: 'https://github.com/decisionrag/decision-rag',
    authors: [
      'Chao Wan (万超)',
      'Paul Jünger',
      'Beixi Du (杜北希)',
      'Bodong Liu (刘博东)',
      'Navaneetha Krishnan',
      'Kilian Q. Weinberger'
    ],
    affiliations: ['Cornell University (康奈尔大学)', 'ASAPP Research'],
    publishDate: '2026年10月 (Preprint)',
    category: 'RAG与检索',
    tags: ['Retriever-Free', 'Zero-Token', '层级树导航', 'Beam Search', '共享上下文'],
    status: 'active',
    tldrZh:
      '彻底淘汰传统向量数据库与粗筛检索器。将语料库组织为天然层级树，由预训练 LLM 亲自操盘单步前向传播（零Token生成）与共享上下文横向PK，在数百万段落库中实现 0.7~1.8 秒的高速精准定位，R@1 暴涨 13.8~17.4 点！',
    keyMetrics: [
      { label: 'MultiDoc2Dial R@1', value: '60.0% (+13.8%)', highlight: true },
      { label: 'NQ 268万段落 Hit@1', value: '71.0% (+17.4%)', highlight: true },
      { label: '端到端检索延迟', value: '0.7s ~ 1.8s' },
      { label: '自回归Token消耗', value: '0 Tokens' }
    ],
    features: [
      '5分钟通俗速通导览',
      '中英全译精读与双语对照',
      '分层决策导航实验台 (在线试玩)',
      '五大范式基准对比矩阵',
      '概念双解词典 (白话+学术)'
    ],
    component: DecisionRagApp
  },
  {
    id: 'rag-2020',
    folderName: 'Retrieval-Augmented-Generation-for-Knowledge-Intensive-NLP-Tasks',
    titleZh: 'RAG 奠基论文：面向知识密集型 NLP 任务的检索增强生成架构',
    titleEn: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
    arxivId: 'arXiv:2005.11401',
    doi: 'https://arxiv.org/abs/2005.11401',
    githubUrl: 'https://github.com/huggingface/transformers/tree/main/examples/research_projects/rag',
    authors: [
      'Patrick Lewis',
      'Ethan Perez',
      'Aleksandra Piktus',
      'Fabio Petroni',
      'Vladimir Karpukhin',
      'Wen-tau Yih',
      'Sebastian Riedel',
      'Douwe Kiela'
    ],
    affiliations: ['Facebook AI Research (FAIR)', 'UCL', 'NYU'],
    publishDate: 'NeurIPS 2020 (开山之作)',
    category: 'RAG与检索',
    tags: ['RAG奠基', 'RAG-Sequence', 'RAG-Token', '隐变量边缘化', '索引热插拔'],
    status: 'active',
    tldrZh:
      '正式命名并开创「RAG」范式的奠基论文！首次将预训练 Seq2Seq 生成器（BART 参数化记忆）与 2100 万维基百科稠密向量索引（DPR 非参数化记忆）融合在端到端概率边缘化框架中，提出 RAG-Sequence 与 RAG-Token 两大模型，以 6 亿参数击败 110 亿参数闭卷 T5-11B，并实现零重训练知识热插拔！',
    keyMetrics: [
      { label: 'Natural Questions EM', value: '44.5% (超T5-11B +7.9%)', highlight: true },
      { label: '人工事实性盲测胜率', value: '42.7% vs 7.1%', highlight: true },
      { label: '知识索引热插拔', value: '4% ➔ 68% (零训练)' },
      { label: '外部维基索引规模', value: '2100 万段落' }
    ],
    features: [
      '5分钟通俗速通导览',
      '全文6章中英对照精读',
      'RAG-Token 逐词边缘化与热插拔实验台',
      '权威问答与生成基准全表',
      '核心概念双解词典'
    ],
    component: Rag2020App
  },
  {
    id: 'dpr-2020',
    folderName: 'Dense-Passage-Retrieval-for-Open-Domain-Question-Answering',
    titleZh: 'DPR 稠密向量检索论文：面向开放域问答的稠密段落检索架构',
    titleEn: 'Dense Passage Retrieval for Open-Domain Question Answering',
    arxivId: 'arXiv:2004.04906',
    doi: 'https://arxiv.org/abs/2004.04906',
    githubUrl: 'https://github.com/facebookresearch/DPR',
    authors: [
      'Vladimir Karpukhin',
      'Barlas Oğuz',
      'Sewon Min',
      'Patrick Lewis',
      'Danqi Chen (陈丹琦)',
      'Wen-tau Yih (衣文涛)'
    ],
    affiliations: ['Facebook AI Research (FAIR)', 'University of Washington', 'Princeton University'],
    publishDate: 'EMNLP 2020 (向量检索奠基)',
    category: 'RAG与检索',
    tags: ['DPR', '双塔编码器', 'In-Batch Negatives', 'BM25困难负样本', 'FAISS MIPS'],
    status: 'active',
    tldrZh:
      '打破“稠密向量不如 BM25”历史成见的里程碑之作！证明无需昂贵的 ICT 预训练，仅使用两个标准 BERT 构建双编码器，配合「批内负样本复用（In-Batch Negatives）+ 1个 BM25 困难负样本」对比学习，即可将 NQ Top-20 召回率从 BM25 的 59.1% 狂拉至 79.4%（混合检索达 82.6%）！',
    keyMetrics: [
      { label: 'NQ Top-20 召回率', value: '79.4% (超BM25 +20.3%)', highlight: true },
      { label: 'Hybrid 混合检索 Top-20', value: '82.6%', highlight: true },
      { label: '端到端问答 EM', value: '41.5% (超ORQA +8.2%)' },
      { label: '在线检索吞吐', value: '995 QPS (FAISS)' }
    ],
    features: [
      '5分钟通俗速通导览',
      '全文5章中英对照精读',
      'DPR 对比学习与负样本矩阵实验台',
      '五大问答基准与 SQuAD 反常剖析',
      '核心概念双解词典'
    ],
    component: Dpr2020App
  },
  {
    id: 'colbert-2020',
    folderName: 'ColBERT-Efficient-and-Effective-Passage-Search-via-Contextualized-Late-Interaction-over-BERT',
    titleZh: 'ColBERT 延迟交互论文：基于 BERT 上下文延迟交互的高效精准段落检索',
    titleEn: 'ColBERT: Efficient and Effective Passage Search via Contextualized Late Interaction over BERT',
    arxivId: 'arXiv:2004.12832',
    doi: 'https://arxiv.org/abs/2004.12832',
    githubUrl: 'https://github.com/stanford-futuredata/ColBERT',
    authors: ['Omar Khattab', 'Matei Zaharia'],
    affiliations: ['Stanford University (斯坦福大学)'],
    publishDate: 'SIGIR 2020 (延迟交互里程碑)',
    category: 'RAG与检索',
    tags: ['ColBERT', '延迟交互 Late Interaction', 'MaxSim算子', '[MASK]查询软扩展', '多向量检索'],
    status: 'active',
    tldrZh:
      '开创「上下文延迟交互（Contextualized Late Interaction）」范式！离线保留文档每个 Token 的低维上下文向量，在线通过 [MASK] 查询软扩展与极轻量的 MaxSim（最大相似度求和）算子进行词元级精细对齐。在 MS MARCO 上不仅精度超越 BERT-base 全交叉重排器，速度更提升 170 倍以上、算力削减 1400 倍！',
    keyMetrics: [
      { label: '重排加速比 (vs BERT-base)', value: '170x+ (54ms vs 32s)', highlight: true },
      { label: 'FLOPs 算力削减', value: '1394x 减少', highlight: true },
      { label: '880万段端到端 Recall@1k', value: '96.8% (BM25仅81.4%)' },
      { label: 'MS MARCO MRR@10', value: '36.0% (端到端 458ms)' }
    ],
    features: [
      '5分钟通俗速通导览',
      '全文4章中英对照精读',
      'MaxSim 词元交互矩阵与 [MASK] 扩展实验台',
      'MS MARCO 速度与精度全景对比',
      '核心概念双解词典'
    ],
    component: Colbert2020App
  }
];
