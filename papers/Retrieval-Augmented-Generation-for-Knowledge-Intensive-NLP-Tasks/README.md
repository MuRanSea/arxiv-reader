# 📘 《Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks》
## 面向知识密集型 NLP 任务的检索增强生成架构 (RAG 奠基论文)

> **所属平台**：[AI Paper Lab 论文探索大厅](../../README.md)  
> **发表会议**：NeurIPS 2020  
> **论文编号**：[arXiv:2005.11401](https://arxiv.org/abs/2005.11401) ｜ [PDF 原文直链](https://arxiv.org/pdf/2005.11401)  
> **研究机构**：Facebook AI Research (FAIR) & UCL & NYU  
> **作者团队**：Patrick Lewis, Ethan Perez, Aleksandra Piktus, Fabio Petroni, Vladimir Karpukhin, Naman Goyal, Heinrich Küttler, Mike Lewis, Wen-tau Yih, Tim Rocktäschel, Sebastian Riedel, Douwe Kiela

---

## 🎯 一句话核心总结 (TL;DR)

**这是正式命名并确立「RAG（检索增强生成）」范式的历史性开山之作！**  
论文首次将存储在预训练 Seq2Seq 模型（BART-large）权重中的**参数化记忆（Parametric Memory）**，与存储在 2100 万维基百科稠密向量索引（DPR + FAISS）中的**非参数化记忆（Non-Parametric Memory）**统一到一个端到端可微分的概率生成框架中，提出了 **RAG-Sequence（序列级边缘化）** 与 **RAG-Token（词元级边缘化）** 两大数学模型，实现了超越百亿参数闭卷大模型的问答精度、6 倍事实性提升与**零重训练世界知识热插拔**！

---

## ⚡ 核心公式与两大模型变体

### 1. RAG-Sequence（序列级概率边缘化）
假设整个输出序列 $y = (y_1, \dots, y_N)$ 均由同一篇检索出的文档 $z$ 条件生成，在序列外层对 Top-$K$ 文档求加权和：

$$p_{\text{RAG-Sequence}}(y \mid x) \approx \sum_{z \in \text{top-}k(p(\cdot \mid x))} p_\eta(z \mid x) \prod_{i=1}^{N} p_\theta(y_i \mid x, z, y_{1:i-1})$$

### 2. RAG-Token（词元级概率边缘化）
允许在生成每一个词元 $y_i$ 时依赖不同的潜文档 $z$，在每个时间步内部先跨文档加权求和，从而在单句话中无缝拼合多篇文档的碎片事实：

$$p_{\text{RAG-Token}}(y \mid x) \approx \prod_{i=1}^{N} \sum_{z \in \text{top-}k(p(\cdot \mid x))} p_\eta(z \mid x) p_\theta(y_i \mid x, z, y_{1:i-1})$$

---

## 📊 关键实验里程碑

| 评测基准 / 维度 | 纯参数化闭卷模型 (T5-11B / BART) | 抽取式阅读理解 (DPR + BERT) | 🌟 RAG (本文 626M) | 核心突破结论 |
| :--- | :---: | :---: | :---: | :--- |
| **Natural Questions (EM)** | 34.5% (加SSM 36.6%) | 41.5% | **44.5%** | 6亿参数击败110亿参数闭卷模型 (+7.9%) |
| **检索文档不含答案原词时** | — | 0.0% | **11.8%** | 生成式架构可根据上下文线索归纳推理 |
| **人工事实性盲测胜率** | 7.1% | — | **42.7%** | 事实准确度领先纯 BART 达 6 倍 |
| **2016➔2018 索引热插拔** | 无法更新 (需重训) | 需重训阅读器 | **4% ➔ 68%** | 零重训练直接替换 FAISS 索引即刻更新世界认知 |
