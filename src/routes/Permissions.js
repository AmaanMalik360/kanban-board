import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import {jwtDecode} from 'jwt-decode';
import { showToast } from "../components/common/toasts/Toast";

const Permissions = ({perProp}) => {

  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // Function to check if user has the required permissions
  const hasPermission = () => {
    if (user && token) {
      const decodedToken = jwtDecode(token);
      // console.log(decodedToken);
      const userPermissions = decodedToken.permissions || [];
      
      if(user.is_admin)
      {
        let adminPermission = ['Admin']
        if(Array.isArray(perProp)) {

          if(perProp.some((permission) => adminPermission.includes(permission))) {
            return true;
          }
        }
        else{
          showToast('Access Denied.', 'info')
          return false;
        }
      }

      if (Array.isArray(perProp)) {
        // Check if any of the required permissions exist in the user's permissions
        console.log(perProp.some((permission) => userPermissions.includes(permission)));

        if(perProp.some((permission) => userPermissions.includes(permission))){
          return true;
        }
        else {
          // Display in case not permission not found.
          showToast('Access Denied', 'info')
          return false;
        }
      } 
    }
    // User or token is missing, no permissions
    showToast('Access Denied', 'info')
    return false;
  };

  return (
    hasPermission()? <Outlet /> : (
      <Navigate
        to="/movies"
        state={{ from: location }}
        replace
      />
    )
  );
};

export default Permissions;
