import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

type RouteProps = {
  children: React.ReactNode;
};

const GuestRoute = ({ children }: RouteProps) => {
  const { isAuth } = useSelector((state: any) => state.authSlice);
  return isAuth ? (
    <Navigate
      to={{
        pathname: "/rooms",
      }}
      replace
    />
  ) : (
    <>{children}</>
  );
};

const SemiProtectedRoute = ({ children }: RouteProps) => {
  const { isAuth, user } = useSelector((state: any) => state.authSlice);
  return !isAuth ? (
    <Navigate
      to={{
        pathname: "/register",
      }}
      replace
    />
  ) : isAuth && !user.activated ? (
    <>{children}</>
  ) : (
    <Navigate to="/rooms" />
  );
};

const ProtectedRoute = ({ children }: RouteProps) => {
  const { isAuth, user } = useSelector((state: any) => state.authSlice);
  return !isAuth ? (
    <Navigate
      to={{
        pathname: "/register",
      }}
      replace
    />
  ) : isAuth && !user.activated ? (
    <Navigate to="/activate" />
  ) : (
    // <Navigate to="/rooms" />
    <>{children}</>
  );
};

export { GuestRoute, SemiProtectedRoute, ProtectedRoute };
