import React from "react";
import { Button } from "../ui/ui/button";
import { Textarea } from "../ui/ui/textarea";

const InputMessage = () => {
  return (
    <div className="flex flex-row h-5 w-full p-2 gap-2">
      <Textarea
        className="resize-none text-secondary bg-white rounded-md w-full p-1 min-h-10"
        placeholder="Type your message here."
      />
      <Button className="h-10">Send</Button>
    </div>
  );
};

export default InputMessage;
