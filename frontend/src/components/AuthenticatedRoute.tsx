import { Navigate } from "react-router-dom";

type RouteProps = {
  children: React.ReactNode;
};

const isAuth = false;
const user = {
  activated: false,
};

const GuestRoute = ({ children }: RouteProps) => {
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
  return !isAuth ? (
    <Navigate
      to={{
        pathname: "/login",
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
  return !isAuth ? (
    <Navigate
      to={{
        pathname: "/login",
      }}
      replace
    />
  ) : isAuth && !user.activated ? (
    <Navigate to="/activate" />
  ) : (
    // <Navigate to="/rooms" />
    <>
      {children}
    </>
  );
};

export { GuestRoute, SemiProtectedRoute, ProtectedRoute };
