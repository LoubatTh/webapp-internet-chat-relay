
import { setIdentity, getIdentity } from "./lib/localstorage";
import Home from "./routes/Home";

function App() {
  if(!getIdentity())setIdentity();
  return (
   <Home/>
  );
}

export default App;
