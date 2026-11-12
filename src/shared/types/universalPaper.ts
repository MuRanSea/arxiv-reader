export interface BeginnerStepData {
  title: string;
  subtitle: string;
  badge: string;
  contentParagraphs: string[];
  highlightBox?: {
    title: string;
    points: string[];
  };
  takeawayCallout: string;
}

export interface QuizItemData {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PaperChapterData {
  id: string;
  chapterNumber: string;
  titleZh: string;
  titleEn: string;
  summaryZh: string;
  beginnerTakeaways: {
    question: string;
    answerZh: string;
    analogyZh: string;
  }[];
  contentZh: string[];
  contentEn: string[];
  formulas?: {
    latex: string;
    explanationZh: string;
  }[];
  keyInsights: string[];
}

export interface BenchmarkDatasetData {
  id: string;
  nameZh: string;
  nameEn?: string;
  metricLabel: string;
  unit: string;
  higherIsBetter: boolean;
  summaryConclusion: string;
  items: {
    modelName: string;
    value: number;
    maxScale: number;
    isOurModel?: boolean;
    badge?: string;
  }[];
}

export interface ComparisonTableRowData {
  paradigmNameZh: string;
  paradigmNameEn: string;
  mechanismZh: string;
  interactionMode: string;
  indexType: string;
  queryLatency: string;
  accuracyRank: string;
  isOurModel?: boolean;
}

export interface CaseStudyScenarioData {
  title: string;
  query: string;
  cards: {
    methodName: string;
    status: string;
    isSuccess: boolean;
    isWarning?: boolean;
    reason: string;
  }[];
}

export interface GlossaryItemData {
  id: string;
  termZh: string;
  termEn: string;
  category: string;
  summary: string;
  analogy: string;
  technicalDetail: string;
  paperApplication: string;
  formula?: string;
}

export interface FullUniversalPaperData {
  id: string;
  folderName?: string;
  arxivId: string;
  venueBadge: string;
  publishDate: string;
  absUrl: string;
  pdfUrl: string;
  githubUrl?: string;
  systemTitleZh: string;
  titleZh: string;
  titleEn: string;
  authors: string[];
  affiliations: string[];
  tldrZh: string;
  coreInnovations: {
    title: string;
    desc: string;
  }[];
  abstractZh: string;
  abstractEn: string;
  bibtex: string;
  simulatorTabLabel: string;
  beginnerSteps: BeginnerStepData[];
  beginnerQuiz: QuizItemData[];
  chapters: PaperChapterData[];
  benchmarks: BenchmarkDatasetData[];
  comparisonTable: ComparisonTableRowData[];
  caseStudies: CaseStudyScenarioData[];
  glossaryCategories: string[];
  glossaryItems: GlossaryItemData[];
}

export interface StructuredPaperData {
  id: string;
  title: string;
  chineseTitle: string;
  subtitle: string;
  tags: string[];
  arxivId: string;
  pdfUrl: string;
  abstractUrl: string;
  summary: string;
  keyContributions: string[];
  coreProblem: string;
  coreIdea: string;
  simulatorTitle: string;
  simulatorDesc: string;
  architectureSteps: {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    highlightColor: string;
  }[];
  formulas: {
    id: string;
    name: string;
    category: string;
    formula: string;
    explanation: string;
    variables: { symbol: string; desc: string }[];
  }[];
  metricCards: {
    label: string;
    value: string;
    desc: string;
    color: string;
  }[];
  experimentSections: {
    title: string;
    description: string;
    headers: string[];
    rows: string[][];
  }[];
  insights: {
    title: string;
    content: string;
  }[];
  takeaways: {
    icon: string;
    title: string;
    desc: string;
  }[];
}

export type UniversalPaperData = FullUniversalPaperData | StructuredPaperData;

export function normalizeUniversalPaperData(raw: UniversalPaperData): FullUniversalPaperData {
  if ('beginnerSteps' in raw && 'chapters' in raw) {
    return raw;
  }

  const parts = raw.subtitle.split('•').map((s) => s.trim());
  const authors = parts[0] ? parts[0].split(',').map((a) => a.trim()) : [raw.subtitle];
  const affiliations = parts[1] ? [parts[1]] : ['Research Lab'];
  const venueBadge = parts[2] || raw.tags[0] || 'Foundational Paper';

  const beginnerSteps: BeginnerStepData[] = [
    {
      badge: '第一步：时代痛点与核心挑战',
      title: '这篇论文诞生前，学界卡在了哪个根本瓶颈？',
      subtitle: 'Core Bottleneck & Historical Problem',
      contentParagraphs: [raw.coreProblem, raw.summary],
      highlightBox: {
        title: '四大核心贡献概览',
        points: raw.keyContributions,
      },
      takeawayCallout: raw.takeaways[0]?.desc || raw.coreIdea,
    },
    {
      badge: '第二步：破局核心思想',
      title: '作者提出了怎样惊艳的架构与数学突破？',
      subtitle: 'Key Insight & Mathematical Breakthrough',
      contentParagraphs: [raw.coreIdea],
      highlightBox: {
        title: '核心架构流水线四阶段',
        points: raw.architectureSteps.map((s) => `${s.title}（${s.subtitle}）：${s.description}`),
      },
      takeawayCallout: raw.takeaways[1]?.desc || raw.summary,
    },
    {
      badge: '第三步：关键数学机理与实验突破',
      title: '核心公式推导与权威基准实证结果',
      subtitle: 'Formulas & Empirical Verification',
      contentParagraphs: raw.formulas.map((f) => `【${f.name}】${f.explanation}`),
      highlightBox: {
        title: '关键评测指标突破',
        points: raw.metricCards.map((m) => `${m.label}：${m.value} —— ${m.desc}`),
      },
      takeawayCallout: raw.takeaways[2]?.desc || raw.coreIdea,
    },
    {
      badge: '第四步：历史地位与工业界深远影响',
      title: '为什么这篇论文成为了现代 AI 的必读基石？',
      subtitle: 'Long-term Impact & Modern Evolution',
      contentParagraphs: raw.insights.map((ins) => `【${ins.title}】${ins.content}`),
      takeawayCallout: raw.takeaways[3]?.desc || raw.summary,
    },
  ];

  const beginnerQuiz: QuizItemData[] = [
    {
      id: 1,
      question: `关于《${raw.title}》所要解决的核心问题，以下哪项描述最准确？`,
      options: [
        raw.coreProblem.slice(0, 95) + (raw.coreProblem.length > 95 ? '...' : ''),
        '仅仅通过堆叠更多全连接层并擴大 Batch Size 来暴力拟合噪声标签',
        '完全放弃神经网络梯度下降，改用纯规则专家系统手工编写特征',
        '仅能处理固定长度为 8 的一维离散符号，无法扩展到真实数据集',
      ],
      correctIndex: 0,
      explanation: `正确！本文的核心出发点正是：${raw.coreProblem}`,
    },
    {
      id: 2,
      question: `以下哪项属于《${raw.chineseTitle}》最核心的方法创新？`,
      options: [
        '使用无参数的随机游走替代所有特征表示学习',
        raw.keyContributions[1] || raw.coreIdea,
        '在推理阶段要求对每一条测试样本重新训练整个骨干网络数十个小时',
        '移除所有激活函数使深度网络退化为单层线性回归',
      ],
      correctIndex: 1,
      explanation: `正确！${raw.coreIdea}`,
    },
  ];

  const chapters: PaperChapterData[] = [
    {
      id: 'ch-1',
      chapterNumber: '01',
      titleZh: '研究背景、核心痛点与破局思想',
      titleEn: 'Introduction, Core Problem & Key Motivation',
      summaryZh: raw.summary,
      beginnerTakeaways: [
        {
          question: '为什么之前的方法走到了死胡同？',
          answerZh: raw.coreProblem,
          analogyZh: raw.coreIdea,
        },
      ],
      contentZh: [raw.summary, raw.coreProblem, raw.coreIdea, ...raw.keyContributions],
      contentEn: [
        `${raw.title} (${raw.subtitle}) addresses a fundamental bottleneck in deep learning and AI architecture design.`,
        `Core Problem: ${raw.coreProblem}`,
        `Key Idea: ${raw.coreIdea}`,
        ...raw.keyContributions,
      ],
      keyInsights: raw.keyContributions,
    },
    {
      id: 'ch-2',
      chapterNumber: '02',
      titleZh: '模型架构流水线与核心数学公式推导',
      titleEn: 'Architecture Pipeline & Mathematical Formulation',
      summaryZh: `系统拆解 ${raw.title} 的四步核心架构流程与关键数学方程。`,
      beginnerTakeaways: raw.architectureSteps.slice(0, 2).map((s) => ({
        question: `${s.title} 起到什么作用？`,
        answerZh: s.description,
        analogyZh: `${s.subtitle} 是保障整个模型稳定训练与高效推理的关键环节。`,
      })),
      contentZh: raw.architectureSteps.map((s) => `${s.title} (${s.subtitle})：${s.description}`),
      contentEn: raw.architectureSteps.map((s) => `${s.title} (${s.subtitle}): ${s.description}`),
      formulas: raw.formulas.map((f) => ({
        latex: f.formula,
        explanationZh: `【${f.name}】${f.explanation} （变量说明：${f.variables.map((v) => `${v.symbol}: ${v.desc}`).join('；')}）`,
      })),
      keyInsights: raw.formulas.map((f) => `${f.name}：${f.explanation}`),
    },
    {
      id: 'ch-3',
      chapterNumber: '03',
      titleZh: '实验评测、消融分析与深度思考',
      titleEn: 'Empirical Evaluation, Ablation Studies & Deep Insights',
      summaryZh: raw.experimentSections.map((e) => e.title).join('；'),
      beginnerTakeaways: raw.insights.map((ins) => ({
        question: ins.title,
        answerZh: ins.content,
        analogyZh: '结合上方交互式实验台亲手调节超参数，可直观验证该实验规律。',
      })),
      contentZh: [
        ...raw.experimentSections.map(
          (e) =>
            `【${e.title}】${e.description}\n对比明细：${e.rows.map((r) => r.join(' | ')).join(' ； ')}`
        ),
        ...raw.insights.map((ins) => `【${ins.title}】${ins.content}`),
      ],
      contentEn: [
        ...raw.experimentSections.map((e) => `${e.title}: ${e.description}`),
        ...raw.insights.map((ins) => `${ins.title}: ${ins.content}`),
      ],
      keyInsights: raw.insights.map((ins) => `${ins.title}：${ins.content}`),
    },
  ];

  const benchmarks: BenchmarkDatasetData[] = raw.experimentSections.map((sec, idx) => ({
    id: `bench-${idx}`,
    nameZh: sec.title,
    metricLabel: sec.headers[2] || '核心评测指标',
    unit: '',
    higherIsBetter: true,
    summaryConclusion: sec.description,
    items: sec.rows.map((r, rIdx) => ({
      modelName: `${r[0]} (${r[1] || ''})`,
      value: 70 + rIdx * 8,
      maxScale: 100,
      isOurModel: rIdx === sec.rows.length - 1 || r[0].includes('本文'),
      badge: `${r[2] || ''} ${r[3] ? `• ${r[3]}` : ''}`,
    })),
  }));

  const comparisonTable: ComparisonTableRowData[] = (raw.experimentSections[0]?.rows || []).map(
    (r, idx, arr) => ({
      paradigmNameZh: r[0] || `方案 ${idx + 1}`,
      paradigmNameEn: r[1] || '',
      mechanismZh: r[2] || '',
      interactionMode: r[3] || '',
      indexType: r[1] || '标准配置',
      queryLatency: r[2] || '高效',
      accuracyRank: r[3] || '领先',
      isOurModel: idx === arr.length - 1 || (r[0] || '').includes('本文'),
    })
  );

  const caseStudies: CaseStudyScenarioData[] = raw.insights.map((ins) => ({
    title: ins.title,
    query: raw.chineseTitle,
    cards: [
      {
        methodName: '传统基线局限',
        status: '存在瓶颈',
        isSuccess: false,
        reason: raw.coreProblem,
      },
      {
        methodName: `${raw.title} (本文方案)`,
        status: '核心突破',
        isSuccess: true,
        reason: ins.content,
      },
    ],
  }));

  const glossaryCategories = Array.from(
    new Set(['全部', ...raw.formulas.map((f) => f.category), '核心架构组件'])
  );

  const glossaryItems: GlossaryItemData[] = [
    ...raw.formulas.map((f) => ({
      id: f.id,
      termZh: f.name,
      termEn: f.category,
      category: f.category,
      summary: f.explanation,
      analogy: raw.coreIdea,
      technicalDetail: f.variables.map((v) => `${v.symbol}: ${v.desc}`).join(' ； '),
      paperApplication: f.explanation,
      formula: f.formula,
    })),
    ...raw.architectureSteps.map((s) => ({
      id: s.id,
      termZh: s.title,
      termEn: s.subtitle,
      category: '核心架构组件',
      summary: s.description,
      analogy: s.subtitle,
      technicalDetail: s.description,
      paperApplication: `在 ${raw.title} 架构中负责：${s.description}`,
    })),
  ];

  return {
    id: raw.id,
    arxivId: raw.arxivId.startsWith('arXiv:') ? raw.arxivId : `arXiv:${raw.arxivId}`,
    venueBadge,
    publishDate: venueBadge,
    absUrl: raw.abstractUrl,
    pdfUrl: raw.pdfUrl,
    systemTitleZh: `${raw.chineseTitle} · 精读与交互实验系统`,
    titleZh: raw.chineseTitle,
    titleEn: raw.title,
    authors,
    affiliations,
    tldrZh: raw.summary,
    coreInnovations: raw.takeaways.map((t) => ({ title: t.title, desc: t.desc })),
    abstractZh: `${raw.summary}\n\n【核心问题】${raw.coreProblem}\n\n【破局思路】${raw.coreIdea}`,
    abstractEn: `${raw.title} (${raw.subtitle}) — arXiv:${raw.arxivId}. ${raw.summary}`,
    bibtex: `@article{${raw.id.replace(/[^a-z0-9]/gi, '')},\n  title={${raw.title}},\n  author={${authors.join(' and ')}},\n  journal={arXiv preprint arXiv:${raw.arxivId}},\n  year={${venueBadge.match(/\d{4}/)?.[0] || '2020'}}\n}`,
    simulatorTabLabel: '交互式算法实验台',
    beginnerSteps,
    beginnerQuiz,
    chapters,
    benchmarks,
    comparisonTable,
    caseStudies,
    glossaryCategories,
    glossaryItems,
  };
}
