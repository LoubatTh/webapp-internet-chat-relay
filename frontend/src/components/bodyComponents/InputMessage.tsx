import { Button } from "../ui/ui/button";
import { Textarea } from "../ui/ui/textarea";
import type { MessagesPostType } from "../../lib/type";
import { fetchApi } from "../../lib/api";
import useChannelMessageDisplayStore from "../../store/channelMessageDisplay";
import { useState } from "react";

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
  const body = { text: message, author: author, channelId: channelId };

  const handlePosteMessage = async () => {
    postMessage(channelId, body);
  };
  return (
    <div className="flex flex-row h-5 w-full p-2 gap-2">
      <Textarea
        className="resize-none text-secondary bg-white rounded-md w-full p-1 min-h-10"
        placeholder="Type your message here."
      />
      <Button className="h-10" onClick={handlePosteMessage}>
        Send
      </Button>
    </div>
  );
};

export default InputMessage;
