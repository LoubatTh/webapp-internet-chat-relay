import { fetchApi } from "../../lib/api";
import { getIdentity, isUser } from "../../lib/utils";
import useChannelMessageDisplayStore from "../../store/channelMessageDisplay";
import useChannelStorageStore from "../../store/channelStorage";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/ui/context-menu";
import { useToast } from "../ui/ui/use-toast";

const deleteUserFromChannel = async (channelId: string, userId: string) => {
  const response = await fetchApi(
    "DELETE",
    `${isUser() ? "users" : "guests"}/${userId}/channels/${channelId}`
  );
  return response;
};

const renameChannel = async (channelId: string, newName: string) => {
  const response: Response = await fetchApi("PUT", `channels/${channelId}`, {
    name: newName,
  });
  return response;
};

const deleteChannel = async (channelId: string) => {
  const response: Response = await fetchApi("DELETE", `channels/${channelId}`);
  return response;
};

type ChannelProps = {
  id: string;
  name: string;
  owner: string;
};

const Channel = ({ id, name, owner }: ChannelProps) => {
  const { toast } = useToast();
  const { setChannelId } = useChannelMessageDisplayStore();
  const { removeChannel } = useChannelStorageStore();
  const user = getIdentity();

  const handleChannelMessageDisplay = () => {
    setChannelId(id);
  };

  const handleCopyChannelId = () => {
    navigator.clipboard.writeText(id);
  };

  const handleQuitChannel = async () => {
    if (!user) return;
    const response = await deleteUserFromChannel(id, user);
    const data = response.data;
    if (response.status === 200) {
      removeChannel(id);
      toast({
        description: `You have quit the channel`,
      });
    } else {
      toast({
        variant: "error",
        description: `${data.message}`,
      });
    }
  };

  const handleRenameChannel = async () => {
    if (!user) return;
    const response = await renameChannel(id, "renaming");
    const data = response.data;
    if (response.status === 200) {
      toast({
        description: `Channel renamed`,
      });
    } else {
      toast({
        variant: "error",
        description: `${data.message}`,
      });
    }
  };

  const handleDeleteChannel = async () => {
    if (!user) return;
    const response = await deleteChannel(id);
    const data = response.data;
    if (response.status === 200) {
      removeChannel(id);
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
          onClick={handleChannelMessageDisplay}
        >
          #{name}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <button onClick={handleCopyChannelId}>Copy channel ID</button>
        </ContextMenuItem>
        <ContextMenuItem>
          <button onClick={handleQuitChannel}>Quit channel</button>
        </ContextMenuItem>
        <ContextMenuItem>
          <button onClick={handleRenameChannel}>Rename channel</button>
        </ContextMenuItem>
        {owner === user && (
          <>
            <ContextMenuItem>
              <button onClick={handleDeleteChannel}>Delete channel</button>
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default Channel;
