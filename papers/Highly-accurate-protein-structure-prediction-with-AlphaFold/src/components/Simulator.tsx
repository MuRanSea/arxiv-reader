import React from "react";
import { IndustrialPaperSimulator } from "../../../../src/shared/components/IndustrialPaperSimulator.js";

export interface SimulatorProps {
  paperId?: string;
}

export const Simulator: React.FC<SimulatorProps> = ({ paperId = "alphafold2-2021" }) => {
  return <IndustrialPaperSimulator paperId={paperId} />;
};

export const AlphaFold2EvoformerIpaSimulator = Simulator;
export default Simulator;
