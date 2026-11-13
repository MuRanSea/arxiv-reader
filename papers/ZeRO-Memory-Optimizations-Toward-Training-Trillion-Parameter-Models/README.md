# ZeRO: Memory Optimizations Toward Training Trillion Parameter Models（ZeRO 零冗余优化器与分布式并行：突破万亿参数大模型训练显存墙 (DeepSpeed & Megatron-LM)）

> **论文原文**：*ZeRO: Memory Optimizations Toward Training Trillion Parameter Models*
> **作者与机构**：Samyam Rajbhandari, Jeff Rasley, Olatunji Ruwase, Yuxiong He — Microsoft DeepSpeed Team & NVIDIA Megatron-LM
> **发表会议/期刊**：SC 2020
> **论文标识**：[1910.02054](https://arxiv.org/abs/1910.02054) | [PDF 原文直链](https://arxiv.org/pdf/1910.02054.pdf)

---

## 一、核心痛点与颠覆性洞察

训练 GPT-3 规模（175B 参数）模型时，仅保存 FP16 参数（350GB）、FP16 梯度（350GB）和 Adam FP32 状态（2100GB）就需要高达 2.8TB 的模型状态显存，远超任何单张 80GB H100/A100 显卡容量；而传统数据并行在每张卡上重复存储相同副本，造成 98% 以上的显存浪费。

**核心破局思想**：
既然数据并行中有 N_d 张卡，为什么每张卡都要存全套状态？将优化器状态、梯度和参数切分成 N_d 份，每张 GPU 只持久保存并更新属于自己的 1/N_d 分片！在前向和反向计算需要完整某层权重时，通过高速 All-Gather 临时拼齐，算完立刻释放（用完即焚）。

$$M_{\text{DP}} = \underbrace{2\Psi}_{\text{FP16 } W} + \underbrace{2\Psi}_{\text{FP16 } G} + \underbrace{(4\Psi + 4\Psi + 4\Psi)}_{\text{FP32 Master } W, m_t, v_t} = 16\Psi \text{ Bytes}$$

---

## 二、四大核心贡献与工业界拿走的东西

1. 精准剖析混合精度训练显存分布：优化器状态（FP32 Master Weights + m_t + v_t = 12Ψ）独占 75% 模型状态显存
2. 提出 ZeRO-1/2/3 三级渐进式分片架构，分别实现 4x、8x 与 N_d 倍（随 GPU 数量线性扩展）的模型状态显存压缩
3. 证明 ZeRO-1 与 ZeRO-2 的通信量与标准数据并行 All-Reduce 完全相同（2Ψ），无任何额外通信惩罚
4. 与 NVIDIA Megatron-LM（1909.08053 层内列并行+行并行切分）共同构成现代 3D 并行（DP/ZeRO + TP + PP）工业训练标准

### 关键实证指标
- **最大可训练模型规模**：`1 Trillion+ (万亿参数)` —— 在 400 张 GPU 上即可容纳超万亿参数模型状态
- **ZeRO-1/2/3 显存缩减比**：`4x / 8x / N_d 倍` —— 彻底消除数据并行中的冗余状态副本
- **ZeRO-1/2 额外通信代价**：`0% (与标准DP相同)` —— 用 Reduce-Scatter + All-Gather 完美平替 All-Reduce
- **集群吞吐扩展效率**：`15 PetaFLOPS (超线性)` —— 省下的显存允许更大 Batch Size，大幅提升 GPU 计算利用率

---

## 三、本文件夹目录结构

```text
papers/ZeRO-Memory-Optimizations-Toward-Training-Trillion-Parameter-Models/
├── README.md                              # 本论文中文导读、核心公式与技术综述
└── src/
    ├── App.tsx                            # 论文独立交互主入口组件
    ├── components/
    │   └── ZeroShardingSimulator.tsx             # 基于 IndustrialPaperSimulator 的专属交互式算法实验台
    └── data/
        └── paperData.ts                   # 完整中英精读章节、公式变量、基准对比与词典数据
```
