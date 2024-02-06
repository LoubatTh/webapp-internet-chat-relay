import React from "react";
import useSidePanelStore from "../store/sidePanelStore";
import { MessageCircle } from "lucide-react";

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
    <header className="flex center bg-secondary text-secondary-foreground border-b-2 border-background p-2 h-20 w-full">
      <div className="h-full pl-2">
        <button className="h-full" onClick={HandleOpenSidePanel}>
          <MessageCircle size={60} />
        </button>
      </div>
    </header>
  );
};

export default Header;
