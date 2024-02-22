import type { MessagesPostType } from "../../lib/type";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/ui/button";
import { fetchApi } from "../../lib/api";
import useChannelMessageDisplayStore from "../../store/channelMessageDisplay";
import { io, Socket } from "socket.io-client";
import { Input } from "../ui/ui/input";
import { getIdentity } from "../../lib/localstorage";

const socket: Socket = io("http://localhost:4001");

const postMessage = async (body: {
  text: string;
  authorId: string;
  channelId: string;
  author: string
}): Promise<MessagesPostType> => {
  const data = await fetchApi<MessagesPostType>(
    "POST",
    `channels/${body.channelId}/messages`,
    body
  );
  return data;
};

const InputMessage = ({
  onCommand,
}: {
  onCommand: (command: string, args: string) => void;
}) => {
  const { channelId } = useChannelMessageDisplayStore();
  const [message, setMessage] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [author, setAuthor] = useState("");

  const handleInputChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setMessage(event.target.value);
  };

  const handlePostMessage = async () => {
    if (!message.trim()) return; // Prevent sending empty messages

    const trimmedMessage = message.trim();
    const isCommand = trimmedMessage.startsWith("/");

    if (isCommand) {
      // If message is a command, parse it
      const [command, ...argsArray] = trimmedMessage.slice(1).split(" ");
      const args = argsArray.join(" ");

      // Get the command and its arguments
      onCommand(command, args);
      console.log("Commande", command);
    } else {
      // If message is not a command, send it as a regular message
      const newMessage = await postMessage({
        text: trimmedMessage,
        authorId: authorId,
        channelId, author,
      });
      console.log("mess",newMessage)
      socket.emit("newMessage", newMessage); // Emit new message event
    }

    setMessage(""); // Clear input field on successful send
  };

  const handleKeyDown = (event: {
    key: string;
    shiftKey: unknown;
    preventDefault: () => void;
  }) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handlePostMessage();
    }
  };

  useEffect(() => {
    // Retrieve 'identity' from localStorage when the component mounts
    const storedIdentity = getIdentity();
    if (storedIdentity) {
      setAuthorId(storedIdentity);
    }
  }, []);

  useEffect(() => {
    setMessage("");
  }, [channelId]);

  return (
    <div className="flex flex-row bg-background h-5 w-full pr-2 pt-2 gap-2">
      <Input
        className="resize-none text-secondary bg-white rounded-md w-full p-1 min-h-10"
        placeholder="Type your message here."
        value={message} // Controlled component
        onChange={handleInputChange} // Update state on change
        onKeyDown={handleKeyDown} // Handle enter key press
      />
      <Button className="h-10" onClick={handlePostMessage}>
        Send
      </Button>
    </div>
  );
};

export default InputMessage;
