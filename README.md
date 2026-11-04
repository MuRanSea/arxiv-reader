# AI Paper Lab ｜ 顶级 AI 前沿论文精读与交互探索平台

> **项目定位**：面向前沿人工智能领域学术论文的沉浸式精读、概念通俗白话拆解与交互式算法实验台平台。  
> **核心架构理念**：**“主页统一大厅负责路由展示，一个论文一个独立子文件夹（One Paper, One Folder）”**，具备高扩展性与即插即用（Plug-and-Play）特性。

---

## 🏛️ 多论文平台架构设计

为了支持未来不断扩充海量顶级学术论文（涵盖 RAG、大模型架构、知识图谱、智能体 Agent、多模态视觉等各前沿方向），本项目采用模块化解耦架构：

```text
/                                                           # 根目录 (全局宿主与门户路由)
├── index.html                                              # 🌐 门户大厅入口 HTML (加载全局路由应用)
├── vite.config.ts                                          # ⚙️ Vite 全局构建与多路径配置
├── tsconfig.json                                           # ⚙️ TypeScript 全局路径映射配置
├── metadata.json                                           # ⚙️ 平台元数据与能力声明
├── package.json                                            # 📦 平台全局依赖与脚本
├── src/                                                    # 💻 全局门户代码
│   ├── App.tsx                                             # 🧭 路由调度器 (URL Hash 驱动切换大厅与各论文)
│   ├── main.tsx & index.css                                # 🎨 全局样式与挂载入口
│   └── portal/                                             # 🏛️ 论文大厅页面组件
│       └── PaperHub.tsx                                    # 论文展示卡片、分类筛选、检索与接入指引
│
└── papers/                                                 # 📁 论文核心仓库 (每个论文独立文件夹)
    ├── registry.ts                                         # 📋 全局论文注册中心 (所有论文元数据与路由登记)
    │
    ├── Retriever-Free-Retrieval-Navigating-Documents-with-Decision-Models/  # 📁 论文01 (DecisionRAG)
    │   ├── README.md                                       # 📄 该论文专属中文深度解析文档
    │   ├── index.html                                      # 🌐 该论文可脱机独立双击打开的网页
    │   ├── package.json                                    # 📦 该论文独立配置信息
    │   └── src/                                            # 💻 该论文交互全套系统源码
    │       ├── App.tsx                                     # 该论文系统主入口 (带“返回论文大厅”按钮)
    │       ├── components/                                 # 5 大功能组件 (导览、精读、实验台、对比表、词典)
    │       ├── data/                                       # 忠实中文全译、语料树预设与术语数据库
    │       └── utils/                                      # 纯算法仿真引擎与 Node.js 单元测试
    │
    ├── GraphRAG-Unifying-Retrieval-and-Knowledge-Graphs/   # 📁 论文02 (未来扩展示例)
    └── Tree-of-Thoughts-Deliberate-Problem-Solving/        # 📁 论文03 (未来扩展示例)
```

---

## 🚀 如何在本项目中新增一篇新论文？（极简 3 步接入指南）

想要扩充收录新的 AI 论文，仅需简单的 3 个步骤，完全无需修改既有论文的任何代码：

### 步骤 1：在 `papers/` 目录下创建论文专属文件夹
以论文英文标题命名文件夹（建议使用连字符连接）：
```bash
mkdir papers/Your-Paper-Title-Here
```

### 步骤 2：在该文件夹内放置论文模块三件套
- **`README.md`**：撰写该论文的中文精读、核心痛点、创新突破与实验结果分析。
- **`src/App.tsx`**：实现该论文的交互前端主界面。在组件入参中接收 `onBackToHub?: () => void`，在界面顶部放一个返回按钮：
  ```tsx
  export default function App({ onBackToHub }: { onBackToHub?: () => void }) {
    return (
      <div>
        <button onClick={onBackToHub}>🏛️ 返回论文大厅</button>
        {/* 论文内容与交互组件 */}
      </div>
    );
  }
  ```
- **`src/data/` & `src/utils/`**：放置论文中文翻译文本、测试语料库及算法仿真逻辑。

### 步骤 3：在 `papers/registry.ts` 中注册元数据
在 `REGISTERED_PAPERS` 数组中添加配置项即可：
```typescript
{
  id: 'your-paper-id',                                // 唯一路由标识 (如 hash: #/paper/your-paper-id)
  folderName: 'Your-Paper-Title-Here',                // 对应的文件夹名
  titleZh: '论文中文规范译名',
  titleEn: 'Original Paper Title in English',
  arxivId: 'arXiv:XXXX.XXXXX',
  doi: 'https://doi.org/...',
  authors: ['Author 1', 'Author 2'],
  affiliations: ['Institution Name'],
  publishDate: '2026年XX月',
  category: 'RAG与检索',                               // 分类标签：RAG与检索 / 大模型架构 / 智能体与推理 / 知识图谱
  tags: ['核心技术1', '核心技术2'],
  status: 'active',                                   // active (已上线) 或 coming-soon (规划中)
  tldrZh: '一句话白话概括该论文解决了什么问题、有哪些突破...',
  keyMetrics: [
    { label: '核心指标1', value: '98.5%', highlight: true }
  ],
  features: ['5分钟速通导览', '双语对照精读', '算法模拟器']
}
```
**完成！** 重新打开主页即可看到自动生成的论文卡片、标签过滤、搜索匹配，点击直接通过动态路由进入该论文的专属交互界面。

---

## 📖 当前收录重点论文：DecisionRAG (arXiv:2610.35868)

### 论文基本档案
- **论文原题**：*Retriever-Free Retrieval: Navigating Documents with Decision Models*
- **中文译名**：免检索器的检索架构：利用决策模型在文档层级树中智能导航
- **作者阵容**：Chao Wan (万超), Paul Jünger, Beixi Du (杜北希), Bodong Liu (刘博东), Navaneetha Krishnan, Kilian Q. Weinberger
- **研究机构**：康奈尔大学计算机系 (Cornell University) & ASAPP Research
- **论文 DOI**：[https://doi.org/10.48550/arXiv.2610.35868](https://doi.org/10.48550/arXiv.2610.35868)
- **代码仓库**：[https://github.com/decisionrag/decision-rag](https://github.com/decisionrag/decision-rag)
- **所在目录**：[`papers/Retriever-Free-Retrieval-Navigating-Documents-with-Decision-Models/`](./papers/Retriever-Free-Retrieval-Navigating-Documents-with-Decision-Models/)

---

### 💡 核心痛点白话拆解：什么是『检索能力不对称性』？

传统 RAG 普遍将流程生硬切分为“检索器（双编码器向量检索 / BM25）”和“生成模型（LLM）”两个阶段：
1. **致命短板**：下游的 LLM 越来越聪明（具备复杂推断与上下文理解能力），但上游负责第一道防线的向量检索器仍旧停留在将整段复杂文字强行压缩为一串低维浮点数（如 768 维向量），遇到否定句、多重约束条件或冷门专业词时极易算错余弦距离。
2. **不可挽回的漏检**：一旦上游检索器在第一阶段（粗筛 Top-100）漏掉了真实目标文档，下游无论大模型多么聪明（甚至接入 8B 交叉重排器），也无法“凭空变出”未被召回的上下文，最终只能无奈产生幻觉或胡说八道。
3. **生活化比喻**：就像请了一位博学多才的诺贝尔医学奖教授主刀手术，却派了一个分不清手术刀和剪刀的学徒去器械室拿工具。学徒拿错了工具，主刀教授医术再高也只能望洋兴叹。

---

### ⚡ DecisionRAG 的四大革命性技术突破

1. **彻底免除第一阶段检索器（Retriever-Free）**
   - 彻底淘汰向量数据库（Vector DB）、Embedding 向量模型与高昂的 ANN/HNSW 索引维护成本。
   - 不再让低能力模型做第一步粗筛，直接赋能通用预训练大模型亲自担任领航员。
2. **单步前向传播零 Token 生成（Zero-Token Forward Pass）**
   - 传统的智能体搜索（Agentic Search）需要逐字自回归吐出几百个词的思考过程，单次查询耗时 15 秒以上。
   - DecisionRAG 在每个层级将所有候选分支拼入同一个 Prompt 中，**仅执行 1 次神经网络前向计算**，直接读取词表中选项标识符（如 'A', 'B', 'C'）的未归一化对数概率（Logits），**生成 0 个冗余 Token**，几十毫秒即可完成一层决策！
3. **共享上下文横向对比（Shared-Context Scoring）**
   - 传统双编码器（Bi-Encoder）最大的硬伤在于候选文档彼此独立计算内积，互相看不见。
   - DecisionRAG 将所有竞争分支置于同一个自注意力上下文窗口中，利用 Transformer 全注意力机制进行横向 PK，有效消除打分漂移与假阳性。
4. **图书馆层级树导航（Hierarchical Tree Navigation & Beam Search）**
   - 现实知识天然具备层级拓扑（领域 ➔ 文档 ➔ 章节 ➔ 段落）。
   - 配合束搜索（Beam Search，束宽 $B=2$ 或 $3$），逐层剪枝，将原本浩瀚的段落检索复杂度从线性 $\mathcal{O}(N)$ 降至对数级 $\mathcal{O}(\log N)$。

---

### 📊 权威基准测试战绩

在涵盖 **268 万维基百科段落**在内的四大严苛基准上：
- **MultiDoc2Dial (复杂政府政策问答)**：Top-1 召回率 **Recall@1 飙升至 60.0%**，相比最强工业基线（Dense + 8B 交叉重排器）提升高达 **+13.8 个百分点**！
- **Natural Questions (268万段维基全库)**：Top-1 命中率 **Hit@1 跃升至 71.0%**，相比 Dense + 8B Reranker 绝对提升 **+17.4 个百分点**！
- **检索速度实测**：端到端单次查询耗时稳定在 **0.7 ~ 1.8 秒**，完全满足高并发工业实时交互标准。
- **零样本开箱即用 (Zero-Shot)**：无需针对任何特定数据集进行微调。

---

### 💻 DecisionRAG 系统内包含的 5 大交互模块

1. **⚡ 5分钟通俗速通导览**：初学者友好图文指南，配合生活化比喻与互动自测小问答。
2. **📖 全文精读 & 双语对照**：完整忠实中文全译，支持中文、双语对照、英文原版三档切换，附白话笔记卡片与数学推导。
3. **🔬 分层决策导航实验台**：在线输入查询，观察决策模型在维基百科、IBM Cloud 或政策库中单步前向传播、Logit 分布与束搜索剪枝过程。
4. **📊 五大检索范式基准对比**：横向对比 BM25、Dense 向量、8B 重排器、Agentic 搜索与 DecisionRAG，剖析真实失败用例。
5. **📚 核心概念双解词典**：生活比喻 + 严谨技术定义 + 论文核心创新三重解析。

---

## 🛠️ 本地开发与运行指南

```bash
# 1. 安装项目依赖
npm install

# 2. 启动本地全栈交互大厅 (默认端口 3000)
npm run dev

# 3. 运行纯算法逻辑单元测试 (基于 Node.js 官方测试套件)
npx --yes tsx --test papers/Retriever-Free-Retrieval-Navigating-Documents-with-Decision-Models/src/utils/treeNavigation.test.ts

# 4. 构建生产部署包
npm run build
```

---

## 📚 学术引用格式 (BibTeX)

```bibtex
@article{wan2026decisionrag,
  title={Retriever-Free Retrieval: Navigating Documents with Decision Models},
  author={Wan, Chao and J{\\"u}nger, Paul and Du, Beixi and Liu, Bodong and Krishnan, Navaneetha and Weinberger, Kilian Q.},
  journal={arXiv preprint arXiv:2610.35868},
  year={2026},
  doi={10.48550/arXiv.2610.35868}
}
```
