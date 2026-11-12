import React from 'react';
import { PaperExplorerLayout } from '../../../src/shared/components/PaperExplorerLayout.js';
import { TRANSFORMER_2017_DATA } from './data/paperData.js';
import { TransformerAttentionSimulator } from './components/TransformerAttentionSimulator.js';

interface PaperAppProps {
  onBackToHub?: () => void;
  initialView?: string;
}

export default function Transformer2017App({ onBackToHub, initialView = 'beginner' }: PaperAppProps) {
  return (
    <PaperExplorerLayout
      paper={TRANSFORMER_2017_DATA}
      simulatorComponent={<TransformerAttentionSimulator />}
      onBackToHub={onBackToHub}
      initialView={initialView}
    />
  );
}
