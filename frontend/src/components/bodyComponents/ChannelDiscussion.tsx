import React, { useEffect, useState, useRef } from "react";
import InputMessage from "./InputMessage";
import UserMessage from "./userMessage";
import OtherUserMessage from "./otherUserMessage";
import { ScrollArea } from "../ui/ui/scroll-area";
import { fetchApi } from "../../lib/api";
import useChannelMessageDisplayStore from "../../store/channelMessageDisplay";
import type { MessagesType } from "../../lib/type";
import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:4000'); // Connect to the Socket server

const fetchMessages = async (id: string): Promise<MessagesType[]> => {
  const data = await fetchApi<MessagesType[]>("GET", `channels/${id}/messages`);
  return data;
};

const ChannelDiscussion = () => {
  const { channelId } = useChannelMessageDisplayStore();
  const [messages, setMessages] = useState<MessagesType[]>([]);
  const scrollAreaRef = useRef(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!channelId) return;

    // Listening for new message event
    socket.on('newMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Get messages from the API
    fetchMessages(channelId).then((data) => {
      setMessages(data);
    });

    return () => {
      // Clean up the event listener
      socket.off('newMessage');
    };
  }, [channelId]);

  useEffect(() => {
    // Scroll down after each message update
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col h-[calc(100%-50px)] w-[calc(100%-10px)]">
        <ScrollArea className="h-full w-full" ref={scrollAreaRef}>
          {messages.map((message, index) => (
            <div
              ref={index === messages.length - 1 ? lastMessageRef : null}
              key={message._id}
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
      <InputMessage />
    </div>
  );
};

export default ChannelDiscussion;
