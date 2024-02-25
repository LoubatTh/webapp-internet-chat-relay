import { SetStateAction, useState } from "react";
import { fetchApi } from "../../lib/api";
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
import { getIdentity } from "../../lib/utils";
import { useToast } from "../ui/ui/use-toast";
import usePmsgStorageStore from "../../store/pmsgStorage";

const createPmsg = async (target: string, user: string) => {
  const response = await fetchApi("POST", `pmsgs?name=${target}`, {
    members: [user],
  });
  return response;
};

const CreatePmsgComponent = () => {
  const { toast } = useToast();
  const { addPmsg } = usePmsgStorageStore();
  const [target, setTarget] = useState<string>("");

  const handleTargetValue = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setTarget(event.target.value);
  };

  const handleCreatePsmg = async () => {
    const user = getIdentity();
    if (!user) return;
    const response = await createPmsg(target, user);
    const data = response.data;
    console.log(response);
    if (response.status === 201) {
      addPmsg(data.pmsg);
      toast({
        description: `Channel ${target} created`,
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
        <Button>Create new chat</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle> Create new chat</DialogTitle>
          <DialogDescription>
            Write the username of the user you want to speak to.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 items-center">
            <Label htmlFor="username">Username</Label>
            <Input id="username" onChange={handleTargetValue} value={target} />
          </div>
        </div>
        <DialogFooter className="justify-start">
          <DialogClose asChild>
            <Button type="button" onClick={handleCreatePsmg}>
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

export default CreatePmsgComponent;
