import useChannelMessageDisplayStore from "../../store/channelMessageDisplay";

type ChannelProps = {
  id: number;
  name: string;
};

const Channel = ({ id, name }: ChannelProps) => {
  const { setChannelId } = useChannelMessageDisplayStore();

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
