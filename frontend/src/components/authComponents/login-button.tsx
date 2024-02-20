import { Button } from "../ui/ui/button";
import { Link, redirect } from "react-router-dom";
import { Input } from "../ui/ui/input";
import { useState } from "react";
import { fetchApi } from "../../lib/api";
import { getIdentity, setIdentity } from "../../lib/localstorage";

const createGuest = async (name: string) => {
  const response = await fetchApi("POST", "guests", { username : name });
  if (response) {
    console.log("Guest created");
    return response;
  } else {
    console.log("Guest not created");
    return
  }
};

export function GuestButton() {
 const [name, setName] = useState("");

  const handleNameGuest = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setName(event.target.value);
  }
  
  const handleCreateGuest = async () => {
    const data = await createGuest(name);
    if (!data) return;
    console.log(data._id);
    setIdentity(data._id);
    console.log(getIdentity());
    redirect("/home");
  }


  return (
    <>
    <Input placeholder="Guest" onChange={handleNameGuest} value={name}/>
    <Button variant="link" onClick={handleCreateGuest}>
      Create Guest
    </Button>
    </>
  );
}

export function LoginButton() {
  return (
    <Button asChild>
      <Link to="/login">Login</Link>
    </Button>
  );
}
