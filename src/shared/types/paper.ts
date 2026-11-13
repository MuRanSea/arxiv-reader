import React from 'react';

export type ThemeMode = 'light' | 'dark';

export interface PaperModuleProps {
  onBackToHub?: () => void;
  onBack?: () => void;
  initialView?: string;
}

export type PaperCategory =
  | '大模型架构'
  | '训练与扩展定律'
  | '高效微调 (PEFT)'
  | '推理与服务栈'
  | '对齐与推理智能体'
  | '视觉与生成模型'
  | 'RAG与检索'
  | '智能体与推理'
  | '知识图谱';

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
