import React from "react";
import { IndustrialPaperSimulator } from "../../../../src/shared/components/IndustrialPaperSimulator.js";

export interface SimulatorProps {
  paperId?: string;
}

export const Simulator: React.FC<SimulatorProps> = ({ paperId = "chinchilla-2022" }) => {
  return <IndustrialPaperSimulator paperId={paperId} />;
};

export const ChinchillaScalingSimulator = Simulator;
export default Simulator;
