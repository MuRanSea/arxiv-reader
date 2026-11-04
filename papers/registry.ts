import { PaperRegistryItem } from '../src/shared/types/paper.js';
import DecisionRagApp from './Retriever-Free-Retrieval-Navigating-Documents-with-Decision-Models/src/App.js';
import Rag2020App from './Retrieval-Augmented-Generation-for-Knowledge-Intensive-NLP-Tasks/src/App.js';
import Dpr2020App from './Dense-Passage-Retrieval-for-Open-Domain-Question-Answering/src/App.js';
import Colbert2020App from './ColBERT-Efficient-and-Effective-Passage-Search-via-Contextualized-Late-Interaction-over-BERT/src/App.js';

export type PaperItem = PaperRegistryItem;

export const REGISTERED_PAPERS: PaperRegistryItem[] = [
  {
    id: 'decisionrag',
    folderName: 'Retriever-Free-Retrieval-Navigating-Documents-with-Decision-Models',
    titleZh: '免检索器的检索架构：利用决策模型在文档层级树中智能导航 (DecisionRAG)',
    titleEn: 'Retriever-Free Retrieval: Navigating Documents with Decision Models',
    arxivId: 'arXiv:2610.35868',
    doi: 'https://doi.org/10.48550/arXiv.2610.35868',
    githubUrl: 'https://github.com/decisionrag/decision-rag',
    authors: [
      'Chao Wan (万超)',
      'Paul Jünger',
      'Beixi Du (杜北希)',
      'Bodong Liu (刘博东)',
      'Navaneetha Krishnan',
      'Kilian Q. Weinberger'
    ],
    affiliations: ['Cornell University (康奈尔大学)', 'ASAPP Research'],
    publishDate: '2026年10月 (Preprint)',
    category: 'RAG与检索',
    tags: ['Retriever-Free', 'Zero-Token', '层级树导航', 'Beam Search', '共享上下文'],
    status: 'active',
    tldrZh:
      '彻底淘汰传统向量数据库与粗筛检索器。将语料库组织为天然层级树，由预训练 LLM 亲自操盘单步前向传播（零Token生成）与共享上下文横向PK，在数百万段落库中实现 0.7~1.8 秒的高速精准定位，R@1 暴涨 13.8~17.4 点！',
    keyMetrics: [
      { label: 'MultiDoc2Dial R@1', value: '60.0% (+13.8%)', highlight: true },
      { label: 'NQ 268万段落 Hit@1', value: '71.0% (+17.4%)', highlight: true },
      { label: '端到端检索延迟', value: '0.7s ~ 1.8s' },
      { label: '自回归Token消耗', value: '0 Tokens' }
    ],
    features: [
      '5分钟通俗速通导览',
      '中英全译精读与双语对照',
      '分层决策导航实验台 (在线试玩)',
      '五大范式基准对比矩阵',
      '概念双解词典 (白话+学术)'
    ],
    component: DecisionRagApp
  },
  {
    id: 'rag-2020',
    folderName: 'Retrieval-Augmented-Generation-for-Knowledge-Intensive-NLP-Tasks',
    titleZh: 'RAG 奠基论文：面向知识密集型 NLP 任务的检索增强生成架构',
    titleEn: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
    arxivId: 'arXiv:2005.11401',
    doi: 'https://arxiv.org/abs/2005.11401',
    githubUrl: 'https://github.com/huggingface/transformers/tree/main/examples/research_projects/rag',
    authors: [
      'Patrick Lewis',
      'Ethan Perez',
      'Aleksandra Piktus',
      'Fabio Petroni',
      'Vladimir Karpukhin',
      'Wen-tau Yih',
      'Sebastian Riedel',
      'Douwe Kiela'
    ],
    affiliations: ['Facebook AI Research (FAIR)', 'UCL', 'NYU'],
    publishDate: 'NeurIPS 2020 (开山之作)',
    category: 'RAG与检索',
    tags: ['RAG奠基', 'RAG-Sequence', 'RAG-Token', '隐变量边缘化', '索引热插拔'],
    status: 'active',
    tldrZh:
      '正式命名并开创「RAG」范式的奠基论文！首次将预训练 Seq2Seq 生成器（BART 参数化记忆）与 2100 万维基百科稠密向量索引（DPR 非参数化记忆）融合在端到端概率边缘化框架中，提出 RAG-Sequence 与 RAG-Token 两大模型，以 6 亿参数击败 110 亿参数闭卷 T5-11B，并实现零重训练知识热插拔！',
    keyMetrics: [
      { label: 'Natural Questions EM', value: '44.5% (超T5-11B +7.9%)', highlight: true },
      { label: '人工事实性盲测胜率', value: '42.7% vs 7.1%', highlight: true },
      { label: '知识索引热插拔', value: '4% ➔ 68% (零训练)' },
      { label: '外部维基索引规模', value: '2100 万段落' }
    ],
    features: [
      '5分钟通俗速通导览',
      '全文6章中英对照精读',
      'RAG-Token 逐词边缘化与热插拔实验台',
      '权威问答与生成基准全表',
      '核心概念双解词典'
    ],
    component: Rag2020App
  },
  {
    id: 'dpr-2020',
    folderName: 'Dense-Passage-Retrieval-for-Open-Domain-Question-Answering',
    titleZh: 'DPR 稠密向量检索论文：面向开放域问答的稠密段落检索架构',
    titleEn: 'Dense Passage Retrieval for Open-Domain Question Answering',
    arxivId: 'arXiv:2004.04906',
    doi: 'https://arxiv.org/abs/2004.04906',
    githubUrl: 'https://github.com/facebookresearch/DPR',
    authors: [
      'Vladimir Karpukhin',
      'Barlas Oğuz',
      'Sewon Min',
      'Patrick Lewis',
      'Danqi Chen (陈丹琦)',
      'Wen-tau Yih (衣文涛)'
    ],
    affiliations: ['Facebook AI Research (FAIR)', 'University of Washington', 'Princeton University'],
    publishDate: 'EMNLP 2020 (向量检索奠基)',
    category: 'RAG与检索',
    tags: ['DPR', '双塔编码器', 'In-Batch Negatives', 'BM25困难负样本', 'FAISS MIPS'],
    status: 'active',
    tldrZh:
      '打破“稠密向量不如 BM25”历史成见的里程碑之作！证明无需昂贵的 ICT 预训练，仅使用两个标准 BERT 构建双编码器，配合「批内负样本复用（In-Batch Negatives）+ 1个 BM25 困难负样本」对比学习，即可将 NQ Top-20 召回率从 BM25 的 59.1% 狂拉至 79.4%（混合检索达 82.6%）！',
    keyMetrics: [
      { label: 'NQ Top-20 召回率', value: '79.4% (超BM25 +20.3%)', highlight: true },
      { label: 'Hybrid 混合检索 Top-20', value: '82.6%', highlight: true },
      { label: '端到端问答 EM', value: '41.5% (超ORQA +8.2%)' },
      { label: '在线检索吞吐', value: '995 QPS (FAISS)' }
    ],
    features: [
      '5分钟通俗速通导览',
      '全文5章中英对照精读',
      'DPR 对比学习与负样本矩阵实验台',
      '五大问答基准与 SQuAD 反常剖析',
      '核心概念双解词典'
    ],
    component: Dpr2020App
  },
  {
    id: 'colbert-2020',
    folderName: 'ColBERT-Efficient-and-Effective-Passage-Search-via-Contextualized-Late-Interaction-over-BERT',
    titleZh: 'ColBERT 延迟交互论文：基于 BERT 上下文延迟交互的高效精准段落检索',
    titleEn: 'ColBERT: Efficient and Effective Passage Search via Contextualized Late Interaction over BERT',
    arxivId: 'arXiv:2004.12832',
    doi: 'https://arxiv.org/abs/2004.12832',
    githubUrl: 'https://github.com/stanford-futuredata/ColBERT',
    authors: ['Omar Khattab', 'Matei Zaharia'],
    affiliations: ['Stanford University (斯坦福大学)'],
    publishDate: 'SIGIR 2020 (延迟交互里程碑)',
    category: 'RAG与检索',
    tags: ['ColBERT', '延迟交互 Late Interaction', 'MaxSim算子', '[MASK]查询软扩展', '多向量检索'],
    status: 'active',
    tldrZh:
      '开创「上下文延迟交互（Contextualized Late Interaction）」范式！离线保留文档每个 Token 的低维上下文向量，在线通过 [MASK] 查询软扩展与极轻量的 MaxSim（最大相似度求和）算子进行词元级精细对齐。在 MS MARCO 上不仅精度超越 BERT-base 全交叉重排器，速度更提升 170 倍以上、算力削减 1400 倍！',
    keyMetrics: [
      { label: '重排加速比 (vs BERT-base)', value: '170x+ (54ms vs 32s)', highlight: true },
      { label: 'FLOPs 算力削减', value: '1394x 减少', highlight: true },
      { label: '880万段端到端 Recall@1k', value: '96.8% (BM25仅81.4%)' },
      { label: 'MS MARCO MRR@10', value: '36.0% (端到端 458ms)' }
    ],
    features: [
      '5分钟通俗速通导览',
      '全文4章中英对照精读',
      'MaxSim 词元交互矩阵与 [MASK] 扩展实验台',
      'MS MARCO 速度与精度全景对比',
      '核心概念双解词典'
    ],
    component: Colbert2020App
  }
];
