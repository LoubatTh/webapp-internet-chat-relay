import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import InputMessage from "./InputMessage";
import UserMessage from "./userMessage";
import OtherUserMessage from "./otherUserMessage";
import { ScrollArea } from "../ui/ui/scroll-area";
import { fetchApi } from "../../lib/api";
import useChannelMessageDisplayStore from "../../store/channelMessageDisplay";
import type { MessagesType } from "../../lib/type";
import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:4000');

const randomId = () => {
  return Math.floor(Math.random() * 1000).toString();
};

const fetchMessages = async (id: string): Promise<MessagesType[]> => {
  const data = await fetchApi<MessagesType[]>("GET", `channels/${id}/messages`);
  return data;
};


const ChannelDiscussion = () => {
  const { channelId } = useChannelMessageDisplayStore();
  const [messages, setMessages] = useState<MessagesType[]>([]);
  const lastMessageRef = useRef(null);

  const onCommand = (command: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, args: any) => {
    switch (command) {
      case 'help':
        // Display help message
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            channelId: 'system',
            _id: `system-message-help-${randomId()}`,
            author: 'System', 
            text: (
              <>
                Voici la liste des commandes disponibles : <br />
                - <strong>/nick <i>[nickname]</i></strong> : Définit le pseudo de l'utilisateur sur le serveur. <br />
                - <strong>/list <i>[string]</i></strong> : Liste les canaux disponibles du serveur. Si une chaîne est spécifiée, affiche uniquement ceux dont le nom contient la chaîne. <br />
                - <strong>/create <i>[channel]</i></strong> : Crée un canal avec le nom spécifié. <br />
                - <strong>/delete <i>[channel]</i></strong>: Supprime le canal avec le nom spécifié. <br />
                - <strong>/join <i>[channel]</i></strong>: Rejoint le canal spécifié. <br />
                - <strong>/quit <i>[channel]</i></strong>: Quitte le canal spécifié. <br />
                - <strong>/users</strong>: Liste les utilisateurs actuellement dans le canal. <br />
                - <strong>/msg <i>[nickname] [message]</i></strong>: Envoie un message privé au pseudo spécifié. <br />
                - <strong>message</strong>: Envoie un message à tous les utilisateurs sur le canal.
              </>
            ),
          },
        ]);
        break;
        case 'nick':
          // Change user nickname
          if(!args) return setMessages((prevMessages) => [
            ...prevMessages,
            {
              channelId: 'system',
              _id: `system-message-help-${randomId()}`,
              author: 'System',
              length: 0,
              text: (
                <>
                  Veuillez spécifier un pseudo. <br />
                  Exemple : <strong>/nick <i>[nickname]</i></strong>
                </>
              ), },
          ]);
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              channelId: 'system',
              _id: `system-message-help-${randomId()}`,
              length: 0,
              author: 'System', 
              text: (
                <>
                  Commande /nick non implémentée.
                </>
              ),
            },
          ]);
          break;
        // case 'list':
        //   // List available channels
        //   setMessages('Commande /list non implémentée.');
        //   break;
        // case 'create':
        //   // Create a new channel
        //   setMessages('Commande /create non implémentée.');
        //   break;
        // case 'delete':
        //   // Delete a channel
        //   setMessages('Commande /delete non implémentée.');
        //   break;
        // case 'join':
        //   // Join a channel
        //   setMessages('Commande /join non implémentée.');
        //   break;
        // case 'quit':
        //   // Quit a channel
        //   setMessages('Commande /quit non implémentée.');
        //   break;
        // case 'users':
        //   // List users in the channel
        //   setMessages('Commande /users non implémentée.');
        //   break;
        // case 'msg':
        //   // Send a private message
        //   setMessages('Commande /msg non implémentée.');
        //   break;
      default:
        // If command is not recognized
        setMessages((prevMessages) => [
          ...prevMessages,
          {
          channelId: 'system',
          _id: `system-message-notfound-${randomId()}`,
          author: 'System',
          length: 0,
          text: (
            <>
            Commande <strong><i>/{command}</i></strong> non reconnue.<br />
            Tapez <strong>/help</strong> pour afficher la liste des commandes disponibles. 
            </>
          )
        },
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
