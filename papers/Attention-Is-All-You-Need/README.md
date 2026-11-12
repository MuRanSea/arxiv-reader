# Attention Is All You Need（注意力就是你所需的一切 — Transformer 开山之作）

> **论文原文**：*Attention Is All You Need*
> **作者团队**：Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin (Google Brain & Google Research)
> **发表会议**：NeurIPS 2017 (Advances in Neural Information Processing Systems 30)
> **arXiv 编号**：[arXiv:1706.03762](https://arxiv.org/abs/1706.03762) | [PDF 原文直链](https://arxiv.org/pdf/1706.03762)

---

## 一、核心痛点与历史变革

在 2017 年之前，序列建模与机器翻译领域长期被循环神经网络（RNN、LSTM、GRU）和卷积神经网络（CNN）统治。然而，RNN 存在两大无法根治的结构性死穴：
1. **顺序计算瓶颈（Sequential Bottleneck）**：必须等第 $t-1$ 个词算完生成隐藏状态 $h_{t-1}$ 后，才能计算第 $t$ 个词的 $h_t$，导致无法在训练时利用现代 GPU 对序列内部进行大规模并行计算。
2. **长距离依赖衰减（Long-Range Dependency Decay）**：相隔几十个词的两个概念想要传递信息，必须历经 $O(n)$ 步循环传递，信息极易遗忘或梯度消失。

**Transformer 的颠覆性方案**：**彻底抛弃循环（Recurrence）与卷积（Convolution）**，完全仅靠**自注意力机制（Self-Attention）**构建编码器-解码器（Encoder-Decoder）架构，将任意两个词之间的信号传递路径长度直接压缩为常数级 $O(1)$！

---

## 二、四大核心数学机制

1. **缩放点积注意力（Scaled Dot-Product Attention）**：
   $$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right)V$$
   通过除以缩放因子 $\sqrt{d_k}$（如 $\sqrt{64}=8$），防止高维向量点积方差过大导致 Softmax 进入梯度接近于 0 的饱和区。

2. **多头注意力（Multi-Head Attention）**：
   $$\text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, \dots, \text{head}_h)W^O, \quad \text{head}_i = \text{Attention}(QW_i^Q, KW_i^K, VW_i^V)$$
   使用 $h=8$ 个独立的 $d_k = d_v = 64$ 低维投影子空间，让模型同时关注语法指代、句法结构、词汇语义等不同维度的关系。

3. **掩码自注意力（Masked Self-Attention）**：
   在解码器自注意力中将未来位置 $(j > i)$ 的内积设为 $-\infty$，保证自回归生成性质。

4. **正弦与余弦位置编码（Sinusoidal Positional Encoding）**：
   $$PE_{(pos, 2i)} = \sin\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right), \quad PE_{(pos, 2i+1)} = \cos\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right)$$
   利用三角恒等式使 $PE_{pos+k}$ 可以表示为 $PE_{pos}$ 的线性函数，赋予模型外推相对位置的能力。

---

## 三、本文件夹目录结构

```text
papers/Attention-Is-All-You-Need/
├── README.md                                      # 本论文中文导读与说明
└── src/
    ├── App.tsx                                    # 论文独立交互主入口组件
    ├── components/
    │   └── TransformerAttentionSimulator.tsx      # 缩放点积注意力与多头掩码交互实验台
    └── data/
        └── paperData.ts                           # 全文7章中英精读、公式、基准与词典数据
```
