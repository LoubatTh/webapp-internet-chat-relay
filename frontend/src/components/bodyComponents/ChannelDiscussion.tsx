import { useEffect, useState, useRef, useLayoutEffect } from "react";
import type { MessagesType } from "../../lib/type";
import UserMessage from "../chatComponents/userMessage";
import OtherUserMessage from "../chatComponents/otherUserMessage";
import { ScrollArea } from "../ui/ui/scroll-area";
import { fetchApi } from "../../lib/api";
import { io, Socket } from "socket.io-client";
import { onCommand } from "../../lib/commands";
import { useParams } from "react-router-dom";
import InputMessage from "../chatComponents/InputMessage";
import { getIdentity, isUser } from "../../lib/utils";
import { useToast } from "../ui/ui/use-toast";

const socket: Socket = io("http://localhost:4000");

const fetchMessages = async (id: string) => {
  const response = await fetchApi("GET", `messages/${id}`);
  return response;
};

const fetchUser = async (id: string) => {
  const response = await fetchApi(
    "GET",
    `${isUser() ? "users" : "guests"}/${id}`
  );
  return response;
};

const ChannelDiscussion = () => {
  const { toast } = useToast();
  const channelId = useParams<{ channelId: string }>().channelId;
  const [messages, setMessages] = useState<MessagesType[]>([]);
  const [hiddenMessages, setHiddenMessages] = useState<string[]>([]);
  const [userConnected, setUserConnected] = useState<string>("");
  const [userChannels, setUserChannels] = useState<string[]>([]);
  const lastMessageRef = useRef(null);

  // Hide message function
  const handleHideMessage = (messageId: string) => {
    setHiddenMessages((prevHiddenMessages) => [
      ...prevHiddenMessages,
      messageId,
    ]);
  };

  const getUserChannels = async () => {
    const response = await fetchUser(userConnected);
    const data = response.data;
    const typeOfChannel =
      window.location.href.split("/")[
        window.location.href.split("/").length - 2
      ] !== "messages"
        ? data.channels
        : data.pmsgs;
    if (response.status === 200) {
      setUserChannels(typeOfChannel);
    } else {
      toast({
        variant: "error",
        description: `${data.message}`,
      });
    }
  };

  const fetchAllMessages = async () => {
    if (!userChannels.find((channel) => channel === channelId)) return;
    const response = await fetchMessages(channelId);
    const data = response.data;
    if (response.status === 200) {
      setMessages(data);
    } else {
      toast({
        variant: "error",
        description: `${data.message}`,
      });
    }
  };

  const handleCommand = async (command: string, args: string) => {
    const newMessages = await onCommand(command, args, channelId);
    setMessages((prevMessages) => [...prevMessages, ...newMessages]);
  };

  const isCommand = (message: MessagesType): boolean => {
    return message.author == "System";
  };

  useLayoutEffect(() => {
    if (lastMessageRef.current) {
      setTimeout(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    }
  }, [messages]);

  useEffect(() => {
    setMessages([]);
    const user = getIdentity();
    if (!user) return;
    setUserConnected(user);
    if (!channelId) return;
    getUserChannels();
    fetchAllMessages();

    socket.on("newMessage", (newMessage) => {
      if (newMessage.data.channelId === channelId) {
        setMessages((prevMessages) => [...prevMessages, newMessage.data]);
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [channelId]);

  return (
    <div className="flex flex-col bg-background w-full h-full gap-2">
      <div className="flex flex-col bg-secondary h-[calc(100%-44px)] w-[calc(100%-10px)] rounded-md">
        <ScrollArea className="h-full w-full">
          {messages.map((message, index) => (
            <div
              key={message._id}
              ref={index === messages.length - 1 ? lastMessageRef : null}
            >
              {hiddenMessages.includes(message._id) ? null : (
                <>
                  {message.authorId === userConnected ? (
                    <UserMessage
                      key={message._id}
                      username={message.author}
                      text={message.text}
                    />
                  ) : (
                    <OtherUserMessage
                      key={message._id}
                      username={message.author}
                      text={message.text}
                    />
                  )}
                  {isCommand(message) && (
                    <div className="pl-5 text-red-400" key={message._id}>
                      <button onClick={() => handleHideMessage(message._id)}>
                        <i>Cliquez ici</i>
                      </button>
                      <span> pour cacher ce message.</span>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </ScrollArea>
      </div>
      <div className="mb-2 ">
        <InputMessage onCommand={handleCommand} />
      </div>
    </div>
  );
};

export default ChannelDiscussion;
