import React from 'react';
import { PaperModuleProps } from '../../../src/shared/types/paper.js';
import { PaperExplorerLayout } from '../../../src/shared/components/PaperExplorerLayout.js';
import { STABLE_DIFFUSION_2022_DATA } from './data/paperData.js';
import { LatentDiffusionSimulator } from './components/LatentDiffusionSimulator.js';

export const StableDiffusion2022App: React.FC<PaperModuleProps> = ({
  onBackToHub,
  initialView = 'beginner',
}) => {
  return (
    <PaperExplorerLayout
      paper={STABLE_DIFFUSION_2022_DATA}
      simulatorComponent={<LatentDiffusionSimulator />}
      onBackToHub={onBackToHub}
      initialView={initialView}
    />
  );
};

export default StableDiffusion2022App;
