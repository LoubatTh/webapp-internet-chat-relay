import { Label } from "@radix-ui/react-context-menu";
import { fetchApi, fetchApiAuth } from "../../lib/api";
import { getIdentity, isUser } from "../../lib/utils";
import useChannelMessageDisplayStore from "../../store/channelMessageDisplay";
import useChannelStorageStore from "../../store/channelStorage";
import { Button } from "../ui/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/ui/dialog";
import { Input } from "../ui/ui/input";
import { useToast } from "../ui/ui/use-toast";
import { SetStateAction, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const deleteUserFromChannel = async (channelId: string, userId: string) => {
  const response = isUser()
    ? await fetchApiAuth("DELETE", `users/${userId}/channels/${channelId}`)
    : await fetchApi("DELETE", `guests/${userId}/channels/${channelId}`);
  return response;
};

const renameChannel = async (channelId: string, newName: string) => {
  const response = await fetchApi("PUT", `channels/${channelId}`, {
    name: newName,
  });
  return response;
};

const deleteChannel = async (channelId: string) => {
  const response = await fetchApi("DELETE", `channels/${channelId}`);
  return response;
};

type ChannelProps = {
  id: string;
  name: string;
  owner: string;
};

const Channel = ({ id, name, owner }: ChannelProps) => {
  const { toast } = useToast();
  const { channelId } = useParams();
  const user = getIdentity();
  const navigate = useNavigate();
  const { setChannelId } = useChannelMessageDisplayStore();
  const { removeChannel } = useChannelStorageStore();
  const [channelName, setChannelName] = useState<string>(name);
  const [isDialogRenameOpen, setIsDialogRenameOpen] = useState<boolean>(false);
  const [isDialogQuitOpen, setIsDialogQuitOpen] = useState<boolean>(false);
  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState<boolean>(false);

  const handleOpenRenameDialog = (value: boolean) => {
    setIsDialogRenameOpen(value);
  };

  const handleOpenQuitDialog = (value: boolean) => {
    setIsDialogQuitOpen(value);
  };

  const handleOpenDeleteDialog = (value: boolean) => {
    setIsDialogDeleteOpen(value);
  };

  const handleRenameValue = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setChannelName(event.target.value);
  };

  const quitChannelifNotHere = () => {
    if (channelId === id) {
      navigate("/channels");
    }
  };

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
      quitChannelifNotHere();
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
    const response = await renameChannel(id, channelName);
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
      quitChannelifNotHere();
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

  useEffect(() => {
    setChannelName(name);
  }, [name]);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className="bg-background text-background-foreground hover:bg-secondary rounded-md p-2 mr-5 mt-2 cursor-pointer truncate "
          onClick={handleChannelMessageDisplay}
        >
          #{channelName}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem asChild>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopyChannelId();
            }}
          >
            Copy channel ID
          </button>
        </ContextMenuItem>
        <Dialog open={isDialogQuitOpen}>
          <ContextMenuItem>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenQuitDialog(true);
              }}
            >
              Quit channel
            </button>
          </ContextMenuItem>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle> Quit channel</DialogTitle>
              <DialogDescription>
                Are you sure you want to quit this channel?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="justify-start">
              <Button
                type="button"
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuitChannel();
                  handleOpenQuitDialog(false);
                }}
              >
                Quit
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenQuitDialog(false);
                }}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {owner === user && (
          <>
            <Dialog open={isDialogRenameOpen}>
              <ContextMenuItem>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenRenameDialog(true);
                  }}
                >
                  Rename channel
                </button>
              </ContextMenuItem>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle> Rename channel</DialogTitle>
                  <DialogDescription>
                    Select a new name for your channel.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2 items-center">
                    <Label>Name</Label>
                    <Input
                      id="name"
                      type="text"
                      onChange={handleRenameValue}
                      value={channelName}
                    />
                  </div>
                </div>
                <DialogFooter className="justify-start">
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRenameChannel();
                      handleOpenRenameDialog(false);
                    }}
                  >
                    Rename
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenRenameDialog(false);
                    }}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog open={isDialogDeleteOpen}>
              <ContextMenuItem>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenDeleteDialog(true);
                  }}
                >
                  Delete channel
                </button>
              </ContextMenuItem>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle> Delete channel</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this channel?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="justify-start">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChannel();
                      handleOpenDeleteDialog(false);
                    }}
                  >
                    Delete
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDeleteDialog(false);
                    }}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default Channel;
