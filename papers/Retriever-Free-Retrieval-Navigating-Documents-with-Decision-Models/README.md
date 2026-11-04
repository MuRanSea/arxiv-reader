# 📘 《Retriever-Free Retrieval: Navigating Documents with Decision Models》
## 免检索器的检索架构：利用决策模型在文档层级树中智能导航 (DecisionRAG)

> **所属平台**：[AI Paper Lab 论文探索大厅](../../README.md)  
> **论文编号**：arXiv:2610.35868  
> **论文 DOI**：[https://doi.org/10.48550/arXiv.2610.35868](https://doi.org/10.48550/arXiv.2610.35868)  
> **研究机构**：康奈尔大学 (Cornell University) & ASAPP Research  
> **作者团队**：Chao Wan (万超), Paul Jünger, Beixi Du (杜北希), Bodong Liu (刘博东), Navaneetha Krishnan, Kilian Q. Weinberger  
> **开源仓库**：[https://github.com/decisionrag/decision-rag](https://github.com/decisionrag/decision-rag)

---

## 🎯 一句话核心总结 (TL;DR)

**DecisionRAG 彻底终结了“先用向量数据库粗筛 Top-100、再用大模型重排”的传统两阶段 RAG 管线。**  
它不再将文档切碎压缩成死板的低维向量，而是保留知识的天然层级结构（领域 ➔ 文档 ➔ 章节 ➔ 段落），直接指派预训练大语言模型扮演“图书管理员”，通过**单次前向传播（零 Token 生成）+ 共享上下文横向对比 + 束搜索（Beam Search）**在树中自顶向下导航。在无需特定任务微调的情况下，不仅检索延迟稳定在 **0.7 ~ 1.8 秒**，而且在 MultiDoc2Dial 和 268 万段落的 Natural Questions 上分别以 **+13.8 点 R@1** 和 **+17.4 点 Hit@1** 的优势全面超越“稠密检索 + 8B 交叉重排器”！

---

## 🔍 为什么需要 DecisionRAG？（通俗痛点剖析）

### 1. 传统 RAG 的阿喀琉斯之踵：『检索能力不对称性 (Capability Asymmetry)』
- **现象**：下游负责生成回答的 LLM（如 GPT-4、Llama-3-70B）推理能力突飞猛进，但上游负责找资料的第一阶段检索器仍然停留在词频统计（BM25）或双编码向量余弦距离（Bi-Encoder）。
- **死结**：将几百字的复杂规则、转折、否定或适用前提强行压缩进一个 768/1024 维的固定向量，必然丢失关键细节。一旦第一阶段检索器漏掉了正确段落（例如排在了第 101 名之外），下游哪怕接入再强大的重排器（Reranker）或生成模型，也**巧妇难为无米之炊**，只能被迫产生幻觉。
- **生活比喻**：这就好比请了一位诺贝尔医学奖得主主刀高难度手术，却派了一个分不清手术刀和剪刀的学徒去取器械——学徒一旦拿错，名医也无力回天。

### 2. 智能体搜索（Agentic Search）为什么无法替代底层检索？
- 虽然让 Agent 循环调用搜索工具、逐页阅读并自我反思可以提高准确率，但 Agent 需要逐字自回归生成几百个思考 Token，单次查询往往耗时 **15 秒甚至数分钟**，算力成本与延迟难以承受。

---

## ⚡ DecisionRAG 的四大核心技术支柱

| 核心支柱 | 传统方案做法 | DecisionRAG 创新机制 | 带来的直接收益 |
| :--- | :--- | :--- | :--- |
| **1. 图书馆层级树导航**<br>*(Hierarchical Tree)* | 将所有文章切碎成扁平无序的 512-token 向量块 | 复原“领域 ➔ 文档 ➔ 章节 ➔ 段落”天然目录树或聚类树 | 搜索空间从线性 $\mathcal{O}(N)$ 骤降至对数级 $\mathcal{O}(\log N)$，无需维护庞大向量库 |
| **2. 单步前向零 Token 打分**<br>*(Zero-Token Forward Pass)* | Agent 需逐字吐出数百个思考 Token（数百次前向传播） | 每层仅做 **1 次前向传播**，直接提取选项字母（A/B/C）的原始 **Logits** | 彻底规避自回归解码开销，268万段落检索仅需 **0.7 ~ 1.8 秒** |
| **3. 共享上下文横向对比**<br>*(Shared-Context Scoring)* | 双编码器将各文档关在“小黑屋”独立算余弦距离，互不可见 | 同层所有候选分支放入同一注意力窗口，通过全自注意力横向 PK | 消除打分基准漂移，经 Softmax 归一化后各分支概率直接可比 |
| **4. 束搜索容错剪枝**<br>*(Beam Search Exploration)* | 单路径贪心一旦首层微弱误判即全盘皆输 | 每层保留得分最高的 $B$ 个（如 $B=2, 3$）活跃分支并行下钻 | 大幅提升模糊或跨领域查询下的召回率与鲁棒性 |

### 核心打分公式

在树的每一层，给定用户查询 $q$ 与同级候选分支集合 $\mathcal{C} = \{c_1, c_2, \dots, c_K\}$，模型在单次前向传播中提取各候选标识符 Token 的未归一化对数概率 $z_i$，并通过 Softmax 计算相对胜出概率：

$$P(c_i \mid q, \mathcal{C}) = \frac{\exp(z_i)}{\sum_{j=1}^{K} \exp(z_j)}$$

---

## 📊 四大权威基准测试表现

| 检索范式 / 模型 | MultiDoc2Dial (R@1) | Natural Questions 268万段 (Hit@1) | 平均查询延迟 | 是否依赖向量索引 | 生成 Token 消耗 |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **BM25 (词法倒排)** | 22.4% | 31.2% | ~0.12s | 否 | 0 |
| **Dense Bi-Encoder (Contriever/DPR)** | 34.8% | 42.1% | ~0.28s | 是 (高显存/内存) | 0 |
| **Dense + 8B Cross-Encoder Reranker** | 46.2% | 53.6% | ~2.45s | 是 (向量库+8B重排) | 0 |
| **Agentic Search (ReAct 多轮生成)** | 49.0% | 58.2% | ~14.8s | 否 | 450+ Tokens |
| **🌟 DecisionRAG (本文方案)** | **60.0% (+13.8%)** | **71.0% (+17.4%)** | **0.7s ~ 1.8s** | **否 (免向量库)** | **0 Tokens** |

---

## 💻 本目录代码结构与五大交互模块

```text
papers/Retriever-Free-Retrieval-Navigating-Documents-with-Decision-Models/
├── README.md                         # 本文档：论文核心机理解析与模块说明
├── index.html                        # 独立入口 HTML
├── package.json                      # 子模块包描述与测试脚本
└── src/
    ├── App.tsx                       # 论文主组件 (支持返回大厅与双套主题切换)
    ├── components/
    │   ├── Header.tsx                # 顶部导航栏 (含亮色/暗色模式切换、字号调节、语种切换、搜索框)
    │   ├── BeginnerGuide.tsx         # [模块1] 5分钟通俗图文导览 + 3道互动自测题
    │   ├── PaperReader.tsx           # [模块2] 全文7章深度译本 (支持中文/双语对照/英文 + 白话笔记折叠框)
    │   ├── NavigationSimulator.tsx   # [模块3] 分层决策导航实验台 (可调 Beam Width、检查单步 Prompt 与 Logits)
    │   ├── ComparisonMatrix.tsx      # [模块4] 五大范式基准对比柱状图 + 真实翻车案例解剖
    │   └── GlossaryView.tsx          # [模块5] 11个核心术语双解词典 (大白话比喻 + 严谨定义 + 数学公式)
    ├── data/
    │   ├── paperContent.ts           # 论文元数据與 7 大章节完整译文
    │   ├── mockTreeCorpus.ts         # 三套真实场景层级语料树 (维基百科 NQ / IBM Cloud / 政府医保政策)
    │   └── glossary.ts               # 结构化术语词条数据
    └── utils/
        ├── treeNavigation.ts         # 纯函数算法：分支亲和度计算、Softmax 归一化、Beam Search 树遍历
        └── treeNavigation.test.ts    # 单元测试套件 (验证 Logits、Softmax 与零 Token 树导航准确性)
```
