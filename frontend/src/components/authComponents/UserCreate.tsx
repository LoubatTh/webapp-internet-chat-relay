import React, { useState } from 'react'
import { Label } from '../ui/ui/label';
import { Button } from '../ui/ui/button';
import { Input } from '../ui/ui/input';
import { fetchApi } from '../../lib/api';
import { setUser } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

const postUser = async (username: string, password: string) => {
    const response = await fetchApi("POST", "users/register", { username, password })
    return response;
}

const UserCreate = () => {
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
        const response = await postUser(username, password)
        await setUser(response.user._id,response.token)
        navigate("/channels")
    }

  return (
    <>
    <Label htmlFor="username" >Username</Label>
    <Input name="username" onChange={handleUsernameChange} value={username}/>
    <Label htmlFor="password" >Password</Label>
    <Input name="password" onChange={handlePasswordChange} value={password} />
    <Button onClick={handleUserConnection}>Create Account</Button>
    </>
  )
}

export default UserCreate