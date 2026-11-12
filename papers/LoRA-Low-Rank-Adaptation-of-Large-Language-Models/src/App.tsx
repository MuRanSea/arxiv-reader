import React from 'react';
import { PaperExplorerLayout } from '../../../src/shared/components/PaperExplorerLayout.js';
import { LORA_2021_DATA } from './data/paperData.js';
import { LoraRankSimulator } from './components/LoraRankSimulator.js';

interface PaperAppProps {
  onBackToHub?: () => void;
  initialView?: string;
}

export default function Lora2021App({ onBackToHub, initialView = 'beginner' }: PaperAppProps) {
  return (
    <PaperExplorerLayout
      paper={LORA_2021_DATA}
      simulatorComponent={<LoraRankSimulator />}
      onBackToHub={onBackToHub}
      initialView={initialView}
    />
  );
}
