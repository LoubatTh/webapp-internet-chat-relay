import { fetchApi } from "../../lib/api";
import { PmsgType } from "../../lib/type";
import { getIdentity } from "../../lib/utils";
import useChannelMessageDisplayStore from "../../store/channelMessageDisplay";
import usePmsgStorageStore from "../../store/pmsgStorage";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/ui/context-menu";
import { useToast } from "../ui/ui/use-toast";

type PmsgTypeResponse = {
  data: PmsgType[] | { message: string };
  status: number;
};

const deletePmsg = async (pmsgId: string) => {
  const response: PmsgTypeResponse = await fetchApi(
    "DELETE",
    `pmsgs/${pmsgId}`
  );
  return response;
};

type ChannelProps = {
  id: string;
  name: string;
};

const Pmsg = ({ id, name }: ChannelProps) => {
  const { toast } = useToast();
  const { setChannelId } = useChannelMessageDisplayStore();
  const { removePmsg } = usePmsgStorageStore();
  const user = getIdentity();

  const handlePmsgMessageDisplay = () => {
    setChannelId(id);
  };

  const handleDeletePmsg = async () => {
    if (!user) return;
    const response = await deletePmsg(id);
    const data = response.data;
    if (response.status === 200) {
      removePmsg(id);
      toast({
        description: `Channel deleted`,
      });
    } else {

      toast({
        variant: "error",
        description: `${data.message}`,
      });
    }
  };
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className="bg-background text-background-foreground border-foreground border-b-[1px] hover:bg-secondary p-1 mr-5 mt-2 cursor-pointer truncate "
          onClick={handlePmsgMessageDisplay}
        >
          #{name}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <button onClick={handleDeletePmsg}>Delete private message</button>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default Pmsg;
