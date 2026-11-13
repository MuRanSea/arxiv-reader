# GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers（GPTQ 与 AWQ 后训练量化：利用二阶海森补偿将百亿大模型无损塞进单张显卡）

> **论文原文**：*GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers*
> **作者与机构**：Elias Frantar, Saleh Ashkboos, Torsten Hoefler, Dan Alistarh — IST Austria & ETH Zurich
> **发表会议/期刊**：ICLR 2023 (同栈演进: AWQ 2306.00978)
> **论文标识**：[2210.17323](https://arxiv.org/abs/2210.17323) | [PDF 原文直链](https://arxiv.org/pdf/2210.17323.pdf)

---

## 一、核心痛点与颠覆性洞察

将 175B 模型从 FP16（350GB，至少需 5 张 80GB A100）直接四舍五入量化（RTN）到 4-bit 或 3-bit 时，由于未补偿权重截断对层输出 WX 的累积误差，模型困惑度直接崩溃；而传统二阶补偿算法 OBQ 在百亿规模下需要数百个小时且数值极易发散。

**核心破局思想**：
最小化层输出的二阶重构误差 ||WX - ŴX||₂²！当把第 q 列的权重 w_q 四舍五入量化为 quant(w_q) 时，会产生一个微小量化误差 δ_q。GPTQ 利用海森逆矩阵 H^{-1} = (2XX^T + λI)^{-1} 的相关性信息，当场调整【尚未量化的右侧剩余列权重】来精确抵消这笔误差，并每 128 列打包执行一次高速矩阵块更新！

$$\mathbf{E}_{:, j} = \frac{\mathbf{W}_{:, j} - \text{quant}(\mathbf{W}_{:, j})}{\left[\mathbf{H}^{-1}\right]_{jj}}, \qquad \mathbf{W}_{:, j:(i+B)} \leftarrow \mathbf{W}_{:, j:(i+B)} - \mathbf{E}_{:, j} \cdot \left[\mathbf{H}^{-1}\right]_{j, j:(i+B)}$$

---

## 二、四大核心贡献与工业界拿走的东西

1. 打破 OBQ 贪心逐权重选择导致的 O(d_row · d_col³) 算力死锁：证明按固定列顺序同步量化整列权重对最终精度几乎无影响，从而使所有行共享同一海森逆矩阵 H^{-1}
2. 提出「延迟块更新（Lazy Batch-Updates, B=128）」：将逐列秩-1 更新聚合成矩阵块乘法，将 GPU 显存带宽瓶颈转化为高吞吐 Tensor Core 计算，提速超 10 倍
3. 引入基于 Cholesky 分解的预先求逆重构，彻底解决了千亿模型海森矩阵病态近似引发的数值不稳定崩溃
4. 与后续 AWQ（2306.00978：发现保护激活值最大的 1% 显著权重通道并做等价缩放 s 即可免优化器无损量化）共同构成现代 INT4/FP4 权重压缩工业底座

### 关键实证指标
- **175B 模型单卡部署突破**：`5×A100 ➔ 1×A100` —— 350GB 权重压缩至约 88GB (4-bit) / 66GB (3-bit)，单卡跑通千亿模型
- **端到端 Token 推理提速**：`3.25x ~ 4.53x 加速` —— 4-bit 权重读取字节减少 4 倍，直接突破 Decode 阶段显存带宽墙
- **175B 全模型量化耗时**：`仅需 4 GPU 小时` —— 相比 OBQ 提速超百倍，且完全无需反向传播或重训练
- **4-bit 困惑度精度损失**：`< 0.03 PPL (近乎无损)` —— 在 WikiText2 上 OPT-175B 4-bit 困惑度 8.37 vs FP16 8.34

---

## 三、本文件夹目录结构

```text
papers/GPTQ-Accurate-Post-Training-Quantization-for-Generative-Pre-trained-Transformers/
├── README.md                              # 本论文中文导读、核心公式与技术综述
└── src/
    ├── App.tsx                            # 论文独立交互主入口组件
    ├── components/
    │   └── GptqHessianQuantSimulator.tsx             # 基于 IndustrialPaperSimulator 的专属交互式算法实验台
    └── data/
        └── paperData.ts                   # 完整中英精读章节、公式变量、基准对比与词典数据
```
