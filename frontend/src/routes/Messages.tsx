import PrivateMessagesSidePannel from "../components/sidePanelComponents/PrivateMessagesSidePannel";
import ChannelDiscussion from "../components/bodyComponents/ChannelDiscussion";

const Messages = () => {
  return (
    <>
      <div className="flex flex-col bg-background text-secondary-foreground border-r-2 border-background pl-2 min-w-60 h-[100%-8px]">
        <PrivateMessagesSidePannel />
      </div>
      <div className="flex bg-secondary h-[calc(100%-20px)] w-full">
        <ChannelDiscussion />
      </div>
    </>
  );
};

export default Messages;
