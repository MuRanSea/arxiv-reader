import React from 'react';
import { PaperModuleProps } from '../../../src/shared/types/paper.js';
import { PaperExplorerLayout } from '../../../src/shared/components/PaperExplorerLayout.js';
import { VAE_2013_DATA } from './data/paperData.js';
import { VaeLatentSimulator } from './components/VaeLatentSimulator.js';

export const Vae2013App: React.FC<PaperModuleProps> = ({ onBackToHub, initialView = 'beginner' }) => {
  return (
    <PaperExplorerLayout
      paper={VAE_2013_DATA}
      simulatorComponent={<VaeLatentSimulator />}
      onBackToHub={onBackToHub}
      initialView={initialView}
    />
  );
};

export default Vae2013App;
