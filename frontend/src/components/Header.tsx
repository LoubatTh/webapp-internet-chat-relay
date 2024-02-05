import React from "react";
import useSidePanelStore from "../store/sidePanelStore";

const Header = () => {
  const [openSidePanel, setOpenSidePanel] = useSidePanelStore((state) => [
    state.openSidePanel,
    state.setOpenSidePanel,
  ]);
  const HandleOpenSidePanel = () => {
    setOpenSidePanel(!openSidePanel);
    console.log("openSidePanel", openSidePanel);
  };
  return (
    <header className="bg-secondary text-secondary-foreground border-b-2 border-background p-2 h-20 w-full">
      <button onClick={HandleOpenSidePanel}>Open side panel</button>
    </header>
  );
};

export default Header;
