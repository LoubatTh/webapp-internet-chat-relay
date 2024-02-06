import React, { useEffect, useState } from "react";
import Channel from "./sidePanelComponents/Channel";
import useSidePanelStore from "../store/sidePanelStore";
import { fetchApi } from "../lib/api";
import { ChannelType } from "../lib/type";

const getAllChannel = async () => {
  const data = await fetchApi("GET", "/channels");
  return data;
};

const SidePanel = () => {
  const [openSidePanel] = useSidePanelStore((state) => [state.openSidePanel]);
  const [channels, setChannels] = useState<ChannelType[]>([]);

  useEffect(() => {
    getAllChannel().then((data) => {
      setChannels(data);
    });
    console.log("channels", channels);
  }, [channels]);

  return (
    <div
      className={`bg-secondary text-secondary-foreground border-r-2 border-background p-2 w-1/6 h-[100%-8px] ${
        openSidePanel ? "hidden" : ""
      }`}
    >
      <h2 className="mb-2">Channel</h2>
      {channels.map((channel) => (
        <Channel key={channel._id} id={channel._id} name={channel.name} />
      ))}
    </div>
  );
};

export default SidePanel;
