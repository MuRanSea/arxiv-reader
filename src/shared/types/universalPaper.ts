import React from 'react';

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

export interface UniversalPaperData {
  id: string;
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
