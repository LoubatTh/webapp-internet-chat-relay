import { fetchApi } from "../../lib/api";
import { getIdentity } from "../../lib/utils";
import useChannelMessageDisplayStore from "../../store/channelMessageDisplay";
import useChannelStorageStore from "../../store/channelStorage";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/ui/context-menu";

const deleteUserFromChannel = async (channelId: string, userId: string) => {
  const response: Response = await fetchApi(
    "DELETE",
    `users/${userId}/channels/${channelId}`
  );
  if (response) {
    console.log("User removed from channel");
    return true;
  } else {
    return false;
  }
};

const renameChannel = async (channelId: string, newName: string) => {
  const response: Response = await fetchApi("PUT", `channels/${channelId}`, {
    name: newName,
  });
  if (response) {
    console.log("Channel renamed");
    return true;
  } else {
    return false;
  }
};

const deleteChannel = async (channelId: string) => {
  const response: Response = await fetchApi("DELETE", `channels/${channelId}`);
  if (response) {
    console.log("Channel deleted");
    return true;
  } else {
    return false;
  }
};

type ChannelProps = {
  id: string;
  name: string;
  owner: string;
};

const Channel = ({ id, name, owner }: ChannelProps) => {
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
    (await deleteUserFromChannel(id, user)) ? removeChannel(id) : null;
  };

  const handleRenameChannel = () => {
    if (!user) return;
    renameChannel(id, "renaming");
  };

  const handleDeleteChannel = async () => {
    if (!user) return;
    (await deleteChannel(id)) ? removeChannel(id) : null;
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
