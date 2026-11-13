# ReAct: Synergizing Reasoning and Acting in Language Models（ReAct 智能体奠基论文：在大语言模型中协同交织「思维链推理」与「外部环境行动」）

> **论文原文**：*ReAct: Synergizing Reasoning and Acting in Language Models*
> **作者与机构**：Shunyu Yao (姚顺雨), Jeffrey Zhao, Dian Yu, Nan Du, Izhak Shafran, Karthik Narasimhan, Yuan Cao — Princeton University & Google Research
> **发表会议/期刊**：ICLR 2023
> **论文标识**：[2210.03629](https://arxiv.org/abs/2210.03629) | [PDF 原文直链](https://arxiv.org/pdf/2210.03629.pdf)

---

## 一、核心痛点与颠覆性洞察

纯思维链（CoT）推理是一个与外部世界完全隔离的「开环静态黑盒」：它只能依赖预训练冻结的参数记忆，一旦遇到冷门事实或时效性信息就会一本正经地编造假事实，且一步算错步步错；而纯动作模型没有显式的中间子目标拆解，遇到搜索无结果时只能在原地死循环。

**核心破局思想**：
不要让大模型一口气在脑子里瞎猜到底，也不要让它盲目乱点工具！规定模型严格按照 `Thought -> Action -> Observation` 的节拍交替运行：先写一句 `Thought` 把大问题拆解成当前需要查证的小问题，再发出一道 `Action[Search/Lookup]` 去真实世界拿回 `Observation`，接着根据拿回的真实证据写下一句 `Thought` 决定下一步怎么走！

$$\hat{\mathcal{A}} = \mathcal{A} \cup \mathcal{L}, \qquad \pi(\hat{a}_t \mid c_t), \qquad c_{t+1} = \begin{cases} (c_t, \hat{a}_t) & \text{if } \hat{a}_t \in \mathcal{L} \;(\text{Internal Thought}) \\ (c_t, \hat{a}_t, o_t) & \text{if } \hat{a}_t \in \mathcal{A} \;(\text{External Action } \to o_t) \end{cases}$$

---

## 二、四大核心贡献与工业界拿走的东西

1. 洞察人类智能的本质是「内心独白（Inner Speech 推理规划）」与「外部实践（Acting 获取新知）」的紧密交织，首次在 LLM 中打通两者边界
2. 形式化定义扩充动作空间 Â = A ∪ L：当选择内部思考 c_t ∈ L 时不改变外部环境状态，仅将目标拆解、工作记忆与反思追加进上下文；当选择 a_t ∈ A 时触发外部 API 并接收真实 Observation o_t
3. 在知识密集型多跳问答（HotpotQA）与事实验证（FEVER）上，证明 ReAct 通过实时检索彻底消除了 CoT 高达 56% 的内部幻觉，且结合 CoT-SC 创下全新 SOTA
4. 在交互式决策环境（ALFWorld 家居具身任务与 WebShop 在线购物）中，仅凭 1~6 个上下文示例即比百倍样本训练的模仿学习/强化学习基线绝对成功率暴涨 34% 与 10%！

### 关键实证指标
- **ALFWorld 具身决策成功率**：`71.0% (+34% 绝对提升)` —— 远超 Act-Only (45%) 与 10³ 样本训练的强化学习 BUTLER (37%)
- **推理失败中的事实幻觉率**：`56% (CoT) ➔ 0% (ReAct)` —— 所有推理依据均严格锚定于外部 Observation 返回的真实文本
- **WebShop 真实网购成功率**：`40.0% (超人类专家 10% 差距内)` —— 比模仿学习 + 强化学习基线 (29.0%) 暴涨 11 个百分点
- **人类可解释性与可控性**：`支持实时编辑 Thought 干预` —— 人类只需修改一行中间 Thought 文本即可瞬间扭转智能体行为轨迹

---

## 三、本文件夹目录结构

```text
papers/ReAct-Synergizing-Reasoning-and-Acting-in-Language-Models/
├── README.md                              # 本论文中文导读、核心公式与技术综述
└── src/
    ├── App.tsx                            # 论文独立交互主入口组件
    ├── components/
    │   └── ReactAgentLoopSimulator.tsx             # 基于 IndustrialPaperSimulator 的专属交互式算法实验台
    └── data/
        └── paperData.ts                   # 完整中英精读章节、公式变量、基准对比与词典数据
```
