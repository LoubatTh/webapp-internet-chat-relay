import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter,RouterProvider} from "react-router-dom";
import './index.css'
import ChannelDiscussion from './routes/ChannelDiscussion.tsx';
import Home from './routes/Home.tsx';
import Heroes from './routes/Heroes.tsx';

const router = createBrowserRouter([
  {path: "/auth",element: <Heroes />},
  {path: "/",element: <Home/>, children : [
    {path: "channels/:channelId",element: <ChannelDiscussion />},
    {path: "messages/:privateMessageId",element: <ChannelDiscussion />},
    {path: "users/:userId",element: <ChannelDiscussion />},
    ]
  },

]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
)
