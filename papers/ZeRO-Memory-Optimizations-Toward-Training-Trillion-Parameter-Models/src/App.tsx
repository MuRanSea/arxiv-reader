import React from "react";
import { PaperModuleProps } from "../../../src/shared/types/paper.js";
import { PaperExplorerLayout } from "../../../src/shared/components/PaperExplorerLayout.js";
import { PAPER_DATA, ZERO_2019_DATA } from "./data/paperData.js";
import { Simulator } from "./components/Simulator.js";

export const Zero2019App: React.FC<PaperModuleProps> = ({
  onBackToHub,
  onBack,
  initialView = "beginner"
}) => {
  return (
    <PaperExplorerLayout
      paper={PAPER_DATA}
      data={ZERO_2019_DATA}
      simulatorComponent={<Simulator />}
      simulatorSlot={<Simulator />}
      onBackToHub={onBackToHub || onBack}
      onBack={onBack || onBackToHub}
      initialView={initialView}
    />
  );
};

export default Zero2019App;
