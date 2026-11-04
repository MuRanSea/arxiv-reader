import React from 'react';
import { PaperModuleProps } from '../../../src/shared/types/paper.js';
import { PaperExplorerLayout } from '../../../src/shared/components/PaperExplorerLayout.js';
import { DPR_2020_PAPER_DATA } from './data/paperData.js';
import { DprContrastiveSimulator } from './components/DprContrastiveSimulator.js';

export default function Dpr2020App({ onBackToHub, initialView }: PaperModuleProps = {}) {
  return (
    <PaperExplorerLayout
      paper={DPR_2020_PAPER_DATA}
      simulatorComponent={<DprContrastiveSimulator />}
      onBackToHub={onBackToHub}
      initialView={initialView}
    />
  );
}
