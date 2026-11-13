import React from "react";
import { PaperModuleProps } from "../../../src/shared/types/paper.js";
import { PaperExplorerLayout } from "../../../src/shared/components/PaperExplorerLayout.js";
import { PAPER_DATA, RESNET_2015_DATA } from "./data/paperData.js";
import { Simulator } from "./components/Simulator.js";

export const Resnet2015App: React.FC<PaperModuleProps> = ({
  onBackToHub,
  onBack,
  initialView = "beginner"
}) => {
  return (
    <PaperExplorerLayout
      paper={PAPER_DATA}
      data={RESNET_2015_DATA}
      simulatorComponent={<Simulator />}
      simulatorSlot={<Simulator />}
      onBackToHub={onBackToHub || onBack}
      onBack={onBack || onBackToHub}
      initialView={initialView}
    />
  );
};

export default Resnet2015App;
