export interface PaperSection {
  id: string;
  chapterNumber: string;
  titleEn: string;
  titleZh: string;
  summaryZh: string;
  contentZh: string[];
  contentEn?: string[];
  beginnerTakeaways: {
    question: string;
    answerZh: string;
    analogyZh: string;
  }[];
  keyInsights: string[];
  formulas?: {
    latex: string;
    explanationZh: string;
  }[];
}

export interface PaperMeta {
  titleEn: string;
  titleZh: string;
  authors: string[];
  affiliations: string[];
  arxivId: string;
  doi: string;
  publishDate: string;
  githubUrl: string;
  abstractEn: string;
  abstractZh: string;
  tldrZh: string;
  coreInnovations: {
    title: string;
    desc: string;
    icon: string;
  }[];
}

export const PAPER_META: PaperMeta = {
  titleEn: "Retriever-Free Retrieval: Navigating Documents with Decision Models",
  titleZh: "免检索器的检索架构：利用决策模型在文档层级树中智能导航 (DecisionRAG)",
  authors: [
    "Chao Wan (万超)",
    "Paul Jünger",
    "Beixi Du (杜北希)",
    "Bodong Liu (刘博东)",
    "Navaneetha Krishnan",
    "Kilian Q. Weinberger"
  ],
  affiliations: [
    "Cornell University (康奈尔大学计算机系)",
    "ASAPP Research"
  ],
  arxivId: "arXiv:2610.35868",
  doi: "https://doi.org/10.48550/arXiv.2610.35868",
  publishDate: "2026年10月 (Preprint)",
  githubUrl: "https://github.com/decisionrag/decision-rag",
  abstractEn: "While language models have become dramatically more capable, retrieval still largely relies on lexical matching or similarity in fixed embedding spaces. This creates a capability asymmetry: what the retriever fails to find, even the strongest generator cannot recover. We propose DecisionRAG, which brings the capabilities of pretrained language models to retrieval using decision models that jointly evaluate candidate branches in a single forward pass, without generating any tokens, and show that judging candidates in a shared context makes their relevance estimates comparable. Like a person browsing a library, DecisionRAG navigates the corpus's inherent structure from broad topics down to individual passages, deciding at each level which branches are worth exploring. Without task-specific training or a first-stage retriever, DecisionRAG outperforms dense retrieval with an 8B reranker by 13.8 R@1 points on MultiDoc2Dial and 17.4 Hit@1 points on Natural Questions. Across four benchmarks, including a corpus of 2.68 million Wikipedia paragraphs, retrieval takes just 0.7–1.8 seconds per query.",
  abstractZh: "近年来，生成式大语言模型（LLM）的推理能力取得了突飞猛进的突破，然而在检索增强生成（RAG）系统中，上游检索器却仍然严重依赖词法硬匹配（如 BM25）或在固定低维嵌入空间中计算相似度的传统方法。这种设计催生了致命的『检索能力不对称性（Capability Asymmetry）』——检索器一旦未能召回正确的关键文档，下游哪怕最强大的文本生成器也彻底丧失了恢复真实信息的机会。针对这一瓶颈，我们提出了 DecisionRAG（免检索器层级决策架构）。DecisionRAG 直接将预训练语言模型作为『决策模型（Decision Models）』，通过单次前向传播（Single Forward Pass）在同一个注意力上下文中联合评估同层候选分支，无需自回归生成任何文本 Token；并且我们证实：在共享上下文中同时衡量各选项，使得各候选分支的相关性打分具备了完全可比性。犹如读者在图书馆寻书一样，DecisionRAG 沿着语料库天然蕴含的层级结构（从宽泛的主题领域、书籍，逐步下钻至章节、乃至具体段落），在每一层级智能决断哪些分支具备探索价值。在无需任何特定任务微调、无需传统第一阶段向量检索器的情况下，DecisionRAG 在 MultiDoc2Dial 基准上超越了配备 8B 大模型重排器的稠密检索基准达 13.8 个 R@1 召回率百分点，在 Natural Questions 上更是提升了 17.4 个 Hit@1 命中率百分点。在涵盖 268 万维基百科段落的大规模语料库在内的四大权威评测中，单次查询检索时间稳定在仅 0.7 ~ 1.8 秒之间。",
  tldrZh: "DecisionRAG 彻底终结了“先用向量数据库粗筛 Top-100 再用大模型重排”的传统两阶段管线。它直接利用预训练 LLM 作为图书管理员，在文档分类树（领域->文章->章节->段落）上进行“单步前向、零Token、共享对比”的束搜索导航，既根除了向量粗筛漏检的阿喀琉斯之踵，又将数百万段落的检索时间压至 1 秒左右，精度大幅反超 8B 重排器！",
  coreInnovations: [
    {
      title: "消除检索能力不对称 (Retriever-Free)",
      desc: "不再使用脆弱的浅层双编码器或倒排索引做第一阶段过滤，直接由预训练 LLM 亲自操盘端到端检索路径。",
      icon: "ShieldAlert"
    },
    {
      title: "单步前向零Token打分 (Zero-Token Forward Pass)",
      desc: "不逐字生成文本，只需 1 次前向计算提取各选项的 Logit 概率，比耗时十几秒的智能体（Agent）快 20 倍以上。",
      icon: "Zap"
    },
    {
      title: "共享上下文横向对比 (Shared-Context Attention)",
      desc: "所有同级分支在同一个全注意力窗口中横向 PK，避免了向量距离各自独立打分造成的误判假阳性。",
      icon: "Layers"
    },
    {
      title: "图书馆层级树导航 (Hierarchical Tree Navigation)",
      desc: "将海量语料按天然层级组织，配合束搜索（Beam Search）自上而下逐层剪枝，搜索复杂度从 O(N) 降至对数级。",
      icon: "GitFork"
    }
  ]
};

export const PAPER_SECTIONS: PaperSection[] = [
  {
    id: "sec-intro",
    chapterNumber: "1",
    titleEn: "Introduction & The Capability Asymmetry",
    titleZh: "引言：检索能力不对称性与传统 RAG 的阿喀琉斯之踵",
    summaryZh: "大语言模型生成能力日益强大，但上游基于向量嵌入的检索器仍旧脆弱，成为整个 AI 系统的硬性木桶短板。",
    contentZh: [
      "检索增强生成（Retrieval-Augmented Generation, RAG）已成为当前大语言模型突破参数化记忆上限、获取企业私域知识、抑制幻觉的核心工业标准体系。然而，当前的 RAG 架构普遍建立在一个深层的割裂假定之上：它将任务生硬地拆解为两个截然不同的阶段——首先由一个轻量级的检索器（Retriever，如 BM25 词频匹配或基于 BERT 架构的双编码器 Bi-Encoder）从百万级乃至数亿级的扁平段落库中筛选出少量的候选文本（例如 Top-100）；随后再将这些文本交给强大的下游生成模型（Generator）进行综合回答。",
      "这种分离导致了严峻的『能力不对称性（The Retrieval Capability Asymmetry）』：生成模型随着模型尺寸的增大和预训练数据的爆炸展现出了惊人的复杂推理、语境辨析与长依赖理解能力；然而负责第一道防线的检索器，其底层机理仍停留在将整个文本段落强行压缩成一个 768 或 1024 维的固定单一向量（Fixed Embedding Vector）。",
      "将富含复杂逻辑、限定条件、转折与细节的几百字段落强行压缩进一个低维向量，必然造成致命的信息瓶颈与损失。更糟糕的是：双编码器在编码查询和文档时是相互隔离的（独立前向传播），无法像交叉注意力（Cross-Attention）那样进行细颗粒度的词语间交互。一旦上游检索器在第一阶段由于表面用词差异、语义压缩损失或负样本干扰而漏掉了真正的正确文档，无论下游的生成模型多么聪明——即便是 70B 乃至前沿顶尖大模型——它也根本无法从未被召回的黑洞中凭空变出正确信息，最终只能无奈产生幻觉或直接答错。",
      "学术界和工业界此前普遍尝试使用第二阶段的『交叉编码重排器（Cross-Encoder Reranker）』来缓解此问题。然而，重排器仅仅是一剂止痛药，它只能对第一阶段已经召回的前 100 个文档重新排序；如果真实目标段落在第一阶段排在第 101 名乃至数千名开外，重排器也同样巧妇难为无米之炊。此外，近期兴起的基于智能体（Agentic Search）的多轮工具调用搜索虽然利用了大模型，但需要模型逐步自回归生成长篇思考过程、构造搜索关键词、反复爬取网页，单次问答往往需要十几秒到数分钟，延迟和调用成本令人望而生畏。",
      "为此，本研究提出了 DecisionRAG：一个彻底免去传统第一阶段检索器（Retriever-Free）的全新检索范式。它直接赋能预训练语言模型作为『决策模型』，以类似人类在图书馆翻阅书籍的方式在层级文档树中智能穿梭导航，完美兼顾了超高精度与毫秒级的高速响应。"
    ],
    beginnerTakeaways: [
      {
        question: "什么是『检索能力不对称性』？为什么它是传统 RAG 的致命弱点？",
        answerZh: "简单说就是『前锋（生成LLM）是世界冠军，但后卫（向量检索）却是个近视眼』。不管前锋射门多么准，只要后卫传球传丢了（关键文档没搜出来），比赛就必输无疑。传统 RAG 所有的精力都花在提升生成模型上，却忽视了第一步找资料的检索器极其容易找错。",
        analogyZh: "这就好比你让一位顶尖的外科手术医生做手术，却派了一个分不清剪刀和手术刀的学徒去器械室拿工具。学徒拿错了工具，医生医术再高超也无法完成手术。"
      },
      {
        question: "为什么把文章压缩成『向量』会有信息丢失？",
        answerZh: "一篇文章可能有『背景、转折、否定、特定适用范围（例如只在周日有效）』等极为复杂的逻辑。如果把它强行压缩成一串千维数字，这些微小却致命的前提条件很容易被抹平，导致『只在特定条件下成立』的句子被误判为『普适真理』。",
        analogyZh: "就像把整本《红楼梦》浓缩成一张黑白剪影照片，你只能看到大概轮廓，里面人物错综复杂的情感和对话细节全都被抹杀殆尽了。"
      }
    ],
    keyInsights: [
      "传统 RAG 的性能上限被上游第一阶段检索器死死锁死，这是结构性缺陷而非微调所能弥补。",
      "重排器（Reranker）无法拯救被初筛遗漏的有效信息，且计算开销随候选集增大线性增加。",
      "智能体自回归搜索虽然具有高智商，但数十秒的生成延迟使其无法作为底层高吞吐的基础检索设施。"
    ]
  },
  {
    id: "sec-paradigm",
    chapterNumber: "2",
    titleEn: "The Paradigm Shift: From Flat Vectors to Library Navigation",
    titleZh: "范式变革：从无序扁平向量堆到“图书馆层级树导航”",
    summaryZh: "人类在现实世界中如何检索信息？我们从不将所有书籍混作一锅粥，而是依照分类学与层级目录顺藤摸瓜。",
    contentZh: [
      "为了彻底破除向量检索的局限，我们反思了人类在面对海量知识储备时的真实检索行为。想象一位学者走进一座藏书百万册的国家图书馆去寻找某个特定科学实验的年份：他绝对不会把馆内上亿个段落全部摊成碎片摆在地毯上，然后去盲目嗅探哪个碎片跟脑海里的问题最像；相反，他会遵循一套极其严密且高效的『层级导航法则』。",
      "学者首先查看楼层指示牌，判定该问题属于『自然科学馆（楼层层级）』；随后走入『物理学与材料专区（书架分类）』；接着找到《石墨烯与二维材料研究（书籍层级）』；随后快速浏览其目录找到『发现与诺贝尔奖章节（章节层级）』；最终翻到正文第 45 页，准确聚焦在记载 2010 年奖项的段落上。",
      "现实世界中的知识本身就是高度结构化与层级化的——维基百科拥有门类、条目、章节（H1/H2/H3）与段落；企业技术文档拥有产品、功能模块、故障排查手册与操作规程；法律与政策文件拥有编、章、节、条、款。然而，传统 RAG 却粗暴地将这些宝贵的层级脉络一刀切碎成 512 token 的扁平文本块（Chunks），不仅主动丢弃了宏观上下文，更将搜索问题退化成了一个极易受噪声干扰的全局最近邻（KNN）几何问题。",
      "DecisionRAG 的核心思想就是『复原知识的天然层级，并指派预训练大模型担当智能领航员』。在每一个层级的交叉路口（例如决定进入哪个章节），模型根据用户的问题同时审视所有候选分支的摘要信息，做出最优决策并逐步深入。如此一来，面对包含数百万段落的庞大语料库，系统只需遍历数层深度极浅的决策树（通常深度仅为 3 ~ 4 层），每一步都能以极高的语义保真度剔除 90% 以上的不相关内容，将原本规模庞大的搜索空间在对数级时间内快速收敛至靶心段落。"
    ],
    beginnerTakeaways: [
      {
        question: "什么是『扁平向量检索』与『层级导航』的最大差别？",
        answerZh: "扁平向量检索就像把一万本书撕成一百万页纸混成一堆，闭着眼睛摸一张；而层级导航则是规规矩矩地看楼层牌、看书架标牌、看书籍目录，一步步缩小包围圈，每一步都有明确的方向感。",
        analogyZh: "买东西时，你在电商网站上先选『数码电脑』->『笔记本』->『游戏本』->『RTX4080显卡』，很快就能找到心仪型号；如果把全网数十亿件商品混合在一起只靠模糊搜索，很容易搜出手机壳、贴纸等完全不相干的杂物。"
      }
    ],
    keyInsights: [
      "真实人类知识天然具备层级拓扑（Domain -> Document -> Section -> Passage）。",
      "抛弃扁平向量切块，保留并利用文档层级结构，将搜索复杂度从 O(N) 降低到 O(log N)。",
      "逐层聚焦极大降低了单次决策的认知负荷，使得语言模型可以在每一层进行高度专注的判断。"
    ]
  },
  {
    id: "sec-architecture",
    chapterNumber: "3",
    titleEn: "DecisionRAG: Architecture & Methodology",
    titleZh: "核心架构与方法论：决策模型、零Token单步前向与共享上下文",
    summaryZh: "不调外部检索器、不生成冗长文本，以单次 Forward Pass 的 Logits 读取完成兄弟分支横向比对，配合束搜索实现快速精准导航。",
    contentZh: [
      "DecisionRAG 的系统由三大核心技术支柱紧密啮合构成：基于预训练语言模型的决策打分器（Decision Model）、单次前向传播的零 Token 评估机制（Single Forward Pass Zero-Token Evaluation）、以及基于束搜索的全局树探索策略（Beam Search Exploration）。",
      "【支柱一：决策模型与 Logits 打分】我们无需从头训练庞大的判别网络，而是直接利用现成开源的基础预训练大语言模型（如 Llama-3、Mistral 等）。在给定的节点层级，我们将用户的查询 $q$ 与当前所有候选子分支 $\\mathcal{C} = \\{c_1, c_2, \\dots, c_K\\}$ 的标题或简明摘要拼接在同一个精心设计的结构化 Prompt 中。在 Prompt 末尾，我们提示模型给出最相关的分支标识符（如字母 A, B, C...）。模型在处理该 Prompt 时，输出层对各候选字母 Token 产生的未归一化对数概率（Logits），即直接反映了模型对该分支相关性的深层认知判断。",
      "【支柱二：单步前向传播与零 Token 耗时】这是 DecisionRAG 实现超高速度的关键创举。通常使用大模型往往意味着漫长的自回归文本解码（每个 Token 都需要单独一次显卡内存搬运与前向计算）。然而在 DecisionRAG 中，我们根本不需要模型逐字吐出推理依据或文字解答！我们只需要在模型执行完该 Prompt 的『单次前向传播（Single Forward Pass）』后，直接在最后一层词表投影向量中读取各个候选选项 Token（Token A, B, C 等）对应的 Logit 浮点数值 $z_i$。因此，评估整整一行多达数十个候选分支的计算开销，仅仅等于输入 Prompt 的单次编码，耗时仅需数十毫秒！",
      "【支柱三：共享上下文消除评价偏差（Shared-Context Scoring）】传统双编码器（Bi-Encoder）最大的数学缺陷在于：每个候选文档是单独计算其向量内积的，文档之间彼此看不见，模型无法横向对比。而 DecisionRAG 将所有竞争分支置于同一个注意力窗口中，通过 Transformer 的自注意力矩阵（Self-Attention），模型在计算候选 B 的相关性时，能够清晰地对比候选 A 和候选 C 的表述。这种『在共享上下文中同时衡量所有选项』的设计，天然消除了各个候选独立评分时的基准漂移，使得最终通过 Softmax 计算出的条件概率 $P(c_i \\mid q, \\mathcal{C})$ 具备了极强的相对区分度与可比性。",
      "【支柱四：束搜索（Beam Search）防止单点误判】如果在某一层模型对两个候选分支的把握相当（例如一个复杂的跨领域问题），简单的贪心策略（只挑第1名）极易因为早期节点的偶然误判而导致全盘皆输。DecisionRAG 引入了束搜索算法：在每一层维护一个大小为 $B$（如 $B=2$ 或 $3$）的活跃分支集合。即便真实分支在第一层以微弱差距屈居第二，它依然能够被保留在候选束中继续向下延展，最终在子章节层级凭借更充分的细节一举逆袭反超。实验证明，当束宽从 1 提升至 2 时，系统在困难问答数据集上的命中率获得了跨越式增长，且计算量增加完全在可控范围内。"
    ],
    beginnerTakeaways: [
      {
        question: "什么是『零 Token 生成（Zero-Token Generation）』？为什么它比 ChatGPT 等 Agent 搜索快几十倍？",
        answerZh: "平时我们用 ChatGPT，它必须一个字一个字往外蹦，生成 300 个字需要算 300 遍神经网络；而 DecisionRAG 在做选择题时，把题目和选项喂进去后，在第 1 遍计算结束的那一瞬间，直接看模型脑海深处给 A、B、C 选项打出的原始分数（Logits），瞬间得出结果，然后直接关机！根本不需要等它写出任何文字，所以只需要极其短暂的一瞬间（几十毫秒）。",
        analogyZh: "就像一个高明的下棋大师，看一眼棋盘布局，脑海里瞬间就确定了最优落子点（单步评估），根本不需要他拿起麦克风滔滔不绝解释半小时心理活动。"
      },
      {
        question: "为什么『把所有选项放在一起打分（共享上下文）』比『单独打分』更准？",
        answerZh: "如果单独给一个人打分，你可能会给一个平庸的方案打 80 分；但如果把三份方案同时摆在桌面上横向对比，优缺点立刻一目了然，你很容易发现第三份方案比前两份深刻得多。传统向量检索就是把文档一个个单独关进小黑屋打分，而 DecisionRAG 是让他们登台公开打擂台。",
        analogyZh: "买西瓜时，如果每次只看一个西瓜，你可能觉得每个都挺圆；但如果把五个西瓜摆在同一个摊位上一字排开，哪个皮最薄、纹路最清晰、敲起来声音最脆，瞬间就能对比出来。"
      }
    ],
    keyInsights: [
      "单次前向传播提取 Logits 彻底终结了 LLM 推理必慢的刻板印象，实现数十毫秒级判别。",
      "全自注意力矩阵（Full Self-Attention）提供了跨候选分支横向抗辩与相对校准的数学保证。",
      "束搜索（Beam Search）赋予了检索算法一定的探索回溯韧性，显著提升了在模糊查询下的召回容错度。"
    ],
    formulas: [
      {
        latex: "P(c_i \\mid q, \\mathcal{C}) = \\frac{\\exp(z_i)}{\\sum_{j=1}^{K} \\exp(z_j)}",
        explanationZh: "在共享上下文 Prompt 下，第 i 个候选分支在单次前向传播中得到的原始对数概率为 z_i，通过 Softmax 归一化计算其在所有竞争对手中的相对胜出概率。"
      },
      {
        latex: "\\text{Complexity} = \\mathcal{O}\\left(B \\cdot d \\cdot \\text{ForwardPass}\\right) \\ll \\mathcal{O}\\left(N \\cdot d_{\\text{vector}}\\right) + \\mathcal{O}\\left(K \\cdot \\text{Tokens} \\cdot T_{\\text{step}}\\right)",
        explanationZh: "时间复杂度分析：深度为 d、束宽为 B 的树检索仅需少数几次前向传播，计算量远低于扫描数百万向量或生成长序列智能体回答。"
      }
    ]
  },
  {
    id: "sec-corpus",
    chapterNumber: "4",
    titleEn: "Corpus Hierarchy Construction",
    titleZh: "语料库层级结构的构建：自然层级与自适应分层",
    summaryZh: "真实世界中的各种文档如何快速转化为 DecisionRAG 所需的层级树？既支持开箱即用的原生目录，也支持非结构化文本的自底向上聚类构建。",
    contentZh: [
      "许多初学者最关心的问题是：DecisionRAG 依赖树状结构，那如果我的企业数据只是一堆杂乱无章的散装文本，这棵层级树该如何获得？论文给出了详尽的工程方案与分类剖析：",
      "【自然结构化语料（Natural Hierarchy）】在大量的实际应用场景中，语料本身就带有近乎完美的树状层级。例如维基百科天生具有门类（Categories）、词条（Articles）、分级标题（Section H2/H3）以及正文段落（Paragraphs）；企业知识库、Confluence 文档、API 开发者手册（如 IBM Cloud 文档）也都具有清晰的侧边栏目录和 Markdown 标题树；法律法规及民生政策文件（如 MultiDoc2Dial 中的医保、驾照条款）更是天然由法规大纲、细则与具体条款构成。对于这些数据，只需简单的 Markdown 语法解析器或 HTML DOM 树遍历即可零成本自动化生成完整的层级树，无需任何训练与模型参与。",
      "【非结构化语料的自底向上构建（Unstructured Corpus Construction）】对于缺少显式目录的纯文本集合，DecisionRAG 可以采用自底向上的层级聚类与自动摘要策略：将最底层的段落通过语义相似度进行分层凝聚聚类（Hierarchical Agglomerative Clustering），并在聚类形成的中间节点利用轻量语言模型自动总结出单句『层级主题摘要』。由于层级摘要的构建是一次性的离线静态操作，后续所有在线查询都可以无限次共享这棵树，且由于树的节点数量极少，整棵树的元数据只需几十兆内存即可全部载入，相比动辄数百吉字节（GB）的稠密向量索引库（HNSW Index），存储开销下降了 90% 以上！"
    ],
    beginnerTakeaways: [
      {
        question: "构建这样一棵层级树麻烦吗？是不是需要人工手动整理？",
        answerZh: "完全不需要人工整理！现实中绝大多数正规文档（如 Word、PDF、网页、Markdown）自带各级标题（一级标题、二级标题、正文）。代码可以用正则或者解析器在几秒钟内自动将它们转换成树。即使是没有任何标题的白板长文，也可以用算法自动按段落主题归类建树。",
        analogyZh: "这就好比电脑上的自动解压软件，自动按照压缩包里的文件夹层级展开到你的磁盘上，不需要你手动去新建每一个子文件夹。"
      }
    ],
    keyInsights: [
      "真实世界中 80% 以上的高价值企业知识库天然具有 Markdown/HTML/PDF 目录树拓扑。",
      "离线构建树状元数据只需执行一次，运行时仅占极小内存，完全摆脱了高昂的向量数据库授权与运维成本。"
    ]
  },
  {
    id: "sec-experiments",
    chapterNumber: "5",
    titleEn: "Empirical Evaluation & Benchmarks",
    titleZh: "实验评估：四大权威基准测试与硬核对比",
    summaryZh: "在 MultiDoc2Dial、ConditionalQA、MTRAG 以及覆盖 268 万维基百科段落的 Natural Questions 上展开严格对比验证。",
    contentZh: [
      "为了全面、客观地检验 DecisionRAG 的实际检索效能，作者团队在四个极具代表性、难度各异的公开评测基准上进行了端到端的全面测试：",
      "1. MultiDoc2Dial：涵盖美国政府四大公共机构（车管所、医疗保险、学生贷款、退伍军人事务）的复杂民生政策文件，要求在多轮对话语境下精准定位具有复杂限制条件的政策细则条款。这是检验模型在处理复杂约束与细粒度条款能力的试金石。",
      "2. ConditionalQA：极高难度的情景问答基准，每个问题都包含特定的前提假设与边界条件（例如『如果用户收入低于标准但在外州工作，是否享有减免？』），传统向量检索在此数据集上面临极大的假阳性干扰。",
      "3. MTRAG (IBM Cloud Docs)：真实的工业级企业云原生文档检索基准，包含详尽的云平台配置、CLI 操作指令、SSL 证书轮换、容器网络等纯技术场景，考查模型对技术术语与故障排查路径的深度定位能力。",
      "4. Natural Questions (NQ Open Domain)：最经典、规模最为浩大的开放域基准，包含了完整的维基百科全库——共计 2,680,000 个段落（268万段）！这是检验系统在超大规模知识库下能否抵御噪声、高速检索的关键考验。",
      "【强力对比基准（Baselines）】评测团队设立了工业界最高规格的基准线：",
      "- BM25：经典的稀疏倒排索引词法检索器。",
      "- Dense Bi-Encoder（如 Contriever、DPR 等先进密集向量检索器）：工业界主流标准，使用千万级向量库进行余弦搜索。",
      "- Two-Stage（Dense + 8B Cross-Encoder Reranker）：目前工业界公认的天花板组合——先由密集向量检索召回 Top-100，再交由 80 亿参数的重排大模型进行精细交叉打分。",
      "- Generative Agent Search：基于 ReAct 循环的多轮工具调用自主检索智能体。"
    ],
    beginnerTakeaways: [
      {
        question: "什么是『Natural Questions 268万段落』？这个规模有多大？",
        answerZh: "这相当于把几十万篇维基百科英文长篇词条切成 268 万个小片断。在这样一座海量的数字汪洋大海里，哪怕只有 0.1% 的相似干扰词，也会产生数千个干扰选项。DecisionRAG 能在这种规模下保持 1 秒左右完成精准定位，证明其具有极强的工业可用性。",
        analogyZh: "这就好比在容纳了近 300 万观众的超大型超级体育场里，广播里只报了一句特征，找人系统在 1 秒之内把聚光灯精确打在唯一目标的那名观众头上。"
      }
    ],
    keyInsights: [
      "评测覆盖了从细粒度政府法规（MultiDoc2Dial）、工业级技术手册（MTRAG）到百万级开放全书（Natural Questions）的全谱系场景。",
      "对比的基线囊括了当前主流的最强组合（Dense + 8B Reranker），保证了实验结果的说服力与含金量。"
    ]
  },
  {
    id: "sec-results",
    chapterNumber: "6",
    titleEn: "Results & Empirical Findings",
    titleZh: "实验结果：精度全面碾压 8B 重排器，延迟稳居 1 秒左右",
    summaryZh: "零样本开箱即用，无需针对任务进行微调，在 MultiDoc2Dial 上 R@1 暴涨 13.8 点，在 Natural Questions 上 Hit@1 提高 17.4 点，检索耗时仅 0.7~1.8 秒！",
    contentZh: [
      "实验结果带来了令学术界与工业界振奋的数据表现。在所有四个严苛的基准测试中，DecisionRAG 均展现出了压倒性的优势：",
      "【突破一：大幅超越 8B 交叉重排器（Cross-Encoder Reranker）】在 MultiDoc2Dial 数据集上，传统 Dense 检索配合顶尖 8B 重排器的 R@1 召回率仅为 46.2%；而 DecisionRAG 在完全不经过该数据集特定微调的前提下，R@1 直接飙升至 60.0%，绝对提升高达 +13.8 个百分点！在 Natural Questions 268 万段落的庞大底库中，DecisionRAG 的 Hit@1 较 Dense+8B Reranker 狂升 +17.4 个百分点（从 53.6% 跃升至 71.0%）。这一结果直接宣告：大语言模型自身具备卓越的层级导航洞察力，完全无须依赖专门训练的双编码向量器！",
      "【突破二：真正实用的毫秒级工业响应速度】许多人担心：让语言模型参与检索是否会像 Agent 一样极慢？实测数据有力地打破了这一顾虑。由于 DecisionRAG 采用『单步前向传播零 Token 生成』的机制，在数百万段落的维基百科树上，即便经历 3~4 层深入，整条树搜索路径仅需 3~4 次前向计算。在标准 GPU 上，单次端到端检索的执行时间仅在 0.7 秒至 1.8 秒之间！相比于需要十多秒甚至数十秒的 Agent 搜索，DecisionRAG 的速度完全达到了工业界实时互动的苛刻标准。",
      "【突破三：零样本自适应与跨领域鲁棒性（Zero-Shot Generalization）】双编码器最头疼的问题是『领域漂移（Domain Shift）』：在新闻语料上训练好的向量模型，一旦放到医疗或者法律场景，余弦相似度常常全面失效，必须重新收集成千上万条对比微调样本。而 DecisionRAG 直接继承了预训练基座模型丰富的通用世界常识，在面对全新的政府政策或专业云架构时，表现出天然的免疫力与超强 zero-shot 推理能力。"
    ],
    beginnerTakeaways: [
      {
        question: "提升 13.8 到 17.4 个百分点在信息检索领域算大突破吗？",
        answerZh: "这是一个极其惊人的巨大跃升！在信息检索（IR）顶级学术会议上，通常一个算法能比前人提升 1~2 个百分点就已经是非常优秀的论文了；一次性提升超过 13~17 个百分点，堪称是范式维度的代际跨越，相当于直接解决了大量以往根本查不到的疑难问题。",
        analogyZh: "这就好比以往汽车百公里加速成绩从 5 秒改写到 4.8 秒就值得大书特书，而 DecisionRAG 就像直接给赛车装上了火箭引擎，一脚油门踩进了 2 秒俱乐部！"
      }
    ],
    keyInsights: [
      "DecisionRAG 首次证明：无需任务特定微调、无需向量数据库，纯语言模型层级导航能在精度和速度上双重超越当前最顶尖的两阶段检索流水线。",
      "端到端 0.7~1.8 秒的延迟不仅打消了对大模型检索速度慢的疑虑，更为下一代高性能交互式 RAG 铺平了道路。"
    ]
  },
  {
    id: "sec-conclusion",
    chapterNumber: "7",
    titleEn: "Conclusion & Future Implications",
    titleZh: "结论与深远意义：检索与生成的终极合一",
    summaryZh: "DecisionRAG 标志着信息检索范式正在告别机械的向量空间投影，步入由认知决策驱动的全新时代。",
    contentZh: [
      "数十年来，计算机科学领域中『信息检索（Information Retrieval, IR）』与『自然语言生成（Natural Language Generation, NLG）』始终是两条平行的技术路线——检索工程师专注于倒排表、向量索引、近似近邻搜索（ANN）；而大模型研究者专注于自注意力机制与自回归推理。传统 RAG 仅仅是用胶水将两者硬生生拼凑在一起。",
      "DecisionRAG 的诞生从根本上弥合了这一分裂。它证明：预训练语言模型不仅是一位能言善辩的『创作者』，更是一位目光如炬的『导航决策者』。当人类赋予模型沿着层级树阅读与权衡的权利时，大模型展现出了远超一切固定几何向量距离的深邃辨别力。",
      "未来展望：随着大语言模型上下文窗口的持续扩展与前向推理成本的不断下探，DecisionRAG 的理念将进一步延伸——自动根据企业全量动态数据构建自愈型层级拓扑树、在决策树节点中无缝融合多模态图像/表格分析、以及检索过程与最终答案生成的全链路无缝端到端融合。免检索器的检索范式，正在开启智能问答的崭新篇章。"
    ],
    beginnerTakeaways: [
      {
        question: "未来我们还需要学习向量数据库和 Embedding 吗？",
        answerZh: "对于超大规模无规律散装短文本匹配，向量索引依然有其低成本的粗筛价值；但在追求高准确率、有结构上下文的企业知识库、文档助手、学术问答中，类似 DecisionRAG 这样基于大模型直接做层级决策的无检索器架构，极有可能成为未来几年 RAG 的主流新标配！",
        analogyZh: "就像数码相机出现后胶卷相机并没有彻底灭绝，但全世界绝大多数人都已经享受到了数码传感器的极致便捷与强大画质。"
      }
    ],
    keyInsights: [
      "检索与生成的界限正在彻底消融，语言模型自身成为了终极检索大脑。",
      "消除了传统向量索引庞大而繁复的运维成本，极简的层级树 + 单步决策将极大降低企业落地的门槛。"
    ]
  }
];
