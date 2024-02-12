import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import InputMessage from "../components/bodyComponents/InputMessage";
import UserMessage from "../components/bodyComponents/userMessage";
import OtherUserMessage from "../components/bodyComponents/otherUserMessage";
import { ScrollArea } from "../components/ui/ui/scroll-area";
import { fetchApi } from "../lib/api";
import type { MessagesType } from "../lib/type";
import { io, Socket } from 'socket.io-client';
import { onCommand } from "../lib/commands";
import { useParams } from "react-router-dom";

const socket: Socket = io('http://localhost:4000');

const fetchMessages = async (id: string): Promise<MessagesType[]> => {
  const data = await fetchApi<MessagesType[]>("GET", `channels/${id}/messages`);
  return data;
};

const ChannelDiscussion = () => {
  const channelId = useParams<{ channelId: string }>().channelId;
  const [messages, setMessages] = useState<MessagesType[]>([]);
  const lastMessageRef = useRef(null);
  const [hiddenMessages, setHiddenMessages] = useState<string[]>([]);

  // Hide message function
  const handleHideMessage = (messageId: string) => {
    setHiddenMessages((prevHiddenMessages) => [...prevHiddenMessages, messageId]);
  };

  const handleCommand = (command: string, args: string) => {
    const newMessages = onCommand(command, args);
    setMessages((prevMessages) => [...prevMessages, ...newMessages]);
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
      setTimeout(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }
  }, [messages]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col h-[calc(100%-50px)] w-[calc(100%-10px)]">
        <ScrollArea className="h-full w-full">
          {messages.map((message, index) => (
            <div key={message._id} ref={index === messages.length - 1 ? lastMessageRef : null}>
              {hiddenMessages.includes(message._id) ? null : (
                <>
                  {message._id === '101' ? (
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
                  {isCommand(message) && (
                    <div className="pl-5 text-red-400">
                   <button onClick={() => handleHideMessage(message._id)}><i>Cliquez ici</i></button>
                   <span> pour cacher ce message.</span>
                 </div>
                  )}
                </>
              )}
            </div>
          ))}
        </ScrollArea>
      </div>
      <InputMessage onCommand={handleCommand} />
    </div>
  );
};

const isCommand = (message: MessagesType): boolean => {
  return message.author == 'System';
};

export default ChannelDiscussion;
