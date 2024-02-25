import { useState } from "react";
import { fetchApi } from "../../lib/api";
import { Button } from "../ui/ui/button";
import { Input } from "../ui/ui/input";
import { Label } from "../ui/ui/label";
import { useNavigate } from "react-router-dom";
import { setIdentity } from "../../lib/utils";
import { GuestType } from "../../lib/type";
import { useToast } from "../ui/ui/use-toast";

const postGuest = async (username: string) => {
  const response = await fetchApi("POST", "guests", { username });
  return response;
};

const GuestLogin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleCreationGuest = async () => {
    const response: GuestType = await postGuest(username);
    const data = response.data;
    if (response.status === 201) {
      setIdentity(data._id);
      navigate("/channels");
      toast({
        description: `Welcome ${data.username}`,
      });
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
        <Input name="username" onChange={handleInputChange} value={username} />
      </div>
      <div className="flex gap-2 mt-4">
        <Button className="w-1/2" onClick={handleCreationGuest}>
          Continue as guest
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

export default GuestLogin;
