import { UniversalPaperData } from '../../../../src/shared/types/universalPaper.js';

export const GAN_2014_DATA: UniversalPaperData = {
  id: 'gan-2014',
  title: 'Generative Adversarial Nets',
  chineseTitle: '生成对抗网络（GAN 开山奠基之作）',
  subtitle: 'Ian J. Goodfellow, Yoshua Bengio et al. • Université de Montréal • NeurIPS 2014',
  tags: ['NeurIPS 2014 经典', 'GAN 生成对抗网络', 'Minimax 二人零和博弈', 'JS 散度最小化', '隐式生成模型'],
  arxivId: '1406.2661',
  pdfUrl: 'https://arxiv.org/pdf/1406.2661.pdf',
  abstractUrl: 'https://arxiv.org/abs/1406.2661',
  summary:
    '深度学习历史上最具创造力的思想之一（被 Yann LeCun 誉为「过去十年机器学习最酷的想法」）！通过构造「造假者（生成器 G）」与「鉴伪警察（判别器 D）」的二人极小极大博弈（Minimax Game），无需任何马尔可夫链（MCMC）或难解似然积分，纯粹依靠反向传播即可逼近任意复杂真实数据分布 p_data，并在 p_g = p_data 且 D*(x) = 1/2 处收敛至全局纳什均衡！',

  keyContributions: [
    '开创对抗式隐式生成框架（Adversarial Nets）：生成器 G(z; θ_g) 将先验噪声 p_z(z) 映射至数据空间，判别器 D(x; θ_d) 输出 x 来自真实数据的标量概率，两者均用多层感知机实现，仅需标准反向传播训练。',
    '推导固定 G 时的最优判别器解析解（Proposition 1）：证明 D*_G(x) = p_data(x) / (p_data(x) + p_g(x))，将对抗价值函数转化为真实分布与生成分布之间的 Jensen-Shannon (JS) 散度。',
    '证明全局纳什均衡唯一性（Theorem 1）：当且仅当生成分布完全匹配真实分布 p_g = p_data 时，虚拟训练准则 C(G) 达到全局最小值 -log 4，此时最优判别器处处输出 D*(x) = 1/2。',
    '提出非饱和生成器目标（Non-Saturating Loss）：揭示训练初期 D 轻易识破假样本（D(G(z)) ≈ 0）会导致 log(1 - D(G(z))) 梯度消失，改为最大化 log D(G(z)) 提供保持同一不动点的强梯度信号。',
  ],

  coreProblem:
    '在 GAN 诞生前，深度生成模型面临两难困境：基于最大似然的有向/无向图模型（如 DBM、RBM）在训练与采样时依赖计算代价极高且混合缓慢的马尔可夫链蒙特卡洛（MCMC）；而变分自编码器（VAE）虽然避开了 MCMC，却受制于像素级显式似然假设与变分下界近似ギャップ，生成的图像往往模糊。能否设计一种既不需要显式计算概率密度 p(x)，又完全不需要马尔可夫链，直接生成锐利逼真样本的框架？',

  coreIdea:
    '让两个神经网络进行对抗博弈：生成器 G 像「印假钞团伙」，试图把随机噪声 z 伪造成逼真样本 G(z) 蒙混过关；判别器 D 像「银行验钞机」，试图准确区分真实样本 x ~ p_data 与伪造样本 G(z) ~ p_g。判别器不断提升鉴伪能力并将梯度传回生成器，指引生成分布 p_g 沿着真实数据流形梯度方向移动，直到假样本与真样本完全无法区分（p_g = p_data, D*(x) = 0.5）。',

  simulatorTitle: 'GAN 极小极大博弈演化（论文 Figure 1 复现）与非饱和梯度模拟器',
  simulatorDesc:
    '交互式复现原论文经典的 Figure 1 四个博弈演化阶段（(a) 初始对决 → (b) D 收敛至最优 → (c) G 沿梯度迁移 → (d) 纳什均衡 p_g = p_data & D*(x)=1/2），并对比饱和损失与非饱和损失的梯度曲线。',

  architectureSteps: [
    {
      id: 'noise-prior',
      title: '1. 先验噪声采样 z ~ p_z(z)',
      subtitle: 'Latent Noise Source',
      description:
        '从简单的低维先验分布（均匀分布或标准正态分布）中随机采样隐向量 z，作为生成器网络的随机源。',
      highlightColor: 'blue',
    },
    {
      id: 'generator-net',
      title: '2. 生成器网络 G(z; θ_g)',
      subtitle: 'Differentiable Implicit Density p_g',
      description:
        '由参数为 θ_g 的可微神经网络将噪声 z 直接映射为数据空间样本 x_fake = G(z)。它不显式输出概率值，而是隐式定义了概率分布 p_g(x)。',
      highlightColor: 'purple',
    },
    {
      id: 'discriminator-net',
      title: '3. 判别器网络 D(x; θ_d)',
      subtitle: 'Binary Classifier outputting P(Real | x)',
      description:
        '同时接收来自真实数据集的样本 x ~ p_data 与生成器伪造样本 G(z) ~ p_g，输出标量概率 D(x) ∈ (0, 1)，代表输入为真实样本而非伪造样本的概率。',
      highlightColor: 'emerald',
    },
    {
      id: 'alternating-sgd',
      title: '4. k:1 交替随机梯度优化',
      subtitle: 'k steps on D (Ascent), 1 step on G (Descent)',
      description:
        '内循环先固定 G 更新 k 步判别器 D（最大化判别准确率，使 D 保持在最优解 D*_G 附近），外循环再更新 1 步生成器 G（沿着使 D(G(z)) 增大的方向移动生成流形）。',
      highlightColor: 'amber',
    },
  ],

  formulas: [
    {
      id: 'minimax-game',
      name: '1. 二人极小极大博弈价值函数 V(D, G)',
      category: '核心目标函数',
      formula:
        '\\min_G \\max_D V(D, G) = \\mathbb{E}_{x \\sim p_{\\text{data}}(x)}\\big[\\log D(x)\\big] + \\mathbb{E}_{z \\sim p_z(z)}\\big[\\log(1 - D(G(z)))\\big]',
      explanation:
        'GAN 最著名的核心公式：判别器 D 试图最大化该价值函数（令真样本 D(x)→1，假样本 D(G(z))→0）；生成器 G 试图最小化该价值函数（令假样本 D(G(z))→1，欺骗判别器）。',
      variables: [
        { symbol: 'p_{\\text{data}}(x)', desc: '真实训练数据的经验分布' },
        { symbol: 'p_z(z)', desc: '输入噪声变量 z 的先验分布' },
        { symbol: 'D(x)', desc: '判别器判断样本 x 来自真实数据分布的概率' },
        { symbol: 'G(z)', desc: '生成器将噪声 z 映射生成的伪造样本' },
      ],
    },
    {
      id: 'optimal-discriminator',
      name: '2. 固定生成器 G 时的最优判别器解析解（Proposition 1）',
      category: '理论证明',
      formula:
        'D^*_G(x) = \\frac{p_{\\text{data}}(x)}{p_{\\text{data}}(x) + p_g(x)}',
      explanation:
        '将价值函数改写为数据空间的积分 V(D,G) = ∫ [p_data(x) log D(x) + p_g(x) log(1-D(x))] dx，利用微积分求极值（a log y + b log(1-y) 在 y = a/(a+b) 处取最大值）即可直接证得。当 p_g(x) = p_data(x) 时，D*_G(x) = 1/2。',
      variables: [
        { symbol: 'D^*_G(x)', desc: '在当前生成分布 p_g 固定时，达到理论上限的最优判别器函数' },
        { symbol: 'p_g(x)', desc: '生成器 G(z) 在数据空间诱导出的隐式概率密度分布' },
      ],
    },
    {
      id: 'js-divergence-equivalence',
      name: '3. 虚拟训练准则 C(G) 与 Jensen-Shannon 散度（Theorem 1）',
      category: '全局最优性',
      formula:
        'C(G) = \\max_D V(G, D) = -\\log(4) + 2 \\cdot JSD\\big(p_{\\text{data}} \\,\\|\\, p_g\\big)',
      explanation:
        '将最优判别器 D*_G(x) 代回 V(D,G)，可严格化简为常数 -log(4) 加上两倍的 Jensen-Shannon 散度。因为 JSD(p||q) ≥ 0 且当且仅当 p=q 时取 0，故全局最小值为 C*(G) = -log 4 ≈ -1.3863，唯一最优解为 p_g = p_data！',
      variables: [
        { symbol: 'C(G)', desc: '判别器达到最优时关于生成器 G 的虚拟目标函数' },
        { symbol: 'JSD(p_{\\text{data}} \\| p_g)', desc: '对称且有界的 Jensen-Shannon 散度，取值范围 [0, log 2]' },
        { symbol: '-\\log(4)', desc: '纳什均衡处的理论最小价值函数值（以自然对数计约为 -1.386）' },
      ],
    },
    {
      id: 'non-saturating-loss',
      name: '4. 非饱和生成器实用目标函数（Non-Saturating Heuristic）',
      category: '训练稳定性技巧',
      formula:
        '\\mathcal{L}_{G}^{\\text{NS}} = \\max_G \\mathbb{E}_{z \\sim p_z(z)}\\big[\\log D(G(z))\\big] \\quad \\text{vs.} \\quad \\min_G \\mathbb{E}_{z \\sim p_z(z)}\\big[\\log(1 - D(G(z)))\\big]',
      explanation:
        '在训练早期，G 生成质量很差，判别器轻易给假样本打分 D(G(z)) → 0。此时原始目标 log(1 - D(G(z))) 在 0 附近的导数约为 -1/(1-0) = -1，梯度极其平缓（饱和）；而改用最大化 log D(G(z)) 时，导数为 1/D(G(z)) → +∞，在早期提供强劲的修正梯度！',
      variables: [
        { symbol: '\\mathcal{L}_G^{\\text{NS}}', desc: '实际工程与原论文实验中采用的非饱和生成器目标' },
        { symbol: 'D(G(z))', desc: '伪造样本被判别器误认为真样本的概率' },
      ],
    },
  ],

  metricCards: [
    {
      label: '纳什均衡判别输出',
      value: 'D*(x) = 1/2',
      desc: '当生成分布完美收敛至 p_g = p_data 时，判别器在所有点处无法区分真假，恒输出 0.5',
      color: 'emerald',
    },
    {
      label: '全局最优价值函数',
      value: '-log 4',
      desc: '此时 JSD(p_data || p_g) = 0，极小极大价值函数达到全局理论下界 -1.3863 nats',
      color: 'blue',
    },
    {
      label: 'MNIST Parzen 似然估计',
      value: '225 ± 2',
      desc: '在 MNIST 测试集上的高斯 Parzen 窗对数似然超越 DBN (138) 与 Stacked CAE (121)',
      color: 'purple',
    },
    {
      label: '推理采样复杂度',
      value: '1 次前向',
      desc: '彻底无需马尔可夫链（MCMC）混合迭代，一次神经网络前向传播即可生成锐利样本',
      color: 'amber',
    },
  ],

  experimentSections: [
    {
      title: 'MNIST 与 TFD 数据集 Parzen 窗对数似然评估（Table 1）',
      description:
        '由于隐式生成模型 p_g(x) 无法直接计算似然，作者在生成的样本上拟合高斯 Parzen 窗（Kernel Density Estimation）来估计测试集对数似然，并与深度信念网络（DBN）、收缩自编码器（Stacked CAE）及 Deep GSN 进行了对比。',
      headers: ['生成模型方法', 'MNIST 测试对数似然 (nats)', 'Toronto Face Database (TFD)', '是否需要马尔可夫链 (MCMC) 采样'],
      rows: [
        ['DBN (Deep Belief Network)', '138 ± 2', '1909 ± 66', '需要（Gibbs Sampling 混合极慢）'],
        ['Stacked CAE (Contractive AE)', '121 ± 1.6', '2110 ± 50', '需要（流形随机游走采样）'],
        ['Deep GSN (Generative Stochastic Net)', '214 ± 1.1', '1890 ± 29', '需要（多步马尔可夫转移）'],
        ['Adversarial Nets / GAN (本文)', '225 ± 2 (最优)', '2057 ± 26', '完全不需要（单步前向直接生成）'],
      ],
    },
    {
      title: '显式与隐式深度生成模型全景对比（论文 Table 2 总结）',
      description:
        '论文第 6 节系统梳理了有向图模型（VAE）、无向图模型（RBM/DBM）与生成对抗网络（GAN）在训练、推理、采样及密度估计上的优劣权衡。',
      headers: ['评估维度', '深度无向图模型 (RBM / DBM)', '变分自编码器 (VAE)', '生成对抗网络 (GAN 本文)'],
      rows: [
        ['训练阶段机制', '依赖 MCMC 估计配分函数梯度', '变分下界 ELBO + 重参数化反向传播', 'G 与 D 对抗博弈，纯反向传播'],
        ['采样生成速度与质量', '极慢（需多步 MCMC 燃烧期）', '快，但受像素似然影响略显模糊', '极快（单步前向），边缘纹理锐利清晰'],
        ['显式概率密度 p(x)', '难解（受限于配分函数 Z）', '提供严格变分下界 ELBO', '隐式分布（不直接暴露密度表达式）'],
        ['主要优化难点', '高维空间 MCMC 模式混合失败', '近似后验表达力受限', '需同步协调 G 与 D，防 Helvetica 坍缩（Mode Collapse）'],
      ],
    },
  ],

  insights: [
    {
      title: '什么是论文中提到的「Helvetica 场景（即模式坍缩 Mode Collapse）」？',
      content:
        'Goodfellow 在论文第 4.2 节极具前瞻性地指出：如果在固定 D 的情况下将 G 更新太多次，G 会把所有不同的输入噪声 z 都映射为同一个最能欺骗当前判别器 D 的单一高概率样本 x*（论文幽默地称之为「Helvetica 场景」，即后来广为人知的 Mode Collapse 模式坍缩）。因此必须坚持更新 k 步 D 配 1 步 G，让 D 始终保持在最优解附近。',
    },
    {
      title: '为什么 Figure 1 四阶段演化图是理解 GAN 的灵魂？',
      content:
        '论文开篇 Figure 1 用四幅一维分布演化图直观揭示了 GAN 的数学本质：判别器 D 的斜率导数 ∇_x D(x) 就像一根「无形的引力绳」，当假样本落在 x = G(z) 处时，梯度 ∂ log D(G(z)) / ∂z 会直接指向真实数据密度 p_data(x) 更高的方向，牵引生成分布 p_g 一步步滑向 p_data，直到两曲线完全重合，D*(x) 变成一条恒等于 1/2 的水平直线。',
    },
    {
      title: '从原始 GAN 到 WGAN、StyleGAN 与对抗扩散蒸馏（ADD）',
      content:
        '原始 GAN 启发了整整十年的生成视觉革命：DCGAN 引入卷积架构，WGAN 用 Wasserstein 距离（推土机距离）解决了支撑集不重叠时 JS 散度梯度为 0 的问题，StyleGAN 实现了超高分辨率人脸生成；而在今天的大模型与扩散模型时代，GAN 的判别器思想依然是 VQGAN、Stable Diffusion XL Turbo（对抗扩散蒸馏 ADD）实现「一步极速生成」的核心武器。',
    },
  ],

  takeaways: [
    {
      icon: 'Swords',
      title: '极小极大对抗博弈',
      desc: '生成器伪造样本、判别器鉴别真伪，在零和博弈中无需显式似然即可逼近任意复杂数据流形。',
    },
    {
      icon: 'Scale',
      title: 'JS 散度与纳什均衡',
      desc: '证明最优判别器 D*(x) = p_data/(p_data+p_g)，当 p_g = p_data 时 D*(x) = 0.5 达到全局最优。',
    },
    {
      icon: 'TrendingUp',
      title: '非饱和梯度技巧',
      desc: '用 max log D(G(z)) 替代 min log(1-D(G(z)))，彻底解决训练初期假样本被识破导致的梯度消失。',
    },
    {
      icon: 'Zap',
      title: '单步前向锐利生成',
      desc: '告别缓慢的 MCMC 采样与模糊的像素均方误差，开启高清晰度生成式 AI 黄金时代。',
    },
  ],
};
