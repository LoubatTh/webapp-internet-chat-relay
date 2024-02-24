import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import useChannelMessageDisplayStore from "../store/channelMessageDisplay";

const Home = () => {
  const location = useLocation();
  const { setChannelId } = useChannelMessageDisplayStore();

  const extractChannelIdFromUrl = (pathname: string): string | null => {
    const match = pathname.match(/\/channels\/(\w+)/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const channelIdFromUrl = extractChannelIdFromUrl(location.pathname);

    if (channelIdFromUrl) {
      setChannelId(channelIdFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
