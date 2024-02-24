import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./routes/Home.tsx";
import Channels from "./routes/Channels.tsx";
import Messages from "./routes/Messages.tsx";
import Auth from "./routes/Auth.tsx";
import { UserLogin } from "./components/authComponents/UserLogin.tsx";
import UserCreate from "./components/authComponents/UserCreate.tsx";
import GuestLogin from "./components/authComponents/GuestLogin.tsx";
import AuthMethod from "./components/authComponents/AuthMethod.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Profile from "./routes/Profile.tsx";
import Layout from "./components/Layout.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/auth" element={<Auth />}>
            <Route path="" element={<AuthMethod />} />
            <Route path="login" element={<UserLogin />} />
            <Route path="logon" element={<UserCreate />} />
            <Route path="guest" element={<GuestLogin />} />
          </Route>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          >
            <Route path="profile" element={<Profile />} />
            <Route path="channels" element={<Channels />}>
              <Route path=":channelId" element={<Channels />} />
            </Route>
            <Route path="messages" element={<Messages />}>
              <Route path=":channelId" element={<Messages />} />
            </Route>
          </Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  </React.StrictMode>
);
