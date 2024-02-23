import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchApi } from "../../lib/api";
import { ChannelType } from "../../lib/type";
import Channel from "./ChannelDisplay";
import { ScrollArea } from "../ui/ui/scroll-area";
import CreateChannelComponent from "./CreateChannelComponent";
import useChannelStorageStore from "../../store/channelStorage";
import JoinChannelComponent from "./JoinChannelComponent";
import { getIdentity } from "../../lib/utils";

const getAllChannel = async (user: string): Promise<ChannelType[]> => {
  const data = await fetchApi<ChannelType[]>("GET", `guests/${user}/channels`);
  return data;
};

const ChannelsSidePannel = () => {
  const { channels, setChannels } = useChannelStorageStore();

  useEffect(() => {
    const user = getIdentity();
    if (!user) return;
    getAllChannel(user).then((data) => {
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
                owner={channel.owner}
              />
            </Link>
          </React.Fragment>
        ))}
      </ScrollArea>
      <CreateChannelComponent />
      <JoinChannelComponent />
    </>
  );
};

export default ChannelsSidePannel;
