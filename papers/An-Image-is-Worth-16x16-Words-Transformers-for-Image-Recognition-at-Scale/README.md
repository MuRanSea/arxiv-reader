# An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale（ViT 视觉 Transformer 开山论文）

> **论文原文**：*An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale*
> **作者团队**：Alexey Dosovitskiy, Lucas Beyer, Alexander Kolesnikov, Dirk Weissenborn, Xiaohua Zhai (翟晓华), Thomas Unterthiner, Mostafa Dehghani, Matthias Minderer, Georg Heigold, Sylvain Gelly, Jakob Uszkoreit, Neil Houlsby — Google Research, Brain Team
> **发表会议**：ICLR 2021
> **arXiv 编号**：[arXiv:2010.11929](https://arxiv.org/abs/2010.11929) | [PDF 原文直链](https://arxiv.org/pdf/2010.11929)

---

## 一、核心痛点与范式革命

在 NLP 领域已被 Transformer 统一的同时，计算机视觉（CV）领域依然被卷积神经网络（CNN，如 ResNet）牢牢统治。由于一张 $224 \times 224$ 的图像包含 $50,176$ 个像素，若直接对每个像素计算全局自注意力，复杂度 $O(N^2)$ 高达 $25$ 亿次交互，GPU 显存瞬间爆炸！

**ViT（Vision Transformer）的极简破局方案**：“**一张图片抵得上 16×16 的单词**”！
不对架构做任何视觉专用魔改，直接将二维图像 $x \in \mathbb{R}^{H \times W \times C}$ 切分为固定大小（如 $P \times P = 16 \times 16$）的不重叠图像块（Patches），将每个图像块展平为向量并经线性投影 $E$ 映射为 Patch Embedding，视作与 NLP 中完全相同的词元（Token）序列，直接送入**原汁原味的标准 Transformer 编码器**！

---

## 二、核心数学公式与归纳偏置定律

1. **图像块序列化与位置嵌入**：
   $$z_0 = \left[ x_{\text{class}}; \, x_p^1 E; \, x_p^2 E; \, \dots; \, x_p^N E \right] + E_{\text{pos}}, \quad N = \frac{HW}{P^2}$$
   当输入为 $224 \times 224$、块大小 $P=16$ 时，序列长度仅为 $N = (224/16)^2 = 14 \times 14 = 196$ 个图像块词元！
2. **大规模训练战胜归纳偏置（Large Scale Trumps Inductive Bias）**：
   ViT 缺乏 CNN 天生的局部性（Locality）与平移等变性（Translation Equivariance）归纳偏置，因此在中等规模数据集（ImageNet-1k，130万张图）上从头训练略逊于 ResNet；但一旦预训练数据规模扩展至 **1400 万 ~ 3 亿张图像（ImageNet-21k / JFT-300M）**，ViT 直接从数据中学会空间关系，以 **88.55% ImageNet Top-1** 和少得多的训练算力全面击败最强 CNN（BiT / Noisy Student）！

---

## 三、本文件夹目录结构

```text
papers/An-Image-is-Worth-16x16-Words-Transformers-for-Image-Recognition-at-Scale/
├── README.md                              # 本论文中文导读与说明
└── src/
    ├── App.tsx                            # 论文独立交互主入口组件
    ├── components/
    │   └── VitPatchSimulator.tsx          # ViT 图像切块序列化与归纳偏置规模交叉点实验台
    └── data/
        └── paperData.ts                   # 全文5章中英精读、公式、基准与词典数据
```
