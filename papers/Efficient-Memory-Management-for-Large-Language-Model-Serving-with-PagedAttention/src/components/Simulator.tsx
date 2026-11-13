import React from "react";
import { IndustrialPaperSimulator } from "../../../../src/shared/components/IndustrialPaperSimulator.js";

export interface SimulatorProps {
  paperId?: string;
}

export const Simulator: React.FC<SimulatorProps> = ({ paperId = "pagedattention-2023" }) => {
  return <IndustrialPaperSimulator paperId={paperId} />;
};

export const PagedAttentionKvSimulator = Simulator;
export default Simulator;
