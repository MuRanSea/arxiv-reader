import React from "react";
import { IndustrialPaperSimulator } from "../../../../src/shared/components/IndustrialPaperSimulator.js";

export interface SimulatorProps {
  paperId?: string;
}

export const Simulator: React.FC<SimulatorProps> = ({ paperId = "rope-2021" }) => {
  return <IndustrialPaperSimulator paperId={paperId} />;
};

export const RopeRotarySimulator = Simulator;
export default Simulator;
