import GuestProfile from "../components/profileComponents/GuestProfile";
import UserProfile from "../components/profileComponents/UserProfile";
import { isUser } from "../lib/utils";

const Profile = () => {
  const isUserConnected = isUser();

  return (
    <div className="w-full flex flex-col items-center gap-8 bg-secondary">
      <div className=" text-6xl my-10">My profile</div>
      <div className="bg-background p-6 rounded-lg border-[0.5px] border-foreground">
        {isUserConnected ? <UserProfile /> : <GuestProfile />}
      </div>
    </div>
  );
};

export default Profile;
