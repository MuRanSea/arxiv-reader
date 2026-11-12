import React from 'react';
import { PaperExplorerLayout } from '../../../src/shared/components/PaperExplorerLayout.js';
import { VIT_2020_DATA } from './data/paperData.js';
import { VitPatchSimulator } from './components/VitPatchSimulator.js';

interface PaperAppProps {
  onBackToHub?: () => void;
  initialView?: string;
}

export default function Vit2020App({ onBackToHub, initialView = 'beginner' }: PaperAppProps) {
  return (
    <PaperExplorerLayout
      paper={VIT_2020_DATA}
      simulatorComponent={<VitPatchSimulator />}
      onBackToHub={onBackToHub}
      initialView={initialView}
    />
  );
}
