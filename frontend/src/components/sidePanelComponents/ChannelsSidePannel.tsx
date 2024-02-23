import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchApi } from "../../lib/api";
import { ChannelType } from "../../lib/type";
import Channel from "./ChannelDisplay";
import { ScrollArea } from "../ui/ui/scroll-area";
import CreateChannelComponent from "./CreateChannelComponent";
import useChannelStorageStore from "../../store/channelStorage";
import JoinChannelComponent from "./JoinChannelComponent";
import { getAccessToken, getIdentity } from "../../lib/utils";

const getAllChannel = async (user: string): Promise<ChannelType[]> => {
  if (getAccessToken()) {
    const data = await fetchApi<ChannelType[]>("GET", `users/${user}/channels`);
    return data;
  } else {
    const data = await fetchApi<ChannelType[]>("GET", `guests/${user}/channels`);
    return data;
  }
};

const ChannelsSidePannel = () => {
  const { channels, setChannels } = useChannelStorageStore();

  useEffect(() => {
    const user = getIdentity();
    if (!user) return;
    getAllChannel(user).then(async (data) => {
      setChannels(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <ScrollArea className="h-[calc(100%-50px)]">
        {channels.map((channel, index) => (
          <Link key={`${channel._id}-${index}`} to={`/channels/${channel._id}`}>
            <React.Fragment>
              <Channel
                id={channel._id}
                name={channel.name}
                owner={channel.owner}
              />
            </React.Fragment>
          </Link>
        ))}
      </ScrollArea>
      <CreateChannelComponent />
      <JoinChannelComponent />
    </>
  );
};

export default ChannelsSidePannel;
