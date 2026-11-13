import React from "react";
import { IndustrialPaperSimulator } from "../../../../src/shared/components/IndustrialPaperSimulator.js";

export interface SimulatorProps {
  paperId?: string;
}

export const Simulator: React.FC<SimulatorProps> = ({ paperId = "speculative-decoding-2022" }) => {
  return <IndustrialPaperSimulator paperId={paperId} />;
};

export const SpeculativeDecodingSimulator = Simulator;
export default Simulator;
