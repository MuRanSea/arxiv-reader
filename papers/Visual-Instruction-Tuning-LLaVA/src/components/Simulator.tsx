import React from "react";
import { IndustrialPaperSimulator } from "../../../../src/shared/components/IndustrialPaperSimulator.js";

export interface SimulatorProps {
  paperId?: string;
}

export const Simulator: React.FC<SimulatorProps> = ({ paperId = "llava-2023" }) => {
  return <IndustrialPaperSimulator paperId={paperId} />;
};

export const LlavaVisualProjectionSimulator = Simulator;
export default Simulator;
