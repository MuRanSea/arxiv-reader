# LoRA: Low-Rank Adaptation of Large Language Models（大模型低秩适配微调奠基论文）

> **论文原文**：*LoRA: Low-Rank Adaptation of Large Language Models*
> **作者团队**：Edward J. Hu (胡杰), Yelong Shen (沈业龙), Phillip Wallis, Zeyuan Allen-Zhu (朱泽园), Yuanzhi Li (李远志), Shean Wang, Lu Wang, Weizhu Chen (陈维柱) — Microsoft Corporation
> **发表会议**：ICLR 2022
> **arXiv 编号**：[arXiv:2106.09685](https://arxiv.org/abs/2106.09685) | [PDF 原文直链](https://arxiv.org/pdf/2106.09685)

---

## 一、核心痛点与颠覆性洞察

随着预训练语言模型从亿级迈向千亿级（如 GPT-3 175B），传统的**全量微调（Full Fine-Tuning）**面临不可承受的代价：每个下游任务都必须存一份 1750 亿参数的完整副本（约 350GB），且训练时需要维护全部权重的梯度与 Adam 优化器状态（超过 1.2TB 显存）。而此前的 **Adapter**（串行插入瓶颈层）会显著增加推理延迟，**Prefix-Tuning** 则会挤占宝贵的有效上下文长度。

**LoRA 的核心数学假设（内在低秩假设 Intrinsic Rank Hypothesis）**：
预训练大模型在适配特定下游任务时，其**权重改变量矩阵 $\Delta W$ 具有极低的“内在秩（Intrinsic Rank）”**！因此，我们完全可以冻结原始预训练权重 $W_0 \in \mathbb{R}^{d \times k}$，仅在旁路并联两个极窄的低秩矩阵 $B \in \mathbb{R}^{d \times r}$ 与 $A \in \mathbb{R}^{r \times k}$（其中秩 $r \ll \min(d, k)$，甚至 $r=1, 2, 4$ 即可）：
$$h = W_0 x + \Delta W x = W_0 x + \frac{\alpha}{r} B A x$$

---

## 二、三大杀手级优势

1. **参数量缩减 10,000 倍，训练显存锐减 3 倍**：在 GPT-3 175B 上，可训练参数从 175B 降至仅 18M（甚至 4.7M），显存从 1.2TB 降至 350GB。
2. **零额外推理延迟（Zero Inference Latency）**：部署时直接计算 $W = W_0 + \frac{\alpha}{r}BA$ 将旁路矩阵合并进主权重，推理速度与原模型 100% 相同！
3. **毫秒级多任务热切换**：切换下游任务只需做一次轻量级矩阵加减 $(W_0 + B_2 A_2 - B_1 A_1)$，一个底座模型即可挂载成百上千个几 MB 大小的 LoRA 权重插件。

---

## 三、本文件夹目录结构

```text
papers/LoRA-Low-Rank-Adaptation-of-Large-Language-Models/
├── README.md                              # 本论文中文导读与说明
└── src/
    ├── App.tsx                            # 论文独立交互主入口组件
    ├── components/
    │   └── LoraRankSimulator.tsx          # LoRA 低秩分解、显存计算与零延迟权重合并实验台
    └── data/
        └── paperData.ts                   # 全文5章中英精读、公式、基准与词典数据
```
