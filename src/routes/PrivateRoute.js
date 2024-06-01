import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  return (
    user && token? <Outlet /> : (
      <Navigate
        to="/signin"
        state={{ from: location }}
        replace
      />
    )
  );
};

export default PrivateRoute;
