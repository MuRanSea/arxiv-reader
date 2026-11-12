import React from 'react';
import { PaperModuleProps } from '../../../src/shared/types/paper.js';
import { PaperExplorerLayout } from '../../../src/shared/components/PaperExplorerLayout.js';
import { GPT_2020_DATA } from './data/paperData.js';
import { GptInContextSimulator } from './components/GptInContextSimulator.js';

export const Gpt2020App: React.FC<PaperModuleProps> = ({ onBackToHub, initialView = 'beginner' }) => {
  return (
    <PaperExplorerLayout
      paper={GPT_2020_DATA}
      simulatorComponent={<GptInContextSimulator />}
      onBackToHub={onBackToHub}
      initialView={initialView}
    />
  );
};

export default Gpt2020App;
