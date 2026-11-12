# Language Models are Few-Shot Learners (GPT 系列与上下文学习奠基论文)

> **论文原名**：*Language Models are Few-Shot Learners (GPT-3)* & *Improving Language Understanding by Generative Pre-Training (GPT-1)*  
> **作者**：Tom B. Brown, Benjamin Mann, Nick Ryder, Melanie Subbiah, Jared Kaplan, Prafulla Dhariwal, Arvind Neelakantan, Pranav Shyam, Girish Sastry, Amanda Askell, Dario Amodei, Ilya Sutskever, Alec Radford et al. (OpenAI)  
> **发表会议**：NeurIPS 2020 (Best Paper Award) / OpenAI 2018–2020  
> **论文编号**：[arXiv:2005.14165](https://arxiv.org/abs/2005.14165) | [PDF 直链](https://arxiv.org/pdf/2005.14165.pdf)

---

## 一、 核心贡献

1. **生成式预训练 Transformer 路线（GPT-1 → GPT-2 → GPT-3）**：坚持纯自回归 Decoder-only 架构与最大化下一个词预测对数似然 $\sum_i \log P(u_i | u_{<i}; \Theta)$，将参数规模从 $1.17\text{亿}$（GPT-1）、$15\text{亿}$（GPT-2）扩展至 $1750\text{亿}$（GPT-3 175B）。
2. **上下文学习（In-Context Learning, ICL）范式**：彻底颠覆了「必须用成千上万条标注样本做梯度更新微调（Fine-tuning）」的传统认知——完全冻结 $175\text{B}$ 权重（零梯度更新），仅需在推理提示词（Prompt）中放入 $K$ 个自然语言示例（Zero-Shot / One-Shot / Few-Shot），模型即可在即时前向传播中自动识别并完成新任务。
3. **规模化涌现定律验证（Scaling Laws & Emergent Abilities）**：横跨 3 个数量级的 8 个模型尺寸（$125\text{M} \to 175\text{B}$）实验证明，随着参数量与算力按幂律增长，上下文学习能力、多位数算术、代码与类比推理能力会出现显著跃升。

---

## 二、 目录结构

```text
Language-Models-are-Few-Shot-Learners-GPT/
├── README.md                              # 本说明文档
└── src/
    ├── App.tsx                            # 论文详情页入口
    ├── components/
    │   └── GptInContextSimulator.tsx      # Zero/One/Few-Shot 上下文学习与 125M→175B 规模涌现模拟器
    └── data/
        └── paperData.ts                   # 论文结构化数据、公式、GPT1-3 演进与实验解析
```
