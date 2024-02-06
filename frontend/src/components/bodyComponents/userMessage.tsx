import React from "react";

type UserMessageProps = {
  id: string;
  username: string;
  text: string;
};

const UserMessage = ({ id, username, text }: UserMessageProps) => {
  return (
    <div className="flex flex-col my-4 px-4 w-4/5 float-right" key={id}>
      <h3 className="mb-2 text-right">{username}</h3>
      <p className="border-sm rounded-md p-2 bg-secondary text-secondary-foreground w-fit self-end">
        {text}
      </p>
    </div>
  );
};

export default UserMessage;
