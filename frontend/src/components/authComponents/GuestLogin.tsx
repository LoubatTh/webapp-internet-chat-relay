import { useState } from "react"
import { fetchApi } from "../../lib/api"
import { Button } from "../ui/ui/button"
import { Input } from "../ui/ui/input"
import { Label } from "../ui/ui/label"
import { setIdentity } from "../../lib/utils"
import { useNavigate } from "react-router-dom"

const postGuest = async (username: string) => {
  const response = await fetchApi("POST", "guests", { username })
    return response
}

const GuestLogin = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState("");
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value)
    }

    const handleCreationGuest = async () => {
        const response = await postGuest(username)
        if (response){
            setIdentity(response._id)
            navigate("/channels")
        }
        
    }
  return (
    <>
    <Label  htmlFor="username" >Username</Label>
    <Input name="username" onChange={handleInputChange} value={username} />
    <Button onClick={handleCreationGuest}>Continue as Guest</Button>
    </>
  )
}

export default GuestLogin