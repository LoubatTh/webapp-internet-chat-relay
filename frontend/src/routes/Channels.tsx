import ChannelsSidePannel from "../components/sidePanelComponents/ChannelsSidePannel";
import ChannelDiscussion from "../components/bodyComponents/ChannelDiscussion";

const Channels = () => {
  return (
    <>
      <div className="flex flex-col bg-background text-secondary-foreground border-r-2 border-background pl-2 w-1/6 h-[100%-8px]">
        <ChannelsSidePannel />
      </div>
      <div className="flex bg-secondary h-[calc(100%-20px)] w-full">
        <ChannelDiscussion />
      </div>
    </>
  );
};

export default Channels;
