import { useEffect, useState } from "react";
import InputMessage from "./InputMessage";
import UserMessage from "./userMessage";
import OtherUserMessage from "./otherUserMessage";
import { ScrollArea } from "../ui/ui/scroll-area";
import { fetchApi } from "../../lib/api";
import useChannelMessageDisplayStore from "../../store/channelMessageDisplay";
import type { MessagesType } from "../../lib/type";
import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:4000'); // Assurez-vous de remplacer l'URL par celle de votre serveur Socket.IO

const fetchMessages = async (id: string): Promise<MessagesType[]> => {
  const data = await fetchApi<MessagesType[]>("GET", `channels/${id}/messages`);
  return data;
};

const ChannelDiscussion = () => {
  const { channelId } = useChannelMessageDisplayStore();
  const [messages, setMessages] = useState<MessagesType[]>([]);

  useEffect(() => {
    if (!channelId) return;

    // Écouter les nouveaux messages via Socket.IO
    socket.on('newMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Récupérer les messages existants depuis l'API
    fetchMessages(channelId).then((data) => {
      setMessages(data);
    });

    return () => {
      // Nettoyer l'écouteur d'événement lorsque le composant est démonté
      socket.off('newMessage');
    };
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