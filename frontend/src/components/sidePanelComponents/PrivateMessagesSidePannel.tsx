import React, { useEffect } from "react";
import { ChannelType } from "../../lib/type";
import { ScrollArea } from "../ui/ui/scroll-area";
import { Link } from "react-router-dom";
import { fetchApi } from "../../lib/api";
import Channel from "./ChannelDisplay";
import useChannelStorageStore from "../../store/channelStorage";

const getAllChannel = async (): Promise<ChannelType[]> => {
  const data = await fetchApi<ChannelType[]>(
    "GET",
    "channels?visibility=personnal"
  );
  return data;
};

const PrivateMessagesSidePannel = () => {
  const {channels, setChannels} = useChannelStorageStore();

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
            <Link to={`/messages/${channel._id}`}>
              <Channel
                id={channel._id}
                name={channel.name}
                owner={channel.owner}
              />
            </Link>
          </React.Fragment>
        ))}
      </ScrollArea>
    </>
  );
};

export default PrivateMessagesSidePannel;

