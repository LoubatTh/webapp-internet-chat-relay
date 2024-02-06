import React from "react";
import useChannelMessageDisplayStore from "../../store/channelMessageDisplay";

type ChannelProps = {
  id: string;
  name: string;
};

const Channel = ({ id, name }: ChannelProps) => {
  const [setChannelId] = useChannelMessageDisplayStore((state) => [
    state.setChannelId,
  ]);

  const handleChannelMessageDisplay = () => {
    setChannelId(id);
    console.log("channelId", id);
  };

  return (
    <div
      className="bg-background text-background-foreground border-[1px] border-foreground rounded-md p-1 my-2 cursor-pointer"
      onClick={handleChannelMessageDisplay}
    >
      #{name}
    </div>
  );
};

export default Channel;
