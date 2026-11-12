import { UniversalPaperData } from '../../../../src/shared/types/universalPaper.js';

export const STABLE_DIFFUSION_2022_DATA: UniversalPaperData = {
  id: 'stable-diffusion-2022',
  title: 'High-Resolution Image Synthesis with Latent Diffusion Models',
  chineseTitle: '基于潜在扩散模型的高分辨率图像合成（Stable Diffusion 奠基之作）',
  subtitle: 'Robin Rombach, Andreas Blattmann, Patrick Esser, Björn Ommer • LMU Munich / CompVis & Runway • CVPR 2022 Oral',
  tags: ['CVPR 2022 Oral', 'Stable Diffusion 原论文', 'Latent Diffusion (LDM)', '感知压缩 VAE (f=8)', 'Cross-Attention 文生图'],
  arxivId: '2112.10752',
  pdfUrl: 'https://arxiv.org/pdf/2112.10752.pdf',
  abstractUrl: 'https://arxiv.org/abs/2112.10752',
  summary:
    '引爆全球 AIGC 视觉革命的 Stable Diffusion 原始论文！一针见血地指出传统像素级扩散模型（DDPM/ADM）将 90% 以上的算力浪费在人眼无法察觉的高频像素细节上；创造性地提出「感知压缩（Perceptual Compression, VAE）+ 语义压缩（Semantic Compression, Latent UNet）」两阶段范式，并通过 Cross-Attention 注入文本条件，将高分辨率文生图训练与推理成本降低一个数量级！',

  keyContributions: [
    '揭示图像的率失真两阶段规律（Figure 2）：图像生成可分为消除高频冗余的「感知压缩阶段」与构建全局构图语义的「语义压缩阶段」，像素空间扩散模型在感知高频区耗费了数百 GPU 天算力。',
    '提出潜在扩散模型（Latent Diffusion Models, LDM）：利用感知损失 + PatchGAN 对抗损失训练自编码器（KL-reg / VQ-reg），将 H×W×3 图像下采样 f 倍（最佳甜点 f=4 或 f=8）映射为低维潜张量 z = E(x) ∈ R^(h×w×c)，在潜空间执行扩散过程。',
    '构建基于 Cross-Attention 的多模态条件注入机制：将文本提示词、语义分割图或边界框经领域编码器 τ_θ(y) 编码后，通过 Q=W_Q φ_i(z_t), K=W_K τ_θ(y), V=W_V τ_θ(y) 注入 UNet 各层，统一了文生图、局部重绘（Inpainting）与超分辨率任务。',
    '在 CelebA-HQ、FFHQ、LSUN 与 ImageNet 上刷新 FID 记录，同时训练算力降低数倍、推理吞吐量提升数倍，直接催生了开源界最具影响力的 Stable Diffusion 生态。',
  ],

  coreProblem:
    '尽管扩散概率模型（DDPM）在图像生成质量上超越了 GAN，但它们直接在高维像素空间（例如 512×512×3 = 786,432 维）中进行对数似然优化与上百步迭代去噪。这导致训练一个模型需要数百甚至上千 V100 GPU-days，且单张高分辨率图像采样极其缓慢，普通研究者和消费级显卡根本无法承受。',

  coreIdea:
    '先训练一个只做「感知压缩」的自动编码器（Encoder E 与 Decoder D），用因子 f = H/h = 8 将 512×512×3 的像素图像无损感知压缩为 64×64×4（仅 16,384 维，体积缩小 48 倍！）的二维潜空间表征 z = E(x)；然后冻结自编码器，让时序条件 UNet 专心在这个低维紧致的潜空间中学习逆向去噪 ε_θ(z_t, t, τ_θ(y))；采样完成后仅需调用一次解码器 x̂ = D(z_0) 即可还原出高清大图！',

  simulatorTitle: 'Stable Diffusion 潜空间下采样因子 (f)、逆向去噪步与 Cross-Attention 条件模拟器',
  simulatorDesc:
    '交互式调节空间下采样倍率 f ∈ {1, 2, 4, 8, 16, 32} 观察潜空间张量尺寸、显存开销与 FID 甜点（LDM-4 / LDM-8），拖动逆向扩散步数 t 体验从高斯噪声 z_T 到清晰潜变量 z_0 的演化，并探索文本 Prompt 到图像空间的 Cross-Attention 热力映射。',

  architectureSteps: [
    {
      id: 'perceptual-encoder',
      title: '1. 感知压缩编码器 z = E(x)',
      subtitle: 'Autoencoding Stage (KL-reg / VQ-reg)',
      description:
        '通过结合感知损失（LPIPS）与基于 Patch 的对抗判别器训练自编码器，滤除人眼不可见的高频像素噪声，将 512×512×3 的 RGB 图像压缩为 64×64×4（f=8）的低维潜空间张量 z。',
      highlightColor: 'emerald',
    },
    {
      id: 'latent-forward-reverse',
      title: '2. 潜空间扩散与逆向去噪 UNet',
      subtitle: 'z_T ~ N(0, I) → z_{t-1} → ... → z_0',
      description:
        '在 64×64×4 的二维潜空间上定义前向加噪马尔可夫链与逆向去噪二维卷积 UNet ε_θ(z_t, t)。由于保留了二维空间网格拓扑（而非展平为一维向量），UNet 的局部归纳偏置得以完美发挥。',
      highlightColor: 'blue',
    },
    {
      id: 'cross-attention-conditioning',
      title: '3. 交叉注意力多模态条件注入',
      subtitle: 'Attention(Q(z_t), K(τ_θ(y)), V(τ_θ(y)))',
      description:
        '文本提示词 y 经 Transformer/CLIP 编码器 τ_θ(y) 转化为序列向量，作为 Key 和 Value 嵌入到 UNet 中间层的 Spatial Transformer 模块中，指导每一步噪声预测的语义布局。',
      highlightColor: 'purple',
    },
    {
      id: 'perceptual-decoder',
      title: '4. 单步感知解码器还原 x̂ = D(z_0)',
      subtitle: 'Single-pass Pixel Reconstruction',
      description:
        '经过 DDIM / PLMS 采样器迭代获得干净潜表征 z_0 后，仅需通过解码器 D 执行一次前向传播，即可将 64×64×4 的潜特征恢复为 512×512×3 的高分辨率锐利图像。',
      highlightColor: 'amber',
    },
  ],

  formulas: [
    {
      id: 'perceptual-compression',
      name: '1. 感知压缩自编码映射与下采样率 f',
      category: '第一阶段：感知压缩',
      formula:
        'z = \\mathcal{E}(x) \\in \\mathbb{R}^{h \\times w \\times c}, \\quad \\hat{x} = \\mathcal{D}(z) \\in \\mathbb{R}^{H \\times W \\times 3}, \\quad f = \\frac{H}{h} = \\frac{W}{w} = 2^m',
      explanation:
        '编码器 E 将输入图像 x 按空间倍率 f = 2^m 下采样为包含二维空间结构的潜表征 z。为了防止潜空间方差无限膨胀，LDM 对 z 施加轻微的 KL 正则（趋近标准正态）或向量量化（VQ）正则。',
      variables: [
        { symbol: 'H \\times W \\times 3', desc: '原始 RGB 像素空间分辨率（如 512×512×3）' },
        { symbol: 'h \\times w \\times c', desc: '压缩后的潜空间张量尺寸（当 f=8, c=4 时为 64×64×4）' },
        { symbol: 'f', desc: '空间下采样因子（论文实验证明 f=4 和 f=8 是兼顾速度与质量的黄金甜点）' },
      ],
    },
    {
      id: 'ldm-unconditional-loss',
      name: '2. 无条件潜在扩散模型目标函数（LDM Loss）',
      category: '第二阶段：潜空间扩散',
      formula:
        '\\mathcal{L}_{\\text{LDM}} := \\mathbb{E}_{\\mathcal{E}(x),\\, \\epsilon \\sim \\mathcal{N}(0, 1),\\, t}\\Big[ \\big\\| \\epsilon - \\epsilon_\\theta(z_t, t) \\big\\|_2^2 \\Big], \\quad z_t = \\sqrt{\\bar{\\alpha}_t}\\,\\mathcal{E}(x) + \\sqrt{1 - \\bar{\\alpha}_t}\\,\\epsilon',
      explanation:
        '在训练扩散模型时，自编码器 E 被完全冻结。每次迭代先算出潜表征 z_0 = E(x)，按时间步 t 混入高斯噪声得到 z_t，然后训练时序条件 UNet ε_θ(z_t, t) 预测所添加的噪声 ε。',
      variables: [
        { symbol: 'z_t', desc: '时间步 t ∈ {1, ..., T} 时的带噪潜空间张量' },
        { symbol: '\\epsilon_\\theta(z_t, t)', desc: '构建在二维潜空间上的时序条件 UNet 噪声预测网络' },
        { symbol: '\\bar{\\alpha}_t', desc: '前向扩散过程的累积信噪比调度系数' },
      ],
    },
    {
      id: 'cross-attention-mechanism',
      name: '3. 跨模态交叉注意力机制（Cross-Attention Layer）',
      category: '第三阶段：多模态条件控制',
      formula:
        '\\text{Attention}(Q, K, V) = \\text{softmax}\\!\\left(\\frac{Q K^\\top}{\\sqrt{d}}\\right) \\cdot V, \\quad Q = W_Q^{(i)} \\varphi_i(z_t), \\; K = W_K^{(i)} \\tau_\\theta(y), \\; V = W_V^{(i)} \\tau_\\theta(y)',
      explanation:
        '这是文生图（Text-to-Image）能够让每个单词精准控制画面对应空间区域的秘密所在：Query 矩阵来自 UNet 第 i 层的展平空间特征 φ_i(z_t)，而 Key 与 Value 矩阵则来自文本提示词编码 τ_θ(y)！',
      variables: [
        { symbol: '\\varphi_i(z_t) \\in \\mathbb{R}^{N \\times d_\\epsilon^i}', desc: 'UNet 中间层展平后的潜空间特征序列' },
        { symbol: '\\tau_\\theta(y) \\in \\mathbb{R}^{M \\times d_\\tau}', desc: '领域专用编码器（如 BERT / CLIP Text Encoder）输出的M个词向量' },
        { symbol: 'W_Q^{(i)}, W_K^{(i)}, W_V^{(i)}', desc: '将视觉潜特征与文本特征投影到同一维度 d 的可学习矩阵' },
      ],
    },
    {
      id: 'conditional-ldm-loss',
      name: '4. 条件潜在扩散模型联合训练目标',
      category: '端到端条件优化',
      formula:
        '\\mathcal{L}_{\\text{LDM-Cond}} := \\mathbb{E}_{\\mathcal{E}(x),\\, y,\\, \\epsilon \\sim \\mathcal{N}(0, 1),\\, t}\\Big[ \\big\\| \\epsilon - \\epsilon_\\theta\\big(z_t,\\, t,\\, \\tau_\\theta(y)\\big) \\big\\|_2^2 \\Big]',
      explanation:
        '在条件生成任务中，噪声预测主干 ε_θ 与条件编码器 τ_θ 可以通过此重加权变分下界目标进行联合优化（或在 Stable Diffusion v1/v2 中直接复用冻结的预训练 CLIP 文本编码器）。',
      variables: [
        { symbol: 'y', desc: '任意模态的控制条件（自然语言 Prompt、类别标签、语义分割掩码等）' },
      ],
    },
  ],

  metricCards: [
    {
      label: '潜空间维度压缩比 (f=8)',
      value: '48x 压缩',
      desc: '512×512×3 (78.6万维) 压缩至 64×64×4 (1.63万维)，空间计算面积缩小 64 倍',
      color: 'emerald',
    },
    {
      label: '黄金下采样甜点',
      value: 'LDM-4 / LDM-8',
      desc: '实验证明 f ∈ {4, 8} 完美平衡了感知保真度与扩散收敛速度，显著优于像素级 LDM-1',
      color: 'blue',
    },
    {
      label: 'CelebA-HQ 生成质量',
      value: '5.11 FID',
      desc: '在 256×256 人脸合成上创下新 SOTA，超越此前所有 GAN、VAE 与像素空间扩散模型',
      color: 'purple',
    },
    {
      label: '文生图参数与泛化',
      value: '1.45B 参数',
      desc: '在 LAION-400M 上训练的 KL-regularized LDM-8 直接演化为开源 Stable Diffusion v1',
      color: 'amber',
    },
  ],

  experimentSections: [
    {
      title: '下采样因子 f 的消融对比：从像素级扩散 (LDM-1) 到重度压缩 (LDM-32)',
      description:
        '作者在 ImageNet 上固定训练算力预算（2M 步），系统对比了不同下采样倍率 f ∈ {1, 2, 4, 8, 16, 32} 的训练吞吐量与生成 FID 分数（越低越好）。结果表明：f=1（纯像素扩散）训练极慢；f=32 压缩过度导致信息丢失；而 LDM-4 与 LDM-8 取得了压倒性优势。',
      headers: ['模型变体 (下采样率 f)', '256×256 图像的潜张量尺寸', '相对训练吞吐量 (Samples/sec)', '2M 步训练后 FID (↓越低越好)', '表现剖析'],
      rows: [
        ['LDM-1 (f=1 像素空间 DDPM)', '256 × 256 × 3 (196,608 维)', '1.0x (基准极慢)', '38.4', '算力被高频像素细节耗尽，相同时间内远未收敛'],
        ['LDM-2 (f=2)', '128 × 128 × 3 (49,152 维)', '3.2x', '18.6', '空间维度缩小 4 倍，收敛显著提速'],
        ['LDM-4 (f=4 黄金甜点)', '64 × 64 × 3 (12,288 维)', '8.5x', '10.3 (极佳)', '兼顾超细微纹理重构上限与高扩散吞吐量'],
        ['LDM-8 (f=8 SD 标准配置)', '32 × 32 × 4 (4,096 维)', '14.2x', '11.1 (极佳)', '速度与质量最佳工程折中，被 Stable Diffusion v1/v2/XL 采用'],
        ['LDM-32 (f=32 过度压缩)', '8 × 8 × 32 (2,048 维)', '21.0x', '24.8 (质量退化)', '一阶段自编码器压缩过猛，解码上限受限导致伪影'],
      ],
    },
    {
      title: '无条件与文本条件图像合成基准对比（CelebA-HQ & MS-COCO Zero-Shot）',
      description:
        '对比 LDM 与 StyleGAN、VQGAN+Transformer（Esser et al.）、ADM（Dhariwal & Nichol）及巨型自回归模型 CogView 的生成质量与参数效率。',
      headers: ['任务与模型名称', '参数量 / 算力消耗', 'FID (↓越低越好)', 'Inception Score (↑)', '架构特征对比'],
      rows: [
        ['LSUN-Churches: StyleGAN2', '30M (GAN 对抗训练)', '3.86', '—', '容易发生局部模式遗漏（Mode Dropping），召回率偏低'],
        ['LSUN-Churches: DDPM (Ho et al.)', '114M (像素空间 1000 步)', '7.89', '—', '像素级全尺寸去噪，采样耗时极长'],
        ['LSUN-Churches: LDM-8 (本文)', '256M (潜空间 200 步)', '4.02', '—', '质量媲美 StyleGAN2 且分布覆盖度（Recall）大幅领先'],
        ['MS-COCO Zero-Shot: LDM-KL-8-G (本文)', '1.45B (LAION-400M 训练)', '12.63', '30.29', '参数量仅为 GLIDE (3.5B) 与 Make-A-Scene (4B) 的约 1/3'],
      ],
    },
  ],

  insights: [
    {
      title: '为什么 LDM 要把潜空间保持为「二维网格 (h×w×c)」，而不是像 VQGAN+GPT 那样展平成「一维序列」？',
      content:
        '在 LDM 之前，以 DALL-E 1 和 VQGAN+Transformer 为代表的两阶段模型必须把压缩后的离散 Token 展平为一维长序列，再用自回归 Transformer 逐个预测。这不仅丢失了图像的二维局部邻域结构，而且自注意力的 O(N²) 复杂度迫使它们使用高达 f=16 甚至 f=32 的激进压缩，严重损害了图像细节。LDM 的绝妙之处在于：在二维潜空间 z ∈ R^(h×w×c) 上直接使用二维卷积 UNet，完美继承了平移等变性与二维空间归纳偏置，从而只需温和的 f=4 或 f=8 压缩就能极速训练！',
    },
    {
      title: 'KL-reg 与 VQ-reg 两种潜空间正则化有什么区别？',
      content:
        '论文测试了两种防止潜空间分布发散的正则方式：1) **KL-reg**：类似 VAE，对编码器输出施加极小权重的标准正态 KL 散度惩罚（约 10^-6），潜空间保持连续；2) **VQ-reg**：在解码器前加入向量量化层（Vector Quantization Codebook），但在扩散模型采样时直接输出连续潜向量进入量化层。后续的 **Stable Diffusion v1.5 / v2 / SDXL** 均采用了 **f=8、4 通道的 KL-reg 连续 VAE**，而 SD3 / Flux 则在此基础上将通道数扩展至 c=16 以彻底消除小字与手指畸变。',
    },
    {
      title: '从 Latent UNet 到 DiT（Diffusion Transformer / Sora）的演进',
      content:
        '本文确立的「先用 VAE 压缩进 Latent Space，再在 Latent Space 做扩散」已成全行业绝对统治标准。后来 Peebles & Xie (ICCV 2023) 提出的 **DiT (Diffusion Transformer)** 以及 OpenAI 的 **Sora**，正是直接沿用了本文的 **Latent Diffusion 两阶段框架**，仅将第二阶段的潜空间去噪骨干从卷积 UNet 替换为了基于 Patchify 的 Transformer！',
    },
  ],

  takeaways: [
    {
      icon: 'Minimize2',
      title: '感知压缩与语义解耦',
      desc: '用自编码器滤除高频像素冗余，让扩散模型专注于 64×64 低维潜空间的语义构图生成。',
    },
    {
      icon: 'Zap',
      title: 'f=8 黄金下采样甜点',
      desc: '将 512×512×3 压缩为 64×64×4，空间面积缩小 64 倍，让消费级显卡跑起高清文生图。',
    },
    {
      icon: 'Sparkles',
      title: 'Cross-Attention 控制',
      desc: '将文本 Prompt 映射为 Key/Value 注入 UNet，实现逐词精准控制画面局部区域语义。',
    },
    {
      icon: 'Cpu',
      title: 'AIGC 工业界底座',
      desc: '直接诞生 Stable Diffusion 家族，并为后续 SDXL、DiT、Flux 与 Sora 奠定潜空间扩散范式。',
    },
  ],
};
