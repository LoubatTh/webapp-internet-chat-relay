import React, { useState } from "react";
import { Button } from "../ui/ui/button";
import { Textarea } from "../ui/ui/textarea";

const InputMessage = () => {
  const [message, setMessage] = useState<string>("");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); 
      sendMessage();
    }
  };

  const sendMessage = () => {
    setMessage("");
    console.log("Sending message:", message);
  };

  return (
    <div className="flex flex-row h-5 w-full p-2 gap-2">
      <Textarea
        className="resize-none text-secondary bg-white rounded-md w-full p-1 min-h-10"
        placeholder="Type your message here."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button className="h-10" onClick={sendMessage}>
        Send
      </Button>
    </div>
  );
};

export default InputMessage;