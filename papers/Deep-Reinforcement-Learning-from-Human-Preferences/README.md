# Deep Reinforcement Learning from Human Preferences（RLHF 奠基论文：基于人类偏好的深度强化学习与奖励模型训练范式）

> **论文原文**：*Deep Reinforcement Learning from Human Preferences*
> **作者与机构**：Paul F. Christiano, Jan Leike, Tom B. Brown, Miljan Martic, Shane Legg, Dario Amodei — OpenAI & DeepMind
> **发表会议/期刊**：NeurIPS 2017
> **论文标识**：[1706.03741](https://arxiv.org/abs/1706.03741) | [PDF 原文直链](https://arxiv.org/pdf/1706.03741.pdf)

---

## 一、核心痛点与颠覆性洞察

许多人类真正关心的复杂目标（如机器人动作协调、自然语言对话质量、安全价值观）无法用简单的数学代码写成奖励函数；若勉强设置代理指标（Proxy Reward），强化学习智能体会疯狂利用指标漏洞进行作弊（Reward Hacking，例如为了拿分在原地转圈而不通关）。

**核心破局思想**：
虽然人类写不出奖励函数公式，但人类一眼就能看出「A 和 B 两个结果哪个更好」！让神经网络 r̂_ψ 先通过拟合人类的「二选一偏好排行榜（Bradley-Terry 模型）」学会人类的审美与评判标准，再把这个训练好的奖励网络 r̂_ψ 当作虚拟裁判去指导强化学习策略（PPO/TRPO）进化。

$$\hat{P}[\sigma^1 \succ \sigma^2] = \frac{\exp\!\left(\sum_{t} \hat{r}(o_t^1, a_t^1)\right)}{\exp\!\left(\sum_{t} \hat{r}(o_t^1, a_t^1)\right) + \exp\!\left(\sum_{t} \hat{r}(o_t^2, a_t^2)\right)} = \sigma\!\left(\sum_t \hat{r}(\sigma^1) - \sum_t \hat{r}(\sigma^2)\right)$$

---

## 二、四大核心贡献与工业界拿走的东西

1. 开创现代 RLHF 三步走标准架构：(1) 策略 π 与环境交互生成成对轨迹片段 (σ¹, σ²)；(2) 人类标注员做二选一偏好判断；(3) 用 Bradley-Terry 似然拟合深度奖励模型 r̂ 并用 RL 优化策略 π
2. 洞察到「让人类直接给行为打绝对分数极不准确，但让人类在两个候选中选出哪个更好（Pairwise Comparison）极其可靠且低认知负担」
3. 引入奖励模型集成（Ensemble of Reward Predictors）评估预测不确定性，主动挑选方差最大的分歧样本请求人工标注（Active Query Selection）
4. 实证展示智能体仅凭 900 次人工点击（不足 1 小时人类时间），即可在零真实环境奖励下学会完美的 MuJoCo 机器人后空翻（Backflip）与 Atari 游戏通关

### 关键实证指标
- **人类反馈时间缩减**：`99.9% 缩减 (< 1小时)` —— 相比让人类直接逐帧标注数千小时，仅需 900 次点击即可收敛
- **无法编码任务突破**：`机器人完美后空翻` —— 无需编写任何物理角度公式，纯靠人类二选一点击学会高难特技
- **成对比较稳定性**：`零标度漂移 (Scale-Free)` —— 二选一相对排序彻底消除了不同标注员打分尺度不一致的噪音
- **历史传承地位**：`ChatGPT / Claude 之母` —— 作者团队随后将完全相同的框架迁移至 GPT-3 从而诞生 InstructGPT 与 ChatGPT

---

## 三、本文件夹目录结构

```text
papers/Deep-Reinforcement-Learning-from-Human-Preferences/
├── README.md                              # 本论文中文导读、核心公式与技术综述
└── src/
    ├── App.tsx                            # 论文独立交互主入口组件
    ├── components/
    │   └── RlhfPreferenceSimulator.tsx             # 基于 IndustrialPaperSimulator 的专属交互式算法实验台
    └── data/
        └── paperData.ts                   # 完整中英精读章节、公式变量、基准对比与词典数据
```
