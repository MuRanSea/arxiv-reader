# Parameter-Efficient Transfer Learning for NLP（PEFT 参数高效微调与瓶颈 Adapter 开山论文）

> **论文原文**：*Parameter-Efficient Transfer Learning for NLP* (结合 ICLR 2022 统一框架 *Towards a Unified View of Parameter-Efficient Transfer Learning*)
> **作者团队**：Neil Houlsby, Andrei Giurgiu, Stanisław Jastrzębski, Bruna Morrone, Quentin de Laroussilhe, Andrea Gesmundo, Mona Attariyan, Sylvain Gelly — Google Research
> **发表会议**：ICML 2019 & ICLR 2022
> **arXiv 编号**：[arXiv:1902.00751](https://arxiv.org/abs/1902.00751) | [PDF 原文直链](https://arxiv.org/pdf/1902.00751)

---

## 一、核心痛点与开创性贡献

在 BERT 问世后，针对每个新任务进行“全量微调（Full Fine-Tuning）”成为标准做法。但如果有 100 个在线任务，就必须存储和维护 100 个完整且独立的 BERT 模型副本，存储开销与持续学习（Continual Learning）成本极高；而如果仅微调顶层分类头（Feature-based / Top-layer Tuning），准确率又会大幅暴跌。

**Google Research 提出的 Adapter（适配器）架构正式开创了 NLP 参数高效微调（PEFT）时代**：
冻结预训练 Transformer 的全部原始权重，在每一层的自注意力（MHA）和前馈网络（FFN）之后各插入一个极小的**瓶颈型适配器模块（Bottleneck Adapter）**：
$$h \leftarrow h + f(h W_{\text{down}}) W_{\text{up}}$$
其中 $W_{\text{down}} \in \mathbb{R}^{d \times m}$ 将维度从 $d$ 压缩至极小的瓶颈维 $m \ll d$（例如从 1024 压到 64），经过非线性激活 $f(\cdot)$ 后，再由 $W_{\text{up}} \in \mathbb{R}^{m \times d}$ 还原回 $d$ 维并加上跳跃连接（Skip-Connection）。在 GLUE 基准上，**仅新增 3.6% 的参数即可达到全量微调 99.6% 的性能**！

---

## 二、PEFT 四大主流流派统一数学框架（He et al., ICLR 2022）

后来 CMU 学者在 *Towards a Unified View of Parameter-Efficient Transfer Learning* (`arXiv:2110.04366`) 中证明：Adapter、Prefix-Tuning、Prompt-Tuning 与 LoRA 本质上都可以统一表示为对隐藏层表征 $h$ 的增量修正 $\Delta h$：
$$\text{输出} = h + s \cdot \Delta h(x)$$
区别仅在于：**功能函数形式**（线性 vs. 非线性 vs. 门控）、**插入位置**（MHA vs. FFN）、以及**连接方式**（串行 Serial vs. 并行 Parallel）。

---

## 三、本文件夹目录结构

```text
papers/Parameter-Efficient-Transfer-Learning-for-NLP/
├── README.md                                  # 本论文中文导读与说明
└── src/
    ├── App.tsx                                # 论文独立交互主入口组件
    ├── components/
    │   └── PeftArchitectureSimulator.tsx      # PEFT 四大范式（Adapter/Prefix/Prompt/MAM）交互实验台
    └── data/
        └── paperData.ts                       # 全文5章中英精读、公式、基准与词典数据
```
