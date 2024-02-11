import React, { useEffect, useState } from "react";
import Channel from "./sidePanelComponents/Channel";
import useSidePanelStore from "../store/sidePanelStore";
import { fetchApi } from "../lib/api";
import type { ChannelType } from "../lib/type";

const getAllChannel = async (): Promise<ChannelType[]> => {
  const data = await fetchApi<ChannelType[]>("GET", "channels");
  return data;
};

const SidePanel = () => {
  const { openSidePanel } = useSidePanelStore();
  const [channels, setChannels] = useState<ChannelType[]>([]);

  useEffect(() => {
    getAllChannel().then((data) => {
      setChannels(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`bg-secondary text-secondary-foreground border-r-2 border-background p-2 w-1/6 h-[100%-8px] overflow-y-auto ${
        openSidePanel ? "hidden" : ""
      }`}
      style={{ boxShadow: "2px 0px 5px rgba(0, 0, 0, 0.1)" }}
    >
      <h2 className="mb-2">Channel</h2>
      {channels.map((channel) => (
        <Channel key={channel._id} id={channel._id} name={channel.name} />
      ))}
    </div>
  );
};

export default SidePanel;
