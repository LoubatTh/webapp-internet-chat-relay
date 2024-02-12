
import Body from "./components/Body";
import Header from "./components/Header";
import SidePanel from "./components/SidePanel";
import { setIdentity, getIdentity } from "./lib/localstorage";

function App() {
  if(!getIdentity())setIdentity();
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
