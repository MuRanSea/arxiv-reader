import React from "react";
import { PaperModuleProps } from "../../../src/shared/types/paper.js";
import { PaperExplorerLayout } from "../../../src/shared/components/PaperExplorerLayout.js";
import { PAPER_DATA, DEEPSEEK_R1_2025_DATA } from "./data/paperData.js";
import { Simulator } from "./components/Simulator.js";

export const DeepSeekR12025App: React.FC<PaperModuleProps> = ({
  onBackToHub,
  onBack,
  initialView = "beginner"
}) => {
  return (
    <PaperExplorerLayout
      paper={PAPER_DATA}
      data={DEEPSEEK_R1_2025_DATA}
      simulatorComponent={<Simulator />}
      simulatorSlot={<Simulator />}
      onBackToHub={onBackToHub || onBack}
      onBack={onBack || onBackToHub}
      initialView={initialView}
    />
  );
};

export default DeepSeekR12025App;
