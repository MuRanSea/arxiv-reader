import { UniversalPaperData } from "../../../../src/shared/types/universalPaper.js";

export const DDPM_2020_DATA: UniversalPaperData = {
  "id": "ddpm-2020",
  "title": "Denoising Diffusion Probabilistic Models (DDPM)",
  "chineseTitle": "DDPM 去噪扩散概率模型：用简化噪声预测损失开启现代视觉、音频与视频生成黄金时代",
  "subtitle": "Jonathan Ho, Ajay Jain, Pieter Abbeel • UC Berkeley • NeurIPS 2020 (现代 AIGC 图像/视频扩散生成总源头)",
  "tags": [
    "DDPM 扩散模型奠基",
    "重参数化一步加噪 √ᾱ_t x_0 + √(1-ᾱ_t) ε",
    "预测噪声 ε_θ vs 预测均值 μ_θ",
    "简化损失 L_simple",
    "与朗之万动力学得分匹配等价"
  ],
  "arxivId": "2006.11239",
  "pdfUrl": "https://arxiv.org/pdf/2006.11239.pdf",
  "abstractUrl": "https://arxiv.org/abs/2006.11239",
  "summary": "现代所有文生图（Stable Diffusion、DALL·E 2/3、Midjourney、Flux）、文生视频（Sora、Runway、Kling）与音频生成模型的数学总源头！在 DDPM 之前，生成领域由 GAN（生成质量高但极易训练崩溃、发生模式坍塌且无法覆盖完整分布）统治，而 Sohl-Dickstein (2015) 最早提出的热力学扩散概念因直接优化复杂的变分下界（预测逆过程均值 μ_θ）导致生成画质模糊、无人问津。Jonathan Ho 等人完成了三个改写历史的数学突破：(1) 利用高斯可加性推导出「任意步闭式直接采样公式 x_t = √ᾱ_t x_0 + √(1-ᾱ_t) ε」，训练时无需一步步串行加噪；(2) 将神经网络预测目标从「预测去噪均值 μ_θ」重参数化为「直接预测当初混进去的标准高斯噪声 ε_θ(x_t, t)」，揭示了扩散模型与宋飏得分匹配（Score Matching / 朗之万动力学 ∇_x log p(x)）在数学上的深刻统一；(3) 提出极其简洁的去权重均方误差损失 L_simple = E[||ε - ε_θ||²]，有意降低微小噪声步的权重从而迫使模型专注于最难的全局语义结构重构，一举在 CIFAR-10 上取得 3.17 FID 首次击败 GAN！",
  "keyContributions": [
    "利用高斯马尔可夫链封闭性质推导一步跳步加噪公式 q(x_t | x_0) = N(x_t; √ᾱ_t x_0, (1-ᾱ_t)I)，使训练时可随机均匀采样任意时间步 t ∈ [1, T] O(1) 独立并行训练",
    "通过贝叶斯后验均值展开，将逆过程参数化从直接预测均值 μ_θ(x_t, t) 改写为预测所添加的单位高斯噪声 ε_θ(x_t, t)，证明 ε_θ 本质上就是数据分布的对数密度梯度（Stein Score -√(1-ᾱ_t)∇_{x_t} log q(x_t)）",
    "发现并提出简化目标函数 L_simple = E_{t, x_0, ε}[||ε - ε_θ(√ᾱ_t x_0 + √(1-ᾱ_t)ε, t)||²]：通过丢弃真实变分下界（ELBO）中偏重极小噪声步 t→1 的复杂系数，将生成质量 FID 从 13.51 暴降至 3.17！",
    "从信息论角度将马尔可夫去噪过程诠释为「渐进式有损解压缩（Progressive Lossy Decompression）」：大时间步负责勾勒全局粗糙语义轮廓，小时间步负责填充高频局部纹理"
  ],
  "coreProblem": "GAN 虽然能生成锐利图像，但极小极大博弈极不稳定、频繁遭遇模式坍塌（Mode Collapse）且无法计算数据似然；而早期的扩散概率模型直接让神经网络去回归逆向高斯均值 μ_θ 并按真实变分下界（VLB）权重训练，把大量算力浪费在毫无意义的极微小像素噪点上，生成的图片远远不如 GAN。",
  "coreIdea": "把「无中生有画一幅画」拆解成 T=1000 步的「渐进式擦除噪点」！前向过程像往一幅名画里滴墨水，根据公式 `√ᾱ_t x_0 + √(1-ᾱ_t) ε` 可以一秒钟算出第 t 步混合了多少比例的原图和多少比例的纯高斯噪声 ε；训练一个带时间步嵌入的 U-Net 网络 ε_θ(x_t, t)，只干一件事——看着满是噪点的图 x_t，猜出刚才混进去的那团纯噪声 ε 长什么样（||ε - ε_θ||²）！一旦学会了猜噪声，从一团纯雪花点 x_T 出发，一步步把猜出来的噪声减掉，一幅栩栩如生的高清画作就浮现出来了！",
  "simulatorTitle": "DDPM 前向一步加噪 (ᾱ_t) 与逆向 ε_θ 去噪轨迹模拟器",
  "simulatorDesc": "交互式调节扩散时间步 t (1~1000)、噪声调度策略与参数化目标 (预测 μ_θ vs 预测 ε_θ + L_simple)，实时计算信号保留率 √ᾱ_t、噪点占比与生成 FID。",
  "architectureSteps": [
    {
      "id": "ddpm-step-1",
      "title": "1. 前向任意时间步 t 闭式一步加噪",
      "subtitle": "Closed-Form Forward Diffusion q(x_t | x_0)",
      "description": "预设线性递增的方差调度 β_1=10^{-4} 至 β_T=0.02，令 α_t = 1-β_t, ᾱ_t = Π_{s=1}^t α_s；训练时随机抽一个时间步 t 和标准噪声 ε ~ N(0,I)，直接按 x_t = √ᾱ_t x_0 + √(1-ᾱ_t) ε 一步合成带噪图！",
      "highlightColor": "emerald"
    },
    {
      "id": "ddpm-step-2",
      "title": "2. 时间条件 U-Net 预测噪声残差 ε_θ",
      "subtitle": "Time-Conditioned U-Net Noise Predictor ε_θ(x_t, t)",
      "description": "将带噪图 x_t 与正余弦时间步编码 t 输入共享权重的残差+自注意力 U-Net，不直接预测原图，而是专门预测混入其中的高斯噪声分量 ε_θ(x_t, t)。",
      "highlightColor": "cyan"
    },
    {
      "id": "ddpm-step-3",
      "title": "3. L_simple 去权重均方误差优化",
      "subtitle": "Simplified Reweighted MSE Loss (L_simple)",
      "description": "舍弃真实变分下界中放大小步长噪音的繁琐权重项，直接最小化 ||ε - ε_θ(x_t, t)||²，自动引导模型把优化重心转移到决定整体构图的大噪声时间步上。",
      "highlightColor": "amber"
    },
    {
      "id": "ddpm-step-4",
      "title": "4. 朗之万动力学迭代去噪采样 (x_T → x_0)",
      "subtitle": "Iterative Langevin Reverse Sampling",
      "description": "推理时从纯高斯白噪声 x_T ~ N(0,I) 开始，从 t=T 倒退至 1 迭代执行 x_{t-1} = (1/√α_t)(x_t - (β_t/√(1-ᾱ_t))ε_θ(x_t, t)) + σ_t z，由粗到细雕琢出清晰图像。",
      "highlightColor": "purple"
    }
  ],
  "formulas": [
    {
      "id": "ddpm-f1",
      "name": "前向扩散任意步闭式重参数化公式与简化训练目标 (L_simple)",
      "category": "扩散前向与损失",
      "formula": "\\mathbf{x}_t = \\sqrt{\\bar{\\alpha}_t}\\,\\mathbf{x}_0 + \\sqrt{1 - \\bar{\\alpha}_t}\\,\\boldsymbol{\\epsilon}, \\quad \\boldsymbol{\\epsilon} \\sim \\mathcal{N}(\\mathbf{0}, \\mathbf{I}) \\implies \\mathcal{L}_{\\text{simple}}(\\theta) := \\mathbb{E}_{t,\\, \\mathbf{x}_0,\\, \\boldsymbol{\\epsilon}} \\left[ \\left\\| \\boldsymbol{\\epsilon} - \\boldsymbol{\\epsilon}_\\theta\\!\\left(\\sqrt{\\bar{\\alpha}_t}\\mathbf{x}_0 + \\sqrt{1-\\bar{\\alpha}_t}\\boldsymbol{\\epsilon},\\; t\\right) \\right\\|^2 \\right]",
      "explanation": "因为独立高斯分布之和仍为高斯分布，无需循环 t 次即可 O(1) 算出任意步带噪图 x_t；而 L_simple 这行极具美感的简单 MSE 公式成为了整个 AIGC 视觉生成工业界的标准训练损失！",
      "variables": [
        {
          "symbol": "\\alpha_t = 1 - \\beta_t,\\; \\bar{\\alpha}_t = \\prod_{s=1}^t \\alpha_s",
          "desc": "单步与累积信号保留系数（随 t 从 1 到 T，ᾱ_t 从 0.9999 平滑衰减至 0）"
        },
        {
          "symbol": "\\boldsymbol{\\epsilon}, \\boldsymbol{\\epsilon}_\\theta",
          "desc": "真实注入的标准高斯噪声与 U-Net 神经网络预测出的噪声向量"
        }
      ]
    },
    {
      "id": "ddpm-f2",
      "name": "逆向马尔可夫去噪单步采样迭代方程",
      "category": "逆向生成采样",
      "formula": "\\mathbf{x}_{t-1} = \\frac{1}{\\sqrt{\\alpha_t}} \\left( \\mathbf{x}_t - \\frac{1 - \\alpha_t}{\\sqrt{1 - \\bar{\\alpha}_t}} \\,\\boldsymbol{\\epsilon}_\\theta(\\mathbf{x}_t, t) \\right) + \\sigma_t \\mathbf{z}, \\qquad \\mathbf{z} \\sim \\mathcal{N}(\\mathbf{0}, \\mathbf{I})",
      "explanation": "揭示了逆向生成与退火朗之万动力学（Annealed Langevin Dynamics）的深刻等价性：减去预测噪声项等价于沿着数据概率密度对数梯度 ∇_x log p(x) 向高密度流形攀登，加上 σ_t z 则维持随机分布多样性。",
      "variables": [
        {
          "symbol": "\\sigma_t^2 \\in \\{\\beta_t, \\tilde{\\beta}_t\\}",
          "desc": "逆向单步先验方差与后验方差（两者在 T=1000 时生成效果相近）"
        },
        {
          "symbol": "\\mathbf{z}",
          "desc": "每步注入的随机热涨落噪声（最后一步 t=1 时令 z = 0）"
        }
      ]
    }
  ],
  "metricCards": [
    {
      "label": "CIFAR-10 生成质量 FID",
      "value": "3.17 FID (超越所有GAN)",
      "desc": "首次证明似然体系生成模型在画质上能全面击败对抗生成网络",
      "color": "emerald"
    },
    {
      "label": "训练稳定性与分布覆盖",
      "value": "100% 稳定 (零模式坍塌)",
      "desc": "简单的单网络回归损失彻底告别了 GAN 生成器与判别器的博弈失衡",
      "color": "cyan"
    },
    {
      "label": "预测 ε + L_simple 增益",
      "value": "FID 13.51 ➔ 3.17",
      "desc": "相比传统预测均值 μ + 精确变分下界 VLB 权重实现质的飞跃",
      "color": "amber"
    },
    {
      "label": "产业孵化地位",
      "value": "SD / Midjourney / Sora 源头",
      "desc": "与潜空间 VAE 结合诞生 Stable Diffusion，与 Transformer 结合诞生 DiT/Sora",
      "color": "purple"
    }
  ],
  "experimentSections": [
    {
      "title": "DDPM 核心设计消融实验（预测 μ vs 预测 ε，精确 VLB 权重 vs L_simple 简化损失）与 GAN 对比",
      "description": "直接引用论文 Table 2 关键消融数据：证明「预测噪声 ε + L_simple 简化去权重损失」是让扩散模型脱胎换骨击败 GAN 的核心秘诀。",
      "headers": [
        "模型架构与训练目标参数化",
        "损失函数权重策略",
        "Inception Score (IS ↑)",
        "CIFAR-10 FID (↓ 越低画质越真)"
      ],
      "rows": [
        [
          "StyleGAN2 + ADA (当时最强生成对抗网络基线)",
          "Minimax 对抗博弈",
          "9.40",
          "3.26 (训练复杂且易模式丢失)"
        ],
        [
          "DDPM 预测均值 μ̃_θ + 理论变分下界 L_vlb",
          "精确 ELBO 权重 (偏重小步长 t)",
          "8.06",
          "13.51 (画质模糊，落后于 GAN)"
        ],
        [
          "DDPM 预测均值 μ̃_θ + 简化损失 L_simple",
          "等权简化 MSE",
          "8.16",
          "10.85 (仍明显弱于预测噪声)"
        ],
        [
          "DDPM 预测噪声 ε_θ + 简化损失 L_simple (本文)",
          "去权重简化 MSE (聚焦全局大噪声步)",
          "9.46 (超越GAN!)",
          "3.17 (历史性击败 GAN 夺冠!)"
        ]
      ]
    }
  ],
  "insights": [
    {
      "title": "为什么在数学上等价的「预测均值 μ_θ」和「预测噪声 ε_θ」，在实际训练时预测噪声 ε_θ 的效果却好得多？",
      "content": "因为当时间步 t 较小时，带噪图 x_t 与下一步 x_{t-1} 的真实后验均值 μ̃_t 已经相差无几（99% 都是原图本身），如果让神经网络直接去预测均值 μ_θ，网络绝大部分容量都花在「把输入原封不动抄一遍（Identity Mapping）」上，很难精确学到那 1% 的微小去噪偏移；而如果改为直接预测标准高斯噪声 ε_θ ~ N(0,I)，无论在哪个时间步 t，目标永远是零均值、单位方差的纯粹残差信号，神经网络学起来极其高效稳定！"
    },
    {
      "title": "为什么故意把数学上严密的变分下界（ELBO）权重扔掉、改用「不严密」的 L_simple 反而让画质暴涨？",
      "content": "在真实的变分下界 L_vlb 中，第 t 步的权重系数是 β_t² / (2 σ_t² α_t (1-ᾱ_t))。当 t=1（只加了一丁点肉眼看不见的噪点）时，这个系数比 t=500 时大出成百上千倍！结果按严格数学公式训练的模型把 95% 的精力都浪费在修补最后一步微不足道的像素底噪上，而根本没学会在大时间步下勾勒物体轮廓。L_simple 大刀阔斧把前面系数全设为 1，相当于把算力重心强行挪回决定构图与语义的中高噪声步！"
    }
  ],
  "takeaways": [
    {
      "icon": "Sparkles",
      "title": "猜噪声远比直接画原图容易",
      "desc": "从预测均值 μ 改为预测单位噪声残差 ε_θ，一句话点醒了沉睡五年的扩散模型。"
    },
    {
      "icon": "FastForward",
      "title": "一步跳步加噪公式 √ᾱ_t",
      "desc": "利用高斯可加性把 1000 步马尔可夫链折叠为 O(1) 闭式采样，让训练能够高度并行。"
    },
    {
      "icon": "Sliders",
      "title": "L_simple 抓大放小的工程智慧",
      "desc": "大胆扔掉严密却偏科的 ELBO 权重，让模型先学会画骨架轮廓，再添皮肉纹理。"
    },
    {
      "icon": "Compass",
      "title": "统一扩散与得分匹配两大门派",
      "desc": "证明预测噪声 ε_θ 就是估计概率密度梯度 -σ∇log p(x)，直接启发了后续 DDIM 10步快速采样与流匹配（Flow Matching）。"
    }
  ]
};

export const PAPER_DATA: UniversalPaperData = DDPM_2020_DATA;
export default PAPER_DATA;
