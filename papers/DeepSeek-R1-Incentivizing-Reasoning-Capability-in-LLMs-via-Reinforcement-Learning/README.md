# DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning（DeepSeek-R1 强化学习推理大模型：纯组相对策略优化 (GRPO) 激发长思维链顿悟涌现）

> **论文原文**：*DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning*
> **作者与机构**：DeepSeek-AI (深度求索) — arXiv 2025 (同步涵盖核心算法基石 DeepSeekMath GRPO 2402.03300)
> **发表会议/期刊**：Foundational Paper
> **论文标识**：[2501.12948](https://arxiv.org/abs/2501.12948) | [PDF 原文直链](https://arxiv.org/pdf/2501.12948.pdf)

---

## 一、核心痛点与颠覆性洞察

传统 PPO 强化学习需要维护一个与主模型（如 671B）完全同尺寸的 Critic（Value）价值模型来估计每个位置的基线收益，在长思维链（动辄上万 Token）场景下显存爆炸且价值估计极不准确；同时若用神经网络奖励模型给推理过程打分，模型在大规模 RL 中必然学会套路化作弊（Reward Hacking）导致崩溃。

**核心破局思想**：
第一，扔掉 Critic 价值网络，改用 GRPO「同行衬托法」：对同一道数学或代码题，让模型一口气生成 G=16 个候选解答，直接算这 16 个解答的平均分和标准差——比平均分高的就是正优势（鼓励），比平均分低的就是负优势（抑制）！第二，只看客观结果（答案对不对/代码通不通），绝不教模型「该怎么想」：把思考过程关进 `<think>...</think>` 沙盒里让模型自己在强化学习压力下自由进化，模型为了算对难题会自动学会「多想几千个词、算错了推倒重来」！

$$\mathcal{J}_{\text{GRPO}}(\theta) = \mathbb{E}_{q,\, \{o_i\}_{i=1}^G \sim \pi_{\theta_{\text{old}}}} \left[ \frac{1}{G} \sum_{i=1}^G \left( \min\!\left( \rho_i A_i,\; \text{clip}(\rho_i, 1-\epsilon, 1+\epsilon) A_i \right) - \beta \,\mathbb{D}_{\text{KL}}(\pi_\theta \| \pi_{\text{ref}}) \right) \right], \quad A_i = \frac{r_i - \text{mean}(\{r_1,\dots,r_G\})}{\text{std}(\{r_1,\dots,r_G\})}$$

---

## 二、四大核心贡献与工业界拿走的东西

1. 提出 DeepSeek-R1-Zero 纯强化学习范式：首次证明无需任何人工标注的思维链 SFT 数据，仅靠大规模规则强化学习（RL）即可从零激发大模型的长链推理、自我反思与回溯验证能力
2. 采用并规模化验证 GRPO（Group Relative Policy Optimization，源自 2402.03300）：对每个问题采样一组 G 个输出 {o_1, ..., o_G}，直接以组内奖励均值与标准差计算优势 A_i = (r_i - mean(r))/std(r)，彻底砍掉占一半显存与算力的 Critic 价值模型
3. 摒弃极易被钻空子（Reward Hacking）的神经网络过程奖励模型（Neural PRM），仅采用百分之百客观的「规则验证奖励（数学答案匹配 + 代码编译通过 + `<think>` 标签格式奖励）」驱动稳定长程进化
4. 构建完整的四阶段 DeepSeek-R1 工业流水线（数千条冷启动长 CoT SFT → 面向推理的 GRPO → 拒绝采样合成 + 通用数据混合 SFT → 全场景对齐 RL），并将长链推理能力成功蒸馏至 1.5B~70B 小模型（刷新全部同尺寸世界纪录）

### 关键实证指标
- **AIME 2024 奥数竞赛得分**：`15.6% ➔ 79.8% (超o1)` —— R1-Zero 纯 RL 狂飙至 71.0% (cons@64 达 86.7%)，R1 正式版达 79.8%
- **MATH-500 数学基准准确率**：`97.3% (全球顶级)` —— 正面追平并略超 OpenAI o1-1217 正式版 (96.4%)
- **RL 价值网络 (Critic) 显存**：`100% 砍除 (0 GB)` —— GRPO 用组内均值基线彻底淘汰与主模型等大的 Critic 网络
- **小模型蒸馏越级突破**：`32B 超越 o1-mini` —— R1-Distill-Qwen-32B 在 AIME 斩获 72.6%，远超小模型自己跑 RL

---

## 三、本文件夹目录结构

```text
papers/DeepSeek-R1-Incentivizing-Reasoning-Capability-in-LLMs-via-Reinforcement-Learning/
├── README.md                              # 本论文中文导读、核心公式与技术综述
└── src/
    ├── App.tsx                            # 论文独立交互主入口组件
    ├── components/
    │   └── DeepSeekR1GrpoSimulator.tsx             # 基于 IndustrialPaperSimulator 的专属交互式算法实验台
    └── data/
        └── paperData.ts                   # 完整中英精读章节、公式变量、基准对比与词典数据
```
