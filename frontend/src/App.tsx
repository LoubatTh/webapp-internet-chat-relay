import Body from "./components/Body";
import Header from "./components/Header";
import SidePanel from "./components/SidePanel";

function App() {
  return (
    <div className="flex flex-col w-screen h-screen">
      <Header />
      <div className="flex flex-row h-full">
        <SidePanel />
        <Body />
      </div>
    </div>
  );
}

export default App;
