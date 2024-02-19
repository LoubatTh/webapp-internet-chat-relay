import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Home from "./routes/Home.tsx";
import Heroes from "./routes/Heroes.tsx";
import Welcome from "./routes/Welcome.tsx";
import Channels from "./routes/Channels.tsx";
import Messages from "./routes/Messages.tsx";

const router = createBrowserRouter([
  { path: "/auth", element: <Heroes /> },
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "/",
        element: <Welcome />,
      },
      {
        path: "channels",
        element: <Channels />,
        children: [{ path: ":channelId", element: <Channels /> }],
      },
      {
        path: "messages",
        element: <Messages />,
        children: [{ path: ":channelId", element: <Messages /> }],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
