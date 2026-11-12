# BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding (BERT 奠基论文)

> **论文原名**：*BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding*  
> **作者**：Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova (Google AI Language)  
> **发表会议**：NAACL-HLT 2019 (Best Long Paper)  
> **论文编号**：[arXiv:1810.04805](https://arxiv.org/abs/1810.04805) | [PDF 直链](https://arxiv.org/pdf/1810.04805.pdf)

---

## 一、 核心贡献

1. **深度双向编码器表示（Deep Bidirectional Representations）**：突破了以 GPT 为代表的单向从左到右语言模型以及 ELMo 浅层双向拼接的局限，利用 Transformer Encoder 在所有层同时融合左右两侧上下文。
2. **掩码语言模型（Masked Language Model, MLM）与 80-10-10 策略**：随机遮盖输入中 15% 的 WordPiece Token，并通过「80% `[MASK]` + 10% 随机词 + 10% 原词不变」消除了预训练与微调阶段的符号不一致问题。
3. **「预训练 + 微调（Pre-training & Fine-tuning）」统一范式**：仅需在顶层附加一个轻量级分类层或指针层，即可横扫 GLUE、SQuAD v1.1/v2.0 及 SWAG 等 11 项 NLP 基准测试。

---

## 二、 目录结构

```text
BERT-Pre-training-of-Deep-Bidirectional-Transformers-for-Language-Understanding/
├── README.md                              # 本说明文档
└── src/
    ├── App.tsx                            # 论文详情页入口
    ├── components/
    │   └── BertMlmSimulator.tsx           # 双向 vs 单向上下文消歧、80-10-10 MLM 策略与三合一输入表示模拟器
    └── data/
        └── paperData.ts                   # 论文结构化数据、公式、11项基准实验与深度解析
```
