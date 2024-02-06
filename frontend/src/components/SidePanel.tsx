import React from "react";
import useSidePanelStore from "../store/sidePanelStore";
import { channels } from "../DUMMY/DUMMY-CHANNEL";
import Channel from "./sidePanelComponents/Channel";

const SidePanel = () => {
  const [openSidePanel] = useSidePanelStore((state) => [state.openSidePanel]);
  return (
    <div
      className={`bg-secondary text-secondary-foreground border-r-2 border-background p-2 w-1/6 h-[100%-8px] ${
        openSidePanel ? "hidden" : ""
      }`}
    >
      <h2 className="mb-2">Channel</h2>
      {channels.channels.map((channel) => (
        <Channel key={channel.id} id={channel.id} name={channel.channelName} />
      ))}
    </div>
  );
};

export default SidePanel;
