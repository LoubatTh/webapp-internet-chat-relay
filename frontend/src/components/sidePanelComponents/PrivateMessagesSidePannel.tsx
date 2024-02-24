import React, { useEffect } from "react";
import { ChannelType } from "../../lib/type";
import { ScrollArea } from "../ui/ui/scroll-area";
import { Link } from "react-router-dom";
import { fetchApi } from "../../lib/api";
import Channel from "./ChannelDisplay";
import useChannelStorageStore from "../../store/channelStorage";
import { useToast } from "../ui/ui/use-toast";

const getPM = async (): Promise<ChannelType[]> => {
  const response = await fetchApi("GET", "pmsgs");
  return response;
};

const PrivateMessagesSidePannel = () => {
  const { toast } = useToast();
  const { channels, setChannels } = useChannelStorageStore();

  const getChannel = async () => {
    const response = await getPM();
    const data = response;
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
    getChannel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <ScrollArea className="h-[calc(100%-50px)]">
        {channels.length > 0 &&
          channels.map((channel) => (
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
