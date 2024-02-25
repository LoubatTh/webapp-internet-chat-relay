import { useState } from "react";
import { Button } from "../ui/ui/button";
import { Input } from "../ui/ui/input";
import { Label } from "../ui/ui/label";
import { fetchApi } from "../../lib/api";
import { useNavigate } from "react-router-dom";
import { setAccessToken, setIdentity } from "../../lib/utils";
import { useToast } from "../ui/ui/use-toast";

const getUserLogin = async (username: string, password: string) => {
  const response = await fetchApi("POST", "users/login", {
    username,
    password,
  });
  return response;
};

export const UserLogin = () => {
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
    const response = await getUserLogin(username, password);
    const data = response.data;
    if (response.status === 200) {
      setIdentity(data.id);
      setAccessToken(data.token);
      toast({
        description: `Welcome`,
      });
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
          Connection
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
