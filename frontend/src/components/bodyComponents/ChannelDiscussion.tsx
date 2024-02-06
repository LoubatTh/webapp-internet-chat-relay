import { useEffect, useState } from "react";
import InputMessage from "./InputMessage";
import UserMessage from "./userMessage";
import OtherUserMessage from "./otherUserMessage";
import { ScrollArea } from "../ui/ui/scroll-area";
import { fetchApi } from "../../lib/api";
import useChannelMessageDisplayStore from "../../store/channelMessageDisplay";
import type { MessagesType } from "../../lib/type";

const fetchMessages = async (id: string): Promise<MessagesType[]> => {
  const data = await fetchApi<MessagesType[]>("GET", `channels/${id}/messages`);
  return data;
};

const ChannelDiscussion = () => {
  const { channelId } = useChannelMessageDisplayStore();
  const [messages, setMessages] = useState<MessagesType[]>([]);

  useEffect(() => {
    if (!channelId) return;
    fetchMessages(channelId).then((data) => {
      setMessages(data);
      console.log("data", data);
    });
  }, [channelId]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col h-[calc(100%-50px)] w-[calc(100%-10px)]">
        <ScrollArea className="h-full w-full">
          {messages.map((message) =>
            message._id === "101" ? (
              <UserMessage
                key={message._id}
                id={message._id}
                username={message.author}
                text={message.text}
              />
            ) : (
              <OtherUserMessage
                key={message._id}
                id={message._id}
                username={message.author}
                text={message.text}
              />
            )
          )}
        </ScrollArea>
      </div>
      <InputMessage />
    </div>
  );
};

export default ChannelDiscussion;
