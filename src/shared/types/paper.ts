import React from 'react';

export type ThemeMode = 'light' | 'dark';

export interface PaperModuleProps {
  onBackToHub?: () => void;
  initialView?: string;
}

export type PaperCategory = 'RAG与检索' | '大模型架构' | '智能体与推理' | '知识图谱';

export interface PaperMetric {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface PaperRegistryItem {
  id: string;
  folderName: string;
  titleZh: string;
  titleEn: string;
  arxivId: string;
  doi: string;
  githubUrl?: string;
  authors: string[];
  affiliations: string[];
  publishDate: string;
  category: PaperCategory;
  tags: string[];
  status: 'active' | 'coming-soon';
  tldrZh: string;
  keyMetrics: PaperMetric[];
  features: string[];
  component?: React.ComponentType<PaperModuleProps>;
}
