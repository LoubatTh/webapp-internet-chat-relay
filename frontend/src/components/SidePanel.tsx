import { useEffect, useState } from "react";
import Channel from "./sidePanelComponents/Channel";
import useSidePanelStore from "../store/sidePanelStore";
import { fetchApi } from "../lib/api";
import type { ChannelType } from "../lib/type";
import { ScrollArea, ScrollBar } from "./ui/ui/scroll-area";

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
      className={`bg-secondary text-secondary-foreground border-r-2 border-background pl-2 w-1/6 h-[100%-8px] ${
        openSidePanel ? "hidden" : ""
      }`}
    >
      <h2 className="mb-2">Channel</h2>
      <ScrollArea className="h-[calc(100%-50px)] ">
      {channels.map((channel) => (
        <Channel key={channel._id} id={channel._id} name={channel.name} />
      ))}
      <ScrollBar className=""/>
      </ScrollArea>
    </div>
  );
};

export default SidePanel;
