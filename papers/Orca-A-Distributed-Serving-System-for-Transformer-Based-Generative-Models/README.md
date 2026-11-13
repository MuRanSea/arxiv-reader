# Orca: A Distributed Serving System for Transformer-Based Generative Models（Orca 连续批处理：开创按迭代调度的现代大模型高吞吐推理引擎范式）

> **论文原文**：*Orca: A Distributed Serving System for Transformer-Based Generative Models*
> **作者与机构**：Gyeong-In Yu, Joo Seong Jeong, Geon-Woo Kim, Soojeong Kim, Byung-Gon Chun — Seoul National University & FriendliAI
> **发表会议/期刊**：OSDI 2022
> **论文标识**：[OSDI 2022 (ATC/OSDI)](https://www.usenix.org/conference/osdi22/presentation/yu) | [PDF 原文直链](https://www.usenix.org/system/files/osdi22-yu.pdf)

---

## 一、核心痛点与颠覆性洞察

自回归大模型的输出长度事先未知且差异悬殊（有的请求回复 10 个词，有的回复 1000 个词）。在静态批处理下，短请求完成后 GPU 算力全部浪费在无效填充符（Padding）上，而队列外的新请求却必须苦苦等待整个 Batch 最慢的那条请求跑完，导致 GPU 利用率不足 10%。

**核心破局思想**：
打破「同进同出」的静态批次枷锁！调度器在模型每跑完【一步前向迭代（生成 1 个 Token）】后就介入检查：凡是刚刚吐出 [EOS] 的请求立刻移出运行池并向用户返回结果；空出来的槽位当场从等待队列拉取新请求（执行 Prefill）顶替上来，让 GPU 在每一个时钟周期都处于满载有效计算状态！

$$\eta_{\text{Static}} = \frac{\sum_{i=1}^{B} T_i}{B \cdot \max_{1 \le i \le B} T_i}, \qquad \text{Bubble Waste} = 1 - \eta_{\text{Static}}$$

---

## 二、四大核心贡献与工业界拿走的东西

1. 揭示静态请求级批处理（Static Batching）在自回归生成中的三大浪费：早退请求空转陪跑、新到请求排队饥饿、Prefill 与 Decode 长度异构无法合批
2. 首创「按迭代调度（Iteration-Level Scheduling / 工业界通称 Continuous Batching）」，将调度粒度从「整次请求」细化到「每一次前向单步迭代」
3. 提出「选择性批处理（Selective Batching）」：对与序列长度无关的 Linear/FFN 层将所有请求拍扁为 [Σ N_i, d] 矩阵统一批处理，仅对 Attention 层按各自 KV Cache 独立执行
4. 在 175B GPT-3 模型分布式服务评测中，于相同尾延迟（Latency）下取得 FasterTransformer 36.9 倍的吞吐量提升

### 关键实证指标
- **GPT-3 175B 吞吐量提升**：`36.9x 倍 (同延迟下)` —— 相比 NVIDIA FasterTransformer 静态批处理实现数量级飞跃
- **调度时间粒度**：`1 个 Token 迭代步` —— 完成即走、随到随插，彻底消灭 [EOS] 后的陪跑气泡
- **线性层权重读取复用率**：`100% 跨请求合并` —— Selective Batching 让 Prefill 与 Decode 共享同一次权重加载
- **工业界生态地位**：`所有推理引擎标配` —— vLLM、TensorRT-LLM、SGLang 的 Continuous Batching 源头

---

## 三、本文件夹目录结构

```text
papers/Orca-A-Distributed-Serving-System-for-Transformer-Based-Generative-Models/
├── README.md                              # 本论文中文导读、核心公式与技术综述
└── src/
    ├── App.tsx                            # 论文独立交互主入口组件
    ├── components/
    │   └── OrcaContinuousBatchingSimulator.tsx             # 基于 IndustrialPaperSimulator 的专属交互式算法实验台
    └── data/
        └── paperData.ts                   # 完整中英精读章节、公式变量、基准对比与词典数据
```
