import GuestProfile from "../components/profileComponents/GuestProfile";
import UserProfile from "../components/profileComponents/UserProfile";
import { isUser } from "../lib/utils";

const Profile = () => {
  const isUserConnected = isUser();

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <div className=" text-6xl my-10">My profile</div>
      {isUserConnected ? <UserProfile /> : <GuestProfile />}
    </div>
  );
};

export default Profile;
