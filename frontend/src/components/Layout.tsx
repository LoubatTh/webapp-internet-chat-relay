import { Toaster } from "./ui/ui/toaster";

const Layout = ({ children }) => {
  return (
    <>
      <Toaster />
      {children}
    </>
  );
};

export default Layout;
