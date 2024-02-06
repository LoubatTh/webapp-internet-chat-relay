import React from "react";
import InputMessage from "./InputMessage";
import UserMessage from "./userMessage";
import OtherUserMessage from "./otherUserMessage";
import { messages } from "../../DUMMY/DUMMY-MESSAGE";
import { ScrollArea } from "../ui/ui/scroll-area";

const ChannelDiscussion = () => {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col h-[calc(100%-50px)] w-[calc(100%-10px)]">
        <ScrollArea className="h-full w-full">
          {messages.messages.map((message) =>
            message.userId === 101 ? (
              <UserMessage
                key={message.id}
                id={message.id}
                username={message.username}
                text={message.text}
              />
            ) : (
              <OtherUserMessage
                key={message.id}
                id={message.id}
                username={message.username}
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
