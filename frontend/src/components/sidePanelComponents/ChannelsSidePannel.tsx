import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchApi } from "../../lib/api";
import Channel from "./ChannelDisplay";
import { ScrollArea } from "../ui/ui/scroll-area";
import CreateChannelComponent from "./CreateChannelComponent";
import useChannelStorageStore from "../../store/channelStorage";
import JoinChannelComponent from "./JoinChannelComponent";
import { getAccessToken, getIdentity } from "../../lib/utils";
import { useToast } from "../ui/ui/use-toast";

const getAllChannel = async (username: string) => {
  if (getAccessToken()) {
    const response = await fetchApi("GET", `users/${username}/channels`);
    return response;
  } else {
    const response = await fetchApi("GET", `guests/${username}/channels`);
    return response;
  }
};

const ChannelsSidePannel = () => {
  const { toast } = useToast();
  const { channels, setChannels } = useChannelStorageStore();

  const getChannel = async (username: string) => {
    const response = await getAllChannel(username);
    const data = response.data;
    if (response.status === 200) {
      setChannels(data);
    } else {
      toast({
        variant: "error",
        description: `${data.message}`,
      });
    }
  };

  useEffect(() => {
    const user = getIdentity();
    if (!user) return;
    getChannel(user);
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
