import { UniversalPaperData } from '../../../src/shared/types/universalPaper.js';

export const RAG_2020_PAPER_DATA: UniversalPaperData = {
  id: 'rag-2020',
  arxivId: 'arXiv:2005.11401',
  venueBadge: 'NeurIPS 2020 (奠基之作)',
  publishDate: '2020年5月 (NeurIPS 2020)',
  absUrl: 'https://arxiv.org/abs/2005.11401',
  pdfUrl: 'https://arxiv.org/pdf/2005.11401',
  githubUrl: 'https://github.com/huggingface/transformers/tree/main/examples/research_projects/rag',
  systemTitleZh: 'RAG 奠基论文精读与概率边缘化实验系统',
  titleZh: '面向知识密集型 NLP 任务的检索增强生成架构 (RAG)',
  titleEn: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
  authors: [
    'Patrick Lewis',
    'Ethan Perez',
    'Aleksandra Piktus',
    'Fabio Petroni',
    'Vladimir Karpukhin',
    'Naman Goyal',
    'Heinrich Küttler',
    'Mike Lewis',
    'Wen-tau Yih (衣文涛)',
    'Tim Rocktäschel',
    'Sebastian Riedel',
    'Douwe Kiela'
  ],
  affiliations: ['Facebook AI Research (FAIR)', 'University College London (UCL)', 'New York University (NYU)'],
  tldrZh:
    '这是正式提出「RAG（检索增强生成）」这一历史性术语的开山之作！论文首次将预训练 Seq2Seq 模型（BART，充当参数化记忆）与维基百科稠密向量索引（DPR，充当非参数化记忆）结合在一个端到端可微分的概率生成模型中，提出了 RAG-Sequence（整句共享同一篇文档边缘化）与 RAG-Token（每个生成词元跨多篇文档边缘化）两大数学范式，不仅在开放域问答上全面超越抽取式模型，而且支持零重训练热插拔更新世界知识！',
  coreInnovations: [
    {
      title: '双记忆混合架构 (Parametric + Non-Parametric)',
      desc: '将隐式存储在 BART 权重中的“参数化记忆”与显式存储在 2100 万维基百科段落索引中的“非参数化记忆”深度融合。'
    },
    {
      title: 'RAG-Sequence 序列级概率边缘化',
      desc: '将检索到的文档视为隐变量 z，假设整个输出序列由同一篇检索文档生成，并对 Top-K 文档的序列生成概率加权求和。'
    },
    {
      title: 'RAG-Token 词元级多文档融合',
      desc: '允许在生成每一个 Token 时依据不同检索文档做概率加权，实现将多篇不同文档的碎片事实无缝拼接到同一句回答中。'
    },
    {
      title: '知识热更新 (Hot-Swappable World Index)',
      desc: '无需重新训练数亿参数的神经网络，只需替换底层非参数化文档索引（如把2016年维基换成2018年维基），模型对世界事实的回答即刻同步更新。'
    }
  ],
  abstractZh:
    '大型预训练语言模型已被证明能够在其参数中存储大量的事实知识，并在针对下游 NLP 任务进行微调时取得最先进的结果。然而，它们访问和精确操纵这些知识的能力仍然有限，因此在知识密集型任务（Knowledge-Intensive Tasks）上，它们的表现往往落后于特定任务的专用架构。此外，为模型决策提供事实溯源（Provenance）以及更新其底层世界知识，依然是悬而未决的开放性难题。具有指向显式非参数化记忆（Non-parametric Memory）可微分访问机制的预训练模型可以克服这一缺陷，但此前的研究仅探索了抽取式（Extractive）下游任务。在本研究中，我们探索了一套通用的检索增强生成（Retrieval-Augmented Generation, RAG）微调范式——该模型结合了预训练的参数化记忆（Parametric Memory）与非参数化记忆以进行语言生成。我们构建的 RAG 模型中，参数化记忆是一个预训练的 seq2seq 模型（BART），而非参数化记忆则是维基百科的稠密向量索引，通过一个预训练的神经网络检索器（DPR）进行访问。我们比较了两种数学变体：一种在整个生成序列上使用相同的检索段落（RAG-Sequence），另一种则允许在生成每个词元（Token）时使用不同的段落（RAG-Token）。我们在广泛的知识密集型任务上对模型进行了微调和评估，在三个开放域问答任务上创下了新的 SOTA，大幅超越了参数化 seq2seq 模型以及专用的“检索+抽取”架构。对于语言生成任务，我们发现 RAG 模型比纯参数化基线（BART）生成的文本更加遵循事实（More Factual）、更加具体（More Specific）且更加多样化（More Diverse）。',
  abstractEn:
    'Large pre-trained language models have been shown to store factual knowledge in their parameters, and achieve state-of-the-art results when fine-tuned on downstream NLP tasks. However, their ability to access and precisely manipulate knowledge is still limited, and hence on knowledge-intensive tasks, their performance lags behind task-specific architectures. Additionally, providing provenance for their decisions and updating their world knowledge remain open research problems. Pre-trained models with a differentiable access mechanism to explicit non-parametric memory have so far been only investigated for extractive downstream tasks. We explore a general-purpose fine-tuning recipe for retrieval-augmented generation (RAG) — models which combine pre-trained parametric and non-parametric memory for language generation. We introduce RAG models where the parametric memory is a pre-trained seq2seq model and the non-parametric memory is a dense vector index of Wikipedia, accessed with a pre-trained neural retriever. We compare two formulations, one which conditions on the same retrieved passages across the whole generated sequence, and another which can use different passages per token. We fine-tune and evaluate our models on a wide range of knowledge-intensive NLP tasks and set the state of the art on three open domain QA tasks, outperforming parametric seq2seq models and task-specific retrieve-and-extract architectures. For language generation tasks, we find that RAG models generate more specific, diverse and factual language than a state-of-the-art parametric-only seq2seq baseline.',
  bibtex: `@inproceedings{lewis2020retrieval,
  title={Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks},
  author={Lewis, Patrick and Perez, Ethan and Piktus, Aleksandra and Petroni, Fabio and Karpukhin, Vladimir and Goyal, Naman and K{\\"u}ttler, Heinrich and Lewis, Mike and Yih, Wen-tau and Rockt{\\"a}schel, Tim and Riedel, Sebastian and Kiela, Douwe},
  booktitle={Advances in Neural Information Processing Systems (NeurIPS)},
  volume={33},
  pages={9459--9474},
  year={2020}
}`,
  simulatorTabLabel: 'RAG 边缘化实验台',
  beginnerSteps: [
    {
      badge: '痛点起源',
      title: '第一步：纯大模型（闭卷考试）的三大死穴',
      subtitle: '为什么光靠把模型参数做大，解决不了严肃的知识问答？',
      contentParagraphs: [
        '在 2020 年之前，GPT、BART、T5 等预训练模型震惊了学术界——研究人员发现它们像海绵一样把海量事实记在了神经网络权重（即“参数化记忆 Parametric Memory”）里，不查任何资料就能“闭卷”回答一些常识问题。',
        '但 Patrick Lewis 等人敏锐地指出了纯参数化“闭卷模型”的三大致命伤：'
      ],
      highlightBox: {
        title: '纯参数化模型（Closed-Book LLM）的三大缺陷：',
        points: [
          '1. 记忆模糊与一本正经胡说八道（Hallucination）：长尾冷门知识记不准，经常张冠李戴编造假事实。',
          '2. 知识冻结无法更新（Static World）：模型在 2019 年训练完，问它 2020 年英国首相是谁，除非砸几百万美金重新训练，否则永远答错。',
          '3. 黑盒无据可查（Lack of Provenance）：模型吐出一个答案，人类根本不知道它源自哪份权威文献，在医疗、法律场景不敢使用。'
        ]
      },
      takeawayCallout:
        '与其逼迫大模型死记硬背全宇宙的每一个冷门细节（闭卷考试），不如赋予它一本随时可翻阅的百科全书（开卷考试）！这就是 RAG 诞生的初心。'
    },
    {
      badge: '双脑架构',
      title: '第二步：参数化记忆 + 非参数化记忆的黄金联姻',
      subtitle: 'BART（语言组织大脑） + DPR 维基百科索引（外接硬盘）',
      contentParagraphs: [
        'RAG 架构的核心设计极其优雅，它将系统拆分为两个协同工作的组件：',
        '1. 检索器 p_η(z|x)（非参数化记忆 Non-Parametric Memory）：采用双编码器 DPR（Dense Passage Retriever），将 2100 万个维基百科 100 词段落编码成向量存入 FAISS 索引。当收到输入 x 时，毫秒级召回最相关的 Top-K 篇段落 z。',
        '2. 生成器 p_θ(y|x, z)（参数化记忆 Parametric Memory）：采用 4 亿参数的 BART-large 序列到序列模型。它将用户问题 x 与检索到的段落 z 拼接在一起，顺畅地生成自然语言答案 y。'
      ],
      highlightBox: {
        title: '为什么比传统的“先检索、再从原文抠字（Extractive QA）”更强？',
        points: [
          '传统的阅读理解模型（如 DrQA）只能拿荧光笔在原文里划出连续的几个词（Span Extraction）作为答案；如果答案需要综合两句话或者原文没有一模一样的词，抽取式模型就彻底失效。',
          '而 RAG 使用 Seq2Seq 生成器（BART），即使检索到的段落里没有原模原样的答案短语，模型也能根据段落提供的线索归纳合成出正确答案！'
        ]
      },
      takeawayCallout:
        '参数化记忆负责“语法规则、阅读理解与推理表达”，非参数化记忆负责“精准、可溯源、可随时替换的实时事实存储”。'
    },
    {
      badge: '数学灵魂',
      title: '第三步：RAG-Sequence 与 RAG-Token 两大边缘化公式',
      subtitle: '查出了 Top-K 篇参考文档，怎么把它们的意见融合进生成过程？',
      contentParagraphs: [
        '很多初学者以为 RAG 只是把 5 篇文档简单塞进同一个 Prompt。但在 2020 年 RAG 原论文中，作者采用了极其严谨的「隐变量概率边缘化（Latent Variable Marginalization）」！',
        '假设检索器找出了 K 篇文档 z_1, z_2, ..., z_K，每篇文档与问题的匹配概率是 p_η(z_k|x)。论文提出了两种不同的融合粒度：'
      ],
      highlightBox: {
        title: '两种概率融合（Marginalization）方式直观对比：',
        points: [
          '【RAG-Sequence（整句认准一篇文档）】：先让模型分别单看第 1 篇、第 2 篇...第 K 篇文档各自独立写出完整答案句子 y，最后用检索概率 p_η(z|x) 对整句概率做加权求和。适合单一事实问答。',
          '【RAG-Token（每吐一个字都博采众长）】：模型在生成第 1 个字时参考文档 A 的概率最高，生成到第 5 个字时切换到参考文档 B！每个 Token 的预测概率都是 K 篇文档预测分布的加权混合。适合多文档信息拼图！'
        ]
      },
      takeawayCallout:
        '因为对隐变量 z 进行了概率加权求和（Marginalization），我们无需标注“哪篇文档是标准答案”，直接最大化最终生成答案 y 的似然概率，就能通过梯度反向传播端到端联合微调检索器与生成器！'
    },
    {
      badge: '四大壮举',
      title: '第四步：横扫知识密集型基准与“时光机”热插拔实验',
      subtitle: 'SOTA 成绩单、拒造幻觉与零训练更换世界知识',
      contentParagraphs: [
        '在 Natural Questions、WebQuestions、CuratedTrec、TriviaQA 四大开放域问答数据集，以及 Jeopardy 问题生成、MS-MARCO 摘要、FEVER 事实核查上，RAG 展现了统治级表现。',
        '更惊艳的是论文第 4.5 节著名的「索引热插拔（Index Hot-Swapping）」实验：作者准备了 2016 年 12 月和 2018 年 12 月两个版本的维基百科索引，并询问这期间发生变更的 82 位各国元首是谁。'
      ],
      highlightBox: {
        title: '震撼业界的三大实验发现：',
        points: [
          '1. 零重训练刷新世界观：完全不动 BART 和 DPR 的任何一行权重，仅把底层维基百科索引从 2016 版切换为 2018 版，2018 年国家元首问答准确率瞬间从 4% 飙升至 68%！',
          '2. 即使检索未命中原词也能答对：在 NQ 数据集上，即便检索出的所有文档都不包含标准答案的字符串，RAG 依然能凭借线索达到 11.8% 的准确率（抽取式模型此时永远是 0%）！',
          '3. 事实性碾压纯 BART：在人类盲测评估中，RAG 生成文本的事实准确率以 42.7% vs 7.1% 压倒性击败纯 BART！'
        ]
      },
      takeawayCallout:
        'Lewis 等人的这篇 NeurIPS 2020 论文不仅命名了 RAG，更为此后整个大模型时代的外部知识接入奠定了理论与工程基石。'
    }
  ],
  beginnerQuiz: [
    {
      id: 1,
      question: '在 RAG 奠基论文（Lewis et al., 2020）中，“参数化记忆”与“非参数化记忆”分别指代什么？',
      options: [
        '参数化记忆指硬盘数据库，非参数化记忆指 GPU 显存',
        '参数化记忆指预训练 Seq2Seq 生成器（BART）权重中的隐式知识；非参数化记忆指由 DPR 检索的维基百科稠密向量索引库',
        '参数化记忆指 BM25 词频表，非参数化记忆指学习率超参数',
        '两者都指代同一个 BERT 分类器'
      ],
      correctIndex: 1,
      explanation:
        '正确！论文明确定义：存储在神经网络权重 θ 中的知识称为 Parametric Memory（BART-large），而外部可随时查阅与替换的维基百科向量索引库称为 Non-Parametric Memory（DPR + FAISS）。'
    },
    {
      id: 2,
      question: 'RAG-Sequence 与 RAG-Token 两个模型变体最核心的区别是什么？',
      options: [
        'RAG-Sequence 只能输出英文，RAG-Token 只能输出数字',
        'RAG-Sequence 假设整段输出序列 y 由同一篇检索文档 z 生成（序列级边缘化）；而 RAG-Token 允许在生成每个词元 y_i 时从不同检索文档汲取信息（词元级边缘化）',
        'RAG-Sequence 不使用检索器，只有 RAG-Token 使用检索器',
        'RAG-Token 只能检索 1 个单词，不能检索段落'
      ],
      correctIndex: 1,
      explanation:
        '完全正确！RAG-Token 在每个时间步 i 内部先对所有 Top-K 文档求加权和，再对整个序列求连乘，因此能在同一句生成中拼合来自不同文档的多源事实。'
    },
    {
      id: 3,
      question: '在训练 RAG 模型时，论文发现如果同时更新文档编码器 E_P(z) 会发生什么问题，作者是如何巧妙解决的？',
      options: [
        '更新文档编码器会导致全库 2100 万篇文档的向量失效，必须每隔几步就高成本重建整个 FAISS 索引；作者发现只需冻结文档编码器与索引、仅微调查询编码器 E_Q(x) 与生成器 BART 即可取得顶尖效果',
        '必须每训练 1 秒就重新编码全网 2100 万篇维基百科',
        '直接放弃微调检索器，改用随机乱抽文档',
        '把维基百科删减到只剩 10 篇文档'
      ],
      correctIndex: 0,
      explanation:
        '非常敏锐！这是 RAG 论文极具实用价值的工程发现：保持文档编码器 E_P 与 FAISS 索引固定不变，仅对查询编码器 E_Q（Query Encoder）和 BART 生成器做梯度更新，既避免了昂贵的周期性重索引，又实现了端到端检索能力的提升。'
    }
  ],
  chapters: [
    {
      id: 'sec-1-intro',
      chapterNumber: '1',
      titleZh: '引言：预训练模型的记忆局限与混合记忆愿景',
      titleEn: 'Introduction: Memory Limitations & Hybrid Memory Vision',
      summaryZh:
        '剖析纯参数化预训练语言模型在知识密集型任务上的三大软肋（难扩展更新、缺乏事实溯源、易产生幻觉），正式引出融合参数化与非参数化记忆的 RAG 通用微调范式。',
      beginnerTakeaways: [
        {
          question: '什么是“知识密集型 NLP 任务（Knowledge-Intensive NLP Tasks）”？',
          answerZh:
            '指那些仅靠语法常识或上下文逻辑根本无法完成，必须调动庞大外部世界百科事实才能正确作答的任务。例如开放域问答（“谁发现了青霉素？”）、事实核查（验证某句历史声明的真伪）、百科词条撰写等。',
          analogyZh:
            '就像语文考试里的“病句修改”只需要语感（非知识密集型），而“历史地理综合竞赛”必须查阅浩瀚史料才能作答（知识密集型）。'
        },
        {
          question: '为什么以前的 REALM 和 ORQA 模型还不算完整的通用 RAG？',
          answerZh:
            '此前的 REALM 和 ORQA 虽然也结合了向量检索，但下游使用的是 BERT 抽取式阅读器（只能从原文截取一段连续子串），无法自由生成摘要、撰写问题或合成跨段落回答。而本文首次将其拓展到通用 Seq2Seq 自回归生成（BART）！',
          analogyZh:
            '以前的模型只会拿剪刀从报纸上剪下几个字贴在答题卡上；而 RAG 读完参考书后能用自己的话流畅写出完整的论述题答案。'
        }
      ],
      contentZh: [
        '深度预训练语言模型（如 BERT、GPT-2、BART 和 T5）已经在参数中内化了海量的世界知识，无需访问任何外部记忆即可直接作为隐式参数化知识库（Parametric Knowledge Base）回答问题。然而，这种纯参数化存储机制存在根本性缺陷：它们难以直接扩展或修改记忆内容，无法直观地为预测结果提供可解释的事实来源（Provenance），并且极易产生看似通顺实则错误的“幻觉（Hallucinations）”。',
        '为了克服这一瓶颈，构建同时拥有“参数化记忆”与“非参数化（基于检索的）记忆”的混合模型（Hybrid Models）成为极具吸引力的方向。借助显式外部记忆，我们可以直接增删改查知识库内容，并让人类清楚检视模型究竟阅读了哪一段文本才得出了当前结论。',
        '在本文中，我们正式提出了检索增强生成（Retrieval-Augmented Generation, RAG），将预训练的稠密通道检索器（DPR）与预训练的序列到序列生成器（BART-large）紧密联结，并在端到端微调中联合优化两者，从而打造出一套通用于所有知识密集型生成与分类任务的统一架构。'
      ],
      contentEn: [
        'Pre-trained neural language models have been shown to learn a substantial amount of in-depth knowledge from data. They can do so without any access to an external memory, acting as a parameterized implicit knowledge base. While this development is exciting, such models do have downsides: they cannot easily expand or revise their memory, cannot straightforwardly provide insight into their predictions, and may produce "hallucinations".',
        'Hybrid models that combine parametric memory with non-parametric (i.e., retrieval-based) memories can address some of these issues because knowledge can be directly revised and expanded, and accessed knowledge can be inspected and interpreted.',
        'Here, we bring hybrid parametric and non-parametric memory to the "workhorse of NLP," i.e. sequence-to-sequence (seq2seq) models, introducing Retrieval-Augmented Generation (RAG) via a general-purpose fine-tuning approach.'
      ],
      keyInsights: [
        '纯参数化模型将语言能力与事实存储混为一谈，导致模型更新事实成本高昂且不可溯源。',
        'RAG 首次将预训练非参数化检索器（DPR）与预训练 Seq2Seq 生成器（BART）统一到端到端微调框架中。',
        '生成式（Generative）架构摆脱了抽取式（Extractive）阅读理解必须要求原文包含精确答案子串的严苛限制。'
      ]
    },
    {
      id: 'sec-2-methods',
      chapterNumber: '2',
      titleZh: '核心方法论：RAG-Sequence 与 RAG-Token 概率模型',
      titleEn: 'Methods: RAG-Sequence and RAG-Token Probabilistic Formulations',
      summaryZh:
        '严格推导 RAG 将检索文档 z 作为隐变量的两种边缘化概率生成模型：序列级共享文档的 RAG-Sequence 与词元级动态切换文档的 RAG-Token。',
      beginnerTakeaways: [
        {
          question: '为什么要把检索到的文档 z 当作“隐变量（Latent Variable）”来进行求和（边缘化 Marginalization）？',
          answerZh:
            '因为大多数训练数据只有“问题 x”和“标准答案 y”，并没有人工标注“到底哪篇维基百科段落 z 才是唯一正确的参考资料”。通过把 Top-K 篇文档的生成概率按检索相关度加权求和，如果某篇文档 z 能帮生成器高概率吐出正确答案 y，梯度就会自动奖励检索器提高这篇文档的权重！',
          analogyZh:
            '就像一位老师只看学生最终交上来的论文好不好（答案 y），学生参考了 5 本书（z_1...z_5）。哪本书真正帮学生写出了满分论点，学生在下次找书时自然就会更偏爱那本书。'
        }
      ],
      contentZh: [
        '给定输入序列 $x$，我们使用检索器 $p_\\eta(z \\mid x)$（参数为 $\\eta$）根据 $x$ 检索文本段落 $z$，随后由生成器 $p_\\theta(y_i \\mid x, z, y_{1:i-1})$（参数为 $\\theta$）综合输入 $x$、检索到的段落 $z$ 以及已生成的历史词元 $y_{1:i-1}$ 来逐个生成目标序列 $y = (y_1, \\dots, y_N)$。为了端到端训练检索器与生成器，我们将检索到的文档 $z$ 视为隐变量（Latent Variable），并提出了两种对 Top-$K$ 文档进行概率边缘化（Marginalization）的模型变体：',
        '【模型一：RAG-Sequence（序列级边缘化）】RAG-Sequence 模型在整个目标序列 $y$ 的生成过程中始终依赖同一篇检索文档 $z$。具体而言，它先通过检索器获取 Top-$K$ 篇文档，让生成器针对每一篇文档 $z$ 分别计算输出完整序列 $y$ 的条件概率，最后按检索先验概率 $p_\\eta(z \\mid x)$ 加权求和。',
        '【模型二：RAG-Token（词元级边缘化）】在 RAG-Token 模型中，我们可以为每一个待生成的目标词元 $y_i$ 抽取不同的潜文档 $z$ 并立即进行边缘化。这使得生成器在撰写同一句话的不同词语时，能够动态地从多篇不同文档中选择最相关的事实支撑。最后说明：对于分类任务，可视为目标序列长度 $N=1$ 的特例，此时 RAG-Sequence 与 RAG-Token 在数学上完全等价。'
      ],
      contentEn: [
        'We explore RAG models, which use the input sequence $x$ to retrieve text documents $z$ and use them as additional context when generating the target sequence $y$. Our models leverage two components: (i) a retriever $p_\\eta(z|x)$ with parameters $\\eta$ that returns (top-K truncated) distributions over text passages given a query $x$ and (ii) a generator $p_\\theta(y_i|x, z, y_{1:i-1})$ parameterized by $\\theta$ that generates a current token based on a context of the previous $i-1$ tokens, the original input $x$ and a retrieved passage $z$.',
        'RAG-Sequence Model: The RAG-Sequence model uses the same retrieved document to generate the complete sequence. Technically, it treats the retrieved document as a single latent variable that is marginalized to get the seq2seq probability $p(y|x)$ via a top-K approximation.',
        'RAG-Token Model: In the RAG-Token model we can draw a different latent document for each target token and marginalize accordingly. This allows the generator to choose content from several documents when producing an answer.'
      ],
      formulas: [
        {
          latex:
            'p_{\\text{RAG-Sequence}}(y \\mid x) \\approx \\sum_{z \\in \\text{top-}k(p(\\cdot \\mid x))} p_\\eta(z \\mid x) p_\\theta(y \\mid x, z) = \\sum_{z \\in \\text{top-}k(p(\\cdot \\mid x))} p_\\eta(z \\mid x) \\prod_{i=1}^{N} p_\\theta(y_i \\mid x, z, y_{1:i-1})',
          explanationZh:
            'RAG-Sequence 核心公式：先在每篇文档 z 下连乘计算整个序列 y 的概率，再在序列外层对 Top-K 文档做加权求和。'
        },
        {
          latex:
            'p_{\\text{RAG-Token}}(y \\mid x) \\approx \\prod_{i=1}^{N} \\sum_{z \\in \\text{top-}k(p(\\cdot \\mid x))} p_\\eta(z \\mid x) p_\\theta(y_i \\mid x, z, y_{1:i-1})',
          explanationZh:
            'RAG-Token 核心公式：在每个时间步 i 内部先对 Top-K 文档的词元预测分布做加权求和，再对序列长度 N 求连乘。'
        }
      ],
      keyInsights: [
        'RAG-Sequence 遵循“先连乘（生成整句）再求和（跨文档加权）”，保证整句话内部的上下文一致性。',
        'RAG-Token 遵循“先求和（每个字跨文档融合）再连乘”，具备跨多篇文档拼接碎片事实的能力。',
        '当目标序列长度 N=1（如 FEVER 三分类任务）时，RAG-Sequence 与 RAG-Token 完全等价。'
      ]
    },
    {
      id: 'sec-3-components',
      chapterNumber: '3',
      titleZh: '检索器 DPR 与生成器 BART 的协同实现',
      titleEn: 'Retriever (DPR) and Generator (BART) Architecture',
      summaryZh:
        '详解检索组件 DPR 的双塔最大内积搜索（MIPS）、生成器 BART-large 的输入拼接机制，以及冻结文档编码器实现高效端到端训练的关键技巧。',
      beginnerTakeaways: [
        {
          question: '为什么训练时只微调 Query 编码器，而不微调 Document 编码器？',
          answerZh:
            '因为知识库里有 2100 万个维基百科段落！如果每训练一个 Batch 就改一次文档编码器的权重，那 2100 万个段落的向量就全都变了，必须停下来花几小时重新计算全库向量并重建 FAISS 索引。作者发现只调整“问题向量”去靠近“文档向量”，效果一样好且训练极快！',
          analogyZh:
            '就像图书馆里的 2100 万本书已经按固定坐标摆好了（固定文档编码器），我们只需要训练图书管理员更准确地理解读者的问题应该去哪个坐标找（微调查询编码器），而不需要每来一个读者就把全馆的书重新搬家一次。'
        }
      ],
      contentZh: [
        '【检索器组件 DPR】检索器 $p_\\eta(z \\mid x)$ 基于稠密段落检索器（Dense Passage Retriever, DPR），采用双编码器（Bi-Encoder）架构：$p_\\eta(z \\mid x) \\propto \\exp(\\mathbf{d}(z)^\\top \\mathbf{q}(x))$。其中 $\\mathbf{d}(z) = \\text{BERT}_d(z)$ 是由 BERT-base 文档编码器生成的段落表征，$\\mathbf{q}(x) = \\text{BERT}_q(x)$ 是由查询编码器生成的查询表征。为了在毫秒时间内计算出 Top-$K$ 最高内积文档，系统采用了基于 FAISS 的分层导航小世界图（HNSW）进行最大内积搜索（MIPS）。',
        '【生成器组件 BART】生成器 $p_\\theta(y_i \\mid x, z, y_{1:i-1})$ 采用包含 4 亿参数的预训练 BART-large 模型。在将输入 $x$ 与检索出的段落 $z$ 送入 BART 编码器时，无需复杂的交叉网络，直接将它们以字符串形式简单拼接（Concatenate）即可。',
        '【联合训练与解码策略】在微调阶段，我们最小化目标答案的负对数似然 $\\sum_j -\\log p(y_j \\mid x_j)$。由于在训练期间更新文档编码器 $\\text{BERT}_d$ 需要定期耗费巨量算力重建全库 MIPS 索引（如 REALM 所做的那样），我们发现**保持文档编码器 $\\text{BERT}_d$ 与向量索引冻结不变**，仅微调查询编码器 $\\text{BERT}_q$ 和 BART 生成器 $\\theta$，即可获得极佳的性能！在解码（Decoding）阶段，RAG-Token 可直接使用标准自回归束搜索（Beam Search）；而对于 RAG-Sequence，由于序列概率无法分解为常规单步转移概率，我们提出了“Thorough Decoding（对每个文档生成的候选集跨全文档重打分）”与“Fast Decoding（对未出现的候选序列近似为0概率）”两种高效解码算法。'
      ],
      contentEn: [
        'Retriever DPR: The retrieval component $p_\\eta(z|x)$ is based on DPR. DPR follows a bi-encoder architecture: $p_\\eta(z|x) \\propto \\exp(\\mathbf{d}(z)^\\top \\mathbf{q}(x))$, where $\\mathbf{d}(z) = \\text{BERT}_d(z)$ is a dense representation of a document produced by a BERT-base document encoder, and $\\mathbf{q}(x) = \\text{BERT}_q(x)$ a query representation produced by a query encoder. Calculating top-k(p(·|x)) is a Maximum Inner Product Search (MIPS) problem, which can be approximately solved in sub-linear time using FAISS.',
        'Generator BART: The generator component $p_\\theta(y_i|x, z, y_{1:i-1})$ could be modelled using any encoder-decoder. We use BART-large, a pre-trained seq2seq transformer with 400M parameters. To combine the input $x$ with the retrieved content $z$ when generating from BART, we simply concatenate them.',
        'Training & Decoding: Updating the document encoder $\\text{BERT}_d$ during training is costly as it requires the document index to be periodically updated. We do not find this step necessary for strong performance, and keep the document encoder (and index) fixed, only fine-tuning the query encoder $\\text{BERT}_q$ and the BART generator.'
      ],
      formulas: [
        {
          latex:
            'p_\\eta(z \\mid x) = \\frac{\\exp\\left(\\mathbf{d}(z)^\\top \\mathbf{q}(x)\\right)}{\\sum_{z\' \\in \\mathcal{Z}} \\exp\\left(\\mathbf{d}(z\')^\\top \\mathbf{q}(x)\\right)}',
          explanationZh:
            '检索器先验概率分布：基于文档向量 d(z) 与查询向量 q(x) 的内积得分进行 Softmax 归一化（在实际计算中截断于 Top-K 文档集合）。'
        }
      ],
      keyInsights: [
        '冻结文档编码器 BERT_d 并仅微调查询编码器 BERT_q，彻底解决了端到端检索微调中重建千万级索引的算力瓶颈。',
        'RAG-Token 天然兼容标准自回归束搜索解码器；RAG-Sequence 则通过 Fast/Thorough Decoding 解决跨文档序列概率汇总。'
      ]
    },
    {
      id: 'sec-4-experiments',
      chapterNumber: '4',
      titleZh: '全面实验评估：四大类知识密集型 NLP 任务',
      titleEn: 'Experiments: Four Categories of Knowledge-Intensive Tasks',
      summaryZh:
        '在 2100 万维基百科段落索引上，全面评测开放域问答（NQ/TriviaQA/WQ/TREC）、抽象问答（MS-MARCO）、Jeopardy 问题生成与 FEVER 事实核查。',
      beginnerTakeaways: [
        {
          question: '什么是“Jeopardy!（危险边缘）问题生成”任务？为什么它最能考验 RAG-Token？',
          answerZh:
            'Jeopardy 是美国著名智力竞赛节目，规则是“给出一个实体答案（如：海明威），要求模型生成一道精准指向该答案的复杂谜面（如：这位作家在1952年发表了《老人与海》并于1954年获诺贝尔奖）”。因为一道好题目往往包含同一个实体的多个不同侧面，通常散落在不同的维基百科段落里，因此极其考验 RAG-Token 跨段落拼合信息的能力！',
          analogyZh:
            '就像给一位名人生平写一句高度浓缩的颁奖词，前半句要查他的代表作（在文档 A），后半句要查他的获奖年份（在文档 B），RAG-Token 能在写前半句时看文档 A、写后半句时自动切到文档 B！'
        }
      ],
      contentZh: [
        '我们将 2018 年 12 月的英文维基百科切分为不相交的 100 词文本块，共计 **21,015,324 个段落（2100 万段）**。每个段落编码为 768 维向量并建立 FAISS HNSW 索引（占用约 100GB 内存，压缩后仅需 36GB）。在训练期间，默认对每个查询检索 $K \\in \\{5, 10\\}$ 篇段落。',
        '【任务一：开放域问答（Open-Domain QA）】在 Natural Questions (NQ)、TriviaQA、WebQuestions (WQ) 和 CuratedTrec (CT) 四个权威基准上，我们将答案直接作为目标序列进行生成训练，与 REALM、DPR+抽取式阅读器以及 110 亿参数的 T5-11B（闭卷模型）展开正面交锋。',
        '【任务二：抽象式问答与生成（MS-MARCO NLG & Jeopardy Question Generation）】考察模型在需要自由长文本撰写、跨文档事实融合场景下的生成质量（BLEU / Q-BLEU-1）与人类事实性盲测评分。',
        '【任务三：事实核查（FEVER Fact Verification）】给定一句自然语言声明（如“爱因斯坦曾获得诺贝尔和平奖”），要求模型检索维基百科证据并判定该声明属于“支持（Supports）”、“反驳（Refutes）”还是“信息不足（Not Enough Info）”，在完全不提供人工标注证据句监督信号的情况下测试模型的自主检索判别力。'
      ],
      contentEn: [
        'We use the December 2018 dump of Wikipedia as our non-parametric knowledge source. Each article is split into disjoint 100-word chunks, to make a total of 21M documents. We use a single MIPS index built using FAISS with Hierarchical Navigable Small World approximation.',
        'Open-domain QA: We evaluate on four popular open-domain QA datasets: Natural Questions (NQ), TriviaQA (TQA), WebQuestions (WQ) and CuratedTrec (CT).',
        'Abstractive QA & Jeopardy Question Generation: We evaluate RAG on MS-MARCO NLG and Jeopardy question generation, which often requires combining facts from multiple documents.',
        'Fact Verification: FEVER requires classifying whether a natural language claim is supported or refuted by Wikipedia, or whether there is not enough information to decide.'
      ],
      keyInsights: [
        '2100 万维基百科段落构成的统一非参数化记忆库，可同时服务于问答、生成与分类验证等所有下游任务。',
        '在 FEVER 事实核查中，RAG 无需任何“哪篇文档是证据”的标注监督，仅凭最终分类标签就能学会自主检索关键证据。'
      ]
    },
    {
      id: 'sec-5-results',
      chapterNumber: '5',
      titleZh: '实验结果与核心消融：精度、抗幻觉与索引热插拔',
      titleEn: 'Results & Ablations: Accuracy, Factuality, and Index Hot-Swapping',
      summaryZh:
        '详细解读 RAG 创下的开放域问答 SOTA（NQ 44.5 EM）、比 110 亿参数 T5-11B 强出近 8 个点、人类事实性评估 42.7% vs 7.1% 碾压纯 BART，以及著名的维基百科年份热插拔实验。',
      beginnerTakeaways: [
        {
          question: '为什么 6 亿参数的 RAG 能大幅击败比它大近 20 倍的 T5-11B（110亿参数）？',
          answerZh:
            'T5-11B 虽然用了 110 亿个参数去死记硬背维基百科，但在 Natural Questions 上只有 34.5%（加 SSM 预训练也仅 36.6%）；而 RAG 只有 6.26 亿参数，因为可以实时翻阅外部维基百科索引，直接考出了 44.5% 的高分！这证明“会查资料的小模型”远胜“死记硬背的巨无霸模型”。',
          analogyZh:
            '一个记忆力超群但闭卷考试的博士（T5-11B），面对极其细碎的百科全书考题，依然考不过一个允许带整座图书馆进考场的聪明本科生（RAG）。'
        }
      ],
      contentZh: [
        '【开放域问答全面夺冠】在 Natural Questions、WebQuestions 和 CuratedTrec 上，RAG-Sequence 全面刷新了 SOTA 记录（NQ 达到 **44.5% EM**，TriviaQA 达到 **56.8% / 68.0%**）。相比于参数量高达 110 亿的闭卷模型 T5-11B+SSM（36.6%），参数量仅 6.26 亿的 RAG 高出了整整 **+7.9 个百分点**！更令人惊喜的是：当检索出的文档中完全不包含标准答案的精确字符串时，抽取式模型 DPR 的准确率为 **0%**，而 RAG 依然能通过语义推理取得 **11.8%** 的正确率！',
        '【生成事实性与多样性碾压纯 BART】在 Jeopardy 问题生成任务上，RAG-Token 的表现显著优于 RAG-Sequence——因为论文可视化展示了 RAG-Token 在生成关于海明威的题目时，前半句提到《The Sun Also Rises》时文档 2 的后验概率最高，而后半句提到《A Farewell to Arms》时自动切换为文档 1 的后验概率最高！在 452 组人工双盲评估中，评审员认为 **RAG 比纯 BART 更具事实准确性的比例高达 42.7%**（而认为 BART 更准确的仅占 7.1%），且 RAG 生成的词法多样性（Distinct-3）远超 BART，甚至无需任何耗时的多样性解码技巧。',
        '【索引热插拔（Index Hot-Swapping）验证】为了证明非参数化记忆无需重训练即可更新世界知识，作者构建了 82 道关于 2016 年至 2018 年间更换过的各国领导人问题。当挂载 2016 年维基索引时，模型对 2016 年领导人的回答准确率为 **70%**（对 2018 年领导人仅为 4%）；当直接将索引文件替换为 2018 年维基索引（**零权重修改、零重训练**）时，模型对 2018 年新任领导人的回答准确率立即达到 **68%**！',
        '【检索器微调消融（BM25 vs. 冻结 DPR vs. 微调 DPR）】如果将检索器替换为不可学习的 BM25，在问答任务上性能大幅暴跌（但有趣的是在依赖实体字面匹配的 FEVER 事实核查上 BM25 表现尚可）。而通过端到端微调 DPR 查询编码器，检索召回率与最终生成准确率均获得了显著跃升。'
      ],
      contentEn: [
        'Open-domain QA: RAG sets new state-of-the-art results on NQ (44.5 EM), WQ (45.2 EM), and CuratedTrec (52.2 EM), outperforming T5-11B (36.6 EM) and extractive DPR (41.5 EM). Even when the correct answer is not present verbatim in any retrieved document, RAG achieves 11.8% accuracy on NQ, where extractive models score 0%.',
        'Jeopardy Question Generation & Human Evaluation: RAG-Token performs better than RAG-Sequence on Jeopardy question generation, as it can combine content from several documents. Human evaluators found RAG generations to be more factual than BART in 42.7% of cases compared to 7.1% for BART.',
        'Index Hot-Swapping: Using a 2016 Wikipedia index, RAG answers 70% of 2016 world leader queries correctly. Simply swapping in the 2018 Wikipedia index without any retraining allows RAG to answer 68% of 2018 world leader queries correctly.'
      ],
      keyInsights: [
        '6.26 亿参数的 RAG 以 44.5% vs 36.6% 大幅击败 110 亿参数的闭卷巨型模型 T5-11B。',
        'RAG-Token 真实具备在单句生成过程中跨多篇文档动态切换注意力焦点的合成能力。',
        '非参数化记忆支持“即插即用”热替换，彻底解耦了语言推理能力与实时事实存储。'
      ]
    },
    {
      id: 'sec-6-conclusion',
      chapterNumber: '6',
      titleZh: '结论与历史地位：开启大模型 RAG 纪元',
      titleEn: 'Conclusion & Historical Impact: Dawn of the RAG Era',
      summaryZh:
        '总结混合记忆架构对自然语言处理范式的深远重塑，以及从 RAG (2020) 演进到现代企业级 LLM RAG 与 DecisionRAG 的技术脉络。',
      beginnerTakeaways: [
        {
          question: '这篇 2020 年的 RAG 论文与今天的 ChatGPT / Claude 企业级知识库以及 DecisionRAG 是什么关系？',
          answerZh:
            '这篇论文是所有现代 RAG 系统的“祖师爷”！它不仅创造了 RAG 这个名词，还确立了“向量检索（DPR）+ 生成模型（Seq2Seq/LLM）”的标准工业范式。而后续的 ColBERT 解决了单向量压缩的信息损失，DecisionRAG 则进一步用大模型树状决策替代了第一阶段的 DPR 向量检索。读懂这篇论文，你就打通了整个 RAG 技术演进史的任督二脉！',
          analogyZh:
            '如果把现代 AI 知识检索系统比作高铁，这篇论文就是发明蒸汽机车与铁轨标准轨距的史蒂芬孙。'
        }
      ],
      contentZh: [
        '本文提出了检索增强生成（RAG）模型——一种结合了预训练参数化记忆（BART）与非参数化外部记忆（DPR 维基百科索引）的通用生成架构。通过将检索文档视为隐变量并引入序列级（RAG-Sequence）与词元级（RAG-Token）边缘化训练机制，我们在无需检索监督信号的前提下实现了端到端联合微调。',
        '实验有力地证明：相比于单纯扩大模型参数量的闭卷预训练模型，赋予语言模型随时检索外部知识库的能力，不仅能以更少的参数量取得更高的开放域问答精度，还能显著抑制模型幻觉、提升生成内容的多样性与事实可溯源性，并支持通过热替换外部索引来实时更新模型的世界认知。',
        '从历史视角回望，Lewis 等人（2020）的这项工作正式开创了大语言模型时代的 RAG 学科分支，成为了连接信息检索（IR）与自然语言生成（NLG）最重要的一座里程碑桥梁。'
      ],
      contentEn: [
        'We have presented hybrid generation models with access to parametric and non-parametric memory. We showed that RAG models obtain state of the art results on open-domain QA, and that human evaluators prefer RAG’s generation over purely parametric BART, finding RAG more factual and specific.',
        'We conducted an thorough investigation of the learned retrieval component, validating its effectiveness, and we illustrated how the non-parametric memory can be hot-swapped to update the model’s knowledge without any retraining.'
      ],
      keyInsights: [
        'RAG 正式确立了“非参数化检索 + 参数化生成”这一现代 AI 最核心的知识增强范式。',
        '理解 RAG-Sequence 与 RAG-Token 的概率边缘化，是从“简单 Prompt 拼接”迈向“深度概率检索融合”的必修课。'
      ]
    }
  ],
  benchmarks: [
    {
      id: 'nq-qa',
      nameZh: 'Natural Questions (开放域问答 Exact Match)',
      metricLabel: '精确匹配率 (Exact Match %)',
      unit: '%',
      higherIsBetter: true,
      summaryConclusion:
        '仅 6.26 亿参数的 RAG-Sequence 达到 44.5% EM，不仅超越了抽取式 SOTA 模型 DPR (41.5%) 与预训练检索模型 REALM (40.4%)，更是大幅领先 110 亿参数的闭卷巨无霸 T5-11B+SSM 达 +7.9 个百分点！',
      items: [
        { modelName: 'RAG-Sequence (本文, 626M)', value: 44.5, maxScale: 55, isOurModel: true, badge: 'SOTA 冠军' },
        { modelName: 'RAG-Token (本文, 626M)', value: 44.1, maxScale: 55, isOurModel: true, badge: '词元级融合' },
        { modelName: 'DPR + Extractive Reader (抽取式)', value: 41.5, maxScale: 55 },
        { modelName: 'REALM (预训练检索+抽取)', value: 40.4, maxScale: 55 },
        { modelName: 'T5-11B + SSM (110亿参数闭卷)', value: 36.6, maxScale: 55 },
        { modelName: 'T5-11B (标准闭卷模型)', value: 34.5, maxScale: 55 }
      ]
    },
    {
      id: 'human-factuality',
      nameZh: 'Jeopardy 生成人工盲测：事实准确性胜率',
      metricLabel: '人类评审判定“更符合事实”占比 (%)',
      unit: '%',
      higherIsBetter: true,
      summaryConclusion:
        '在 452 组双盲人工评估中，评审员判定 RAG 生成内容比纯 BART 更具事实准确性的比例高达 42.7%，而判定纯 BART 更准确的仅为 7.1%，直接证实外部非参数化记忆对幻觉的强大抑制作用。',
      items: [
        { modelName: 'RAG 事实性胜出 (More Factual)', value: 42.7, maxScale: 50, isOurModel: true, badge: '6倍领先' },
        { modelName: '两者同样准确 (Both Factual)', value: 32.5, maxScale: 50 },
        { modelName: '纯参数化 BART 胜出 (BART Better)', value: 7.1, maxScale: 50 }
      ]
    },
    {
      id: 'hot-swap',
      nameZh: '索引热插拔实验 (2016 vs 2018 世界元首问答)',
      metricLabel: '挂载 2018 维基索引时的问答准确率 (%)',
      unit: '%',
      higherIsBetter: true,
      summaryConclusion:
        '无需修改任何一行神经网络权重，仅把底层非参数化维基百科索引从 2016 年版切换为 2018 年版，模型对 2018 年新任国家元首的回答准确率立即从 4% 跃升至 68%！',
      items: [
        { modelName: '挂载匹配年份索引 (2018 Index -> 2018 Leaders)', value: 68.0, maxScale: 80, isOurModel: true, badge: '零重训练热更新' },
        { modelName: '挂载旧年份索引 (2016 Index -> 2018 Leaders)', value: 4.0, maxScale: 80 }
      ]
    }
  ],
  comparisonTable: [
    {
      paradigmNameZh: 'Closed-Book Seq2Seq (T5-11B / BART)',
      paradigmNameEn: 'Pure Parametric Memory',
      mechanismZh: '完全依赖预训练权重死记硬背世界知识，无外部检索',
      interactionMode: '仅内部自注意力',
      indexType: '无外部索引 (纯权重)',
      queryLatency: '~80ms',
      accuracyRank: '34.5% ~ 36.6% (易幻觉、不可热更新)'
    },
    {
      paradigmNameZh: 'Retrieve-and-Extract (DPR + BERT Reader)',
      paradigmNameEn: 'Extractive Pipeline',
      mechanismZh: '先用 DPR 检索段落，再用阅读器从原文截取连续子串 Span',
      interactionMode: '双塔检索 + 片段起止分类',
      indexType: 'FAISS 稠密向量索引',
      queryLatency: '~220ms',
      accuracyRank: '41.5% (原文无精确词时得分为0)'
    },
    {
      paradigmNameZh: '🌟 RAG-Sequence (本文序列级模型)',
      paradigmNameEn: 'Sequence-Level Marginalization',
      mechanismZh: '整句输出共享同一篇检索文档 z，对 Top-K 文档的序列概率加权求和',
      interactionMode: 'Top-K 序列级概率边缘化',
      indexType: '2100万段落 DPR+FAISS (可热插拔)',
      queryLatency: '~280ms',
      accuracyRank: '44.5% EM (开放域问答 SOTA)',
      isOurModel: true
    },
    {
      paradigmNameZh: '🌟 RAG-Token (本文词元级模型)',
      paradigmNameEn: 'Token-Level Marginalization',
      mechanismZh: '每个生成 Token 动态对 Top-K 文档概率加权，支持单句融合多文档事实',
      interactionMode: 'Top-K 词元级概率边缘化',
      indexType: '2100万段落 DPR+FAISS (可热插拔)',
      queryLatency: '~260ms',
      accuracyRank: '44.1% EM / 多源文本生成冠军',
      isOurModel: true
    }
  ],
  caseStudies: [
    {
      title: '案例一：Jeopardy 多文档事实拼图生成（海明威代表作）',
      query: '目标实体：Ernest Hemingway (海明威) — 请生成一道包含其两部不同时期代表作的 Jeopardy 竞赛题面',
      cards: [
        {
          methodName: '纯参数化 BART (Closed-Book)',
          status: '事实张冠李戴 (幻觉)',
          isSuccess: false,
          reason:
            '纯靠参数记忆生成了“这位作家在 1926 年写下了《美丽新世界》”，将赫胥黎的作品错误安在了海明威头上。'
        },
        {
          methodName: 'RAG-Sequence (单文档序列)',
          status: '信息单一',
          isSuccess: false,
          isWarning: true,
          reason:
            '由于整句话受限于单篇检索段落，只能提及《太阳照常升起》一部作品，无法把分散在两篇不同段落中的《永别了，武器》融合进同一句。'
        },
        {
          methodName: '🌟 RAG-Token (本文词元级模型)',
          status: '跨文档完美合成',
          isSuccess: true,
          reason:
            '生成前半句“《The Sun Also Rises》”时文档 2 的边缘化权重最高；生成到后半句“《A Farewell to Arms》”时注意力自动切换至文档 1，单句无缝拼合两篇文档事实！'
        }
      ]
    },
    {
      title: '案例二：世界知识时效变更（2017 年秘鲁总统更替）',
      query: 'Who is the President of Peru? (秘鲁现任总统是谁？)',
      cards: [
        {
          methodName: 'T5-11B 闭卷大模型',
          status: '知识冻结过时',
          isSuccess: false,
          reason:
            '模型权重锁定在训练语料截止日，无论外界如何变化，始终输出旧总统名字，除非耗费巨资重新训练模型。'
        },
        {
          methodName: '抽取式阅读理解 (无原文命中时)',
          status: '无法归纳生成',
          isSuccess: false,
          reason:
            '当段落表述为“Martín Vizcarra took office as head of state in March 2018”而未直接出现“President of Peru”标准字眼时容易抽取失败。'
        },
        {
          methodName: '🌟 RAG + 索引热插拔 (本文)',
          status: '零训练即时更新',
          isSuccess: true,
          reason:
            '挂载 2016 索引时准确输出 Pedro Pablo Kuczynski；将底层索引文件秒级切换为 2018 维基索引后，零训练直接准确输出 Martín Vizcarra！'
        }
      ]
    }
  ],
  glossaryCategories: ['记忆范式', '概率与数学', '检索与生成', '训练与解码'],
  glossaryItems: [
    {
      id: 'parametric-memory',
      termZh: '参数化记忆',
      termEn: 'Parametric Memory',
      category: '记忆范式',
      summary: '隐式编码并存储在深度神经网络权重参数（θ）内部的知识表征。',
      analogy: '就像人类大脑皮层通过长期背诵形成的肌肉记忆——不需要翻书就能脱口而出，但容易记混细节且很难立刻修改。',
      technicalDetail:
        '在 RAG 论文中，参数化记忆由预训练的 4 亿参数 BART-large（双向编码器 + 自回归解码器）承担，负责语言语法组织、上下文推理与序列生成。',
      paperApplication: '作为生成器 p_θ(y_i | x, z, y_<i)，将输入问题 x 与检索到的非参数化段落 z 融合转化为流畅的自然语言答案。'
    },
    {
      id: 'non-parametric-memory',
      termZh: '非参数化记忆',
      termEn: 'Non-Parametric Memory',
      category: '记忆范式',
      summary: '显式存储在神经网络外部、可通过检索器按需读取与随时替换的文本索引库。',
      analogy: '就像放在桌面上随时可以翻阅、贴便签、甚至随时换最新版《新华字典》的开卷参考书。',
      technicalDetail:
        '在本文中由 2100 万个 100 词维基百科段落及其对应的 768 维 DPR 稠密向量索引（FAISS HNSW）构成，存储空间随语料规模扩展而不增加模型参数量。',
      paperApplication: '为生成器提供高保真、可溯源（Provenance）且支持零训练热更新（Hot-Swapping）的外部事实证据。'
    },
    {
      id: 'rag-sequence',
      termZh: '序列级边缘化模型',
      termEn: 'RAG-Sequence',
      category: '概率与数学',
      summary: '假设整段目标输出序列 y 均由同一篇检索出的潜文档 z 条件生成，并在序列层面求概率加权和。',
      analogy: '写一篇短答卷时，从借来的 5 本参考书里每次单挑 1 本从头写到尾，最后综合 5 份草稿的靠谱程度选出最佳答案。',
      technicalDetail:
        '数学上先计算单篇文档 z 下整个序列的连乘概率 ∏ p_θ(y_i | x, z, y_<i)，再在最外层对 Top-K 篇文档按检索概率 p_η(z|x) 求和。',
      paperApplication: '在单事实开放域问答（NQ、TriviaQA）上表现尤为出色，保证了整句生成的上下文连贯性。',
      formula: 'p_{\\text{RAG-Seq}}(y|x) \\approx \\sum_{z \\in \\text{top-}k} p_\\eta(z|x) \\prod_{i=1}^N p_\\theta(y_i|x, z, y_{1:i-1})'
    },
    {
      id: 'rag-token',
      termZh: '词元级边缘化模型',
      termEn: 'RAG-Token',
      category: '概率与数学',
      summary: '允许模型在生成每一个词元 y_i 时依赖不同的检索文档 z，在每个时间步内部对 Top-K 文档求边缘化概率。',
      analogy: '写综述句子时，前半句摘录自第 1 本书，写到后半句时眼睛立刻扫向第 2 本书，把多本书的精华无缝揉进同一句话里。',
      technicalDetail:
        '数学上在每个生成时间步 i 内部先计算 ∑_z p_η(z|x) p_θ(y_i | x, z, y_<i)，随后再对序列长度 i=1..N 求连乘，天然兼容标准 Beam Search 解码。',
      paperApplication: '在需要综合多篇文档信息的任务（如 Jeopardy 问题生成、长文本摘要）上显著优于 RAG-Sequence。',
      formula: 'p_{\\text{RAG-Token}}(y|x) \\approx \\prod_{i=1}^N \\sum_{z \\in \\text{top-}k} p_\\eta(z|x) p_\\theta(y_i|x, z, y_{1:i-1})'
    },
    {
      id: 'latent-variable-marginalization',
      termZh: '隐变量概率边缘化',
      termEn: 'Latent Variable Marginalization',
      category: '概率与数学',
      summary: '将未标注真实标签的中间检索文档 z 视为隐变量，通过对所有可能候选文档的概率加权求和来直接计算边际似然 p(y|x)。',
      analogy: '不知道哪把钥匙能开锁时，按每把钥匙像真钥匙的概率同时尝试，只要最终锁开了，就能反过来知道哪把钥匙功劳最大。',
      technicalDetail:
        '避免了对“检索哪篇文档才正确”的人工标注需求，使得负对数似然损失 -log p(y|x) 的梯度能够直接通过 p_η(z|x) 回传给查询编码器 BERT_q。',
      paperApplication: '实现了仅凭最终任务（问答/分类）的输入输出对 (x, y)，即可端到端联合训练检索器与生成器。'
    },
    {
      id: 'frozen-document-encoder',
      termZh: '冻结文档编码器策略',
      termEn: 'Frozen Document Encoder Trick',
      category: '训练与解码',
      summary: '在端到端微调 RAG 时，固定文档编码器 BERT_d 与 FAISS 向量索引不变，仅更新查询编码器 BERT_q 与生成器 BART。',
      analogy: '图书馆的书架编号固定不动，只训练读者大脑把问题翻译成更准的索书号，省去了每天把几千万本书重新贴标签排队的浩大工程。',
      technicalDetail:
        '相比于 REALM 每隔数百步就必须动用数百张 TPU 异步重算全库文档向量并重建索引，冻结 BERT_d 使得训练开销降低了数个数量级且精度毫不逊色。',
      paperApplication: '让 RAG 的端到端微调在普通实验室 GPU 服务器上即可高效完成。'
    },
    {
      id: 'thorough-vs-fast-decoding',
      termZh: '彻底解码与快速解码',
      termEn: 'Thorough vs. Fast Decoding',
      category: '训练与解码',
      summary: '针对 RAG-Sequence 序列概率无法按常规单步分解而设计的两种束搜索近似解码算法。',
      analogy: '快速解码是“只在推荐书单各自写出的高分作文里挑”，彻底解码则是“把每篇入围作文拿到所有参考书下全部重审一遍算总分”。',
      technicalDetail:
        'RAG-Sequence 对每篇文档 z_k 运行束搜索得到候选集 Y；Thorough Decoding 对未出现在某文档束中的候选 y 额外运行一次前向传播计算精确 p_θ(y|x, z_k)，而 Fast Decoding 直接假定未出现于该束中的 p_θ(y|x, z_k) ≈ 0。',
      paperApplication: '在保证 RAG-Sequence 解码准确性的同时大幅降低了多文档推理阶段的计算开销。'
    },
    {
      id: 'index-hot-swapping',
      termZh: '知识索引热插拔',
      termEn: 'Index Hot-Swapping',
      category: '检索与生成',
      summary: '在不重新训练或微调任何神经网络模型权重的情况下，通过直接替换外部非参数化向量索引文件来更新模型的世界知识。',
      analogy: '给游戏机换一张新的游戏卡带，主机硬件分毫未动，但屏幕里的世界已经完全更新到了最新版本。',
      technicalDetail:
        '由于模型已学会如何根据检索出的上下文 z 合成答案，当把 2016 年维基百科 FAISS 索引替换为 2018 年索引时，DPR 召回新事实段落，BART 立即据此生成最新答案。',
      paperApplication: '论文通过 2016 vs 2018 世界领导人实验（准确率从 4% 秒升至 68%）验证了这一划时代特性。'
    }
  ]
};
