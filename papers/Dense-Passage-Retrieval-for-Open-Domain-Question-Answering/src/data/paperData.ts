import { UniversalPaperData } from '../../../src/shared/types/universalPaper.js';

export const DPR_2020_PAPER_DATA: UniversalPaperData = {
  id: 'dpr-2020',
  arxivId: 'arXiv:2004.04906',
  venueBadge: 'EMNLP 2020 (稠密检索奠基)',
  publishDate: '2020年4月 (EMNLP 2020)',
  absUrl: 'https://arxiv.org/abs/2004.04906',
  pdfUrl: 'https://arxiv.org/pdf/2004.04906',
  githubUrl: 'https://github.com/facebookresearch/DPR',
  systemTitleZh: 'DPR 稠密向量检索论文精读与对比学习实验系统',
  titleZh: '面向开放域问答的稠密段落检索架构 (DPR)',
  titleEn: 'Dense Passage Retrieval for Open-Domain Question Answering',
  authors: [
    'Vladimir Karpukhin',
    'Barlas Oğuz',
    'Sewon Min',
    'Patrick Lewis',
    'Ledell Wu',
    'Sergey Edunov',
    'Danqi Chen (陈丹琦)',
    'Wen-tau Yih (衣文涛)'
  ],
  affiliations: [
    'Facebook AI Research (FAIR)',
    'University of Washington',
    'Princeton University'
  ],
  tldrZh:
    '在 DPR 诞生前，工业界长期认为稠密向量检索需要昂贵的自监督预训练（如 ORQA 的 ICT）且效果仍打不过经典的稀疏词频匹配 BM25。陈丹琦与衣文涛等人在这篇里程碑论文中证明：无需任何花哨预训练，只需拿两个现成的 BERT-base 构建双编码器（Bi-Encoder），利用「批内负样本（In-Batch Negatives）+ 1个 BM25 困难负样本（Hard Negative）」进行对比学习，就能在 Natural Questions 上将 Top-20 召回率从 BM25 的 59.1% 狂拉至 78.4%（提升 +19.3 点），正式开启了现代向量数据库检索时代！',
  coreInnovations: [
    {
      title: '极简双塔内积架构 (Dual-Encoder Dot Product)',
      desc: '使用两个独立的 BERT-base 分别将问题 q 和段落 p 映射为 768 维 [CLS] 向量，仅用向量内积 E_Q(q)ᵀE_P(p) 度量相关性，完美契合 FAISS 高速检索。'
    },
    {
      title: '批内负样本复用技巧 (In-Batch Negatives)',
      desc: '利用矩阵乘法一次性计算 BatchSize=128 内所有问题与正样本段落的 128×128 内积矩阵，零额外编码成本为每个问题白嫖 127 个高质量负样本！'
    },
    {
      title: 'BM25 困难负样本挖掘 (BM25 Hard Negatives)',
      desc: '专门挑选“包含问题高频词、BM25 打高分、但实际上不含正确答案”的干扰段落作为强负样本，迫使模型摒弃字面死记硬背、学会深层语义辨析。'
    },
    {
      title: '打破“稠密不如稀疏”历史偏见',
      desc: '无需耗费上千 GPU 小时的 ICT 预训练，仅靠几万条标准问答对微调，Top-20 准确率全面碾压 BM25 达 9% ~ 19%，奠定现代 Embedding 模型训练标准。'
    }
  ],
  abstractZh:
    '开放域问答（Open-Domain Question Answering）高度依赖高效的段落检索来筛选候选上下文。长期以来，诸如 TF-IDF 或 BM25 等传统的稀疏向量空间模型（Sparse Vector Space Models）一直是该领域的绝对主流。在本研究中，我们证明：检索系统完全可以仅使用稠密表征（Dense Representations）来实现，其中的嵌入向量学习自极少量的问答对，并由简单的双编码器（Dual-Encoder）框架驱动。通过一系列严谨的实验，我们揭示了成功训练此类稠密检索器的核心秘诀在于合理构建正负训练样本。实证结果表明，在涵盖多个开放域问答基准的全面测试中，我们的稠密段落检索器（Dense Passage Retriever, DPR）在 Top-20 段落检索准确率上大幅超越了强大的 Lucene-BM25 系统达 9% 至 19% 个百分点，并帮助我们的端到端问答系统在多个公开基准上创下了全新的最高准确率纪录（SOTA）。',
  abstractEn:
    'Open-domain question answering relies on efficient passage retrieval to select candidate contexts, where traditional sparse vector space models, such as TF-IDF or BM25, are the de facto method. In this work, we show that retrieval can be practically implemented using dense representations alone, where embeddings are learned from a small number of questions and passages by a simple dual-encoder framework. When evaluated on a wide range of open-domain QA datasets, our dense retriever outperforms a strong Lucene-BM25 system largely by 9%-19% absolute in terms of top-20 passage retrieval accuracy, and helps our end-to-end QA system establish new state-of-the-art on multiple open-domain QA benchmarks.',
  bibtex: `@inproceedings{karpukhin2020dense,
  title={Dense Passage Retrieval for Open-Domain Question Answering},
  author={Karpukhin, Vladimir and Oguz, Barlas and Min, Sewon and Lewis, Patrick and Wu, Ledell and Edunov, Sergey and Chen, Danqi and Yih, Wen-tau},
  booktitle={Proceedings of the 2020 Conference on Empirical Methods in Natural Language Processing (EMNLP)},
  pages={6769--6781},
  year={2020}
}`,
  simulatorTabLabel: 'DPR 对比学习实验台',
  beginnerSteps: [
    {
      badge: '历史困局',
      title: '第一步：为什么 BM25 统治了检索界几十年？',
      subtitle: '字面重叠匹配的“词汇鸿沟（Lexical Gap）”痛点',
      contentParagraphs: [
        '在开放域问答中，系统需要先从 2100 万个维基百科段落里找出最相关的 Top-20 段落。几十年来，工业界一直依赖 BM25（将文本看作几十万维的稀疏词频向量，靠关键词精确重合打分）。',
        '但 BM25 有一个致命弱点：如果用户问“《指环王》里的头号大反派是谁（Who is the bad guy in Lord of the Rings?）”，而维基百科原文写的是“索伦是该故事的主要敌对角色（Sauron is the main antagonist...）”，因为“bad guy”和“antagonist”没有一个字母相同，BM25 的得分直接是 0！'
      ],
      highlightBox: {
        title: '稀疏检索 (BM25) vs. 稠密检索 (DPR) 核心差异：',
        points: [
          'BM25（稀疏词袋）：词表大小 ~30万维，只有出现过的词才有非零权重。优点是专有名词匹配准，缺点是无法理解同义词与语义转述。',
          'DPR（稠密语义）：维度固定为 768 维连续实数，即使两个句子没有任何相同单词，只要语义相近，向量夹角/内积依然很高！'
        ]
      },
      takeawayCallout:
        '此前学术界以为要训练好稠密检索器必须做极其昂贵的无监督预训练（如 ORQA 的 ICT），而 DPR 证明：真正决定成败的不是预训练，而是怎么挑选对比学习的“负样本”！'
    },
    {
      badge: '双塔架构',
      title: '第二步：两个 BERT 与最大内积搜索 (MIPS)',
      subtitle: '为什么不用一个 BERT 把问题和文章拼在一起算？',
      contentParagraphs: [
        '你可能会问：直接把“问题 + 段落”拼在一起喂给一个 BERT（即 Cross-Encoder）打分不就行了吗？答案是：太慢了！面对 2100 万个段落，每来一个问题都要跑 2100 万次 BERT 前向计算，哪怕用上百张 GPU 也要算几十分钟。',
        '因此 DPR 采用双塔（Dual-Encoder / Bi-Encoder）设计：用文档编码器 E_P 提前离线把 2100 万个段落全部算好 768 维向量存进 FAISS 索引；在线收到问题 q 时，只需跑 1 次查询编码器 E_Q(q)，再用向量点积 sim(q, p) = E_Q(q)ᵀ E_P(p) 在毫秒内完成全库检索！'
      ],
      highlightBox: {
        title: 'DPR 编码器工程细节：',
        points: [
          '两个编码器均初始化自标准的 BERT-base（uncased，1.1亿参数），直接取最后一层 [CLS] Token 的输出向量（768维）作为整段表征。',
          '相似度度量选择“向量内积（Dot Product）”而非余弦相似度，直接对接 FAISS HNSW 最大内积搜索索引。'
        ]
      },
      takeawayCallout:
        '双编码器实现了“离线一次性编码文档 O(N) + 在线单次编码问题 O(1)”的工程解耦，使千万级稠密检索延迟进入 20 毫秒时代。'
    },
    {
      badge: '核心秘籍',
      title: '第三步：批内负样本 + BM25 困难负样本的魔法组合',
      subtitle: '本篇论文含金量最高的发现：如何不花额外算力训出超强编码器？',
      contentParagraphs: [
        '要让 E_Q(q) 与正确答案段落 E_P(p⁺) 的内积变大，同时必须让它与错误段落 E_P(p⁻) 的内积变小。但从 2100 万篇文档里怎么挑负样本 p⁻ 呢？作者对比了三种策略：',
        '1. 随机负样本（Random）：从全库随机抽几篇——太容易区分了，模型学不到细微差别；\n2. BM25 困难负样本（BM25 Hard Negative）：专门用 BM25 搜出“跟问题里关键词高度重合、但偏偏不包含正确答案”的段落——逼迫模型不要当只认关键词的文盲！\n3. 批内负样本（In-Batch Negatives）：在一个大小为 B=128 的训练 Batch 中，把其他 127 个问题的正样本段落直接当作当前问题的负样本！'
      ],
      highlightBox: {
        title: '批内负样本（In-Batch Negatives）的矩阵乘法加速奇迹：',
        points: [
          '设问题向量矩阵为 Q (形状 B×d)，正样本段落矩阵为 P (形状 B×d)。只需一次矩阵乘法 S = Q Pᵀ，瞬间得到 B×B (128×128) 的全相似度矩阵！',
          '对角线元素 S_{i,i} 就是正样本得分，非对角线元素 S_{i,j} (i≠j) 全都是免费奉送的 127 个负样本！再拼上每个问题专属的 1 个 BM25 困难负样本（形成 128×256 矩阵），Top-20 准确率瞬间暴涨！'
        ]
      },
      takeawayCallout:
        '「127 个批内负样本 + 1 个 BM25 困难负样本」成为了此后所有现代文本 Embedding 模型（Contriever、E5、BGE、OpenAI Embedding）的标准训练范式！'
    },
    {
      badge: '惊人发现',
      title: '第四步：碾压 BM25 与 SQuAD 数据集的“反常教训”',
      subtitle: 'Top-20 准确率跃升 19.3%，以及为什么 SQuAD 不适合训检索器？',
      contentParagraphs: [
        '在 Natural Questions、TriviaQA、WebQuestions、CuratedTREC 四大基准上，DPR 全面击溃 BM25（例如 NQ Top-20 从 59.1% 飙升至 78.4%，联合训练更达 79.4%）。',
        '但论文还诚实地揭示了一个极具启发性的反例——在著名的 SQuAD 数据集上训练时，DPR 表现明显偏弱。为什么？因为 SQuAD 的众包标注员是“先盯着给定的维基段落、再照着段落里的词改写提问”，导致问题和段落字面极度重合，反而退化成了字面匹配！'
      ],
      highlightBox: {
        title: 'DPR 论文给工业界的三大黄金法则：',
        points: [
          '1. 当 Batch Size 从 16 扩大到 128 时，批内负样本数量增加，检索准确率持续稳定上升。',
          '2. 加入 1 个或 2 个 BM25 困难负样本能带来决定性提升，但继续增加第 3 个 BM25 负样本则收益饱和。',
          '3. 在语义与词法互补的场景下，将 DPR 得分与 BM25 得分做线性融合（Hybrid: λ·BM25 + DPR），还能进一步刷新极限！'
        ]
      },
      takeawayCallout:
        'DPR 不仅终结了 BM25 在开放域问答上的垄断，还直接作为检索器组件支撑了几个月后轰动世界的 RAG 奠基论文（Lewis et al., 2020）！'
    }
  ],
  beginnerQuiz: [
    {
      id: 1,
      question: 'DPR 论文（Karpukhin et al., 2020）证明了训练一个超越 BM25 的稠密向量检索器，最关键的因素是什么？',
      options: [
        '必须先花上千张 GPU 跑几个月的 ICT（逆完形填空）自监督预训练',
        '把向量维度从 768 维扩大到 100 万维',
        '基于标准预训练 BERT 双编码器，结合「批内负样本（In-Batch Negatives）+ BM25 困难负样本（Hard Negatives）」在问答对上进行对比学习',
        '完全抛弃神经网络，改用正则表达式'
      ],
      correctIndex: 2,
      explanation:
        '正确！DPR 最伟大的贡献就是打破了“稠密检索必须依赖昂贵 ICT 预训练”的迷信，证明了在标准 BERT 上通过批内负样本 + BM25 困难负样本微调即可大幅超越 BM25 和 ORQA。'
    },
    {
      id: 2,
      question: '在 Batch Size = B 的训练批次中，为什么“批内负样本（In-Batch Negatives）”被称为高性价比的训练技巧？',
      options: [
        '因为它可以复用同一批次内其他 B-1 个样本已经编码好的正样本段落向量，仅通过一次矩阵乘法 Q·Pᵀ (B×B) 即可同时算完所有正负样本得分，无需额外运行 BERT 编码器',
        '因为它不需要计算任何梯度',
        '因为它把所有段落的长度截断到了 1 个词',
        '因为它完全不使用正样本'
      ],
      correctIndex: 0,
      explanation:
        '完全正确！BERT 编码段落是训练中最耗显存和算力的步骤。通过复用同批次内的段落表征矩阵 P，计算复杂度从 O(B²) 次 BERT 编码降为 O(B) 次编码 + 1 次轻量级矩阵内积！'
    },
    {
      id: 3,
      question: '为什么 DPR 在 NQ、TriviaQA 等数据集上大幅碾压 BM25，唯独在 SQuAD 数据集上训练时优势变小？',
      options: [
        '因为 SQuAD 数据集里的文本是乱码',
        '因为 SQuAD 的问题是由标注员看着目标段落直接改写出来的，问题与原文存在极高的字面词汇重叠，天然偏袒 BM25 且不利于模型学习跨词汇的深层语义匹配',
        '因为 SQuAD 只有 5 条数据',
        '因为 BERT 无法读取 SQuAD 的英文单词'
      ],
      correctIndex: 1,
      explanation:
        '非常到位！论文第 5.2 节专门剖析了 SQuAD 的收集偏差：众包人员看着段落提问导致极高的词面重复率，如果在多数据集混合训练时剔除 SQuAD（Multi-dataset w/o SQuAD），在 SQuAD 上的测试效果反而跃升了近 10 个百分点！'
    }
  ],
  chapters: [
    {
      id: 'sec-1-intro',
      chapterNumber: '1',
      titleZh: '引言：稀疏检索的统治与稠密检索的破局',
      titleEn: 'Introduction: Sparse Dominance vs. Dense Breakthrough',
      summaryZh:
        '剖析传统词袋模型（BM25/TF-IDF）无法逾越“同义不同词”鸿沟的缺陷，打破此前学术界认为稠密向量必须依赖复杂自监督预训练的固有成见。',
      beginnerTakeaways: [
        {
          question: '什么是词汇鸿沟（Lexical Gap / Vocabulary Mismatch）？',
          answerZh:
            '指用户提问的用词（如“bad guy 坏人”）与文档作者的用词（如“antagonist 反派”）在字面上完全不同，但表达的意思完全一致。基于精确词匹配的 BM25 遇到这种情况会直接漏检，而稠密向量检索则能将它们映射到相近的语义空间位置。',
          analogyZh:
            '就像你去药店买“止痛药”，但货架标签只写着“布洛芬缓释胶囊”。死板的按字查找员（BM25）会告诉你店里没货，而懂药理的药剂师（DPR）一眼就能拿给你。'
        }
      ],
      contentZh: [
        '开放域问答（Open-Domain QA）旨在直接利用大规模非结构化文档集合（如全量维基百科）回答事实性问题。现代开放域问答系统普遍采用两阶段架构：（1）首先由上下文检索器（Context Retriever）从数千万段落中高速筛选出少量包含潜在答案的候选段落；（2）随后由机器学习阅读器（Machine Reader）仔细阅读这些候选段落以抽取出最终答案。',
        '长期以来，第一阶段检索器一直被 TF-IDF 和 BM25 等稀疏向量空间模型（Sparse Vector Models）所统治。尽管它们基于倒排索引极为高效，但稀疏词袋表征无法捕捉超越字面关键词重合的深层语义关联（例如同义替换与句式改写）。此前尝试构建稠密向量检索器的工作（如 ORQA 和 REALM）普遍认为：必须借助大规模计算密集型的无监督预训练任务（如逆完形填空 Inverse Cloze Task, ICT）才能初始化双编码器。',
        '在本文中，我们提出了一个直击本质的核心问题：**能否在不做任何额外预训练的情况下，仅凭现有的标准预训练 BERT 和几万条现成的（问题，答案）标注对，就训练出一个全面超越 BM25 的稠密段落检索器？** 通过系统的对比学习设计，我们给出了肯定的答案。'
      ],
      contentEn: [
        'Open-domain question answering (QA) is a task that answers factoid questions using a large collection of documents. Most modern open-domain QA systems adopt a two-stage framework: (1) a context retriever first selects a small subset of passages where some of them contain the answer to the question, and then (2) a machine reader thoroughly examines the retrieved contexts and identifies the correct answer.',
        'While sparse retrieval methods such as TF-IDF or BM25 have been the de facto default, they fail to capture semantic similarity beyond lexical overlap. Previous dense retrieval works (e.g., ORQA) relied on sophisticated Inverse Cloze Task (ICT) pretraining.',
        'In this work, we address the question: Can we train a better dense embedding model using only pairs of questions and passages (or answers), without any additional pretraining?'
      ],
      keyInsights: [
        '第一阶段检索器的召回率直接决定了整个开放域问答系统的性能天花板。',
        'BM25 受困于字面精确匹配，无法召回使用同义词或转述表达的正确段落。',
        'DPR 证明无需昂贵的 ICT 预训练，直接对标准 BERT 进行有监督度量学习即可大幅超越 BM25。'
      ]
    },
    {
      id: 'sec-2-architecture',
      chapterNumber: '2',
      titleZh: 'DPR 双编码器架构与度量学习目标函数',
      titleEn: 'Dense Passage Retriever (DPR): Dual-Encoder & Metric Learning',
      summaryZh:
        '阐述双 BERT 编码器的向量映射方式、内积相似度函数，以及基于负对数似然（NLL / InfoNCE）的对比学习训练目标。',
      beginnerTakeaways: [
        {
          question: '为什么 DPR 选用“向量点积（Inner Product）”而不是“余弦相似度”或“欧氏距离”？',
          answerZh:
            '向量点积直接计算两个向量对应维度相乘再求和，不仅计算极快、没有除法归一化开销，而且向量的模长还能额外编码段落的“信息丰富度/权威度”，并能直接调用 FAISS 成熟的 MIPS（最大内积搜索）加速库。论文消融实验也证实点积与欧氏距离性能一致且更为简洁。',
          analogyZh:
            '就像打分时既看方向对不对（夹角余弦），又看论据充不充分（向量模长），两者相乘就是最直观的综合得分。'
        }
      ],
      contentZh: [
        '我们的稠密段落检索器（DPR）使用一个文档编码器 $E_P(\\cdot)$ 将任意文本段落映射为 $d$ 维实值向量，并对全库所有 $M$ 个段落（本文中为 2100 万个 100 词维基百科段落）预先离线建立向量索引。在运行时，DPR 使用另一个独立的查询编码器 $E_Q(\\cdot)$ 将输入问题映射为同维度的 $d$ 维向量，并检索出与问题向量最接近的 $k$ 个段落。',
        '我们定义问题 $q$ 与段落 $p$ 之间的相似度为两者低维稠密向量的内积（Dot Product）：$\\text{sim}(q, p) = E_Q(q)^\\top E_P(p)$。在编码器具体实现上，我们使用两个独立的预训练 BERT-base（uncased）网络，直接提取起始标记 `[CLS]` 对应的输出向量（$d = 768$）作为问题和段落的表征。',
        '【度量学习训练目标】给定包含 $m$ 个训练实例的集合 $\\mathcal{D} = \\{\\langle q_i, p_i^+, p_{i,1}^-, \\dots, p_{i,n}^- \\rangle\\}_{i=1}^m$，其中每个实例包含 1 个问题 $q_i$、1 个相关的正样本段落 $p_i^+$ 以及 $n$ 个不相关的负样本段落 $p_{i,j}^-$，我们通过最小化正样本段落的负对数似然损失（Negative Log-Likelihood Loss）来拉近正样本距离并推远所有负样本距离。'
      ],
      contentEn: [
        'Our dense passage retriever (DPR) uses a dense encoder $E_P(\\cdot)$ which maps any text passage to a $d$-dimensional real-valued vector and builds an index for all the $M$ passages that we will use for retrieval. At run-time, DPR applies a different encoder $E_Q(\\cdot)$ that maps the input question to a $d$-dimensional vector, and retrieves $k$ passages of which vectors are the closest to the question vector.',
        'We define the similarity between the question and the passage using the dot product of their vectors: $\\text{sim}(q, p) = E_Q(q)^\\top E_P(p)$. We use two independent BERT networks (base, uncased) and take the representation at the `[CLS]` token as the output ($d = 768$).',
        'We train the encoders by optimizing the negative log likelihood of the positive passage against $n$ negative passages.'
      ],
      formulas: [
        {
          latex: '\\text{sim}(q, p) = E_Q(q)^\\top E_P(p) \\in \\mathbb{R}',
          explanationZh: '双编码器内积相似度定义：分别取查询 BERT 与段落 BERT 的 768 维 [CLS] 向量做点积。'
        },
        {
          latex:
            '\\mathcal{L}(q_i, p_i^+, p_{i,1}^-, \\dots, p_{i,n}^-) = -\\log \\frac{\\exp\\left(\\text{sim}(q_i, p_i^+)\\right)}{\\exp\\left(\\text{sim}(q_i, p_i^+)\\right) + \\sum_{j=1}^{n} \\exp\\left(\\text{sim}(q_i, p_{i,j}^-)\\right)}',
          explanationZh:
            '对比学习损失函数（InfoNCE / NLL）：最大化正样本 p_i^+ 在全体候选（1个正样本 + n个负样本）中的 Softmax 概率。'
        }
      ],
      keyInsights: [
        '双编码器（Bi-Encoder）将文档编码彻底移至离线阶段，使得在线查询只需 1 次 BERT 前向传播加快速向量内积搜索。',
        '度量学习的目标是塑造一个几何空间，使相关问答对的内积显著大于一切干扰负样本。'
      ]
    },
    {
      id: 'sec-3-negatives',
      chapterNumber: '3',
      titleZh: '正负样本构建工程：批内负样本与 BM25 困难负样本',
      titleEn: 'Positive and Negative Passages: In-Batch & BM25 Hard Negatives',
      summaryZh:
        '深入剖析三种负样本策略（Random / BM25 / Gold In-Batch）的数学构造、矩阵复用计算技巧与远程监督正样本清洗方法。',
      beginnerTakeaways: [
        {
          question: '什么是“BM25 困难负样本（BM25 Hard Negative）”？为什么它对模型智商提升最大？',
          answerZh:
            '假设问题是“谁发明了交流电发电机？”，正样本是讲尼古拉·特斯拉的段落；而 BM25 困难负样本则是“爱迪生发明了直流电发电机并改进了电灯”——这段话包含了“发明”、“发电机”等所有关键词，极易骗过粗心模型，但答案是错的！把这个样本作为负样本喂给 DPR，就会逼迫模型看懂“交流电 vs 直流电”的本质区别。',
          analogyZh:
            '就像备战高考选择题时，只做选项一眼就能排除的简单题（随机负样本）拿不到高分；只有专门针对“长得极像正确答案的易错干扰项（BM25困难负样本）”进行特训，才能练就火眼金睛！'
        }
      ],
      contentZh: [
        '在 2100 万个维基百科段落中，除极少数正样本外，其余数千万段落皆为潜在负样本。如何在训练中选择最具信息量的负样本，直接决定了双编码器的判别边界。我们系统研究了三类负样本来源：（1）**Random（随机负样本）**：从全语料库随机抽取的任意段落；（2）**BM25（词法困难负样本）**：由 BM25 返回排名最高、但并不包含正确标准答案的干扰段落；（3）**Gold（跨问题黄金正样本 / 批内负样本）**：训练集中其他问题所配对的正样本段落。',
        '【批内负样本（In-Batch Negatives）矩阵加速】假设一个小批次（Mini-batch）中有 $B$ 个问题，每个问题关联 1 个正样本段落。设矩阵 $\\mathbf{Q} \\in \\mathbb{R}^{B \\times d}$ 和 $\\mathbf{P} \\in \\mathbb{R}^{B \\times d}$ 分别为该批次问题与段落的嵌入矩阵（在单次前向传播中算得）。我们直接计算矩阵乘积 $\\mathbf{S} = \\mathbf{Q}\\mathbf{P}^\\top \\in \\mathbb{R}^{B \\times B}$。其中每一行对应一个问题与 $B$ 个段落的相似度：对角线元素 $S_{i,i}$ 是正样本对，而同一行其余 $B-1$ 个非对角线元素 $S_{i,j} \\ (j \\neq i)$ 全部自动成为负样本！',
        '【黄金组合：In-Batch + 1个 BM25 Hard Negative】我们在批内负样本的基础上，为每个问题额外附加 1 个专属的 BM25 困难负样本。更妙的是，这 $B$ 个困难负样本同样可以在整个 Batch 内跨问题共享！因此，最终相似度矩阵扩展为 $\\mathbf{S} \\in \\mathbb{R}^{B \\times 2B}$，在 $B=128$ 时，每个问题在每一次梯度更新中都同时与 **1 个正样本 + 255 个负样本（127 个 Gold 批内负样本 + 128 个 BM25 困难负样本）**进行对比抗衡！'
      ],
      contentEn: [
        'We consider three different types of negatives: (1) Random: any random passage from the corpus; (2) BM25: top passages returned by BM25 which do not contain the answer, but match most question tokens; (3) Gold: positive passages paired with other questions which appear in the training set.',
        'In-batch training: Let $Q$ and $P$ be the $(B \\times d)$ matrix of question and passage embeddings in a batch of size $B$. $S = QP^\\top$ is a $(B \\times B)$ matrix of similarity scores, where each row corresponds to a question, paired with $B$ passages. In this way, we reuse computation and effectively train on $B^2$ $(q_i, p_j)$ pairs in each batch, where $(q_i, p_j)$ is positive when $i = j$ and negative otherwise.',
        'Furthermore, we augment in-batch training with one additional BM25 hard negative passage per question, reused across the entire batch, creating a $B \\times 2B$ similarity matrix.'
      ],
      formulas: [
        {
          latex:
            '\\mathbf{S} = \\mathbf{Q} \\cdot \\left[\\mathbf{P}^+; \\, \\mathbf{P}^-_{\\text{BM25}}\\right]^\\top \\in \\mathbb{R}^{B \\times 2B}',
          explanationZh:
            '批内负样本 + BM25 困难负样本联合相似度矩阵：BatchSize=B 时，单次矩阵乘法即可为每个问题构造 1 个正样本与 2B-1 个强负样本。'
        }
      ],
      keyInsights: [
        '批内负样本（In-Batch Negatives）将计算复杂度从二次方级编码降为线性编码，使大 Batch 对比学习成为可能。',
        '额外引入 1 个 BM25 困难负样本能将 Top-20 准确率从 74.3% 显著提升至 76.6%+（小 Batch 下更是从 65.2% 跃升至 75.0%）。'
      ]
    },
    {
      id: 'sec-4-experiments',
      chapterNumber: '4',
      titleZh: '五大开放域问答基准与消融实验剖析',
      titleEn: 'Experiments & Ablation Studies on Five QA Benchmarks',
      summaryZh:
        '在 NQ、TriviaQA、WebQuestions、CuratedTREC、SQuAD 五大基准上全面评测 Top-20 / Top-100 召回率，深入分析 Batch Size、负样本类型与多数据集联合训练的影响。',
      beginnerTakeaways: [
        {
          question: '为什么哪怕只有 1000 条问答标注数据，DPR 的准确率也能立刻超过 BM25？',
          answerZh:
            '论文图 2 的样本效率实验令人震惊：哪怕只从训练集里抽取 1,000 条问答对微调 BERT，DPR 在 NQ 上的 Top-20 准确率就已经达到 65% 左右，直接超越了 BM25 的 59.1%！这说明预训练 BERT 本身已经懂语义，只需要极少量对比样本“点拨”就能激活强大的检索能力。',
          analogyZh:
            '就像一位博览群书的学者（预训练 BERT），只需要做 10 套模拟卷（1000条样本）熟悉一下考试题型，成绩就能立刻超越只会查字典的机器（BM25）。'
        }
      ],
      contentZh: [
        '我们在与维基百科全库（21,015,324 个 100 词段落）匹配的五大标准开放域问答数据集上进行了实验：Natural Questions (NQ)、TriviaQA、WebQuestions (WQ)、CuratedTREC (TREC) 以及 SQuAD v1.1。',
        '【主实验结果：全面击败 BM25】除 SQuAD 外，DPR 在所有数据集上均以压倒性优势战胜 BM25。在最具代表性的 Natural Questions 上，单数据集训练的 DPR 将 Top-20 准确率从 BM25 的 **59.1%** 提升至 **78.4%**（绝对提升 **+19.3%**），联合多数据集训练的 Multi-DPR 更进一步提升至 **79.4%**！即便将词法与稠密信号结合（Hybrid BM25 + DPR），Top-20 与 Top-100 准确率进一步达到 **82.6%** 与 **88.6%**。',
        '【为什么 SQuAD 是个例外？】在 SQuAD 上，单集训练的 DPR Top-20 为 63.2%，低于 BM25 的 68.8%。作者剖析了两大原因：（1）SQuAD 标注员是先看给定段落再造问题，导致问题与段落存在极高且不自然的字面词汇重复；（2）SQuAD 仅采集自区区 500 篇维基文章，分布极度狭窄偏置。有趣的是，当使用排除 SQuAD 的其他四个数据集训练 Multi-DPR 并在 SQuAD 上零样本测试时，混合检索（BM25+DPR）反而将 SQuAD 推向了 75.1% 的新高！'
      ],
      contentEn: [
        'We evaluate on five standard open-domain QA datasets: Natural Questions (NQ), TriviaQA, WebQuestions (WQ), CuratedTREC, and SQuAD v1.1, over 21,015,324 Wikipedia passages of 100 words.',
        'DPR performs consistently better than BM25 on all datasets except SQuAD. On Natural Questions, Top-20 accuracy jumps from 59.1% (BM25) to 78.4% (Single DPR) and 79.4% (Multi DPR).',
        'Why does SQuAD underperform? First, SQuAD annotators wrote questions after reading the passage, causing an artificially high lexical overlap. Second, SQuAD passages come from only 500 Wikipedia articles, resulting in a biased distribution.'
      ],
      keyInsights: [
        '仅需 1,000 条问答样本微调，DPR 即可在 Top-20 召回率上超越免训练的 BM25。',
        'Batch Size 从 16 提升至 128 并结合 1 个 BM25 Hard Negative，是推高对比学习上限的决定性杠杆。',
        'SQuAD 的人工看文造题偏差提醒工业界：训练语义检索器必须使用真实用户的独立提问，切勿使用看着原文照抄词句的合成伪问题。'
      ]
    },
    {
      id: 'sec-5-qa-system',
      chapterNumber: '5',
      titleZh: '端到端问答系统与运行效率分析',
      titleEn: 'End-to-End QA System & Run-Time Efficiency',
      summaryZh:
        '介绍结合 DPR 检索器与多段落跨度抽取式 BERT 阅读器的端到端 QA 架构，以及离线索引构建与在线毫秒级检索的算力开销实测。',
      beginnerTakeaways: [
        {
          question: '2100 万个段落用 DPR 编码和检索到底需要多少时间和内存？',
          answerZh:
            '论文给出了实测工程账单：用 8 张 GPU 离线编码全部 2100 万个维基段落大约需要 8.8 小时；构建 FAISS HNSW 索引需 8.5 小时，索引文件约占 151GB 内存。而在线检索时，单台 CPU 服务器每秒可以处理高达 995 个问题（单次检索仅需约 1 毫秒 ~ 10 毫秒）！',
          analogyZh:
            '虽然前期把全馆 2100 万本书整理上架花了半天功夫（离线建索引），但一旦整理完毕，读者来借书时一眨眼就能拿到（毫秒级在线查询）。'
        }
      ],
      contentZh: [
        '为了验证更高召回率的检索器能否直接转化为最终问答准确率的提升，我们搭建了端到端的抽取式阅读器（Extractive Reader）。对于检索出的前 $k$ 个段落（如 $k=100$），阅读器同时计算每个段落被选中的段落选择概率 $P_{\\text{selected}}(i)$ 以及段落内第 $s$ 到第 $t$ 个词作为答案跨度的概率 $P_{\\text{start}}(s) \\cdot P_{\\text{end}}(t)$。',
        '在端到端 Exact Match (EM) 评测中，DPR 系统在五大基准中的四个上全面刷新 SOTA：在 Natural Questions 上达到 **41.5% EM**（远超 BM25+BERT 的 32.6%、ORQA 的 33.3% 以及 REALM 的 40.4%），在 TriviaQA 上达到 **57.9% EM**。',
        '【运行效率实测】在配备 Intel Xeon CPU 与 FAISS HNSW 索引（每节点 512 条边）的机器上，即使要求高度精确的 Top-100 召回，DPR 每秒也能处理 **995.0 个查询**，与 Lucene-BM25（每秒 23.7 个查询，单线程每核）相比在吞吐与延迟上均极具竞争力。'
      ],
      contentEn: [
        'We implement an end-to-end QA system where a BERT-base reader jointly learns to rerank retrieved passages and extract the answer span.',
        'Our end-to-end system outperforms all previous approaches on 4 out of 5 datasets, achieving 41.5 EM on Natural Questions (compared to 32.6 for BM25+BERT, 33.3 for ORQA, and 40.4 for REALM).',
        'With FAISS HNSW indexing, DPR processes 995.0 questions per second, demonstrating exceptional practical efficiency.'
      ],
      keyInsights: [
        '上游检索器 Top-20 召回率提升 19.3%，直接带动下游问答端到端 Exact Match 从 32.6% 暴涨至 41.5%。',
        '结合 FAISS HNSW 图索引，稠密向量检索在线吞吐可达 ~1000 QPS，完全满足大规模工业级线上服务要求。'
      ]
    }
  ],
  benchmarks: [
    {
      id: 'nq-top20',
      nameZh: 'Natural Questions (Top-20 段落检索准确率)',
      metricLabel: 'Top-20 段落包含正确答案比例 (%)',
      unit: '%',
      higherIsBetter: true,
      summaryConclusion:
        '在 2100 万维基百科段落中检索 Top-20，DPR 结合 BM25 混合评分达到 82.6%，纯 Multi-DPR 达到 79.4%，相比传统 BM25 (59.1%) 实现了 +20.3 个百分点的跨代飞跃！',
      items: [
        { modelName: 'Hybrid (DPR + BM25 混合检索)', value: 82.6, maxScale: 90, isOurModel: true, badge: '混合最强' },
        { modelName: 'Multi-DPR (多数据集联合训练)', value: 79.4, maxScale: 90, isOurModel: true, badge: '纯稠密 SOTA' },
        { modelName: 'Single-DPR (单数据集训练)', value: 78.4, maxScale: 90, isOurModel: true },
        { modelName: 'Lucene-BM25 (经典稀疏词频检索)', value: 59.1, maxScale: 90 },
        { modelName: 'ORQA (ICT 预训练双编码器)', value: 52.0, maxScale: 90 }
      ]
    },
    {
      id: 'neg-ablation',
      nameZh: '负样本策略消融实验 (NQ 开发集 Top-20, B=128)',
      metricLabel: 'Top-20 段落召回准确率 (%)',
      unit: '%',
      higherIsBetter: true,
      summaryConclusion:
        '批内负样本（In-Batch Gold）相比传统随机采样大幅提升效率，而在此基础上叠加 1~2 个 BM25 困难负样本（Hard Negatives）可将 Top-20 准确率推升至 77.3%！',
      items: [
        { modelName: 'In-Batch (127) + 2 BM25 Hard Negatives', value: 77.3, maxScale: 85, isOurModel: true, badge: '最优负样本配比' },
        { modelName: 'In-Batch (127) + 1 BM25 Hard Negative', value: 76.6, maxScale: 85, isOurModel: true },
        { modelName: 'Pure In-Batch Gold Negatives (127个批内负样本)', value: 74.3, maxScale: 85 },
        { modelName: 'Pure In-Batch Random Negatives (127个随机负样本)', value: 73.0, maxScale: 85 },
        { modelName: 'Pure BM25 Negatives (无批内共享, 仅7个负样本)', value: 70.8, maxScale: 85 }
      ]
    }
  ],
  comparisonTable: [
    {
      paradigmNameZh: 'Lucene-BM25 (稀疏倒排索引)',
      paradigmNameEn: 'Sparse Bag-of-Words',
      mechanismZh: '基于词表精确重合与 TF-IDF / 文档长度归一化打分',
      interactionMode: '稀疏高维词面精确匹配',
      indexType: '倒排索引 (~2.4 GB)',
      queryLatency: '~10-40ms',
      accuracyRank: 'NQ Top-20: 59.1% (无法跨词汇语义匹配)'
    },
    {
      paradigmNameZh: 'ORQA / ICT (自监督预训练检索)',
      paradigmNameEn: 'Inverse Cloze Task Pretraining',
      mechanismZh: '从段落中挖出句子做无监督预测预训练，开销极大',
      interactionMode: '双塔内积',
      indexType: '稠密向量索引',
      queryLatency: '~20ms',
      accuracyRank: 'NQ EM: 33.3% (预训练昂贵且弱于DPR)'
    },
    {
      paradigmNameZh: '🌟 DPR (本文稠密段落检索器)',
      paradigmNameEn: 'Dense Bi-Encoder + Hard Negatives',
      mechanismZh: '双 BERT-base 编码 + 批内负样本 + BM25 困难负样本对比学习',
      interactionMode: '768维 [CLS] 向量内积 E_Q(q)ᵀE_P(p)',
      indexType: 'FAISS HNSW (~151 GB / 可量化压缩)',
      queryLatency: '~1-10ms (995 QPS)',
      accuracyRank: 'NQ Top-20: 79.4% / EM: 41.5%',
      isOurModel: true
    },
    {
      paradigmNameZh: '🌟 Hybrid DPR + BM25 (本文混合方案)',
      paradigmNameEn: 'Lexical + Dense Linear Fusion',
      mechanismZh: '线性组合 DPR 语义内积得分与 BM25 罕见词匹配得分 (λ·BM25 + DPR)',
      interactionMode: '语义向量 + 精确词频双保险',
      indexType: 'FAISS + Lucene 双索引',
      queryLatency: '~25ms',
      accuracyRank: 'NQ Top-20: 82.6% (全能冠军)',
      isOurModel: true
    }
  ],
  caseStudies: [
    {
      title: '案例一：论文表 6 真实案例 — 跨越“词汇鸿沟（Lexical Gap）”',
      query: 'Who is the bad guy in Lord of the Rings? (《指环王》里的坏人是谁？)',
      cards: [
        {
          methodName: 'Lucene-BM25 (稀疏词频)',
          status: '严重漏检 (失败)',
          isSuccess: false,
          reason:
            '死板搜寻包含“bad”和“guy”字眼的段落，结果召回了无关演员访谈：“...playing a bad guy in a movie...”，完全找不到索伦（Sauron）！'
        },
        {
          methodName: '仅用随机负样本的弱双编码器',
          status: '语义粗糙',
          isSuccess: false,
          isWarning: true,
          reason:
            '只能识别这是关于《指环王》电影的段落，但未能精准聚焦到反派角色定义段落。'
        },
        {
          methodName: '🌟 DPR (批内 + BM25 困难负样本)',
          status: '精准命中索伦 (Sauron)',
          isSuccess: true,
          reason:
            '成功将口语“bad guy”与正式百科词汇“main antagonist（主要反派）”在 768 维空间对齐，直接召回：“Sauron is the title character and the main antagonist of The Lord of the Rings”！'
        }
      ]
    },
    {
      title: '案例二：专有名词与数字精确匹配边界（BM25 的优势与 Hybrid 互补）',
      query: 'Who plays Thoros of Myr in Game of Thrones? (《权力的游戏》中密尔的索罗斯由谁饰演？)',
      cards: [
        {
          methodName: '纯稠密向量 (遇到极生僻专有名词)',
          status: '易受相近实体干扰',
          isSuccess: false,
          isWarning: true,
          reason:
            '当遇到极度罕见的奇幻人名“Thoros of Myr”时，固定 768 维向量有时会关注整部剧《Game of Thrones》而弱化生僻词。'
        },
        {
          methodName: 'Lucene-BM25 (稀疏词频)',
          status: '罕见词权重极高',
          isSuccess: true,
          reason:
            '“Thoros”和“Myr”在全维基百科中极度罕见，IDF 权重极高，BM25 能凭借精确字符串重合锁定该人物条目。'
        },
        {
          methodName: '🌟 Hybrid (DPR + λ·BM25 混合评分)',
          status: '兼具语义与字面精度 (82.6%)',
          isSuccess: true,
          reason:
            '论文提出的线性加权评分 sim(q,p) + λ·BM25(q,p) 完美结合了 DPR 的同义理解力与 BM25 的生僻专有名词锁定力！'
        }
      ]
    }
  ],
  glossaryCategories: ['模型架构', '对比学习与负样本', '向量检索工程', '评测与发现'],
  glossaryItems: [
    {
      id: 'bi-encoder',
      termZh: '双编码器架构（双塔模型）',
      termEn: 'Dual-Encoder / Bi-Encoder',
      category: '模型架构',
      summary: '使用两个独立（或共享参数）的编码器分别将查询 q 与文档 p 编码为单独的固定维度稠密向量。',
      analogy: '就像相亲平台提前给男方和女方各自填写一份标准化的 768 项性格问卷（离线编码），匹配时只需把两张答题卡叠在一起算匹配分（点积），而不需要安排两千万人两两见面聊一小时（Cross-Encoder）。',
      technicalDetail:
        'DPR 采用两个独立的 BERT-base 网络 E_Q 和 E_P，取最后一层 [CLS] 向量，使得全库 2100 万个文档可以预先离线计算向量并存入索引。',
      paperApplication: '支撑了毫秒级在线稠密段落检索，成为现代所有向量数据库检索的标准范式。',
      formula: '\\text{sim}(q, p) = E_Q(q)^\\top E_P(p)'
    },
    {
      id: 'in-batch-negatives',
      termZh: '批内负样本复用',
      termEn: 'In-Batch Negatives',
      category: '对比学习与负样本',
      summary: '在一个训练 Batch 内，将其他 B-1 个样本的正样本段落直接作为当前样本的负样本进行对比学习。',
      analogy: '班级里 128 个同学每人带了 1 道题和 1 份标准答案。老师直接把另外 127 个同学的答案当成你的干扰项，不用多印一张卷子就让每个人做了 128 选 1 的高强度训练！',
      technicalDetail:
        '利用矩阵乘法 S = Q Pᵀ (B×B)，在不增加任何额外 BERT 前向传播开销的前提下，使每个批次有效训练样本对数量从 B 暴增至 B²。',
      paperApplication: '让 DPR 在 Batch Size = 128 时获得海量高质量负样本，Top-20 准确率大幅跃升。',
      formula: '\\mathbf{S} = \\mathbf{Q}\\mathbf{P}^\\top \\in \\mathbb{R}^{B \\times B}'
    },
    {
      id: 'bm25-hard-negatives',
      termZh: 'BM25 困难负样本',
      termEn: 'BM25 Hard Negatives',
      category: '对比学习与负样本',
      summary: '使用 BM25 检索出与问题关键词高度重合、但并不包含正确答案的段落作为强干扰负样本。',
      analogy: '专门挑那种“表面字眼一模一样、实则偷换概念”的高仿假货给鉴定师看，逼他学会看内在品质而不是只看外包装文字。',
      technicalDetail:
        '如果只用随机负样本或批内负样本，模型容易偷懒退化为简单的关键词/主题分类器；加入 1 个 BM25 困难负样本能迫使模型在细粒度语义上区分真假答案段落。',
      paperApplication: '论文证明“批内负样本 + 1个 BM25 困难负样本”是提升检索精度的最关键秘诀。'
    },
    {
      id: 'mips-faiss-hnsw',
      termZh: '最大内积搜索与 HNSW 图索引',
      termEn: 'MIPS & FAISS HNSW',
      category: '向量检索工程',
      summary: '在数千万个高维稠密向量中，以亚线性时间复杂度快速找出与查询向量点积最大的前 K 个向量的算法与工程库。',
      analogy: '在拥有 2100 万人口的超大城市里找人，不挨家挨户敲门，而是先通过高速公路网定位到街区，再顺着社区小路瞬间找到目标门牌号（HNSW 分层小世界图）。',
      technicalDetail:
        'DPR 使用 Facebook 开源的 FAISS 库构建 HNSW（Hierarchical Navigable Small World）图索引，在 2100 万维基段落上实现每秒处理 995 个查询的高吞吐。',
      paperApplication: '保证了 DPR 在工业生产环境中的毫秒级响应速度，并直接服务于后续的 RAG 系统。'
    },
    {
      id: 'distant-supervision-passage',
      termZh: '远程监督正样本清洗',
      termEn: 'Distantly-Supervised Positive Passages',
      category: '对比学习与负样本',
      summary: '针对仅提供（问题，答案字符串）而未标注黄金段落的数据集（如 TriviaQA/WQ），利用 BM25 + 答案字符串匹配自动构造训练正样本。',
      analogy: '只有标准答案没有参考页码时，先用搜索工具找出全书里包含该答案词且与题目最像的那一页，当成标准参考页来教学生。',
      technicalDetail:
        '先用 BM25 在全维基百科中检索包含答案文本的前 100 个段落，剔除不含答案的段落后，将排名第 1 的段落作为正样本 p⁺。',
      paperApplication: '使 DPR 能够在没有人工标注段落 ID 的开放域问答数据集上顺利完成对比学习训练。'
    },
    {
      id: 'lexical-gap',
      termZh: '词汇鸿沟（词面失配）',
      termEn: 'Lexical Gap / Vocabulary Mismatch',
      category: '评测与发现',
      summary: '查询与相关文档使用完全不同的词汇或句式表达相同含义，导致基于精确词匹配的倒排索引失效的现象。',
      analogy: '一个说“土豆”，一个写“马铃薯”，只认字面的文书以为它们毫无关系。',
      technicalDetail:
        '稀疏向量中不同词条对应的维度正交（内积为 0）；而 DPR 将同义表达投影到连续的 768 维隐空间相近区域，从根本上消除了正交隔离。',
      paperApplication: '解释了为什么 DPR 在 Natural Questions 上能比 BM25 高出近 20 个百分点的召回率。'
    }
  ]
};
