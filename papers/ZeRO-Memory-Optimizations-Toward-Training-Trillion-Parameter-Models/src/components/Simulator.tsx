import React from "react";
import { IndustrialPaperSimulator } from "../../../../src/shared/components/IndustrialPaperSimulator.js";

export interface SimulatorProps {
  paperId?: string;
}

export const Simulator: React.FC<SimulatorProps> = ({ paperId = "zero-2019" }) => {
  return <IndustrialPaperSimulator paperId={paperId} />;
};

export const ZeroShardingSimulator = Simulator;
export default Simulator;
