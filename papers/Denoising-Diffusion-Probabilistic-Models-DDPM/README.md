# Denoising Diffusion Probabilistic Models (DDPM)（DDPM 去噪扩散概率模型：用简化噪声预测损失开启现代视觉、音频与视频生成黄金时代）

> **论文原文**：*Denoising Diffusion Probabilistic Models (DDPM)*
> **作者与机构**：Jonathan Ho, Ajay Jain, Pieter Abbeel — UC Berkeley
> **发表会议/期刊**：NeurIPS 2020 (现代 AIGC 图像/视频扩散生成总源头)
> **论文标识**：[2006.11239](https://arxiv.org/abs/2006.11239) | [PDF 原文直链](https://arxiv.org/pdf/2006.11239.pdf)

---

## 一、核心痛点与颠覆性洞察

GAN 虽然能生成锐利图像，但极小极大博弈极不稳定、频繁遭遇模式坍塌（Mode Collapse）且无法计算数据似然；而早期的扩散概率模型直接让神经网络去回归逆向高斯均值 μ_θ 并按真实变分下界（VLB）权重训练，把大量算力浪费在毫无意义的极微小像素噪点上，生成的图片远远不如 GAN。

**核心破局思想**：
把「无中生有画一幅画」拆解成 T=1000 步的「渐进式擦除噪点」！前向过程像往一幅名画里滴墨水，根据公式 `√ᾱ_t x_0 + √(1-ᾱ_t) ε` 可以一秒钟算出第 t 步混合了多少比例的原图和多少比例的纯高斯噪声 ε；训练一个带时间步嵌入的 U-Net 网络 ε_θ(x_t, t)，只干一件事——看着满是噪点的图 x_t，猜出刚才混进去的那团纯噪声 ε 长什么样（||ε - ε_θ||²）！一旦学会了猜噪声，从一团纯雪花点 x_T 出发，一步步把猜出来的噪声减掉，一幅栩栩如生的高清画作就浮现出来了！

$$\mathbf{x}_t = \sqrt{\bar{\alpha}_t}\,\mathbf{x}_0 + \sqrt{1 - \bar{\alpha}_t}\,\boldsymbol{\epsilon}, \quad \boldsymbol{\epsilon} \sim \mathcal{N}(\mathbf{0}, \mathbf{I}) \implies \mathcal{L}_{\text{simple}}(\theta) := \mathbb{E}_{t,\, \mathbf{x}_0,\, \boldsymbol{\epsilon}} \left[ \left\| \boldsymbol{\epsilon} - \boldsymbol{\epsilon}_\theta\!\left(\sqrt{\bar{\alpha}_t}\mathbf{x}_0 + \sqrt{1-\bar{\alpha}_t}\boldsymbol{\epsilon},\; t\right) \right\|^2 \right]$$

---

## 二、四大核心贡献与工业界拿走的东西

1. 利用高斯马尔可夫链封闭性质推导一步跳步加噪公式 q(x_t | x_0) = N(x_t; √ᾱ_t x_0, (1-ᾱ_t)I)，使训练时可随机均匀采样任意时间步 t ∈ [1, T] O(1) 独立并行训练
2. 通过贝叶斯后验均值展开，将逆过程参数化从直接预测均值 μ_θ(x_t, t) 改写为预测所添加的单位高斯噪声 ε_θ(x_t, t)，证明 ε_θ 本质上就是数据分布的对数密度梯度（Stein Score -√(1-ᾱ_t)∇_{x_t} log q(x_t)）
3. 发现并提出简化目标函数 L_simple = E_{t, x_0, ε}[||ε - ε_θ(√ᾱ_t x_0 + √(1-ᾱ_t)ε, t)||²]：通过丢弃真实变分下界（ELBO）中偏重极小噪声步 t→1 的复杂系数，将生成质量 FID 从 13.51 暴降至 3.17！
4. 从信息论角度将马尔可夫去噪过程诠释为「渐进式有损解压缩（Progressive Lossy Decompression）」：大时间步负责勾勒全局粗糙语义轮廓，小时间步负责填充高频局部纹理

### 关键实证指标
- **CIFAR-10 生成质量 FID**：`3.17 FID (超越所有GAN)` —— 首次证明似然体系生成模型在画质上能全面击败对抗生成网络
- **训练稳定性与分布覆盖**：`100% 稳定 (零模式坍塌)` —— 简单的单网络回归损失彻底告别了 GAN 生成器与判别器的博弈失衡
- **预测 ε + L_simple 增益**：`FID 13.51 ➔ 3.17` —— 相比传统预测均值 μ + 精确变分下界 VLB 权重实现质的飞跃
- **产业孵化地位**：`SD / Midjourney / Sora 源头` —— 与潜空间 VAE 结合诞生 Stable Diffusion，与 Transformer 结合诞生 DiT/Sora

---

## 三、本文件夹目录结构

```text
papers/Denoising-Diffusion-Probabilistic-Models-DDPM/
├── README.md                              # 本论文中文导读、核心公式与技术综述
└── src/
    ├── App.tsx                            # 论文独立交互主入口组件
    ├── components/
    │   └── DdpmDiffusionDenoiseSimulator.tsx             # 基于 IndustrialPaperSimulator 的专属交互式算法实验台
    └── data/
        └── paperData.ts                   # 完整中英精读章节、公式变量、基准对比与词典数据
```
