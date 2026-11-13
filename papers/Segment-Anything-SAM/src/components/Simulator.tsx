import React from "react";
import { IndustrialPaperSimulator } from "../../../../src/shared/components/IndustrialPaperSimulator.js";

export interface SimulatorProps {
  paperId?: string;
}

export const Simulator: React.FC<SimulatorProps> = ({ paperId = "sam-2023" }) => {
  return <IndustrialPaperSimulator paperId={paperId} />;
};

export const SamPromptableMaskSimulator = Simulator;
export default Simulator;
