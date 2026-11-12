# High-Resolution Image Synthesis with Latent Diffusion Models (Stable Diffusion 奠基论文)

> **论文原名**：*High-Resolution Image Synthesis with Latent Diffusion Models*  
> **作者**：Robin Rombach, Andreas Blattmann, Dominik Lorenz, Patrick Esser, Björn Ommer (LMU Munich / CompVis & Runway)  
> **发表会议**：CVPR 2022 (Oral)  
> **论文编号**：[arXiv:2112.10752](https://arxiv.org/abs/2112.10752) | [PDF 直链](https://arxiv.org/pdf/2112.10752.pdf)

---

## 一、 核心贡献

1. **感知压缩与语义生成两阶段解耦（Perceptual vs. Semantic Compression）**：指出像素空间扩散模型（Pixel-space DM）将绝大部分算力浪费在人眼不可见的超高频像素噪声细节上；提出先用自编码器（KL-VAE / VQ-VAE）将图像下采样 $f=8$ 倍压缩至低维潜空间（Latent Space），再在潜空间训练扩散模型（LDM）。
2. **算力与显存数量级降低**：当空间下采样因子 $f=8$ 时（如 $512 \times 512 \times 3 \to 64 \times 64 \times 4$），特征图空间维度缩小 $64$ 倍，使得单张消费级 GPU 即可完成高分辨率图像生成。
3. **基于交叉注意力（Cross-Attention）的通用多模态条件控制**：在 UNet 骨干中嵌入多头交叉注意力层（$Q$ 来自潜特征，$K, V$ 来自文本/布局编码器 $\tau_\theta(y)$），奠定了 Stable Diffusion 文生图与图生图的标准架构。

---

## 二、 目录结构

```text
High-Resolution-Image-Synthesis-with-Latent-Diffusion-Models/
├── README.md                              # 本说明文档
└── src/
    ├── App.tsx                            # 论文详情页入口
    ├── components/
    │   └── LatentDiffusionSimulator.tsx   # 下采样因子 f 权衡、潜空间逆向去噪与 Cross-Attention 条件模拟器
    └── data/
        └── paperData.ts                   # 论文结构化数据、公式、实验与深度解析
```
