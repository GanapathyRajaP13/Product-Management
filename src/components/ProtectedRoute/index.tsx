import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const ProtectedRoute: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const userURLs = useSelector((state: RootState) => state.auth.userURL);
  const location = useLocation();

  const isUrlAllowed = userURLs?.some(
    (url) => url.ScreenUrl === location.pathname
  );

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (!isUrlAllowed && location.pathname !== "/profile") {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
