import { Navigate, RouteProps } from "react-router-dom";
import { isAuthenticated } from "../lib/utils";

const ProtectedRoute: React.FC<RouteProps> = ({ children }) => {
  const isLoggedIn = isAuthenticated();

  return isLoggedIn ? children : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
