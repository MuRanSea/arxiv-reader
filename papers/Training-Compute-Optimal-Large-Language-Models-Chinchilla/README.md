# Training Compute-Optimal Large Language Models (Chinchilla)（Chinchilla 算力最优扩展定律：颠覆大模型参数与训练数据配比法则）

> **论文原文**：*Training Compute-Optimal Large Language Models (Chinchilla)*
> **作者与机构**：Jordan Hoffmann, Sebastian Borgeaud, Arthur Mensch, Laurent Sifre et al. — DeepMind
> **发表会议/期刊**：NeurIPS 2022
> **论文标识**：[2203.15556](https://arxiv.org/abs/2203.15556) | [PDF 原文直链](https://arxiv.org/pdf/2203.15556.pdf)

---

## 一、核心痛点与颠覆性洞察

2020-2022 年间，各大实验室遵循 Kaplan 定律将算力预算几乎全砸向扩充参数量（175B GPT-3、280B Gopher、530B MT-NLG），而训练数据量全部停滞在 300B Tokens 左右，导致这些巨无霸模型处于严重的「欠训练（Under-trained）」状态，不仅未发挥算力潜力，还造成推理部署成本奇高。

**核心破局思想**：
在给定总训练算力预算 C ≈ 6ND (FLOPs) 的约束下求解最小化交叉熵损失 L(N, D)。当余弦学习率衰减周期精确匹配真实训练总步数时，算力每增加 10 倍，模型参数量 N 与训练数据 Token 数 D 必须各自放大 √10 ≈ 3.16 倍。

$$L(N, D) = E + \frac{A}{N^\alpha} + \frac{B}{D^\beta} \quad (E=1.69,\; A=406.4,\; B=410.7,\; \alpha=0.34,\; \beta=0.28)$$

---

## 二、四大核心贡献与工业界拿走的东西

1. 修正了 OpenAI Kaplan 定律因固定学习率余弦周期导致的系统性偏差，确立 N_opt ∝ C^{0.5}、D_opt ∝ C^{0.5} 的等比例扩展法则
2. 提出参数化损失预测方程 L(N, D) = E + A/N^α + B/D^β，精准量化模型容量瓶颈、数据不足瓶颈与自然语言固有熵
3. 确立大模型工程黄金经验法则：算力最优训练要求 D ≈ 20N（每 1B 参数至少喂入 20B 高质量 Tokens）
4. 实证训练出 70B 参数 Chinchilla（配 1.4T Tokens），在与 280B Gopher（300B Tokens）相同 FLOPs 下实现 MMLU 67.5% (+7.6% 跃升)

### 关键实证指标
- **黄金 Token/参数配比**：`D ≈ 20 × N` —— 每 1B 参数至少需要 20B 训练 Tokens 才能达到算力最优
- **Chinchilla (70B) MMLU**：`67.5% (+7.6%)` —— 以 1/4 参数量大幅超越同算力的 280B Gopher (59.9%)
- **在线推理显存与成本**：`直降 75% (4倍加速)` —— 70B 模型仅需 1/4 显卡即可部署，吞吐量提升 4 倍
- **拟合实验模型总数**：`400+ 组预训练模型` —— 横跨 70M 到 16B 参数、9 个算力数量级的严密实证

---

## 三、本文件夹目录结构

```text
papers/Training-Compute-Optimal-Large-Language-Models-Chinchilla/
├── README.md                              # 本论文中文导读、核心公式与技术综述
└── src/
    ├── App.tsx                            # 论文独立交互主入口组件
    ├── components/
    │   └── ChinchillaScalingSimulator.tsx             # 基于 IndustrialPaperSimulator 的专属交互式算法实验台
    └── data/
        └── paperData.ts                   # 完整中英精读章节、公式变量、基准对比与词典数据
```
