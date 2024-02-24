import { useNavigate } from "react-router-dom";
import { Button } from "../ui/ui/button";

const AuthMethod = () => {
  const navigate = useNavigate();

  const gotoLogin = () => {
    navigate("/auth/login");
  };

  const gotoCreateAccount = () => {
    navigate("/auth/logon");
  };

  const gotoGuest = () => {
    navigate("/auth/guest");
  };
  return (
    <div className="flex flex-col gap-4 w-46">
      <Button onClick={gotoLogin}>Login</Button>
      <Button onClick={gotoCreateAccount} variant="secondary">
        Create account
      </Button>
      <Button onClick={gotoGuest} variant="outline">
        Continue as guest
      </Button>
    </div>
  );
};

export default AuthMethod;
