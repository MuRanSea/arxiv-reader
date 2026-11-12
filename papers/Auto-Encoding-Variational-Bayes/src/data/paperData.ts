import { UniversalPaperData } from '../../../../src/shared/types/universalPaper.js';

export const VAE_2013_DATA: UniversalPaperData = {
  id: 'vae-2013',
  title: 'Auto-Encoding Variational Bayes',
  chineseTitle: '自动编码变分贝叶斯（VAE 变分自编码器奠基之作）',
  subtitle: 'Diederik P. Kingma, Max Welling • University of Amsterdam • ICLR 2014',
  tags: ['ICLR 2014 奠基论文', 'VAE 变分自编码器', 'Reparameterization Trick 重参数化', 'ELBO 证据下界', '深度生成模型'],
  arxivId: '1312.6114',
  pdfUrl: 'https://arxiv.org/pdf/1312.6114.pdf',
  abstractUrl: 'https://arxiv.org/abs/1312.6114',
  summary:
    '深度生成模型开山巨著！针对连续隐变量模型后验分布 p(z|x) 难解（Intractable）的根本困境，提出随机梯度变分贝叶斯（SGVB）与著名的「重参数化技巧（Reparameterization Trick）」z = μ + σ ⊙ ε，首次将变分推断与神经网络反向传播无缝融合，诞生了现代生成模型基石——变分自编码器（VAE）！',

  keyContributions: [
    '揭示连续隐变量有向图模型的三大难解性：边缘似然 p_θ(x) 积分难解、真实后验 p_θ(z|x) 难解、大规模数据集下传统平均场变分推断（Mean-field VI）计算代价过高。',
    '提出「重参数化技巧（Reparameterization Trick）」：将从 q_φ(z|x) 的随机采样转化为确定性可微路径 z = μ_φ(x) + σ_φ(x) ⊙ ε（ε ~ N(0,I)），使梯度方差比黑盒 Score Function (REINFORCE) 估计器降低数个数量级。',
    '推导出证据下界（ELBO）的高斯解析形式：在先验 p(z)=N(0,I) 与近似后验 q_φ(z|x)=N(μ, diag(σ²)) 下，KL 散度项可解析求导，无需蒙特卡洛采样。',
    '构建 Variational Auto-Encoder (VAE) 架构：引入摊销推断网络（Amortized Inference Network / Recognition Model）q_φ(z|x) 作为概率编码器，p_θ(x|z) 作为概率解码器，学习平滑、可连续插值的二维流形潜空间。',
  ],

  coreProblem:
    '在带有连续隐变量 z 的概率生成模型 p_θ(x, z) = p_θ(z)p_θ(x|z) 中，边缘似然 p_θ(x) = ∫ p_θ(z)p_θ(x|z) dz 包含高维非线性神经网络，积分完全无法解析计算（Intractable），导致后验分布 p_θ(z|x) = p_θ(x|z)p_θ(z)/p_θ(x) 也无法计算。此外，若直接用神经网络参数化变分分布 q_φ(z|x) 并从中采样 z ~ q_φ(z|x)，随机采样算子会阻断关于变分参数 φ 的梯度反向传播！',

  coreIdea:
    '引入识别模型（概率编码器）q_φ(z|x) 近似真实难解后验 p_θ(z|x)，通过最大化单个数据点的变分下界（ELBO）联合优化生成参数 θ 与变分参数 φ。最核心的突破是「重参数化技巧」：不直接从 N(μ_φ(x), Σ_φ(x)) 采样，而是先从标准正态分布采样外部噪声 ε ~ N(0, I)，再通过确定性变换 z = μ_φ(x) + σ_φ(x) ⊙ ε 生成隐变量，从而将随机性剥离到计算图主干之外，实现端到端 SGD/Adam 训练！',

  simulatorTitle: 'VAE 重参数化梯度流、ELBO 权衡与连续流形潜空间模拟器',
  simulatorDesc:
    '交互式对比「直接采样（梯度阻断）」与「重参数化技巧 z = μ + σ ⊙ ε」，动态调节 KL 正则权重 β 观察重构保真度与潜空间平滑性的权衡，并在 2D 高斯流形上探索连续解码插值。',

  architectureSteps: [
    {
      id: 'probabilistic-encoder',
      title: '1. 概率编码器（Recognition Model q_φ(z|x)）',
      subtitle: 'Amortized Variational Inference',
      description:
        '不同于传统自编码器将输入 x 映射为单一确定性向量，VAE 的编码器输出后验高斯分布的参数向量：均值向量 μ_φ(x) 与对数方差向量 log σ²_φ(x)。这种「摊销变分推断」让所有样本共享同一套神经网络权重 φ。',
      highlightColor: 'emerald',
    },
    {
      id: 'reparameterization',
      title: '2. 重参数化节点（Reparameterization Trick）',
      subtitle: 'z = μ_φ(x) + σ_φ(x) ⊙ ε, ε ~ N(0, I)',
      description:
        '为了对期望 E_{q_φ(z|x)}[log p_θ(x|z)] 关于 φ 求导，从辅助噪声分布 p(ε)=N(0,I) 采样 ε，并计算确定性函数 g_φ(ε, x) = μ + exp(0.5 · log σ²) ⊙ ε。梯度 ∂z/∂μ = 1，∂z/∂σ = ε 可顺畅反向传播。',
      highlightColor: 'blue',
    },
    {
      id: 'probabilistic-decoder',
      title: '3. 概率解码器（Generative Model p_θ(x|z)）',
      subtitle: 'Bernoulli / Gaussian Likelihood Decoder',
      description:
        '解码器接收采样得到的隐变量 z，通过多层非线性网络输出观测数据分布 p_θ(x|z) 的参数（如二值图像的 Bernoulli 概率或自然图像的 Gaussian 均值），计算重构对数似然 log p_θ(x|z)。',
      highlightColor: 'purple',
    },
    {
      id: 'elbo-objective',
      title: '4. 证据下界（ELBO）联合优化',
      subtitle: 'Reconstruction Likelihood - KL Divergence',
      description:
        '最大化变分下界 L(θ, φ; x) = E_{q_φ(z|x)}[log p_θ(x|z)] - D_KL(q_φ(z|x) || p(z))。第一项鼓励高保真重构，第二项（解析 KL 散度）迫使潜空间分布逼近标准正态先验 N(0,I)，消除流形空洞。',
      highlightColor: 'amber',
    },
  ],

  formulas: [
    {
      id: 'elbo-decomposition',
      name: '1. 边缘对数似然分解与证据下界 (ELBO)',
      category: '变分推断基础',
      formula:
        '\\log p_\\theta(x^{(i)}) = D_{KL}\\big(q_\\phi(z|x^{(i)}) \\,\\|\\, p_\\theta(z|x^{(i)})\\big) + \\mathcal{L}(\\theta, \\phi; x^{(i)})',
      explanation:
        '由于真实后验 p_θ(z|x) 难解，KL 散度非负（D_KL ≥ 0），因此 L(θ, φ; x^(i)) 构成了边缘对数似然 log p_θ(x^(i)) 的严格下界（Evidence Lower Bound, ELBO）。最大化 ELBO 等价于同时最大化数据边缘似然并最小化近似后验与真实后验的差距。',
      variables: [
        { symbol: '\\log p_\\theta(x^{(i)})', desc: '单个观测样本 x^(i) 的边缘对数似然（Model Evidence）' },
        { symbol: 'q_\\phi(z|x^{(i)})', desc: '由编码器参数 φ 控制的近似后验分布（Recognition Model）' },
        { symbol: 'p_\\theta(z|x^{(i)})', desc: '难解的真实后验分布' },
        { symbol: '\\mathcal{L}(\\theta, \\phi; x^{(i)})', desc: '变分下界（ELBO），可计算的优化目标' },
      ],
    },
    {
      id: 'elbo-two-terms',
      name: '2. ELBO 的「重构 + 先验正则」形式',
      category: '核心目标函数',
      formula:
        '\\mathcal{L}(\\theta, \\phi; x^{(i)}) = \\mathbb{E}_{q_\\phi(z|x^{(i)})}\\big[\\log p_\\theta(x^{(i)}|z)\\big] - D_{KL}\\big(q_\\phi(z|x^{(i)}) \\,\\|\\, p_\\theta(z)\\big)',
      explanation:
        '将 ELBO 改写为两项之和：第一项是期望重构对数似然（对应自编码器的重构误差负值）；第二项是近似后验与先验 p(z) 的 KL 散度（充当潜空间正则化器，防止编码器退化为过拟合的 Dirac δ 函数）。',
      variables: [
        { symbol: '\\mathbb{E}_{q_\\phi}[\\log p_\\theta(x|z)]', desc: '重构似然项：鼓励从潜向量 z 还原出清晰准确的样本 x' },
        { symbol: 'D_{KL}(q_\\phi(z|x) \\| p(z))', desc: '正则化项：约束每个样本的后验高斯分布贴合标准正态先验 N(0, I)' },
      ],
    },
    {
      id: 'reparameterization-trick',
      name: '3. 重参数化技巧与 SGVB 估计器',
      category: '梯度传播突破',
      formula:
        'z^{(i,l)} = g_\\phi(\\epsilon^{(i,l)}, x^{(i)}) = \\mu^{(i)} + \\sigma^{(i)} \\odot \\epsilon^{(i,l)}, \\quad \\epsilon^{(i,l)} \\sim \\mathcal{N}(0, \\mathbf{I})',
      explanation:
        '通过可逆确定性映射 g_φ(ε, x) 将关于 q_φ(z|x) 的积分期望转化为关于无参数噪声分布 p(ε) 的期望：E_{q_φ(z|x)}[f(z)] = E_{p(ε)}[f(g_φ(ε, x))]。在 Mini-batch 训练中通常取采样次数 L=1 即可稳定收敛。',
      variables: [
        { symbol: '\\mu^{(i)}, \\sigma^{(i)}', desc: '编码器对样本 x^(i) 输出的均值与标准差向量' },
        { symbol: '\\epsilon^{(i,l)}', desc: '第 l 次独立采样的标准正态噪声向量' },
        { symbol: '\\odot', desc: '逐元素哈达玛积（Element-wise product）' },
      ],
    },
    {
      id: 'analytic-kl-gaussian',
      name: '4. 高斯先验与后验下的解析 KL 散度公式（Appendix B）',
      category: '闭式推导',
      formula:
        '-D_{KL}\\big(q_\\phi(z|x^{(i)}) \\,\\|\\, \\mathcal{N}(0, \\mathbf{I})\\big) = \\frac{1}{2} \\sum_{j=1}^{J} \\Big(1 + \\log\\big((\\sigma_j^{(i)})^2\\big) - (\\mu_j^{(i)})^2 - (\\sigma_j^{(i)})^2\\Big)',
      explanation:
        '论文附录 B 推导出的经典公式：当先验 p(z)=N(0,I) 且 q_φ(z|x) 为对角协方差高斯分布时，KL 散度可精确化简为 J 个隐空间维度的代数和，代码实现仅需一行张量运算！',
      variables: [
        { symbol: 'J', desc: '隐空间（Latent Space）的维度数量' },
        { symbol: '\\mu_j^{(i)}', desc: '第 i 个样本在第 j 个潜维度的后验均值' },
        { symbol: '(\\sigma_j^{(i)})^2', desc: '第 i 个样本在第 j 个潜维度的后验方差（网络通常输出 log σ² 以保证非负）' },
      ],
    },
  ],

  metricCards: [
    {
      label: '每次样本采样数 L',
      value: 'L = 1',
      desc: '当 Mini-batch M ≈ 100 时，每个数据点仅需采样 1 个噪声 ε 即可实现极低方差的梯度下降',
      color: 'emerald',
    },
    {
      label: 'Frey Face 变分下界提升',
      value: '+210 nats',
      desc: '相比传统 Wake-Sleep 算法，AEVB 在小样本和大规模潜维度下均取得显著更高的对数似然下界',
      color: 'blue',
    },
    {
      label: '摊销推断复杂度',
      value: 'O(1) 前向',
      desc: '无需像传统变分推断那样对每个新测试样本迭代优化局部变分参数，一次前向传播即可获得 q_φ(z|x)',
      color: 'purple',
    },
    {
      label: '现代生成模型基石',
      value: 'LDM / SD 底座',
      desc: 'Stable Diffusion 与 Sora 的感知压缩潜空间（Latent Space）直接构建在 KL-regularized VAE 之上',
      color: 'amber',
    },
  ],

  experimentSections: [
    {
      title: 'MNIST 与 Frey Face 边缘对数似然下界对比（AEVB vs. Wake-Sleep）',
      description:
        '作者在 MNIST 手写数字与 Frey Face 人脸数据集上对比了 AEVB（SGVB 估计器）与经典的 Wake-Sleep 算法。实验表明，AEVB 不仅收敛速度大幅领先，而且随着隐空间维度 N_z 从 3 增加到 200，AEVB 不会出现过拟合，始终保持更高的训练与测试变分下界。',
      headers: ['数据集与隐空间维度 (N_z)', 'Wake-Sleep (Test Lower Bound)', 'AEVB / VAE (Test Lower Bound)', '收敛特性与稳定性分析'],
      rows: [
        ['MNIST (N_z = 3)', '-139.5 nats', '-136.2 nats (更优)', '低维流形下两者接近，但 AEVB 梯度方差明显更小'],
        ['MNIST (N_z = 20)', '-105.8 nats', '-101.4 nats (更优)', '20 维隐空间充分捕捉笔画粗细、倾斜度与数字拓扑'],
        ['MNIST (N_z = 200)', '-109.2 nats (退化)', '-99.8 nats (最优)', '解析 KL 正则项自动抑制冗余维度（Posterior Collapse 保护），防止高维过拟合'],
        ['Frey Face (N_z = 10)', '1320 nats', '1495 nats (大幅领先)', '连续灰度人脸数据上，高斯解码器 + AEVB 显著优于离散近似算法'],
      ],
    },
    {
      title: '梯度估计器方差对比：Score Function (REINFORCE) vs. Reparameterization Trick',
      description:
        '为什么不能直接用强化学习中的对数导数技巧 ∇_φ E_{q_φ}[f(z)] = E_{q_φ}[f(z) ∇_φ log q_φ(z|x)]？因为该黑盒估计器未利用函数 f(z) 自身的梯度信息 ∇_z f(z)，方差极高，训练深度网络几乎无法收敛。',
      headers: ['梯度估计方法', '数学表达式', '是否利用 ∇_z log p_θ(x|z)', '单次采样 (L=1) 梯度方差'],
      rows: [
        [
          'Score Function / REINFORCE',
          'f(z) · ∇_φ log q_φ(z|x)',
          '否（将解码器视为黑盒标量回报）',
          '极高（需复杂的 Baseline 方差缩减且难以训练深层网络）',
        ],
        [
          'Reparameterization Trick (本文)',
          '∇_z f(z) · ∇_φ g_φ(ε, x)',
          '是（完整利用解码器反向传播梯度链）',
          '极低（L=1 即可配合标准 SGD / Adam 稳定收敛）',
        ],
      ],
    },
  ],

  insights: [
    {
      title: '为什么传统 AutoEncoder (AE) 不能直接用来做生成模型？',
      content:
        '传统确定性自编码器仅最小化重构误差 ||x - D(E(x))||²，编码器会将训练样本映射为高维空间中稀疏、孤立的「点簇」，点与点之间存在大片未定义的「空白裂缝（Holes）」。一旦在测试时从空白区域随机采样 z 送入解码器，生成的全是不具语义的乱码。VAE 通过 KL 散度迫使每个样本映射为一个具有体积的「高斯椭圆云」，并挤压在标准正态分布球体内，从而填平了流形裂缝，实现了平滑的连续空间插值。',
    },
    {
      title: '为什么 VAE 生成的图像往往比 GAN 略显模糊（Blurry）？',
      content:
        '第一，VAE 在像素空间使用均方误差（MSE / 高斯似然）或交叉熵（Bernoulli 似然），当同一隐变量对应多种可能的纹理细节时，最大似然倾向于取所有可能像素的「期望平均值」；第二，优化 ELBO 等价于最小化前向/反向 KL 散度，具有「Mode-covering（覆盖所有模式）」特性，宁可在两个模式中间生成模糊过渡，也不丢失任何模式。这一特性后来使其成为 Stable Diffusion 第一阶段「高保真感知压缩器（VQ-VAE / KL-VAE）」的完美选择。',
    },
    {
      title: '通往 β-VAE 与现代扩散模型（DDPM）的桥梁',
      content:
        '1) 若在 KL 项前乘以超参数 β > 1，便得到著名的 β-VAE（Higgins et al., 2017），强迫隐空间不同维度自动解耦出姿态、光照、宽度等独立语义因子（Disentangled Representation）；2) 现代扩散模型（DDPM）本质上就是一个「拥有 T 层固定高斯编码器与可学习逆向高斯解码器的层次化马尔可夫 VAE」，其训练目标正是本文 ELBO 的多步变分推广！',
    },
  ],

  takeaways: [
    {
      icon: 'Shuffle',
      title: '重参数化技巧',
      desc: '将 z ~ N(μ, σ²) 改写为 z = μ + σ ⊙ ε，把随机采样移出梯度主干，打通变分推断与反向传播。',
    },
    {
      icon: 'Scale',
      title: 'ELBO 双项博弈',
      desc: '重构似然项保证生成准确性，解析 KL 散度项充当潜空间引力场，塑造紧致连续的流形。',
    },
    {
      icon: 'Compass',
      title: '平滑流形插值',
      desc: '在二维正态分位数网格上滑动 z，解码器可连续平滑地过渡笔画粗细、倾斜角与表情姿态。',
    },
    {
      icon: 'Layers',
      title: '现代生成底座',
      desc: '从 β-VAE、VQ-VAE 到 Stable Diffusion 的 Latent Space，VAE 奠定了连续潜空间生成范式。',
    },
  ],
};
