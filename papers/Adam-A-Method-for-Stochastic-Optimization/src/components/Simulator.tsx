import React from "react";
import { IndustrialPaperSimulator } from "../../../../src/shared/components/IndustrialPaperSimulator.js";

export interface SimulatorProps {
  paperId?: string;
}

export const Simulator: React.FC<SimulatorProps> = ({ paperId = "adam-2014" }) => {
  return <IndustrialPaperSimulator paperId={paperId} />;
};

export const AdamOptimizerSimulator = Simulator;
export default Simulator;
