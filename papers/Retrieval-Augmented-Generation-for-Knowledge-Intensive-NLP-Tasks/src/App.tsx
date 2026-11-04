import React from 'react';
import { PaperModuleProps } from '../../../src/shared/types/paper.js';
import { PaperExplorerLayout } from '../../../src/shared/components/PaperExplorerLayout.js';
import { RAG_2020_PAPER_DATA } from './data/paperData.js';
import { RagMarginalizationSimulator } from './components/RagMarginalizationSimulator.js';

export default function Rag2020App({ onBackToHub, initialView }: PaperModuleProps = {}) {
  return (
    <PaperExplorerLayout
      paper={RAG_2020_PAPER_DATA}
      simulatorComponent={<RagMarginalizationSimulator />}
      onBackToHub={onBackToHub}
      initialView={initialView}
    />
  );
}
