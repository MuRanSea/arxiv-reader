import React from "react";
import { IndustrialPaperSimulator } from "../../../../src/shared/components/IndustrialPaperSimulator.js";

export interface SimulatorProps {
  paperId?: string;
}

export const Simulator: React.FC<SimulatorProps> = ({ paperId = "ddpm-2020" }) => {
  return <IndustrialPaperSimulator paperId={paperId} />;
};

export const DdpmDiffusionDenoiseSimulator = Simulator;
export default Simulator;
