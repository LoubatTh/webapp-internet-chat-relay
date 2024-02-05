import React from "react";
import useSidePanelStore from "../store/sidePanelStore";

const SidePanel = () => {
  const [openSidePanel] = useSidePanelStore((state) => [state.openSidePanel]);
  return (
    <div
      className={`bg-secondary text-secondary-foreground border-r-2 border-background p-2 w-1/6 h-full ${
        openSidePanel ? "hidden" : ""
      }`}
    >
      <h1>Open</h1>
    </div>
  );
};

export default SidePanel;
