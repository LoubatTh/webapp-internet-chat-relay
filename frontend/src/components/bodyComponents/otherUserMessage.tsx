import React from "react";

type OtherUserMessageProps = {
  id: number;
  username: string;
  text: string;
};

const OtherUserMessage = ({ id, username, text }: OtherUserMessageProps) => {
  return (
    <div className="flex flex-col my-4 px-4 w-4/5" key={id}>
      <h3 className="mb-2">{username}</h3>
      <p className="border-sm rounded-md p-2 bg-primary text-primary-foreground w-fit">
        {text}
      </p>
    </div>
  );
};

export default OtherUserMessage;
