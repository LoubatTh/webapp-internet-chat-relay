import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import InputMessage from "./InputMessage";
import UserMessage from "./userMessage";
import OtherUserMessage from "./otherUserMessage";
import { ScrollArea } from "../ui/ui/scroll-area";
import { fetchApi } from "../../lib/api";
import useChannelMessageDisplayStore from "../../store/channelMessageDisplay";
import type { MessagesType } from "../../lib/type";
import { io, Socket } from 'socket.io-client';
import Markdown from "react-markdown";

const socket: Socket = io('http://localhost:4000');

const fetchMessages = async (id: string): Promise<MessagesType[]> => {
  const data = await fetchApi<MessagesType[]>("GET", `channels/${id}/messages`);
  return data;
};

const ChannelDiscussion = () => {
  const { channelId } = useChannelMessageDisplayStore();
  const [messages, setMessages] = useState<MessagesType[]>([]);
  const [helpMessage, setHelpMessage] = useState<string | null>(null);
  const lastMessageRef = useRef(null);

  const onCommand = (command) => {
    switch (command) {
      case 'help':
        // Display help message
        setMessages((prevMessages) => [
          ...prevMessages,
          { _id: 'system-message', author: 'System', text: 'La liste des commandes : ...' },
        ]);
        break;
      default:
        // If command is not recognized
        setMessages((prevMessages) => [
          ...prevMessages,
          { _id: 'system-message', author: 'System', text: `Commande non reconnue : ${command}` },
        ]);
        break;
    }
  };

  useEffect(() => {
    if (!channelId) return;

    socket.on('newMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    fetchMessages(channelId).then((data) => {
      setMessages(data);
    });

    return () => {
      socket.off('newMessage');
    };
  }, [channelId]);

  useLayoutEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col h-[calc(100%-50px)] w-[calc(100%-10px)]">
        <ScrollArea className="h-full w-full">
          {messages.map((message, index) => (
            <div
              key={message._id}
              ref={index === messages.length - 1 ? lastMessageRef : null}
            >
              {message._id === "101" ? (
                <UserMessage
                  id={message._id}
                  username={message.author}
                  text={message.text}
                />
              ) : (
                <OtherUserMessage
                  id={message._id}
                  username={message.author}
                  text={message.text}
                />
              )}
            </div>
          ))}
        </ScrollArea>
      </div>
      <InputMessage onCommand={onCommand} />
    </div>
  );
};

export default ChannelDiscussion;
