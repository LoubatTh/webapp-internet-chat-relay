import { useState, SetStateAction } from "react";
import { Button } from "../ui/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../ui/ui/dialog";
import { Input } from "../ui/ui/input";
import { Label } from "../ui/ui/label";
import useChannelStorageStore from "../../store/channelStorage";
import { fetchApi } from "../../lib/api";
import { getIdentity, isUser } from "../../lib/utils";
import { useToast } from "../ui/ui/use-toast";

const joinChannel = async (user: string, channelId: string) => {
  const response: Response = await fetchApi(
    "POST",
    `${isUser() ? "users" : "guests"}/${user}/channels`,
    {
      channelId,
    }
  );
  return response;
};

const JoinChannelComponent = () => {
  const { toast } = useToast();
  const { addChannel } = useChannelStorageStore();
  const [channelId, setChannelId] = useState<string>("");

  const handleChannelIdValue = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setChannelId(event.target.value);
  };

  const handleJoinChannel = async () => {
    const user = getIdentity();
    if (!user) return;
    const response = await joinChannel(user, channelId);
    const data = await response.data;
    if (response.status === 201) {
      addChannel(data.channel);
      setChannelId(channelId);
      toast({
        description: `Channel joined`,
      });
    } else {
      toast({
        variant: "error",
        description: `${data.message}`,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Join channel</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle> Join a channel</DialogTitle>
          <DialogDescription>
            Add the channel ID to join a channel
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 items-center">
            <Label htmlFor="channelID">Channel ID</Label>
            <Input
              id="channelID"
              onChange={handleChannelIdValue}
              value={channelId}
            />
          </div>
        </div>
        <DialogFooter className="justify-start">
          <DialogClose asChild>
            <Button type="button" onClick={handleJoinChannel}>
              Join
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JoinChannelComponent;
