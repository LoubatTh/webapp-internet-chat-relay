import React from "react";
import Discussion from "./Discussion";
import InputMessage from "./InputMessage";

const ChannelDiscussion = () => {
  return (
    <div className="flex flex-col w-full h-full">
      <Discussion />
      <InputMessage />
    </div>
  );
};

export default ChannelDiscussion;
