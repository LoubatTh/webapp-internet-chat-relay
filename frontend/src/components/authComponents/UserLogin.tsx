import { useState } from "react"
import { Button } from "../ui/ui/button"
import { Input } from "../ui/ui/input"
import { Label } from "../ui/ui/label"
import { fetchApi } from "../../lib/api"
import { useNavigate } from "react-router-dom"

const getUserLogin = async (username: string, password: string) => {
    const response = await fetchApi("POST", "users/login", { username, password })
    return response;
}

export const UserLogin = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value)
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    const handleUserConnection = async () => {
        const response = await getUserLogin(username, password)
        // setUser(response._id; response.token)
        console.log(response)
        navigate("/channels")
    }

  return (
    <>
    <Label htmlFor="username" >Username</Label>
    <Input name="username" onChange={handleUsernameChange} value={username}/>
    <Label htmlFor="password" >Password</Label>
    <Input name="password" onChange={handlePasswordChange} value={password} />
    <Button onClick={handleUserConnection}>Login</Button>
    </>
  )
}
