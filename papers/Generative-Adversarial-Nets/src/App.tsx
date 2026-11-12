import React from 'react';
import { PaperModuleProps } from '../../../src/shared/types/paper.js';
import { PaperExplorerLayout } from '../../../src/shared/components/PaperExplorerLayout.js';
import { GAN_2014_DATA } from './data/paperData.js';
import { GanMinimaxSimulator } from './components/GanMinimaxSimulator.js';

export const Gan2014App: React.FC<PaperModuleProps> = ({ onBackToHub, initialView = 'beginner' }) => {
  return (
    <PaperExplorerLayout
      paper={GAN_2014_DATA}
      simulatorComponent={<GanMinimaxSimulator />}
      onBackToHub={onBackToHub}
      initialView={initialView}
    />
  );
};

export default Gan2014App;
