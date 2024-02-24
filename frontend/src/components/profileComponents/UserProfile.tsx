import { useEffect, useState } from "react";
import { fetchApi } from "../../lib/api";
import { getIdentity, logout } from "../../lib/utils";
import { Button } from "../ui/ui/button";
import { Label } from "../ui/ui/label";
import { Input } from "../ui/ui/input";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/ui/dialog";
import { useNavigate } from "react-router-dom";

const getUser = async (id: string) => {
  const response = await fetchApi("GET", `users/${id}`);
  return response;
};

const putUser = async (id: string, body: any) => {
  const response = await fetchApi("PUT", `users/${id}`, body);
  return response;
};

const deleteUser = async (id: string) => {
  const response = await fetchApi("DELETE", `users/${id}`);
  return response;
};

const UserProfile = () => {
  const navigate = useNavigate();
  const userId: string | null = getIdentity();
  const [username, setUsername] = useState<string>("");
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  const getUserInfo = async () => {
    if (!userId) return;
    const data = await getUser(userId);
    if (!data) return;
    setUsername(data.username);
  };

  const handleUpdate = async () => {
    if (!userId) return;
    if (username && newPassword && oldPassword) {
      const data = await putUser(userId, {
        username,
        oldPassword,
        newPassword,
      });
    } else if (username) {
      const data = await putUser(userId, { username });
    } else if (newPassword && oldPassword) {
      const data = await putUser(userId, {
        oldPassword,
        newPassword,
      });
    }
  };

  const handleDelete = async () => {
    if (!userId) return;
    const data = await deleteUser(userId);
    if (!data) return;
    logout();
    navigate("/auth");
  };

  useEffect(() => {
    getUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="username">Username</Label>
        <Input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          type="text"
          id="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          type="text"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div className="flex gap-2 w-full mt-8">
        <Button className="w-1/2" onClick={handleUpdate}>
          Update
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete Profile</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete profile</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete your profile ? This action is
                definitive and cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={handleDelete} variant="destructive">
                  Yes
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default UserProfile;
