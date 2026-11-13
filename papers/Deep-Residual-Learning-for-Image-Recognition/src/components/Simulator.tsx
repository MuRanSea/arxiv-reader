import React from "react";
import { IndustrialPaperSimulator } from "../../../../src/shared/components/IndustrialPaperSimulator.js";

export interface SimulatorProps {
  paperId?: string;
}

export const Simulator: React.FC<SimulatorProps> = ({ paperId = "resnet-2015" }) => {
  return <IndustrialPaperSimulator paperId={paperId} />;
};

export const ResNetResidualSimulator = Simulator;
export default Simulator;
