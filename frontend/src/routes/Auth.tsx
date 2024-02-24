import { Outlet } from "react-router-dom";
import Banner from "../components/authComponents/Banner";

const Auth = () => {
  return (
    <div className="grid grid-rows-8 self-center w-screen h-screen">
      <div className="row-span-1"></div>
      <div className="row-span-3 mx-auto">
        <Banner />
      </div>
      <div className="row-span-1 w-64 mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Auth;
