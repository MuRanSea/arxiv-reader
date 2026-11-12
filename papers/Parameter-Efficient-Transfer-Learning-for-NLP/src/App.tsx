import React from 'react';
import { PaperExplorerLayout } from '../../../src/shared/components/PaperExplorerLayout.js';
import { PEFT_2019_DATA } from './data/paperData.js';
import { PeftArchitectureSimulator } from './components/PeftArchitectureSimulator.js';

interface PaperAppProps {
  onBackToHub?: () => void;
  initialView?: string;
}

export default function Peft2019App({ onBackToHub, initialView = 'beginner' }: PaperAppProps) {
  return (
    <PaperExplorerLayout
      paper={PEFT_2019_DATA}
      simulatorComponent={<PeftArchitectureSimulator />}
      onBackToHub={onBackToHub}
      initialView={initialView}
    />
  );
}
