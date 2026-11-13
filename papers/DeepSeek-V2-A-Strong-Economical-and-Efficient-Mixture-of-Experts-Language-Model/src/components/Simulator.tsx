import React from "react";
import { IndustrialPaperSimulator } from "../../../../src/shared/components/IndustrialPaperSimulator.js";

export interface SimulatorProps {
  paperId?: string;
}

export const Simulator: React.FC<SimulatorProps> = ({ paperId = "deepseek-v2-2024" }) => {
  return <IndustrialPaperSimulator paperId={paperId} />;
};

export const DeepSeekV2MlaMoeSimulator = Simulator;
export default Simulator;
