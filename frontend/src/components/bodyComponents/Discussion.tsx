import React from "react";
import { messages } from "../../DUMMY/DUMMY-MESSAGE";
import { ScrollArea } from "../ui/ui/scroll-area";

const Discussion = () => {
  return (
    <div className="h-[calc(100%-50px)] w-[calc(100%-10px)]">
      <ScrollArea className="h-full w-full">
        {messages.messages.map((message) => (
          <div
            className={`my-4 px-4 w-4/5 flex flex-col ${
              message.userId == 101 ? "float-end" : ""
            }`}
            key={message.id}
          >
            <h3 className={`mb-2 ${message.userId == 101 ? "text-right" : ""}`}>
              {message.username}
            </h3>
            <p
              className={`border-sm rounded-md p-2 ${
                message.userId == 101
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              {message.text}
            </p>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

export default Discussion;
