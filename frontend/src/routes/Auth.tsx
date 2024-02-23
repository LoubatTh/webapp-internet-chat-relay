import GuestLogin from "../components/authComponents/GuestLogin"
import UserCreate from "../components/authComponents/UserCreate"
import { UserLogin } from "../components/authComponents/UserLogin"

const Auth = () => {
  return (
    <>
    <h1>EPICHAT</h1>
    <h2>create</h2>
    <UserCreate />
    <h2>Login</h2>
    <UserLogin />
    <GuestLogin />
    </>
  )
}

export default Auth