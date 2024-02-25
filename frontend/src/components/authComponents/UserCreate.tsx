import React, { useState } from "react";
import { Label } from "../ui/ui/label";
import { Button } from "../ui/ui/button";
import { Input } from "../ui/ui/input";
import { fetchApi } from "../../lib/api";
import { useNavigate } from "react-router-dom";
import { setAccessToken, setIdentity } from "../../lib/utils";
import { useToast } from "../ui/ui/use-toast";

const postUser = async (username: string, password: string) => {
  const response = await fetchApi("POST", "users/register", {
    username,
    password,
  });
  return response;
};

const UserCreate = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleUserConnection = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await postUser(username, password);
    const data = response.data;
    if (response.status === 201) {
      setIdentity(data.user._id);
      setAccessToken(data.token);
      navigate("/channels");
    } else {
      toast({
        variant: "error",
        description: `${data.message}`,
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="username">Username</Label>
        <Input
          name="username"
          onChange={handleUsernameChange}
          value={username}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          name="password"
          onChange={handlePasswordChange}
          value={password}
        />
      </div>
      <div className="flex gap-2 mt-4">
        <Button className="w-1/2" onClick={handleUserConnection}>
          Create account
        </Button>
        <Button
          className="w-1/2"
          variant="secondary"
          onClick={() => {
            navigate("/auth");
          }}
        >
          Go back
        </Button>
      </div>
    </div>
  );
};

export default UserCreate;
