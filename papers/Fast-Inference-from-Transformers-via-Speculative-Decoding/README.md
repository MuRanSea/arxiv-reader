# Fast Inference from Transformers via Speculative Decoding（Speculative Decoding 投机采样：以小模型草稿与大模型并行校验实现无损推理加速）

> **论文原文**：*Fast Inference from Transformers via Speculative Decoding*
> **作者与机构**：Yaniv Leviathan, Matan Kalman, Yossi Matias — Google Research (同期独立发表: Charlie Chen et al. DeepMind)
> **发表会议/期刊**：ICML 2023
> **论文标识**：[2211.17192](https://arxiv.org/abs/2211.17192) | [PDF 原文直链](https://arxiv.org/pdf/2211.17192.pdf)

---

## 一、核心痛点与颠覆性洞察

自回归大模型生成 K 个 Token 必须串行执行 K 次完整的前向传播，每次都要把数百 GB 的模型权重从 HBM 读进计算核心一次，算术强度极低（Arithmetic Intensity ≈ 1），90% 的算力在空等显存带宽，导致单用户流式输出速度缓慢。

**核心破局思想**：
借鉴 CPU 硬件的「分支预测（Branch Prediction）」！先派一个体积小 10~20 倍的小模型（或 Medusa/MTP 预测头）快速往前连猜 γ 个词作为草稿；然后把这 γ 个词拼在一起喂给大模型做【一次】前向传播，同时拿到大模型在这 γ+1 个位置上的真实概率分布。凡是小模型猜对的直接批量放行，猜错的第一个位置用大模型分布当场纠正（白赚一个修正词）！

$$P(\text{Accept } \tilde{x}_i) = \min\!\left(1, \frac{p_i(\tilde{x}_i)}{q_i(\tilde{x}_i)}\right), \qquad p'_i(x) = \frac{\max(0,\; p_i(x) - q_i(x))}{\sum_{x'} \max(0,\; p_i(x') - q_i(x'))}$$

---

## 二、四大核心贡献与工业界拿走的东西

1. 洞察自回归解码的硬件带宽闲置悖论：单次前向传播并行校验 γ=5 个 Token 的耗时几乎等于生成 1 个 Token 的耗时
2. 构建「小模型串行打草稿（Draft γ steps）+ 大模型单步并行打分（Parallel Verify in 1 step）」的协同推理流水线
3. 发明「修正拒绝采样（Modified Rejection Sampling）」：以 min(1, p(x)/q(x)) 概率接受草稿，一旦拒绝则从残差分布 norm(max(0, p - q)) 中重采样，保证每轮至少推进 1 个且最多推进 γ+1 个 Token
4. 给出严密的数学定理证明：无论草稿模型多差、无论温度 T 如何设置，最终生成的 Token 序列概率分布与纯目标大模型 M_p 完全恒等（Exact Distribution Preservation）

### 关键实证指标
- **端到端生成速度提升**：`2.0x ~ 3.4x 倍加速` —— T5-XXL (11B) 与 Chinchilla (70B) 实测降低 50%~70% 生成延迟
- **输出概率分布保真度**：`100.0% 数学恒等无损` —— 非近似算法！无论是贪婪解码还是温度采样均与原模型完全一致
- **目标大模型权重重训需求**：`0 (即插即用)` —— 无需修改或重训主模型，任意共享词表的小模型均可充当草稿器
- **单轮最大推进 Token 数**：`γ + 1 个 Tokens` —— 全中时额外奉送第 γ+1 个 Bonus Token，保底至少产出 1 个 Token

---

## 三、本文件夹目录结构

```text
papers/Fast-Inference-from-Transformers-via-Speculative-Decoding/
├── README.md                              # 本论文中文导读、核心公式与技术综述
└── src/
    ├── App.tsx                            # 论文独立交互主入口组件
    ├── components/
    │   └── SpeculativeDecodingSimulator.tsx             # 基于 IndustrialPaperSimulator 的专属交互式算法实验台
    └── data/
        └── paperData.ts                   # 完整中英精读章节、公式变量、基准对比与词典数据
```
