import React from 'react';
import { PaperModuleProps } from '../../../src/shared/types/paper.js';
import { PaperExplorerLayout } from '../../../src/shared/components/PaperExplorerLayout.js';
import { BERT_2018_DATA } from './data/paperData.js';
import { BertMlmSimulator } from './components/BertMlmSimulator.js';

export const Bert2018App: React.FC<PaperModuleProps> = ({ onBackToHub, initialView = 'beginner' }) => {
  return (
    <PaperExplorerLayout
      paper={BERT_2018_DATA}
      simulatorComponent={<BertMlmSimulator />}
      onBackToHub={onBackToHub}
      initialView={initialView}
    />
  );
};

export default Bert2018App;
