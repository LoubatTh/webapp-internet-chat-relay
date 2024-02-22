import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import { getIdentity, setIdentity } from "../lib/localstorage";
import useChannelMessageDisplayStore from "../store/channelMessageDisplay";

const Home = () => {
  const location = useLocation();
  const { setChannelId } = useChannelMessageDisplayStore();

  useEffect(() => {
    // Set the identity in the store if it's present in the localStorage
    if (!getIdentity()) {
      setIdentity();
    }

    // Set the channelId in the store if it's present in the URL (if realoded on a channel page)
    const channelIdFromUrl = extractChannelIdFromUrl(location.pathname);

    if (channelIdFromUrl) {
      setChannelId(channelIdFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to extract channelId from the URL
  const extractChannelIdFromUrl = (pathname: string): string | null => {
    const match = pathname.match(/\/channels\/(\w+)/);
    return match ? match[1] : null;
  };

  return (
    <div className="flex flex-col w-screen h-screen">
      <div className=" py-2 h-12">
        <Header />
      </div>
      <div className="flex flex-row h-[calc(100%-48px)]">
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
