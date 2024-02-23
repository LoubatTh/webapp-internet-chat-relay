import { SetStateAction, useState } from "react";
import { fetchApi } from "../../lib/api";
import { getIdentity } from "../../lib/localstorage";
import { Button } from "../ui/ui/button";
import { Checkbox } from "../ui/ui/checkbox";
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
import { ChannelType } from "../../lib/type";

const createChannel = async (
  channelName: string,
  isPublic: boolean,
  user: string
) => {
  const response: Response = await fetchApi("POST", "channels", {
    name: channelName,
    members: [user],
    visibility: isPublic ? "public" : "private",
    owner: user,
  });
  if (response) {
    console.log("Channel created");
    return response;
  } else {
    console.log("Channel not created");
  }
};

const CreateChannelComponent = () => {
  const { addChannel } = useChannelStorageStore();
  const [channelName, setChannelName] = useState<string>("");
  const [isChannelPublic, setIsChannelPublic] = useState<boolean>(false);

  const handleChannelNameValue = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setChannelName(event.target.value);
  };

  const handleIsChannelPublicValue = () => {
    setIsChannelPublic(!isChannelPublic);
  };

  const handleCreateChannel = async () => {
    const user = getIdentity();
    if (!user) return;
    const channel: ChannelType = await createChannel(
      channelName,
      isChannelPublic,
      user
    );
    addChannel(channel);
    console.log("create channel");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create new channel</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle> Create new channel</DialogTitle>
          <DialogDescription>
            Select a name and choose if your channel is public or private.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 items-center">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              onChange={handleChannelNameValue}
              value={channelName}
            />
          </div>
          <div className="flex gap-2 items-center">
            <Label htmlFor="visibility">Public</Label>
            <Checkbox
              id="visibility"
              onCheckedChange={handleIsChannelPublicValue}
              checked={isChannelPublic}
            />
          </div>
        </div>
        <DialogFooter className="justify-start">
          <DialogClose asChild>
            <Button type="button" onClick={handleCreateChannel}>
              Create
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

export default CreateChannelComponent;
