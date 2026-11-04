export interface GlossaryTerm {
  id: string;
  termZh: string;
  termEn: string;
  category: 'RAG基础' | '模型与注意力' | '算法与搜索' | '评测与指标';
  summary: string;
  analogy: string; // 初学者通俗比喻
  technicalDetail: string; // 严谨技术定义
  decisionRagApplication: string; // 在 DecisionRAG 中的具体运用
  formula?: string;
  relatedIds: string[];
}

export const GLOSSARY_ITEMS: GlossaryTerm[] = [
  {
    id: 'retrieval-asymmetry',
    termZh: '检索能力不对称性',
    termEn: 'Retrieval Capability Asymmetry',
    category: 'RAG基础',
    summary: '下游文本生成模型能力越来越强，而上游检索器仍停留在死板的向量距离计算，导致下游被上游严重拖累的现象。',
    analogy: '好比你请了一位博学多才的诺贝尔奖得主（下游LLM）做顾问，但他只能读图书管理员（传统向量检索）塞给他的三页纸。如果管理员找错了书，这位教授学问再高也只能胡说八道。',
    technicalDetail: '传统 RAG 管道中，检索阶段主要依靠浅层双编码器（Bi-Encoder）或 BM25 词频统计，它们对复杂逻辑、否定句、长依赖语义理解极弱。若召回阶段排除了关键文档，生成模型在后续上下文处理中无论多强大也无法“隔空取物”。',
    decisionRagApplication: 'DecisionRAG 打破这种不对称，直接让高智能的预训练语言模型亲自扮演“决策检索者”，将大模型的深层语义理解能力直接带入检索第一线。',
    relatedIds: ['bi-encoder', 'cross-encoder', 'rag']
  },
  {
    id: 'decision-model',
    termZh: '决策模型',
    termEn: 'Decision Model',
    category: '模型与注意力',
    summary: '在层级树的每个岔路口，利用预训练语言模型的概率分布来决定选择哪一条最有潜力的探索分支。',
    analogy: '就像商场里的智能向导，站在每一层自动扶梯口，看一眼你的需求清单，然后果断指出“请前往3楼数码专区”，而不是让你在整个大楼的所有货架盲目漫游。',
    technicalDetail: 'DecisionRAG 直接使用现有的通用预训练语言模型（如 Llama-3、Mistral 等），将其输出层在特定候选标记（如选项字母 A、B、C）上的未归一化对数概率（Logits）作为分支价值评估函数，无需重新训练判别器。',
    decisionRagApplication: '作为系统核心引擎，在树遍历的每一级输入查询和候选子节点，一步输出所有子分支的相关性打分。',
    relatedIds: ['logits', 'forward-pass', 'shared-context']
  },
  {
    id: 'forward-pass',
    termZh: '单次前向传播 (零Token生成)',
    termEn: 'Single Forward Pass (Zero-Token Generation)',
    category: '模型与注意力',
    summary: '只进行一次神经网络的前向计算获取预测打分，完全不需要逐字逐句自回归输出文本，极大地降低延迟与计算消耗。',
    analogy: '做单选题时，你心里瞬间选定了“C”，甚至无需在草稿纸上写出完整解答过程，用时不到0.1秒；而传统智能体需要写下长篇大论的“思考与行动链”，慢了数十倍。',
    technicalDetail: '自回归生成文本需要反复执行 $K$ 次前向传播（每次生成一个 token，计算开销与显存访问成正比）。DecisionRAG 仅执行一次前向计算即可提取所有候选分支的输出层 Logits，时间复杂度仅为 $\\mathcal{O}(1)$ 次前向传播。',
    decisionRagApplication: '使得 DecisionRAG 能够将包含数百万维基百科段落的大规模语料库检索时间压缩到 0.7~1.8 秒，与传统向量检索同一数量级，远快于智能体生成式检索。',
    formula: 'T_{\\text{forward}} = 1 \\ll T_{\\text{autoregressive}} = N_{\\text{tokens}} \\times T_{\\text{step}}',
    relatedIds: ['logits', 'decision-model']
  },
  {
    id: 'shared-context',
    termZh: '共享上下文相关性打分',
    termEn: 'Shared-Context Scoring',
    category: '模型与注意力',
    summary: '将所有竞争候选分支放在同一个注意力上下文窗口中一起打分，实现分支间的横向对比与竞争。',
    analogy: '正如大学面试时，面试官把同一组的候选人召集在同一个圆桌进行无领导小组讨论，一眼就能看出谁的表现更契合主题；而传统的向量检索是把每个候选人单独关在黑盒子里给出一个静态分数，无法感知对手的强弱。',
    technicalDetail: '双编码器（Bi-Encoder）独立计算 $E(q)$ 与各个 $E(d_i)$ 的余弦相似度，彼此互不可见，极易被表面高频词误导。共享上下文利用 Transformer 全注意力机制，在注意力矩阵中计算 $\\text{Softmax}(QK^T/\\sqrt{d})$，让所有候选分支相互感知彼此的差异点。',
    decisionRagApplication: '这是 DecisionRAG 超越 8B 交叉重排器（Cross-Encoder）的关键机理：它不仅看到查询与单文档的关系，更在同级所有兄弟分支间进行了全局校准与相对优势衡量。',
    relatedIds: ['bi-encoder', 'cross-encoder']
  },
  {
    id: 'beam-search',
    termZh: '束搜索 / 集束搜索',
    termEn: 'Beam Search',
    category: '算法与搜索',
    summary: '在树形搜索空间中，每一步保留得分最高的 $B$ 个最具潜力的分支（$B$ 为束宽），兼顾了搜索速度与防止遗漏。',
    analogy: '好比侦探破案，在每一个线索分叉口，既不是只跟着直觉死磕一条路（贪心单路走到底可能误入歧途），也不是把所有可能穷举一遍（累死侦探），而是始终派两三组人马沿着最可疑的线索并进。',
    technicalDetail: '在树遍历中，如果束宽 $B=1$，则是贪心搜索；如果 $B=2$ 或 $3$，在每一层由模型给出候选分支的概率分布，挑选前 $B$ 个最优节点继续向下展开。时间复杂度为 $\\mathcal{O}(B \\cdot d \\cdot C)$，其中 $d$ 为树深度，$C$ 为子分支数量。',
    decisionRagApplication: '使得系统在面对模糊或多意图查询时，即使第一层略有歧义，也能通过第2条备选路径顺利找回正确章节，大幅提升 Recall@1 和 Hit@1。',
    relatedIds: ['tree-hierarchy', 'decision-model']
  },
  {
    id: 'tree-hierarchy',
    termZh: '文档层级结构树',
    termEn: 'Corpus Document Hierarchy',
    category: 'RAG基础',
    summary: '把语料库组织成“主题领域 $\\rightarrow$ 文档 $\\rightarrow$ 章节 $\\rightarrow$ 段落”的天然多层树状图，替代扁平的无序向量堆。',
    analogy: '电脑操作系统的文件目录树：`C盘 -> 用户文件夹 -> 项目工程 -> 源代码.tsx`，任何文件都有清晰归属，找文件顺藤摸瓜，而不是把硬盘里所有文字混成一个巨大的杂物箱。',
    technicalDetail: '无论是技术文档（拥有天然的 H1/H2/H3 目录树）、政策法规（篇、章、条、款）还是维基百科（门类、条目、子章节），现实知识本身即具备高度的层级结构。利用树状拓扑，可以将 $N$ 个段落的搜索空间从线性 $\\mathcal{O}(N)$ 缩减为对数级 $\\mathcal{O}(\\log N)$。',
    decisionRagApplication: 'DecisionRAG 彻底摒弃了扁平向量库（Vector DB），直接以天然或自适应抽取的层级树作为检索空间，免除向量嵌入离线生成与更新维护的巨大负担。',
    relatedIds: ['beam-search', 'rag']
  },
  {
    id: 'bi-encoder',
    termZh: '双编码器 / 稠密检索器',
    termEn: 'Bi-Encoder / Dense Retriever',
    category: 'RAG基础',
    summary: '将查询和文档分别送入两个独立的编码网络，各自压缩成固定维度的数学向量，最后用向量内积计算相似度。',
    analogy: '两个人分别戴着耳机做自我介绍，中间没有任何交流，最后单凭两张卡片上的数字算出一个距离。',
    technicalDetail: '例如 DPR、Contriever、BGE-embedding。优点是文档向量可以提前离线计算并建索引（如 FAISS/HNSW），在线查询时计算余弦距离非常快（微秒级）。致命缺点是：将几百字的复杂语义硬塞进 1024 维向量，丢失了深层语义相互作用，无法处理精细推断。',
    decisionRagApplication: 'DecisionRAG 旨在淘汰传统第一阶段双编码器，证明无需向量化、无需索引库，直接依靠语言模型即可完成更高质量的定位。',
    relatedIds: ['cross-encoder', 'retrieval-asymmetry']
  },
  {
    id: 'cross-encoder',
    termZh: '交叉编码重排器',
    termEn: 'Cross-Encoder Reranker',
    category: '模型与注意力',
    summary: '将查询与单个文档拼在一起输入模型，利用全交叉注意力计算两者的精细匹配度。通常作为两阶段检索的第二步。',
    analogy: 'HR 拿到筛选后的前 20 份简历，坐下来逐一仔细面试每一位候选人，但每次只面一个人，最后给每个人打一个综合分。',
    technicalDetail: '如 Cohere Rerank、BGE-Reranker-Large（8B）。精准度远超双编码器，但计算开销巨大，无法扫描全库，只能作为初检（Top-100）后的重排器。若初检漏了正确文档，重排器根本没有机会见到它。',
    decisionRagApplication: '实验表明，DecisionRAG 的检索精度在无任务微调的情况下，直接超越了最顶尖的 8B 交叉重排器（MultiDoc2Dial 上 R@1 领先 13.8 点）。',
    relatedIds: ['bi-encoder', 'retrieval-asymmetry']
  },
  {
    id: 'logits',
    termZh: '未归一化对数概率 (Logits)',
    termEn: 'Raw Logits',
    category: '模型与注意力',
    summary: '语言模型在输出 Softmax 之前最后一层的原始预测分数，直接反映了模型对特定 Token 的信心倾向。',
    analogy: '评委在心中给每个选手的原始打分（如 98 分、85 分、70 分），在折算成百分比之前最具区分度的纯数值。',
    technicalDetail: '在 Transformer 的语言建模头（LM Head）中，输出特征向量与词表权重矩阵相乘得到 $z = W h \\in \\mathbb{R}^{|V|}$。DecisionRAG 提取候选选项对应 token（例如 \'A\', \'B\', \'C\'）的 $z_i$，通过 Softmax 即可得到候选分支的相对优胜概率。',
    decisionRagApplication: 'DecisionRAG 仅需单步读取 Logits 即可判定分支偏好，彻底避开耗时的 Token 采样与文本解码环节。',
    formula: 'P(\\text{Branch}_i \\mid q) = \\frac{\\exp(z_i)}{\\sum_{j \\in \\text{Candidates}} \\exp(z_j)}',
    relatedIds: ['forward-pass', 'decision-model']
  },
  {
    id: 'recall-at-1',
    termZh: 'Top-1 召回率 (R@1 / Recall@1)',
    termEn: 'Recall at 1 (R@1)',
    category: '评测与指标',
    summary: '检索系统返回的排名第 1 的文档中，包含真实答案所需段落的测试样本百分比。',
    analogy: '射箭比赛第一箭就直接正中靶心的比例。第一发就命中，下游 LLM 回答正确的成功率最高。',
    technicalDetail: '在问答和对话检索任务中，R@1 是衡量检索系统最苛刻、最重要的指标。传统密集检索配合 8B 重排器在 MultiDoc2Dial 上约为 46.2%，而 DecisionRAG 跃升至 60.0%（提升达 +13.8 个百分点）。',
    decisionRagApplication: '衡量 DecisionRAG 第一阶段直接检索能力的决定性指标。',
    relatedIds: ['hit-at-1']
  },
  {
    id: 'hit-at-1',
    termZh: 'Top-1 命中率 (Hit@1)',
    termEn: 'Hit at 1 (Hit@1)',
    category: '评测与指标',
    summary: '在海量知识库（如 268 万维基百科段落）中，检索系统挑出的最顶层第 1 个段落恰好包含正确答案的概率。',
    analogy: '从数百万页的大百科全书中一枪命中目标段落的概率。',
    technicalDetail: '在 Natural Questions 开放域问答检索测试中，DecisionRAG 凭借逐层精准收敛，Hit@1 相比经典 Dense+8B Reranker 架构提升了惊人的 +17.4 个百分点。',
    decisionRagApplication: '证明层级决策树模型在超大规模开卷语料下，具备抵御假阳性噪音的非凡辨别力。',
    relatedIds: ['recall-at-1']
  }
];
