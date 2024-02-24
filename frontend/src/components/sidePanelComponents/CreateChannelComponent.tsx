import { SetStateAction, useState } from "react";
import { fetchApi } from "../../lib/api";
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
import { getIdentity } from "../../lib/utils";
import { useToast } from "../ui/ui/use-toast";

const createChannel = async (
  channelName: string,
  isPublic: boolean,
  user: string
) => {
  const response = await fetchApi("POST", "channels", {
    name: channelName,
    members: [user],
    visibility: isPublic ? "public" : "private",
    owner: user,
  });
  return response;
};

const CreateChannelComponent = () => {
  const { toast } = useToast();
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
    const response = await createChannel(channelName, isChannelPublic, user);
    const data = response.data;
    console.log(response);
    if (response.status === 201) {
      addChannel(data);
      toast({
        description: `Channel ${data.name} created`,
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
