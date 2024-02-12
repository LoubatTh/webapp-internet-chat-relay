
import Body from "./components/Body";
import Header from "./components/Header";
import SidePanel from "./components/SidePanel";
import { setCookie, getCookie } from "./lib/cookie";

function App() {
  if(!getCookie())setCookie();
  return (
    <div className="flex flex-col w-screen h-screen">
      <Header />
      <div className="flex flex-row h-[calc(100%-80px)]">
        <SidePanel />
        <Body />
      </div>
    </div>
  );
}

export default App;
