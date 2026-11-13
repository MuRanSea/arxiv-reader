import React from "react";
import { PaperModuleProps } from "../../../src/shared/types/paper.js";
import { PaperExplorerLayout } from "../../../src/shared/components/PaperExplorerLayout.js";
import { PAPER_DATA, RLHF_2017_DATA } from "./data/paperData.js";
import { Simulator } from "./components/Simulator.js";

export const Rlhf2017App: React.FC<PaperModuleProps> = ({
  onBackToHub,
  onBack,
  initialView = "beginner"
}) => {
  return (
    <PaperExplorerLayout
      paper={PAPER_DATA}
      data={RLHF_2017_DATA}
      simulatorComponent={<Simulator />}
      simulatorSlot={<Simulator />}
      onBackToHub={onBackToHub || onBack}
      onBack={onBack || onBackToHub}
      initialView={initialView}
    />
  );
};

export default Rlhf2017App;
