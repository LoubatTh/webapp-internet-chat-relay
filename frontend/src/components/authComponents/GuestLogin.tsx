import { useState } from "react";
import { fetchApi } from "../../lib/api";
import { Button } from "../ui/ui/button";
import { Input } from "../ui/ui/input";
import { Label } from "../ui/ui/label";
import { useNavigate } from "react-router-dom";
import { setIdentity } from "../../lib/utils";
import { GuestType } from "../../lib/type";


const postGuest = async (username: string) => {
  const response = await fetchApi("POST", "guests", { username });
  return response;
};

const GuestLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleCreationGuest = async () => {

    const response: GuestType = await postGuest(username);
    if (response) {
      setIdentity(response._id);
      navigate("/channels");
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="username">Username</Label>
        <Input name="username" onChange={handleInputChange} value={username} />
      </div>
      <Button className="mt-4 mx-auto w-36" onClick={handleCreationGuest}>
        Continue as guest
      </Button>
    </div>
  );
};

export default GuestLogin;
