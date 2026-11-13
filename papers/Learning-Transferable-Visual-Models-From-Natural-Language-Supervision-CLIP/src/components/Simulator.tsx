import React from "react";
import { IndustrialPaperSimulator } from "../../../../src/shared/components/IndustrialPaperSimulator.js";

export interface SimulatorProps {
  paperId?: string;
}

export const Simulator: React.FC<SimulatorProps> = ({ paperId = "clip-2021" }) => {
  return <IndustrialPaperSimulator paperId={paperId} />;
};

export const ClipContrastiveSimulator = Simulator;
export default Simulator;
