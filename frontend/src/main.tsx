import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter,RouterProvider} from "react-router-dom";
import './index.css'
import ChannelDiscussion from './routes/ChannelDiscussion.tsx';
import Home from './routes/Home.tsx';
console.log("Hello World");
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
    children : [
      {
        path: "channels/:channelId",
        element: <ChannelDiscussion />,
      },
    ]
  },

]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
)
