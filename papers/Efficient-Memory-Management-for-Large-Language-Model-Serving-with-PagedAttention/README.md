# Efficient Memory Management for Large Language Model Serving with PagedAttention (vLLM)（PagedAttention 与 vLLM：用操作系统虚拟内存分页彻底终结 KV Cache 显存浪费）

> **论文原文**：*Efficient Memory Management for Large Language Model Serving with PagedAttention (vLLM)*
> **作者与机构**：Woosuk Kwon, Zhuohan Li (李卓桓), Siyuan Zhuang, Ying Sheng, Lianmin Zheng, Ion Stoica et al. — UC Berkeley
> **发表会议/期刊**：SOSP 2023
> **论文标识**：[2309.06180](https://arxiv.org/abs/2309.06180) | [PDF 原文直链](https://arxiv.org/pdf/2309.06180.pdf)

---

## 一、核心痛点与颠覆性洞察

大模型自回归生成时，KV Cache 会随生成的每个 Token 动态增长且最终长度无法预知。传统深度学习框架要求张量必须在物理显存上连续存放，因此只能为每条请求预先分配一整块 max_seq_len 的连续显存，导致三分之二以上的珍贵显存被「占着茅坑不拉屎」的空闲预留位锁死，严重卡死了并发 Batch Size。

**核心破局思想**：
像操作系统管理物理内存页一样管理 KV Cache！把 GPU 显存池划分为无数个固定大小（例如 B=16 个 Token）的「物理 KV 块」。请求生成时，用多少分配多少，逻辑上连续的 Token 序列可以通过「页表（Block Table）」映射到物理上完全不相邻的任意空闲块中；且多个请求相同的 Prompt 前缀可以直接指向同一批物理块！

$$\mathbf{A}_{i,j} = \frac{\exp(\mathbf{q}_i^T \mathbf{K}_j / \sqrt{d})}{\sum_{t=1}^{\lceil i/B \rceil} \exp(\mathbf{q}_i^T \mathbf{K}_t / \sqrt{d}) \mathbf{1}}, \qquad \mathbf{o}_i = \sum_{j=1}^{\lceil i/B \rceil} \mathbf{V}_j \mathbf{A}_{i,j}^T$$

---

## 二、四大核心贡献与工业界拿走的东西

1. 量化揭露传统连续 KV Cache 分配的惊人真相：真实只有 20.4% ~ 38.2% 的 KV 显存存了有效 Token，其余 60%~80% 全是三大碎片浪费
2. 发明 PagedAttention 注意力内核：支持在非连续物理显存块（Non-contiguous Physical Blocks）上直接分块读取 K 和 V 并计算注意力
3. 构建完整的操作系统级显存管理器 vLLM：通过逻辑块到物理块的页表映射，实现按需分配（On-demand Allocation）与零外部碎片
4. 天然支持块级写时复制（Copy-on-Write）与引用计数，让 Parallel Sampling、Beam Search 和系统提示词（Prefix Caching）共享高达 55% 的 KV 显存

### 关键实证指标
- **KV Cache 显存浪费率**：`60~80% ➔ < 4%` —— 接近 100% 榨干每一字节显存，仅末尾块存在微小内部碎片
- **服务吞吐量提升 (vs Orca)**：`2.7x ~ 4.0x 倍` —— 省下的显存允许将并发 Batch Size 扩大数倍，相比 FT 提速 24 倍
- **Beam Search / 并行采样省存**：`最高节省 55% KV显存` —— 通过块级引用计数与 Copy-on-Write 实现多分支零拷贝共享
- **GitHub 开源影响力**：`vLLM (40,000+ Stars)` —— 全球生产环境部署最广泛的开源大模型推理服务引擎

---

## 三、本文件夹目录结构

```text
papers/Efficient-Memory-Management-for-Large-Language-Model-Serving-with-PagedAttention/
├── README.md                              # 本论文中文导读、核心公式与技术综述
└── src/
    ├── App.tsx                            # 论文独立交互主入口组件
    ├── components/
    │   └── PagedAttentionKvSimulator.tsx             # 基于 IndustrialPaperSimulator 的专属交互式算法实验台
    └── data/
        └── paperData.ts                   # 完整中英精读章节、公式变量、基准对比与词典数据
```
