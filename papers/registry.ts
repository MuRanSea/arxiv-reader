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
import Adam2014App from './Adam-A-Method-for-Stochastic-Optimization/src/App.js';
import Resnet2015App from './Deep-Residual-Learning-for-Image-Recognition/src/App.js';
import Zero2019App from './ZeRO-Memory-Optimizations-Toward-Training-Trillion-Parameter-Models/src/App.js';
import Chinchilla2022App from './Training-Compute-Optimal-Large-Language-Models-Chinchilla/src/App.js';
import Rope2021App from './RoFormer-Enhanced-Transformer-with-Rotary-Position-Embedding/src/App.js';
import Qlora2023App from './QLoRA-Efficient-Finetuning-of-Quantized-LLMs/src/App.js';
import FlashAttention2022App from './FlashAttention-Fast-and-Memory-Efficient-Exact-Attention-with-IO-Awareness/src/App.js';
import Orca2022App from './Orca-A-Distributed-Serving-System-for-Transformer-Based-Generative-Models/src/App.js';
import PagedAttention2023App from './Efficient-Memory-Management-for-Large-Language-Model-Serving-with-PagedAttention/src/App.js';
import SpeculativeDecoding2022App from './Fast-Inference-from-Transformers-via-Speculative-Decoding/src/App.js';
import Gptq2022App from './GPTQ-Accurate-Post-Training-Quantization-for-Generative-Pre-trained-Transformers/src/App.js';
import DeepSeekV22024App from './DeepSeek-V2-A-Strong-Economical-and-Efficient-Mixture-of-Experts-Language-Model/src/App.js';
import Rlhf2017App from './Deep-Reinforcement-Learning-from-Human-Preferences/src/App.js';
import InstructGpt2022App from './Training-language-models-to-follow-instructions-with-human-feedback/src/App.js';
import Dpo2023App from './Direct-Preference-Optimization-Your-Language-Model-is-Secretly-a-Reward-Model/src/App.js';
import ConstitutionalAi2022App from './Constitutional-AI-Harmlessness-from-AI-Feedback/src/App.js';
import React2022App from './ReAct-Synergizing-Reasoning-and-Acting-in-Language-Models/src/App.js';
import DeepSeekR12025App from './DeepSeek-R1-Incentivizing-Reasoning-Capability-in-LLMs-via-Reinforcement-Learning/src/App.js';
import Clip2021App from './Learning-Transferable-Visual-Models-From-Natural-Language-Supervision-CLIP/src/App.js';
import Whisper2022App from './Robust-Speech-Recognition-via-Large-Scale-Weak-Supervision-Whisper/src/App.js';
import Sam2023App from './Segment-Anything-SAM/src/App.js';
import Llava2023App from './Visual-Instruction-Tuning-LLaVA/src/App.js';
import Ddpm2020App from './Denoising-Diffusion-Probabilistic-Models-DDPM/src/App.js';
import AlphaFold22021App from './Highly-accurate-protein-structure-prediction-with-AlphaFold/src/App.js';

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
  },

  // ==================== 第一支柱：训练得以发生 (Training & Scaling Foundations) ====================
  {
    id: 'adam-2014',
    folderName: 'Adam-A-Method-for-Stochastic-Optimization',
    titleZh: 'Adam：基于自适应矩估计的随机优化算法 (Adam & AdamW)',
    titleEn: 'Adam: A Method for Stochastic Optimization',
    arxivId: 'arXiv:1412.6980',
    doi: 'https://arxiv.org/abs/1412.6980',
    authors: ['Diederik P. Kingma', 'Jimmy Ba'],
    affiliations: ['University of Amsterdam', 'University of Toronto'],
    publishDate: 'ICLR 2015 (现代训练默认优化器)',
    category: '训练与扩展定律',
    tags: ['Adam / AdamW', '一阶动量 m_t', '二阶矩 v_t', '零偏置修正 1-β^t', '解耦权重衰减'],
    status: 'active',
    tldrZh:
      '现代几乎所有深度学习与大语言模型训练跑的都是它或它的带权重衰减变体（AdamW）！通过同时追踪每个参数的一阶动量 m_t 与二阶未中心化方差 v_t，并引入关键的初始零偏置修正 1/(1-β^t)，以信噪比 m̂_t/(√v̂_t+ε) 自适应调节每个维度的更新步长。',
    keyMetrics: [
      { label: '被引用量与统治力', value: '180,000+ (全领域第一)', highlight: true },
      { label: '每参数优化器状态', value: '8 Bytes (FP32 m_t, v_t)', highlight: true },
      { label: 'LLM 黄金动量配置', value: 'β₁=0.9, β₂=0.95~0.999' },
      { label: '非凸收敛加速比', value: '3.2x ~ 5.8x (vs SGD)' }
    ],
    features: [
      '5分钟通俗速通导览',
      '中英双语精读解析',
      'Adam / AdamW 矩估计与偏差修正实验台',
      '多优化器收敛与显存对比',
      '核心概念双解词典'
    ],
    component: Adam2014App
  },
  {
    id: 'resnet-2015',
    folderName: 'Deep-Residual-Learning-for-Image-Recognition',
    titleZh: 'ResNet 深度残差学习：让千层深度神经网络得以训练的残差连接基石',
    titleEn: 'Deep Residual Learning for Image Recognition',
    arxivId: 'arXiv:1512.03385',
    doi: 'https://arxiv.org/abs/1512.03385',
    githubUrl: 'https://github.com/KaimingHe/deep-residual-networks',
    authors: ['Kaiming He (何恺明)', 'Xiangyu Zhang (张祥雨)', 'Shaoqing Ren (任少卿)', 'Jian Sun (孙剑)'],
    affiliations: ['Microsoft Research Asia (MSRA)'],
    publishDate: 'CVPR 2016 Best Paper (AI引用之王)',
    category: '训练与扩展定律',
    tags: ['ResNet 残差连接', 'y = F(x) + x', '攻克深层退化问题', '梯度无损高速公路', 'Transformer 核心骨架'],
    status: 'active',
    tldrZh:
      '深层网络（包括今日百层 Transformer）能叠起来，靠的就是每一层把输入加回去！针对深层普通网络难以拟合恒等变换导致的「退化现象」，引入零参数恒等捷径 y = F(x) + x，让反向传播梯度沿着单位矩阵 +I 无损直达浅层，首次将网络深度推向 152~1000 层！',
    keyMetrics: [
      { label: 'ImageNet Top-5 错误率', value: '3.57% (超越人类水平)', highlight: true },
      { label: '最大成功训练深度', value: '152 层 ~ 1202 层', highlight: true },
      { label: '算力开销 (vs VGG-19)', value: '减少 42% (11.3B FLOPs)' },
      { label: '现代大模型渗透率', value: '100% (x + SubLayer(x))' }
    ],
    features: [
      '5分钟通俗速通导览',
      '中英双语精读解析',
      'ResNet 恒等捷径与深层梯度流实验台',
      'Plain vs ResNet 深度消融对比',
      '核心概念双解词典'
    ],
    component: Resnet2015App
  },
  {
    id: 'zero-2019',
    folderName: 'ZeRO-Memory-Optimizations-Toward-Training-Trillion-Parameter-Models',
    titleZh: 'ZeRO 零冗余优化器与分布式并行：突破万亿参数大模型训练显存墙 (DeepSpeed & Megatron-LM)',
    titleEn: 'ZeRO: Memory Optimizations Toward Training Trillion Parameter Models',
    arxivId: 'arXiv:1910.02054',
    doi: 'https://arxiv.org/abs/1910.02054',
    githubUrl: 'https://github.com/microsoft/DeepSpeed',
    authors: ['Samyam Rajbhandari', 'Jeff Rasley', 'Olatunji Ruwase', 'Yuxiong He (何玉雄)', 'Mohammad Shoeybi (Megatron-LM)'],
    affiliations: ['Microsoft DeepSpeed Team', 'NVIDIA Megatron-LM (1909.08053)'],
    publishDate: 'SC 2020 (DeepSpeed & FSDP 核心)',
    category: '训练与扩展定律',
    tags: ['ZeRO-1/2/3 状态分片', 'DeepSpeed / PyTorch FSDP', '16Ψ 混合精度显存账本', 'Megatron 张量并行', '万亿参数训练'],
    status: 'active',
    tldrZh:
      '多卡训练大模型得以发生的两大工程支柱！算清混合精度训练每参数 16Ψ 字节账本（其中 Adam 状态占 12Ψ），将优化器状态（ZeRO-1）、梯度（ZeRO-2）与参数（ZeRO-3）分片到 N_d 张数据并行卡上消除冗余副本；配合 Megatron-LM (1909.08053) 张量并行实现千亿至万亿模型训练！',
    keyMetrics: [
      { label: 'ZeRO-1/2/3 显存削减', value: '4x / 8x / N_d 倍线性缩减', highlight: true },
      { label: '最大可训练模型规模', value: '1 Trillion+ (万亿参数)', highlight: true },
      { label: 'ZeRO-1/2 额外通信代价', value: '0% (与标准DDP同为 2Ψ)' },
      { label: '100B 模型 64卡单卡状态', value: '1600GB ➔ 25.0GB (ZeRO-3)' }
    ],
    features: [
      '5分钟通俗速通导览',
      '16Ψ 显存账本与 3D 并行精读',
      'ZeRO-1/2/3 分片与通信开销计算器',
      'DDP vs ZeRO 分布式扩展对比',
      '核心概念双解词典'
    ],
    component: Zero2019App
  },
  {
    id: 'chinchilla-2022',
    folderName: 'Training-Compute-Optimal-Large-Language-Models-Chinchilla',
    titleZh: 'Chinchilla 算力最优扩展定律：颠覆大模型参数与训练数据配比法则',
    titleEn: 'Training Compute-Optimal Large Language Models (Chinchilla)',
    arxivId: 'arXiv:2203.15556',
    doi: 'https://arxiv.org/abs/2203.15556',
    authors: ['Jordan Hoffmann', 'Sebastian Borgeaud', 'Arthur Mensch', 'Elena Buchatskaya', 'Laurent Sifre'],
    affiliations: ['DeepMind'],
    publishDate: 'NeurIPS 2022 (买卡买数据黄金定律)',
    category: '训练与扩展定律',
    tags: ['Chinchilla Scaling Laws', 'D ≈ 20N 黄金配比', 'C ≈ 6ND 算力约束', '70B 击败 280B Gopher', '纠偏 Kaplan 定律'],
    status: 'active',
    tldrZh:
      '买卡和买数据的比例全按这篇算！推翻此前盲目堆参数的 Kaplan 定律，通过对 400+ 模型拟合证明参数量 N 与训练 Token 数 D 必须【等比例同步放大】（每 1B 参数约需 20B Tokens）。据此训练的 70B Chinchilla（配 1.4T 数据）在同等算力下全面击败 4 倍大的 280B Gopher！',
    keyMetrics: [
      { label: '算力最优 Token/参数比', value: 'D ≈ 20 × N (黄金比例)', highlight: true },
      { label: 'Chinchilla 70B MMLU', value: '67.5% (超 280B Gopher +7.6%)', highlight: true },
      { label: '推理成本与显存节省', value: '直降 75% (4倍加速)' },
      { label: '幂律缩放指数 (a ≈ b)', value: 'N_opt ∝ C^0.5, D_opt ∝ C^0.5' }
    ],
    features: [
      '5分钟通俗速通导览',
      'IsoFLOP 曲线与双幂律拟合精读',
      'Chinchilla 算力预算与过训练权衡模拟器',
      'GPT-3 / Gopher / Chinchilla 对比',
      '核心概念双解词典'
    ],
    component: Chinchilla2022App
  },
  {
    id: 'rope-2021',
    folderName: 'RoFormer-Enhanced-Transformer-with-Rotary-Position-Embedding',
    titleZh: 'RoPE 旋转位置编码：以复数平面旋转统一绝对与相对位置的大模型默认标准',
    titleEn: 'RoFormer: Enhanced Transformer with Rotary Position Embedding (RoPE)',
    arxivId: 'arXiv:2104.09864',
    doi: 'https://arxiv.org/abs/2104.09864',
    githubUrl: 'https://github.com/ZhuiyiTechnology/roformer',
    authors: ['Jianlin Su (苏剑林)', 'Yu Lu', 'Shengfeng Pan', 'Ahmed Murtadha', 'Bo Wen', 'Yunfeng Liu'],
    affiliations: ['Zhuiyi Technology (追一科技)'],
    publishDate: '2021 (现代开源LLM位置编码唯一默认)',
    category: '大模型架构',
    tags: ['RoPE 旋转位置编码', '复数平面旋转 e^{imθ}', '绝对操作实现相对位置', '远程衰减包络', 'NTK/YaRN 长文本扩窗'],
    status: 'active',
    tldrZh:
      '2021 年之后几乎所有现代大模型（LLaMA、Qwen、DeepSeek、Mistral、Gemma）的位置编码默认标准！将词向量的相邻两维视为复平面向量并按绝对位置 m 旋转 mθ 角，使点积注意力 (R_m q)^T (R_n k) = q^T R_{n-m} k 自动坍缩为仅依赖相对距离 (n-m)，完美兼容 KV Cache 与长上下文外推！',
    keyMetrics: [
      { label: '现代大模型采用率', value: '> 95% (事实唯一标准)', highlight: true },
      { label: 'KV Cache 兼容开销', value: '0 重算 (O(N) 原位旋转)', highlight: true },
      { label: '位置编码额外参数量', value: '0 参数 (纯正交旋转)' },
      { label: '长文本 NTK/YaRN 外推', value: '4K ➔ 128K ~ 2M 窗口' }
    ],
    features: [
      '5分钟通俗速通导览',
      '复数旋转推导与远程衰减精读',
      'RoPE 二维旋转夹角与 NTK 扩窗实验台',
      '主流位置编码范式全景对比',
      '核心概念双解词典'
    ],
    component: Rope2021App
  },
  {
    id: 'qlora-2023',
    folderName: 'QLoRA-Efficient-Finetuning-of-Quantized-LLMs',
    titleZh: 'QLoRA 量化低秩微调：单张 48GB 显卡微调 65B 大模型的开源微调破局之作',
    titleEn: 'QLoRA: Efficient Finetuning of Quantized LLMs',
    arxivId: 'arXiv:2305.14314',
    doi: 'https://arxiv.org/abs/2305.14314',
    githubUrl: 'https://github.com/artidoro/qlora',
    authors: ['Tim Dettmers', 'Artidoro Pagnoni', 'Ari Holtzman', 'Luke Zettlemoyer'],
    affiliations: ['University of Washington (华盛顿大学)'],
    publishDate: 'NeurIPS 2023 (开源微调平民化核心)',
    category: '高效微调 (PEFT)',
    tags: ['QLoRA', '4-bit NormalFloat (NF4)', 'Double Quantization 双重量化', 'Paged Optimizers 分页优化器', '单卡微调 65B'],
    status: 'active',
    tldrZh:
      '一张 48GB 卡微调 65B 大模型！开源微调能全面铺开，靠的就是将冻结主干权重量化为信息论最优的 4-bit NormalFloat (NF4) 格式，配合双重量化（每参数再省 0.373 bits）与统一内存分页优化器，计算时动态反量化为 BF16 而梯度只进低秩 LoRA 旁路，100% 追平 16-bit 全量微调！',
    keyMetrics: [
      { label: '65B 微调显存需求', value: '780GB ➔ < 41GB (省19倍)', highlight: true },
      { label: '16-bit 性能恢复率', value: '100.0% 无损追平', highlight: true },
      { label: '有效存储位宽 (NF4+DQ)', value: '4.127 bits / param' },
      { label: 'Guanaco-65B 对话水平', value: 'ChatGPT 的 99.3%' }
    ],
    features: [
      '5分钟通俗速通导览',
      'NF4 分位数与双重量化精读',
      'QLoRA 单卡显存账本与 NF4 分桶模拟器',
      'Int4 / FP4 / NF4 消融基准对比',
      '核心概念双解词典'
    ],
    component: Qlora2023App
  },

  // ==================== 第二支柱：服务得以卖出去 (LLM Serving & Inference Stack) ====================
  {
    id: 'flashattention-2022',
    folderName: 'FlashAttention-Fast-and-Memory-Efficient-Exact-Attention-with-IO-Awareness',
    titleZh: 'FlashAttention：兼顾硬件 IO 感知的高速省显存精确注意力算法',
    titleEn: 'FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness',
    arxivId: 'arXiv:2205.14135',
    doi: 'https://arxiv.org/abs/2205.14135',
    githubUrl: 'https://github.com/Dao-AILab/flash-attention',
    authors: ['Tri Dao', 'Daniel Y. Fu', 'Stefano Ermon', 'Atri Rudra', 'Christopher Ré'],
    affiliations: ['Stanford University (斯坦福大学)', 'University at Buffalo'],
    publishDate: 'NeurIPS 2022 (现代训练与推理必备内核)',
    category: '推理与服务栈',
    tags: ['FlashAttention', 'IO-Awareness 硬件感知', 'SRAM Tiling 分块', 'Online Softmax 在线重缩放', 'O(N) 线性显存'],
    status: 'active',
    tldrZh:
      '注意力计算结果逐比特完全不变，却省掉了对主显存（HBM）中巨型 N×N 矩阵的反复读写！利用 GPU 片上高速 SRAM 分块（Tiling）与 Online Softmax 动态重缩放递推，将注意力显存从 O(N²) 彻底压至线性 O(N)，速度飙升 3~7.6 倍，让 64K~1M 长上下文真正做得起！',
    keyMetrics: [
      { label: '注意力激活显存复杂度', value: 'O(N²) ➔ O(N) (省10~80倍)', highlight: true },
      { label: '端到端训练与推理提速', value: '3.0x ~ 7.6x 倍加速', highlight: true },
      { label: '计算结果精确度', value: '100% Exact (零近似损失)' },
      { label: 'HBM 显存读写削减', value: '减少最高 9.1x 访存字节' }
    ],
    features: [
      '5分钟通俗速通导览',
      'GPU SRAM/HBM 层级与在线 Softmax 精读',
      'FlashAttention 分块 IO 与显存节省计算器',
      '1K~64K 序列长度显存延迟实测表',
      '核心概念双解词典'
    ],
    component: FlashAttention2022App
  },
  {
    id: 'orca-2022',
    folderName: 'Orca-A-Distributed-Serving-System-for-Transformer-Based-Generative-Models',
    titleZh: 'Orca 连续批处理：开创按迭代调度的现代大模型高吞吐推理引擎范式',
    titleEn: 'Orca: A Distributed Serving System for Transformer-Based Generative Models',
    arxivId: 'OSDI 2022',
    doi: 'https://www.usenix.org/conference/osdi22/presentation/yu',
    authors: ['Gyeong-In Yu', 'Joo Seong Jeong', 'Geon-Woo Kim', 'Soojeong Kim', 'Byung-Gon Chun'],
    affiliations: ['Seoul National University (首尔国立大学)', 'FriendliAI'],
    publishDate: 'OSDI 2022 (Continuous Batching 鼻祖)',
    category: '推理与服务栈',
    tags: ['Orca', 'Iteration-Level Scheduling 按迭代调度', 'Continuous Batching 连续批处理', 'Selective Batching 选择性合批', '36.9x 吞吐提升'],
    status: 'active',
    tldrZh:
      '按单步迭代调度，而不是按整段请求调度！终结传统静态批处理中「短请求生成完 [EOS] 后必须原地空转等待 Batch 内最长请求」的算力黑洞，配合将 Linear 层按 Token 展平合批的 Selective Batching，在 GPT-3 175B 上于相同延迟下实现 FasterTransformer 36.9 倍的吞吐暴涨！',
    keyMetrics: [
      { label: 'GPT-3 175B 吞吐加速', value: '36.9x 倍 (同延迟下)', highlight: true },
      { label: '调度时间粒度', value: '1 个 Token 迭代步', highlight: true },
      { label: 'GPU 有效计算利用率', value: '14.2% ➔ 89.7%' },
      { label: '工业界生态传承', value: 'vLLM / TRT-LLM 调度核心' }
    ],
    features: [
      '5分钟通俗速通导览',
      '按迭代调度与选择性合批全文精读',
      'Continuous Batching 气泡消除与吞吐模拟器',
      'FasterTransformer vs Orca 基准对比',
      '核心概念双解词典'
    ],
    component: Orca2022App
  },
  {
    id: 'pagedattention-2023',
    folderName: 'Efficient-Memory-Management-for-Large-Language-Model-Serving-with-PagedAttention',
    titleZh: 'PagedAttention 与 vLLM：用操作系统虚拟内存分页彻底终结 KV Cache 显存浪费',
    titleEn: 'Efficient Memory Management for Large Language Model Serving with PagedAttention (vLLM)',
    arxivId: 'arXiv:2309.06180',
    doi: 'https://arxiv.org/abs/2309.06180',
    githubUrl: 'https://github.com/vllm-project/vllm',
    authors: ['Woosuk Kwon', 'Zhuohan Li (李卓桓)', 'Siyuan Zhuang', 'Ying Sheng', 'Lianmin Zheng', 'Ion Stoica'],
    affiliations: ['UC Berkeley (加州大学伯克利分校)'],
    publishDate: 'SOSP 2023 (vLLM 开源推理标准)',
    category: '推理与服务栈',
    tags: ['PagedAttention', 'vLLM 引擎核心', 'KV Cache 虚拟内存分页', '消除 60%~80% 显存浪费', 'Copy-on-Write 前缀共享'],
    status: 'active',
    tldrZh:
      '开源推理事实标准 vLLM 的核心！此前连续显存预分配会白白浪费掉 60% ~ 80% 的 GPU 显存。PagedAttention 借鉴操作系统虚拟内存分页，将 KV Cache 切分为固定大小（16 Tokens）的非连续物理块按需分配，将显存浪费压至 <4%，并发吞吐比 Orca 再翻 2.7~4 倍！',
    keyMetrics: [
      { label: 'KV Cache 显存浪费率', value: '60~80% ➔ < 3.7%', highlight: true },
      { label: '吞吐量提升 (vs FT/Orca)', value: '24.0x / 2.7x~4.0x', highlight: true },
      { label: '写时复制前缀显存节省', value: '最高省 55% KV 显存' },
      { label: '物理块黄金粒度 B', value: '16 Tokens / Block' }
    ],
    features: [
      '5分钟通俗速通导览',
      '三大显存碎片剖析与分页页表精读',
      'PagedAttention 虚拟页表与并发吞吐实验台',
      'FasterTransformer / Orca / vLLM 全景对比',
      '核心概念双解词典'
    ],
    component: PagedAttention2023App
  },
  {
    id: 'speculative-decoding-2022',
    folderName: 'Fast-Inference-from-Transformers-via-Speculative-Decoding',
    titleZh: 'Speculative Decoding 投机采样：以小模型草稿与大模型并行校验实现无损推理加速',
    titleEn: 'Fast Inference from Transformers via Speculative Decoding',
    arxivId: 'arXiv:2211.17192',
    doi: 'https://arxiv.org/abs/2211.17192',
    authors: ['Yaniv Leviathan', 'Matan Kalman', 'Yossi Matias', 'Charlie Chen (DeepMind 2302.01318)'],
    affiliations: ['Google Research', 'DeepMind'],
    publishDate: 'ICML 2023 (无损并行解码基石)',
    category: '推理与服务栈',
    tags: ['Speculative Decoding 投机采样', '小模型打草稿 + 大模型并行验证', '修正拒绝采样 min(1, p/q)', '100% 数学无损输出', '2x~3.4x 降延迟'],
    status: 'active',
    tldrZh:
      '利用大模型单步推理受限于访存带宽、「并行算 5 个词与算 1 个词耗时几乎相同」的硬件特性，让轻量草稿模型先快速连猜 γ 个词，再由大模型在【单次前向传播】中并行打分并通过修正拒绝采样校验，在保证输出分布与原模型 100% 数学恒等无损下提速 2~3.4 倍！',
    keyMetrics: [
      { label: '端到端生成速度提升', value: '2.0x ~ 3.4x 倍提速', highlight: true },
      { label: '输出概率分布保真度', value: '100.0% 精确恒等无损', highlight: true },
      { label: '单步大模型前向推进', value: '1 ➔ 最高 γ+1 个 Tokens' },
      { label: '现代演进生态', value: 'Medusa / EAGLE / DeepSeek MTP' }
    ],
    features: [
      '5分钟通俗速通导览',
      '修正拒绝采样无损定理证明精读',
      '投机采样步长 γ 与接受率 α 加速推演台',
      '不同温度与任务下的投机加速对比',
      '核心概念双解词典'
    ],
    component: SpeculativeDecoding2022App
  },
  {
    id: 'gptq-2022',
    folderName: 'GPTQ-Accurate-Post-Training-Quantization-for-Generative-Pre-trained-Transformers',
    titleZh: 'GPTQ 与 AWQ 后训练量化：利用二阶海森补偿将百亿大模型无损塞进单张显卡',
    titleEn: 'GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers',
    arxivId: 'arXiv:2210.17323',
    doi: 'https://arxiv.org/abs/2210.17323',
    githubUrl: 'https://github.com/IST-DASLab/gptq',
    authors: ['Elias Frantar', 'Saleh Ashkboos', 'Torsten Hoefler', 'Dan Alistarh', 'Ji Lin (林佳俊 AWQ 2306.00978)'],
    affiliations: ['IST Austria', 'ETH Zurich', 'MIT HAN Lab (AWQ)'],
    publishDate: 'ICLR 2023 & MLSys 2024 (4-bit 部署双雄)',
    category: '推理与服务栈',
    tags: ['GPTQ 4-bit/3-bit 量化', '二阶海森逆误差补偿 H^{-1}', 'Cholesky 延迟块更新', 'AWQ 1% 显著通道缩放', '单卡跑 175B'],
    status: 'active',
    tldrZh:
      '无需重训练，4 小时内把 175B 大模型从 350GB (FP16) 无损压进单张 80GB 显卡！GPTQ 利用二阶海森逆矩阵 H^{-1} 在量化每一列时自动微调右侧未量化权重抵消误差；配合 AWQ（2306.00978 保护激活最大的 1% 显著权重通道）共同统治开源社区 4-bit 权重量化发布标准！',
    keyMetrics: [
      { label: '175B 模型部署显卡数', value: '5×A100 ➔ 1×A100 (省4倍)', highlight: true },
      { label: 'Decode 单步生成加速', value: '3.25x ~ 4.53x 提速', highlight: true },
      { label: 'OPT-175B 4-bit PPL 损失', value: '< 0.03 (8.37 vs 8.34)' },
      { label: '175B 离线校准总耗时', value: '仅 4 GPU 小时 (无需重训)' }
    ],
    features: [
      '5分钟通俗速通导览',
      'GPTQ 二阶海森补偿与 AWQ 缩放精读',
      '4/3/2-bit 权重量化误差与带宽提速实验台',
      'RTN vs GPTQ vs AWQ 困惑度对比',
      '核心概念双解词典'
    ],
    component: Gptq2022App
  },
  {
    id: 'deepseek-v2-2024',
    folderName: 'DeepSeek-V2-A-Strong-Economical-and-Efficient-Mixture-of-Experts-Language-Model',
    titleZh: 'DeepSeek-V2：多头潜在注意力 (MLA) 与细粒度共享专家 (DeepSeekMoE) 的经济高效大模型革命',
    titleEn: 'DeepSeek-V2: A Strong, Economical, and Efficient Mixture-of-Experts Language Model',
    arxivId: 'arXiv:2405.04434',
    doi: 'https://arxiv.org/abs/2405.04434',
    githubUrl: 'https://github.com/deepseek-ai/DeepSeek-V2',
    authors: ['DeepSeek-AI (深度求索团队)'],
    affiliations: ['DeepSeek-AI (深度求索)'],
    publishDate: '2024年5月 (DeepSeek-V3/R1 架构基座)',
    category: '推理与服务栈',
    tags: ['DeepSeek-V2', 'MLA 多头潜在注意力', 'KV Cache 暴降 93.3%', '解耦旋转编码 Decoupled RoPE', 'DeepSeekMoE 236B/21B'],
    status: 'active',
    tldrZh:
      '把大模型 API 推理成本打穿地板的架构革命！首创多头潜在注意力（MLA），将键值联合低秩压缩为 512 维潜向量并在推理时将展开矩阵吸收进 W^Q 与 W^O（配合解耦 RoPE），使 KV Cache 惊人地暴降 93.3% 且精度超越标准 MHA；结合细粒度共享专家 MoE（236B总/21B激活），生成吞吐飙升 5.76 倍！',
    keyMetrics: [
      { label: 'KV Cache 显存削减率', value: '-93.3% (仅存576元素/层)', highlight: true },
      { label: '最大生成吞吐加速比', value: '5.76x 倍 (>50,000 tok/s)', highlight: true },
      { label: '训练算力成本节省', value: '-42.5% (236B总 / 21B激活)' },
      { label: 'MMLU 综合评测表现', value: '78.5% (超越 70B 稠密旗舰)' }
    ],
    features: [
      '5分钟通俗速通导览',
      'MLA 矩阵吸收与解耦 RoPE 推导精读',
      'MLA 潜向量压缩与 DeepSeekMoE 成本实验台',
      'MHA / GQA / MQA / MLA 消融对比',
      '核心概念双解词典'
    ],
    component: DeepSeekV22024App
  },

  // ==================== 第三支柱：模型得以变成人们在用的行为 (Alignment, RLHF & Agents) ====================
  {
    id: 'rlhf-2017',
    folderName: 'Deep-Reinforcement-Learning-from-Human-Preferences',
    titleZh: 'RLHF 奠基论文：基于人类偏好的深度强化学习与奖励模型训练范式',
    titleEn: 'Deep Reinforcement Learning from Human Preferences',
    arxivId: 'arXiv:1706.03741',
    doi: 'https://arxiv.org/abs/1706.03741',
    authors: ['Paul F. Christiano', 'Jan Leike', 'Tom B. Brown', 'Miljan Martic', 'Shane Legg', 'Dario Amodei'],
    affiliations: ['OpenAI', 'DeepMind'],
    publishDate: 'NeurIPS 2017 (RLHF 对齐开山鼻祖)',
    category: '对齐与推理智能体',
    tags: ['RLHF 奠基', 'Bradley-Terry 成对偏好', 'Reward Model 奖励模型', '人类二选一比较', '攻克无法手写奖励难题'],
    status: 'active',
    tldrZh:
      '现代大模型人类偏好对齐（RLHF）的总源头！针对人类无法用数学代码写出复杂行为奖励函数的困境，首创「策略生成成对轨迹 → 人类二选一点击偏好 → Bradley-Terry 交叉熵训练奖励模型 r̂ → 强化学习策略优化」闭环，仅凭不到 1 小时人类反馈即教会机器人完美后空翻！',
    keyMetrics: [
      { label: '人工反馈耗时缩减', value: '99.9% 缩减 (< 1小时)', highlight: true },
      { label: '偏好建模核心方程', value: 'Bradley-Terry σ(r_w - r_l)', highlight: true },
      { label: '后空翻所需人工点击', value: '仅 ~900 次二选一比较' },
      { label: '历史传承地位', value: 'InstructGPT / ChatGPT 母本' }
    ],
    features: [
      '5分钟通俗速通导览',
      'Bradley-Terry 奖励拟合与防作弊精读',
      'RLHF 成对偏好学习与 Reward Hacking 模拟器',
      '手工代理奖励 vs 绝对打分 vs RLHF 对比',
      '核心概念双解词典'
    ],
    component: Rlhf2017App
  },
  {
    id: 'instructgpt-2022',
    folderName: 'Training-language-models-to-follow-instructions-with-human-feedback',
    titleZh: 'InstructGPT：将大语言模型从「续写机器」蜕变为「听懂指令助手」的 ChatGPT 直接蓝本',
    titleEn: 'Training language models to follow instructions with human feedback (InstructGPT)',
    arxivId: 'arXiv:2203.02155',
    doi: 'https://arxiv.org/abs/2203.02155',
    authors: ['Long Ouyang (欧阳龙)', 'Jeff Wu', 'Xu Jiang', 'Diogo Almeida', 'Paul Christiano', 'Jan Leike', 'Ryan Lowe'],
    affiliations: ['OpenAI'],
    publishDate: 'NeurIPS 2022 (ChatGPT 直接技术说明书)',
    category: '对齐与推理智能体',
    tags: ['InstructGPT (ChatGPT蓝本)', 'SFT + RM + PPO 后训练三步法', '1.3B 击败 175B GPT-3', 'KL 散度安全绳 + PPO-ptx', '消除对齐税'],
    status: 'active',
    tldrZh:
      'ChatGPT 诞生的直接技术说明书！确立「Step 1 监督微调 (SFT) → Step 2 奖励模型 (RM, K=4~9 组内成对排序) → Step 3 带 KL 惩罚与预训练梯度混入的 PPO-ptx」标准后训练三部曲。仅 13 亿参数（1.3B）的 InstructGPT 在人类盲测中击败大 134 倍的 175B 原始 GPT-3！',
    keyMetrics: [
      { label: '以小胜大跨量级奇迹', value: '1.3B 胜率超越 175B GPT-3', highlight: true },
      { label: '175B 对齐前后人类胜率', value: '85% ± 3% 压倒性胜出', highlight: true },
      { label: '闭域幻觉造假率降低', value: '41% ➔ 21% (直接减半)' },
      { label: '单题排序样本扩增', value: 'K=4~9 产出 C(K,2)=6~36 对' }
    ],
    features: [
      '5分钟通俗速通导览',
      'SFT / RM / PPO-ptx 三阶段全流程精读',
      'InstructGPT 对齐三部曲与 KL 惩罚实验台',
      'GPT-3 vs SFT vs PPO vs PPO-ptx 对比',
      '核心概念双解词典'
    ],
    component: InstructGpt2022App
  },
  {
    id: 'dpo-2023',
    folderName: 'Direct-Preference-Optimization-Your-Language-Model-is-Secretly-a-Reward-Model',
    titleZh: 'DPO 直接偏好优化：你的语言模型本身就暗藏着一个奖励模型（免 RL 对齐革命）',
    titleEn: 'Direct Preference Optimization: Your Language Model is Secretly a Reward Model (DPO)',
    arxivId: 'arXiv:2305.18290',
    doi: 'https://arxiv.org/abs/2305.18290',
    githubUrl: 'https://github.com/eric-mitchell/direct-preference-optimization',
    authors: ['Rafael Rafailov', 'Archit Sharma', 'Eric Mitchell', 'Stefano Ermon', 'Christopher D. Manning', 'Chelsea Finn'],
    affiliations: ['Stanford University (斯坦福大学)'],
    publishDate: 'NeurIPS 2023 (开源偏好对齐首选标准)',
    category: '对齐与推理智能体',
    tags: ['DPO 直接偏好优化', '无需独立 Reward Model', '无需 PPO 在线强化学习', '闭式解变量代换相消 Z(x)', '自适应错题梯度加权'],
    status: 'active',
    tldrZh:
      '告别同时加载 4 个大模型跑 PPO 的炼丹噩梦！通过求解 KL 约束奖励最大化的解析闭式解，用策略对数比 β·log(π_θ/π_ref) 直接代换奖励函数 r(x,y)，代入 Bradley-Terry 后配分函数 Z(x) 完美相消！将复杂的 RLHF 化简为单阶段二元交叉熵损失，成为 LLaMA-3 等开源对齐标配！',
    keyMetrics: [
      { label: '训练常驻模型数量', value: '4 个 (PPO) ➔ 仅 1 个训练模型', highlight: true },
      { label: '训练期在线采样开销', value: '0 Rollout (与 SFT 同速)', highlight: true },
      { label: 'TL;DR 摘要人类胜率', value: '61.5% (超越 PPO 的 57.1%)' },
      { label: '核心超参数数量', value: '仅 1 个温度系数 β (极稳定)' }
    ],
    features: [
      '5分钟通俗速通导览',
      '闭式解代换与配分函数相消推导精读',
      'DPO 隐式奖励与自适应梯度权重实验台',
      'SFT / Unlikelihood / PPO / DPO 全景对比',
      '核心概念双解词典'
    ],
    component: Dpo2023App
  },
  {
    id: 'constitutional-ai-2022',
    folderName: 'Constitutional-AI-Harmlessness-from-AI-Feedback',
    titleZh: 'Constitutional AI 宪法 AI：基于自然语言原则章程与 AI 反馈的自我批判对齐范式',
    titleEn: 'Constitutional AI: Harmlessness from AI Feedback (CAI & RLAIF)',
    arxivId: 'arXiv:2212.08073',
    doi: 'https://arxiv.org/abs/2212.08073',
    githubUrl: 'https://github.com/anthropics/ConstitutionalHarmlessnessPaper',
    authors: ['Yuntao Bai (白运涛)', 'Saurav Kadavath', 'Sandipan Kundu', 'Amanda Askell', 'Jared Kaplan', 'Dario Amodei'],
    affiliations: ['Anthropic (Claude 核心团队)'],
    publishDate: '2022年12月 (Anthropic Claude 灵魂基石)',
    category: '对齐与推理智能体',
    tags: ['Constitutional AI (CAI)', 'RLAIF (AI反馈强化学习)', 'Critique → Revision 自我批评改写', '告别消极拒答 Evasiveness', '16条明文宪法原则'],
    status: 'active',
    tldrZh:
      'Anthropic 训练 Claude 的核心秘籍！无需任何人工无害性标注，仅凭 16 条自然语言「宪法章程」，第一阶段让模型对红队攻击回复做多轮「自我批评与自我改写（SL-CAI）」，第二阶段用思维链 AI 评审打分驱动 RLAIF，在零人工安全标注下同时赢得更高安全性与「不敷衍推诿」的高有用性！',
    keyMetrics: [
      { label: '人工无害性安全标注', value: '0 条 (100% AI 自监督对齐)', highlight: true },
      { label: '无害性 Elo 评分表现', value: '超越全人工 HH-RLHF (+52)', highlight: true },
      { label: '核心治理宪法规模', value: '仅 16 条自然语言原则' },
      { label: '安全回答交互风格', value: '礼貌解释风险 (零生硬拒答)' }
    ],
    features: [
      '5分钟通俗速通导览',
      'SL-CAI 自改写与 CoT RLAIF 精读',
      '宪法 AI 批评改写循环与帕累托前沿实验台',
      'HH-RLHF vs SL-CAI vs RL-CAI 对比',
      '核心概念双解词典'
    ],
    component: ConstitutionalAi2022App
  },
  {
    id: 'react-2022',
    folderName: 'ReAct-Synergizing-Reasoning-and-Acting-in-Language-Models',
    titleZh: 'ReAct 智能体奠基论文：在大语言模型中协同交织「思维链推理」与「外部环境行动」',
    titleEn: 'ReAct: Synergizing Reasoning and Acting in Language Models',
    arxivId: 'arXiv:2210.03629',
    doi: 'https://arxiv.org/abs/2210.03629',
    githubUrl: 'https://github.com/ysymyth/ReAct',
    authors: ['Shunyu Yao (姚顺雨)', 'Jeffrey Zhao', 'Dian Yu', 'Nan Du', 'Izhak Shafran', 'Karthik Narasimhan', 'Yuan Cao'],
    affiliations: ['Princeton University (普林斯顿大学)', 'Google Research'],
    publishDate: 'ICLR 2023 (现代 AI Agent 与工具调用鼻祖)',
    category: '对齐与推理智能体',
    tags: ['ReAct 智能体范式', 'Thought → Action → Observation', '消除 CoT 56% 内部幻觉', '工具调用 Tool Use 基石', 'ALFWorld +34% 暴涨'],
    status: 'active',
    tldrZh:
      '现代一切 AI Agent 与 Tool Use 框架的开山鼻祖！针对纯思维链（CoT）闭门造车易产生事实幻觉、纯动作模型缺乏规划的割裂困境，提出交织执行的「Thought（内部思考拆解）→ Action（调用外部工具/API）→ Observation（获取环境真实反馈）」闭环，让推理指导行动、让行动锚定推理！',
    keyMetrics: [
      { label: 'ALFWorld 具身任务成功率', value: '71.0% (超 Act-Only +26%)', highlight: true },
      { label: '推理失败中的编造幻觉率', value: '56% (CoT) ➔ 0% (ReAct)', highlight: true },
      { label: 'WebShop 在线购物成功率', value: '40.0% (+11% 超RL基线)' },
      { label: 'HotpotQA 协同自洽得分', value: '35.1% EM (ReAct+CoT-SC)' }
    ],
    features: [
      '5分钟通俗速通导览',
      '增广动作空间 Â = A ∪ L 全文精读',
      'ReAct (Thought-Action-Obs) 闭环抗幻觉实验台',
      'CoT vs Act-Only vs ReAct 权威基准对比',
      '核心概念双解词典'
    ],
    component: React2022App
  },
  {
    id: 'deepseek-r1-2025',
    folderName: 'DeepSeek-R1-Incentivizing-Reasoning-Capability-in-LLMs-via-Reinforcement-Learning',
    titleZh: 'DeepSeek-R1 强化学习推理大模型：纯组相对策略优化 (GRPO) 激发长思维链顿悟涌现',
    titleEn: 'DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning',
    arxivId: 'arXiv:2501.12948',
    doi: 'https://arxiv.org/abs/2501.12948',
    githubUrl: 'https://github.com/deepseek-ai/DeepSeek-R1',
    authors: ['DeepSeek-AI (深度求索团队)'],
    affiliations: ['DeepSeek-AI (含 DeepSeekMath GRPO 2402.03300)'],
    publishDate: '2025年1月 (开源推理大模型里程碑)',
    category: '对齐与推理智能体',
    tags: ['DeepSeek-R1 & R1-Zero', 'GRPO 组相对策略优化', '砍掉 Critic 价值网络', '纯规则可验证奖励 RL', 'Aha Moment 顿悟涌现'],
    status: 'active',
    tldrZh:
      '震动全球的开源推理大模型里程碑！R1-Zero 证明无需任何人工思维链 SFT，直接从基础模型出发，通过 GRPO（用同题 G 个采样回答的组内均值标准差替代昂贵的 Critic 网络）与纯规则可验证奖励进行强化学习，即可自发涌现出自我反思、「顿悟时刻（Aha Moment）」与超长思维链，AIME 2024 从 15.6% 狂飙至 79.8% 超越 o1！',
    keyMetrics: [
      { label: 'AIME 2024 数学竞赛', value: '15.6% ➔ 79.8% (超 o1-1217)', highlight: true },
      { label: 'MATH-500 准确率', value: '97.3% (全球开源巅峰)', highlight: true },
      { label: 'GRPO 价值网络显存开销', value: '0 GB (100% 砍除 Critic)' },
      { label: '32B 蒸馏小模型 AIME', value: '72.6% (远超 o1-mini 63.6%)' }
    ],
    features: [
      '5分钟通俗速通导览',
      'GRPO 方程与四阶段 R1 进化精读',
      'GRPO 组内相对优势与思维链涌现实验台',
      'DeepSeek-R1 vs OpenAI o1 全基准对比',
      '核心概念双解词典'
    ],
    component: DeepSeekR12025App
  },

  // ==================== 第四支柱：语言模型以外，各自成为一条产业 (Multimodal, Speech, Vision & Science) ====================
  {
    id: 'clip-2021',
    folderName: 'Learning-Transferable-Visual-Models-From-Natural-Language-Supervision-CLIP',
    titleZh: 'CLIP 对比语言-图像预训练：打通视觉与自然语言共享语义空间的零样本多模态基石',
    titleEn: 'Learning Transferable Visual Models From Natural Language Supervision (CLIP)',
    arxivId: 'arXiv:2103.00020',
    doi: 'https://arxiv.org/abs/2103.00020',
    githubUrl: 'https://github.com/openai/CLIP',
    authors: ['Alec Radford', 'Jong Wook Kim', 'Chris Hallacy', 'Aditya Ramesh', 'Gabriel Goh', 'Ilya Sutskever'],
    affiliations: ['OpenAI'],
    publishDate: 'ICML 2021 (图文多模态与文生图共同基石)',
    category: '视觉与生成模型',
    tags: ['CLIP 双塔对比学习', '4亿图文对 WIT', 'N×N 对称 InfoNCE 损失', 'Zero-Shot 开放词表分类', 'SD 与 LLaVA 的眼睛'],
    status: 'active',
    tldrZh:
      '把图像与文字推进同一个向量空间的跨模态总基石！放弃低效的逐词生成图注，改在 4 亿网页图文对上用双塔编码器执行大批次（N=32,768）余弦相似度对比学习（比生成目标快 4 倍以上）。无需见过 1 张 ImageNet 训练图，仅凭提示词 `"A photo of a {object}"` 零样本追平全监督 ResNet-50，并成为 Stable Diffusion 与 LLaVA 的核心组件！',
    keyMetrics: [
      { label: '零样本 ImageNet Top-1', value: '76.2% (0张训练图追平监督)', highlight: true },
      { label: '对比目标 vs 生成效率', value: '4.0x+ 训练提速', highlight: true },
      { label: '分布外 ImageNet-R/A', value: '88.9% / 77.1% (ResNet仅2.7%)' },
      { label: '预训练图文对规模', value: '400 Million (4亿对 WIT)' }
    ],
    features: [
      '5分钟通俗速通导览',
      '对称 InfoNCE 与视觉提示工程精读',
      'CLIP N×N 对比矩阵与分布偏移鲁棒性实验台',
      '7大自然分布偏移基准鲁棒性对比',
      '核心概念双解词典'
    ],
    component: Clip2021App
  },
  {
    id: 'whisper-2022',
    folderName: 'Robust-Speech-Recognition-via-Large-Scale-Weak-Supervision-Whisper',
    titleZh: 'Whisper 语音识别基石：以 68 万小时大规模弱监督实现零样本抗噪与多语言语音转录',
    titleEn: 'Robust Speech Recognition via Large-Scale Weak Supervision (Whisper)',
    arxivId: 'arXiv:2212.04356',
    doi: 'https://arxiv.org/abs/2212.04356',
    githubUrl: 'https://github.com/openai/whisper',
    authors: ['Alec Radford', 'Jong Wook Kim', 'Tao Xu', 'Greg Brockman', 'Christine McLeavey', 'Ilya Sutskever'],
    affiliations: ['OpenAI'],
    publishDate: 'ICML 2023 (开源多语言语音转文字事实标准)',
    category: '视觉与生成模型',
    tags: ['Whisper 语音识别', '680,000 小时弱监督', '多任务特殊控制 Token', '反机器字幕清洗过滤', '零样本词错率砍半 (-55.2%)'],
    status: 'active',
    tldrZh:
      '终结语音识别「一个场景微调一个模型」的时代！收集清洗 68 万小时（77年）多语言多任务互联网弱监督音频，用最标准的 Encoder-Decoder Transformer 配合 `<|lang|> <|transcribe/translate|> <|timestamp|>` 控制前缀端到端训练，在 12 个真实嘈杂基准上零样本将词错率（WER）比全监督模型砍掉 55.2%，追平人类速记员！',
    keyMetrics: [
      { label: '跨领域零样本 WER 降低', value: '-55.2% (词错率直接砍半)', highlight: true },
      { label: '弱监督训练音频总时长', value: '680,000 小时 (涵盖96语种)', highlight: true },
      { label: '真实人类速记员盲测对比', value: '追平专业人类专家准确率' },
      { label: '原生端到端输出能力', value: '自带标点 + 大小写 + 时间戳' }
    ],
    features: [
      '5分钟通俗速通导览',
      '68万小时数据清洗与多任务前缀精读',
      'Whisper 弱监督规模与抗噪 WER 实验台',
      'wav2vec 2.0 vs Whisper 12基准对比',
      '核心概念双解词典'
    ],
    component: Whisper2022App
  },
  {
    id: 'sam-2023',
    folderName: 'Segment-Anything-SAM',
    titleZh: 'SAM 分割一切：以可提示分割、数据引擎闭环与 11 亿掩码开启计算机视觉基础模型时代',
    titleEn: 'Segment Anything (SAM)',
    arxivId: 'arXiv:2304.02643',
    doi: 'https://arxiv.org/abs/2304.02643',
    githubUrl: 'https://github.com/facebookresearch/segment-anything',
    authors: ['Alexander Kirillov', 'Eric Mintun', 'Nikhila Ravi', 'Ross Girshick', 'Kaiming He (何恺明)'],
    affiliations: ['Meta AI Research (FAIR)'],
    publishDate: 'ICCV 2023 (视觉分割基础模型里程碑)',
    category: '视觉与生成模型',
    tags: ['Segment Anything (SAM)', 'Promptable Segmentation 可提示分割', 'SA-1B (11亿掩码数据飞轮)', '3掩码歧义消解 (整体/部件/子部件)', '50ms 浏览器实时交互'],
    status: 'active',
    tldrZh:
      '把 Prompt 范式成功带入计算机视觉！定义「可提示分割」任务（点、框、文本皆可作提示），设计「重图像编码器跑一次 + 50ms 极轻解码器一次吐出 3 个嵌套掩码化解单点歧义」架构，并通过三阶段「模型与人工协同数据引擎」在 1100 万张图上造出 11 亿个掩码（SA-1B，比旧数据集大 400 倍），实现零样本分割万物！',
    keyMetrics: [
      { label: 'SA-1B 开源掩码总数', value: '1.1 Billion (大400倍!)', highlight: true },
      { label: '前端单次交互解码延迟', value: '~50 ms (浏览器实时跟手)', highlight: true },
      { label: '23数据集单点零样本 mIoU', value: '74.9 (+18.1 超交互基线)' },
      { label: '单点歧义消解输出头', value: '3 Masks (整体/部件/子部件)' }
    ],
    features: [
      '5分钟通俗速通导览',
      '三阶段数据飞轮与歧义感知损失精读',
      'SAM 可提示分割与三层级消歧实验台',
      '23 大跨领域数据集零样本评测表',
      '核心概念双解词典'
    ],
    component: Sam2023App
  },
  {
    id: 'llava-2023',
    folderName: 'Visual-Instruction-Tuning-LLaVA',
    titleZh: 'LLaVA 视觉指令微调：用一层简单线性投影桥接 CLIP 与 LLM 的多模态大模型标准架构',
    titleEn: 'Visual Instruction Tuning (LLaVA)',
    arxivId: 'arXiv:2304.08485',
    doi: 'https://arxiv.org/abs/2304.08485',
    githubUrl: 'https://github.com/haotian-liu/LLaVA',
    authors: ['Haotian Liu (刘昊天)', 'Chunyuan Li (李春元)', 'Qingyang Wu', 'Yong Jae Lee'],
    affiliations: ['UW–Madison', 'Microsoft Research', 'Columbia University'],
    publishDate: 'NeurIPS 2023 Oral (开源多模态VLM黄金范式)',
    category: '视觉与生成模型',
    tags: ['LLaVA 多模态大模型', 'Visual Instruction Tuning', 'CLIP + Linear/MLP 投影 + LLM', '符号坐标驱动 GPT-4 造数据', '两阶段对齐+微调'],
    status: 'active',
    tldrZh:
      '定义了今日几乎所有开源视觉大模型（VLM）的标准做法！无需设计沉重的交叉注意力或 Q-Former，直接用一层极简线性投影（或 2 层 MLP）将 CLIP 图像块特征映射为大语言模型的「视觉 Token」；并首创把图像图注+物体坐标框喂给纯文本 GPT-4 合成 15.8 万条多模态指令数据，以两阶段微调斩获 92.53% ScienceQA 新纪录！',
    keyMetrics: [
      { label: 'ScienceQA 多模态准确率', value: '92.53% (历史新 SOTA)', highlight: true },
      { label: 'LLaVA-Bench 相对 GPT-4', value: '85.1% (复杂推理达 96.5%)', highlight: true },
      { label: '合成多模态指令集规模', value: '158K (对话+详述+推理)' },
      { label: '跨模态桥接器复杂度', value: '仅 1 层 Linear / 2 层 MLP' }
    ],
    features: [
      '5分钟通俗速通导览',
      'GPT-4 符号化数据合成与两阶段微调精读',
      'LLaVA 视觉 Token 投影与指令配比实验台',
      'BLIP-2 / Flamingo / LLaVA 消融对比',
      '核心概念双解词典'
    ],
    component: Llava2023App
  },
  {
    id: 'ddpm-2020',
    folderName: 'Denoising-Diffusion-Probabilistic-Models-DDPM',
    titleZh: 'DDPM 去噪扩散概率模型：用简化噪声预测损失开启现代视觉、音频与视频生成黄金时代',
    titleEn: 'Denoising Diffusion Probabilistic Models (DDPM)',
    arxivId: 'arXiv:2006.11239',
    doi: 'https://arxiv.org/abs/2006.11239',
    githubUrl: 'https://github.com/hojonathanho/diffusion',
    authors: ['Jonathan Ho', 'Ajay Jain', 'Pieter Abbeel'],
    affiliations: ['UC Berkeley (加州大学伯克利分校)'],
    publishDate: 'NeurIPS 2020 (现代图像/视频扩散生成总源头)',
    category: '视觉与生成模型',
    tags: ['DDPM 扩散奠基', '一步闭式加噪 √ᾱ_t x_0 + √(1-ᾱ_t)ε', '预测噪声残差 ε_θ(x_t, t)', '简化去权重损失 L_simple', '历史性击败 GAN (3.17 FID)'],
    status: 'active',
    tldrZh:
      '现代一切图像、音频、视频生成模型（Stable Diffusion、Midjourney、Sora）的算法总源头！推导前向任意步闭式加噪公式 x_t = √ᾱ_t x_0 + √(1-ᾱ_t)ε，将逆向神经网络从「预测均值 μ_θ」重参数化为「直接预测混入的标准高斯噪声 ε_θ」，并用去权重简化损失 L_simple = E[||ε - ε_θ||²] 将 CIFAR-10 FID 从 13.51 暴降至 3.17，首次全面击败 GAN！',
    keyMetrics: [
      { label: 'CIFAR-10 生成质量 FID', value: '3.17 FID (超越所有 GAN)', highlight: true },
      { label: '预测 ε + L_simple 增益', value: 'FID 13.51 ➔ 3.17 (质的飞跃)', highlight: true },
      { label: '训练任意步 t 采样复杂度', value: 'O(1) 一步闭式重参数化' },
      { label: '训练稳定性与分布覆盖', value: '100% 稳定 (零模式坍塌)' }
    ],
    features: [
      '5分钟通俗速通导览',
      '前向闭式加噪与 L_simple 推导精读',
      'DDPM 噪声调度 ᾱ_t 与逆向去噪轨迹实验台',
      '预测均值 vs 预测噪声消融实验对比',
      '核心概念双解词典'
    ],
    component: Ddpm2020App
  },
  {
    id: 'alphafold2-2021',
    folderName: 'Highly-accurate-protein-structure-prediction-with-AlphaFold',
    titleZh: 'AlphaFold2 蛋白质三维结构预测：破解五十年生物学世纪难题的诺贝尔化学奖里程碑',
    titleEn: 'Highly accurate protein structure prediction with AlphaFold (AlphaFold2)',
    arxivId: 'Nature 2021 (Nobel Prize)',
    doi: 'https://doi.org/10.1038/s41586-021-03819-2',
    githubUrl: 'https://github.com/google-deepmind/alphafold',
    authors: ['John Jumper', 'Richard Evans', 'Alexander Pritzel', 'Tim Green', 'Olaf Ronneberger', 'Demis Hassabis'],
    affiliations: ['DeepMind (2024 诺贝尔化学奖得主)'],
    publishDate: 'Nature 2021 (AI for Science 最高丰碑)',
    category: '视觉与生成模型',
    tags: ['AlphaFold2 (诺贝尔化学奖)', 'Evoformer 序列与成对双轨演化', 'Triangle Attention 三角形不等式偏置', 'IPA 不变点注意力 (SE(3)等变)', '0.96 Å 原子级精度'],
    status: 'active',
    tldrZh:
      '荣膺 2024 诺贝尔化学奖的 AI for Science 巅峰巨作！把生物进化协同突变（MSA）与三维空间几何定律写进注意力机制：通过 48 层 Evoformer 的「三角形乘法更新与三角形自注意力」隐式强制三维距离满足三角形不等式，再由 SE(3) 等变「不变点注意力（IPA）」驱动残基刚体帧一步生成三维原子坐标，在 CASP14 将骨架误差压至 0.96 Å（小于单个碳原子半径）！',
    keyMetrics: [
      { label: 'CASP14 碳骨架中位误差', value: '0.96 Å (次优为 2.83 Å)', highlight: true },
      { label: 'CASP14 自由建模 GDT_TS', value: '92.4 / 100 (达实验晶体精度)', highlight: true },
      { label: '全球开源预测蛋白质数', value: '200,000,000+ (覆盖已知物种)' },
      { label: '科学界最高荣誉', value: '2024 诺贝尔化学奖' }
    ],
    features: [
      '5分钟通俗速通导览',
      'Evoformer 三角形更新与 SE(3) IPA 精读',
      'AlphaFold2 三角形注意力与刚体折叠实验台',
      'CASP14 盲测与核心几何模块消融对比',
      '核心概念双解词典'
    ],
    component: AlphaFold22021App
  }
];
