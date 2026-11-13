import React from "react";
import { IndustrialPaperSimulator } from "../../../../src/shared/components/IndustrialPaperSimulator.js";

export interface SimulatorProps {
  paperId?: string;
}

export const Simulator: React.FC<SimulatorProps> = ({ paperId = "orca-2022" }) => {
  return <IndustrialPaperSimulator paperId={paperId} />;
};

export const OrcaContinuousBatchingSimulator = Simulator;
export default Simulator;
