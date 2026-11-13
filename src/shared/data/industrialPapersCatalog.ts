import { StructuredPaperData } from '../types/universalPaper.js';
import { INDUSTRIAL_PAPERS_PILLAR_1_2 } from './industrialPapersPillar12.js';
import { INDUSTRIAL_PAPERS_PILLAR_3_4 } from './industrialPapersPillar34.js';

export const INDUSTRIAL_PAPERS_CATALOG: Record<string, StructuredPaperData> = {
  ...INDUSTRIAL_PAPERS_PILLAR_1_2,
  ...INDUSTRIAL_PAPERS_PILLAR_3_4
};
