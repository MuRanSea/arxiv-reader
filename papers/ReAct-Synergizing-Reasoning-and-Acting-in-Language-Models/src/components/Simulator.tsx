import React from "react";
import { IndustrialPaperSimulator } from "../../../../src/shared/components/IndustrialPaperSimulator.js";

export interface SimulatorProps {
  paperId?: string;
}

export const Simulator: React.FC<SimulatorProps> = ({ paperId = "react-2022" }) => {
  return <IndustrialPaperSimulator paperId={paperId} />;
};

export const ReactAgentLoopSimulator = Simulator;
export default Simulator;
