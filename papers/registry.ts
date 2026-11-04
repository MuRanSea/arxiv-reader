import React from 'react';

export interface PaperItem {
  id: string;
  folderName: string;
  titleZh: string;
  titleEn: string;
  arxivId: string;
  doi: string;
  authors: string[];
  affiliations: string[];
  publishDate: string;
  category: 'RAG与检索' | '大模型架构' | '智能体与推理' | '知识图谱';
  tags: string[];
  status: 'active' | 'coming-soon';
  tldrZh: string;
  keyMetrics: {
    label: string;
    value: string;
    highlight?: boolean;
  }[];
  features: string[];
  component?: React.ComponentType<{ onBackToHub: () => void; initialView?: string }>;
}

export const REGISTERED_PAPERS: PaperItem[] = [
  {
    id: 'decisionrag',
    folderName: 'Retriever-Free-Retrieval-Navigating-Documents-with-Decision-Models',
    titleZh: '免检索器的检索架构：利用决策模型在文档层级树中智能导航 (DecisionRAG)',
    titleEn: 'Retriever-Free Retrieval: Navigating Documents with Decision Models',
    arxivId: 'arXiv:2610.35868',
    doi: 'https://doi.org/10.48550/arXiv.2610.35868',
    authors: [
      'Chao Wan (万超)',
      'Paul Jünger',
      'Beixi Du (杜北希)',
      'Bodong Liu (刘博东)',
      'Navaneetha Krishnan',
      'Kilian Q. Weinberger'
    ],
    affiliations: ['Cornell University (康奈尔大学)', 'ASAPP Research'],
    publishDate: '2026年10月',
    category: 'RAG与检索',
    tags: ['Retriever-Free', 'Zero-Token', '层级树导航', 'Beam Search', '共享上下文'],
    status: 'active',
    tldrZh: '彻底淘汰传统向量数据库与粗筛检索器。将语料库组织为天然层级树，由预训练 LLM 亲自操盘单步前向传播（零Token生成）与共享上下文横向PK，在数百万段落库中实现 0.7~1.8 秒的高速精准定位，R@1 暴涨 13.8~17.4 点！',
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
    ]
  },
  {
    id: 'graphrag',
    folderName: 'GraphRAG-Unifying-Retrieval-and-Knowledge-Graphs',
    titleZh: 'GraphRAG：基于知识图谱与社区摘要的大规模全局语义检索',
    titleEn: 'From Local to Global: A Graph RAG Approach to Query-Focused Summarization',
    arxivId: 'arXiv:2404.16130',
    doi: 'https://arxiv.org/abs/2404.16130',
    authors: ['Microsoft Research Team'],
    affiliations: ['Microsoft Research'],
    publishDate: '即将入驻',
    category: '知识图谱',
    tags: ['GraphRAG', '知识图谱', '社区摘要', '全库宏观问答'],
    status: 'coming-soon',
    tldrZh: '针对传统 RAG 无法回答“全数据集的核心主题是什么”等宏观全局性问题，GraphRAG 引入实体关系提取与分层图社区聚类摘要，实现跨文档关联推理。',
    keyMetrics: [
      { label: '全局问题全面性', value: '+72% 胜率' },
      { label: '信息多样性覆盖', value: '+85%' }
    ],
    features: ['图谱构建模拟', '社区聚类交互可视化', '全局 vs 局部检索对比']
  },
  {
    id: 'self-rag',
    folderName: 'Self-RAG-Learning-to-Retrieve-Generate-and-Critique',
    titleZh: 'Self-RAG：自适应检索与自省式反思纠错框架',
    titleEn: 'Self-RAG: Learning to Retrieve, Generate and Critique through Self-Reflection',
    arxivId: 'arXiv:2310.11511',
    doi: 'https://arxiv.org/abs/2310.11511',
    authors: ['Akari Asai et al.'],
    affiliations: ['University of Washington', 'IBM Research'],
    publishDate: '即将入驻',
    category: '智能体与推理',
    tags: ['Self-RAG', '反思标记', '自适应检索', '抗幻觉'],
    status: 'coming-soon',
    tldrZh: '让模型自主决定“何时需要检索”、“检索内容是否相关”以及“回答是否有据可查”，通过内省反思 Token 大幅降低不必要检索与虚假幻觉。',
    keyMetrics: [
      { label: '事实一致性提升', value: '+18.4%' },
      { label: '幻觉率下降', value: '-35%' }
    ],
    features: ['反思 Token 激活模拟器', '自适应检索触发演示']
  }
];
