# 📘 《Dense Passage Retrieval for Open-Domain Question Answering》
## 面向开放域问答的稠密段落检索架构 (DPR 奠基论文)

> **所属平台**：[AI Paper Lab 论文探索大厅](../../README.md)  
> **发表会议**：EMNLP 2020  
> **论文编号**：[arXiv:2004.04906](https://arxiv.org/abs/2004.04906) ｜ [PDF 原文直链](https://arxiv.org/pdf/2004.04906)  
> **研究机构**：Facebook AI Research (FAIR) & 华盛顿大学 & 普林斯顿大学  
> **作者团队**：Vladimir Karpukhin, Barlas Oğuz, Sewon Min, Patrick Lewis, Ledell Wu, Sergey Edunov, Danqi Chen (陈丹琦), Wen-tau Yih (衣文涛)

---

## 🎯 一句话核心总结 (TL;DR)

**DPR 彻底打破了“稠密向量检索不如经典稀疏词频 BM25”的历史魔咒，开启了现代向量数据库检索时代！**  
论文证明：完全无需耗费巨资进行复杂的 ICT 预训练，只需采用两个标准预训练 BERT-base 构建双编码器（Bi-Encoder），结合**「批内负样本复用（In-Batch Negatives）+ 1 个 BM25 困难负样本（Hard Negative）」**在几万条问答对上进行对比学习，就能在 2100 万维基百科段落上将 Top-20 检索准确率从 BM25 的 **59.1% 狂拉至 79.4%（提升 +20.3 点）**！

---

## ⚡ 核心公式与负样本矩阵技巧

### 1. 双塔向量内积相似度
$$\text{sim}(q, p) = E_Q(q)^\top E_P(p) \in \mathbb{R}$$

### 2. 对比学习负对数似然损失 (InfoNCE / NLL)
$$\mathcal{L}(q_i, p_i^+, p_{i,1}^-, \dots, p_{i,n}^-) = -\log \frac{\exp(\text{sim}(q_i, p_i^+))}{\exp(\text{sim}(q_i, p_i^+)) + \sum_{j=1}^{n} \exp(\text{sim}(q_i, p_{i,j}^-))}$$

### 3. 批内负样本 + BM25 困难负样本矩阵 ($B \times 2B$)
$$\mathbf{S} = \mathbf{Q} \cdot \left[\mathbf{P}^+; \, \mathbf{P}^-_{\text{BM25}}\right]^\top \in \mathbb{R}^{B \times 2B}$$

---

## 📊 核心评测结果 (Natural Questions 2100万段落库)

| 检索模型 / 策略 | Top-20 准确率 | Top-100 准确率 | 端到端问答 (EM) | 关键结论 |
| :--- | :---: | :---: | :---: | :--- |
| **Lucene-BM25 (稀疏词频)** | 59.1% | 73.7% | 32.6% | 受困于“同义不同词”的词汇鸿沟 |
| **ORQA (ICT 预训练双塔)** | 52.0% | — | 33.3% | 昂贵预训练仍落后于有监督对比学习 |
| **🌟 Single-DPR (本文单集)** | **78.4% (+19.3%)** | **85.4%** | **41.5%** | 批内负样本 + BM25 困难负样本立竿见影 |
| **🌟 Multi-DPR (多集联合)** | **79.4% (+20.3%)** | **86.0%** | **41.5%** | 跨数据集泛化能力卓越 |
| **🌟 Hybrid (DPR + BM25)** | **82.6% (+23.5%)** | **88.6%** | — | 语义理解与罕见专有名词精确匹配互补 |
