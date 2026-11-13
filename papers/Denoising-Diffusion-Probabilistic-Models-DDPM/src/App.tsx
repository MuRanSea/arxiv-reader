import React from "react";
import { PaperModuleProps } from "../../../src/shared/types/paper.js";
import { PaperExplorerLayout } from "../../../src/shared/components/PaperExplorerLayout.js";
import { PAPER_DATA, DDPM_2020_DATA } from "./data/paperData.js";
import { Simulator } from "./components/Simulator.js";

export const Ddpm2020App: React.FC<PaperModuleProps> = ({
  onBackToHub,
  onBack,
  initialView = "beginner"
}) => {
  return (
    <PaperExplorerLayout
      paper={PAPER_DATA}
      data={DDPM_2020_DATA}
      simulatorComponent={<Simulator />}
      simulatorSlot={<Simulator />}
      onBackToHub={onBackToHub || onBack}
      onBack={onBack || onBackToHub}
      initialView={initialView}
    />
  );
};

export default Ddpm2020App;
