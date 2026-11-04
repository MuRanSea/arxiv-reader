import React from 'react';
import { PaperModuleProps } from '../../../src/shared/types/paper.js';
import { PaperExplorerLayout } from '../../../src/shared/components/PaperExplorerLayout.js';
import { COLBERT_2020_PAPER_DATA } from './data/paperData.js';
import { ColbertMaxSimSimulator } from './components/ColbertMaxSimSimulator.js';

export default function Colbert2020App({ onBackToHub, initialView }: PaperModuleProps = {}) {
  return (
    <PaperExplorerLayout
      paper={COLBERT_2020_PAPER_DATA}
      simulatorComponent={<ColbertMaxSimSimulator />}
      onBackToHub={onBackToHub}
      initialView={initialView}
    />
  );
}
