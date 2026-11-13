# QLoRA: Efficient Finetuning of Quantized LLMs（QLoRA 量化低秩微调：单张 48GB 显卡微调 65B 大模型的开源微调破局之作）

> **论文原文**：*QLoRA: Efficient Finetuning of Quantized LLMs*
> **作者与机构**：Tim Dettmers, Artidoro Pagnoni, Ari Holtzman, Luke Zettlemoyer — University of Washington
> **发表会议/期刊**：NeurIPS 2023
> **论文标识**：[2305.14314](https://arxiv.org/abs/2305.14314) | [PDF 原文直链](https://arxiv.org/pdf/2305.14314.pdf)

---

## 一、核心痛点与颠覆性洞察

虽然 LoRA 省掉了主干权重的优化器状态，但 65B 模型的 FP16 冻结主干权重本身就要占用 130GB 显存，再加上长序列激活梯度峰值，普通开发者手头的 24GB RTX 3090/4090 或 48GB A6000 根本无法加载并微调 33B/65B 级别的大模型。

**核心破局思想**：
把「存储精度」与「计算精度」彻底解耦！冻结的百亿主干权重平时以信息熵最高的 4-bit NF4 压缩躺在显存里（65B 仅需约 33GB）；前向和反向计算经过某层时，在 CUDA 寄存器内即时反量化（Dequantize）为 BF16 与输入相乘，而所有梯度和更新只发生在仅占 1% 参数量的 BF16 LoRA 旁路上！

$$q_i = \frac{1}{2} \left( Q_X\!\left(\frac{i}{2^k + 1}\right) + Q_X\!\left(\frac{i+1}{2^k + 1}\right) \right), \quad X \sim \mathcal{N}(0, 1), \; k=4$$

---

## 二、四大核心贡献与工业界拿走的东西

1. 提出信息论最优的数据类型 4-bit NormalFloat (NF4)：利用预训练权重严格服从零均值正态分布的统计特性，按高斯分位数等概率切分 16 个量化桶
2. 发明双重量化（Double Quantization）：对第一级分块（Blocksize=64）产生的 FP32 缩放常数 c_2 再进行一次 8-bit 量化，每参数再省 0.373 bits
3. 引入基于 NVIDIA Unified Memory 的分页优化器（Paged Optimizers），在长序列梯度尖峰时自动将优化器状态换出至 CPU 内存，彻底消除 OOM
4. 存储用 4-bit NF4、计算时动态反量化为 16-bit BF16，证明 4-bit QLoRA 在学术与对话基准上 100% 追平 16-bit 全量微调

### 关键实证指标
- **65B 模型微调显存需求**：`780GB ➔ < 41GB` —— 显存缩减超 19 倍，单张 48GB A6000 即可跑通 65B 微调
- **双重量化每参数净省**：`0.373 bits/param` —— 65B 模型仅量化常数一项就额外节省约 3.1 GB 显存
- **16-bit 全量微调精度恢复**：`100.0% 无损追平` —— 4-bit NF4 QLoRA 在 MMLU 与 Vicuna 基准上完全追平 16-bit
- **Guanaco-65B 对话胜率**：`ChatGPT 的 99.3%` —— 仅在单卡训练 24 小时即达到商用闭源旗舰对话水平

---

## 三、本文件夹目录结构

```text
papers/QLoRA-Efficient-Finetuning-of-Quantized-LLMs/
├── README.md                              # 本论文中文导读、核心公式与技术综述
└── src/
    ├── App.tsx                            # 论文独立交互主入口组件
    ├── components/
    │   └── QloraQuantSimulator.tsx             # 基于 IndustrialPaperSimulator 的专属交互式算法实验台
    └── data/
        └── paperData.ts                   # 完整中英精读章节、公式变量、基准对比与词典数据
```
