import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchApi } from "../../lib/api";
import { ChannelType } from "../../lib/type";
import Channel from "./ChannelDisplay";
import { ScrollArea } from "../ui/ui/scroll-area";

const getAllChannel = async (): Promise<ChannelType[]> => {
  const data = await fetchApi<ChannelType[]>("GET", "channels");
  return data;
};

const ChannelsSidePannel = () => {
  const [channels, setChannels] = useState<ChannelType[]>([]);

  const handleRemoveChannelFromArray = (value: string) => {
    setChannels(channels.filter((channel) => channel._id !== value));
  };

  useEffect(() => {
    getAllChannel().then((data) => {
      setChannels(data);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <ScrollArea className="h-[calc(100%-50px)] ">
        {channels.map((channel) => (
          <React.Fragment key={channel._id}>
            <Link to={`/channels/${channel._id}`}>
              <Channel
                id={channel._id}
                name={channel.name}
                removeChannel={handleRemoveChannelFromArray}
              />
            </Link>
          </React.Fragment>
        ))}
      </ScrollArea>
    </>
  );
};

export default ChannelsSidePannel;
