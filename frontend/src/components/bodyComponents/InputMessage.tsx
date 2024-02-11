import React, { useState } from 'react'; // Ensure React and useState are imported
import { Button } from "../ui/ui/button";
import { Textarea } from "../ui/ui/textarea";
import type { MessagesPostType } from "../../lib/type";
import { fetchApi } from "../../lib/api";
import useChannelMessageDisplayStore from "../../store/channelMessageDisplay";
import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:4000");

const postMessage = async (
  id: string,
  body: { text: string; author: string; channelId: string }
): Promise<MessagesPostType> => {
  const data = await fetchApi<MessagesPostType>(
    "POST",
    `channels/${id}/messages`,
    body
  );
  return data;
};

const InputMessage = () => {
  const { channelId } = useChannelMessageDisplayStore();
  const [message, setMessage] = useState("");
  const [author, setAuthor] = useState("user");

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  const handlePostMessage = async () => {
    if (!message.trim()) return; // Prevent sending empty messages

    const newMessage = await postMessage(channelId, { text: message, author, channelId });
    setMessage(""); // Clear input field on successful send

    socket.emit("newMessage", newMessage); // Emit new message event
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); 
      handlePostMessage(); 
    }
  };

  return (
    <div className="flex flex-row h-5 w-full p-2 gap-2">
      <Textarea
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