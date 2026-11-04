# 《Retriever-Free Retrieval: Navigating Documents with Decision Models》
## 免检索器的检索架构：利用决策模型在文档层级树中智能导航 (DecisionRAG)

> **论文编号**：arXiv:2610.35868  
> **论文 DOI**：[https://doi.org/10.48550/arXiv.2610.35868](https://doi.org/10.48550/arXiv.2610.35868)  
> **研究机构**：康奈尔大学 (Cornell University) & ASAPP Research  
> **作者**：Chao Wan (万超), Paul Jünger, Beixi Du (杜北希), Bodong Liu (刘博东), Navaneetha Krishnan, Kilian Q. Weinberger  
> **代码仓库**：[https://github.com/decisionrag/decision-rag](https://github.com/decisionrag/decision-rag)

---

### 📖 项目简介与背景

本项目是对 2026 年康奈尔大学与 ASAPP 联合发表的重磅 RAG 领域突破论文 **DecisionRAG** 的全中文精读、概念拆解与交互式探索系统。

在传统检索增强生成（RAG）系统中，存在一个致命缺陷——**『检索能力不对称性（The Retrieval Capability Asymmetry）』**：
- 下游的大语言模型（LLM）推理与理解能力日益强大，但上游的第一阶段检索器（如 BM25 词频统计或双编码器 Bi-Encoder 向量数据库）却非常脆弱。
- 向量数据库强行将数百字的内容压缩为一个固定维度的低维向量，在面对复杂约束、否定句或冷门术语时极易算错距离。
- **一旦上游检索器在第一阶段漏掉了正确文档，下游无论多么聪明的大模型也彻底无法恢复信息，只能被迫瞎编产生幻觉。**

**DecisionRAG 提出了颠覆性的全新范式：彻底抛弃传统第一阶段向量检索器（Retriever-Free）！**  
它将语料库按照人类知识的天然层级（领域 ➔ 文档 ➔ 章节 ➔ 段落）组织成一棵树，直接让预训练大语言模型像人类图书管理员一样，在树中沿着最有潜力的分支智能导航。

---

### ⚡ 核心技术创新点

1. **免检索器架构 (Retriever-Free)**
   - 彻底摆脱昂贵且脆弱的向量数据库（Vector DB）、Embedding 嵌入模型与近似最近邻（ANN/HNSW）索引。
   - 不再让低能力模型做第一步粗筛，直接由高智能的预训练语言模型亲自操盘导航决策。

2. **单步前向传播零 Token 打分 (Single Forward Pass, Zero-Token)**
   - 传统的智能体搜索（Agentic Search）需要逐字自回归吐出几百个词的思考过程，单次查询耗时 15 秒以上。
   - DecisionRAG 把同级选项拼在同一个 Prompt 中，**仅做 1 次神经网络前向计算**，直接读取词表中选项标识符（如 'A', 'B', 'C'）的未归一化对数概率（Logits），**生成 0 个冗余 Token**，几十毫秒即可完成一层决策！

3. **共享上下文横向对比 (Shared-Context Scoring)**
   - 双编码器（Bi-Encoder）最大的硬伤在于候选文档彼此独立计算内积，互相看不见。
   - DecisionRAG 将所有竞争分支置于同一个自注意力上下文窗口中，利用 Transformer 全注意力机制进行横向 PK，有效消除打分漂移与假阳性。

4. **束搜索剪枝 (Beam Search Navigation)**
   - 在树遍历中维护宽度为 $B$（如 $B=2$ 或 $3$）的活跃分支集合，防止单路径贪心因早期偶然歧义而误入死胡同，保证高召回率与容错率。

---

### 📊 权威基准测试战绩

在四大严苛基准（包括涵盖 **268 万维基百科段落**的 Natural Questions 开放域大库）上：
- **MultiDoc2Dial (复杂政府政策问答)**：Top-1 召回率 **Recall@1 飙升至 60.0%**，相比最强的工业组合（Dense + 8B 交叉重排器）提升高达 **+13.8 个百分点**！
- **Natural Questions (268万段维基全库)**：Top-1 命中率 **Hit@1 跃升至 71.0%**，相比 Dense + 8B Reranker 绝对提升 **+17.4 个百分点**！
- **检索速度实测**：端到端单次查询耗时稳定在 **0.7 ~ 1.8 秒**，完全满足高并发工业实时交互标准。
- **零样本开箱即用 (Zero-Shot)**：无需针对任何特定数据集进行微调。

---

### 💻 本系统包含的五大交互功能

1. **⚡ 5分钟速通导览（初学者友好）**：用通俗的生活化比喻（图书馆借书、医生与学徒、买西瓜等）拆解复杂学术概念，内置即测即练小问答。
2. **📖 论文全篇精读 & 深度解析**：支持【中文精译】、【双语对照】与【英文原版】自由切换，配有各章白话笔记、数学公式展开与核心学术洞察。
3. **🔬 分层决策导航实验台（在线模拟器）**：亲自动手输入查询，选择维基百科、IBM Cloud 技术文档或民生政策库，调整束宽（Beam Width），查看单步 Prompt 与 Logit 分数分布。
4. **📊 五大检索范式与基准全景矩阵**：横向对比 BM25、Dense 向量检索、两阶段 8B 重排器、Agentic 智能体搜索与 DecisionRAG，附真实典型失败用例解剖。
5. **📚 核心概念与技术术语大典**：提供“白话生活比喻 + 严谨技术定义 + 论文核心突破”三维解析。

---

### 🛠️ 快速启动与本地运行

```bash
# 1. 安装项目依赖
npm install

# 2. 启动本地开发服务器 (默认端口 3000)
npm run dev

# 3. 运行纯算法单元测试 (基于 Node.js 官方测试套件)
npx --yes tsx --test src/utils/treeNavigation.test.ts

# 4. 构建生产包
npm run build
```

---

### 📚 学术引用 (BibTeX)

```bibtex
@article{wan2026decisionrag,
  title={Retriever-Free Retrieval: Navigating Documents with Decision Models},
  author={Wan, Chao and J{\\"u}nger, Paul and Du, Beixi and Liu, Bodong and Krishnan, Navaneetha and Weinberger, Kilian Q.},
  journal={arXiv preprint arXiv:2610.35868},
  year={2026},
  doi={10.48550/arXiv.2610.35868}
}
```
