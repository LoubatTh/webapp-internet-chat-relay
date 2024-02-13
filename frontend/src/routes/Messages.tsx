import ChannelDiscussion from "../components/bodyComponents/ChannelDiscussion";
import PrivateMessagesSidePannel from "../components/sidePanelComponents/PrivateMessagesSidePannel";

const Messages = () => {
  return (
    <>
      <div className="flex flex-col bg-secondary text-secondary-foreground border-r-2 border-background pl-2 w-1/6 h-[100%-8px]">
        <PrivateMessagesSidePannel />
      </div>
      <div className="flex bg-background h-[calc(100%-20px)] w-full">
        <ChannelDiscussion />
      </div>
    </>
  );
};

export default Messages;
