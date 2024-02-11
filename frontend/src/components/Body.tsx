import React from "react";
import ChannelDiscussion from "./bodyComponents/ChannelDiscussion";
const Body = () => {
  return (
    <>
      <div className="flex bg-background h-[calc(100%-20px)] w-full">
        <ChannelDiscussion />
      </div>
    </>
  );
};

export default Body;
