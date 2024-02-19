import { Button } from "./button"
import { Link } from "react-router-dom";
 
export function GuestButton() {
  return <Button variant="link"><Link to="/guest">Connect as guest</Link>Connect as guest</Button>
}

export function LoginButton() {
    return (
        <Button asChild>
            <Link to="/login">Login</Link>
        </Button>
    )
}