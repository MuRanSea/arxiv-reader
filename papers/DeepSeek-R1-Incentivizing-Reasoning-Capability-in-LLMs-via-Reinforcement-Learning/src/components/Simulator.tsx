import React from "react";
import { IndustrialPaperSimulator } from "../../../../src/shared/components/IndustrialPaperSimulator.js";

export interface SimulatorProps {
  paperId?: string;
}

export const Simulator: React.FC<SimulatorProps> = ({ paperId = "deepseek-r1-2025" }) => {
  return <IndustrialPaperSimulator paperId={paperId} />;
};

export const DeepSeekR1GrpoSimulator = Simulator;
export default Simulator;
